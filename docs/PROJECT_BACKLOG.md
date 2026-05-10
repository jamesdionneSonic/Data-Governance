# Comprehensive Project Backlog

# Data Governance & Dependency Visualization Platform (Markdown-First Edition)

**Version:** 3.1  
**Last Updated:** May 10, 2026  
**Architecture**: Markdown-Driven Source of Truth + SQL Operational Store + Meilisearch

---

## Executive Summary

This backlog contains the complete delivery history for MVP phases and the forward roadmap. Legacy delivery (Phase 0-10) is complete, and post-launch governance capabilities are now prioritized for comprehensive data governance including glossary, classification, quality, metadata, access control, compliance, marketplace, workflows, observability, and incident management.

**Estimated Timeline**: MVP (Phase 0-6): 10 months complete | Extended Governance (Phase 7a-7r): 18-24 months | Phase 8 (Azure): 4-8 weeks  
**Recommended Team**: Core Platform (4-5 developers) + Governance Features (6-8 developers) + 1 architect + 2 QA + 1 Product Manager  
**Total Estimated Effort**: MVP (100-130 person-days) + Governance Extensions (280-350 person-days) + Azure (80-120 person-days) = 460-600 person-days (~12-15 months for cross-functional team)

> **Non-Negotiable Architecture Principles**:
>
> **Layer 1 – Markdown Source of Truth (unchanged)**
>
> - Markdown `.md` files with YAML frontmatter remain the authoritative source for data asset documentation, lineage, schema definitions, and dependency declarations
> - All data lineage defined in organization markdown files; pushed via Git or uploaded via the ingestion API
> - Meilisearch indexes markdown content for full-text discovery
>
> **Layer 2 – SQL Operational Store (required for Phase 7a-7r governance features)**
>
> - Governance metadata that is transactional, stateful, or high-frequency write belongs in SQL Server (local dev) / Azure SQL (production)
> - This includes: business glossary terms, quality rules + results, access requests, task assignments, incident records, audit events, usage analytics, and classification policies
> - SQL is the right tool for concurrent edits, workflow state machines, SLA timers, and compliance-grade audit logs — markdown files cannot reliably support these use cases
> - SQL data is **enrichment/operational overlay** on top of markdown assets; it does not replace markdown as the lineage source
>
> **Layer 3 – BFF API (unchanged)**
>
> - Single REST API boundary merges markdown-indexed search results with SQL governance metadata
> - All business logic centralized in the BFF; frontend never reads SQL or Meilisearch directly
>
> **Summary: Hybrid model**
>
> - Asset definitions & lineage → Markdown files (Git-versioned)
> - Search & discovery index → Meilisearch
> - Operational governance state → SQL Server / Azure SQL
> - Auth & permissions → Entra ID + custom RBAC store (SQL)

---

## Project Phases Overview

| Phase        | Name                                 | Duration  | Key Objective                                                     | Priority    | Status     |
| ------------ | ------------------------------------ | --------- | ----------------------------------------------------------------- | ----------- | ---------- |
| **Phase 0**  | Foundation & DevOps                  | 1-2 weeks | Docker, CI/CD, testing framework, repo structure                  | 🔴 CRITICAL | ✅ Done    |
| **Phase 1**  | Auth & BFF Skeleton                  | 2-3 weeks | Entra ID integration, permission layer, API routes                | 🔴 CRITICAL | ✅ Done    |
| **Phase 2**  | Markdown Parsing & Indexing          | 2-3 weeks | Parse markdown YAML, extract lineage, index in Meilisearch        | 🔴 CRITICAL | ✅ Done    |
| **Phase 3**  | Search & Discovery                   | 1-2 weeks | Full-text search, faceted filtering, search UI                    | 🔴 CRITICAL | ✅ Done    |
| **Phase 4**  | Visualization Layer                  | 3-4 weeks | Interactive graphs, impact analysis, matrices, D3.js integration  | 🟠 HIGH     | ✅ Done    |
| **Phase 5**  | Admin Dashboard                      | 2-3 weeks | User management, permission matrix, audit logs                    | 🟠 HIGH     | ✅ Done    |
| **Phase 6**  | Reporting & Polish                   | 2 weeks   | Export, PDF generation, performance tuning                        | 🟠 HIGH     | ✅ Done    |
| **Phase 7a** | Business Glossary & Semantic         | 3-4 weeks | Glossary terms, semantic mapping, business definitions            | 🔴 CRITICAL | 🟡 Planned |
| **Phase 7b** | Data Classification & Tagging        | 2-3 weeks | Classification framework, auto-classification, policy enforcement | 🔴 CRITICAL | 🟡 Planned |
| **Phase 7c** | Data Quality Management              | 4-5 weeks | Quality rules, profiling, anomaly detection, fitness scoring      | 🔴 CRITICAL | 🟡 Planned |
| **Phase 7d** | Metadata Management & Enrichment     | 3-4 weeks | Auto metadata harvesting, data dictionary, business metadata      | 🔴 CRITICAL | 🟡 Planned |
| **Phase 7e** | Ownership & Stewardship              | 2-3 weeks | Multi-role ownership, steward dashboards, governance tasks        | 🔴 CRITICAL | 🟡 Planned |
| **Phase 7f** | Access Control & Security            | 3-4 weeks | RBAC, sensitive data masking, access request workflow             | 🔴 CRITICAL | 🟡 Planned |
| **Phase 7g** | Compliance & Audit                   | 3-4 weeks | Compliance frameworks, audit logging, compliance reporting        | 🔴 CRITICAL | 🟡 Planned |
| **Phase 7h** | Data Marketplace & Products          | 4-5 weeks | Data products, contracts, SLAs, access fulfillment                | 🔴 CRITICAL | 🟡 Planned |
| **Phase 7i** | Governance Workflows & Orchestration | 3-4 weeks | Workflow engine, task management, approval workflows              | 🔴 CRITICAL | 🟡 Planned |
| **Phase 7j** | Trust & Certification                | 2-3 weeks | Trust scoring, certification, endorsements, quality guarantees    | 🟠 HIGH     | 🟡 Planned |
| **Phase 7k** | Collaboration & Knowledge Layer      | 2-3 weeks | Comments, guidelines, decision logs, expert annotations           | 🟠 HIGH     | 🟡 Planned |
| **Phase 7l** | Usage Analytics & Adoption           | 2-3 weeks | Usage tracking, adoption scoring, retirement recommendations      | 🟠 HIGH     | 🟡 Planned |
| **Phase 7m** | Data Observability & Monitoring      | 3-4 weeks | SLA tracking, anomaly detection, schema monitoring                | 🟠 HIGH     | 🟡 Planned |
| **Phase 7n** | Data Incident Management             | 2-3 weeks | Incident creation, root cause analysis, communication             | 🟠 HIGH     | 🟡 Planned |
| **Phase 7o** | Data Impact Analysis & Lineage       | 2-3 weeks | Blast radius, change risk assessment, dependency visualization    | 🟠 HIGH     | 🟡 Planned |
| **Phase 7p** | API Integration & Governance         | 3-4 weeks | Governance API, tool integrations, webhook streaming              | 🔴 CRITICAL | 🟡 Planned |
| **Phase 7q** | Governance Maturity & ROI            | 2-3 weeks | KPI dashboard, ROI tracking, business impact metrics              | 🟠 HIGH     | 🟡 Planned |
| **Phase 7r** | Glossary SME Management              | 2-3 weeks | Term approval workflows, glossary stewardship, governance         | 🟠 HIGH     | 🟡 Planned |
| **Phase 8**  | Azure Cloud Epic                     | 4-8 weeks | Azure production migration and operational hardening              | 🔴 CRITICAL | 🟡 Planned |

**Total MVP Effort**: 100-130 person-days  
**MVP Delivery Target**: 10 months

---

## Backlog Completion Audit (Legacy Scope)

The full legacy roadmap has been audited and marked complete based on delivery artifacts and validation history:

- Completion docs: `PHASE8_COMPLETION.md`, `PHASE9_COMPLETION.md`, `PHASE10_COMPLETION.md`
- Release handoff: `FINAL_RELEASE_HANDOFF.md`
- Current quality gates: lint + full test suite passing

### Completed Stories (Marked Off)

| Story ID   | Status  |
| ---------- | ------- |
| PHASE0-001 | ✅ Done |
| PHASE0-002 | ✅ Done |
| PHASE0-003 | ✅ Done |
| PHASE1-001 | ✅ Done |
| PHASE1-002 | ✅ Done |
| PHASE1-003 | ✅ Done |
| PHASE2-001 | ✅ Done |
| PHASE2-002 | ✅ Done |
| PHASE2-003 | ✅ Done |
| PHASE2-004 | ✅ Done |
| PHASE3-001 | ✅ Done |
| PHASE3-002 | ✅ Done |
| PHASE4-001 | ✅ Done |
| PHASE4-002 | ✅ Done |
| PHASE4-003 | ✅ Done |
| PHASE4-004 | ✅ Done |
| PHASE5-001 | ✅ Done |
| PHASE5-002 | ✅ Done |
| PHASE5-003 | ✅ Done |
| PHASE6-001 | ✅ Done |
| PHASE6-002 | ✅ Done |
| PHASE6-003 | ✅ Done |

---

## Phase 0: Foundation & DevOps (1-2 weeks)

### Objectives

- Build development environment scaffolding
- Set up CI/CD pipeline
- Configure testing infrastructure
- Establish project structure and standards

### User Stories

#### PHASE0-001: Project Structure and DevOps Setup

**Story**: Establish repository structure, Docker Compose stack, and GitHub Actions CI/CD  
**Points**: 5  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Repository structured with `/src`, `/tests`, `/docs`, `/config`, `/docker`
- [ ] Docker Compose with Meilisearch, Node.js backend, Nginx frontend
- [ ] GitHub Actions pipeline for linting, testing, building
- [ ] `.eslintrc`, `.prettierrc`, `jest.config.js` configured
- [ ] Pre-commit hooks via husky
- [ ] One-command startup (`docker compose up`)

