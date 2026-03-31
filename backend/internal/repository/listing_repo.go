package repository

import (
	"context"
	"fmt"

	"github.com/zlatni-kvadrat/backend/internal/domain"
	"github.com/zlatni-kvadrat/backend/internal/dto"
	"gorm.io/gorm"
)

// ListingResult wraps a paginated slice of listings with total count metadata.
type ListingResult struct {
	Listings []*domain.Listing
	Total    int64
	Page     int
	PerPage  int
}

// ListingRepository defines the contract for listing data access.
type ListingRepository interface {
	List(ctx context.Context, filters dto.ListingFilters) (*ListingResult, error)
	ListFeatured(ctx context.Context) ([]*domain.Listing, error)
	FindByID(ctx context.Context, id string) (*domain.Listing, error)
	Create(ctx context.Context, listing *domain.Listing) error
	Update(ctx context.Context, listing *domain.Listing) error
	Delete(ctx context.Context, id string) error
	AddImages(ctx context.Context, id string, urls []string) error
}

type listingRepository struct {
	db *gorm.DB
}

// NewListingRepository creates a new ListingRepository backed by the provided GORM DB.
func NewListingRepository(db *gorm.DB) ListingRepository {
	return &listingRepository{db: db}
}

// List retrieves a paginated, filtered list of available listings.
func (r *listingRepository) List(ctx context.Context, filters dto.ListingFilters) (*ListingResult, error) {
	query := r.db.WithContext(ctx).Model(&domain.Listing{}).Where("is_available = ?", true)

	if filters.Type != "" {
		query = query.Where("type = ?", filters.Type)
	}
	if filters.PropertyType != "" {
		query = query.Where("property_type = ?", filters.PropertyType)
	}
	if filters.MinPrice > 0 {
		query = query.Where("price >= ?", filters.MinPrice)
	}
	if filters.MaxPrice > 0 {
		query = query.Where("price <= ?", filters.MaxPrice)
	}
	if filters.Location != "" {
		query = query.Where("location ILIKE ?", "%"+filters.Location+"%")
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, fmt.Errorf("counting listings: %w", err)
	}

	page := filters.Page
	if page < 1 {
		page = 1
	}
	perPage := filters.PerPage
	if perPage < 1 || perPage > 100 {
		perPage = 12
	}

	var listings []*domain.Listing
	offset := (page - 1) * perPage
	if err := query.Offset(offset).Limit(perPage).Order("created_at DESC").Find(&listings).Error; err != nil {
		return nil, fmt.Errorf("listing listings: %w", err)
	}

	return &ListingResult{
		Listings: listings,
		Total:    total,
		Page:     page,
		PerPage:  perPage,
	}, nil
}

// ListFeatured retrieves all currently featured and available listings.
func (r *listingRepository) ListFeatured(ctx context.Context) ([]*domain.Listing, error) {
	var listings []*domain.Listing
	if err := r.db.WithContext(ctx).
		Where("is_featured = ? AND is_available = ?", true, true).
		Order("created_at DESC").
		Limit(12).
		Find(&listings).Error; err != nil {
		return nil, fmt.Errorf("listing featured listings: %w", err)
	}
	return listings, nil
}

// FindByID retrieves a single listing by its UUID.
func (r *listingRepository) FindByID(ctx context.Context, id string) (*domain.Listing, error) {
	var listing domain.Listing
	if err := r.db.WithContext(ctx).Where("id = ?", id).First(&listing).Error; err != nil {
		return nil, fmt.Errorf("finding listing by id: %w", err)
	}
	return &listing, nil
}

// Create persists a new listing to the database.
func (r *listingRepository) Create(ctx context.Context, listing *domain.Listing) error {
	if err := r.db.WithContext(ctx).Create(listing).Error; err != nil {
		return fmt.Errorf("creating listing: %w", err)
	}
	return nil
}

// Update saves changes to an existing listing.
func (r *listingRepository) Update(ctx context.Context, listing *domain.Listing) error {
	if err := r.db.WithContext(ctx).Save(listing).Error; err != nil {
		return fmt.Errorf("updating listing: %w", err)
	}
	return nil
}

// Delete removes a listing by ID (hard delete).
func (r *listingRepository) Delete(ctx context.Context, id string) error {
	if err := r.db.WithContext(ctx).Where("id = ?", id).Delete(&domain.Listing{}).Error; err != nil {
		return fmt.Errorf("deleting listing: %w", err)
	}
	return nil
}

// AddImages appends image URLs to a listing's images array.
func (r *listingRepository) AddImages(ctx context.Context, id string, urls []string) error {
	// Use PostgreSQL array_cat to append without overwriting existing images.
	if err := r.db.WithContext(ctx).
		Exec("UPDATE listings SET images = array_cat(images, ?::text[]) WHERE id = ?", urls, id).
		Error; err != nil {
		return fmt.Errorf("adding images to listing: %w", err)
	}
	return nil
}
