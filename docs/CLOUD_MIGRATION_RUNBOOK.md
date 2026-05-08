# Cloud Migration Runbook
# Data Governance & Dependency Visualization Platform

**Version:** 1.0  
**Last Updated:** May 8, 2026  
**Goal:** Migrate from local markdown-centric operation to enterprise Azure deployment with Entra ID, managed services, and CI/CD.

> **Non-Negotiable Engineering Guardrails:** Cloud migration execution must preserve **BFF** boundaries for frontend APIs and apply **IaC First** controls for all platform changes.

---

## 1. Current State vs Future State

### Current State (Today)
- Repository contains strategic and governance documentation only
- No running application services yet
- No metadata database deployed
- Markdown content is intended to live in folders and Git
- No import pipeline, no API, no admin UI, no production CI/CD

### Future State (Target)
- Production web platform deployed in Azure
- Markdown files ingested via import service and continuously synced
- Azure SQL stores metadata index, RBAC bindings, audits, import history, and lineage snapshots
- Azure Blob stores object docs and export artifacts
- Entra ID handles SSO and role claims
- CI/CD validates markdown contracts and deploys safely
- Monitoring, alerts, and audit compliance enabled

---

## 2. Azure Target Architecture

## 2.1 Core Platform Services
- **Frontend + API runtime**: Azure App Service (or AKS for larger scale)
- **Metadata database**: Azure SQL Database
- **Object/document storage**: Azure Blob Storage
- **Cache/session**: Azure Cache for Redis
- **Background jobs/import workers**: Azure Container Apps Jobs or Functions
- **Secrets management**: Azure Key Vault
- **Identity and auth**: Microsoft Entra ID (OIDC/OAuth2)
- **Observability**: Application Insights + Log Analytics
- **CI/CD**: GitHub Actions + Azure deployment actions

## 2.2 Data Plane Model
- **Markdown source of truth**: Git repo path or Blob container
- **Ingestion index**: Azure SQL tables for object keys and doc linkage
- **Artifacts**: Blob storage for rendered docs, PDFs, and exports
- **Audit logs**: SQL + Log Analytics retention policies

## 2.3 Security Model
- Managed Identity for app-to-Azure service access
- Private endpoints for Azure SQL, Storage, and Key Vault
- Entra groups mapped to app roles (Admin/Power User/Analyst/Viewer)
- Row/object-level checks in API based on role claims
- Immutable audit trail and least-privilege access

---

## 3. Markdown Import Contract (Cloud-Safe)

Every markdown file should include frontmatter with a stable identity key.

Example:

```yaml
---
object_key: PROD.Sales.dbo.Customer
database_platform: sqlserver
object_type: table
environment: prod
owner: data-platform
classification: confidential
source_systems:
  - CRM
last_verified_at: 2026-05-08
---
```

Required rules:
- `object_key` must be globally unique
- `object_type` must be from allowed enum
- `environment` must be from allowed enum (`dev`, `test`, `prod`)
- required sections in markdown body (`Description`, `Dependencies`, `Change Impact`, `Operational Notes`)
- links must resolve and no duplicate keys per import batch

---

## 4. Migration Phases

## Phase 0: Foundation (1-2 weeks)
Objectives:
- Establish Azure landing zone and environments (dev/test/prod)
- Create baseline IaC and secrets model

Tasks:
- Create Azure resource groups per environment
- Deploy Key Vault, App Insights, Log Analytics
- Configure Entra app registration and group mapping
- Set up GitHub environments and deployment protections

Exit Criteria:
- All core Azure services reachable
- Entra login test succeeds in non-prod

## Phase 1: Application Baseline (2-3 weeks)
Objectives:
- Deploy minimal app shell and API in Azure

Tasks:
- Deploy frontend/API to App Service
- Provision Azure SQL and run baseline schema migrations
- Provision Blob and Redis
- Wire Key Vault references and Managed Identity

Exit Criteria:
- App responds in dev
- Health checks green for API, SQL, Redis, Blob

## Phase 2: Markdown Import Pipeline (2-4 weeks)
Objectives:
- Build import/validate/preview/apply workflow

Tasks:
- Implement upload options (zip, folder sync, Git pull)
- Implement parser + schema validator
- Implement preview diff (`create/update/skip/reject`)
- Implement apply step with transactional writes
- Persist import run audit and validation reports