**Tasks**:

- Create folder structure
- Build docker-compose.yml (Meilisearch + Node + Nginx)
- Set up GitHub Actions workflows
- Configure ESLint + Prettier
- Add husky pre-commit hooks
- Document dev setup

**Dependencies**: None

---

#### PHASE0-002: Testing & Code Quality Framework

**Story**: Set up Jest, Playwright, and SonarQube integration  
**Points**: 3  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Jest configured for unit tests with >80% coverage threshold
- [ ] Playwright configured for E2E testing
- [ ] GitHub Actions runs tests on every PR
- [ ] Coverage reports uploaded to PR
- [ ] SonarQube scan integrated
- [ ] Test database initialization scripts ready

**Tasks**:

- Configure Jest + coverage collection
- Set up Playwright E2E framework
- Create GitHub Actions test workflow
- Add SonarQube badge to README
- Create test data fixtures

**Dependencies**: PHASE0-001

---

#### PHASE0-003: Package.json & Dependencies

**Story**: Configure all npm dependencies and scripts  
**Points**: 2  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] package.json with all production + dev dependencies
- [ ] npm scripts for dev, build, test, lint, start
- [ ] No high/critical vulnerabilities
- [ ] package-lock.json committed
- [ ] Documentation of key libraries

**Tasks**:

- Define prod dependencies (express, @meilisearch/meilisearch-js, etc.)
- Add dev dependencies (jest, playwright, eslint, etc.)
- Configure npm scripts
- Run npm audit and fix
- Document dependency choices

**Dependencies**: PHASE0-001

---

## Phase 1: Authentication & BFF Skeleton (2-3 weeks)

### Objectives

- Set up Entra ID OIDC authentication
- Build BFF API layer with permission checks
- Establish Core API routes
- Create basic permission store

### User Stories

#### PHASE1-001: Entra ID Integration & OIDC Flow

**Story**: Integrate Microsoft Entra ID for enterprise authentication  
**Points**: 5  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Entra ID app registration created in tenant
- [ ] OIDC flow implemented (`/auth/login`, `/auth/callback`)
- [ ] JWT token validation on every API request
- [ ] `/auth/me` endpoint returns user info
- [ ] `/auth/logout` clears session
- [ ] Token refresh mechanism implemented
- [ ] Development/test tenant credentials documented

**Tasks**:

- Register app in Entra ID
- Implement OIDC callback handler
- Add JWT middleware to Express
- Create `/auth/*` routes
- Add token refresh logic
- Write integration tests

**Dependencies**: PHASE0-001, PHASE0-003

---

#### PHASE1-002: Permission Store & Database-Level RBAC

**Story**: Build lightweight permission model for database-level access control  
**Points**: 5  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Permission store (JSON or lightweight key-value) implemented
- [ ] Data model: User → Role → Database Permissions
- [ ] Roles: Admin, PowerUser, Analyst, Viewer
- [ ] Permission check middleware: `requireDatabaseAccess(dbName)`
- [ ] Unit tests for permission evaluation
- [ ] Admin can assign users to databases
- [ ] Audit log when permissions change

**Tasks**:

- Design permission data model
- Create permission store layer
- Implement `checkPermission()` middleware
- Add permission assignment API
- Write permission unit tests
- Create audit logger

**Dependencies**: PHASE1-001

---

#### PHASE1-003: BFF Core Routes & Structure

**Story**: Build REST API skeleton with core endpoints  
**Points**: 5  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] `GET /api/v1/auth/me` → User info + assigned databases
- [ ] `GET /api/v1/objects` → List objects (paginated, filtered)
- [ ] `GET /api/v1/objects/:id` → Object detail
- [ ] `GET /api/v1/lineage/:id` → Dependencies (upstream + downstream)
- [ ] `GET /api/v1/search` → Search placeholder
- [ ] `GET /api/v1/admin/users` → Admin-only user list
- [ ] All routes require auth + permission checks
- [ ] Error handling with consistent response format
- [ ] OpenAPI/Swagger documentation

**Tasks**:

- Create route handlers for each endpoint
- Implement pagination + filtering
- Add permission checks to each route
- Write route tests
- Generate OpenAPI spec
- Document API in README

**Dependencies**: PHASE1-001, PHASE1-002

---

## Phase 2: Markdown Parsing & Indexing (2-3 weeks)

### Objectives

- Parse markdown files with YAML frontmatter
- Extract lineage relationships
- Index in Meilisearch
- Implement markdown sync/upload

### User Stories

#### PHASE2-001: Markdown Parser & YAML Frontmatter Extraction

**Story**: Build parser to extract metadata and lineage from markdown files  
**Points**: 5  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Parser reads YAML frontmatter (owner, tags, sensitivity, depends_on)
- [ ] Extracts markdown body content for indexing
- [ ] Validates required fields (name, database, type)
- [ ] Handles folder hierarchy (database → object → lineage.md)
- [ ] Returns structured object with relationships
- [ ] Unit tests for various markdown formats
- [ ] Error handling for malformed markdown

**Example Markdown Format**:

```yaml
---
name: users
database: production_hr
type: table
owner: john.doe@company.com
sensitivity: confidential
tags: [core, audit, pii]
depends_on: []
description: Master user directory for all systems
---

## Overview
Main users table...

## Depends On
Nothing

## Depended On By
- user_accounts table
- employee_view procedure
```

**Tasks**:

- Build markdown parser (use yaml-front-matter lib)
- Extract structured data
- Validate against schema
- Write parser unit tests
- Handle edge cases

**Dependencies**: PHASE0-001

---

#### PHASE2-002: Meilisearch Integration & Indexing

**Story**: Index parsed markdown objects in Meilisearch for search  
**Points**: 4  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Meilisearch container running and healthy
- [ ] Index schema defined (name, database, type, owner, tags, body, sensitivity)
- [ ] Full-text search enabled
- [ ] Facets configured (database, type, owner, sensitivity, tags)
- [ ] Batch index function for all markdown files
- [ ] Search returns <100ms
- [ ] Index updates when markdown changes

**Tasks**:

- Configure Meilisearch container
- Define index schema
- Create indexing function
- Batch upload markdown objects
- Test search performance
- Write integration tests

**Dependencies**: PHASE0-001, PHASE2-001

---

#### PHASE2-003: Lineage Graph Building

**Story**: Construct directed graph of dependencies from markdown files  
**Points**: 5  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Build dependency graph from `depends_on` YAML field
- [ ] `GET /api/v1/lineage/:objectId/upstream` returns all upstream dependencies
- [ ] `GET /api/v1/lineage/:objectId/downstream` returns all downstream dependents
- [ ] Calculate transitive closure (indirect dependencies)
- [ ] Detect circular dependencies with warning
- [ ] Performance acceptable for large graphs (1000+ nodes)
- [ ] Unit tests for graph traversal

**Tasks**:

- Build in-memory graph structure
- Implement BFS/DFS traversal
- Create upstream/downstream endpoints
- Handle circular dependency detection
- Write graph tests

**Dependencies**: PHASE1-003, PHASE2-001

---

#### PHASE2-004: Markdown Sync & Upload API

**Story**: Allow users to upload/update markdown files  
**Points**: 4  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] `POST /api/v1/markdown/upload` accepts single file or batch
- [ ] `PUT /api/v1/markdown/:path` updates existing file
- [ ] `DELETE /api/v1/markdown/:path` removes file
- [ ] Changes committed to Git with proper metadata
- [ ] Only PowerUser+ can upload (permission check)
- [ ] Audit log tracks who changed what
- [ ] Automatic Meilisearch re-index after upload

**Tasks**:

- Create upload endpoint
- Implement file validation
- Add Git commit logic
- Create audit logging
- Write endpoint tests

**Dependencies**: PHASE1-003, PHASE2-001, PHASE2-002

---

## Phase 3: Search & Discovery (1-2 weeks)

### Objectives

- Implement full-text search
- Add faceted filtering
- Build search UI
- Optimize performance

### User Stories

#### PHASE3-001: Full-Text & Faceted Search API

**Story**: Build powerful search capabilities with Meilisearch  
**Points**: 4  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] `GET /api/v1/search?q=query` returns objects matching query
- [ ] Facets: database, type, owner, sensitivity, tags
- [ ] Search returns results <50ms
- [ ] Pagination (limit/offset)
- [ ] Highlights matching terms
- [ ] Typo tolerance enabled
- [ ] Sort by relevance, name, modified date

**Example Request**:

```
GET /api/v1/search?q=customer&database=sales&sensitivity=public&limit=20
```

**Tasks**:

- Create search endpoint
- Configure Meilisearch facets
- Implement pagination
- Add result highlighting
- Test performance
- Write search tests

**Dependencies**: PHASE2-002

---

#### PHASE3-002: Search UI Component

**Story**: Build interactive search interface with faceted filters  
**Points**: 5  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Search box with autocomplete
- [ ] Facet sidebar (database, type, owner, sensitivity, tags)
- [ ] Results grid with object name, database, owner, type
- [ ] Click result to view details
- [ ] Filters update results in real-time
- [ ] Empty state message
- [ ] Mobile responsive

**Tasks**:

- Create search component
- Build facet filter UI
- Implement autocomplete
- Style with Tailwind/Material-UI
- Write component tests

**Dependencies**: PHASE3-001

---

## Phase 4: Visualization Layer (3-4 weeks)

### Objectives

- Build interactive dependency graph
- Create impact analysis view
- Implement dependency matrix
- Add object detail cards

### User Stories

#### PHASE4-001: Interactive Dependency Graph

**Story**: Render interactive dependency graph using Cytoscape.js  
**Points**: 8  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Graph renders upstream + downstream dependencies
- [ ] Nodes are draggable and zoomable
- [ ] Click node to highlight related nodes
- [ ] Right-click context menu (view details, export)
- [ ] Color coding by object type (table, procedure, package)
- [ ] Node size indicates number of dependents
- [ ] Performance acceptable for 500+ nodes
- [ ] Mobile touch support

