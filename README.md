# Data Governance

A platform for SQL Server and SSIS dependency visibility, documentation, and enterprise governance.

## Getting Started

### Prerequisites

- Git
- Node.js 18+
- Docker Desktop (for local service containers)

### Clone and Branch

```bash
git clone https://github.com/jamesdionneSonic/Data-Governance.git
cd Data-Governance
git checkout -b feature/<phase>-<short-name>
```

### Repository Layout

```text
src/        application source
tests/      automated tests
config/     runtime and environment config
docs/       architecture, backlog, runbooks
.github/    pull request and issue templates
```

### Local Container Baseline (Phase0-002)

```bash
cp .env.example .env
docker compose up -d
docker compose ps
```

Detailed guide: [docs/LOCAL_DEV_SETUP.md](docs/LOCAL_DEV_SETUP.md)

## Development

### Standards

- Follow [CONTRIBUTOR.md](CONTRIBUTOR.md)
- Follow [CONTRIBUTING.md](CONTRIBUTING.md)
- Respect BFF boundaries for frontend-facing APIs
- Apply IaC-first for platform and environment changes

### Governance and Process

- Branch protection setup guidance: [docs/BRANCH_PROTECTION_SETUP.md](docs/BRANCH_PROTECTION_SETUP.md)
- Use pull request template in `.github/PULL_REQUEST_TEMPLATE.md`
- Use issue templates in `.github/ISSUE_TEMPLATE/`

### Strategy Documents

- Backlog: [docs/PROJECT_BACKLOG.md](docs/PROJECT_BACKLOG.md)
- Architecture: [docs/ENTERPRISE_ARCHITECTURE.md](docs/ENTERPRISE_ARCHITECTURE.md)
- Product requirements: [docs/PRODUCT_REQUIREMENTS.md](docs/PRODUCT_REQUIREMENTS.md)
