# Documentation Portal

This is the master index for platform documentation.

## Current Product Navigation (2026 IA)

- **Find & Understand**: Home / Find Data, Search / Catalog, Lineage Explorer
- **Govern & Improve**: Glossary & Metrics, Review Work / Governance Ops
- **Operate**: Profiling, Connections, Lineage Acquisition, Platform Admin

Deprecated primary labels: `Command Center`, `Profile Operations`, `Ingestion Studio`, `Trust & Compliance`, and `Data Products` until each has a clear workflow owner or explicit product definition.

- **Support**: Help Center

## In-App User Help (Surfaced in UI)

- [Help Center](HELP_CENTER.md)
- [User Guide](USER_GUIDE.md)
- [Troubleshooting FAQ](TROUBLESHOOTING_FAQ.md)
- [SQL Server Quick Reference](SQL_SERVER_QUICK_REFERENCE.md)
- [Lineage Quick Reference](LINEAGE_QUICK_REFERENCE.md)
- [Admin Guide](ADMIN_GUIDE.md)

## User Enablement and Training

- [Help Center](HELP_CENTER.md)
- [User Guide](USER_GUIDE.md)
- [Troubleshooting FAQ](TROUBLESHOOTING_FAQ.md)
- [Video Walkthrough Script](VIDEO_WALKTHROUGH_SCRIPT.md)

## Admin, Operations, and Deployment

- [Admin Guide](ADMIN_GUIDE.md)
- [Local Development Setup](LOCAL_DEV_SETUP.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Launch Checklist](LAUNCH_CHECKLIST.md)
- [Go-Live Runbook](GO_LIVE_RUNBOOK.md)
- [Cloud Migration Runbook](CLOUD_MIGRATION_RUNBOOK.md)
- [Branch Protection Setup](BRANCH_PROTECTION_SETUP.md)

## Infrastructure as Code (IaC)

- [IaC README — infra/](../infra/README.md) — FR-PLAT-001 baseline, Terraform scaffold, and local usage
- [Deployment Guide](DEPLOYMENT_GUIDE.md) — cloud-oriented deployment notes
- [IaC CI Workflow](../.github/workflows/iac.yml) — validate/lint/plan gates (no apply in CI)

## Architecture, Product, and Engineering

- [Enterprise Architecture](ENTERPRISE_ARCHITECTURE.md)
- [UI Workflow Specification](UI_WORKFLOW_SPEC.md)
- [UX Workflow Redesign 2026](UX_WORKFLOW_REDESIGN_2026.md)
- [Codex UI Work Packet Template](CODEX_UI_WORK_PACKET_TEMPLATE.md)
- [Codex Lineage Execution Packet Template](CODEX_LINEAGE_EXECUTION_PACKET_TEMPLATE.md)
- [Team Codex Lineage Training Guide](TEAM_CODEX_LINEAGE_TRAINING_GUIDE.md)
- [Sonic Lineage Consumer Kit Repository](SONIC_LINEAGE_CONSUMER_KIT_REPO.md)
- [Sonic Lineage Consumer Kit AGENTS Template](SONIC_LINEAGE_CONSUMER_KIT_AGENTS.md)
- [Lineage Runtime Readback Process](LINEAGE_RUNTIME_READBACK_PROCESS.md)
- [Raw Evidence Access Control](RAW_EVIDENCE_ACCESS_CONTROL.md)
- [UI Workflow Migration Plan](UI_WORKFLOW_MIGRATION_PLAN.md)
- [Connector Extraction Framework](CONNECTOR_EXTRACTION_FRAMEWORK.md)
- [Profiling Execution Framework](PROFILING_EXECUTION_FRAMEWORK.md)
- [Profile Index Safety And Storage Specification](PROFILE_INDEX_SPEC.md)
- [BI Profile Framework](BI_PROFILE_FRAMEWORK.md)
- [Connector Metadata Profile Framework](CONNECTOR_METADATA_PROFILE_FRAMEWORK.md)
- [Data Dictionary and Metadata Enrichment](DATA_DICTIONARY_AND_METADATA_ENRICHMENT.md)
- [Product Requirements](PRODUCT_REQUIREMENTS.md)
- [Project Backlog](PROJECT_BACKLOG.md)
- [OpenAPI Spec](OPENAPI.yaml)
- [QA Test Plan](QA_TEST_PLAN.md)
- [End-To-End Validation 2026-06-06](END_TO_END_VALIDATION_2026-06-06.md)
- [Phase 9 Test Matrix](PHASE9_TEST_MATRIX.md)
- [Market Analysis](MARKET_ANALYSIS.md)

