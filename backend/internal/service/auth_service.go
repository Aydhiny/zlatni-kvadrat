// Package service contains all business logic.
// Services depend on repository interfaces — never on GORM or DB directly.
package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/rs/zerolog"
	"github.com/zlatni-kvadrat/backend/internal/config"
	"github.com/zlatni-kvadrat/backend/internal/domain"
	"github.com/zlatni-kvadrat/backend/internal/dto"
	"github.com/zlatni-kvadrat/backend/internal/repository"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// AuthService defines authentication operations.
type AuthService interface {
	Login(ctx context.Context, req dto.LoginRequest) (*dto.LoginResponse, error)
	RefreshToken(ctx context.Context, refreshToken string) (*dto.LoginResponse, error)
}

type authService struct {
	userRepo repository.UserRepository
	cfg      *config.Config
	log      zerolog.Logger
}

// NewAuthService creates a new AuthService.
func NewAuthService(userRepo repository.UserRepository, cfg *config.Config, log zerolog.Logger) AuthService {
	return &authService{
		userRepo: userRepo,
		cfg:      cfg,
		log:      log.With().Str("service", "auth").Logger(),
	}
}

// Login authenticates a user and returns an access/refresh token pair.
// Returns an error if credentials are invalid — the error message is intentionally generic
// to prevent user enumeration attacks.
func (s *authService) Login(ctx context.Context, req dto.LoginRequest) (*dto.LoginResponse, error) {
	user, err := s.userRepo.FindByEmail(ctx, req.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("invalid credentials")
		}
		s.log.Error().Err(err).Str("email", req.Email).Msg("failed to find user by email")
		return nil, fmt.Errorf("authentication failed")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, fmt.Errorf("invalid credentials")
	}

	return s.generateTokenPair(user)
}

// RefreshToken validates a refresh token and issues a new token pair.
func (s *authService) RefreshToken(ctx context.Context, refreshToken string) (*dto.LoginResponse, error) {
	claims, err := s.parseToken(refreshToken, s.cfg.JWTRefreshSecret)
	if err != nil {
		return nil, fmt.Errorf("invalid refresh token")
	}

	user, err := s.userRepo.FindByID(ctx, claims.UserID)
	if err != nil {
		s.log.Error().Err(err).Str("user_id", claims.UserID).Msg("user not found during token refresh")
		return nil, fmt.Errorf("invalid refresh token")
	}

	return s.generateTokenPair(user)
}

// generateTokenPair creates a new access + refresh token pair for the given user.
func (s *authService) generateTokenPair(user *domain.User) (*dto.LoginResponse, error) {
	accessExpiry := time.Now().Add(15 * time.Minute)
	refreshExpiry := time.Now().Add(7 * 24 * time.Hour)

	accessToken, err := s.signToken(user, accessExpiry, s.cfg.JWTSecret)
	if err != nil {
		return nil, fmt.Errorf("signing access token: %w", err)
	}

	refreshToken, err := s.signToken(user, refreshExpiry, s.cfg.JWTRefreshSecret)
	if err != nil {
		return nil, fmt.Errorf("signing refresh token: %w", err)
	}

	return &dto.LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    int64(time.Until(accessExpiry).Seconds()),
	}, nil
}

func (s *authService) signToken(user *domain.User, expiry time.Time, secret string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": user.ID.String(),
		"email":   user.Email,
		"role":    user.Role,
		"exp":     expiry.Unix(),
		"iat":     time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

func (s *authService) parseToken(tokenString, secret string) (*dto.TokenClaims, error) {
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return []byte(secret), nil
	})
	if err != nil || !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, fmt.Errorf("invalid token claims")
	}

	return &dto.TokenClaims{
		UserID: claims["user_id"].(string),
		Email:  claims["email"].(string),
		Role:   claims["role"].(string),
	}, nil
}
