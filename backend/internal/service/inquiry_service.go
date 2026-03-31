package service

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/rs/zerolog"
	"github.com/zlatni-kvadrat/backend/internal/domain"
	"github.com/zlatni-kvadrat/backend/internal/dto"
	"github.com/zlatni-kvadrat/backend/internal/repository"
)

// InquiryService defines operations for managing property inquiries.
type InquiryService interface {
	Submit(ctx context.Context, req dto.InquiryRequest) (*domain.Inquiry, error)
	List(ctx context.Context) ([]*domain.Inquiry, error)
	MarkAsRead(ctx context.Context, id string) error
}

type inquiryService struct {
	inquiryRepo repository.InquiryRepository
	listingRepo repository.ListingRepository
	log         zerolog.Logger
}

// NewInquiryService creates a new InquiryService.
func NewInquiryService(inquiryRepo repository.InquiryRepository, listingRepo repository.ListingRepository, log zerolog.Logger) InquiryService {
	return &inquiryService{
		inquiryRepo: inquiryRepo,
		listingRepo: listingRepo,
		log:         log.With().Str("service", "inquiry").Logger(),
	}
}

// Submit validates the listing exists and persists a new inquiry.
func (s *inquiryService) Submit(ctx context.Context, req dto.InquiryRequest) (*domain.Inquiry, error) {
	// Verify the listing exists before accepting the inquiry.
	if _, err := s.listingRepo.FindByID(ctx, req.ListingID); err != nil {
		return nil, fmt.Errorf("listing not found")
	}

	listingID, err := uuid.Parse(req.ListingID)
	if err != nil {
		return nil, fmt.Errorf("invalid listing id")
	}

	inquiry := &domain.Inquiry{
		ListingID: listingID,
		Name:      req.Name,
		Email:     req.Email,
		Phone:     req.Phone,
		Message:   req.Message,
	}

	if err := s.inquiryRepo.Create(ctx, inquiry); err != nil {
		s.log.Error().Err(err).Str("listing_id", req.ListingID).Msg("failed to submit inquiry")
		return nil, fmt.Errorf("submitting inquiry: %w", err)
	}

	s.log.Info().Str("inquiry_id", inquiry.ID.String()).Str("listing_id", req.ListingID).Msg("inquiry submitted")
	return inquiry, nil
}

// List retrieves all inquiries for the admin panel.
func (s *inquiryService) List(ctx context.Context) ([]*domain.Inquiry, error) {
	inquiries, err := s.inquiryRepo.List(ctx)
	if err != nil {
		s.log.Error().Err(err).Msg("failed to list inquiries")
		return nil, fmt.Errorf("retrieving inquiries: %w", err)
	}
	return inquiries, nil
}

// MarkAsRead marks an inquiry as read.
func (s *inquiryService) MarkAsRead(ctx context.Context, id string) error {
	if err := s.inquiryRepo.MarkAsRead(ctx, id); err != nil {
		s.log.Error().Err(err).Str("inquiry_id", id).Msg("failed to mark inquiry as read")
		return fmt.Errorf("marking inquiry as read: %w", err)
	}
	return nil
}