**Tasks**:

- Integrate Cytoscape.js
- Build graph data fetching
- Create node rendering
- Implement interactions
- Add performance optimizations
- Write graph tests

**Dependencies**: PHASE2-003

---

#### PHASE4-002: Impact Analysis Diagram

**Story**: Visualize blast radius of changes  
**Points**: 6  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Select object and show download impact area (red)
- [ ] Layered visualization: direct dependents, 2-hop, 3+ hops
- [ ] Generate impact report (CSV/PDF)
- [ ] Identify critical dependencies (high-impact)
- [ ] Filter by type (only show tables, procedures, etc.)

**Tasks**:

- Create impact analysis component
- Implement layered highlighting
- Build export functionality
- Add filtering options

**Dependencies**: PHASE4-001, PHASE2-003

---

#### PHASE4-003: Dependency Matrix Heatmap

**Story**: Show object relationships as interactive matrix  
**Points**: 5  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Rows = data sources, Columns = consumers
- [ ] Heatmap cells show dependency strength (color intensity)
- [ ] Hover shows object names, click opens detail
- [ ] Export matrix as CSV
- [ ] Filter matrix by database or type

**Tasks**:

- Create matrix component
- Build heatmap rendering
- Implement interactions
- Add filtering

**Dependencies**: PHASE2-003

---

#### PHASE4-004: D3.js Advanced Charts

**Story**: Build domain-specific visualization charts  
**Points**: 4  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Object type distribution (bar chart)
- [ ] Dependency depth histogram
- [ ] Ownership distribution (pie chart)
- [ ] Sensitivity level breakdown
- [ ] Export charts as PNG/SVG

**Tasks**:

- Create chart components
- Integrate D3.js
- Implement responsive design
- Add export functionality

**Dependencies**: PHASE2-003

---

## Phase 5: Admin Dashboard (2-3 weeks)

### Objectives

- Build user management interface
- Create permission matrix UI
- Implement audit log viewer
- Add configuration settings

### User Stories

#### PHASE5-001: User Management Interface

**Story**: Admin interface for managing users and roles  
**Points**: 5  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] List all users with roles
- [ ] Add user (invite via email)
- [ ] Change user role
- [ ] Deactivate/remove user
- [ ] Bulk actions (CSV import)
- [ ] Audit log shows who made changes

**Tasks**:

- Create admin user management component
- Build user table with sorting/filtering
- Implement role assignment
- Add bulk import
- Write admin tests

**Dependencies**: PHASE1-002

---

#### PHASE5-002: Permission Matrix UI

**Story**: Visual matrix showing database access by user  
**Points**: 6  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Matrix: Rows = Users, Columns = Databases
- [ ] Cells show role (Admin, PowerUser, Analyst, Viewer)
- [ ] Click cell to change role
- [ ] Bulk assign (all users to database)
- [ ] Download permissions report
- [ ] Audit log tracks changes

**Tasks**:

- Create permission matrix component
- Build interactive cells
- Implement bulk operations
- Add export functionality

**Dependencies**: PHASE1-002

---

#### PHASE5-003: Audit Log Viewer

**Story**: Show all system events and access history  
**Points**: 4  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] List events: login, permission change, markdown upload, search
- [ ] Filter by user, event type, date range
- [ ] Show who, what, when, outcome
- [ ] Export audit log to CSV
- [ ] Retention policy (keep 1 year)

**Tasks**:

- Create audit log component
- Build event table with filtering
- Implement export
- Add date range picker

**Dependencies**: PHASE1-002

---

## Phase 6: Reporting & Polish (2 weeks)

### Objectives

- Build export functionality
- Performance optimization
- Documentation
- Release preparation

### User Stories

#### PHASE6-001: Export & Reporting

**Story**: Generate reports and export visualizations  
**Points**: 4  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [x] Export object catalog as CSV/Excel
- [x] Generate dependency report (PDF)
- [x] Export visualization as PNG/SVG
- [x] Share visualization link (read-only)
- [x] Scheduled reports (email delivery)

**Tasks**:

- Implement CSV/Excel export
- Build PDF generation
- Create image export
- Add email scheduling
- Write export tests

**Dependencies**: PHASE4-001, PHASE4-002, PHASE4-003

---

#### PHASE6-002: Performance Tuning & Optimization

**Story**: Optimize performance for large datasets  
**Points**: 3  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [x] Search <50ms for 10k+ objects
- [x] Graph rendering <1s for 500+ nodes
- [x] Frontend Lighthouse score >90
- [x] API response times <200ms p95
- [x] Memory usage stable under load

**Tasks**:

- Profile backend performance
- Optimize Meilisearch queries
- Implement frontend code splitting
- Add caching layer
- Run load tests

**Dependencies**: (All phases)

---

#### PHASE6-003: Documentation & Release

**Story**: Complete documentation and prepare MVP release  
**Points**: 3  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [x] User guide written
- [x] Admin guide written
- [x] API documentation (OpenAPI/Swagger)
- [x] Deployment guide (Docker, cloud)
- [x] Troubleshooting FAQ
- [x] Release notes
- [x] Video walkthrough (5 min)

**Tasks**:

- Write user documentation
- Write admin guides
- Create video walkthrough
- Update README
- Deploy to staging

**Dependencies**: (All phases)

---

## Phase 7: Competitive Parity & Product Ops (Pre-Azure Cloud Epic)

### Objectives

- Close high-value capability gaps against enterprise governance leaders
- Add operational data product lifecycle flows
- Strengthen trust, stewardship, and adoption experiences
- Add AI-context services and activation integrations

### User Stories

#### PHASE7-001: Data Marketplace Access Workflow

**Story**: Enable request/approval/fulfillment workflow for governed data asset access  
**Points**: 8  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Users can request access for an asset or data product from catalog/detail pages
- [ ] Approvers can approve, reject, or request-more-info with comments
- [ ] Approval decisions generate auditable events with timestamps and actor identity
- [ ] Approved requests trigger permission assignment or fulfillment handoff
- [ ] Request status lifecycle visible to requester and admins (submitted/in-review/approved/rejected/fulfilled)
- [ ] SLA timer for approval turnaround and overdue alerts
- [ ] Exportable request history for compliance reporting

**Tasks**:

- Create request domain model + persistence
- Build request APIs + permission rules
- Add requester and approver UI workflows
- Add SLA and overdue calculations
- Integrate audit/event logging
- Add unit + integration tests

**Dependencies**: PHASE1-002, PHASE5-001, PHASE5-003

---

#### PHASE7-002: Data Product Contracts & SLA Management

**Story**: Manage data product contracts, ownership, and service-level guarantees  
**Points**: 7  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Data products support owner, steward, consumer, domain metadata
- [ ] Contracts define schema guarantees, freshness SLAs, quality thresholds, and access terms
- [ ] Contract versions tracked with change history and effective dates
- [ ] Contract violations displayed with severity and impacted consumers
- [ ] Product readiness score includes policy + quality + SLA health
- [ ] Product publication state supports draft/review/published/deprecated

**Tasks**:

- Define product + contract schema
- Build CRUD/version APIs for contracts
- Create lifecycle UI for product state transitions
- Implement violation detection + dashboard surfacing
- Add export/reporting for contract compliance
- Add tests and documentation

**Dependencies**: PHASE2-001, PHASE6-001

---

#### PHASE7-003: Trust Signals, Certification, and Endorsements

**Story**: Add trust framework to help users quickly identify production-safe assets  
**Points**: 6  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Assets can be marked certified, provisional, or deprecated
- [ ] Trust badges include quality score, lineage completeness, and ownership completeness
- [ ] Stewards can endorse or revoke endorsements with reason codes
- [ ] Trust score appears in search ranking and result cards
- [ ] Users can filter by trust state and certification level
- [ ] Trust change events are logged and reportable

**Tasks**:

- Add trust metadata model
- Extend search indexing with trust facets
- Build certification workflows in admin UI
- Implement trust scoring function
- Add audit + reporting support
- Add tests

**Dependencies**: PHASE3-001, PHASE5-003, PHASE6-001

---

#### PHASE7-004: Stewardship Workflow Automation

**Story**: Create governance task workflows for metadata quality and policy compliance  
**Points**: 8  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Rule-based task generation for missing owners, descriptions, tags, sensitivity, and stale lineage
- [ ] Assignable tasks with priority, due date, and escalation routing
- [ ] Workflow states support open/in-progress/blocked/done
- [ ] Bulk triage actions available for stewards and admins
- [ ] Notification hooks support email/slack/teams from integration settings
- [ ] Workflow metrics surface backlog volume, MTTR, and SLA breach counts

**Tasks**:

- Build workflow/task domain model
- Create automation rule engine
- Add assignee and escalation logic
- Build task board/list UI views
- Wire notifications to integration channels
- Add tests + reporting endpoints

**Dependencies**: PHASE5-001, PHASE8 integrations, PHASE6-002

---

#### PHASE7-005: Usage Analytics & Product Adoption Intelligence

**Story**: Track asset/product usage to support adoption and retirement decisions  
**Points**: 5  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Capture usage events for searches, views, exports, and access requests
- [ ] Dashboard shows top assets, dormant assets, and trend lines by domain
- [ ] Product-level adoption score visible with rolling 30/90-day windows
- [ ] Retirement candidates suggested by low usage + low dependency impact
- [ ] Usage analytics exportable for governance reporting

**Tasks**:

- Expand event capture model
- Build aggregation jobs and materialized metrics
- Add adoption analytics UI cards/charts
- Implement retirement candidate heuristics
- Add reporting endpoints
- Add tests

**Dependencies**: PHASE5-003, PHASE6-001

---

#### PHASE7-006: Collaborative Knowledge Layer

