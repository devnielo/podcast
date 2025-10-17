.PHONY: help install dev build start docker-build docker-run clean lint type-check test

help:
	@echo "Podcast App - Available commands:"
	@echo "  make install       - Install dependencies with pnpm"
	@echo "  make dev           - Start development server"
	@echo "  make build         - Build for production"
	@echo "  make start         - Preview production build"
	@echo "  make lint          - Run ESLint"
	@echo "  make type-check    - Run TypeScript type checking"
	@echo "  make test          - Run tests"
	@echo "  make docker-build  - Build Docker image"
	@echo "  make docker-run    - Run Docker container"
	@echo "  make clean         - Clean node_modules and dist"

install:
	pnpm install

dev:
	pnpm run dev

build:
	pnpm run build

start:
	pnpm run preview

lint:
	pnpm run lint

type-check:
	pnpm run type-check

test:
	pnpm run test

docker-build:
	docker build -t podcast-app .

docker-run:
	docker run -p 3000:3000 podcast-app

clean:
	rm -rf node_modules dist pnpm-lock.yaml
