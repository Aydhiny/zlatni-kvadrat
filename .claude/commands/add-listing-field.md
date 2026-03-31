Add a new field to the Listing model across the full stack.

Follow these steps in order:

1. **Domain model** (`backend/internal/domain/listing.go`): Add the field with correct Go type and GORM tags.

2. **Migration**: Run `make migrate-create name=add_<field_name>_to_listings` and write the `up.sql` (ALTER TABLE ADD COLUMN) and `down.sql` (ALTER TABLE DROP COLUMN) files.

3. **DTO** (`backend/internal/dto/listing_dto.go`): Add the field to `CreateListingRequest` and `UpdateListingRequest` with appropriate `validate` tags.

4. **Service** (`backend/internal/service/listing_service.go`): Update `Create` and `Update` methods to map the new field from DTO to domain model.

5. **Frontend types** (`frontend/src/types/index.ts`): Add the field to the `Listing` interface with correct TypeScript type.

6. **Frontend form** (`frontend/src/components/listings/ListingForm.tsx`): Add the field to the Zod schema and render the appropriate form input.

7. **ListingCard** (if the field should be displayed): Update `frontend/src/components/listings/ListingCard.tsx`.

State the field name, type, and purpose before starting. Confirm the migration file names after creating them.
