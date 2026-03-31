// Package main seeds the database with a default admin user.
// Run with: go run ./cmd/seed
package main

import (
	"fmt"
	"os"

	"github.com/zlatni-kvadrat/backend/internal/config"
	"github.com/zlatni-kvadrat/backend/internal/database"
	"github.com/zlatni-kvadrat/backend/pkg/logger"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func main() {
	log := logger.New()

	cfg, err := config.Load()
	if err != nil {
		log.Fatal().Err(err).Msg("failed to load config")
	}

	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatal().Err(err).Msg("failed to connect to database")
	}
	defer database.Close(db)

	if err := seedAdmin(db); err != nil {
		log.Fatal().Err(err).Msg("seed failed")
		os.Exit(1)
	}

	log.Info().Msg("seed completed successfully")
}

func seedAdmin(db *gorm.DB) error {
	email := "admin@zlatnikvadrat.ba"
	password := "changeme123"
	legacyEmails := []string{
		"admin@zlatnikvadrÃ¡t.ba",
		"admin@zlatnikvadrát.ba",
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("hashing password: %w", err)
	}

	// Fix any legacy admin email encodings and reset password.
	result := db.Exec(
		`UPDATE users SET email = ?, password_hash = ? WHERE email IN ?`,
		email, string(hash), legacyEmails,
	)
	if result.Error != nil {
		return fmt.Errorf("updating legacy admin user: %w", result.Error)
	}

	if result.RowsAffected > 0 {
		fmt.Printf("Admin user updated: %s / %s\n", email, password)
		fmt.Println("IMPORTANT: Change the password immediately after first login!")
		return nil
	}

	// Check if admin already exists.
	var count int64
	db.Table("users").Where("email = ?", email).Count(&count)
	if count > 0 {
		fmt.Println("Admin user already exists, skipping seed.")
		return nil
	}

	insert := db.Exec(
		`INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'admin')`,
		email, string(hash),
	)
	if insert.Error != nil {
		return fmt.Errorf("inserting admin user: %w", insert.Error)
	}

	fmt.Printf("Admin user created: %s / %s\n", email, password)
	fmt.Println("IMPORTANT: Change the password immediately after first login!")
	return nil
}
