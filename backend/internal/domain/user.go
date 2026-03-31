// Package domain contains pure business models with no infrastructure concerns.
package domain

import (
	"time"

	"github.com/google/uuid"
)

// User represents an authenticated admin user of the platform.
// Currently only the 'admin' role is supported.
type User struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Email        string    `gorm:"uniqueIndex;not null"                           json:"email"`
	PasswordHash string    `gorm:"not null"                                       json:"-"` // never sent to clients
	Role         string    `gorm:"default:'admin'"                                json:"role"`
	CreatedAt    time.Time `                                                      json:"created_at"`
	UpdatedAt    time.Time `                                                      json:"updated_at"`
}

// TableName returns the PostgreSQL table name for GORM.
func (User) TableName() string {
	return "users"
}
