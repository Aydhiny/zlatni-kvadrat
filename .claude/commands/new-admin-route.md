Scaffold a complete new admin CRUD resource from backend to frontend.

Provide the resource name (e.g. "Agent", "Document") before starting.

**Backend:**
1. Create domain model in `backend/internal/domain/<resource>.go`
2. Create migration files (up + down SQL)
3. Create repository interface + GORM implementation in `backend/internal/repository/<resource>_repo.go`
4. Create service interface + implementation in `backend/internal/service/<resource>_service.go`
5. Create DTO in `backend/internal/dto/<resource>_dto.go` with validation tags
6. Create handler in `backend/internal/handler/<resource>_handler.go`
7. Register routes in `backend/internal/router/router.go` under the admin group

**Frontend:**
1. Add TypeScript type to `frontend/src/types/index.ts`
2. Create query hooks in `frontend/src/hooks/use<Resource>.ts`
3. Create list route: `frontend/src/routes/admin/<resources>/index.tsx`
4. Create create route: `frontend/src/routes/admin/<resources>/new.tsx`
5. Create edit route: `frontend/src/routes/admin/<resources>/$id.edit.tsx`
6. Add nav item to `frontend/src/components/layout/AdminSidebar.tsx`

Follow all CLAUDE.md rules: interfaces for repos and services, no business logic in handlers, no `any` types.
