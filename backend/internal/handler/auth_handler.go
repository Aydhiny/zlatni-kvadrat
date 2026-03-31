// Package handler contains thin HTTP handlers.
// Each handler: validates input → calls service → returns standardized response.
package handler

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog"
	"github.com/zlatni-kvadrat/backend/internal/dto"
	"github.com/zlatni-kvadrat/backend/internal/service"
	"github.com/zlatni-kvadrat/backend/pkg/response"
)

// AuthHandler handles authentication endpoints.
type AuthHandler struct {
	authService service.AuthService
	validate    *validator.Validate
	log         zerolog.Logger
}

// NewAuthHandler creates a new AuthHandler.
func NewAuthHandler(authService service.AuthService, validate *validator.Validate, log zerolog.Logger) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		validate:    validate,
		log:         log.With().Str("handler", "auth").Logger(),
	}
}

// Login handles POST /api/v1/auth/login.
func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req dto.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "invalid request body")
	}
	if err := h.validate.Struct(req); err != nil {
		return response.ValidationError(c, err)
	}

	result, err := h.authService.Login(c.Context(), req)
	if err != nil {
		return response.Unauthorized(c, err.Error())
	}

	return response.OK(c, result, "login successful")
}

// Refresh handles POST /api/v1/auth/refresh.
func (h *AuthHandler) Refresh(c *fiber.Ctx) error {
	var req dto.RefreshRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "invalid request body")
	}
	if err := h.validate.Struct(req); err != nil {
		return response.ValidationError(c, err)
	}

	result, err := h.authService.RefreshToken(c.Context(), req.RefreshToken)
	if err != nil {
		return response.Unauthorized(c, "invalid or expired refresh token")
	}

	return response.OK(c, result, "token refreshed")
}

// Logout handles POST /api/v1/auth/logout.
// Currently stateless — client discards tokens. Can be extended with a token blocklist.
func (h *AuthHandler) Logout(c *fiber.Ctx) error {
	// Note: with stateless JWT, logout is handled client-side by discarding tokens.
	// To implement server-side invalidation, add a token blocklist in Redis.
	return response.OK(c, nil, "logged out successfully")
}
