# API Reference

Base URL: `http://localhost:8080/api/v1` (local) / `https://api.yourproduction.com/api/v1`

All responses follow this envelope:
```json
{
  "success": true,
  "data": {},
  "message": "ok",
  "meta": { "page": 1, "per_page": 12, "total": 100 }
}
```

`meta` is only present on paginated list responses.

---

## Public Endpoints

### GET /listings

Returns a paginated list of available listings.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| type | string | `sale` or `rent` |
| property_type | string | `apartment`, `house`, `commercial`, `land` |
| min_price | number | Minimum price (EUR) |
| max_price | number | Maximum price (EUR) |
| location | string | City/area (partial match) |
| page | integer | Page number (default: 1) |
| per_page | integer | Results per page (default: 12, max: 100) |

```bash
curl "http://localhost:8080/api/v1/listings?type=sale&location=Sarajevo&page=1&per_page=6"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Luxury Penthouse in Stari Grad",
      "type": "sale",
      "property_type": "apartment",
      "price": 450000,
      "currency": "EUR",
      "area": 120,
      "bedrooms": 3,
      "bathrooms": 2,
      "location": "Sarajevo",
      "images": ["https://..."],
      "is_featured": true,
      "is_available": true,
      "created_at": "2026-01-15T10:00:00Z"
    }
  ],
  "message": "ok",
  "meta": { "page": 1, "per_page": 6, "total": 42 }
}
```

---

### GET /listings/featured

Returns up to 12 featured, available listings.

```bash
curl "http://localhost:8080/api/v1/listings/featured"
```

---

### GET /listings/:id

Returns a single listing by UUID.

```bash
curl "http://localhost:8080/api/v1/listings/123e4567-e89b-12d3-a456-426614174000"
```

**404 response:**
```json
{ "success": false, "message": "listing not found" }
```

---

### POST /inquiries

Submit an inquiry for a listing.

```bash
curl -X POST "http://localhost:8080/api/v1/inquiries" \
  -H "Content-Type: application/json" \
  -d '{
    "listing_id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+387 61 234 567",
    "message": "I am interested in viewing this property."
  }'
```

---

## Auth Endpoints

### POST /auth/login

```bash
curl -X POST "http://localhost:8080/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{ "email": "admin@zlatnikvadrát.ba", "password": "changeme123" }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "expires_in": 900
  },
  "message": "login successful"
}
```

### POST /auth/refresh

```bash
curl -X POST "http://localhost:8080/api/v1/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{ "refresh_token": "eyJ..." }'
```

### POST /auth/logout

```bash
curl -X POST "http://localhost:8080/api/v1/auth/logout" \
  -H "Authorization: Bearer eyJ..."
```

---

## Admin Endpoints

All admin endpoints require: `Authorization: Bearer <access_token>`

### POST /admin/listings

```bash
curl -X POST "http://localhost:8080/api/v1/admin/listings" \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Modern Apartment in Novo Sarajevo",
    "type": "sale",
    "property_type": "apartment",
    "price": 180000,
    "currency": "EUR",
    "area": 65,
    "bedrooms": 2,
    "bathrooms": 1,
    "location": "Sarajevo",
    "is_featured": false
  }'
```

### PUT /admin/listings/:id

Update any subset of listing fields.

```bash
curl -X PUT "http://localhost:8080/api/v1/admin/listings/<id>" \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{ "price": 175000, "is_featured": true }'
```

### DELETE /admin/listings/:id

```bash
curl -X DELETE "http://localhost:8080/api/v1/admin/listings/<id>" \
  -H "Authorization: Bearer eyJ..."
```

### POST /admin/listings/:id/images

Add image URLs to a listing (after uploading to Cloudinary or similar).

```bash
curl -X POST "http://localhost:8080/api/v1/admin/listings/<id>/images" \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{ "urls": ["https://res.cloudinary.com/your-cloud/image/upload/v1/..."] }'
```

### GET /admin/inquiries

```bash
curl "http://localhost:8080/api/v1/admin/inquiries" \
  -H "Authorization: Bearer eyJ..."
```

### PATCH /admin/inquiries/:id/read

```bash
curl -X PATCH "http://localhost:8080/api/v1/admin/inquiries/<id>/read" \
  -H "Authorization: Bearer eyJ..."
```

---

## Error Codes

| HTTP Status | Meaning |
|-------------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (malformed body) |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (insufficient role) |
| 404 | Not Found |
| 422 | Validation Error (field errors returned in `errors` array) |
| 500 | Internal Server Error |

**Validation error response:**
```json
{
  "success": false,
  "message": "validation failed",
  "errors": [
    { "field": "Price", "message": "gt" },
    { "field": "Type", "message": "oneof" }
  ]
}
```
