package domain

import (
	"time"

	"github.com/google/uuid"
)

// Inquiry represents a contact request submitted by a prospective buyer or renter.
type Inquiry struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	ListingID uuid.UUID `gorm:"type:uuid;not null;index"                       json:"listing_id"`
	Name      string    `gorm:"not null"                                       json:"name"`
	Email     string    `gorm:"not null"                                       json:"email"`
	Phone     string    `                                                      json:"phone"`
	Message   string    `gorm:"type:text"                                      json:"message"`
	IsRead    bool      `gorm:"default:false"                                  json:"is_read"`
	CreatedAt time.Time `                                                      json:"created_at"`
}

// TableName returns the PostgreSQL table name for GORM.
func (Inquiry) TableName() string {
	return "inquiries"
}