Exit Criteria:
- Import supports idempotent re-runs
- Failed records produce actionable error report

## Phase 3: Backfill and Reconciliation (1-2 weeks)
Objectives:
- Ingest existing markdown into cloud metadata model

Tasks:
- Run initial full import
- Reconcile unmapped objects
- Resolve duplicate `object_key` conflicts
- Produce baseline data quality report

Exit Criteria:
- 95%+ object mapping coverage achieved
- unresolved conflicts tracked and approved

## Phase 4: Dual-Run Validation (2 weeks)
Objectives:
- Run existing process and new cloud process in parallel

Tasks:
- Compare output parity: docs, dependencies, permissions, reports
- Validate Entra role behavior
- Validate import and export workflows under load

Exit Criteria:
- Parity accepted by product and data stakeholders
- No P1 defects open

## Phase 5: Cutover (1 week)
Objectives:
- Move production traffic to cloud deployment

Tasks:
- Freeze legacy writes
- Run final delta sync
- Update DNS/entry point
- Enable production alerting and dashboards

Exit Criteria:
- Production users authenticate via Entra
- Import and report pipelines operational

## Phase 6: Hypercare (2 weeks)
Objectives:
- Stabilize post-go-live

Tasks:
- Daily triage and telemetry review
- Performance tuning for heavy dependency queries
- Access and audit validation

Exit Criteria:
- Error budget stable and SLA met

---

## 5. Data Migration Details

## 5.1 What Moves to Cloud
- Markdown files: to Git + optional Blob mirror
- Metadata index: to Azure SQL
- Import history and audit logs: to Azure SQL + Log Analytics
- Export artifacts: to Blob
- Secrets: to Key Vault

## 5.2 Migration Mechanics
- Initial full load by environment
- Incremental delta load by file hash + modified timestamp
- Deterministic upsert by `object_key`
- Soft-delete for missing docs (with restore window)

## 5.3 Validation Gates
- Schema validity rate ≥ 98%
- Duplicate key rate = 0%
- Broken links ≤ 1%
- Object-to-doc linkage ≥ 95%

---

## 6. CI/CD for Cloud Migration

Required pipeline gates:
- Lint and markdown contract validation
- Unit + integration tests
- Security scan (dependencies and container images)
- Migration smoke tests
- Deployment approval for production

Recommended GitHub Actions stages:
1. `validate-docs`
2. `test-backend`
3. `build-images`
4. `deploy-dev`
5. `integration-tests`
6. `deploy-test`
7. `prod-approval`
8. `deploy-prod`

---

## 7. Operating Model After Migration

- Contributors update markdown in Git workflow
- Import service runs on schedule and on-demand
- Admin users approve high-risk changes in admin screen
- Reports and exports generated from indexed metadata + markdown content
- Security and compliance teams consume audit dashboards

---

## 8. Risks and Mitigations

- **Risk:** duplicate object identities  
  **Mitigation:** enforce unique `object_key` with pre-merge checks

- **Risk:** incorrect role mapping from Entra groups  
  **Mitigation:** non-prod role simulation + access certification

- **Risk:** performance degradation on large lineage graphs  
  **Mitigation:** cache hot paths in Redis + precomputed graph snapshots

- **Risk:** migration drift between docs and metadata  
  **Mitigation:** hash-based reconciliation and scheduled drift reports

---

## 9. Cutover Checklist

- [ ] Production app registration and redirect URIs validated
- [ ] Key Vault secrets present and versioned
- [ ] Database migrations complete in prod
- [ ] Initial + delta imports completed
- [ ] Access certification signed off (Admin/Power/Analyst/Viewer)
- [ ] Monitoring dashboards and alerts enabled
- [ ] Rollback runbook validated

---

## 10. Rollback Plan

If critical issues occur:
1. Route traffic back to previous entry point
2. Disable scheduled cloud import jobs
3. Restore latest stable metadata snapshot
4. Re-enable legacy process
5. Conduct root-cause analysis before retry

---

## 11. Definition of Done (Migration)

Migration is complete when:
- Production users authenticate successfully with Entra ID
- Markdown import is validated, repeatable, and auditable
- Metadata and documentation parity is accepted
- SLA and monitoring baselines are met for 2 consecutive weeks
- Compliance/audit stakeholders sign off
