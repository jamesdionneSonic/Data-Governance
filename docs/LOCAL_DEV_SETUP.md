# Local Development Setup (Markdown-First Edition)

This project includes a local development environment with Meilisearch, Node.js backend, Nginx frontend, and markdown organizing templates.

## Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2
- Entra ID tenant (optional, local auth fallback available)

## Quick Start

1. **Clone & Configure**

```bash
cp .env.example .env
# For production setup, add Entra ID credentials:
#   ENTRA_CLIENT_ID=xxx
#   ENTRA_CLIENT_SECRET=xxx
#   ENTRA_TENANT_ID=xxx
```

2. **Start Services**

```bash
docker compose up -d
docker compose ps
```

3. **Verify Services**

```bash
# Frontend should be available
curl http://localhost:5173

# Backend API
curl http://localhost:3000/api/v1/health

# Meilisearch admin panel  
curl http://localhost:7700/health
```

## What Gets Created

### Containers

| Service | Port | Purpose |
|---------|------|---------|
| **Meilisearch** | 7700 | Full-text search engine with faceted filtering |
| **Backend** | 3000 | Express.js BFF API with auth, parsing, permissions |
| **Frontend** | 5173 | Nginx serving Vue.js/React frontend |

### Volumes

- `meilisearch_data/` → Persisted search index
- `.` (workspace) → Mounted to backend for live code reloading

### Data Structure

Your markdown documentation lives in:

```
/data/markdown/databases/
  /production_hr/
    /tables/
      employees.md
      salaries.md
    /procedures/
      sp_calculate_bonus.md
    lineage.md
  /analytics/
    /tables/
      events.md
    lineage.md
```

Each markdown file should have YAML frontmatter:

```yaml
---
name: employees
database: production_hr
type: table
owner: john.doe@company.com
sensitivity: confidential
tags: [core, pii, audit]
depends_on: []
---

## Overview
Employee master table...
```

## Useful Commands

### Start/Stop Stack

```bash
docker compose up -d          # Start all services
docker compose down           # Stop and remove containers
docker compose down -v        # Stop and remove volumes (fresh start)
```

### View Logs

```bash
docker compose logs -f                    # All services
docker compose logs -f backend            # Just backend
docker compose logs -f meilisearch        # Just Meilisearch
```

### Access Services

```bash
# Frontend
open http://localhost:5173

# Backend API docs (if Swagger enabled)
open http://localhost:3000/docs

# Meilisearch admin
open http://localhost:7700
```

### Rebuild After Dependency Changes

```bash
docker compose build --no-cache
docker compose up -d
```

### Fresh Database & Search Index

```bash
docker compose down -v
docker compose up -d
# Indices will re-build automatically
```

## Development Workflow

### 1. Edit Markdown Files

Add/edit files in `/data/markdown/databases/` and they'll be automatically indexed.

### 2. Backend Development

Edit files in `src/` - backend container has hot-reload enabled.

### 3. Frontend Development  

Edit files in `src/frontend/` - frontend rebuilds on file changes.

### 4. Run Tests

```bash
docker compose exec backend npm test
```

### 5. View Indexed Data

```bash
# Search via API
curl "http://localhost:3000/api/v1/search?q=employees"

# Or access Meilisearch directly
curl -X GET "http://localhost:7700/indexes"
```

## Environment Variables

Create `.env` file (based on `.env.example`):

```dotenv
# Meilisearch
MEILISEARCH_MASTER_KEY=localDevelopmentOnly

# Entra ID (optional for dev, required for production)
ENTRA_CLIENT_ID=
ENTRA_CLIENT_SECRET=
ENTRA_TENANT_ID=

# App
NODE_ENV=development
PORT=3000
MARKDOWN_DATA_PATH=./data/markdown
```

## Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
lsof -i :7700           # Meilisearch
lsof -i :3000           # Backend
lsof -i :5173           # Frontend

# Kill the process
kill -9 <PID>
```

### Meilisearch Not Responding

```bash
# Check container logs
docker compose logs meilisearch

# Restart Meilisearch
docker compose restart meilisearch

# Full reset
docker compose down -v meilisearch
docker compose up -d meilisearch
```

### Backend API Errors

```bash
# Check backend logs
docker compose logs -f backend

# Re-build and restart
docker compose rebuild backend
docker compose up -d backend
```

### Markdown Not Indexing

```bash
# Verify markdown exists in correct location
ls -la data/markdown/

# Check backend logs for parsing errors
docker compose logs backend | grep -i parse

# Manually trigger re-index
docker compose exec backend npm run index-markdown
```

## Performance Tuning

### API Performance Profiling

The backend now collects request timing samples and exposes percentile metrics.

```bash
# View request latency summary (p50/p95/p99 and top slow routes)
curl http://localhost:3000/health/performance

# Run synthetic load test and print p95/p99 report
npm run perf:load
```

### For Large Datasets (1000s of markdown files)

Increase Meilisearch memory:

```yaml
# docker-compose.yml
services:
  meilisearch:
    environment:
      MEILI_MAX_INDEXING_MEMORY: 4GB  # Set based on your system
```

### For Slow Searches

```yaml
services:
  meilisearch:
    environment:
      MEILI_SNAPSHOT_INTERVAL: 3600   # Snapshot every hour
```

## Next Steps

1. **Add Markdown**: Place database documentation in `/data/markdown/`
2. **Configure Entra ID**: (Optional) Set env vars for production auth
3. **Develop Frontend**: Edit Vue.js/React components in `src/frontend/`
4. **Build Backend**: Add API routes in `src/api/`
5. **Test**: Run test suite with `npm test`

See [docs/ENTERPRISE_ARCHITECTURE.md](ENTERPRISE_ARCHITECTURE.md) for full architecture details.

Additional docs:

- [USER_GUIDE.md](USER_GUIDE.md)
- [ADMIN_GUIDE.md](ADMIN_GUIDE.md)
- [OPENAPI.yaml](OPENAPI.yaml)
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- [TROUBLESHOOTING_FAQ.md](TROUBLESHOOTING_FAQ.md)
- [RELEASE_NOTES_v0.6.0.md](RELEASE_NOTES_v0.6.0.md)

