package service

import (
	"context"
	"fmt"

	"github.com/rs/zerolog"
	"github.com/zlatni-kvadrat/backend/internal/domain"
	"github.com/zlatni-kvadrat/backend/internal/dto"
	"github.com/zlatni-kvadrat/backend/internal/repository"
)

// ListingService defines operations for managing property listings.
type ListingService interface {
	List(ctx context.Context, filters dto.ListingFilters) (*repository.ListingResult, error)
	ListFeatured(ctx context.Context) ([]*domain.Listing, error)
	GetByID(ctx context.Context, id string) (*domain.Listing, error)
	Create(ctx context.Context, req dto.CreateListingRequest) (*domain.Listing, error)
	Update(ctx context.Context, id string, req dto.UpdateListingRequest) (*domain.Listing, error)
	Delete(ctx context.Context, id string) error
	AddImages(ctx context.Context, id string, urls []string) (*domain.Listing, error)
}

type listingService struct {
	repo repository.ListingRepository
	log  zerolog.Logger
}

// NewListingService creates a new ListingService.
func NewListingService(repo repository.ListingRepository, log zerolog.Logger) ListingService {
	return &listingService{
		repo: repo,
		log:  log.With().Str("service", "listing").Logger(),
	}
}

// List returns a paginated list of public listings filtered by the provided criteria.
func (s *listingService) List(ctx context.Context, filters dto.ListingFilters) (*repository.ListingResult, error) {
	result, err := s.repo.List(ctx, filters)
	if err != nil {
		s.log.Error().Err(err).Interface("filters", filters).Msg("failed to list listings")
		return nil, fmt.Errorf("retrieving listings: %w", err)
	}
	return result, nil
}

// ListFeatured returns featured listings for the homepage.
func (s *listingService) ListFeatured(ctx context.Context) ([]*domain.Listing, error) {
	listings, err := s.repo.ListFeatured(ctx)
	if err != nil {
		s.log.Error().Err(err).Msg("failed to list featured listings")
		return nil, fmt.Errorf("retrieving featured listings: %w", err)
	}
	return listings, nil
}

// GetByID retrieves a single listing. Returns an error if not found.
func (s *listingService) GetByID(ctx context.Context, id string) (*domain.Listing, error) {
	listing, err := s.repo.FindByID(ctx, id)
	if err != nil {
		s.log.Error().Err(err).Str("listing_id", id).Msg("listing not found")
		return nil, fmt.Errorf("listing not found")
	}
	return listing, nil
}

// Create validates and persists a new listing.
func (s *listingService) Create(ctx context.Context, req dto.CreateListingRequest) (*domain.Listing, error) {
	listing := &domain.Listing{
		Title:        req.Title,
		Description:  req.Description,
		Type:         domain.ListingType(req.Type),
		PropertyType: domain.PropertyType(req.PropertyType),
		Price:        req.Price,
		Currency:     req.Currency,
		Area:         req.Area,
		Bedrooms:     req.Bedrooms,
		Bathrooms:    req.Bathrooms,
		Location:     req.Location,
		Address:      req.Address,
		Latitude:     req.Latitude,
		Longitude:    req.Longitude,
		IsFeatured:   req.IsFeatured,
		IsAvailable:  true,
	}
	if listing.Currency == "" {
		listing.Currency = "EUR"
	}

	if err := s.repo.Create(ctx, listing); err != nil {
		s.log.Error().Err(err).Str("title", req.Title).Msg("failed to create listing")
		return nil, fmt.Errorf("creating listing: %w", err)
	}

	s.log.Info().Str("listing_id", listing.ID.String()).Msg("listing created")
	return listing, nil
}

// Update applies changes to an existing listing.
func (s *listingService) Update(ctx context.Context, id string, req dto.UpdateListingRequest) (*domain.Listing, error) {
	listing, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("listing not found")
	}

	// Apply updates — only overwrite fields that were explicitly provided.
	if req.Title != "" {
		listing.Title = req.Title
	}
	if req.Description != "" {
		listing.Description = req.Description
	}
	if req.Type != "" {
		listing.Type = domain.ListingType(req.Type)
	}
	if req.PropertyType != "" {
		listing.PropertyType = domain.PropertyType(req.PropertyType)
	}
	if req.Price > 0 {
		listing.Price = req.Price
	}
	if req.Currency != "" {
		listing.Currency = req.Currency
	}
	if req.Area > 0 {
		listing.Area = req.Area
	}
	if req.Location != "" {
		listing.Location = req.Location
	}
	if req.Address != "" {
		listing.Address = req.Address
	}
	listing.Bedrooms = req.Bedrooms
	listing.Bathrooms = req.Bathrooms
	listing.Latitude = req.Latitude
	listing.Longitude = req.Longitude
	listing.IsFeatured = req.IsFeatured
	listing.IsAvailable = req.IsAvailable

	if err := s.repo.Update(ctx, listing); err != nil {
		s.log.Error().Err(err).Str("listing_id", id).Msg("failed to update listing")
		return nil, fmt.Errorf("updating listing: %w", err)
	}

	s.log.Info().Str("listing_id", id).Msg("listing updated")
	return listing, nil
}

// Delete removes a listing by ID.
func (s *listingService) Delete(ctx context.Context, id string) error {
	if err := s.repo.Delete(ctx, id); err != nil {
		s.log.Error().Err(err).Str("listing_id", id).Msg("failed to delete listing")
		return fmt.Errorf("deleting listing: %w", err)
	}
	s.log.Info().Str("listing_id", id).Msg("listing deleted")
	return nil
}

// AddImages appends uploaded image URLs to a listing.
func (s *listingService) AddImages(ctx context.Context, id string, urls []string) (*domain.Listing, error) {
	if err := s.repo.AddImages(ctx, id, urls); err != nil {
		s.log.Error().Err(err).Str("listing_id", id).Msg("failed to add images")
		return nil, fmt.Errorf("adding images: %w", err)
	}
	return s.repo.FindByID(ctx, id)
}
