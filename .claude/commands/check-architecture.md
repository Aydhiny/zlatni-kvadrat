Review the current codebase against the CLAUDE.md architectural rules and report any violations.

Check the following:

**Backend — Layer separation:**
- [ ] Handler files: do they call repo methods directly? (violation: must go through service)
- [ ] Service files: do they import `gorm.io/gorm` directly? (violation: must use repo interface)
- [ ] Repository files: do they contain business logic? (violation: DB ops only)
- [ ] Any `os.Getenv()` calls outside `internal/config`? (violation)
- [ ] Any `fmt.Println` calls in production code? (violation: use zerolog)
- [ ] Any GORM AutoMigrate calls? (violation: SQL migrations only)

**Backend — Code quality:**
- [ ] All public functions have doc comments?
- [ ] All errors handled (not silently ignored without a comment)?
- [ ] All DTOs have validator tags on required fields?

**Frontend — Patterns:**
- [ ] Any `useState` used for server/async data? (violation: use TanStack Query)
- [ ] Any raw `fetch()` calls outside `lib/api.ts`? (violation)
- [ ] Any `any` types? (violation)
- [ ] Business logic inside components instead of hooks?
- [ ] Forms not using React Hook Form + Zod?

Report each violation with: file path, line number (if visible), rule violated, and suggested fix.
