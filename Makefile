.PHONY: run build test lint migrate-up migrate-down migrate-create seed docker-up docker-down

# Backend commands
run:
	cd backend && go run ./cmd/api

build:
	cd backend && go build -o bin/api ./cmd/api

test:
	cd backend && go test ./... -v -race

lint:
	cd backend && golangci-lint run

migrate-up:
	migrate -path backend/internal/database/migrations -database "$(DATABASE_URL)" up

migrate-down:
	migrate -path backend/internal/database/migrations -database "$(DATABASE_URL)" down 1

migrate-create:
	migrate create -ext sql -dir backend/internal/database/migrations -seq $(name)

seed:
	cd backend && go run ./cmd/seed

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f

# Frontend commands
frontend-install:
	cd frontend && npm install

frontend-dev:
	cd frontend && npm run dev

frontend-build:
	cd frontend && npm run build

frontend-typecheck:
	cd frontend && npm run typecheck
