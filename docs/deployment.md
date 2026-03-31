# Deployment Guide

## Local Development Setup

### Prerequisites
- Go 1.22+
- Node.js 20+
- Docker & Docker Compose

### 1. Clone and configure

```bash
git clone https://github.com/your-org/zlatni-kvadrat.git
cd zlatni-kvadrat

cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env`:
```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/zlatni_kvadrat?sslmode=disable
JWT_SECRET=<generate: openssl rand -hex 32>
JWT_REFRESH_SECRET=<generate: openssl rand -hex 32>
CLOUDINARY_URL=
PORT=8080
ENV=development
```

Edit `frontend/.env`:
```
VITE_API_URL=http://localhost:8080/api/v1
VITE_APP_NAME=Zlatni Kvadrat
```

### 2. Start with Docker Compose (recommended)

```bash
make docker-up
```

Starts: PostgreSQL (5432), Backend API (8080), Frontend dev server (5173).

### 3. Run migrations and seed

```bash
export DATABASE_URL=postgres://postgres:postgres@localhost:5432/zlatni_kvadrat?sslmode=disable
make migrate-up
make seed
```

Default admin: `admin@zlatnikvadrát.ba` / `changeme123`

**Change the password immediately after first login.**

### 4. Verify

- Frontend: http://localhost:5173
- API health: http://localhost:8080/health
- Admin panel: http://localhost:5173/admin

---

## Neon DB Setup (Production)

1. Create a free account at https://neon.tech
2. Create a new project: `zlatni-kvadrat`
3. Copy the connection string (psql format)
4. Add to production environment as `DATABASE_URL`
5. Run migrations against production DB:
   ```bash
   export DATABASE_URL=<neon_connection_string>
   make migrate-up
   make seed
   ```

---

## Vercel Deployment (Frontend)

1. Install Vercel CLI: `npm i -g vercel`
2. From `frontend/`: run `vercel`
3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL` → your production API URL
   - `VITE_APP_NAME` → `Zlatni Kvadrat`
4. For CI/CD, add these GitHub secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

---

## Railway / Render Deployment (Backend)

### Railway
1. Connect your GitHub repo to Railway
2. Set the root directory to `backend/`
3. Add environment variables (all from `backend/.env.example`)
4. Railway auto-detects the Dockerfile

### Render
1. Create a new Web Service
2. Connect repo, set root to `backend/`
3. Set environment: Docker
4. Add all env vars from `.env.example`
5. Copy the deploy hook URL → add as `RENDER_DEPLOY_HOOK_URL` GitHub secret

---

## Environment Variable Reference

### Backend
| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection string |
| JWT_SECRET | Yes | Access token signing key (min 32 chars) |
| JWT_REFRESH_SECRET | Yes | Refresh token signing key (min 32 chars) |
| CLOUDINARY_URL | No | Image upload service URL |
| PORT | No | Server port (default: 8080) |
| ENV | No | `development` or `production` |

### Frontend
| Variable | Required | Description |
|----------|----------|-------------|
| VITE_API_URL | Yes | Backend API base URL |
| VITE_APP_NAME | No | App display name |

---

## First Admin User

After running `make seed`, an admin user is created:
- Email: `admin@zlatnikvadrát.ba`
- Password: `changeme123`

**To change the password**, connect to the database directly:
```sql
-- Generate a bcrypt hash first (use htpasswd or an online bcrypt tool)
UPDATE users SET password_hash = '<bcrypt_hash>' WHERE email = 'admin@zlatnikvadrát.ba';
```

Or modify `backend/cmd/seed/main.go` before running seed to set your own email/password.

---

## Creating New Migrations

```bash
# Always use make — never write migrations by hand directly
make migrate-create name=add_floor_to_listings

# This creates:
# backend/internal/database/migrations/000004_add_floor_to_listings.up.sql
# backend/internal/database/migrations/000004_add_floor_to_listings.down.sql
```

Write your SQL in the generated files, then:
```bash
make migrate-up
```

To rollback last migration:
```bash
make migrate-down
```