## Lineage and SQL Server Implementation

- [Lineage Detection Research](LINEAGE_DETECTION_RESEARCH.md)
- [Lineage Engine Tuning Backlog](LINEAGE_ENGINE_TUNING_BACKLOG.md)
- [Team Codex Lineage Enablement Backlog](TEAM_CODEX_LINEAGE_ENABLEMENT_BACKLOG.md)
- [Sonic Lineage Runtime Consumer Contract](SONIC_LINEAGE_RUNTIME_CONSUMER_CONTRACT.md)
- [Lineage Implementation Guide](LINEAGE_IMPLEMENTATION_GUIDE.md)
- [Lineage Object Investigation Queue](LINEAGE_OBJECT_INVESTIGATION_QUEUE.md)
- [Lineage Suspicious Objects Process](LINEAGE_SUSPICIOUS_OBJECTS_PROCESS.md)
- [Lineage Quick Reference](LINEAGE_QUICK_REFERENCE.md)
- [Scoring Calibration Matrix](SCORING_CALIBRATION_MATRIX.md)
- [SQL Server Connection Guide](SQL_SERVER_CONNECTION_GUIDE.md)
- [SQL Server Implementation Guide](SQL_SERVER_IMPLEMENTATION_GUIDE.md)
- [SQL Server Quick Reference](SQL_SERVER_QUICK_REFERENCE.md)

## Governance, Release, and Audit Records

- [ADR-001: Store Sanitized Profile Indexes In The DevOps Azure Data Pack](adr/ADR-001-Profile-Indexes-In-DevOps-Azure-Data-Pack.md)
- [ADR-002: Separate Profile Run Artifacts From Queryable Profile Indexes](adr/ADR-002-Separate-Profile-Run-Artifacts-From-Queryable-Profile-Indexes.md)
- [ADR-003: Codex Skills Use The DevOps Profile Index First](adr/ADR-003-Codex-Skills-Use-DevOps-Profile-Index-First.md)
- [ADR-004: Use One Shared Connector Runtime](adr/ADR-004-Single-Shared-Connector-Runtime.md)
- [ADR-005: Use Workflow-Led UI Surfaces](adr/ADR-005-Workflow-Led-UI-Surfaces.md)
- [ADR-006: Use Native SSIS Hierarchy And Classified Lineage Summaries](adr/ADR-006-SSIS-Native-Hierarchy-And-Classified-Lineage.md)
- [ADR-007: Use A Versioned Lineage Runtime Package And Team Codex Plugin Before Azure Platform Expansion](adr/ADR-007-Team-Codex-Lineage-Runtime-Enablement.md)
- [ADR-008: Use A Separate Azure DevOps Repo For The Team Lineage Consumer Kit](adr/ADR-008-Separate-Lineage-Consumer-Kit-Repo.md)
- [Release Notes v0.6.0](RELEASE_NOTES_v0.6.0.md)
- [Release Notes v1.0.0](RELEASE_NOTES_v1.0.0.md)
- [Vuetify Final Audit 2026-05-10](VUETIFY_FINAL_AUDIT_2026-05-10.md)
- [Documentation Visual Audit 2026](DOCUMENTATION_VISUAL_AUDIT_2026.md)
- [UI IA Audit 2026](UI_IA_AUDIT_2026.md)
- [Competitive UX Analysis](COMPETITIVE_UX_ANALYSIS.md)
- [Sidebar UX Research 2026](SIDEBAR_UX_RESEARCH_2026.md)
- [Documentation Audit Register](DOCUMENTATION_AUDIT_REGISTER.md)

## Source and Contributor Documentation

Use these references when working inside the codebase:

- [Source Structure](../src/README.md)
- [API Routes](../src/api/README.md)
- [Services](../src/services/README.md)
- [Middleware](../src/middleware/README.md)
- [Utilities](../src/utils/README.md)
- [Components](../src/components/README.md)
- [Modules](../src/modules/README.md)
- [Validators](../src/validators/README.md)
- [Frontend](../src/frontend/README.md)

## Generated Artifacts

- [generated/](generated)
