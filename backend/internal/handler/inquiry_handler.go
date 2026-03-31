package handler

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog"
	"github.com/zlatni-kvadrat/backend/internal/dto"
	"github.com/zlatni-kvadrat/backend/internal/service"
	"github.com/zlatni-kvadrat/backend/pkg/response"
)

// InquiryHandler handles inquiry-related HTTP endpoints.
type InquiryHandler struct {
	inquiryService service.InquiryService
	validate       *validator.Validate
	log            zerolog.Logger
}

// NewInquiryHandler creates a new InquiryHandler.
func NewInquiryHandler(inquiryService service.InquiryService, validate *validator.Validate, log zerolog.Logger) *InquiryHandler {
	return &InquiryHandler{
		inquiryService: inquiryService,
		validate:       validate,
		log:            log.With().Str("handler", "inquiry").Logger(),
	}
}

// Submit handles POST /api/v1/inquiries.
func (h *InquiryHandler) Submit(c *fiber.Ctx) error {
	var req dto.InquiryRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "invalid request body")
	}
	if err := h.validate.Struct(req); err != nil {
		return response.ValidationError(c, err)
	}

	inquiry, err := h.inquiryService.Submit(c.Context(), req)
	if err != nil {
		if err.Error() == "listing not found" {
			return response.NotFound(c, "listing not found")
		}
		return response.InternalError(c, "failed to submit inquiry")
	}

	return response.Created(c, inquiry, "inquiry submitted")
}

// List handles GET /api/v1/admin/inquiries.
func (h *InquiryHandler) List(c *fiber.Ctx) error {
	inquiries, err := h.inquiryService.List(c.Context())
	if err != nil {
		return response.InternalError(c, "failed to retrieve inquiries")
	}
	return response.OK(c, inquiries, "ok")
}

// MarkAsRead handles PATCH /api/v1/admin/inquiries/:id/read.
func (h *InquiryHandler) MarkAsRead(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := h.inquiryService.MarkAsRead(c.Context(), id); err != nil {
		return response.InternalError(c, "failed to mark inquiry as read")
	}
	return response.OK(c, nil, "inquiry marked as read")
}
