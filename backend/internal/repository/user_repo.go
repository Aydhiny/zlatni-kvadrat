// Package repository provides database access implementations.
// All methods in this package MUST only perform DB operations — no business logic.
package repository

import (
	"context"
	"fmt"

	"github.com/zlatni-kvadrat/backend/internal/domain"
	"gorm.io/gorm"
)

// UserRepository defines the contract for user data access.
type UserRepository interface {
	FindByEmail(ctx context.Context, email string) (*domain.User, error)
	FindByID(ctx context.Context, id string) (*domain.User, error)
	Create(ctx context.Context, user *domain.User) error
}

type userRepository struct {
	db *gorm.DB
}

// NewUserRepository creates a new UserRepository backed by the provided GORM DB.
func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

// FindByEmail retrieves a user by their email address.
func (r *userRepository) FindByEmail(ctx context.Context, email string) (*domain.User, error) {
	var user domain.User
	result := r.db.WithContext(ctx).Where("email = ?", email).First(&user)
	if result.Error != nil {
		return nil, fmt.Errorf("finding user by email: %w", result.Error)
	}
	return &user, nil
}

// FindByID retrieves a user by their UUID.
func (r *userRepository) FindByID(ctx context.Context, id string) (*domain.User, error) {
	var user domain.User
	result := r.db.WithContext(ctx).Where("id = ?", id).First(&user)
	if result.Error != nil {
		return nil, fmt.Errorf("finding user by id: %w", result.Error)
	}
	return &user, nil
}

// Create persists a new user to the database.
func (r *userRepository) Create(ctx context.Context, user *domain.User) error {
	result := r.db.WithContext(ctx).Create(user)
	if result.Error != nil {
		return fmt.Errorf("creating user: %w", result.Error)
	}
	return nil
}
