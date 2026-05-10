# Comprehensive Project Backlog

# Data Governance & Dependency Visualization Platform (Markdown-First Edition)

**Version:** 3.0  
**Last Updated:** May 8, 2026  
**Architecture**: Markdown-Driven, File-Based, Meilisearch Powered

---

## Executive Summary

This backlog contains the complete delivery history for MVP phases and the forward roadmap. Legacy delivery (Phase 0-10) is complete, and post-launch epics are now prioritized for marketplace, trust, AI-context, and cloud scale.

**Estimated Timeline**: 8-10 months for MVP + Phase 1  
**Recommended Team**: 4-5 developers + 1 architect + 1 QA  
**Tech Stack**: Node.js/Express (BFF), Vue.js/React (Frontend), Meilisearch (Search), Cytoscape.js/D3.js (Visualization), Entra ID (Auth)

> **Non-Negotiable Principles**:
>
> - Markdown is the source of truth (not SQL Server scanning)
> - All data lineage defined in organization markdown files with YAML frontmatter
> - BFF API layer handles all business logic
> - Every API request checks database-level RBAC
> - Modern, interactive visualizations (Cytoscape.js, D3.js, Mermaid)

---

## Project Phases Overview

| Phase       | Name                             | Duration  | Key Objective                                                    | Priority    | Status     |
| ----------- | -------------------------------- | --------- | ---------------------------------------------------------------- | ----------- | ---------- |
| **Phase 0** | Foundation & DevOps              | 1-2 weeks | Docker, CI/CD, testing framework, repo structure                 | 🔴 CRITICAL | ✅ Done    |
| **Phase 1** | Auth & BFF Skeleton              | 2-3 weeks | Entra ID integration, permission layer, API routes               | 🔴 CRITICAL | ✅ Done    |
| **Phase 2** | Markdown Parsing & Indexing      | 2-3 weeks | Parse markdown YAML, extract lineage, index in Meilisearch       | 🔴 CRITICAL | ✅ Done    |
| **Phase 3** | Search & Discovery               | 1-2 weeks | Full-text search, faceted filtering, search UI                   | 🔴 CRITICAL | ✅ Done    |
| **Phase 4** | Visualization Layer              | 3-4 weeks | Interactive graphs, impact analysis, matrices, D3.js integration | 🟠 HIGH     | ✅ Done    |
| **Phase 5** | Admin Dashboard                  | 2-3 weeks | User management, permission matrix, audit logs                   | 🟠 HIGH     | ✅ Done    |
| **Phase 6** | Reporting & Polish               | 2 weeks   | Export, PDF generation, performance tuning                       | 🟠 HIGH     | ✅ Done    |
| **Phase 7** | Competitive Parity & Product Ops | 4-6 weeks | Marketplace, trust, workflow, AI context                         | 🔴 CRITICAL | 🟡 Planned |
| **Phase 8** | Azure Cloud Epic                 | 4-8 weeks | Azure production migration and operational hardening             | 🔴 CRITICAL | 🟡 Planned |

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