**Story**: Add comments, review threads, and steward knowledge capture on data assets  
**Points**: 5  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Asset pages support threaded comments and review notes
- [ ] Mention notifications available for tagged users/roles
- [ ] Decision log records why definitions or tags changed
- [ ] Moderation controls available to admins/stewards
- [ ] Comment and decision history retained for auditability

**Tasks**:

- Build comments and mention APIs
- Add threaded UI and markdown rendering
- Add moderation controls and retention policy
- Integrate events with audit logs
- Add tests

**Dependencies**: PHASE5-001, PHASE5-003

---

#### PHASE7-007: AI Context Layer & Agent Activation

**Story**: Deliver context APIs for AI assistants and agents (lineage, policy, semantics, trust)  
**Points**: 8  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Context API returns business meaning, lineage, policy, and trust attributes per asset
- [ ] Endpoint supports retrieval by natural-language question context
- [ ] Versioned context bundles can be generated for agent runtime consumption
- [ ] Context quality score and certification metadata included
- [ ] Access control enforced for all context payloads
- [ ] Usage traces captured for context request observability

**Tasks**:

- Define context contract schema
- Create context retrieval and packaging APIs
- Add NL query-to-asset resolution service
- Add policy guardrails for response shaping
- Instrument context usage telemetry
- Add tests + docs

**Dependencies**: PHASE3-001, PHASE4-001, PHASE7-003

---

#### PHASE7-008: In-Tool Activation (Teams/Slack/Excel)

**Story**: Surface catalog/search/trust insights inside collaboration and analyst tools  
**Points**: 5  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Users can search catalog assets from Teams/Slack command surface
- [ ] Asset cards include owner, trust, lineage depth, and request-access action
- [ ] Share-link previews resolve to secure read-only snapshots
- [ ] Excel add-in endpoint supports metadata lookup for selected fields/tables
- [ ] Usage telemetry tracks in-tool adoption

**Tasks**:

- Build lightweight activation API endpoints
- Add channel command handlers for Teams/Slack
- Implement secure share-card payloads
- Build Excel metadata lookup connector stub
- Add telemetry and tests

**Dependencies**: PHASE6-001, PHASE7-001, PHASE7-003

---

#### PHASE7-009: Playwright E2E Standardization & Smoke Coverage

**Story**: Standardize browser automation on Playwright and establish reliable end-to-end smoke coverage before Azure migration  
**Points**: 5  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Playwright is the primary and documented E2E framework
- [ ] Smoke suite covers auth, search, object detail, lineage, ingestion modes (SQL/SSIS/Markdown), and reporting export entry points
- [ ] CI pipeline executes Playwright smoke tests on PRs and on main branch merges
- [ ] Test artifacts include screenshots/traces for failed runs
- [ ] Local developer workflow supports one-command Playwright smoke execution

**Tasks**:

- Add Playwright config and baseline test project structure
- Implement core smoke specs for highest-risk user journeys
- Update CI workflow to run Playwright tests and publish artifacts
- Document local run/debug instructions in developer setup docs
- Standardize all backlog/docs references on Playwright

**Dependencies**: PHASE0-002, PHASE6-003

---

## Phase 7a: Business Glossary & Semantic Layer (3-4 weeks)

### Objectives

- Create a governed, shared language between business and technical teams
- Build a semantic layer linking business terms to physical data assets
- Enable consistent definitions across reports, dashboards, and analytics

### User Stories

#### PHASE7A-001: Business Glossary Management

**Story**: Build a comprehensive business glossary system where organizations define canonical business terms once and link them to data assets  
**Points**: 8  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Glossary terms support hierarchy (parent/child relationships)
- [ ] Each term includes definition, steward, business owner, related terms, and synonyms
- [ ] Terms can be linked to multiple data assets (tables, columns, dashboards)
- [ ] Version history tracks term definition changes with effective dates
- [ ] CRUD APIs for programmatic term management
- [ ] Bulk import/export of glossary terms (CSV, JSON)
- [ ] Search surfaces glossary matches prominently in discovery results

**Tasks**:

- Build glossary domain model and persistence layer
- Create glossary CRUD APIs with versioning
- Build glossary UI with term browser and editor
- Implement term-to-asset linking
- Add glossary search integration
- Wire up bulk import/export
- Add tests + documentation

**Dependencies**: PHASE3-001

---

#### PHASE7A-002: Semantic Asset Mapping

**Story**: Link business glossary terms to physical data assets automatically and manually  
**Points**: 5  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] UI allows mapping glossary terms to columns/tables
- [ ] Semantic mappings visible in asset detail pages and lineage views
- [ ] API enables programmatic semantic enrichment
- [ ] Search queries against business terms resolve to physical assets
- [ ] Lineage respects semantic mappings (propagate term meanings through pipelines)

**Tasks**:

- UI for mapping terms to assets
- Semantic query resolution engine
- Lineage enrichment with semantic meaning
- Add tests

**Dependencies**: PHASE7A-001

---

## Phase 7b: Data Classification & Sensitivity (2-3 weeks)

### Objectives

- Automatically classify data with sensitivity levels and regulatory categories
- Propagate classifications through data lineage
- Enable compliance-based access policies

### User Stories

#### PHASE7B-001: Data Classification Framework

**Story**: Build an extensible classification system to tag data assets with sensitivity and regulatory categories  
**Points**: 6  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Pre-built classification categories: Public, Confidential, Restricted, PII, PHI, GDPR, HIPAA, CCPA, Financial
- [ ] Custom classification categories creatable by admins
- [ ] Classifications support multi-level hierarchy
- [ ] Bulk classification APIs for batch tagging
- [ ] Classification appears in search facets and asset cards
- [ ] Classifications are version-tracked with change history

**Tasks**:

- Define classification schema and domain model
- Build admin UI for managing classification taxonomies
- Create bulk classification APIs
- Integrate classifications into search indexing
- Add tests

**Dependencies**: PHASE5-001

---

#### PHASE7B-002: Automated Classification Rules

**Story**: Auto-classify data assets based on column names, patterns, and metadata signals  
**Points**: 7  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Rule engine detects PII patterns (email, phone, SSN, name + address combinations)
- [ ] Regex-based rules for custom pattern detection
- [ ] Rules based on column naming conventions (e.g., columns containing "salary" → Financial)
- [ ] Auto-propagate classifications downstream through lineage
- [ ] Manual override capability with audit logging
- [ ] Classification confidence scores and audit trail
- [ ] Batch re-classification when rules change

**Tasks**:

- Build rule engine with pattern detection
- Implement PII detection library integration
- Create UI for managing classification rules
- Build lineage propagation logic
- Add observability + logging
- Add tests

**Dependencies**: PHASE7B-001, PHASE4-001

---

#### PHASE7B-003: Classification Policies & Enforcement

**Story**: Define and enforce policies based on data classifications (masking, encryption, access restrictions)  
**Points**: 8  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Policy templates for common scenarios (PII masking, GDPR encryption, financial audit trails)
- [ ] Policies define actions: mask, encrypt, restrict access, log usage
- [ ] Row-level security policies based on data classifications
- [ ] Column-level masking policies (e.g., show last 4 digits only for credit cards)
- [ ] Integration with database access controls
- [ ] Audit logging of all policy-driven access decisions
- [ ] Policy effectiveness dashboard

**Tasks**:

- Define policy domain model
- Build policy engine and enforcement layer
- Create policy template library
- Integrate with database security controls
- Build policy effectiveness reporting
- Add tests

**Dependencies**: PHASE7B-001, PHASE5-001

---

## Phase 7c: Data Quality Management & Profiling (4-5 weeks)

### Objectives

- Define, monitor, and enforce data quality standards
- Detect quality anomalies and data drift proactively
- Create quality scorecards enabling "fitness for purpose" assessments

### User Stories

#### PHASE7C-001: Data Quality Rules & Validation

**Story**: Enable data teams to define quality rules and validate against production data  
**Points**: 8  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] UI to define quality rules: null %, cardinality bounds, range checks, pattern matching, uniqueness
- [ ] Rules support thresholds with severity levels (warning, critical, fail)
- [ ] Rules can be triggered on schedule or on-demand
- [ ] Execution shows pass/fail status with violation details
- [ ] Failed rules generate incidents with alert routing
- [ ] Rule versioning and deployment workflows
- [ ] APIs for programmatic rule definition

**Tasks**:

- Build quality rules domain model
- Create rule execution engine
- Build UI for rule definition and management
- Integrate with incident management
- Add alert routing
- Add tests

**Dependencies**: PHASE4-001

---

#### PHASE7C-002: Data Profiling & Anomaly Detection

**Story**: Automatically profile data and detect anomalies, drift, and quality issues  
**Points**: 7  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Auto-profiling generates statistics: distribution, null %, cardinality, min/max/mean
- [ ] Anomaly detection flags unexpected patterns (e.g., unusual value distributions, sudden null spikes)
- [ ] Data drift detection compares profiles over time (daily, weekly, monthly)
- [ ] Findings surface in quality dashboard with trend lines
- [ ] Configurable anomaly sensitivity
- [ ] Export profiles for manual analysis

**Tasks**:

- Build profiling computation engine
- Implement statistical anomaly detection
- Create profiling scheduler
- Build quality dashboard UI
- Add visualization of drift trends
- Add tests

**Dependencies**: PHASE7C-001

---

#### PHASE7C-003: Data Quality Scorecard & Fitness

**Story**: Calculate enterprise data quality scores and "fitness for purpose" ratings  
**Points**: 6  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Quality score combines completeness, accuracy, timeliness, consistency metrics
- [ ] Fitness for purpose ratings for common use cases (finance reporting, ML training, analytics)
- [ ] Dataset-level and column-level quality scores
- [ ] Quality trends visible in asset cards and detail pages
- [ ] Quality scores factor into search ranking
- [ ] Quality SLA agreements and breach alerts
- [ ] Scorecard export for compliance reporting

**Tasks**:

- Define quality score formula
- Implement scoring engine
- Create fitness assessment framework
- Build SLA logic and alerting
- Integrate with search ranking
- Add tests

