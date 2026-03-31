// Package config provides typed application configuration loaded from environment variables.
// Always use this package instead of accessing os.Getenv directly.
package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// Config holds all application configuration values.
// Fields are loaded once at startup and passed via dependency injection.
type Config struct {
	DatabaseURL      string
	JWTSecret        string
	JWTRefreshSecret string
	CloudinaryURL    string
	FrontendURL      string
	Port             string
	Env              string
}

// Load reads configuration from the .env file (if present) and environment variables.
// Returns an error if any required fields are missing.
func Load() (*Config, error) {
	// Load .env file if it exists — ignore error in production where env vars are injected directly.
	_ = godotenv.Load()

	cfg := &Config{
		DatabaseURL:      os.Getenv("DATABASE_URL"),
		JWTSecret:        os.Getenv("JWT_SECRET"),
		JWTRefreshSecret: os.Getenv("JWT_REFRESH_SECRET"),
		CloudinaryURL:    os.Getenv("CLOUDINARY_URL"),
		FrontendURL:      getEnvOrDefault("FRONTEND_URL", "http://localhost:5173"),
		Port:             getEnvOrDefault("PORT", "8080"),
		Env:              getEnvOrDefault("ENV", "development"),
	}

	if err := cfg.validate(); err != nil {
		return nil, err
	}

	return cfg, nil
}

// validate checks that all required configuration fields are non-empty.
func (c *Config) validate() error {
	required := map[string]string{
		"DATABASE_URL":       c.DatabaseURL,
		"JWT_SECRET":         c.JWTSecret,
		"JWT_REFRESH_SECRET": c.JWTRefreshSecret,
	}

	for name, val := range required {
		if val == "" {
			return fmt.Errorf("required environment variable %s is not set", name)
		}
	}

	return nil
}

// IsProduction returns true when running in the production environment.
func (c *Config) IsProduction() bool {
	return c.Env == "production"
}

func getEnvOrDefault(key, defaultVal string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return defaultVal
}
