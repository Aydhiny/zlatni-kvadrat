package middleware

import (
	"github.com/gofiber/fiber/v2"
	"github.com/zlatni-kvadrat/backend/pkg/response"
)

// AdminMiddleware enforces that the authenticated user has the 'admin' role.
type AdminMiddleware struct{}

// NewAdminMiddleware creates a new AdminMiddleware.
func NewAdminMiddleware() *AdminMiddleware {
	return &AdminMiddleware{}
}

// RequireAdmin is a Fiber middleware that rejects requests from non-admin users.
// Must be used after AuthMiddleware.Protect.
func (m *AdminMiddleware) RequireAdmin(c *fiber.Ctx) error {
	role, ok := c.Locals("user_role").(string)
	if !ok || role != "admin" {
		return response.Forbidden(c, "admin access required")
	}
	return c.Next()
}