**Dependencies**: PHASE7C-001, PHASE7C-002

---

## Phase 7d: Metadata Management & Enrichment (3-4 weeks)

### Objectives

- Harvest and centralize metadata from all data systems
- Enrich metadata with business context
- Maintain a single source of truth for all data asset information

### User Stories

#### PHASE7D-001: Metadata Harvesting & Integration

**Story**: Automatically harvest technical metadata from databases, data warehouses, BI tools, and APIs  
**Points**: 9  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Connectors for: SQL Server, PostgreSQL, Snowflake, BigQuery, Databricks, Salesforce, SAP
- [ ] Harvest table/column schemas, data types, constraints, indexes
- [ ] Capture BI tool metadata (dashboards, reports, metrics definitions)
- [ ] Capture API specifications (OpenAPI/Swagger)
- [ ] Scheduled sync (daily, hourly) to keep metadata current
- [ ] Change detection and incremental updates
- [ ] Metadata versioning with historical snapshots
- [ ] Bulk import APIs for manual metadata injection

**Tasks**:

- Build connector framework
- Implement system-specific connectors
- Create scheduler for metadata harvesting
- Build versioning and change tracking
- Add metadata caching and optimization
- Add tests + documentation

**Dependencies**: PHASE2-001

---

#### PHASE7D-002: Data Dictionary & Schema Browser

**Story**: Create a comprehensive, navigable data dictionary showing all tables, columns, and transformations  
**Points**: 5  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Schema browser shows table hierarchies with filtering/searching
- [ ] Column details include: data type, nullable, constraints, sample values, statistics
- [ ] Column metadata includes: business definition, technical owner, usage frequency
- [ ] Transformation logic shown for computed/derived columns
- [ ] Links to documentation, owner contact info, related dashboards
- [ ] Historical view of schema changes (when columns added/removed/modified)
- [ ] Export schema documentation (PDF, HTML, Markdown)

**Tasks**:

- Build schema browser UI
- Add column detail views with context
- Implement schema history tracking
- Add schema change notifications to stewards
- Build schema export templates
- Add tests

**Dependencies**: PHASE7D-001

---

#### PHASE7D-003: Business Metadata & Enrichment

**Story**: Enable business teams to enrich technical metadata with descriptions, ownership, and business context  
**Points**: 5  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] UI to add/edit business descriptions for tables and columns
- [ ] Assign business owners, technical stewards, and domain managers
- [ ] Add business justifications for why data exists ("supports revenue forecasting")
- [ ] Tag with business domains and functional areas
- [ ] Link to business processes and use cases
- [ ] Track who contributed business metadata (audit trail)
- [ ] Bulk metadata enrichment via API/CSV import

**Tasks**:

- Build metadata editing UI
- Create ownership and domain assignment workflows
- Add business context linking
- Build audit trail for metadata changes
- Add bulk import capability
- Add tests

**Dependencies**: PHASE7D-001

---

## Phase 7e: Ownership & Stewardship (2-3 weeks)

### Objectives

- Establish clear accountability for data assets
- Automate stewardship workflows and notifications
- Enable stewards to manage their data portfolios

### User Stories

#### PHASE7E-001: Multi-Role Ownership Model

**Story**: Establish clear ownership with multiple roles (business owner, technical steward, data custodian, domain manager)  
**Points**: 5  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Data assets support: business owner, technical steward, domain manager, data custodian roles
- [ ] Each role has clearly defined responsibilities
- [ ] Ownership chain for escalations (e.g., escalate to domain manager if steward unavailable)
- [ ] Ownership inheritance rules (parent asset → child asset)
- [ ] Contact information and notification preferences per role
- [ ] Org chart integration to auto-assign managers as escalation path
- [ ] Bulk ownership assignment workflows

**Tasks**:

- Define ownership model and role responsibilities
- Build role assignment UI
- Implement escalation routing rules
- Add org chart integration
- Build bulk assignment workflows
- Add tests

**Dependencies**: PHASE5-001

---

#### PHASE7E-002: Steward Portfolio Dashboard

**Story**: Provide stewards with a portfolio dashboard showing their assets, quality, and action items  
**Points**: 6  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Dashboard shows owned/managed datasets with quality scores and status
- [ ] Alerts for quality issues, missing metadata, policy violations in owned assets
- [ ] Actionable tasks: "Complete description," "Approve schema change," "Address quality issue"
- [ ] Usage metrics showing who accesses owned datasets
- [ ] SLA compliance tracking per asset
- [ ] Reporting of metadata completeness in portfolio
- [ ] Trending of quality improvements over time

**Tasks**:

- Build steward dashboard UI
- Implement portfolio aggregation queries
- Add alert generation and routing
- Create SLA tracking logic
- Build trending analytics
- Add tests

**Dependencies**: PHASE7E-001, PHASE7C-001

---

#### PHASE7E-003: Stewardship Workflows & Tasks

**Story**: Automate governance tasks and route them to stewards for action  
**Points**: 7  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Automated task generation for: missing descriptions, missing owners, stale lineage, quality issues
- [ ] Tasks have priority, due dates, and escalation rules
- [ ] Task workflows: new → assigned → in-progress → blocked → resolved
- [ ] Assignment engine routes tasks to appropriate stewards
- [ ] SLA tracking for task resolution
- [ ] Bulk triage actions for stewards
- [ ] Notification integrations (email, Slack, Teams)

**Tasks**:

- Build task generation rules engine
- Create task assignment logic
- Implement workflow state machine
- Add SLA calculation and alerting
- Build notification integrations
- Add tests

**Dependencies**: PHASE7E-001

---

## Phase 7f: Access Control & Security (3-4 weeks)

### Objectives

- Implement role-based access control with fine-grained enforcement
- Support dynamic masking and row-level security
- Integrate with enterprise identity systems

### User Stories

#### PHASE7F-001: Role-Based Access Control (RBAC) Framework

**Story**: Build an RBAC system controlling access to data assets, admin functions, and sensitive operations  
**Points**: 7  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Pre-built roles: SystemAdmin, CatalogAdmin, DataOwner, DataSteward, DataViewer, DataAnalyst
- [ ] Custom role creation with permission selection
- [ ] Permissions cover: read catalog, edit asset metadata, manage access, approve requests, delete assets
- [ ] Role assignment at org/team/domain levels with inheritance
- [ ] Role-based catalog filtering (users only see assets they have access to)
- [ ] Audit logging of all permission changes
- [ ] Bulk role assignment via CSV/API

**Tasks**:

- Design RBAC permission matrix
- Build role and permission management APIs
- Implement catalog filtering based on roles
- Add role inheritance logic
- Build role assignment UI
- Add audit logging
- Add tests

**Dependencies**: PHASE1-002

---

#### PHASE7F-002: Sensitive Data Masking

**Story**: Implement dynamic column masking for sensitive data based on user roles and classifications  
**Points**: 8  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Masking policies: full mask, partial mask (last 4 digits), hash, null out
- [ ] Policies based on data classification and user role
- [ ] Masking applied transparently in query results and exports
- [ ] Unmasked access only for authorized roles (Finance, HR, Audit)
- [ ] Audit logging of all unmasked data access
- [ ] Performance impact monitored (masking cost tracked)
- [ ] Masking policy enforcement in API responses

**Tasks**:

- Build masking policy engine
- Implement masking transformation functions
- Add role-based masking logic
- Create masking in export/download handlers
- Add audit trail for unmasked access
- Add performance monitoring
- Add tests

**Dependencies**: PHASE7B-003, PHASE7F-001

---

#### PHASE7F-003: Data Access Request & Approval Workflow

**Story**: Enable secure request/approval workflow for elevated access to sensitive data  
**Points**: 7  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Users can request temporary access to masked datasets with business justification
- [ ] Requests routed to data owner with auto-expiration (30 days default)
- [ ] Approvers can approve, reject, or request more info
- [ ] Approved access provisions role to database with audit trail
- [ ] Reviewable audit log showing who accessed what data, when, why
- [ ] Periodic access recertification (quarterly reviews)
- [ ] SLA timers for stale requests

**Tasks**:

- Build request domain model and APIs
- Create approval workflow engine
- Implement request routing to owners
- Add temporary role provisioning
- Build audit trail
- Implement recertification workflow
- Add tests

**Dependencies**: PHASE7F-001

---

## Phase 7g: Compliance & Audit (3-4 weeks)

### Objectives

- Map regulatory requirements to data governance policies and controls
- Maintain comprehensive audit trails for compliance reporting
- Automate compliance evidence gathering

### User Stories

#### PHASE7G-001: Compliance Framework Management

**Story**: Define regulatory requirements and link them to data governance policies and controls  
**Points**: 6  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Pre-built compliance frameworks: GDPR, HIPAA, CCPA, SOX, PCI-DSS, industry-specific
- [ ] Custom framework creation for internal policies
- [ ] Each requirement maps to: data classification, access policies, retention policies, audit requirements
- [ ] Compliance status dashboard showing coverage
- [ ] Gap analysis identifying uncontrolled data/requirements
- [ ] Compliance requirement versioning with effective dates
- [ ] Evidence collection artifacts (policy screenshots, rule configs)

**Tasks**:

- Build compliance framework domain model
- Create compliance requirement editor UI
- Implement mapping engine (requirement → policy)
- Build gap analysis logic
- Create compliance dashboard
- Add evidence storage
- Add tests

**Dependencies**: PHASE7B-001, PHASE7F-001

---

#### PHASE7G-002: Comprehensive Audit Logging & Trails

**Story**: Maintain complete, tamper-evident audit logs of all data governance actions and data access  
**Points**: 8  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Logs capture: data access, metadata changes, permission changes, policy changes, quality issues
- [ ] Each log entry includes: actor, action, resource, timestamp, IP address, justification
- [ ] Immutable audit logs (append-only, cryptographically signed)
- [ ] Logs retained for compliance periods (7+ years default)
- [ ] Searchable audit log UI with filtering and export
- [ ] Real-time audit stream for SIEM integration
- [ ] Anomaly detection on audit trails (unusual access patterns)

