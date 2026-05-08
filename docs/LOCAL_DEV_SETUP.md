# Local Development Setup (Phase0-002)

This project includes a local container baseline with SQL Server, Redis, backend placeholder runtime, frontend placeholder runtime, and SQL initialization.

## Prerequisites

- Docker Desktop
- Docker Compose v2

## Quick Start

1. Copy environment template:

```bash
cp .env.example .env
```

2. Start stack:

```bash
docker compose up -d
```

3. View running services:

```bash
docker compose ps
```

## Exposed Ports

- SQL Server: `1433`
- Redis: `6379`
- Backend placeholder: `3000`
- Frontend placeholder: `5173`

## What gets initialized

`sql-init` runs SQL scripts in `docker/sql/init/` and creates:

- database: `APP_DB_NAME`
- schema: `catalog`
- tables:
  - `catalog.Objects`
  - `catalog.ImportRuns`

## Useful Commands

Re-run initialization from scratch:

```bash
docker compose down -v
docker compose up -d
```

View logs:

```bash
docker compose logs -f sql-init
docker compose logs -f sqlserver
```

Stop stack:

```bash
docker compose down
```
