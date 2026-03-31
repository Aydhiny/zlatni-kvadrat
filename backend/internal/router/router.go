// Package router registers all application routes with the Fiber app.
package router

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	fiberlog "github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/zlatni-kvadrat/backend/internal/config"
	"github.com/zlatni-kvadrat/backend/internal/handler"
	"github.com/zlatni-kvadrat/backend/internal/middleware"
)

// New creates and configures a Fiber application with all routes registered.
func New(
	cfg *config.Config,
	authHandler *handler.AuthHandler,
	listingHandler *handler.ListingHandler,
	inquiryHandler *handler.InquiryHandler,
	authMiddleware *middleware.AuthMiddleware,
	adminMiddleware *middleware.AdminMiddleware,
) *fiber.App {
	app := fiber.New(fiber.Config{
		AppName:      "Zlatni Kvadrat API",
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  120 * time.Second,
	})

	// Global middleware.
	app.Use(recover.New())
	app.Use(fiberlog.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.FrontendURL, // Set FRONTEND_URL env var in production.
		AllowMethods:     "GET,POST,PUT,PATCH,DELETE,OPTIONS",
		AllowHeaders:     "Origin, Content-Type, Authorization",
		AllowCredentials: false,
	}))

	// Rate limiting: 100 requests per minute per IP.
	app.Use(limiter.New(limiter.Config{
		Max:        100,
		Expiration: 1 * time.Minute,
	}))

	// Health check.
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	api := app.Group("/api/v1")

	// Public listing routes.
	listings := api.Group("/listings")
	listings.Get("/", listingHandler.List)
	listings.Get("/featured", listingHandler.ListFeatured)
	listings.Get("/:id", listingHandler.GetByID)

	// Public inquiry route.
	api.Post("/inquiries", inquiryHandler.Submit)

	// Auth routes.
	auth := api.Group("/auth")
	auth.Post("/login", authHandler.Login)
	auth.Post("/refresh", authHandler.Refresh)
	auth.Post("/logout", authHandler.Logout)

	// Admin routes (JWT + admin role required).
	admin := api.Group("/admin", authMiddleware.Protect, adminMiddleware.RequireAdmin)

	adminListings := admin.Group("/listings")
	adminListings.Get("/", listingHandler.List)
	adminListings.Post("/", listingHandler.Create)
	adminListings.Put("/:id", listingHandler.Update)
	adminListings.Delete("/:id", listingHandler.Delete)
	adminListings.Post("/:id/images", listingHandler.UploadImages)

	adminInquiries := admin.Group("/inquiries")
	adminInquiries.Get("/", inquiryHandler.List)
	adminInquiries.Patch("/:id/read", inquiryHandler.MarkAsRead)

	return app
}