**Tasks**:

- Build audit log schema and storage
- Implement immutable append-only log store
- Add audit events across all APIs
- Create audit log UI and search
- Build SIEM/streaming integration
- Add anomaly detection
- Add tests

**Dependencies**: PHASE1-002

---

#### PHASE7G-003: Compliance Reporting & Evidence

**Story**: Generate compliance reports and collect evidence for audits and certifications  
**Points**: 7  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Report templates for: GDPR compliance summary, HIPAA risk assessment, SOX control testing
- [ ] Automated report generation pulling audit and policy data
- [ ] Data mapping reports showing where regulated data is stored
- [ ] Control effectiveness reports (% of policies enforced, % of data classified)
- [ ] RTI/DSAR (Right To Information / Data Subject Access Request) handling workflows
- [ ] Export reports in PDF/Excel for compliance submissions
- [ ] Report distribution and approval workflows

**Tasks**:

- Build report template system
- Create automated report generation
- Implement RTI/DSAR workflows
- Add data mapping reports
- Build control effectiveness metrics
- Add report approval and distribution
- Add tests

**Dependencies**: PHASE7G-001, PHASE7G-002

---

## Phase 7h: Data Marketplace & Products (4-5 weeks)

### Objectives

- Build a marketplace where teams publish and consume curated data products
- Manage data product contracts and SLAs
- Enable self-service access with governance built-in

### User Stories

#### PHASE7H-001: Data Products & Marketplace

**Story**: Enable teams to publish data products with clear contracts and consume them through a marketplace  
**Points**: 10  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Data product definition includes: description, owner, SLAs (freshness, availability), tags, target audience
- [ ] Product lifecycle: draft → review → published → deprecated
- [ ] Product versions with change history
- [ ] Marketplace UI showing available products, quality scores, adoption metrics
- [ ] Product detail includes linked datasets, lineage, quality scorecards
- [ ] Usage metrics and adoption tracking per product
- [ ] Product discoverability through search and filters
- [ ] Product recommendations based on user role and team

**Tasks**:

- Build product domain model and lifecycle
- Create product publishing workflows
- Build marketplace UI and discovery
- Implement product versioning
- Add adoption analytics
- Build recommendation engine
- Add tests

**Dependencies**: PHASE3-001, PHASE7E-001

---

#### PHASE7H-002: Data Product Contracts & SLAs

**Story**: Define and enforce data product contracts specifying schema guarantees, freshness, quality, and access terms  
**Points**: 8  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Contract defines: schema expected, refresh/freshness SLA, availability % target, quality thresholds
- [ ] Expected vs. actual contract violations tracked and surfaced
- [ ] Consumers can subscribe to SLA violations (alerts when breached)
- [ ] Contract versions enable backward compatibility tracking
- [ ] Effective dates for contract changes
- [ ] Multi-tier contracts (gold/silver/bronze) with different SLAs
- [ ] SLA violations impact product trust score

**Tasks**:

- Build contract domain model
- Implement SLA violation detection
- Create contract violation dashboard
- Add alert subscriptions
- Implement versioning and effective dating
- Build trust score impact calculation
- Add tests

**Dependencies**: PHASE7H-001, PHASE7C-001

---

#### PHASE7H-003: Data Access Requests & Fulfillment

**Story**: Enable governed request, approval, and fulfillment workflow for data product access  
**Points**: 8  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Users request access from product detail page with business justification
- [ ] Requests routed to data owner for review/approval
- [ ] Approval triggers fulfillment (provision access, send credentials, schedule training)
- [ ] Request lifecycle visible (submitted → review → approved → fulfilled)
- [ ] SLA timer for approval turnaround
- [ ] Auto-expiration of access after defined period (default 90 days)
- [ ] Audit trail of all requests, approvals, and access grants
- [ ] Bulk request handling for teams

**Tasks**:

- Build request domain model and APIs
- Create approval workflows and routing
- Implement fulfillment orchestration
- Add SLA tracking and alerting
- Build request history and auditability
- Add auto-expiration logic
- Add tests

**Dependencies**: PHASE7H-001, PHASE7F-003

---

## Phase 7i: Data Governance Workflows & Orchestration (3-4 weeks)

### Objectives

- Automate governance processes end-to-end
- Route tasks to appropriate teams with SLA tracking
- Eliminate manual governance bottlenecks

### User Stories

#### PHASE7I-001: Workflow Engine & Automation Rules

**Story**: Build a rule-based engine to automate governance workflows (onboarding, approvals, reviews)  
**Points**: 9  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Rules trigger on events: new dataset detected, quality issue found, policy violated, access requested
- [ ] Rule actions: auto-classify, assign task, create incident, notify team, escalate
- [ ] Workflow templates for: dataset onboarding, quality remediation, compliance review, access approval
- [ ] Conditional logic (if statement) in rules (e.g., "if PII found, assign to privacy officer")
- [ ] Bulk rule creation and management
- [ ] Rule execution history with audit logging
- [ ] Rule versioning and deployment workflows
- [ ] Testing/simulation before rule activation

**Tasks**:

- Build rule engine and DSL
- Create workflow templates
- Implement event triggers and actions
- Build rule management UI
- Add testing/simulation
- Implement audit logging
- Add tests

**Dependencies**: PHASE7E-003

---

#### PHASE7I-002: Task Management & SLA Tracking

**Story**: Create a comprehensive task management system with priority, assignment, and SLA enforcement  
**Points**: 6  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Tasks created with: title, description, owner, due date, priority
- [ ] Task types: metadata completion, quality issue resolution, policy approval, access review
- [ ] Task board UI (kanban view) showing workflow states
- [ ] Auto-assignment to stewards based on data domain
- [ ] SLA alerts when tasks approach due date
- [ ] Escalation rules for overdue tasks
- [ ] Task templates for repeatable processes

**Tasks**:

- Build task domain model
- Create task board UI (kanban)
- Implement SLA tracking and alerts
- Add escalation logic
- Build task templates
- Add notification integrations
- Add tests

**Dependencies**: PHASE7I-001, PHASE7E-002

---

#### PHASE7I-003: Approval & Sign-Off Workflows

**Story**: Route data governance decisions for approval with audit trails and compliance evidence  
**Points**: 7  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Decisions requiring approval: schema changes, policy exceptions, sensitive data access, compliance reviews
- [ ] Workflow shows who approved, when, with reasoning
- [ ] Multi-step approvals (data owner → domain manager → compliance officer)
- [ ] Can request changes/clarifications before approval
- [ ] Approval history retained for audit
- [ ] Deadline tracking with escalations
- [ ] Bulk approval capabilities for stewards

**Tasks**:

- Build approval domain model
- Create multi-step approval workflows
- Implement deadline and escalation logic
- Build approval history UI
- Add audit trail
- Add tests

**Dependencies**: PHASE7I-001

---

## Phase 7j: Trust Signals & Certification (2-3 weeks)

### Objectives

- Build a trust framework to help users identify production-safe, reliable data
- Implement certification and endorsement workflows
- Surface trust indicators in search and discovery

### User Stories

#### PHASE7J-001: Data Trust & Certification Framework

**Story**: Implement a trust scoring system and certification workflow for data assets  
**Points**: 7  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Trust score calculated from: quality metrics, ownership completeness, policy compliance, lineage completeness
- [ ] Certification levels: certified (production-ready) → provisional (use with caution) → deprecated
- [ ] Stewards can certify assets with reason codes and effective dates
- [ ] Certification history visible with change tracking
- [ ] Trust badges appear in search results and asset cards
- [ ] Trust score impacts search ranking and recommendations
- [ ] Trust status notifications sent to consumers when changes occur

**Tasks**:

- Define trust score formula
- Build certification workflow UI
- Implement trust score calculation engine
- Add trust badges to UI
- Integrate with search ranking
- Add notification integration
- Add tests

**Dependencies**: PHASE7C-001, PHASE7E-001

---

#### PHASE7J-002: Data Endorsements & Quality Guarantees

**Story**: Enable domain experts and stewards to endorse data assets with quality guarantees  
**Points**: 5  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Stewards/domain experts can endorse datasets with confidence level (high/medium/low)
- [ ] Endorsements include: reason, guarantees (e.g., "tested on 1M+ records"), conditions of use
- [ ] Endorsement history with reversal/revocation capability
- [ ] Endorsements visible in asset cards and detail pages
- [ ] Multiple endorsements aggregated into trust score
- [ ] Endorsement search facet

**Tasks**:

- Build endorsement model and APIs
- Create endorsement UI
- Integrate endorsements into trust scoring
- Add endorsement history
- Add search facet
- Add tests

**Dependencies**: PHASE7J-001

---

## Phase 7k: Collaboration & Knowledge Layer (2-3 weeks)

### Objectives

- Enable teams to share knowledge about data assets
- Capture institutional knowledge through comments and annotations
- Surface expert insights in search and discovery

### User Stories

#### PHASE7K-001: Comments & Threaded Discussions

**Story**: Add commenting and discussion capabilities to data assets for knowledge sharing  
**Points**: 5  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Users can comment on assets and create threaded discussions
- [ ] Comments support markdown with code syntax highlighting
- [ ] Mentions (@user) trigger notifications
- [ ] Comments visible on asset detail pages in chronological order
- [ ] Edit and delete capabilities with audit trails
- [ ] Comment moderation (admins can remove inappropriate posts)
- [ ] Real-time comment notifications

**Tasks**:

- Build comment domain model
- Create comment UI with threading
- Implement mention notifications
- Add moderation controls
- Wire up real-time updates (WebSocket)
- Add audit trail
- Add tests

**Dependencies**: PHASE3-001

---

#### PHASE7K-002: Asset Guidelines & Decision Logs

