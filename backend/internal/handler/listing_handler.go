package handler

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog"
	"github.com/zlatni-kvadrat/backend/internal/dto"
	"github.com/zlatni-kvadrat/backend/internal/service"
	"github.com/zlatni-kvadrat/backend/pkg/response"
)

// ListingHandler handles listing-related HTTP endpoints.
type ListingHandler struct {
	listingService service.ListingService
	validate       *validator.Validate
	log            zerolog.Logger
}

// NewListingHandler creates a new ListingHandler.
func NewListingHandler(listingService service.ListingService, validate *validator.Validate, log zerolog.Logger) *ListingHandler {
	return &ListingHandler{
		listingService: listingService,
		validate:       validate,
		log:            log.With().Str("handler", "listing").Logger(),
	}
}

// List handles GET /api/v1/listings.
func (h *ListingHandler) List(c *fiber.Ctx) error {
	var filters dto.ListingFilters
	if err := c.QueryParser(&filters); err != nil {
		return response.BadRequest(c, "invalid query parameters")
	}

	result, err := h.listingService.List(c.Context(), filters)
	if err != nil {
		return response.InternalError(c, "failed to retrieve listings")
	}

	return response.Paginated(c, result.Listings, result.Total, result.Page, result.PerPage)
}

// ListFeatured handles GET /api/v1/listings/featured.
func (h *ListingHandler) ListFeatured(c *fiber.Ctx) error {
	listings, err := h.listingService.ListFeatured(c.Context())
	if err != nil {
		return response.InternalError(c, "failed to retrieve featured listings")
	}
	return response.OK(c, listings, "ok")
}

// GetByID handles GET /api/v1/listings/:id.
func (h *ListingHandler) GetByID(c *fiber.Ctx) error {
	id := c.Params("id")
	listing, err := h.listingService.GetByID(c.Context(), id)
	if err != nil {
		return response.NotFound(c, "listing not found")
	}
	return response.OK(c, listing, "ok")
}

// Create handles POST /api/v1/admin/listings.
func (h *ListingHandler) Create(c *fiber.Ctx) error {
	var req dto.CreateListingRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "invalid request body")
	}
	if err := h.validate.Struct(req); err != nil {
		return response.ValidationError(c, err)
	}

	listing, err := h.listingService.Create(c.Context(), req)
	if err != nil {
		h.log.Error().
			Err(err).
			Str("title", req.Title).
			Str("type", req.Type).
			Str("property_type", req.PropertyType).
			Str("currency", req.Currency).
			Msg("failed to create listing")
		return response.InternalError(c, "failed to create listing")
	}

	return response.Created(c, listing, "listing created")
}

// Update handles PUT /api/v1/admin/listings/:id.
func (h *ListingHandler) Update(c *fiber.Ctx) error {
	id := c.Params("id")

	var req dto.UpdateListingRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "invalid request body")
	}
	if err := h.validate.Struct(req); err != nil {
		return response.ValidationError(c, err)
	}

	listing, err := h.listingService.Update(c.Context(), id, req)
	if err != nil {
		return response.NotFound(c, err.Error())
	}

	return response.OK(c, listing, "listing updated")
}

// Delete handles DELETE /api/v1/admin/listings/:id.
func (h *ListingHandler) Delete(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := h.listingService.Delete(c.Context(), id); err != nil {
		return response.InternalError(c, "failed to delete listing")
	}
	return response.OK(c, nil, "listing deleted")
}

// UploadImages handles POST /api/v1/admin/listings/:id/images.
func (h *ListingHandler) UploadImages(c *fiber.Ctx) error {
	id := c.Params("id")

	// TODO: Integrate Cloudinary SDK here.
	// For now, accept a JSON array of pre-uploaded image URLs.
	var body struct {
		URLs []string `json:"urls" validate:"required,min=1,dive,url"`
	}
	if err := c.BodyParser(&body); err != nil {
		return response.BadRequest(c, "invalid request body")
	}
	if err := h.validate.Struct(body); err != nil {
		return response.ValidationError(c, err)
	}

	listing, err := h.listingService.AddImages(c.Context(), id, body.URLs)
	if err != nil {
		return response.InternalError(c, "failed to upload images")
	}

	return response.OK(c, listing, "images uploaded")
}
