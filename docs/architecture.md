# Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Internet / CDN                            │
└───────────────────────────┬─────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                              │
     ┌────────▼────────┐           ┌─────────▼────────┐
     │  React SPA      │           │  Go/Fiber API     │
     │  (Vercel)       │◄─────────►│  (Railway/Render) │
     │  Port: 5173     │  REST/JSON │  Port: 8080       │
     └─────────────────┘           └─────────┬─────────┘
                                             │
                                   ┌─────────▼─────────┐
                                   │  PostgreSQL        │
                                   │  (Neon DB / local) │
                                   │  Port: 5432        │
                                   └────────────────────┘
```

## Backend Layer Architecture

The backend follows Clean Architecture with strict one-way dependency flow:

```
HTTP Request
     │
     ▼
┌─────────────────────────────────┐
│  Handler (internal/handler/)    │  ← Parse request, validate DTO, call service, return response
│  No business logic              │
└───────────────┬─────────────────┘
                │ calls
                ▼
┌─────────────────────────────────┐
│  Service (internal/service/)    │  ← All business logic, depends on repo interfaces
│  No direct DB access            │
└───────────────┬─────────────────┘
                │ calls interface
                ▼
┌─────────────────────────────────┐
│  Repository (internal/repo/)    │  ← DB operations ONLY, returns domain models
│  GORM implementation            │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  PostgreSQL Database            │
└─────────────────────────────────┘
```

### Why this matters
- **Testability**: Services can be unit-tested by mocking the repo interface — no DB needed.
- **Replaceability**: Swap GORM for `pgx` or `sqlc` by only touching the repo layer.
- **Clarity**: When debugging, you know exactly where to look — business rules are always in services.

## Auth Flow

```
Client                    API                     DB
  │                        │                       │
  ├──POST /auth/login──────►│                       │
  │  { email, password }   ├──SELECT user──────────►│
  │                        │◄──user record──────────┤
  │                        ├─bcrypt.Compare()       │
  │                        │                        │
  │◄─{ access_token,       │  (15min expiry)        │
  │    refresh_token }─────┤  (7day expiry)         │
  │                        │                        │
  ├──GET /admin/listings───►│                        │
  │  Authorization: Bearer  ├─validate JWT signature │
  │  <access_token>        │                        │
  │◄─listings[]────────────┤                        │
  │                        │                        │
  │  (token about to       │                        │
  │   expire)              │                        │
  ├──POST /auth/refresh────►│                        │
  │  { refresh_token }     ├─validate refresh JWT   │
  │                        ├──SELECT user──────────►│
  │◄─{ new access_token,   │◄──user record──────────┤
  │    new refresh_token }─┤  (token rotation)      │
```

**Security notes:**
- Access token: short-lived (15 min), used for API calls
- Refresh token: long-lived (7 days), used only to get new access tokens
- Both tokens are stateless JWTs — no server-side session storage
- 401 responses automatically clear auth state in the frontend Zustand store

## Request Lifecycle

```
1. Request hits Fiber app
2. Global middleware: recover() → logger() → cors() → limiter()
3. Route matched
4. Auth middleware (protected routes): parse Bearer token → validate signature → store claims in c.Locals
5. Admin middleware (admin routes): check role from c.Locals
6. Handler: parse body/query → validate DTO → call service
7. Service: business logic → call repository
8. Repository: GORM query → return domain model or error
9. Service: map result → return to handler
10. Handler: response.OK(c, data, message) → JSON envelope
```

## Frontend Architecture

```
routes/           ← TanStack Router file-based routing
  __root.tsx      ← Root layout (Header + Footer)
  index.tsx       ← Public homepage
  listings/       ← Public listing browse + detail
  admin/          ← Admin panel (guarded by adminGuard)

components/       ← Pure presentational + composed UI
  ui/             ← shadcn/ui base components
  listings/       ← Listing-specific components
  layout/         ← App shell (Header, Footer, AdminSidebar)

hooks/            ← All data fetching and mutations (TanStack Query)
store/            ← Client-only global state (Zustand) — auth tokens
lib/              ← Utilities, API client (ky), queryClient
types/            ← Shared TypeScript types
guards/           ← Route protection logic
```

## Database Schema

```sql
users
  id UUID PK
  email VARCHAR UNIQUE
  password_hash VARCHAR
  role VARCHAR DEFAULT 'admin'
  created_at, updated_at TIMESTAMPTZ

listings
  id UUID PK
  title, description, type, property_type
  price DECIMAL, currency VARCHAR
  area DECIMAL, bedrooms INT, bathrooms INT
  location, address VARCHAR
  latitude, longitude DOUBLE PRECISION
  images TEXT[]
  is_featured, is_available BOOLEAN
  created_at, updated_at TIMESTAMPTZ

inquiries
  id UUID PK
  listing_id UUID FK → listings.id (CASCADE DELETE)
  name, email, phone, message
  is_read BOOLEAN DEFAULT FALSE
  created_at TIMESTAMPTZ
```
