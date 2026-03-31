package dto

// CreateListingRequest is the payload for POST /admin/listings.
type CreateListingRequest struct {
	Title        string   `json:"title"         validate:"required,min=3,max=500"`
	Description  string   `json:"description"`
	Type         string   `json:"type"          validate:"required,oneof=sale rent"`
	PropertyType string   `json:"property_type" validate:"required,oneof=apartment house commercial land"`
	Price        float64  `json:"price"         validate:"required,gt=0"`
	Currency     string   `json:"currency"      validate:"omitempty,len=3"`
	Area         float64  `json:"area"          validate:"omitempty,gt=0"`
	Bedrooms     int      `json:"bedrooms"      validate:"omitempty,min=0"`
	Bathrooms    int      `json:"bathrooms"     validate:"omitempty,min=0"`
	Location     string   `json:"location"`
	Address      string   `json:"address"`
	Latitude     *float64 `json:"latitude"      validate:"omitempty,min=-90,max=90"`
	Longitude    *float64 `json:"longitude"     validate:"omitempty,min=-180,max=180"`
	IsFeatured   bool     `json:"is_featured"`
}

// UpdateListingRequest is the payload for PUT /admin/listings/:id.
// All fields are optional — only non-zero values are applied.
type UpdateListingRequest struct {
	Title        string   `json:"title"         validate:"omitempty,min=3,max=500"`
	Description  string   `json:"description"`
	Type         string   `json:"type"          validate:"omitempty,oneof=sale rent"`
	PropertyType string   `json:"property_type" validate:"omitempty,oneof=apartment house commercial land"`
	Price        float64  `json:"price"         validate:"omitempty,gt=0"`
	Currency     string   `json:"currency"      validate:"omitempty,len=3"`
	Area         float64  `json:"area"          validate:"omitempty,gt=0"`
	Bedrooms     int      `json:"bedrooms"`
	Bathrooms    int      `json:"bathrooms"`
	Location     string   `json:"location"`
	Address      string   `json:"address"`
	Latitude     *float64 `json:"latitude"      validate:"omitempty,min=-90,max=90"`
	Longitude    *float64 `json:"longitude"     validate:"omitempty,min=-180,max=180"`
	IsFeatured   bool     `json:"is_featured"`
	IsAvailable  bool     `json:"is_available"`
}

// ListingFilters contains query parameters for the public listing list endpoint.
type ListingFilters struct {
	Type         string  `query:"type"`
	PropertyType string  `query:"property_type"`
	MinPrice     float64 `query:"min_price"`
	MaxPrice     float64 `query:"max_price"`
	Location     string  `query:"location"`
	Page         int     `query:"page"`
	PerPage      int     `query:"per_page"`
}

// InquiryRequest is the payload for POST /inquiries.
type InquiryRequest struct {
	ListingID string `json:"listing_id" validate:"required,uuid"`
	Name      string `json:"name"       validate:"required,min=2,max=255"`
	Email     string `json:"email"      validate:"required,email"`
	Phone     string `json:"phone"      validate:"omitempty,max=50"`
	Message   string `json:"message"    validate:"omitempty,max=2000"`
}
