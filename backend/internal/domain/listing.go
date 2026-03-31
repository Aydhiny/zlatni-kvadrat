package domain

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

// ListingType represents whether a property is for sale or rent.
type ListingType string

const (
	ListingTypeSale ListingType = "sale"
	ListingTypeRent ListingType = "rent"
)

// PropertyType categorizes the kind of property.
type PropertyType string

const (
	PropertyTypeApartment  PropertyType = "apartment"
	PropertyTypeHouse      PropertyType = "house"
	PropertyTypeCommercial PropertyType = "commercial"
	PropertyTypeLand       PropertyType = "land"
)

// Listing represents a real estate property listing.
type Listing struct {
	ID           uuid.UUID      `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Title        string         `gorm:"not null"                                       json:"title"`
	Description  string         `gorm:"type:text"                                      json:"description"`
	Type         ListingType    `gorm:"not null"                                       json:"type"`
	PropertyType PropertyType   `gorm:"not null"                                       json:"property_type"`
	Price        float64        `gorm:"not null"                                       json:"price"`
	Currency     string         `gorm:"default:'EUR'"                                  json:"currency"`
	Area         float64        `                                                      json:"area"`
	Bedrooms     int            `                                                      json:"bedrooms"`
	Bathrooms    int            `                                                      json:"bathrooms"`
	Location     string         `                                                      json:"location"`
	Address      string         `                                                      json:"address"`
	Latitude     *float64       `                                                      json:"latitude"`
	Longitude    *float64       `                                                      json:"longitude"`
	Images       pq.StringArray `gorm:"type:text[]"                                    json:"images"`
	IsFeatured   bool           `gorm:"default:false"                                  json:"is_featured"`
	IsAvailable  bool           `gorm:"default:true"                                   json:"is_available"`
	CreatedAt    time.Time      `                                                      json:"created_at"`
	UpdatedAt    time.Time      `                                                      json:"updated_at"`
}

// TableName returns the PostgreSQL table name for GORM.
func (Listing) TableName() string {
	return "listings"
}
