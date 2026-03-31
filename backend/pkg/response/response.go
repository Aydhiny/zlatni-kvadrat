// Package response provides standardized HTTP response helpers for Fiber handlers.
// All API responses follow the envelope: { success, data, message, meta }.
package response

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

// Envelope is the standard API response wrapper.
type Envelope struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data"`
	Message string      `json:"message"`
	Meta    *Meta       `json:"meta,omitempty"`
}

// Meta carries pagination metadata for list responses.
type Meta struct {
	Page    int   `json:"page"`
	PerPage int   `json:"per_page"`
	Total   int64 `json:"total"`
}

// OK sends a 200 response with data.
func OK(c *fiber.Ctx, data interface{}, message string) error {
	return c.Status(fiber.StatusOK).JSON(Envelope{
		Success: true,
		Data:    data,
		Message: message,
	})
}

// Created sends a 201 response.
func Created(c *fiber.Ctx, data interface{}, message string) error {
	return c.Status(fiber.StatusCreated).JSON(Envelope{
		Success: true,
		Data:    data,
		Message: message,
	})
}

// Paginated sends a 200 response with pagination metadata.
func Paginated(c *fiber.Ctx, data interface{}, total int64, page, perPage int) error {
	return c.Status(fiber.StatusOK).JSON(Envelope{
		Success: true,
		Data:    data,
		Message: "ok",
		Meta: &Meta{
			Page:    page,
			PerPage: perPage,
			Total:   total,
		},
	})
}

// BadRequest sends a 400 response.
func BadRequest(c *fiber.Ctx, message string) error {
	return c.Status(fiber.StatusBadRequest).JSON(Envelope{
		Success: false,
		Message: message,
	})
}

// ValidationError sends a 422 response with field-level validation errors.
func ValidationError(c *fiber.Ctx, err error) error {
	var errors []fiber.Map
	if ve, ok := err.(validator.ValidationErrors); ok {
		for _, fe := range ve {
			errors = append(errors, fiber.Map{
				"field":   fe.Field(),
				"message": fe.Tag(),
			})
		}
	}
	return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
		"success": false,
		"message": "validation failed",
		"errors":  errors,
	})
}

// Unauthorized sends a 401 response.
func Unauthorized(c *fiber.Ctx, message string) error {
	return c.Status(fiber.StatusUnauthorized).JSON(Envelope{
		Success: false,
		Message: message,
	})
}

// Forbidden sends a 403 response.
func Forbidden(c *fiber.Ctx, message string) error {
	return c.Status(fiber.StatusForbidden).JSON(Envelope{
		Success: false,
		Message: message,
	})
}

// NotFound sends a 404 response.
func NotFound(c *fiber.Ctx, message string) error {
	return c.Status(fiber.StatusNotFound).JSON(Envelope{
		Success: false,
		Message: message,
	})
}

// InternalError sends a 500 response. The message is generic to avoid leaking internals.
func InternalError(c *fiber.Ctx, message string) error {
	return c.Status(fiber.StatusInternalServerError).JSON(Envelope{
		Success: false,
		Message: message,
	})
}
