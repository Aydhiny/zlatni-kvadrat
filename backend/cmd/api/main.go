// Package main is the entry point for the Zlatni Kvadrat API server.
// It wires together all application dependencies and starts the HTTP server.
package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/zlatni-kvadrat/backend/internal/config"
	"github.com/zlatni-kvadrat/backend/internal/database"
	"github.com/zlatni-kvadrat/backend/internal/handler"
	"github.com/zlatni-kvadrat/backend/internal/middleware"
	"github.com/zlatni-kvadrat/backend/internal/repository"
	"github.com/zlatni-kvadrat/backend/internal/router"
	"github.com/zlatni-kvadrat/backend/internal/service"
	"github.com/zlatni-kvadrat/backend/pkg/logger"
	"github.com/zlatni-kvadrat/backend/pkg/validator"
)

func main() {
	// Initialize logger first so all subsequent logs are structured.
	log := logger.New()

	// Load typed configuration from environment.
	cfg, err := config.Load()
	if err != nil {
		log.Fatal().Err(err).Msg("failed to load configuration")
	}

	// Establish database connection.
	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatal().Err(err).Msg("failed to connect to database")
	}
	defer database.Close(db)

	// Wire dependencies bottom-up: repo → service → handler.
	validate := validator.New()

	listingRepo := repository.NewListingRepository(db)
	userRepo := repository.NewUserRepository(db)
	inquiryRepo := repository.NewInquiryRepository(db)

	authService := service.NewAuthService(userRepo, cfg, log)
	listingService := service.NewListingService(listingRepo, log)
	inquiryService := service.NewInquiryService(inquiryRepo, listingRepo, log)

	authHandler := handler.NewAuthHandler(authService, validate, log)
	listingHandler := handler.NewListingHandler(listingService, validate, log)
	inquiryHandler := handler.NewInquiryHandler(inquiryService, validate, log)

	authMiddleware := middleware.NewAuthMiddleware(cfg)
	adminMiddleware := middleware.NewAdminMiddleware()

	// Build and configure the Fiber application.
	app := router.New(cfg, authHandler, listingHandler, inquiryHandler, authMiddleware, adminMiddleware)

	// Graceful shutdown: wait for SIGINT or SIGTERM.
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		addr := ":" + cfg.Port
		log.Info().Str("addr", addr).Str("env", cfg.Env).Msg("starting server")
		if err := app.Listen(addr); err != nil {
			log.Fatal().Err(err).Msg("server error")
		}
	}()

	<-quit
	log.Info().Msg("shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := app.ShutdownWithContext(ctx); err != nil {
		log.Error().Err(err).Msg("server forced to shutdown")
	}

	log.Info().Msg("server exited cleanly")
}