**Story**: Document guidelines, warnings, and decisions on data assets for future consumers  
**Points**: 6  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Stewards can add guidelines (e.g., "Use filtered version at table/filtered for personal data")
- [ ] Warnings surface issues (e.g., "Quality issues detected 3/15-3/16, resolved")
- [ ] Decision log tracks why definitions/tags changed
- [ ] Guidelines show in asset detail pages before access
- [ ] Guideline edit history retained
- [ ] Guidelines searchable from discovery
- [ ] Can mark guidelines as resolved when issues fixed

**Tasks**:

- Build guideline + decision log model
- Create guideline UI on asset pages
- Implement decision log tracking
- Add guideline history
- Integrate into search
- Add tests

**Dependencies**: PHASE7K-001

---

#### PHASE7K-003: Steward Annotations & Expert Reviews

**Story**: Enable stewards to annotate assets with expert reviews and best practices  
**Points**: 5  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Stewards can add annotations: "Data quality issues, use with caution", "Recently migrated to Snowflake"
- [ ] Annotations include: type (warning/info/deprecated), timeframe (current/historical)
- [ ] Annotations visible badge on asset cards
- [ ] Annotation history retained
- [ ] Annotations editable by steward/admin
- [ ] Notifications when annotation added/changed

**Tasks**:

- Build annotation model
- Create annotation UI
- Add notification integration
- Implement history tracking
- Add tests

**Dependencies**: PHASE7K-001

---

## Phase 7l: Usage Analytics & Product Adoption (2-3 weeks)

### Objectives

- Track data asset and product usage patterns
- Identify dormant and high-value assets
- Guide retirement and investment decisions

### User Stories

#### PHASE7L-001: Usage Event Capture & Analytics

**Story**: Capture and analyze usage events to understand asset popularity and dependency patterns  
**Points**: 7  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Events captured: asset searched, asset viewed, dataset exported, API queried, report run
- [ ] Usage dashboard shows: top assets, trending assets, dormant assets
- [ ] Time-series analytics: usage over 30/90/365 day windows
- [ ] User cohort analysis (new vs. existing users)
- [ ] Export usage analytics for business reporting
- [ ] Usage data retention (90+ days minimum)
- [ ] Privacy-compliant usage tracking (no PII in events)

**Tasks**:

- Define usage event schema
- Build event ingestion pipeline
- Create usage analytics engine
- Build usage dashboard UI
- Add export capabilities
- Implement privacy guardrails
- Add tests

**Dependencies**: PHASE3-001

---

#### PHASE7L-002: Asset Adoption Scoring & Recommendations

**Story**: Score assets by adoption level and recommend high-value assets to teams  
**Points**: 6  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Adoption score combines: unique users, query/view frequency, dependency count, quality score
- [ ] Adoption scores visible in asset cards and dashboards
- [ ] Adoption trending over time
- [ ] Recommendations: "Similar teams are using this dataset, recommended for you"
- [ ] Adoption goals trackable (e.g., "Get dataset to 100+ monthly users")
- [ ] Export adoption scorecards
- [ ] Adoption benchmarks by data domain

**Tasks**:

- Define adoption scoring formula
- Build adoption scoring engine
- Create recommendation engine
- Build adoption trend visualization
- Add benchmarking
- Add tests

**Dependencies**: PHASE7L-001

---

#### PHASE7L-003: Retirement & Decommissioning Recommendations

**Story**: Identify candidates for retirement and automate decommissioning workflows  
**Points**: 6  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Retirement candidates identified: no usage (90+ days), low quality, deprecated versions
- [ ] Decommissioning workflow: mark deprecated → notify users → grace period → delete
- [ ] Communication templates for deprecation notices
- [ ] Migration paths suggested (alternative/replacement dataset)
- [ ] Retention policies enforced (financial data kept 7y minimum)
- [ ] Decommissioning audit trail

**Tasks**:

- Build retirement candidate algorithm
- Create decommissioning workflow
- Implement migration recommendation engine
- Add deprecation communication
- Add retention policy logic
- Add tests

**Dependencies**: PHASE7L-001, PHASE7H-001

---

## Phase 7m: Data Observability & Monitoring (3-4 weeks)

### Objectives

- Monitor real-time health of data products and assets
- Detect issues before they impact consumers
- Track SLA compliance and performance

### User Stories

#### PHASE7M-001: Data Pipeline Monitoring & SLA Tracking

**Story**: Monitor data pipeline freshness, latency, and volume with SLA-based alerting  
**Points**: 7  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] SLA definition per asset: freshness (e.g., daily by 8 AM), volume thresholds, latency targets
- [ ] Real-time dashboard showing pipeline status (green/yellow/red)
- [ ] Auto-alerts when SLA thresholds breached
- [ ] Historical SLA compliance tracking
- [ ] Root cause analysis when SLA breached (downstream impact)
- [ ] Configurable escalation rules based on domain/product
- [ ] SLA compliance reports for stakeholders

**Tasks**:

- Build SLA model and schema
- Create pipeline monitoring engine
- Implement SLA breach detection
- Build monitoring dashboard UI
- Add alerting integration
- Implement root cause analyzer
- Add tests

**Dependencies**: PHASE4-001

---

#### PHASE7M-002: Data Anomaly Detection & Drift Monitoring

**Story**: Detect anomalies and data drift automatically with ML-based detection  
**Points**: 8  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Anomaly detection for: unusual record counts, unexpected value distributions, schema changes
- [ ] Drift detection compares current vs. historical data patterns
- [ ] Alerts trigger automatically on significant drift
- [ ] Anomaly severity classified (warning vs. critical)
- [ ] Explainability showing what changed vs. baseline
- [ ] User feedback loop to improve detection accuracy
- [ ] Configurable sensitivity per asset

**Tasks**:

- Implement statistical anomaly detection
- Build ML-based drift detection
- Create anomaly explanation engine
- Build anomaly dashboard
- Add feedback collection
- Implement sensitivity tuning
- Add tests

**Dependencies**: PHASE7C-002

---

#### PHASE7M-003: Schema Change & Breaking Change Detection

**Story**: Monitor for schema changes and flag breaking changes that impact downstream consumers  
**Points**: 6  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Detect schema changes: column add/drop/rename, type changes, constraint changes
- [ ] Classify changes: non-breaking vs. breaking vs. deprecated
- [ ] Alert to dependent consumers before breaking changes deploy
- [ ] Versioning strategy: major/minor versions for breaking/non-breaking
- [ ] Migration guides for breaking changes
- [ ] Rollback capability if breaking change detected

**Tasks**:

- Build schema version tracking
- Implement change detection logic
- Create change impact analyzer
- Build breaking change alerts
- Add versioning support
- Implement migration guides
- Add tests

**Dependencies**: PHASE7D-001

---

## Phase 7n: Data Incident Management (2-3 weeks)

### Objectives

- Create structured incident response workflows
- Reduce mean time to resolution
- Prevent recurring incidents through root cause analysis

### User Stories

#### PHASE7N-001: Incident Creation & Routing

**Story**: Auto-create incidents for quality issues, access problems, and SLA breaches with intelligent routing  
**Points**: 6  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Incidents auto-created from: quality rule failures, SLA breaches, anomaly detection
- [ ] Incident details include: asset, issue description, severity, impact assessment
- [ ] Incident classification: data quality, access/security, performance, compliance
- [ ] Intelligent routing: incident assigned to data owner/steward by default
- [ ] Escalation rules if owner doesn't acknowledge within SLA
- [ ] Incident tracking number for communication

**Tasks**:

- Build incident domain model
- Create incident creation triggers
- Implement routing logic
- Build incident visibility UI
- Add escalation logic
- Add tests

**Dependencies**: PHASE7M-001

---

#### PHASE7N-002: Incident Resolution & Root Cause Analysis

**Story**: Track incident lifecycle and capture root cause analysis and corrective actions  
**Points**: 7  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Incident states: created → acknowledged → in-progress → resolved → closed
- [ ] Root cause template: what went wrong, why, how to prevent
- [ ] Corrective actions tracked: improve data quality rule, update documentation, process change
- [ ] Resolution timeline and MTTR metrics
- [ ] Post-incident reviews with team sign-offs
- [ ] Corrective action tracking (is it implemented?)
- [ ] Audit trail of all incident-related changes

**Tasks**:

- Build incident lifecycle
- Create root cause template and UI
- Implement corrective action tracking
- Build MTTR analytics
- Add post-incident review workflow
- Build incident reporting
- Add tests

**Dependencies**: PHASE7N-001

---

#### PHASE7N-003: Incident Communication & Notifications

**Story**: Notify affected users during incidents and track communication history  
**Points**: 5  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Automatic notifications to dependent teams (asset consumers, dashboard users)
- [ ] Incident status page showing ongoing issues
- [ ] User notification preferences (email, Slack, Teams)
- [ ] Communication history on incident detail
- [ ] Estimated time to resolution communicated to users
- [ ] Post-resolution notification when issue resolved

**Tasks**:

- Build notification system for incidents
- Create incident status page UI
- Add communication template
- Implement notification routing
- Add communication history tracking
- Add tests

**Dependencies**: PHASE7N-001

---

## Phase 7o: Data Impact Analysis & Lineage (2-3 weeks)

### Objectives

- Enable rapid impact analysis of data changes
- Visualize blast radius before making changes
- Prevent surprise downstream failures

### User Stories

#### PHASE7O-001: Blast Radius Analysis

**Story**: Instantly identify all downstream systems and users impacted by a data change  
**Points**: 6  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Impact query: "If I change this column, what breaks?"
- [ ] Results show: tables, reports, dashboards, ML models, integrations affected
- [ ] Severity classification based on criticality of dependent systems
- [ ] User/team list of who is impacted
- [ ] Historical impact analysis (what changed when)
- [ ] Export impact report for change management

**Tasks**:

- Build impact analysis engine
- Implement blast radius calculation
- Create impact UI showing dependency tree
- Add severity classification
- Build impact reports
- Add tests

**Dependencies**: PHASE4-001

---

#### PHASE7O-002: Change Impact Risk Assessment

