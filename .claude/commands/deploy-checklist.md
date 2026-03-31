Run through the pre-deployment checklist before pushing to production.

Check each item and report PASS / FAIL / NEEDS ATTENTION:

**Environment & Config:**
- [ ] `backend/.env.example` has all required vars documented
- [ ] `frontend/.env.example` has all required vars documented
- [ ] No hardcoded URLs, secrets, or API keys in source code
- [ ] GitHub Actions secrets referenced — list which ones are needed

**Backend:**
- [ ] `go build ./...` passes without errors
- [ ] `go test ./... -race` passes
- [ ] All pending migrations are committed in `backend/internal/database/migrations/`
- [ ] No `fmt.Println` in production code paths
- [ ] No `os.Getenv` calls outside `internal/config`
- [ ] CORS `AllowOrigins` is restricted to production domain (not `*`)
- [ ] JWT secrets are at least 32 characters

**Frontend:**
- [ ] `tsc --noEmit` passes
- [ ] `npm run build` succeeds
- [ ] No `console.log` left in production code
- [ ] `VITE_API_URL` points to production API

**Database:**
- [ ] All migration files have corresponding `.down.sql` counterparts
- [ ] Neon DB connection string tested
- [ ] Run `make migrate-up` against production DB before deploying backend

**Docker:**
- [ ] Production Dockerfile uses non-root user
- [ ] Multi-stage build used (builder + runtime stage)

**Documentation:**
- [ ] `docs/deployment.md` reflects current deployment process
- [ ] Default admin password has been changed from seed default

Flag any FAIL items with the exact file and what needs to change.
