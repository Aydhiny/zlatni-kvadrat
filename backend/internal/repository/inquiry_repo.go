package repository

import (
	"context"
	"fmt"

	"github.com/zlatni-kvadrat/backend/internal/domain"
	"gorm.io/gorm"
)

// InquiryRepository defines the contract for inquiry data access.
type InquiryRepository interface {
	Create(ctx context.Context, inquiry *domain.Inquiry) error
	List(ctx context.Context) ([]*domain.Inquiry, error)
	MarkAsRead(ctx context.Context, id string) error
}

type inquiryRepository struct {
	db *gorm.DB
}

// NewInquiryRepository creates a new InquiryRepository backed by the provided GORM DB.
func NewInquiryRepository(db *gorm.DB) InquiryRepository {
	return &inquiryRepository{db: db}
}

// Create persists a new inquiry.
func (r *inquiryRepository) Create(ctx context.Context, inquiry *domain.Inquiry) error {
	if err := r.db.WithContext(ctx).Create(inquiry).Error; err != nil {
		return fmt.Errorf("creating inquiry: %w", err)
	}
	return nil
}

// List retrieves all inquiries ordered by most recent first.
func (r *inquiryRepository) List(ctx context.Context) ([]*domain.Inquiry, error) {
	var inquiries []*domain.Inquiry
	if err := r.db.WithContext(ctx).Order("created_at DESC").Find(&inquiries).Error; err != nil {
		return nil, fmt.Errorf("listing inquiries: %w", err)
	}
	return inquiries, nil
}

// MarkAsRead sets is_read = true for the given inquiry ID.
func (r *inquiryRepository) MarkAsRead(ctx context.Context, id string) error {
	if err := r.db.WithContext(ctx).
		Model(&domain.Inquiry{}).
		Where("id = ?", id).
		Update("is_read", true).Error; err != nil {
		return fmt.Errorf("marking inquiry as read: %w", err)
	}
	return nil
}
