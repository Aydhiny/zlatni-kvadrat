# Zlatni Kvadrat — Premium Real Estate Platform

![Go](https://img.shields.io/badge/Go-1.22+-00ADD8?style=flat&logo=go)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker)

A production-grade real estate listing and rental platform. Built for the Balkan market with a premium aesthetic.

## Features

- **Public**: Browse properties (sale/rent), filter by type/price/location, submit inquiries
- **Admin**: Full CRUD for listings, image upload, inquiry management, featured listings
- **Auth**: JWT with refresh token rotation

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Go 1.22+, Fiber v2, GORM, PostgreSQL |
| Frontend | React 19, TypeScript, Vite, TanStack Router/Query |
| UI | shadcn/ui, Tailwind CSS v4, Framer Motion |
| Auth | JWT (access + refresh tokens) |
| Infra | Docker, Neon DB, Vercel, Railway |
| CI/CD | GitHub Actions |

## Quick Start

### Prerequisites
- Go 1.22+
- Node.js 20+
- Docker & Docker Compose

### 1. Clone & Setup Environment
```bash
git clone https://github.com/your-org/zlatni-kvadrat.git
cd zlatni-kvadrat

# Backend env
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# Frontend env
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your values
```

### 2. Start with Docker (Recommended)
```bash
docker compose up -d
```

This starts:
- PostgreSQL on port 5432
- Backend API on port 8080 (with Air hot-reload)
- Frontend dev server on port 5173

### 3. Run Migrations & Seed
```bash
make migrate-up
make seed
```

Default admin: `admin@zlatnikvadrát.ba` / `changeme123` (change immediately)

### 4. Manual Setup (without Docker)
```bash
# Backend
cd backend
go mod download
go run ./cmd/api

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

## Project Structure

```
zlatni-kvadrat/
├── backend/          # Go/Fiber API
├── frontend/         # React/Vite SPA
├── docs/             # Architecture, API, Deployment docs
├── .github/          # CI/CD workflows
└── docker-compose.yml
```

See [docs/architecture.md](docs/architecture.md) for the full system design.

## Documentation

- [Architecture](docs/architecture.md)
- [API Reference](docs/api.md)
- [Deployment Guide](docs/deployment.md)

## Contributing

- Branch: `feat/`, `fix/`, `chore/`, `docs/`
- Commits: Conventional Commits (`feat:`, `fix:`, etc.)
- PRs required for `main` — squash merge preferred

## License

MIT