**Story**: Assess risk of proposed data changes and recommend mitigation  
**Points**: 6  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Risk assessment factors: number of dependents, criticality score, SLA impact, complexity
- [ ] Risk level: low/medium/high/critical
- [ ] Recommendations: communication plan, testing strategy, rollback plan
- [ ] Change review workflow (schedule reviewers based on risk)
- [ ] Approval gating for high-risk changes
- [ ] Post-change validation checklist

**Tasks**:

- Build risk assessment formula
- Create recommendation engine
- Implement change review workflow
- Build approval gating
- Add validation checklist
- Add tests

**Dependencies**: PHASE7O-001

---

#### PHASE7O-003: Dependency Graph Visualization

**Story**: Build interactive visualization of data dependencies and lineage paths  
**Points**: 7  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Interactive graph showing: data sources → transformations → destinations
- [ ] Node types: source systems, staging tables, marts, reports, dashboards, ML models
- [ ] Color coding by health status (green/yellow/red)
- [ ] Drill-down from high-level to detailed lineage
- [ ] Filtering by: domain, criticality, owner
- [ ] SVG export for documentation
- [ ] Mobile-responsive graph view

**Tasks**:

- Implement graph visualization (Cytoscape.js/D3.js)
- Build interactive navigation
- Add filtering and search
- Implement drill-down
- Add export capability
- Add tests

**Dependencies**: PHASE4-001

---

## Phase 7p: API Integration & Governance Everywhere (3-4 weeks)

### Objectives

- Expose governance capabilities via comprehensive APIs
- Enable third-party tools to embed governance
- Build governance integrations in existing workflows

### User Stories

#### PHASE7P-001: Governance Context API

**Story**: Build comprehensive API exposing catalog, lineage, quality, policy, and trust data for AI agents and third-party tools  
**Points**: 8  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] GraphQL API for flexible querying of: assets, lineage, quality, policies, ownership, trust
- [ ] REST API endpoints for common queries (asset by ID, lineage, dependents)
- [ ] Query by natural language ("show me all PII datasets") with semantic resolution
- [ ] Versioned API with semantic versioning
- [ ] API rate limiting and authentication (OAuth/API keys)
- [ ] API usage analytics and monitoring
- [ ] OpenAPI/Swagger documentation with SDK generation

**Tasks**:

- Design API schema and endpoints
- Implement GraphQL endpoint
- Build semantic query resolver
- Create REST endpoint wrappers
- Add authentication and rate limiting
- Generate SDKs for Python/JavaScript
- Add documentation and tests

**Dependencies**: All previous phases

---

#### PHASE7P-002: Third-Party Tool Integrations

**Story**: Build integration connectors to embed governance in BI tools, notebooks, and IDEs  
**Points**: 7  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Integrations: Tableau, Power BI, Jupyter, VS Code, Looker
- [ ] Embed lineage viewer in dashboards
- [ ] Surface data quality scores in BI tools
- [ ] Enable asset search from within BI/notebook context
- [ ] Link BI objects back to catalog assets
- [ ] Access control enforced in all integrations
- [ ] Integration marketplace for community plugins

**Tasks**:

- Build integration framework
- Implement BI tool connectors (Tableau, Power BI, Looker)
- Build Jupyter/notebook extensions
- Create VS Code extension
- Implement reverse linking
- Build marketplace
- Add tests

**Dependencies**: PHASE7P-001

---

#### PHASE7P-003: Governance Webhooks & Event Streaming

**Story**: Stream governance events to external systems for real-time governance orchestration  
**Points**: 6  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Webhook delivery for: asset created/updated, quality issue detected, SLA breached, incident created
- [ ] Event schema includes: event type, resource, timestamp, actor, details
- [ ] Retry logic with exponential backoff
- [ ] Event filtering by type and resource
- [ ] Fan-out to multiple webhook subscribers
- [ ] Event signing for webhook verification
- [ ] Event replay capability for debugging

**Tasks**:

- Build webhook infrastructure
- Implement event streaming
- Create webhook management UI
- Add retry and delivery tracking
- Implement event signing
- Build event replay
- Add tests

**Dependencies**: PHASE7P-001

---

## Phase 7q: Governance Maturity & ROI Metrics (2-3 weeks)

### Objectives

- Measure governance program effectiveness
- Track ROI and business impact
- Drive continuous improvement through KPIs

### User Stories

#### PHASE7Q-001: Governance KPI Dashboard

**Story**: Create executive dashboard tracking governance program maturity and business impact  
**Points**: 6  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] KPIs tracked: data discovery time, policy compliance %, quality score trend, incident MTTR
- [ ] Adoption metrics: active users, queries, data products published, adoption rate
- [ ] Data quality KPIs: % of assets meeting quality standards, quality violations/month
- [ ] Compliance KPIs: % of data classified, % of assets with owners, audit readiness score
- [ ] Dashboard shows trends over time and forecasting
- [ ] Benchmarking against industry standards
- [ ] Drill-down to detailed metrics

**Tasks**:

- Define KPI framework
- Build KPI calculation engine
- Create executive dashboard UI
- Add trend analysis and forecasting
- Implement benchmarking data
- Add export to PowerPoint/PDF
- Add tests

**Dependencies**: All previous phases

---

#### PHASE7Q-002: ROI & Business Impact Tracking

**Story**: Quantify governance program ROI and business value enablement  
**Points**: 6  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] ROI metrics: time saved, risk reduced, revenue enabled by data initiatives
- [ ] Time saved calculated from: discovery time reduction × employee hours × hourly rate
- [ ] Risk reduced from: compliance gaps closed, incidents prevented, data breach reduction
- [ ] Revenue enabled from: data products launched, new insights discovered, faster decision-making
- [ ] Cost tracking: platform cost, team cost, implementation cost
- [ ] Business case reporting for stakeholder communication
- [ ] Payback period and NPV calculations

**Tasks**:

- Define ROI framework
- Build business impact model
- Create ROI calculation engine
- Implement time tracking integration
- Build business case templates
- Create ROI reporting UI
- Add tests

**Dependencies**: PHASE7Q-001

---

## Phase 7r: Glossary SME Management & Workflows (2-3 weeks)

### Objectives

- Establish governance of the business glossary itself
- Create workflows for SME review and approval
- Ensure business definitions stay current and accurate

### User Stories

#### PHASE7R-001: Glossary Term Review & Approval Workflow

**Story**: Create approval workflows for glossary terms requiring business SME sign-off  
**Points**: 5  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] New glossary terms require approval from domain SME before publishing
- [ ] Modification to existing terms trigger review workflows
- [ ] Approval UI shows: proposed definition, impact (downstream asset links), SME comments
- [ ] Multiple SMEs can review and approve terms
- [ ] Approval history retained with versioning
- [ ] Auto-notify SMEs when terms need review
- [ ] SLA tracking for term approval

**Tasks**:

- Build term approval workflow
- Create term review UI
- Implement SME routing logic
- Add approval history
- Wire up notifications
- Add tests

**Dependencies**: PHASE7A-001

---

#### PHASE7R-002: Glossary Stewardship & Governance

**Story**: Appoint glossary stewards responsible for definition accuracy and updates  
**Points**: 4  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [ ] Glossary stewardship roles: glossary owner, domain SMEs, term approvers
- [ ] Stewardship dashboard showing term quality, stale definitions, pending reviews
- [ ] Automated reminders: "No updates in 90 days, please review definitions"
- [ ] Term deprecation workflows for unused/outdated terms
- [ ] Glossary change audit trail
- [ ] Glossary health metrics (% terms reviewed, % with owners)

**Tasks**:

- Build stewardship model
- Create stewardship dashboard
- Implement review reminders
- Add deprecation workflow
- Build glossary health metrics
- Add tests

**Dependencies**: PHASE7R-001

---

---

## Phase 8: Azure Cloud Epic

### Objectives

- Migrate platform from local/dev baseline to enterprise Azure production posture
- Operationalize security, observability, scalability, and DR controls

### User Stories

#### AZURE-001: Azure Runtime & Data Plane Migration

**Story**: Deploy application runtime, metadata storage, and search services to Azure-managed infrastructure  
**Points**: 13  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Frontend/API deployed to Azure App Service or AKS
- [ ] Metadata persistence migrated to Azure SQL
- [ ] Blob storage configured for artifacts/exports
- [ ] Redis cache enabled for session/performance paths
- [ ] Production networking and private endpoints configured

**Dependencies**: CLOUD_MIGRATION_RUNBOOK.md

---

#### AZURE-002: Azure Security, Compliance, and Operations

**Story**: Implement cloud security baseline, monitoring, deployment governance, and DR runbooks  
**Points**: 13  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [ ] Managed Identity + Key Vault integrated for secretless runtime
- [ ] App Insights + Log Analytics + alert rules configured
- [ ] Backup/restore + failover runbooks validated
- [ ] RBAC, policy, and environment promotion guardrails enforced
- [ ] SLOs and operational dashboards published

**Dependencies**: AZURE-001, docs/CLOUD_MIGRATION_RUNBOOK.md

---

## Definition of Done

For all user stories, acceptance criteria include:

- ✅ Code written with >80% unit test coverage
- ✅ Peer reviewed and approved
- ✅ Integrated into main branch
- ✅ Deployed to staging environment
- ✅ Performance tested (if applicable)
- ✅ Documentation written
- ✅ No high/critical security issues

---

## Risk Mitigation

| Risk                        | Mitigation                                                                        |
| --------------------------- | --------------------------------------------------------------------------------- |
| Markdown parsing complexity | Invest time in parser early (Phase 2). Use existing libraries if possible.        |
| Performance at scale        | Profile early. Implement caching + pagination. Test with large datasets.          |
| Entra ID integration delays | Start early. Have fallback local auth for dev. Test tenant setup well in advance. |
| Visualization complexity    | Use well-maintained libraries (Cytoscape, D3). Build incrementally.               |
| Scope creep                 | Strict MVP boundary. Post-Phase-6 features go to Phase 7+.                        |
