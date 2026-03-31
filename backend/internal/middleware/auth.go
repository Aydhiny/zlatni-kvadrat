// Package middleware provides Fiber middleware for authentication and authorization.
package middleware

import (
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/zlatni-kvadrat/backend/internal/config"
	"github.com/zlatni-kvadrat/backend/pkg/response"
)

// AuthMiddleware validates JWT access tokens on protected routes.
type AuthMiddleware struct {
	cfg *config.Config
}

// NewAuthMiddleware creates a new AuthMiddleware.
func NewAuthMiddleware(cfg *config.Config) *AuthMiddleware {
	return &AuthMiddleware{cfg: cfg}
}

// Protect is a Fiber middleware that validates the Bearer JWT in the Authorization header.
// On success, it stores user claims in c.Locals for downstream handlers.
func (m *AuthMiddleware) Protect(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return response.Unauthorized(c, "missing authorization header")
	}

	parts := strings.SplitN(authHeader, " ", 2)
	if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
		return response.Unauthorized(c, "invalid authorization header format")
	}

	tokenString := parts[1]
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return []byte(m.cfg.JWTSecret), nil
	})
	if err != nil || !token.Valid {
		return response.Unauthorized(c, "invalid or expired token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return response.Unauthorized(c, "invalid token claims")
	}

	// Store claims in context locals for downstream use.
	c.Locals("user_id", claims["user_id"])
	c.Locals("user_email", claims["email"])
	c.Locals("user_role", claims["role"])

	return c.Next()
}
