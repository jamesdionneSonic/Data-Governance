# Data Governance & Dependency Visualization Platform

A modern, enterprise-grade platform for visualizing data lineage from markdown documentation. Transform markdown metadata into interactive dependency graphs, instant search discovery, and role-based access controls.

## Key Features

- **Markdown-First**: Data lineage defined in organized markdown files with YAML frontmatter (your source of truth)
- **Interactive Visualization**: Dependency graphs, impact analysis diagrams, and heatmap matrices using Cytoscape.js and D3.js
- **Enterprise Search**: Full-text search with faceted filtering (database, owner, sensitivity, tags)
- **Role-Based Access**: Database-level RBAC tied to Entra ID; users see only what they're permitted
- **Lightweight Stack**: File-based architecture with Meilisearch indexing; no heavy database scanning
- **Admin Dashboard**: User management, permission matrix, audit logs, settings

## Governance-First Navigation Model

- **Workspace**: Command Center, Catalog Search, Lineage Explorer
- **Govern**: Business Glossary, Trust & Compliance
- **Deliver**: Data Products, Governance Insights
- **Operate**: Connections, Metadata Ingestion, Administration
- **Support**: Help Center

## Getting Started

### Prerequisites

- Git
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Entra ID tenant (for production; local fallback available for development)

### Clone & Setup

```bash
git clone https://github.com/jamesdionneSonic/Data-Governance.git
cd Data-Governance
cp .env.example .env
# Edit .env with your Entra ID credentials if needed
```

### Quick Start - Local Development

```bash
# Start the stack (Meilisearch, backend, frontend)
docker compose up -d

# Verify services running
docker compose ps

# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
# Meilisearch: http://localhost:7700
```

Detailed setup: [docs/LOCAL_DEV_SETUP.md](docs/LOCAL_DEV_SETUP.md)

## Architecture Highlights

**Markdown-First**: Your lineage lives in Git-versioned markdown organized by database.

```
Markdown Files → Parsed & Indexed (Meilisearch) → REST BFF API → Interactive Frontend
```

See [docs/ENTERPRISE_ARCHITECTURE.md](docs/ENTERPRISE_ARCHITECTURE.md) for full details.

## Markdown Format

Store docs in `/data/markdown/databases/`:

```yaml
---
name: customers
database: production_hr
type: table
owner: john.doe@company.com
sensitivity: confidential
tags: [core, audit, pii]
depends_on: []
---
## Overview
Master customer table...
```

## Documentation

### User Help (For End Users)

- **Help Center (start here)**: [docs/HELP_CENTER.md](docs/HELP_CENTER.md)
- **User Guide**: [docs/USER_GUIDE.md](docs/USER_GUIDE.md)
- **Troubleshooting FAQ**: [docs/TROUBLESHOOTING_FAQ.md](docs/TROUBLESHOOTING_FAQ.md)
- **Video Walkthrough Script**: [docs/VIDEO_WALKTHROUGH_SCRIPT.md](docs/VIDEO_WALKTHROUGH_SCRIPT.md)

### Admin & Operations

- **Admin Guide**: [docs/ADMIN_GUIDE.md](docs/ADMIN_GUIDE.md)
- **Local Development Setup**: [docs/LOCAL_DEV_SETUP.md](docs/LOCAL_DEV_SETUP.md)
- **Deployment Guide**: [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)
- **Launch Checklist**: [docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md)
- **Go-Live Runbook**: [docs/GO_LIVE_RUNBOOK.md](docs/GO_LIVE_RUNBOOK.md)
- **Cloud Migration Runbook**: [docs/CLOUD_MIGRATION_RUNBOOK.md](docs/CLOUD_MIGRATION_RUNBOOK.md)

### Technical & Engineering

- **Docs Portal (full index)**: [docs/README.md](docs/README.md)
- **Source Structure**: [src/README.md](src/README.md)
- **Architecture**: [docs/ENTERPRISE_ARCHITECTURE.md](docs/ENTERPRISE_ARCHITECTURE.md)
- **Product Requirements**: [docs/PRODUCT_REQUIREMENTS.md](docs/PRODUCT_REQUIREMENTS.md)
- **Project Backlog**: [docs/PROJECT_BACKLOG.md](docs/PROJECT_BACKLOG.md)
- **API Spec (OpenAPI)**: [docs/OPENAPI.yaml](docs/OPENAPI.yaml)
- **QA Test Plan**: [docs/QA_TEST_PLAN.md](docs/QA_TEST_PLAN.md)
- **Phase 9 Test Matrix**: [docs/PHASE9_TEST_MATRIX.md](docs/PHASE9_TEST_MATRIX.md)

### Release & Governance Records

- **Release Notes (v0.6.0)**: [docs/RELEASE_NOTES_v0.6.0.md](docs/RELEASE_NOTES_v0.6.0.md)
- **Release Notes (v1.0.0)**: [docs/RELEASE_NOTES_v1.0.0.md](docs/RELEASE_NOTES_v1.0.0.md)
- **Vuetify Final Audit (2026-05-10)**: [docs/VUETIFY_FINAL_AUDIT_2026-05-10.md](docs/VUETIFY_FINAL_AUDIT_2026-05-10.md)
- **Phase 8 Completion**: [PHASE8_COMPLETION.md](PHASE8_COMPLETION.md)
- **Phase 9 Completion**: [PHASE9_COMPLETION.md](PHASE9_COMPLETION.md)
- **Phase 10 Completion**: [PHASE10_COMPLETION.md](PHASE10_COMPLETION.md)
- **Final Release Handoff**: [FINAL_RELEASE_HANDOFF.md](FINAL_RELEASE_HANDOFF.md)
- **Documentation Visual Audit (2026)**: [docs/DOCUMENTATION_VISUAL_AUDIT_2026.md](docs/DOCUMENTATION_VISUAL_AUDIT_2026.md)

### Source Documentation

If you are updating code, use the source-level README files for guidance:

- [src/api/README.md](src/api/README.md)
- [src/services/README.md](src/services/README.md)
- [src/middleware/README.md](src/middleware/README.md)
- [src/utils/README.md](src/utils/README.md)
- [src/components/README.md](src/components/README.md)
- [src/modules/README.md](src/modules/README.md)
- [src/validators/README.md](src/validators/README.md)
- [src/frontend/README.md](src/frontend/README.md)

## Performance Validation

```bash
# Run lint + tests
npm run verify

# Run load profile for p95/p99 API latency
npm run perf:load
```

## Tech Stack

Node.js + Express • Vue.js/React • Cytoscape.js • D3.js • Meilisearch • Entra ID • Docker

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [CONTRIBUTOR.md](CONTRIBUTOR.md)
