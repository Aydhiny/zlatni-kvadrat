# AGENTS.md — AI Assistant Instructions

## Project Overview
Zlatni Kvadrat is a premium real estate listing and rental platform serving the Balkan market. It allows admins to manage property listings (sale/rent) and public users to browse properties and submit inquiries.

## Architecture Summary
- **Backend**: Go 1.22+ with Fiber v2, clean layered architecture (handler → service → repository → DB)
- **Frontend**: React 19 + TypeScript, Vite, TanStack Router + Query, shadcn/ui, Tailwind CSS v4
- **Infrastructure**: Docker (local), Neon DB (prod Postgres), Vercel (frontend), Railway/Render (backend), GitHub Actions CI/CD

## Repository Structure
```
/
├── .github/workflows/     ← CI/CD pipelines
├── backend/               ← Go/Fiber API
├── frontend/              ← React/Vite SPA
├── docs/                  ← Architecture, API, Deployment docs
├── docker-compose.yml     ← Local dev environment
├── AGENTS.md              ← This file
└── README.md
```

## Backend Development Rules
- NEVER use `os.Getenv()` directly — always use `internal/config` typed config struct
- NEVER use GORM AutoMigrate in production — use `golang-migrate` SQL files only
- ALWAYS validate request DTOs using `go-playground/validator/v10`
- ALWAYS return standardized responses using `pkg/response` helpers
- **Repository layer**: DB operations ONLY — no business logic, no HTTP concerns
- **Service layer**: All business logic — no direct DB calls, depends on repo interfaces
- **Handler layer**: Thin — validate input, call service, return response
- Use `zerolog` for all logging — no `fmt.Println` in production code
- ALL errors must be logged with context (listing ID, user ID, request ID, etc.)
- Write table-driven tests for all service layer functions
- ALL public Go functions must have doc comments
- Use `uuid` for all IDs — never integer auto-increment
- Max ~200 lines per file — split into multiple files if larger

## Frontend Development Rules
- ALWAYS use TanStack Query for server state — no `useState` for async data
- ALWAYS use React Hook Form + Zod for all forms — no uncontrolled inputs
- ALWAYS use the `cn()` utility from `lib/utils.ts` for conditional classnames
- Use shadcn/ui components as the base layer — extend, never re-implement
- All API calls go through `lib/api.ts` ky instance — never raw `fetch`
- Auth token stored in Zustand store + localStorage (with expiry check on init)
- Route guards implemented via TanStack Router `beforeLoad` hooks
- NEVER put business logic in components — extract to custom hooks in `hooks/`
- All shared types must live in `src/types/index.ts` or co-located `.types.ts` files
- Do NOT use `any` type — proper TypeScript types everywhere
- All React components must have explicit prop types defined

## Git Workflow
- Branch naming: `feat/`, `fix/`, `chore/`, `docs/`
- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- PRs required for all changes to `main` (even solo dev)
- Squash merge preferred to keep history clean

## Environment Variables
### Backend (backend/.env)
- `DATABASE_URL` — Postgres connection string
- `JWT_SECRET` — Access token signing secret (min 32 chars)
- `JWT_REFRESH_SECRET` — Refresh token signing secret (min 32 chars)
- `CLOUDINARY_URL` — Image upload service URL
- `PORT` — Server port (default: 8080)
- `ENV` — `development` | `production`

### Frontend (frontend/.env)
- `VITE_API_URL` — Backend API base URL
- `VITE_APP_NAME` — App display name

## CI/CD
- Every push/PR triggers lint + build check
- Push to `main` triggers deployment: backend → Railway/Render, frontend → Vercel
- Never hardcode secrets — use GitHub Actions Secrets
- Workflow files live in `.github/workflows/`

## Database
- **Local**: Docker Postgres (see `docker-compose.yml`)
- **Production**: Neon DB (serverless Postgres)
- **Run migrations**: `make migrate-up`
- **Rollback**: `make migrate-down`
- **Create new migration**: `make migrate-create name=<migration_name>`
- Migration files live in `backend/internal/database/migrations/`

## Common Commands
```bash
# Backend
make run              # Start dev server
make build            # Build binary
make test             # Run all tests with race detector
make lint             # Run golangci-lint
make migrate-up       # Apply all pending migrations
make migrate-down     # Rollback last migration
make migrate-create   # Create new migration file pair
make seed             # Seed default admin user
make docker-up        # Start all Docker services
make docker-down      # Stop all Docker services

# Frontend (run from frontend/)
npm run dev           # Start Vite dev server
npm run build         # Production build
npm run typecheck     # Run tsc --noEmit
npm run lint          # ESLint
```

## Testing Strategy
- **Backend**: Table-driven unit tests for service layer; integration tests for handlers using `httptest`
- **Frontend**: Vitest for hooks and utility functions; no snapshot tests
- **E2E**: Playwright config scaffolded in `frontend/e2e/` — tests not required in boilerplate
- Test files co-located with source: `listing_service_test.go` next to `listing_service.go`

## Architecture Patterns
- Clean Architecture / Layered Architecture on backend
- Repository Pattern for data access abstraction
- DTO pattern for request/response separation from domain models
- Dependency injection via constructor functions (no global state)
