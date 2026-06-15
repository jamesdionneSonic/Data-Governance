# Comprehensive Project Backlog

# Data Governance & Dependency Visualization Platform (Markdown-First Edition)

**Version:** 3.2  
**Last Updated:** June 2, 2026  
**Architecture**: Markdown-Driven Source of Truth + SQL Operational Store + Meilisearch

---

## Executive Summary

This backlog contains the complete delivery history for MVP phases and the forward roadmap. Legacy delivery (Phase 0-10) is complete, and post-launch governance capabilities are now prioritized for comprehensive data governance including glossary, classification, quality, metadata, access control, compliance, marketplace, workflows, observability, and incident management.

**Estimated Timeline**: MVP (Phase 0-6): 10 months complete | Extended Governance (Phase 7a-7r): 18-24 months | Phase 8 (Azure): 4-8 weeks  
**Recommended Team**: Core Platform (4-5 developers) + Governance Features (6-8 developers) + 1 architect + 2 QA + 1 Product Manager  
**Total Estimated Effort**: MVP (100-130 person-days) + Governance Extensions (280-350 person-days) + Azure (80-120 person-days) = 460-600 person-days (~12-15 months for cross-functional team)

## Recent Capability 7 Update - June 7, 2026

- Added managed connector-backed profiling plan/run APIs for database connectors.
- Added live aggregate profile executor paths for SQL Server, PostgreSQL, Snowflake, BigQuery, Databricks, and AWS Redshift Data API execution.
- Preserved the no-raw-values contract: profile output stores aggregate statistics only and never returns credential values or vault references.
- Added plain remediation errors for missing drivers, invalid source credentials, endpoint failures, and unsupported live profile paths.
- Added browser memory-stability E2E coverage that cycles major app views and checks for page errors, failed non-favicon resources, and runaway heap growth.
- Added the BI report profile framework for reporting connectors. It profiles report metadata, dashboards, semantic models, datasets, data sources, measures, fields, lineage, usage/refresh signals, coverage gaps, Confluence summaries, and assistant-ready English without storing report result rows, raw values, or secrets.
- Added `/api/v1/connectors/:id/bi-profile/plan` and `/api/v1/connectors/:id/bi-profile/run` so approved users can profile managed BI connectors without seeing connector credentials.
- Added the connector metadata profile framework for Salesforce, cloud storage, catalog platforms, pipeline/orchestration tools, dbt, code repositories, OpenAPI, Kafka, and SAP. New endpoints `/api/v1/connectors/:id/metadata-profile/plan` and `/api/v1/connectors/:id/metadata-profile/run` profile metadata-only inventory, storage locations, schemas, columns, classifications, glossary terms, pipelines, tasks, jobs, datasets, connections, schedules, code assets, reports, dashboards, API endpoints, streaming assets, SAP extractors, lineage, coverage gaps, Confluence summaries, and assistant-ready English.
- Added the managed connector profile scheduler so admins can create, update, delete, manually run, and tick recurring aggregate, BI report, and metadata profile schedules through the same connector runtime without exposing credentials or storing raw payloads.
- Added the scheduler operations layer: in-process worker lifecycle, local sanitized runtime persistence under `data/_runtime/profiles`, JSON and Confluence-ready markdown profile run artifacts, per-schedule run history, status APIs, UI worker controls, and tests for history/artifact scrubbing.
- Added the Phase 7e ownership/stewardship first pass: role responsibility model, inherited ownership resolution, escalation chains, steward portfolio summaries, task SLA metadata, routed metadata-completion tasks, bulk ownership assignment planning, Governance Ops UI panels, API routes, tests, and framework documentation.

## Capability Truth Table - June 13, 2026

This table is the current product-readiness view. It is intentionally separate from old delivery-history checkboxes so we can see what is safe to rely on now without disturbing the live profile queues, SSRS extraction, or current UI migration state.

| Capability                               | Current status                      | What is built now                                                                                                                                         | What is still missing or needs hardening                                                                                                                   |
| ---------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Search-first Home / Find Data            | Built                               | Home starts with search/ask, returns ranked results in place, and routes selected assets to focused asset detail.                                         | Continue polishing result quality; do not reintroduce Home dashboard clutter.                                                                              |
| Workflow-owned frontend architecture     | Built                               | `docker/frontend/app.js` composes workflow-owned modules and shared UI components.                                                                        | Keep guardrails active so primary page markup does not drift back into `app.js`.                                                                           |
| Search / Catalog advanced console        | Built as internal surface           | Advanced search, filters, browse, disambiguated result cards, and recent-search recall exist as non-primary/internal flow.                                | Keep it internal unless a future workflow owner explicitly promotes it.                                                                                    |
| Selected-asset lineage / impact          | Built as internal/deep-link surface | Plain-English lineage answer, impact context, graph/evidence drilldowns, and selected-asset entry points exist.                                           | Continue improving confidence, report lineage evidence, and column/report impact quality.                                                                  |
| Connections workflow                     | Built                               | Reusable connector inventory/detail, login/discovery checks, builder support lane, and profiling links exist.                                             | Disable semantics and enterprise credential vault integration still need production definition.                                                            |
| Profiling schedules and live queues      | Built, local-operational            | Schedule health, queue progress, run history, run-now, publish readiness, local worker, sanitized artifacts, and a clean queue-health default page exist. | Needs single-writer production worker model, durable SQL/enterprise store option, and operational monitoring before enterprise completion.                 |
| SQL Server live profiling                | Built for current Windows-auth path | `sqlcmd_windows_auth` live aggregate profiling works for approved SQL Server connectors such as Sonic_DW/GPA and VendorData.                              | Service-account or managed-identity operating model still needed for unattended production.                                                                |
| SSRS metadata and report lineage         | Built for current Windows-auth path | ReportServer catalog, RDL datasets/query text, data sources, usage, subscriptions, msdb schedule/job signals, and SQL-object lineage extraction exist.    | Needs broader report-source canonical matching validation and production credential model.                                                                 |
| Connector framework and bridges          | Partly built                        | Shared connector runtime, bridge contracts, dry-run canonical events, many source definitions, and selected live paths exist.                             | Many connectors remain framework/dry-run or metadata-shape capable until proven against real source systems.                                               |
| BI report profiling framework            | Partly built                        | BI profile contract, endpoints, metadata-safe profile shape, summaries, and reporting connector support exist.                                            | Needs more live-source validation and richer BI measure/semantic definitions where source APIs allow.                                                      |
| Connector metadata profiles              | Partly built                        | Metadata profile contract and endpoints exist for several cloud/catalog/pipeline/repo/source families.                                                    | OpenAPI, Kafka, SAP, and other families need live-profile maturity beyond framework coverage.                                                              |
| Governance Ops / stewardship             | Partly built                        | Steward queues, ownership panels, tasks, incidents, publication readiness, context lookup, and local event delivery views exist.                          | Needs explicit enterprise workflow-state contracts, durable store, notifications, and immutable audit posture.                                             |
| Data quality, classification, and policy | Partly built                        | Metadata-safe classification, quality, trust, masking-policy, and related APIs/tests exist.                                                               | Production enforcement, full compliance reporting, and external control integration remain future hardening.                                               |
| Glossary and metrics                     | Partly built                        | Business-first glossary and metric intelligence surfaces, metric variants, evidence lanes, and profile context exist.                                     | SME approval workflow, certification semantics, glossary reminders, and full metric governance remain open.                                                |
| Data Products                            | Not built as real workflow          | Admin-visible future-state page explains that the workflow is parked.                                                                                     | Product definition, contracts, owner/consumer promise, lifecycle, access posture, and success metrics are still required.                                  |
| Access marketplace / fulfillment         | Partly built                        | Access request APIs/UI and local lifecycle support exist.                                                                                                 | Enterprise fulfillment integration, auditable immutable store, and live permission assignment need production setup.                                       |
| Notifications and webhooks               | Partly built                        | Integration settings, simulated notifications, local webhook structures, signing/retry concepts exist.                                                    | Real email/Slack/Teams delivery and enterprise notification preferences must be configured and proven.                                                     |
| Confluence publication                   | Partly built                        | Export/dry-run/sync services and generated package concepts exist.                                                                                        | Live Sonic page validation, stable page hierarchy, and clear human-vs-machine artifact separation remain open.                                             |
| DevOps/Azure data pack                   | Partly built                        | Runtime package builder/checker and `profile-index/` generation/validation exist.                                                                         | Publish-location validation, versioned live publish, and Codex-skill readback proof remain open.                                                           |
| Codex lineage skill answer experience    | Partly built                        | Runtime package includes answer cards/profile-index structures intended for skill use.                                                                    | Skill must be validated to use DevOps/Azure data pack first for profile, quality, metric, sensitivity, freshness, confidence, and unresolved-risk answers. |
| Usage analytics, KPI, ROI, adoption      | Framework/local only                | Some Governance Ops KPI/ROI/adoption calculations exist.                                                                                                  | Production usage-event capture, trend dashboards, benchmarking, and business-impact reporting remain open.                                                 |
| Incidents and operational monitoring     | Partly built                        | Local incident/task workflows and quality-rule incident creation exist.                                                                                   | SLA monitoring, anomaly/drift detection, schema-change alerting, decommission workflow, and production notifications remain open.                          |
| Third-party embedded integrations        | Not built                           | Connector definitions and metadata hooks exist for some BI tools.                                                                                         | Embedded lineage viewer, BI/notebook/IDE plugins, integration marketplace, and governed in-tool search remain open.                                        |
| Enterprise auth and production security  | Not production-complete             | Dev auth, role-aware UI, permission services, and some admin/audit surfaces exist.                                                                        | Entra/OIDC, token refresh, production OAuth/API keys, rate limiting, managed identity, Key Vault, and immutable audit are still required.                  |
| Azure runtime and operations             | Not built                           | Local/dev runtime and operational docs exist.                                                                                                             | Azure App Service/AKS, Azure SQL, Blob, Redis, private networking, App Insights, backups, SLO dashboards, and DR runbooks remain open.                     |

## UI Workflow Architecture Remediation - June 11, 2026

The current frontend has working capabilities, but several screens mix unrelated jobs. The remediation goal is to make the app search-first and workflow-led, with one primary job per page and no monolithic UI surfaces.

### Completed Decisions / Guardrails

| ID       | Status | Outcome                                                                                                                                                                                            |
| -------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UIWF-000 | Done   | Completed workflow interview for Connections, Profiling, Lineage Acquisition, Lineage Explorer, Search/Catalog, Glossary & Metrics, Review Work, Data Products/Reports, Home, and role navigation. |
| UIWF-001 | Done   | Accepted ADR-005: UI pages must be workflow-led with one primary job, one default state, and no mixed setup/run/operate/troubleshoot surface.                                                      |
| UIWF-002 | Done   | Added `docs/UI_WORKFLOW_SPEC.md` as the implementation contract for page ownership, role defaults, navigation, and UI acceptance checks.                                                           |
| UIWF-003 | Done   | Established the target navigation: Home / Find Data, Search / Catalog, Lineage Explorer, Glossary & Metrics, Review Work, Profiling, Connections, Lineage Acquisition, Platform Admin.             |
| UIWF-004 | Done   | Decided deprecated primary labels: `Command Center`, `Profile Operations`, `Ingestion Studio`, `Trust & Compliance`, and `Data Products` until their useful parts are moved or explicitly defined. |
| UIWF-005 | Done   | Defined the `SONIC_DW` lineage domain as `Sonic_DW`, `VendorData`, `StagingDB`, `ETL_Staging`, and `SSIS_UAT`.                                                                                     |
| UIWF-006 | Done   | Added `docs/CODEX_UI_WORK_PACKET_TEMPLATE.md` with required workflow packet fields and upgrade-and-stop triggers for medium-intelligence Codex sessions.                                           |
| UIWF-007 | Done   | Added `docs/UI_WORKFLOW_MIGRATION_PLAN.md` with ordered workstreams, model routing rules, and the starting prompt for future Codex backlog work.                                                   |

### Codex Execution Entry Point

When starting this backlog, first read:

1. `docs/adr/ADR-005-Workflow-Led-UI-Surfaces.md`
2. `docs/UI_WORKFLOW_SPEC.md`
3. `docs/CODEX_UI_WORK_PACKET_TEMPLATE.md`
4. `docs/UI_WORKFLOW_MIGRATION_PLAN.md`

Codex 5.5 on medium may work only on small, scoped tasks with a completed work packet. If a task hits an upgrade-and-stop trigger in `docs/CODEX_UI_WORK_PACKET_TEMPLATE.md`, Codex must stop and ask the user to raise intelligence before editing files.

### Conformance Backlog

| ID       | Priority | Status | Work                                                                                                                                                                                                                                                                                    |
| -------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UIWF-010 | Critical | Done   | Split the active frontend away from the monolithic `docker/frontend/app.js` structure into workflow-owned modules/pages and shared components.                                                                                                                                          |
| UIWF-011 | Critical | Done   | Replace `Command Center` with a search-first Home / Find Data surface. Home now stays search/ask-first and does not show dashboard/workbench panels below the search area by default.                                                                                                   |
| UIWF-012 | Critical | Done   | Replace `Profile Operations` with Connections. Main surface shows type, intelligent name, status, login check, discovery check, and explicit Open/Test/Edit/Disable actions only.                                                                                                       |
| UIWF-013 | Critical | Done   | Move all profile schedule, queue, run history, publish warning, and manual run-now controls out of Connections and into Profiling.                                                                                                                                                      |
| UIWF-014 | Critical | Done   | Rebuild Profiling around schedule and queue triage. Superseded by `UIPROF-014`: the current default is a simple queue-health hero plus live queue list sorted by action need, with schedule builder, blockers, activate, and run-now behind the appropriate detail or Advanced surface. |
| UIWF-015 | Critical | Done   | Rename/reframe `Ingestion Studio` as Lineage Acquisition and make it admin/operator evidence refresh for configured domains, not a raw extraction page for normal users.                                                                                                                |
| UIWF-016 | Critical | Done   | Ensure selected-asset lineage answers are plain-English first, with graph/evidence drilldowns second; the old Lineage Explorer route remains internal/deep-link only.                                                                                                                   |
| UIWF-017 | High     | Done   | Rebuild discovery results to disambiguate same-name assets with source location, type pill, match reason, confidence score, and business-first asset detail; Search / Catalog remains an internal advanced console.                                                                     |
| UIWF-018 | High     | Done   | Merge useful `Trust & Compliance` concepts into system confidence reasons, warning badges, and Review Work queues; remove it as a generic primary page.                                                                                                                                 |
| UIWF-019 | High     | Done   | Build Review Work / Governance Ops as steward work queues starting with failed profiles, failed lineage, and suspicious lineage. Deep-link to fixing surfaces instead of duplicating controls.                                                                                          |
| UIWF-020 | High     | Done   | Reframe Glossary & Metrics so glossary terms are business-defined and metrics support grouped variants, in-review engine suggestions, business logic summaries, and impact links.                                                                                                       |
| UIWF-021 | Medium   | Done   | Park Data Products as an admin-visible future-state page until a concrete product definition exists; active report metadata belongs in Home/Asset Detail, selected-asset lineage, and Metrics.                                                                                          |
| UIWF-022 | High     | Done   | Add role-aware navigation for User, Analyst, Data Steward, and Admin so normal users do not see advanced/raw operator pages.                                                                                                                                                            |
| UIWF-023 | High     | Done   | Add visual/smoke coverage for redesigned primary workflow pages, plus hidden/internal-route assertions for Search, Asset Detail, and lineage surfaces.                                                                                                                                  |
| UIWF-024 | Medium   | Done   | Add lint or test guardrails that fail obvious UI anti-patterns such as nested workflow tabs, new primary labels outside the workflow spec, or duplicated connector/profile action implementations.                                                                                      |
| UIWF-025 | Medium   | Done   | Add shared UI/action components for Test, Save Draft, Activate, Run Now, Retry Publish, status chips, blocker messages, confidence explanations, and drilldown detail drawers.                                                                                                          |

### Architecture Fit Cleanup Backlog - June 15, 2026

This backlog follows the post-Profiling architecture review. Its goal is to remove remaining "module bucket" surfaces and make every capability fit ADR-005: one workflow owner, one primary job, one default state, and technical detail only after drilldown.

| ID          | Priority | Status | Architecture mismatch                                                                                                                                                         | Clear target outcome                                                                                                                                                                                                                                           |
| ----------- | -------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UICLEAN-001 | Critical | Done   | `Governance Insights` is still a primary-ish navigation capability that mixes executive KPIs, marketplace access, blast radius, exports, report packs, and scheduled reports. | Removed `Governance Insights` from primary navigation, kept the existing reports route internal for now, and added follow-up decomposition notes mapping each function to its owning workflow.                                                                 |
| UICLEAN-002 | Critical | Done   | `Data Products` remains in navigation even though the backlog and spec say it is parked until product contracts are explicit.                                                 | Removed `Data Products` from primary navigation; kept the future-state reference page as an internal/admin deep link or documentation artifact until product owner, consumer promise, lifecycle, access posture, and success metrics are defined.              |
| UICLEAN-003 | High     | Done   | `Lineage Assistant` overlapped with selected-asset lineage and `Lineage Explorer`, creating two lineage answer surfaces.                                                      | Removed the separate `Lineage Assistant` route, quick action, deep-link acceptance, and template composition so lineage answers now resolve through `Lineage Explorer` and selected-asset lineage.                                                             |
| UICLEAN-004 | High     | Done   | `Advanced Trust Controls` was a leftover Trust & Compliance surface after trust concepts were decomposed into confidence warnings and Review Work.                            | Moved policy, quality, and classification controls into a closed Governance Ops support lane; removed the standalone `governance` route/meta/action/composition path from workflow guardrails.                                                                 |
| UICLEAN-005 | High     | Done   | Metric Intelligence could still plan/run technical profiles directly, duplicating Profiling's execution job.                                                                  | Kept metric profile evidence visible as read-only support detail and replaced technical profile execution controls with a Profiling handoff that pre-fills the selected metric asset for queue/run review.                                                     |
| UICLEAN-006 | Medium   | Done   | Connections still contained transition links directly to Profiling operator tabs such as Run Now, Runs, and Publishing.                                                       | Replaced operator-tab links with schedule/queue relationship links such as "Used by schedules" and "Open Related Profiling Queue"; Connections no longer chooses Profiling operator modes.                                                                     |
| UICLEAN-007 | Critical | Done   | The `Package & Report` nav section no longer mapped to an accepted workflow owner after Data Products and Governance Insights were retired from primary navigation.           | Removed `Package & Report` from normal navigation while preserving products/reports as explicit internal routes; remaining valid capabilities stay owned by Home/Asset Detail, Lineage Explorer, Governance Ops, Platform Admin, or future explicit workflows. |

### Compliance Audit Backlog - June 15, 2026

Audit scope: compare current app behavior and repo standards against `docs/UI_WORKFLOW_SPEC.md`, `docs/adr/ADR-005-Workflow-Led-UI-Surfaces.md`, `CONTRIBUTING.md`, `CONTRIBUTOR.md`, `README.md`, workflow guardrails, unit tests, and full Playwright E2E. No code fixes were made during this audit pass.

| ID                 | Priority | Status | Compliance issue                                                                                                                                                | Evidence                                                                                                                                                                                                                                                                                                                           | Clear target outcome                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------ | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AUDIT-20260615-001 | High     | Done   | Public README still advertised the retired governance-first navigation model instead of the accepted workflow-led model.                                        | `README.md` listed `Workspace: Command Center, Catalog Search, Lineage Explorer`, `Govern: Business Glossary, Trust & Compliance`, `Deliver: Data Products, Governance Insights`, and `Operate: Connections, Metadata Ingestion, Administration`, while ADR-005 and `docs/UI_WORKFLOW_SPEC.md` retire or internalize those labels. | Updated README navigation and getting-started language to match the visible workflow owners: Home / Find Data, Business Glossary, Governance Ops, Metric Intelligence, Connections, Lineage Acquisition, Profiling, Platform Admin, and Help Center, with Search, Asset Detail, Lineage Explorer, Data Products, and Governance Insights described only as internal/deep-link/future-state where appropriate. |
| AUDIT-20260615-002 | Medium   | Done   | Contributor runtime standards still used the retired `Ingestion Studio` label in shared-runtime requirements.                                                   | `CONTRIBUTOR.md` said saved connectors, `Ingestion Studio`, connection tests, profile schedules, live profiling, lineage extraction, and admin tools must call the shared runtime. The accepted UI owner is now `Lineage Acquisition`; `Ingestion Studio` is deprecated in `docs/UI_WORKFLOW_SPEC.md`.                             | Replaced contributor-facing `Ingestion Studio` references with `Lineage Acquisition` so future contributors do not reintroduce the retired surface name.                                                                                                                                                                                                                                                      |
| AUDIT-20260615-003 | Medium   | Done   | The required CI-equivalent validation command was not audit-only because `npm run verify:ci` called `npm run lint`, and `npm run lint` ran ESLint with `--fix`. | `CONTRIBUTING.md` and `CONTRIBUTOR.md` require `npm run verify:ci`; `package.json` defined `lint` as `eslint src tests docker scripts --fix --max-warnings=0`, so the required check could modify files while validating.                                                                                                          | Added a non-mutating `npm run lint` command, added `npm run lint:fix` for developer cleanup, and left `verify:ci` wired to the non-mutating lint gate.                                                                                                                                                                                                                                                        |

#### UICLEAN-001 Completion Note - June 15, 2026

- Removed `Governance Insights` from primary navigation by marking the `reports` workflow item as hidden while preserving the internal route for existing deep links and follow-up decomposition.
- Reworded `Governance Insights` metadata as an internal reporting workbench rather than a workflow owner.
- Removed the `Open Governance Insights` executive quick action and redirected executive users toward Governance Ops and Platform Admin health.
- Added static guardrails so `Governance Insights` cannot return as visible navigation or a quick action bucket without an explicit architecture change.
- Updated role-navigation e2e coverage so User, Analyst, Data Steward, and Admin navigation all hide `Governance Insights`.
- Decomposition map for later items:
  - Executive KPIs, ROI, adoption, and maturity reporting belong in Governance Ops summary or Platform Admin reporting drilldowns.
  - Marketplace access request and fulfillment belongs in Governance Ops or a future explicit Access workflow, not in a reporting page.
  - Blast radius analysis belongs in Asset Detail / selected-asset Lineage Explorer.
  - Critical dependency leaderboards belong in Lineage Explorer or Governance Ops risk queues.
  - Export center and report packs belong in Platform Admin or a future explicit Reporting/Export workflow after the workflow owner is defined.
  - Scheduled report delivery belongs in Platform Admin operations or the future Reporting/Export workflow, not in a mixed insights page.
- Validation evidence: `node --check` passed for `docker/frontend/app.js`, `docker/frontend/workflows/packageAndReport.js`, `tests/e2e/ui-workflow.spec.js`, `scripts/check-ui-workflow-guardrails.mjs`, and `docker/frontend/workflows/connectAndOperateTemplates.js`; `npm run ui:workflow:guardrails` passed; `npm run format:check` passed; `npm run test:e2e -- tests/e2e/ui-workflow.spec.js --workers=1` passed 18/18.

#### UICLEAN-002 Completion Note - June 15, 2026

- Removed `Data Products` from primary navigation by marking the `products` workflow item as hidden while preserving the parked future-state route for internal/admin deep-link reference.
- Removed the visible Data Products smoke test because the page is no longer a primary workflow surface.
- Updated admin role-navigation coverage so `Data Products` is hidden for Admin along with Search, Asset Detail, and Governance Insights.
- Replaced the analyst quick action that opened Data Products with a Metrics workflow action.
- Added static guardrails so `Data Products` cannot return to visible navigation or quick actions until product owner, consumer promise, lifecycle, access posture, and success metrics are defined.

#### UICLEAN-003 Completion Note - June 15, 2026

- Removed `lineageAsk` and `Lineage Assistant` from the Find & Understand workflow registry and stopped accepting `?view=lineageAsk` as a valid deep link.
- Replaced `Ask About Lineage` quick actions with `Explore Lineage` actions targeting `Lineage Explorer`.
- Removed the old assistant page template from `app.js` composition and added guardrail plus E2E coverage to keep lineage as one answer surface.

#### UICLEAN-004 Completion Note - June 15, 2026

- Converted the old `Advanced Trust Controls` page into a closed Governance Ops support lane named `Policy, Quality, And Classification Controls`.
- Removed the standalone `governance` metadata entry, quick action route, app import, and page-template composition.
- Preserved the existing `?view=governance` compatibility redirect to Governance Ops and added guardrail plus E2E coverage so the retired trust page cannot return as a separate surface.

#### UICLEAN-005 Completion Note - June 15, 2026

- Removed Metric Intelligence's embedded technical profile plan/run form, `/api/v1/profiling/plan` and `/api/v1/profiling/run` calls, and metric-owned profiling state.
- Preserved read-only metric profile/runtime evidence and added a `Profiling Handoff` support lane that opens Profiling with the selected metric asset ready for queue/run review.
- Added guardrail and E2E coverage so Metric Intelligence cannot regain profile execution buttons while Profiling remains the owner of live plan/run/schedule work.

#### UICLEAN-006 Completion Note - June 15, 2026

- Replaced Connections' direct `Open Run Now`, `Open Runs`, and `Open Publishing` Profiling links with a `Schedule Relationships` lane.
- Added `openRelatedProfilingQueueFromConnection()` so Connections can focus an active/related Profiling queue without selecting Run Now, Runs, or Publishing operator modes.
- Reworded Connections workflow step labels from profile operation language to relationship/evidence language and added guardrail plus E2E coverage for the new boundary.

#### UICLEAN-007 Completion Note - June 15, 2026

- Removed `packageAndReportSection` from normal `navSections` so `Package & Report` no longer appears as an accepted workflow owner.
- Kept `products` and `reports` in explicit `internalSections` so existing internal/deep-link routes remain intentional while hidden from sidebar navigation.
- Added guardrail and role-navigation E2E coverage so `Package & Report` cannot return to normal navigation before a real workflow owner is defined.

### UI Workflow Remediation Progress Notes

#### UIWF-010 - June 11, 2026

- Status changed from `Planned` to `In Progress`, then to `Done` after all primary `activeView` page templates were extracted from `docker/frontend/app.js`.
- Started the structural frontend split required before future workflow UI changes can avoid expanding `docker/frontend/app.js`.
- Moved workflow navigation sections and page metadata into `docker/frontend/workflows/*` owner modules, composed by `docker/frontend/workflowRegistry.js`.
- Moved cross-workflow quick actions into `docker/frontend/workflowQuickActions.js`.
- Added `docs/UI_WORKFLOW_MEDIUM_SAFE_EXTRACTION.md` so remaining move-only extraction slices can be safely handled on medium with exact page boundaries and stop conditions.
- Added `docs/UI_WORKFLOW_REDESIGN_BACKLOG.md` to separate future layout/functionality redesign work from the current move-only architecture cleanup.
- Expanded `docs/UI_WORKFLOW_REDESIGN_BACKLOG.md` with medium-ready story packets for the follow-on layout and functionality migration.
- Extracted the Home / Find Data page template into `docker/frontend/workflows/findAndUnderstandTemplates.js`.
- Extracted the Search / Catalog page template into `docker/frontend/workflows/findAndUnderstandTemplates.js`.
- Extracted the Lineage Assistant page template into `docker/frontend/workflows/findAndUnderstandTemplates.js`.
- Extracted the Lineage Explorer page template into `docker/frontend/workflows/findAndUnderstandTemplates.js`.
- Extracted the Business Glossary page template into `docker/frontend/workflows/governAndImproveTemplates.js`.
- Extracted the Advanced Trust Controls page template into `docker/frontend/workflows/governAndImproveTemplates.js`.
- Extracted the Governance Operations page template into `docker/frontend/workflows/governAndImproveTemplates.js`.
- Extracted the Metric Intelligence page template into `docker/frontend/workflows/governAndImproveTemplates.js`.
- Extracted the Data Products future-state page template into `docker/frontend/workflows/packageAndReportTemplates.js`.
- Extracted the Governance Insights page template into `docker/frontend/workflows/packageAndReportTemplates.js`.
- Extracted the Connections page template into `docker/frontend/workflows/connectAndOperateTemplates.js`.
- Extracted the Profiling page template into `docker/frontend/workflows/connectAndOperateTemplates.js`.
- Extracted the connector workflow subpage template into `docker/frontend/workflows/connectAndOperateTemplates.js`.
- Extracted the Lineage Acquisition page template into `docker/frontend/workflows/connectAndOperateTemplates.js`.
- Extracted the Platform Admin page template into `docker/frontend/workflows/connectAndOperateTemplates.js`.
- Extracted the Help Center page template into `docker/frontend/workflows/supportTemplates.js`.
- Completed the page-template ownership pass: `docker/frontend/app.js` now composes workflow-owned page templates and no longer contains primary `activeView` page markup blocks.
- Updated `scripts/check-ui-workflow-guardrails.mjs` so primary-label validation reads workflow-owned modules, blocks reintroducing `navSections` or `pageWorkflowMeta` inside `app.js`, and protects the extracted page-template seams.
- Backend contracts, role visibility semantics, workflow behavior, and primary navigation remained unchanged.
- Validation evidence: `node --check` passed for `docker/frontend/app.js`, `docker/frontend/workflowRegistry.js`, `docker/frontend/workflowQuickActions.js`, all new `docker/frontend/workflows/*.js` modules, and `scripts/check-ui-workflow-guardrails.mjs`; `npm run ui:workflow:guardrails` passed; `npm run test:e2e -- tests/e2e/ui-workflow.spec.js --workers=1` passed 14/14 after the default parallel run hit browser worker OOM; `git diff --check` found no whitespace errors and only reported line-ending normalization warnings for existing touched files.
- Follow-up: start `docs/UI_WORKFLOW_REDESIGN_BACKLOG.md` with `UIR-001` page ownership matrix, then implement one medium-safe redesign story at a time.

#### Post-UIWF-010 Redesign Pass - June 11-12, 2026

These layout/functionality changes happened after `UIWF-010` split the frontend into workflow-owned modules. No `UIR-*` page redesign story should be treated as pre-rebuild work.

- `UIR-001` completed the page ownership matrix and clutter triage buckets for active workflow pages, parked Data Products, and Help Center.
- `UIR-002` redesigned Home / Find Data as a centered search/ask landing state, then removed all secondary Home workbench content after user review so Home stays search-only by default.
- `UIR-003` kept Search / Catalog as an internal advanced console and added lightweight recent-search recall without reintroducing a Home card.
- `UIR-004` moved lineage into selected-asset lineage reached from Home/Asset Detail and kept graph/evidence as drilldowns rather than the default first view.
- The Search + Lineage merge removed `Lineage Assistant`, `Lineage Explorer`, and Search / Catalog from primary navigation while preserving their routes as internal/deep-link surfaces.
- `UIR-005` through `UIR-012` completed the remaining redesign pass for Glossary, Metrics, Governance Ops, Connections, Profiling, Lineage Acquisition, Platform Admin, visual smoke anchors, and post-redesign guardrails.
- Backend contracts, role visibility, search ranking, lineage confidence, profile execution, connector runtime, schedule persistence, and publish semantics were preserved unless explicitly called out in the owning story.

### Profiling Queue Clarity Capability - June 13, 2026

This capability is the follow-on cleanup for Profiling after the Search/Home and Asset Detail redesigns. The goal is to make Profiling answer "what is running, what worked, what needs me, and what happens next" without making the user inspect worker controls, raw schedule fields, run artifacts, or queue internals first.

#### Codex Entry Point

Tell a new chat: "Start the Profiling Queue Clarity capability in `docs/PROJECT_BACKLOG.md`. Read ADR-005, `docs/UI_WORKFLOW_SPEC.md`, `docs/CODEX_UI_WORK_PACKET_TEMPLATE.md`, and the `UIPROF` stories. Pick the first open story, create the required work packet before editing, and stop if any upgrade-and-stop trigger applies."

#### Capability Guardrails

- Medium-safe stories must not change connector runtime behavior, profile execution, queue persistence, scheduler cadence, Windows-auth handling, publish semantics, or live profile artifacts.
- Default Profiling should behave like Search/Asset Detail: one primary status answer first, selected queue detail second, advanced operator tools last.
- Product decision on June 15, 2026: Profiling uses the simple hero plus live queue list as the default first viewport. Do not revert to a sorted schedule-list-first page; update any older spec language to match this decision during the hardening pass.
- The page must use existing schedule, queue preview, scheduler status, and run-history APIs unless a story explicitly stops for a backend contract.
- Live queues must not be deactivated, restarted, deleted, reseeded, or manually run as part of UI-only stories.
- If exact pending totals, next-object prediction, durable production worker ownership, enterprise credentials, or SQL-backed schedule persistence are required, stop and create a backend story instead of guessing in the frontend.

#### Story Backlog

| ID         | Priority | Status | Medium-safe? | Story                                                                                                                                                                                                                                                                          |
| ---------- | -------- | ------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| UIPROF-001 | Critical | Done   | Yes          | Create a Profiling view-model layer that translates existing schedules, queue previews, scheduler status, last runs, blockers, next run times, live success counts, and timeout penalties into plain-English queue health rows.                                                |
| UIPROF-002 | Critical | Done   | Yes          | Redesign the default Profiling page into a clean queue health home with a single hero answer, summary cards for running/completed/needs-attention/next-run, and a Search-style list of live profile queues.                                                                    |
| UIPROF-003 | Critical | Done   | Yes          | Add a selected Queue Detail surface, analogous to Asset Detail, showing one queue's health summary, completed live profiles, recent changes, current blocker, next run, and primary actions without exposing raw scheduler machinery by default.                               |
| UIPROF-004 | High     | Done   | Yes          | Move worker/runtime controls, raw run history, publish readiness, schedule settings, and low-level queue internals behind an Advanced / Operator Tools section so they no longer compete with the default queue-health answer.                                                 |
| UIPROF-005 | High     | Done   | Yes          | Replace system-native labels and error phrasing on Profiling with user-facing status language such as "Running normally", "Needs VPN or login", "Waiting for next scheduled run", "Finished this batch", and "Will retry timed-out tables later".                              |
| UIPROF-006 | High     | Done   | Yes          | Add visual and Playwright smoke coverage proving the default Profiling page shows queue health first, exposes completed live profile counts and next run times, and keeps worker/runtime controls hidden until Advanced is opened.                                             |
| UIPROF-007 | Medium   | Done   | Yes          | Add guardrails that prevent future Profiling changes from reintroducing always-visible worker controls, schedule editors, raw runtime fields, or multi-job dashboard clutter above the queue-health experience.                                                                |
| UIPROF-008 | Medium   | Done   | Conditional  | If existing APIs cannot support a trusted progress explanation, define a backend read-only queue health summary contract that returns completed, pending/unknown, failed, skipped, last delta, next run, and recommended operator action without changing scheduler execution. |
| UIPROF-009 | Critical | Done   | Yes          | Suppress inherited dashboard chrome on Profiling and keep the default first viewport as one clean queue-health hero, one primary schedule action, compact summaries, and the live queue list.                                                                                  |
| UIPROF-010 | Critical | Done   | Yes          | Remove dev-server port ambiguity so a restart cannot silently move the app from `localhost:3000` to another port while the user keeps testing the stale instance. Fail loud by default and print the exact URL when the server starts.                                         |
| UIPROF-011 | Critical | Done   | Yes          | Add a durable Profiling page-level error/blocker state for schedule, scheduler-status, and queue-preview failures instead of relying only on transient toasts.                                                                                                                 |
| UIPROF-012 | Critical | Done   | Yes          | Register Vue/front-end render error handling before or during app mount so render/setup failures route to the UI error stream and a visible fallback instead of a blank page.                                                                                                  |
| UIPROF-013 | High     | Done   | Yes          | Add e2e coverage for persisted user-browser state: focused schedule, advanced tab state, stale token/session state, malformed schedule rows, and cache-busted asset loading.                                                                                                   |
| UIPROF-014 | High     | Done   | Yes          | Update `docs/UI_WORKFLOW_SPEC.md` and related ADR/backlog text so Profiling's authoritative default is the simple queue-health hero plus live queue list, not an older sorted schedule-list-first contract.                                                                    |
| UIPROF-015 | Medium   | Done   | Yes          | Keep Advanced / Operator Tools visually and semantically hidden by default so closed worker controls do not pollute text traces, accessibility output, or diagnostics.                                                                                                         |
| UIPROF-016 | Medium   | Done   | Yes          | Strengthen workflow guardrails beyond template string checks by validating rendered Profiling behavior, persisted state, and blank-page failure modes.                                                                                                                         |
| UIPROF-017 | Medium   | Done   | No           | Replace the placeholder `npm run build` with a real front-end/server build or syntax validation gate so CI can catch broken runtime assets before merge.                                                                                                                       |
| UIPROF-018 | Medium   | Done   | Yes          | Reduce expected negative-path log noise in tests so real API/UI errors are visible during error-handling audits.                                                                                                                                                               |
| UIPROF-019 | Medium   | Done   | Yes          | Review and disposition existing Profiling trace artifacts and uncommitted audit changes before the next implementation pass.                                                                                                                                                   |

#### UIPROF-001 Work Packet

**Primary job**: Teach the frontend to explain profile queue state in plain English using existing data only.

**Files likely touched**: `docker/frontend/app.js`; optional helper module only if the view-model code becomes too large for a medium-safe slice.

**Acceptance criteria**:

- Add computed/helper functions for queue health rows without changing APIs or scheduler behavior.
- Each row should derive queue name, connector, profile type, health state, plain-English summary, last run, next run, completed live count when available, timeout/deferred notes when available, and primary next action.
- Missing counts must be labeled as unknown or unavailable rather than guessed.
- Existing Profiling behavior remains intact until later stories consume the new helpers.

**Upgrade-and-stop triggers**:

- Stop if the implementation needs new backend fields.
- Stop if queue health requires changing schedule persistence, profile execution, or live queue selection.
- Stop if the story grows into a layout rewrite; that belongs to `UIPROF-002`.

#### UIPROF-001 Completion Note - June 13, 2026

- Status changed from `Open` to `Done`.
- Added Profiling queue-health view-model helpers in `docker/frontend/app.js`: `profileQueueHealthRows`, `profileQueueHealthSummary`, `profileQueueHeroAnswer`, and row translators for plain status, explanation, counts, blockers, last/next run, source, type, and recommended next action.
- Missing per-schedule queue totals are labeled `Unknown` instead of guessed when the current schedule list/run APIs do not expose detailed counts for that schedule.
- Preserved connector runtime behavior, profile execution, queue persistence, scheduler cadence, Windows-auth handling, publish semantics, and live profile artifacts.
- Partially advanced `UIPROF-002` by wiring the default Profiling page in `docker/frontend/workflows/connectAndOperateTemplates.js` to the new helpers and adding compact `profile-queue-answer` styles in `docker/frontend/app.css`.
- Validation evidence: `node --check docker/frontend/app.js` passed; `node --check docker/frontend/workflows/connectAndOperateTemplates.js` passed; `npm run ui:workflow:guardrails` passed; `npm run test:e2e -- tests/e2e/ui-workflow.spec.js` passed 15/15; `npm run build` passed as the project placeholder build; `npm run catalog:repo:check` passed; `git diff --check` found no whitespace errors and only reported line-ending normalization warnings.
- Follow-up: complete `UIPROF-002` by moving visible Run Now, Queue Detail, Run History, Publish Readiness, and Schedule Settings tabs behind the intended clean queue-health home or Advanced / Operator Tools lane without changing backend semantics.

#### UIPROF-002 Work Packet

**Primary job**: Make the default Profiling page a clean monitoring home instead of an operator console.

**Files likely touched**: `docker/frontend/workflows/connectAndOperateTemplates.js`, `docker/frontend/app.css`, `docker/frontend/app.js`.

**Acceptance criteria**:

- The first visible Profiling area answers whether live profiling is healthy, blocked, or waiting.
- Show summary cards for running queues, completed live profiles, attention needed, and next scheduled run.
- Show queue rows/cards for Sonic_DW, VendorData, SSRS, and other schedules using the `UIPROF-001` view-model helpers.
- Keep Run Now, Schedule Settings, Worker Controls, Run History, and Publish Readiness out of the default first screen.
- Existing actions remain reachable through later tabs/advanced links until `UIPROF-004` reorganizes them.

**Upgrade-and-stop triggers**:

- Stop if the layout requires changing route ownership or role visibility.
- Stop if product asks for new backend queue math instead of using known fields.
- Stop if the work requires changing live scheduler behavior.

#### UIPROF-002 Completion Note - June 13, 2026

- Status changed from `In Progress` to `Done`.
- Reworked the default Profiling surface in `docker/frontend/workflows/connectAndOperateTemplates.js` so the first visible area is a queue-health answer, followed by summary cards for total queues, running queues, finished queues, queues needing attention, and next scheduled run.
- Replaced the grouped operator-style schedule sections with a scan-friendly live profile queue list powered by the `UIPROF-001` queue-health rows.
- Removed default-screen `Run Now`, `Edit`, `Run`, `Activate`, `Deactivate`, `Schedule Settings`, `Run History`, `Publish Readiness`, and worker/runtime controls from the queue-health home.
- Kept existing operator actions reachable through a collapsed `Advanced / Operator Tools` lane and existing deep-link tab state; no backend API, scheduler execution, queue persistence, role visibility, publish behavior, or live profile artifact semantics changed.
- Added compact queue-home styling in `docker/frontend/app.css` for the queue answer, operator lane spacing, and queue-health rows.
- Validation evidence: `node --check docker/frontend/app.js` passed; `node --check docker/frontend/workflows/connectAndOperateTemplates.js` passed; `npm run ui:workflow:guardrails` passed; `npm run test:e2e -- tests/e2e/ui-workflow.spec.js` passed 15/15.
- Follow-up: `UIPROF-003` should add the selected Queue Detail surface so `Open Queue` lands on a focused queue-health detail rather than the current operator queue workspace.

#### UIPROF-003 Work Packet

**Primary job**: Add a focused Queue Detail experience for one selected profile queue.

**Files likely touched**: `docker/frontend/workflows/connectAndOperateTemplates.js`, `docker/frontend/app.js`, `docker/frontend/app.css`.

**Acceptance criteria**:

- Selecting a queue opens a focused detail region or page for that queue.
- The detail starts with a plain-English health summary, then shows progress, recent completed objects, timeout/deferred notes, last run result, next run, and blocker/remediation.
- Primary actions are limited to safe existing actions: Open failures/details, Run now, Pause/Activate where already supported.
- Raw run artifacts and scheduler internals remain below the fold or behind Advanced.

**Upgrade-and-stop triggers**:

- Stop if a new route system or navigation restructure is required.
- Stop if the detail needs exact object-level progress unavailable from the current queue preview.
- Stop if action semantics need backend changes.

#### UIPROF-003 Completion Note - June 13, 2026

- Status changed from `Open` to `Done`.
- Added a focused selected Queue Detail region in `docker/frontend/workflows/connectAndOperateTemplates.js` for the queue opened from the live queue list.
- Queue Detail now starts with a plain-English health summary, completed/failed/remaining/selected/fresh-skip/timeout counts, last result, next run, current blockers, and existing safe actions: `Run Now`, `Pause`, and `Activate`.
- Moved object-level queue tables for next objects, deferred objects, freshness skips, and timeout retries behind a collapsed `Queue Internals` lane.
- Added detail styling in `docker/frontend/app.css`; no new routes, backend fields, queue selection semantics, or action behavior changed.

#### UIPROF-004 Work Packet

**Primary job**: Move operator-only Profiling controls behind an Advanced / Operator Tools lane.

**Files likely touched**: `docker/frontend/workflows/connectAndOperateTemplates.js`, `docker/frontend/app.css`, `docker/frontend/app.js`.

**Acceptance criteria**:

- Worker/runtime controls are collapsed by default.
- Run history, publish readiness, schedule settings, and queue internals are grouped as support lanes, not primary page content.
- Advanced sections have plain labels that explain why a user would open them.
- No operator control is deleted; this is a visibility and hierarchy pass only.

**Upgrade-and-stop triggers**:

- Stop if controls must be removed rather than reorganized.
- Stop if role-based permissions are required.
- Stop if backend safety checks need to change.

#### UIPROF-004 Completion Note - June 13, 2026

- Status changed from `Open` to `Done`.
- Moved worker controls, runtime status, Run Now, Queue Detail, Run History, Publish Readiness, and Schedule Settings into the collapsed `Advanced / Operator Tools` lane below the queue-health answer and live queue list.
- Kept all existing operator controls reachable through the existing `integrations.schedulerOpsTab` model and deep-link state; no controls were deleted and no backend safety checks changed.
- Kept selected queue object internals behind the collapsed `Queue Internals` lane rather than defaulting to raw queue tables.

#### UIPROF-005 Work Packet

**Primary job**: Replace raw Profiling status language with user-facing explanations.

**Files likely touched**: `docker/frontend/app.js`, `docker/frontend/workflows/connectAndOperateTemplates.js`, `docker/frontend/app.css`.

**Acceptance criteria**:

- Convert schedule and queue state into plain labels and short explanations.
- Known connection/auth/network failures should explain likely causes without exposing credentials.
- Technical details remain available in Advanced details for troubleshooting.
- The UI should distinguish "blocked", "waiting", "running", "succeeded recently", and "completed with retryable skips".

**Upgrade-and-stop triggers**:

- Stop if reliable error classification requires backend-normalized error codes.
- Stop if the story requires changing connector error generation.
- Stop if sensitive credential or server information would need to be displayed.

#### UIPROF-005 Completion Note - June 13, 2026

- Status changed from `Open` to `Done`.
- Added `profileQueueFriendlyError` in `docker/frontend/app.js` to translate common missing-column, login/auth/permission, timeout, network/connectivity, and publish failures into user-facing status language without exposing credentials or sensitive server details.
- Wired default Profiling blockers and last-result copy through the friendly error helper while preserving raw details in advanced/operator areas.
- Existing queue labels now distinguish waiting, running normally, needs attention, finished this batch, setup not ready, paused, running with issues, and retryable timeout states.

#### UIPROF-006 Work Packet

**Primary job**: Lock the clean Profiling default into smoke coverage.

**Files likely touched**: `tests/e2e/ui-workflow.spec.js`; optional test helpers if already used.

**Acceptance criteria**:

- E2E coverage confirms Profiling shows a queue health heading/hero.
- Coverage confirms completed live profile counts and next-run language are visible when schedule data is loaded.
- Coverage confirms worker/runtime controls are not visible by default.
- Existing workflow smoke tests still pass.

**Upgrade-and-stop triggers**:

- Stop if test data must be seeded by changing live queues.
- Stop if browser instability requires broad test-harness refactoring.
- Stop if assertions need backend fixture work beyond current UI smoke patterns.

#### UIPROF-006 Completion Note - June 13, 2026

- Status changed from `Open` to `Done`.
- Updated `tests/e2e/ui-workflow.spec.js` so Profiling smoke coverage asserts the queue-health hero, live profile queue list, completed/needs-attention/next-run language, collapsed Advanced lane, hidden worker controls, and absence of default publish controls.
- Validation evidence: `npm run test:e2e -- tests/e2e/ui-workflow.spec.js` passed 15/15.

#### UIPROF-007 Work Packet

**Primary job**: Prevent Profiling from drifting back into a mixed operator dashboard.

**Files likely touched**: `scripts/check-ui-workflow-guardrails.mjs`, `package.json`, `tests/e2e/ui-workflow.spec.js` if needed.

**Acceptance criteria**:

- Guardrails fail when always-visible Profiling markup reintroduces worker controls, raw scheduler settings, or run-history tables above the queue-health default.
- Guardrails allow those controls inside Advanced / Operator Tools.
- Documentation or failure messages tell future Codex sessions how to fix violations.

**Upgrade-and-stop triggers**:

- Stop if static guardrails cannot distinguish default content from advanced/collapsed content.
- Stop if the guardrail requires parsing Vue templates beyond the current script's safe complexity.
- Stop if broader workflow guardrail baselines need redesign.

#### UIPROF-007 Completion Note - June 13, 2026

- Status changed from `Open` to `Done`.
- Added Profiling-specific static guardrails in `scripts/check-ui-workflow-guardrails.mjs`.
- The guardrail now requires the queue-health answer and live queue list to appear before `Advanced / Operator Tools`, blocks default-screen operator labels such as worker controls, run history, publish readiness, schedule settings, and queue settings above the queue-health experience, and requires selected queue internals to stay behind `profile-queue-internals-lane`.
- Validation evidence: `npm run ui:workflow:guardrails` passed.

#### UIPROF-008 Work Packet

**Primary job**: Define, but do not automatically implement, a backend queue health summary contract if the frontend cannot produce trustworthy status from existing APIs.

**Files likely touched**: `docs/PROFILING_EXECUTION_FRAMEWORK.md`, `docs/PROJECT_BACKLOG.md`; implementation files only after explicit approval.

**Acceptance criteria**:

- Document a read-only queue health response shape with completed, pending or unknown, failed, skipped, timeout penalties, last delta, next run, and recommended operator action.
- State that the contract must not change execution, scheduling, queue selection, credentials, profile artifacts, or publish behavior.
- Add follow-up implementation stories only if the frontend stories prove existing APIs are insufficient.

**Upgrade-and-stop triggers**:

- Stop before implementing backend routes unless the user explicitly approves that next scope.
- Stop if exact pending counts require new persistent queue state.
- Stop if production worker ownership, enterprise auth, or SQL-backed persistence becomes part of the ask.

#### UIPROF-008 Completion Note - June 13, 2026

- Status changed from `Open` to `Done`.
- Added a future read-only queue-health contract to `docs/PROFILING_EXECUTION_FRAMEWORK.md`.
- Documented `GET /api/v1/connectors/profile-schedules/queue-health` and `GET /api/v1/connectors/profile-schedules/:scheduleId/queue-health` as optional future summary endpoints only.
- Defined response fields for completed live profiles, pending/unknown counts, failed live profiles, freshness skips, timeout penalties, selected-this-run count, last delta, last/next run, blocker category, publish status, warnings, and recommended operator action.
- Explicitly stated the contract must not change execution, scheduling, queue selection, timeout penalties, freshness windows, credentials, Windows-auth behavior, runtime permissions, profile artifacts, publish behavior, artifact scrubbing, or role visibility.
- No implementation follow-up was added because `UIPROF-001` through `UIPROF-007` proved the current UI can produce trustworthy queue explanations from existing APIs when unknown totals are clearly labeled.

#### UIPROF-009 Work Packet

**Primary job**: Make the Profiling default first viewport simple like Home / Find Data while preserving all existing operator capabilities behind drilldown.

**Files likely touched**: `docker/frontend/app.js`, `docker/frontend/workflows/connectAndOperateTemplates.js`, `docker/frontend/app.css`, `tests/e2e/ui-workflow.spec.js`, `scripts/check-ui-workflow-guardrails.mjs`, `docs/PROJECT_BACKLOG.md`.

**Acceptance criteria**:

- Profiling opts out of the global page intro, pipeline/status quick actions, and telemetry banner that make the page read like a dashboard.
- The first visible Profiling surface has one queue-health hero, one primary `New Schedule` action, compact status summaries, and the live queue list.
- Refresh remains available as a secondary icon action.
- Advanced / Operator Tools, worker controls, run history, publishing, schedule settings, and queue internals remain hidden by default and reachable when opened.
- Tests and guardrails fail if the inherited chrome or duplicate header returns.

**Upgrade-and-stop triggers**:

- Stop if the fix requires role visibility, route ownership, backend APIs, scheduler execution, queue persistence, runtime permissions, or publish semantics to change.
- Stop if operator controls must be deleted instead of hidden behind the existing Advanced lane.

#### UIPROF-009 Completion Note - June 14, 2026

- Status changed from `Open` to `Done`.
- Added `isSimpleWorkflowView` in `docker/frontend/app.js` so Profiling opts out of the global page intro, topbar title block, and telemetry banner without changing navigation, roles, routes, or backend behavior.
- Replaced the duplicate Profiling section header with a single clean queue-health hero in `docker/frontend/workflows/connectAndOperateTemplates.js`, with `New Schedule` as the primary action and refresh as a secondary icon action.
- Kept the existing summary cards, live queue list, selected queue detail, Advanced / Operator Tools, worker controls, run history, publish readiness, schedule settings, and queue internals reachable through their existing state and handlers.
- Updated `docker/frontend/app.css` for the clean hero and actions, with a visible minimum Profiling card height so the default page cannot collapse into a blank region.
- Tightened `tests/e2e/ui-workflow.spec.js` to assert Profiling has no global page intro or telemetry banner, one Profiling heading, a visible `New Schedule` action, a non-collapsed Profiling card with queue-health text, and hidden worker/runtime controls by default.
- Tightened `scripts/check-ui-workflow-guardrails.mjs` so future changes fail if Profiling loses the simple-view opt-out, clean hero, or primary schedule action, or if a duplicate section header returns above queue health.
- Follow-up hardening after browser blank-state report: filtered malformed saved schedule entries before sorting, wrapped queue-health row construction in a visible fallback row, and moved default queue-row setting labels onto the safe row view model so one unexpected schedule shape cannot blank the Profiling surface.
- End-to-end trace against `http://localhost:3000` showed the current server returns versioned `app.js` and `app.css`, profile schedule APIs return `200`, no console/page/request errors occur, and a fresh browser renders the Profiling card at full size. Added explicit `app.js`/`app.css` cache-busting query strings in `docker/frontend/index.html` to force existing Chrome tabs onto the current module/CSS graph.

#### UIPROF-010 Completion Note - June 15, 2026

- Status changed from `Open` to `Done`.
- Updated `src/index.js` so port retry is opt-in with `ALLOW_PORT_RETRY=true`; by default a busy port now exits with a clear message instead of silently moving to the next port.
- Startup logs now print the exact URL, such as `http://localhost:3000`, so browser testing targets the active server.
- Validation evidence: `node --check src/index.js` passed; `npm run test:e2e -- tests/e2e/smoke.spec.js --workers=1` passed 10/10; starting with occupied `PORT=3000` exited non-zero and printed the port-conflict remediation instead of retrying another port.

#### UIPROF-011 Completion Note - June 15, 2026

- Status changed from `Open` to `Done`.
- Added durable Profiling page issue state for schedule-list, scheduler-status, and selected queue-preview failures, with successful reloads clearing the matching issue.
- Rendered a visible `Profiling Needs Attention` blocker panel below the queue-health summary so failures remain visible after transient toasts disappear and the last known queue page can still render.
- Added Playwright coverage that forces the profile-schedules API to fail and verifies the hero, persistent issue panel, error copy, and retry action remain visible.
- Validation evidence: `node --check docker/frontend/app.js` passed; `node --check docker/frontend/workflows/connectAndOperateTemplates.js` passed; `npm run ui:workflow:guardrails` passed; `npm run test:e2e -- tests/e2e/ui-workflow.spec.js --workers=1` passed 16/16.

#### UIPROF-012 Completion Note - June 15, 2026

- Status changed from `Open` to `Done`.
- Registered global `window.error` and `window.unhandledrejection` handlers before Vue mount, added `vueApp.config.errorHandler`, and wrapped mount in a guarded try/catch.
- Added a minimal fatal UI fallback for mount-time failures so `#app-root` is not left blank if Vue cannot finish rendering.
- Added guardrail checks that fail if runtime handlers move after mount, Vue render errors stop routing to the UI error stream, or the mount fallback is removed.
- Validation evidence: `node --check docker/frontend/app.js` passed; `node --check scripts/check-ui-workflow-guardrails.mjs` passed; `npm run ui:workflow:guardrails` passed; `npm run test:e2e -- tests/e2e/ui-workflow.spec.js --workers=1` passed 16/16.

#### UIPROF-013 Completion Note - June 15, 2026

- Status changed from `Open` to `Done`.
- Added Playwright coverage for persisted Profiling state with `dg_profile_ops_tab`, stale focused queue id, saved connector id, malformed schedule rows, and versioned `app.js`/`app.css` assets.
- Added stale saved auth-state coverage proving the app recovers to a visible Home / Find Data surface instead of blanking.
- The persisted-state test exposed a real malformed-row blanking path in `profileScheduleStats`; schedule rows are now normalized at load time and stats defensively ignore non-object rows.
- Validation evidence: `node --check docker/frontend/app.js` passed; `node --check tests/e2e/ui-workflow.spec.js` passed; `npm run ui:workflow:guardrails` passed; `npm run test:e2e -- tests/e2e/ui-workflow.spec.js --workers=1` passed 18/18.

#### UIPROF-014 Completion Note - June 15, 2026

- Status changed from `Open` to `Done`.
- Updated `docs/UI_WORKFLOW_SPEC.md` so Profiling's authoritative default starts with a simple queue-health hero, one primary `New Schedule` action, compact summary counts, and a live queue list.
- Updated ADR-005, the UI workflow migration plan, and historical backlog language so older sorted-schedule-list wording is explicitly superseded rather than competing with the current product decision.
- Preserved action-need ordering inside the live queue list: running active, active failed, active successful, deactivated, and drafts.
- Validation evidence: targeted documentation search found no current sorted-schedule-list-first requirement; `npm run ui:workflow:guardrails` passed; `git diff --check` reported only line-ending normalization warnings.

#### UIPROF-015 Completion Note - June 15, 2026

- Status changed from `Open` to `Done`.
- Changed the Profiling Advanced / Operator Tools lane so the summary remains available, but the operator body is lazy-rendered only when the lane is opened.
- Added explicit Profiling operator open-state helpers so the native details element cannot leave closed worker controls, run history, publish readiness, or schedule settings in the default DOM.
- Simplified the closed summary copy so it no longer lists hidden operator controls in text traces.
- Tightened Playwright coverage to prove closed Advanced content is absent from default text and role queries, then visible after opening the lane.
- Added static guardrails requiring the lazy-render/open-state pattern for Profiling Advanced / Operator Tools.
- Validation evidence: `node --check docker/frontend/app.js` passed; `node --check docker/frontend/workflows/connectAndOperateTemplates.js` passed; `node --check scripts/check-ui-workflow-guardrails.mjs` passed; `node --check tests/e2e/ui-workflow.spec.js` passed; `npm run ui:workflow:guardrails` passed; `npm run test:e2e -- tests/e2e/ui-workflow.spec.js --workers=1` passed 18/18.

#### UIPROF-016 Completion Note - June 15, 2026

- Status changed from `Open` to `Done`.
- Added `tests/e2e/profiling-guardrails.spec.js` as a focused rendered guardrail suite for Profiling.
- The rendered guardrail validates the clean default queue-health page, absence of closed operator controls from default DOM/text/role traces, persisted advanced queue state with malformed schedule rows, and API-failure blockers that do not blank the page.
- Added `scripts/run-profiling-guardrails.mjs` so Playwright guardrail runs use a unique output directory and can be rerun without stale `.last-run.json` cleanup failures.
- Updated npm scripts so `npm run ui:workflow:guardrails` now runs both static template checks and the rendered Profiling guardrail; `npm run ui:workflow:guardrails:static` remains available for the static-only pass.
- Validation evidence: `node --check tests/e2e/profiling-guardrails.spec.js` passed; `node --check scripts/run-profiling-guardrails.mjs` passed; `node --check scripts/check-ui-workflow-guardrails.mjs` passed; `npm run ui:profiling:guardrails` passed 3/3; `npm run ui:workflow:guardrails` passed with static checks plus 3/3 rendered Profiling guardrails.

#### UIPROF-017 Completion Note - June 15, 2026

- Status changed from `Open` to `Done`.
- Replaced the placeholder `npm run build` echo with `node scripts/check-build-syntax.mjs`.
- Added a build syntax gate that runs `node --check` over JavaScript runtime assets in `src`, `docker/frontend`, and `scripts`.
- The gate reports every syntax failure with file-level diagnostics and exits non-zero so CI can catch broken server, frontend module, workflow template, and operational script assets before merge.
- Validation evidence: `node --check scripts/check-build-syntax.mjs` passed; `npm run build` passed and checked 160 JavaScript runtime files.

#### UIPROF-018 Completion Note - June 15, 2026

- Status changed from `Open` to `Done`.
- Suppressed routine Morgan request logging in `NODE_ENV=test` so expected smoke and guardrail requests do not bury useful diagnostics.
- Suppressed the custom request logger in `NODE_ENV=test` as well, after full validation showed it was still printing expected unit-test request probes.
- Updated the global API error handler so expected test-mode 4xx responses no longer emit warning logs, while 5xx errors still log loudly.
- Suppressed expected test-mode client disconnect noise such as `ECONNRESET` from Playwright/browser shutdown while preserving other client errors.
- Added unit coverage for the API error logging decision so expected 4xx test noise stays quiet and 5xx failures remain visible.
- Muted one intentional auth-middleware unit-test console error locally in the test so production auth exception logging remains unchanged.
- Updated the Profiling guardrail runner to use a non-default Playwright port unless the caller explicitly sets `PLAYWRIGHT_PORT`, reducing port-collision noise between smoke and guardrail runs.
- Validation evidence: `node --check src/app.js` passed; `node --check src/index.js` passed; `node --check src/middleware/errorHandler.js` passed; `node --check src/middleware/requestLogger.js` passed; `node --check tests/unit/error-handler.test.js` passed; `node --check tests/unit/auth-middleware.test.js` passed; `node --experimental-vm-modules node_modules/jest/bin/jest.js tests/unit/error-handler.test.js --runInBand --coverage=false` passed 7/7; `node --experimental-vm-modules node_modules/jest/bin/jest.js tests/unit/auth-middleware.test.js --runInBand --coverage=false` passed 6/6; `npm run build` passed; `npm run test:ci` passed 68/68 suites and 647/647 tests; `npm run test:e2e -- tests/e2e/smoke.spec.js --workers=1` passed 10/10; `npm run ui:workflow:guardrails` passed with static checks plus 3/3 rendered Profiling guardrails.

#### UIPROF-019 Completion Note - June 15, 2026

- Status changed from `Open` to `Done`.
- Reviewed the untracked Profiling trace artifacts under `tmp/profiling-trace` and `tmp/trace-profiling-page.mjs`.
- Confirmed the trace captured the older Advanced / Operator Tools text and DOM leakage that was later fixed by `UIPROF-015`, so the artifact was obsolete and should not be kept as source evidence.
- Removed the generated trace script, JSON, and screenshot from the working tree.
- Added scoped ignore rules for `tmp/profiling-trace/` and `tmp/trace-profiling-page.mjs` so future local Profiling traces do not reappear as untracked product changes.
- Reviewed the remaining uncommitted changes and left them in place because they are the intentional `UIPROF-009` through `UIPROF-018` implementation, documentation, guardrail, build-gate, and test-noise changes.
- Validation evidence: `git status --short --untracked-files=all` no longer lists the Profiling trace artifacts; `git diff --check` reported only line-ending normalization warnings.

#### Historical Guardrail Closeout Before UIWF-010 - June 11, 2026

- This note is retained only as delivery history for the guardrails/smoke coverage that made the later `UIWF-010` split safer.
- Tightened `scripts/check-ui-workflow-guardrails.mjs` so the retired `Command Center` primary label was no longer accepted as a transitional navigation label.
- Validation evidence at the time: `node --check scripts/check-ui-workflow-guardrails.mjs` passed; `npm run ui:workflow:guardrails` passed; `npm run test:e2e -- tests/e2e/ui-workflow.spec.js` passed 14/14; `git diff --check` found no whitespace errors and only reported line-ending normalization warnings for unrelated files plus `docker/frontend/app.css`.

#### UIWF-023 - June 11, 2026

- Status changed from `Planned` to `In Progress`.
- Added Playwright smoke coverage in `tests/e2e/ui-workflow.spec.js` for Home / Find Data, Search / Catalog, Lineage Explorer, Review Work / Governance Ops, Profiling, Connections, and Lineage Acquisition.
- Current tests map target workflow names to pre-migration navigation labels where needed: `Command Center`, `Profile Operations`, `Queues & Schedules`, and `Ingestion Studio`.
- Validation evidence: `npm run test:e2e -- tests/e2e/ui-workflow.spec.js` passed 7/7 workflow smoke tests; `git diff --check` found no whitespace errors and only reported pre-existing CRLF normalization warnings for unrelated docs.
- Follow-up: add screenshot/visual-regression baselines after the workflow labels stabilize, and update the smoke mapping when UIWF-011, UIWF-012, UIWF-014, and UIWF-015 rename or split surfaces.

#### UIWF-024 - June 11, 2026

- Status changed from `Planned` to `In Progress`.
- Added `scripts/check-ui-workflow-guardrails.mjs` and npm script `ui:workflow:guardrails`.
- Guardrails validate primary/transitional navigation labels, block `v-tabs` or unknown workflow `v-btn-toggle` models, and prevent connector/profile/publish action-handler counts from increasing beyond the current migration baseline.
- Validation evidence: `npm run ui:workflow:guardrails` passed; `git diff --check` found no whitespace errors and only reported pre-existing CRLF normalization warnings for unrelated docs.
- Follow-up: remove transitional label allowances and lower duplicated-action baselines as UIWF-011, UIWF-012, UIWF-013, UIWF-014, UIWF-015, UIWF-018, and UIWF-021 move or retire mixed surfaces.

#### UIWF-025 - June 11, 2026

- Status changed from `Planned` to `In Progress`.
- Added `docker/frontend/workflowComponents.js` with shared workflow action buttons, status chips, blocker lists, confidence notes, and detail drawers.
- Registered the shared components in `docker/frontend/app.js` and reused them in connector testing, saved connection rows, one-time profile run, profile schedule rows, profile run publishing, run detail drilldown, and Lineage Explorer confidence explanation.
- Added shared component styling in `docker/frontend/app.css`.
- Validation evidence: `npm run ui:workflow:guardrails` passed; `node --check docker/frontend/workflowComponents.js` passed; `node --check docker/frontend/app.js` passed; `npm run test:e2e -- tests/e2e/ui-workflow.spec.js` passed 7/7; `git diff --check` found no whitespace errors and only reported line-ending normalization warnings for unrelated docs plus `docker/frontend/app.css`.
- Follow-up: replace remaining duplicated native connector/profile buttons and inline status chips as each workflow page is split, then tighten `UIWF-024` action-count baselines.

#### UIWF-011 - June 11, 2026

- Status changed from `Planned` to `In Progress`.
- Medium setting was sufficient because this pass only reframed the existing `overview` route; it did not change role visibility, remove navigation entries, move controls between workflow owners, or split `docker/frontend/app.js`.
- Renamed the primary nav/page meta from `Command Center` to `Home / Find Data`.
- Reworked the default home hero into a search-or-ask-first entry point; later post-`UIWF-010` redesign removed helper pills and role shortcuts so Home stays search-only by default.
- Updated `tests/e2e/ui-workflow.spec.js` to smoke the new `Home / Find Data` label and search-first default text.
- Validation evidence: `npm run ui:workflow:guardrails` passed; `node --check docker/frontend/app.js` passed; `npm run test:e2e -- tests/e2e/ui-workflow.spec.js` passed 7/7; `git diff --check` found no whitespace errors and only reported line-ending normalization warnings for unrelated docs plus `docker/frontend/app.css`.
- Follow-up: `UIWF-022` must handle role-aware navigation separately and should stop/upgrade before changing visibility across User, Analyst, Steward, and Admin roles.

#### UIWF-012 - June 11, 2026

- Status changed from `Planned` to `In Progress`.
- Required stronger setting because the task replaces the admin-facing `Profile Operations` surface with the Connections workflow owner and touches controls adjacent to profiling.
- Renamed the admin navigation/page meta and quick links from `Profile Operations` to `Connections`.
- Reworked the default Connections view into an inventory-first admin surface with type, intelligent name, status, login check, discovery check, and explicit `Open`, `Test`, `Edit`, and disabled `Disable` actions.
- Added connection inventory view-model helpers that derive login/discovery status from existing connector test state without changing backend connector contracts.
- Kept profile runs, queues, publishing, and schedule controls as temporary drilldowns/links only; the default Connections page no longer promotes them as the primary job.
- Tightened `scripts/check-ui-workflow-guardrails.mjs` so `Profile Operations` is no longer accepted as a transitional primary navigation label.
- Validation evidence: `npm run ui:workflow:guardrails` passed; `node --check docker/frontend/app.js` passed; `npm run test:e2e -- tests/e2e/ui-workflow.spec.js` passed 11/11.
- Follow-up: `UIWF-013` should fully move any remaining one-time profile, schedule, run history, publish warning, and manual run-now controls out of Connections and into Profiling; backend disable semantics remain undefined and should be specified before enabling the `Disable` action.

#### UIWF-013 - June 11, 2026

- Status changed from `Planned` to `In Progress`.
- Required stronger setting because this task moves profile controls between Connections and Profiling workflow owners.
- Added a Profiling-owned `Run Now` tab on the existing `Queues & Schedules` surface for one-time aggregate, BI, and metadata profile runs.
- Kept schedule builder/list, queue monitoring, run history, publishing, retry publish, and manual run controls on the Profiling surface.
- Removed the visible one-time profile, schedule builder/list, queue status, run history, and publishing panels from the Connections surface.
- Left Connections with source-access inventory, connection wizard/detail, access management, and links into Profiling for run-now, runs, and publishing.
- Updated `runOneTimeProfile` and `prepareScheduleForSelectedConnector` routing so successful/next actions land in the Profiling tabs instead of the Connections workflow tab.
- Tightened `scripts/check-ui-workflow-guardrails.mjs` by removing the old Connections workflow toggle allowance and lowering schedule/publish action-count baselines.
- Validation evidence: `npm run ui:workflow:guardrails` passed; `node --check docker/frontend/app.js` passed; `npm run test:e2e -- tests/e2e/ui-workflow.spec.js` passed 11/11.
- Follow-up: `UIWF-014` should rebuild Profiling around schedule triage, one-database scope, schema selection, blockers, queue detail, and publish warning language without changing schedule execution semantics. Later `UIPROF` work supersedes the exact default layout with a simple queue-health hero plus live queue list.

#### UIWF-014 - June 11, 2026

- Status changed from `Planned` to `In Progress`.
- Required stronger setting because this task rebuilds the Profiling workflow around profile schedules and queues while preserving scheduler runtime behavior.
- Renamed the primary navigation/page label from `Queues & Schedules` to `Profiling`.
- Reworked the Profiling default `Overview` around schedule queue triage grouped as running active, active failed, active successful, deactivated, and drafts. This was later simplified by `UIPROF` into a queue-health hero plus live queue list using the same action-need order.
- Added schedule state helpers for blocker-first labels such as `Running`, `Running With Errors`, `Active Failed`, `Active Successful`, `Deactivated`, and `Draft`.
- Moved detailed active queue internals to the `Queues` tab so the default view starts with schedule triage rather than low-level queue tables.
- Updated the schedule builder with one-database scope messaging, selected database summary, login/discovery checks, schema/table scope copy, and blocker messages.
- Kept existing scheduler APIs, queue persistence, publish behavior, and runtime permissions unchanged.
- Tightened `scripts/check-ui-workflow-guardrails.mjs` so `Queues & Schedules` is no longer accepted as a transitional primary navigation label.
- Validation evidence: `npm run ui:workflow:guardrails` passed; `node --check docker/frontend/app.js` passed; `npm run test:e2e -- tests/e2e/ui-workflow.spec.js` passed 11/11.
- Follow-up: future work should add true schema picker data once the backend exposes discovered schemas as a stable schedule-builder contract; current schema/table scope continues to use the existing schedule scope field.

#### UIWF-015 - June 11, 2026

- Status changed from `Planned` to `In Progress`.
- Required stronger setting because this task reframes the workflow owner from `Ingestion Studio` to Lineage Acquisition and touches lineage evidence acquisition UX.
- Renamed the primary navigation/page label to `Lineage Acquisition`.
- Added a SONIC_DW domain-first acquisition panel with configured sources `Sonic_DW`, `VendorData`, `StagingDB`, `ETL_Staging`, and `SSIS_UAT`.
- Made the default action `Refresh Full Domain Evidence`, routed through the existing recommended workflow action without changing backend extraction, confidence, inferred-edge, or cross-source resolution contracts.
- Reframed connector-specific controls as `Advanced Source Troubleshooting` and `Scope Override` so targeted source refreshes are secondary to the configured domain workflow.
- Reworded SQL Server, SSIS, Data Factory, Airflow, and Databricks connector cards from raw extraction/generate-markdown language to evidence-source refresh language.
- Tightened `scripts/check-ui-workflow-guardrails.mjs` so `Ingestion Studio` is no longer accepted as a transitional primary navigation label.
- Validation evidence: `node --check docker/frontend/app.js` passed; `npm run ui:workflow:guardrails` passed; `npm run test:e2e -- tests/e2e/ui-workflow.spec.js` passed 11/11; `git diff --check` found no whitespace errors and only reported line-ending normalization warnings for unrelated files plus `docker/frontend/app.css`.
- Follow-up: add a true backend domain-refresh orchestration endpoint when the platform is ready to refresh all configured SONIC_DW sources as one auditable operation.

#### UIWF-016 - June 11, 2026

- Status changed from `Planned` to `In Progress`.
- Required stronger setting because this task reframes the Lineage Explorer default state for manual impact tracing while preserving lineage confidence, column semantics, graph resolution, and API contracts.
- Changed the Lineage Explorer shell copy and primary action from graph rendering to answer-first manual tracing.
- Reworked the default Lineage Explorer card around a table/column/report/metric search prompt, lineage intent selector, and `Get Plain-English Answer` primary CTA.
- Promoted the plain-English lineage answer, confidence label/tooltip including `Strongly Suggested`, caveats, upstream/downstream counts, and business-logic summary above graph detail.
- Moved graph rendering, blast radius, evidence audit, fullscreen, format, depth, and SSIS isolation controls into the `Graph & Evidence Drilldowns` area below the readable answer.
- Removed the duplicate side-panel answer card so Lineage Explorer has one clear answer surface.
- Updated smoke coverage to assert `Manual Impact Trace`, `Plain-English Lineage Answer`, `Get Plain-English Answer`, and `Graph & Evidence Drilldowns`.
- Validation evidence: `node --check docker/frontend/app.js` passed; `node --check docker/frontend/workflowComponents.js` passed; `npm run ui:workflow:guardrails` passed; `npm run test:e2e -- tests/e2e/ui-workflow.spec.js` passed 11/11; `git diff --check` found no whitespace errors and only reported line-ending normalization warnings for unrelated files plus `docker/frontend/app.css`.
- Follow-up: add browser screenshot baselines for the answer-first Lineage Explorer once visual regression snapshots are introduced.

#### UIWF-017 - June 11, 2026

- Status changed from `Planned` to `In Progress`.
- Stayed on medium because the work was scoped to focused frontend Search / Catalog result-card and detail-page changes without changing search ranking, index contracts, API contracts, or backend scoring.
- Added Search hero guidance that results show source location, type, match reason, and confidence before opening asset detail.
- Reworked catalog result cards to surface source location, type pill, match reason, confidence label/score, and plain-English confidence reason before the user opens an asset.
- Reframed selected asset detail around a `Business Summary` and confidence note before columns and technical metadata.
- Renamed the column dictionary area to `Columns & Technical Metadata` so business context stays first and technical detail sits below.
- Added frontend-only helper formatting for source location, asset type labels, match reasons, confidence labels, confidence reasons, and business summaries from existing payload fields.
- Updated smoke coverage to assert the Search / Catalog disambiguation and business-first contract.
- Validation evidence: `node --check docker/frontend/app.js` passed; `npm run ui:workflow:guardrails` passed; `npm run test:e2e -- tests/e2e/ui-workflow.spec.js` passed 11/11; `git diff --check` found no whitespace errors and only reported line-ending normalization warnings for unrelated files plus `docker/frontend/app.css`.
- Follow-up: add richer match-reason and confidence fields from the backend only after search/index contracts are explicitly planned.

#### UIWF-018 - June 11, 2026

- Status changed from `Planned` to `In Progress`.
- Required stronger setting because this task removes a deprecated primary navigation item and decomposes Trust & Compliance concepts across Review Work and confidence warnings.
- Removed `Trust & Compliance` from primary navigation while preserving the existing policy, quality, classification, and masking controls as a non-primary `Advanced Trust Controls` drilldown for Steward/Admin roles.
- Rerouted executive/steward shortcuts and `?view=governance` deep links toward `Governance Ops` so review starts from steward work queues instead of a generic trust page.
- Added a `Confidence Warnings & Review Queues` panel to Governance Ops with `Failed Profiles`, `Failed Lineage`, and `Suspicious Lineage` queue cards that link to the owning workflows rather than duplicating their controls.
- Added migration copy on the advanced controls page that points users back to Review Work.
- Tightened `scripts/check-ui-workflow-guardrails.mjs` so `Trust & Compliance` is no longer allowed as a transitional primary navigation label.
- Updated smoke and role-navigation coverage to assert the Review Work queue language and hidden deprecated label.
- Validation evidence: `node --check docker/frontend/app.js` passed; `npm run ui:workflow:guardrails` passed; `npm run test:e2e -- tests/e2e/ui-workflow.spec.js` passed 11/11; `git diff --check` found no whitespace errors and only reported line-ending normalization warnings for unrelated files plus `docker/frontend/app.css`.
- Follow-up: `UIWF-019` should deepen Governance Ops into durable failed-profile, failed-lineage, and suspicious-lineage queues backed by explicit work-item types, without introducing approval routing or global rule semantics unless upgraded and specified.

#### UIWF-019 - June 11, 2026

- Status changed from `Planned` to `In Progress`.
- Required stronger setting because this task builds Review Work as cross-workflow steward queues and must avoid duplicating Profiling, Lineage Explorer, or Lineage Acquisition controls.
- Replaced the count-only confidence warning panel with `Steward Review Work Queues` for `Failed Profiles`, `Failed Lineage`, and `Suspicious Lineage`.
- Added frontend-only queue derivation from existing Governance Ops tasks, incidents, publication checks, and portfolio alerts; no backend workflow state, approval routing, or global rule semantics changed.
- Added bite-sized work item cards with issue title, asset id, status, plain-English next action, and deep links to the owning workflow.
- Linked failed profile items to Profiling, failed lineage items to Lineage Explorer, and suspicious/stale evidence review to Lineage Acquisition or Search/Lineage Explorer where applicable.
- Kept operational fix controls in their owning workflows; Governance Ops remains a triage and deep-link surface only.
- Updated smoke coverage to assert `Steward Review Work Queues`, `Failed Profiles`, `Failed Lineage`, `Suspicious Lineage`, and `Open Owning Workflow`.
- Validation evidence: `node --check docker/frontend/app.js` passed; `npm run ui:workflow:guardrails` passed; `npm run test:e2e -- tests/e2e/ui-workflow.spec.js` passed 11/11; `git diff --check` found no whitespace errors and only reported line-ending normalization warnings for unrelated files plus `docker/frontend/app.css`.
- Follow-up: add explicit backend work-item types for failed profiles, failed lineage, suspicious lineage, metric review, and approvals when workflow-state contracts are ready.

#### UIWF-020 - June 11, 2026

- Status changed from `Planned` to `In Progress`.
- Reframed Glossary copy so business-authored definitions lead and technical mappings are described as supporting evidence.
- Reframed Metrics around `Metric Meaning`, display-only grouping of existing metric registry rows, selected-metric meaning, grouped variant cards, and in-review engine suggestions based on current metric state/confidence fields.
- Moved metric logic and impact links ahead of source-column/profile/runtime evidence; source columns, profile/runtime evidence, and advanced profile runs are now supporting lanes with Catalog and selected-asset lineage links instead of duplicating those workflows.
- Added smoke coverage for Business Glossary and Metric Intelligence default states.
- Validation evidence: `node --check docker/frontend/app.js` passed; `npm run ui:workflow:guardrails` passed; `npm run test:e2e -- tests/e2e/ui-workflow.spec.js` passed 13/13; `git diff --check` found no whitespace errors and only reported line-ending normalization warnings for unrelated files plus `docker/frontend/app.css`.
- Follow-up: backend metric concept grouping, certification, approval, and review workflow state remain out of scope until metric semantics/contracts are explicitly designed.

#### UIWF-021 - June 11, 2026

- Status changed from `Planned` to `In Progress`.
- Medium setting was sufficient because this pass marked Data Products as future-state instead of removing the nav item, deleting code, changing role visibility, or defining product contracts.
- Reframed the Data Products page metadata as `Future` and made the default page explain that Data Products is parked until the product definition is explicit.
- Routed current report/product metadata needs to Home/Asset Detail, selected-asset lineage, and Metrics with action cards rather than promoting Data Products as a primary workflow.
- Preserved the existing product cards as draft/reference content only; no backend data, product contracts, or lifecycle semantics changed.
- Added smoke coverage for the parked Data Products future-state page.
- Validation evidence: `node --check docker/frontend/app.js` passed; `npm run ui:workflow:guardrails` passed; `npm run test:e2e -- tests/e2e/ui-workflow.spec.js` passed 14/14; `git diff --check` found no whitespace errors and only reported line-ending normalization warnings for unrelated files plus `docker/frontend/app.css`.
- Follow-up: define product owner, consumer promise, asset bundle contract, certification rules, access posture, lifecycle states, and success metrics before Data Products returns as a real workflow.

#### UIWF-022 - June 11, 2026

- Status changed from `Planned` to `In Progress`.
- Required stronger setting because this changes role-based navigation visibility across User, Analyst, Data Steward, and Admin.
- Added frontend navigation audience metadata and role-profile mapping from existing user roles: `Viewer/User` to User, `Analyst` to Analyst, `PowerUser/Steward` to Data Steward, and `Admin` to Admin.
- Rendered `visibleNavSections` so normal users do not see advanced/raw operator pages such as `Profile Operations`, `Ingestion Studio`, `Queues & Schedules`, and `Platform Admin`.
- Added blocked deep-link handling so hidden pages return to `Home / Find Data` with a plain-English toast instead of exposing operator navigation.
- Filtered page quick actions through the same role visibility model.
- Expanded `tests/e2e/ui-workflow.spec.js` with User, Analyst, Data Steward, and Admin navigation matrix coverage using the existing dev-login role mapping.
- Validation evidence: `npm run ui:workflow:guardrails` passed; `node --check docker/frontend/app.js` passed; `npm run test:e2e -- tests/e2e/ui-workflow.spec.js` passed 11/11; `git diff --check` found no whitespace errors and only reported line-ending normalization warnings for unrelated docs plus `docker/frontend/app.css`.
- Follow-up: backend/API authorization remains unchanged and should stay the source of truth for enforcement; later UIWF work should rename deprecated labels and then tighten the transitional guardrail allowlist.

> **Non-Negotiable Architecture Principles**:
>
> **Layer 1 – Markdown Source of Truth (the dominant layer — ~80% of all governance content)**
>
> - Markdown `.md` files with YAML frontmatter are the authoritative source for the vast majority of governance data
> - This includes: data asset documentation, lineage, schema definitions, dependency declarations, **business glossary terms**, **classification taxonomies**, **ownership declarations**, **policy definitions**, **compliance framework mappings**, **data product descriptions**, **steward annotations**, **guidelines**, **decision logs**, and **quality rule definitions**
> - Git history of markdown files provides version control, change tracking, and a natural audit trail for all documentation-style governance content — you don't need SQL for this
> - Modeled after the same approach used by dbt (`schema.yml`), OpenMetadata (YAML ingestion), and Amundsen (file-based metadata) — industry-proven pattern
> - Meilisearch indexes all markdown/YAML content for full-text discovery
>
> **Layer 2 – SQL Operational Store (narrow use cases only — ~20% of governance features)**
>
> - A small subset of governance features generate genuinely stateful, high-frequency, or real-time data that cannot be stored reliably in flat markdown files
> - SQL is used **only** for: quality rule **execution results** (time-series measurements with timestamps), access request **live workflow state** (pending/approved/expired, changes in real time), task **assignment status** with SLA timers ticking, incident **lifecycle state** (acknowledged/resolved with MTTR), usage **event capture** (high-frequency user activity stream), **audit event log** (immutable compliance records), and notification **dispatch tracking**
> - Every SQL-stored item is either changing state too rapidly (events), is time-sensitive (SLA timers), or is legally required to be immutable (audit logs) — these are genuinely not document-style data
> - SQL data is **operational overlay** on top of the markdown asset registry; it never replaces markdown as source of truth
>
> **Layer 3 – BFF API (unchanged)**
>
> - Single REST API boundary merges markdown-indexed search results with SQL operational metadata
> - All business logic centralized in the BFF; frontend never reads SQL or Meilisearch directly
>
> **In plain terms:**
>
> - "What is the definition of Revenue?" → Markdown glossary file ✅
> - "Who owns the Customers table?" → `owner:` in the asset's YAML frontmatter ✅
> - "What are our PII classification rules?" → Markdown classification file ✅
> - "Has the quality check passed today?" → SQL (time-series measurement result with timestamp)
> - "What is the status of John's access request?" → SQL (live workflow state changes hourly)
> - "Who accessed PII data at 3:42 AM?" → SQL append-only audit log (compliance-grade, immutable)

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

---

## Story Storage Breakdown: Markdown vs SQL

> **Decision context**: SQL Server is not currently authorized. The table below shows exactly which stories can be built now with markdown-only, which are hybrid (definitions in markdown, live state in SQL), and which are fully blocked on SQL.

### ✅ Markdown-Only — Can Build Now (~60% of Phase 7 stories, ~130 story points)

These require zero SQL. Everything lives in `.md` / `.yml` files parsed by the existing ingestion pipeline and indexed into Meilisearch.

| Story                                                | Phase | What Gets Built                                                                                                                                                                                                         | Points |
| ---------------------------------------------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| **7A-001** Business Glossary Management              | 7a    | `data/glossary/` folder of `.md` files with YAML frontmatter (term, definition, synonyms, owner, related-terms). Browse/edit UI + search integration.                                                                   | 8      |
| **7A-002** Semantic Asset Mapping                    | 7a    | `glossary_terms:` field in asset YAML frontmatter linking terms to physical assets. Search resolves business terms to physical assets.                                                                                  | 5      |
| **7B-001** Classification Framework                  | 7b    | `data/classification/taxonomy.yml` defines categories (PII, GDPR, Financial, etc.). Admin UI to manage taxonomy. Classification appears as search facet.                                                                | 6      |
| **7B-002** Automated Classification Rules            | 7b    | Rule definitions in YAML; pattern-matching engine in BFF runs rules against asset metadata at index time and writes `classification:` back to YAML frontmatter.                                                         | 7      |
| **7D-001** Metadata Harvesting                       | 7d    | Already partially done (`markdownFromSqlServer.js`). Extend connectors (PostgreSQL, Snowflake etc.), generate markdown files for all harvested assets.                                                                  | 9      |
| **7D-002** Data Dictionary & Schema Browser          | 7d    | UI that reads existing markdown files and renders schema browser (table hierarchy, column details, history via Git log, export to PDF/HTML).                                                                            | 5      |
| **7D-003** Business Metadata Enrichment              | 7d    | UI to edit YAML frontmatter fields (description, owner, domain, business justification) and push changes back to markdown files.                                                                                        | 5      |
| **7E-001** Multi-Role Ownership Model                | 7e    | Extend YAML frontmatter with `owner:`, `steward:`, `domain_manager:`, `custodian:` fields. Ownership inheritance via folder hierarchy. Bulk assignment via CSV upload.                                                  | 5      |
| **7G-001** Compliance Framework Management           | 7g    | `data/compliance/gdpr.md`, `hipaa.md`, etc. Each framework file maps requirements to classification tags and policy files.                                                                                              | 6      |
| **7H-001** Data Products & Marketplace               | 7h    | `data/products/` folder. Each product is a markdown file (description, owner, SLAs, linked datasets, target audience, lifecycle state). Marketplace UI reads the index.                                                 | 10     |
| **7H-002** Data Product Contracts (definitions only) | 7h    | Contract YAML included in the product markdown file (schema guarantees, freshness SLA, quality thresholds). Rendered in marketplace detail view.                                                                        | 4      |
| **7J-001** Trust & Certification Framework           | 7j    | `certified:`, `trust_level:`, `certification_date:`, `certified_by:` fields in YAML frontmatter. Trust score formula runs at index time from existing quality/lineage/ownership fields. Trust badges in search results. | 7      |
| **7J-002** Data Endorsements                         | 7j    | `endorsements:` YAML block in asset markdown (who endorsed, confidence, conditions). Endorsements aggregate into trust score.                                                                                           | 5      |
| **7K-002** Guidelines & Decision Logs                | 7k    | `## Guidelines` and `## Decision Log` sections appended to asset markdown files. Git history is the audit trail.                                                                                                        | 4      |
| **7K-003** Steward Annotations                       | 7k    | `## Steward Notes` section in asset markdown (type: warning/info/deprecated, text, date). Annotations rendered in asset detail UI.                                                                                      | 4      |
| **7O-001** Blast Radius Analysis                     | 7o    | Already 90% done in Phase 4 lineage graph. Improve UI to highlight blast radius clearly and generate impact reports.                                                                                                    | 3      |
| **7O-002** Change Risk Assessment Documentation      | 7o    | Risk notes and migration guides as sections in asset markdown. API computes risk score from lineage depth + dependent count (all in Meilisearch).                                                                       | 4      |
| **7O-003** Dependency Graph Visualization            | 7o    | Already done in Phase 4. Polish and extend with domain filtering and SVG export.                                                                                                                                        | 2      |
| **7P-001** Governance Context API                    | 7p    | REST/GraphQL endpoint that wraps Meilisearch queries — returns asset + lineage + classification + trust + owner + glossary context per asset.                                                                           | 8      |
| **7P-002** Third-Party Tool Integrations             | 7p    | Embed governance API in BI tools. Integration config stored as markdown/YAML.                                                                                                                                           | 5      |
| **7Q-002** ROI & Business Impact Tracking            | 7q    | ROI metric definitions and baselines stored as markdown. BFF computes savings from metadata completeness improvements (countable from index).                                                                           | 4      |
| **7R-002** Glossary Stewardship                      | 7r    | Steward assignments stored in glossary markdown files. Stewardship dashboard reads completeness from index (% terms with owners, % reviewed).                                                                           | 4      |

**Markdown subtotal: ~120 story points across 22 stories, 11 phases**

---

### 🟡 Hybrid — Definitions in Markdown, Live State Needs SQL (~20% of stories, ~45 points)

The _definition_ part (rules, policies, frameworks) can be built in markdown now. The _operational state_ part (is it passing? what's the trend? who approved?) needs SQL later. These can be built in markdown first as a foundation, then upgraded.

| Story                                        | Markdown Now                                           | SQL Later                                          |
| -------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------- |
| **7B-003** Classification Policy Enforcement | Policy definitions in markdown                         | Enforcement event log, per-access decision records |
| **7E-002** Steward Portfolio Dashboard       | Reads existing markdown index for completeness metrics | Quality trend history, SLA breach time-series      |
| **7G-003** Compliance Reporting              | Report templates + data mapping from markdown index    | Accurate counts depend on 7G-002 audit log (SQL)   |
| **7R-001** Glossary Term Approval            | Term drafts stored as markdown PRs / file state        | Inline approval state if not using Git PR workflow |

---

### 🔴 Needs SQL — Fully Blocked Without SQL Server (~20% of stories, ~110 points)

These cannot be meaningfully built without a database because they are inherently stateful, time-series, or require immutable records.

| Story                                    | Phase | Why SQL Is Required                                                                                 |
| ---------------------------------------- | ----- | --------------------------------------------------------------------------------------------------- |
| **7C-001** Quality Rule Execution        | 7c    | Rule _definitions_ = markdown ✅. But results (ran at 08:00, found 412 nulls) must be stored in SQL |
| **7C-002** Profiling & Anomaly Detection | 7c    | Statistical profiles over time — requires time-series storage                                       |
| **7C-003** Quality Scorecard & Trends    | 7c    | Trend lines require historical result rows in SQL                                                   |
| **7E-003** Stewardship Tasks             | 7e    | Task state machine (open → in-progress → resolved), SLA timers ticking                              |
| **7F-003** Data Access Request Workflow  | 7f    | Request pending/approved/expired changes in real time                                               |
| **7G-002** Audit Logging                 | 7g    | Immutable, cryptographically signed, compliance-grade append-only log                               |
| **7H-003** Data Access Fulfillment       | 7h    | Access grant state, auto-expiry, audit trail                                                        |
| **7I-001** Workflow Engine               | 7i    | Rule execution state, event triggers, workflow run history                                          |
| **7I-002** Task Management & SLA         | 7i    | Live task state with SLA timers                                                                     |
| **7I-003** Approval Workflows            | 7i    | Multi-step approval state                                                                           |
| **7K-001** Comments & Discussions        | 7k    | Concurrent real-time comments (can't safely do multi-author append to flat files)                   |
| **7L-001** Usage Event Capture           | 7l    | High-frequency event stream (every search, view, download)                                          |
| **7L-002** Adoption Scoring              | 7l    | Depends on 7L-001 event data                                                                        |
| **7L-003** Retirement Recommendations    | 7l    | Depends on 7L-001 usage history                                                                     |
| **7M-001** Pipeline SLA Monitoring       | 7m    | SLA measurement results with timestamps                                                             |
| **7M-002** Anomaly Detection             | 7m    | Time-series comparison against historical baselines                                                 |
| **7M-003** Schema Change Detection       | 7m    | Schema snapshots over time                                                                          |
| **7N-001-003** Incident Management       | 7n    | Live incident state, MTTR calculations                                                              |
| **7P-003** Governance Webhooks           | 7p    | Webhook delivery state and retry tracking                                                           |
| **7Q-001** KPI Dashboard                 | 7q    | Depends on usage events and quality results (7L-001, 7C-001)                                        |

---

### Recommendation: Build Markdown-First, SQL Later

Build all markdown-only stories now. They represent the **entire documentation and definitional layer** of governance — glossary, classification, ownership, trust, data products, compliance frameworks, impact analysis, and the governance context API. This is high business value and zero SQL dependency.

When SQL Server is authorized, the SQL stories plug **on top of** the markdown foundation — they don't replace it. The markdown work done now is never wasted.

**Updated immediate sequence after the June 2, 2026 audit:**

1. **NEXT-COL-001** Column inventory markdown contract - make every table/view column AI-readable and stable.
2. **NEXT-COL-002** SQL column usage extraction - capture explicit column reads/writes/joins/filters.
3. **NEXT-COL-003** Column risk flag extraction - expose `SELECT *`, positional inserts, dynamic SQL, and unresolved contexts.
4. **NEXT-COL-004** SSIS column mapping extraction - capture data-flow mappings, lookups, derived columns, and dynamic mapping risks.
5. **NEXT-COL-005** Column lineage resolver - promote only validated column-to-column mappings.
6. **NEXT-COL-006** Column impact analysis engine - answer add/drop/rename/type/nullability impact questions with evidence.
7. **NEXT-COL-007** AI/Codex context output - package markdown context so Codex can answer table and column impact questions without reconnecting to production.
8. **Phase 7a** Glossary + Semantic Mapping - resume broader governance enrichment after impact-analysis foundations are in place.
9. **Phase 7e-001 / 7b / 7h / 7j / 7d / 7p-001** Ownership, classification, products, trust, schema browser, and governance context API.

---

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

## Current Implementation Audit and Next Backlog (June 2, 2026)

This section reflects the current codebase audit after the SQL/SSIS extraction,
search, lineage, markdown catalog rebuild, and AI-impact-analysis specification
work. It supersedes the older generic "planned" status for these specific
lineage/search stabilization items.

### Completed in Current Codebase

| Item ID                                                                      | Status       | Evidence                                                                                                                                                                                                                                                      |
| ---------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEARCH-001: Markdown-backed search fallback                                  | [x] Complete | `src/api/search.js` now supports in-memory markdown fallback behavior, filtered fallback results, no false full-catalog return for no-match queries, and cache refresh on newly extracted assets. Covered by `tests/unit/search-api.test.js`.                 |
| SEARCH-002: Catalog cache hydration                                          | [x] Complete | `src/utils/catalogCacheHydrator.js` hydrates the runtime search cache from markdown when Elasticsearch/Meilisearch is unavailable, empty, or stale.                                                                                                           |
| SEARCH-003: Search filter clearing and active filter behavior                | [x] Complete | Search API and frontend filtering now keep search text and facets separate enough to clear search and filters predictably. Covered by search API regression tests.                                                                                            |
| INGEST-001: SQL Server database discovery refresh                            | [x] Complete | `src/api/ingestion.js` exposes `/api/v1/ingestion/connect-sql-server/databases`; `docker/frontend/app.js` refreshes available database options when server/auth settings change.                                                                              |
| SQL-EXTRACT-001: Canonical SQL Server identity handling                      | [x] Complete | `src/services/sqlServerExtractor.js` canonicalizes named instances, preserves port-qualified linked servers, and emits stable object IDs. Covered by `tests/unit/sql-server-extractor.test.js`.                                                               |
| SQL-EXTRACT-002: SQL read/write extraction cleanup                           | [x] Complete | `src/services/markdownFromSqlServer.js` and `src/services/sqlServerExtractor.js` distinguish procedure read sources from write targets, including `MERGE` targets and four-part references. Covered by `tests/unit/markdown-from-sql-server.test.js`.         |
| SSIS-EXTRACT-001: Nested SSIS Execute SQL and Execute Package parsing        | [x] Complete | `src/services/ssisExtractor.js` deeply scans nested SSIS XML containers and exposes `parseSsisPackageXmlForLineage()` for raw XML rebuilds.                                                                                                                   |
| SSIS-EXTRACT-002: SSIS package and SQL bridge lineage                        | [x] Complete | `scripts/rebuild-catalog-from-raw.mjs` rebuilds markdown from raw SSIS XML, connects parent/child packages, and infers conservative SSIS-backed staging/vendor/ETL bridges.                                                                                   |
| CATALOG-001: Full raw-to-markdown catalog rebuild                            | [x] Complete | `scripts/rebuild-catalog-from-raw.mjs` rebuilds SQL and SSIS markdown from `data/analysis/raw`, validates output, and reports generated object counts.                                                                                                        |
| CATALOG-002: Manifest-backed clean catalog loading                           | [x] Complete | `data/markdown/catalog-manifest.json` is generated during rebuild; `src/services/markdownService.js` loads only manifest-listed markdown files when present so stale locked files do not pollute search or lineage. Covered by `tests/unit/markdown.test.js`. |
| LINEAGE-001: Centered lineage graph includes SSIS producers and bridge nodes | [x] Complete | `src/services/visualizationService.js` builds focused lineage graphs with SSIS package groups, parent/child package chains, bridge nodes, and table-name wrapping improvements. Covered by `tests/unit/visualization.test.js`.                                |
| LINEAGE-002: JMA claims acceptance trace                                     | [x] Complete | Verified chain: SSIS packages -> `StagingDB.JMA.STG_JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL` -> `VendorData.JMA.JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL` -> `ETL_Staging` -> `Sonic_DW.dbo.FACT_JMA_CLAIMS_TBL`.                                                  |
| SPEC-001: AI and column-level impact markdown contract                       | [x] Complete | `docs/LINEAGE_ENGINE_SPEC.md` now defines the AI-readable column metadata, column usage, column lineage, SSIS mapping, risk flag, and impact-analysis contract.                                                                                               |
| TEST-001: Focused regression coverage                                        | [x] Complete | Focused suite passes: `tests/unit/markdown-from-sql-server.test.js`, `tests/unit/sql-server-extractor.test.js`, `tests/unit/lineage.test.js`, `tests/unit/search-api.test.js`, `tests/unit/markdown.test.js`, `tests/unit/visualization.test.js`.             |

### Known Follow-Up From Current Audit

| Item ID                                                   | Status                         | Notes                                                                                                                                                                                                                   |
| --------------------------------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CATALOG-CLEAN-001: Physical stale markdown folder removal | [ ] Blocked by local file lock | Windows returned `EPERM` when removing `data/markdown/servers`. The manifest prevents stale files from loading, but a physical clean delete still requires closing whichever process has the folder locked.             |
| RAW-SQL-001: Malformed raw markdown repair                | [ ] Open                       | One raw SQL markdown file under `data/analysis/raw/sqlserver/servers/unknown/databases/StagingDB` has invalid YAML in the `name` field. The rebuild skips it safely, but the raw source should be fixed or regenerated. |

### Next Backlog Items: Column-Level Impact Analysis

These are the next recommended implementation steps. They are ordered to avoid
making extraction brittle: first capture evidence, then resolve only validated
facts, then build impact answers.

#### NEXT-COL-001: Column Inventory Markdown Contract

**Story**: Extend generated table/view markdown with complete structured column
metadata and stable canonical column IDs.

**Status**: [x] Complete  
**Points**: 5  
**Priority**: Critical

**Acceptance Criteria**:

- [x] Table and view markdown includes a structured `columns` YAML array.
- [x] Every column has canonical `column_id` in the form `[server].[database].[schema].[object].[column]`.
- [x] Column metadata includes type, length, precision, scale, nullable, identity, computed/default details, key/index participation, and extraction evidence when available.
- [x] Markdown parser preserves column metadata for API/search/AI context.
- [x] Unit tests cover normal, computed, identity, nullable, key, and indexed columns.

**Dependencies**: SQL-EXTRACT-001, CATALOG-001, SPEC-001

---

#### NEXT-COL-002: SQL Column Usage Extraction

**Story**: Extract explicit column usage from SQL definitions for procedures,
views, functions, and triggers.

**Status**: [x] Complete  
**Points**: 8  
**Priority**: Critical

**Acceptance Criteria**:

- [x] SQL parser emits `column_usage` for select list, joins, filters, group/order by, insert targets, update targets, merge keys, and calculations when parser evidence exists.
- [x] Four-part, three-part, two-part, and local references resolve to canonical column IDs only when exact table context is known.
- [x] Ambiguous aliases, dynamic SQL, and unresolved table contexts become unresolved column facts, not validated usage.
- [x] Unit fixtures cover `INSERT`, `UPDATE`, `MERGE`, `JOIN`, `WHERE`, CTEs, aliases, and linked-server references.

**Dependencies**: NEXT-COL-001

---

#### NEXT-COL-003: Column Risk Flag Extraction

**Story**: Detect patterns that make column impact analysis unsafe or incomplete.

**Status**: [x] Complete  
**Points**: 4  
**Priority**: Critical

**Acceptance Criteria**:

- [x] Extractor flags `select_star`, `insert_without_column_list`, `merge_without_explicit_column_mapping`, `dynamic_sql`, `dynamic_table_name`, `dynamic_column_name`, and unresolved parser contexts.
- [x] Risk flags are written to markdown even when no validated column edge exists.
- [x] AI/context APIs surface risk flags through parsed markdown objects used by search and impact responses.
- [x] Unit tests prove risky patterns are captured rather than hidden.

**Dependencies**: NEXT-COL-002

---

#### NEXT-COL-004: SSIS Column Mapping Extraction

**Story**: Extract SSIS data-flow column mappings, lookup mappings, derived
columns, and destination external metadata from package XML.

**Status**: [x] Complete  
**Points**: 8  
**Priority**: Critical

**Acceptance Criteria**:

- [x] SSIS package markdown includes structured data-flow mappings with component name, component type, source object, destination object, input column, output column, external metadata column, and evidence text.
- [x] Large SSIS mapping payloads are preserved in markdown sidecar chunks instead of being quarantined as truncated package frontmatter.
- [x] Dynamic connection managers resolve package variables, project/package parameters, environment variables, and literal SSIS expressions before remaining unresolved.
- [x] Raw rebuilds support scoped `ssisProjectParameterOverrides` for runtime SSIS project values that are not present in exported package XML.
- [x] Non-SQL SSIS endpoints create external-source markdown datasets with stable column IDs when component metadata is available.
- [x] Derived column expressions and lookup outputs are captured when present.
- [x] Nested containers are scanned consistently with current SSIS task parsing.
- [x] Dynamic variables/parameters create unresolved column lineage diagnostics only when they still affect SQL lineage or object identity after resolution.
- [x] Unit fixtures cover direct/renamed mapping, derived column, and parser preservation of unresolved dynamic mapping metadata.

**Dependencies**: SSIS-EXTRACT-001, NEXT-COL-001

---

#### NEXT-COL-005: Column Lineage Resolver

**Story**: Promote only validated source-column to target-column mappings into
`column_lineage`, and quarantine ambiguous mappings.

**Status**: [x] Complete  
**Points**: 8  
**Priority**: Critical

**Acceptance Criteria**:

- [x] Resolver validates both source and target canonical column IDs before creating a promoted column edge.
- [x] Resolver supports direct, rename, cast, derived, aggregate, lookup, constant, case expression, and calculation transform types.
- [x] Resolver rejects fuzzy, substring, and unsafe name-only/partial matches while safely promoting package-scoped partial references only when exactly one candidate object has the requested column.
- [x] Unresolved/probable column facts include reason, evidence, and suggested action.
- [x] Unit tests prove validated, probable, unresolved, and rejected column mappings are separated.

**Dependencies**: NEXT-COL-002, NEXT-COL-004

---

#### NEXT-COL-006: Column Impact Analysis Engine

**Story**: Given table, column, and change type, return downstream impact,
severity, evidence, and unresolved risks.

**Status**: [x] Complete  
**Points**: 8  
**Priority**: Critical

**Acceptance Criteria**:

- [x] Supports `add_column`, `drop_column`, `rename_column`, `change_data_type`, `change_length_precision_scale`, `change_nullability`, `change_default`, and `change_key_or_index`.
- [x] Returns impacted tables, views, procedures, functions, triggers, SSIS packages, and unresolved risks.
- [x] Separates compile-time break, runtime load failure, semantic/reporting risk, data quality risk, and metadata-only impact.
- [x] Includes evidence citations back to markdown IDs, SQL snippets, SSIS package/component names, and parser evidence.
- [x] Unit tests cover dropped-column and resized-column impact chains.

**Dependencies**: NEXT-COL-005

---

#### NEXT-COL-007: AI/Codex Context Output

**Story**: Provide AI-readable context for table and column impact questions
using only the markdown catalog.

**Status**: [x] Complete  
**Points**: 5  
**Priority**: High

**Acceptance Criteria**:

- [x] Context output includes table-level upstream/downstream summary.
- [x] Context output includes direct column usage summary.
- [x] Context output includes downstream blast-radius summary for a named column.
- [x] Context output includes unresolved risks and confidence/evidence labels.
- [x] Codex can answer "what feeds this table?" and "what breaks if I drop this column?" from markdown context without reconnecting to SQL/SSIS.

**Dependencies**: NEXT-COL-006

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

### Implementation Status (2026-06-06)

Phase 7 is closed for the current pre-Azure product baseline. It has a shared backend operations framework wired to the same catalog and lineage cache used by search, governance, marketplace, and lineage views, plus a Governance Ops UI control plane and durable local workflow state.

Implemented and tested:

- Marketplace access request workflow with lifecycle, SLA, fulfillment, audit history, and compliance export through `/api/v1/marketplace`.
- Data product contract workflow with versions, state transitions, SLA violations, readiness scoring, and compliance export through `/api/v1/data-products`.
- Trust scoring, certification/endorsement action capture, and trust history through `/api/v1/governance` and `/api/v1/governance-ops`.
- Stewardship tasks, rule-generated metadata completion work, status transitions, and priority routing through `/api/v1/governance-ops/tasks`.
- Collaborative asset comments, mention parsing, decision logs, and review history through `/api/v1/governance-ops/assets/:assetId/*`.
- Usage event capture, adoption scorecards, and retirement candidate recommendations through `/api/v1/governance-ops/usage`, `/adoption`, and `/retirement`.
- AI/governance context lookup by asset and natural-language question through `/api/v1/governance/context/:assetId` and `/api/v1/governance-ops/context/query`.
- Observability evaluations for SLA breaches, anomaly/drift signals, and breaking schema changes through `/api/v1/governance-ops/observability/*`.
- Incident lifecycle, root-cause transitions, and stakeholder communication records through `/api/v1/governance-ops/incidents`.
- Change impact risk assessment with approval recommendations and reviewer checklist through `/api/v1/governance-ops/impact/risk-assessment`.
- Governance KPI, ROI, glossary review/health, and publication readiness endpoints through `/api/v1/governance-ops`.
- Durable Governance Ops state persisted to `data/governance-ops/state.json` outside test mode, with admin status/export/import endpoints.
- Governance event delivery queue records task, incident, glossary, trust, comment, decision, and publication events for email/Slack/Teams activation.
- Governance Ops UI exposes durable store status, stewardship queue, incident workbench, publication checks, adoption leaders, AI context lookup, and recent event deliveries.
- Unit and API coverage in `tests/unit/governance-ops-service.test.js` and `tests/unit/governance-ops-api.test.js`.
- Playwright smoke coverage includes the Governance Ops protected endpoint in `tests/e2e/smoke.spec.js`.

Production deployment notes:

- Live email, Slack, Teams, ticketing, SQL-backed workflow storage, and enterprise secret-backed connector execution are environment configuration/deployment steps. The app now has the API/UI/event contracts needed to activate those once credentials and target systems are approved.
- The local durable JSON store is the pre-Azure persistence layer. Azure migration should replace it with SQL/Cosmos/Event Grid without changing the Phase 7 API contracts.

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

## Capability: Metric Logic Intelligence & Profile-Aware Chat Experience

### Purpose

Create a first-class experience where users and AI assistants can understand metric columns, explain the logic that creates them, evaluate the impact of formula changes, and use data profiling evidence in plain-English answers.

This capability turns column metadata, column lineage, transformation evidence, quality signals, and profiling results into answerable governance context. It should be designed for both the UI and the Codex/agent runtime package.

### Product Questions This Capability Must Answer

- "Which columns in this table are metrics?"
- "What logic creates this metric column?"
- "Which source columns feed this metric?"
- "Which procedure, SSIS package, BI semantic model, or transformation defines the formula?"
- "What happens if we change the formula feeding this metric?"
- "Which reports, dashboards, tables, procedures, packages, or downstream metrics are impacted?"
- "What does the data profile say about this metric?"
- "Has this metric drifted, spiked, gone stale, or changed distribution?"
- "Can the chatbot explain the metric using lineage, formula evidence, confidence, and profile statistics?"

### Design Principles

- Metric answers must cite machine-readable evidence: source artifact, object ID, column ID, process ID, formula/expression, and confidence.
- The chatbot should never imply a formula is known when only a metric inference exists.
- Formula-change impact must separate semantic/reporting risk, data-quality risk, runtime/load failure risk, and downstream trust/certification risk.
- Profiling should store statistics and run results as operational evidence while keeping raw data values out of the chatbot payload unless explicitly approved and masked.
- The DevOps/Azure data pack should expose compact metric answer cards so chat answers do not need to scan full source files.

### Epics

#### METRIC-001: Metric Column Registry And Semantic Detection

**Story**: Build a governed metric-column registry that identifies metric columns, distinguishes inferred metrics from confirmed metrics, and links each metric to business definitions and source evidence.  
**Points**: 6  
**Priority**: HIGH  
**Status**: First Pass Complete (2026-06-06)

**Acceptance Criteria**:

- [x] Metric registry records table/object ID, column ID, semantic type, business name, definition, owner/steward, confidence, and evidence source
- [x] Metric detection distinguishes confirmed metrics, inferred metrics, measure candidates, identifiers, dimensions, flags, dates, and attributes
- [x] Users can see why a column was classified as a metric, including name/type rules or explicit metadata
- [ ] Metric registry links metrics to glossary terms, data products, dashboards/reports, and downstream consumers when available
- [x] Existing column semantic API is extended through `/api/v1/metrics/*` so metric answers include confidence, evidence, and caveats
- [x] Runtime API includes compact metric answer cards; DevOps shard/export integration remains a follow-up

**Dependencies**: PHASE7B-002, PHASE7D-002, PHASE7S-003

**Implementation Notes (2026-06-06)**:

- Added `metricRegistryService` as the shared metric intelligence engine over markdown/catalog metadata.
- Added `/api/v1/metrics/registry`, `/tables/:assetId`, `/logic`, `/formula-impact`, `/resolve`, and `/runtime-pack`.
- Added Metric Intelligence UI page for registry search, per-table metric answers, logic explanation, and impact summary.
- Added unit/API tests for metric detection, logic evidence, formula impact, and runtime cards.
- Remaining work: glossary/data-product/dashboard links, persisted metric shards in DevOps/Azure package, and richer connector-provided BI measure definitions.

---

#### METRIC-002: Metric Logic Explainer

**Story**: Explain what logic creates a metric column by tracing upstream column lineage, transformation expressions, stored procedure logic, SSIS mappings, BI semantic model measures, and source evidence.  
**Points**: 8  
**Priority**: CRITICAL  
**Status**: Framework Complete / Live Rollout Pending (2026-06-06)

**Acceptance Criteria**:

- [x] Users can ask "what logic creates this metric column?" from API and Metric Intelligence UI
- [x] Answer identifies the metric column, upstream/downstream column evidence, transformation type, formula/expression when available, and evidence snippets
- [ ] Supports SQL procedures/views, SSIS data-flow mappings, dbt metrics/models, BI semantic measures, and connector-provided metric definitions when available
- [x] Distinguishes explicit formula evidence from inferred metric classification
- [x] Reports missing expression text as a caveat; dynamic SQL/select-star/alias/SSIS ambiguity mapping remains connector-dependent
- [x] Produces a plain-English explanation and a structured runtime answer card
- [ ] Golden prompt tests cover known metric columns, inferred metric columns without formula evidence, ambiguous metric names, and unresolved formula paths

**Dependencies**: METRIC-001, PHASE7O-001, PHASE7S-004

---

#### METRIC-003: Formula Change Impact Analysis

**Story**: Assess what happens if the formula feeding a metric changes, including downstream consumers, semantic risk, profile/quality risk, and governance communication requirements.  
**Points**: 8  
**Priority**: CRITICAL  
**Status**: Second Pass In Progress (2026-06-06)

**Acceptance Criteria**:

- [x] Users can ask "what happens if we change the formula feeding this metric?" through API/UI
- [ ] Impact answer lists downstream tables, views, procedures, SSIS packages, BI assets, dashboards, data products, and dependent metrics
- [x] Impact categories include semantic/reporting risk, data-quality risk, runtime/load failure risk, and trust/certification risk; compliance/policy risk remains a policy integration follow-up
- [x] Answer recommends mitigation: regression tests, profile comparison, stakeholder notification, approval workflow, rollback plan, and post-change monitoring
- [x] Supports proposed formula-change payloads where users provide old/new formula text or changed source columns
- [x] Formula-change impact uses column lineage and metric registry evidence rather than object-name inference alone
- [x] Runtime endpoint includes compact formula-impact hints and downstream metric counts for chat; persisted DevOps package export remains open

**Dependencies**: METRIC-002, PHASE7O-002, PHASE7I-003

---

#### METRIC-004: Data Profiling Foundation

**Story**: Build data profiling for tables and metric columns so the platform can describe distributions, nulls, uniqueness, value ranges, freshness, drift, and anomaly signals.  
**Points**: 10  
**Priority**: CRITICAL  
**Status**: Second Pass In Progress (2026-06-06)

**Acceptance Criteria**:

- [x] Profiling supports metadata-safe row count, null %, distinct count, min/max, mean, freshness, and limitations; median/stddev/percentiles/value-length/pattern distributions remain connector-run extensions
- [x] Metric-column profiles include metadata-safe row count, null %, distinct count, range, mean/median/stddev placeholders, profile timestamp, and freshness caveats when available
- [x] Profiling jobs can be planned and run on demand in dry-run/simulate framework modes; live connector execution is gated behind approved read-only connector executors
- [x] Raw values are not persisted in chatbot-visible payloads; sensitive columns omit range/cardinality style statistics unless explicitly safe
- [x] Profile results include run timestamp, source connector/asset context, sample/window definition, row count scanned or estimated, safety settings, confidence/limitations, warnings, and errors
- [x] Profile storage contract separates definitions/configuration from operational run results and is ready for SQL-backed history when available
- [x] Profile summaries are added to the Metric Intelligence detail view and API

**Implementation Notes (2026-06-06)**:

- Metric registry records safe profile placeholders from existing column metadata when present: row count, null count, distinct count, min, and max.
- Added `/api/v1/metrics/profile` to answer "what does the data profile say about this metric?" without raw values.
- Runtime cards now include profile freshness caveats and formula-impact hints.
- No raw metric values are stored or exposed.
- Added connector-agnostic profiling execution framework in `src/services/profilingExecutionService.js`.
- Added `/api/v1/profiling/contract`, `/plan`, `/run`, `/execute-plan`, `/apply`, and `/confluence-summary`.
- SQL Server, PostgreSQL, Snowflake, BigQuery, Databricks/Spark SQL, and Redshift plans generate aggregate-only read queries with dialect-specific timeout/sampling/full-scan guardrails and sensitive-column suppression.
- Metric Intelligence now includes a Profile Execution panel for planning, simulated runs, SQL preview, and Confluence-safe summary preview.
- Full scheduled profiling, live source executors, and SQL-backed profile history remain rollout work.

**Dependencies**: PHASE7C-001, PHASE7D-001, PHASE7F-002

---

#### METRIC-005: Profile-Aware Chat And Runtime Packaging

**Story**: Expose metric logic, formula impact, and data profiling to the chatbot through compact runtime answer cards and safe answer-generation rules.  
**Points**: 8  
**Priority**: CRITICAL  
**Status**: Second Pass In Progress (2026-06-06)

**Acceptance Criteria**:

- [x] Runtime endpoint includes compact metric answer cards; DevOps/Azure package export remains open
- [x] Runtime/API answers combine metric definition, formula evidence where available, source/downstream evidence, profile placeholders, confidence, and caveats
- [x] Chatbot/API can answer "what does the data profile say about this metric?" without exposing raw sensitive values
- [x] Chatbot/API surfaces stale profile warnings when the latest profile run is outside the accepted freshness window
- [x] Runtime/API answers distinguish metric-classification confidence and column-impact evidence confidence where available
- [x] Unit/API validation covers metric logic, formula-change impact, profile summaries, stale profile warnings, and sensitive-value masking policy
- [ ] Confluence pages link to metric/profile summaries for humans while directing AI/runtime use to the DevOps/Azure data pack

**Dependencies**: METRIC-001, METRIC-002, METRIC-003, METRIC-004, PHASE7S-003, PHASE7S-004

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

- [x] Glossary terms support hierarchy (parent/child relationships)
- [x] Each term includes definition, steward, business owner, related terms, and synonyms
- [x] Terms can be linked to multiple data assets (tables, columns, dashboards)
- [x] Version history tracks term definition changes with effective dates
- [x] CRUD APIs for programmatic term management
- [x] Bulk import/export of glossary terms (CSV, JSON)
- [x] Search surfaces glossary matches prominently in discovery results

**Tasks**:

- [x] Build glossary domain model and persistence layer
- [x] Create glossary CRUD APIs with versioning
- [x] Build glossary UI with term browser and editor
- [x] Implement term-to-asset linking
- [x] Add glossary search integration
- [x] Wire up bulk import/export
- [x] Add tests + documentation

**Implementation Notes (2026-06-05)**:

- Added markdown-backed governed term metadata for hierarchy, business owner, steward, reviewers, synonyms, related terms, linked assets, effective dating, and bounded version history.
- Added API endpoints for semantic resolution, CSV/JSON export, CSV/JSON import, version history, and asset mapping.
- Added a glossary workspace upgrade that shows ownership, definitions, synonyms, related terms, mapped technical assets, and a semantic resolver.
- Added glossary create/edit/delete controls plus asset search inside the mapping workflow so stewards can manage terms without editing markdown directly.
- Added focused unit coverage for glossary normalization, CSV import/export, business-term resolution, and asset governance glossary links.

**Dependencies**: PHASE3-001

---

#### PHASE7A-002: Semantic Asset Mapping

**Story**: Link business glossary terms to physical data assets automatically and manually  
**Points**: 5  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [x] UI allows mapping glossary terms to columns/tables
- [x] Semantic mappings visible in asset detail pages and lineage views
- [x] API enables programmatic semantic enrichment
- [x] Search queries against business terms resolve to physical assets
- [x] Lineage respects semantic mappings (propagate term meanings through pipelines)

**Tasks**:

- [x] UI for mapping terms to assets
- [x] Semantic query resolution engine
- [x] Lineage enrichment with semantic meaning
- [x] Add tests

**Implementation Notes (2026-06-05)**:

- Semantic resolver links business terms and synonyms to physical assets using explicit glossary mappings first and catalog metadata as a secondary signal.
- Search responses now include semantic matches and can surface linked physical assets ahead of plain text matches.
- Asset governance context now exposes glossary links.
- Lineage graph responses now enrich nodes and edges with direct glossary mappings plus propagated semantic terms across visible lineage edges, while preserving evidence labels so inferred propagation is not confused with explicit mappings.
- Asset detail pages now surface business-term mappings prominently, and the lineage graph legend explains direct versus propagated semantic terms.

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

- [x] Pre-built classification categories: Public, Confidential, Restricted, PII, PHI, GDPR, HIPAA, CCPA, Financial
- [x] Custom classification categories creatable by admins through the classification taxonomy API
- [x] Classifications support multi-level hierarchy
- [x] Bulk classification APIs for batch tagging
- [x] Classification appears in search facets and asset cards
- [x] Classifications are version-tracked with change history in `data/classification/taxonomy.yml`

**Tasks**:

- [x] Define classification schema and domain model
- [x] Build admin UI for managing classification taxonomies
- [x] Create bulk classification APIs
- [x] Integrate classifications into search indexing
- [x] Add tests

**Dependencies**: PHASE5-001

---

#### PHASE7B-002: Automated Classification Rules

**Story**: Auto-classify data assets based on column names, patterns, and metadata signals  
**Points**: 7  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [x] Rule engine detects PII patterns (email, phone, SSN, name + address combinations)
- [x] Regex-based rules for custom pattern detection
- [x] Rules based on column naming conventions (e.g., columns containing "salary" → Financial)
- [x] Auto-propagate classifications downstream through lineage
- [x] Manual override capability with audit logging
- [x] Classification confidence scores and audit trail
- [x] Batch re-classification when rules change
- [x] Metadata-only PII policy engine returns masking plans and never stores raw PII values
- [x] Column semantic classifier can answer metric-column questions when column metadata is present

**Tasks**:

- [x] Build rule engine with pattern detection
- [x] Implement PII detection library integration (optional Presidio Analyzer REST bridge; metadata-only, disabled unless configured)
- [x] Create UI for managing classification rules
- [x] Build lineage propagation logic
- [x] Build PII masking policy plan and masked sample-preview API
- [x] Build column semantic classification API for metric/dimension/identifier detection
- [x] Add observability + logging
- [x] Add tests

**Dependencies**: PHASE7B-001, PHASE4-001

---

#### PHASE7B-003: Classification Policies & Enforcement

**Story**: Define and enforce policies based on data classifications (masking, encryption, access restrictions)  
**Points**: 8  
**Priority**: 🔴 CRITICAL

**Acceptance Criteria**:

- [x] Policy templates for common scenarios (PII masking, GDPR encryption, financial audit trails)
- [x] Policies define actions: mask, encrypt, restrict access, log usage
- [x] Row-level security policies based on data classifications
- [x] Column-level masking policies (e.g., show last 4 digits only for credit cards)
- [x] Integration with database access controls
- [x] Audit logging of all policy-driven access decisions
- [x] Policy effectiveness dashboard

**Tasks**:

- [x] Define policy domain model
- [x] Build policy engine and advisory enforcement layer
- [x] Create policy template library
- [x] Integrate with database security controls
- [x] Build policy effectiveness reporting API/service
- [x] Add tests for policy templates, effective policies, API decisions, and audit logging

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

- [x] UI to define quality rules: null %, cardinality bounds, range checks, pattern matching, uniqueness
- [x] Rules support thresholds with severity levels (warning, critical, fail)
- [x] Rules can be triggered on schedule or on-demand
- [x] Execution shows pass/fail status with violation details
- [x] Failed rules generate incidents with alert routing
- [x] Rule versioning and deployment workflows
- [x] APIs for programmatic rule definition

**Tasks**:

- [x] Build quality rules domain model
- [x] Create rule execution engine
- [x] Build UI for rule definition and management
- [x] Integrate with incident management
- [x] Add alert routing
- [x] Add tests

**Dependencies**: PHASE4-001

---

#### PHASE7C-002: Data Profiling & Anomaly Detection

**Story**: Automatically profile data and detect anomalies, drift, and quality issues  
**Points**: 7  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [x] Auto-profiling generates statistics: distribution, null %, cardinality, min/max/mean
- [x] Anomaly detection flags unexpected patterns (e.g., unusual value distributions, sudden null spikes)
- [x] Data drift detection compares profiles over time (daily, weekly, monthly)
- [x] Findings surface in quality dashboard with trend lines
- [x] Configurable anomaly sensitivity
- [x] Export profiles for manual analysis

**Tasks**:

- [x] Build profiling computation engine
- [x] Build aggregate-safe profiling execution framework with dry-run, simulate, and live-executor contract
- [x] Add profile plan/run/apply/confluence-summary API endpoints
- [x] Add Profile Execution UI panel and SQL preview
- [x] Implement statistical anomaly detection
- [x] Create profiling scheduler
- [x] Build quality dashboard UI
- [x] Add visualization of drift trends
- [x] Add tests

**Dependencies**: PHASE7C-001

**Rollout Notes (2026-06-06)**:

- Framework-level profiling is complete and test-covered.
- Live connector execution still requires source-approved read-only credentials plus a connector executor that runs aggregate queries and returns no raw values.
- Historical trend storage remains ready for SQL operational storage when that layer is authorized.

---

#### PHASE7C-003: Data Quality Scorecard & Fitness

**Story**: Calculate enterprise data quality scores and "fitness for purpose" ratings  
**Points**: 6  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [x] Quality score combines completeness, accuracy, timeliness, consistency metrics
- [x] Fitness for purpose ratings for common use cases (finance reporting, ML training, analytics)
- [x] Dataset-level and column-level quality scores
- [x] Quality trends visible in asset cards and detail pages
- [x] Quality scores factor into search ranking
- [x] Quality SLA agreements and breach alerts
- [x] Scorecard export for compliance reporting

**Tasks**:

- [x] Define quality score formula
- [x] Implement scoring engine
- [x] Create fitness assessment framework
- [x] Build SLA logic and alerting
- [x] Integrate with search ranking
- [x] Add tests

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

- [x] Connectors for: SQL Server, PostgreSQL, Snowflake, BigQuery, Databricks, Salesforce, SAP
- [x] Managed connector registry includes industry-standard Azure, AWS, GCP, BI, API, pipeline, streaming, repo, ERP/CRM connector definitions
- [x] Repository connector supports metadata discovery for Python scripts and code-based pipeline assets
- [x] Harvest table/column schemas, data types, constraints, indexes through SQL Server, PostgreSQL, Snowflake, BigQuery, Databricks, and bridge-compatible metadata payloads/endpoints
- [x] Capture BI tool metadata (dashboards, reports, metrics definitions) through first-pass REST/bridge clients for mainstream BI platforms
- [x] Capture API specifications (OpenAPI/Swagger)
- [ ] Scheduled sync (daily, hourly) to keep metadata current
- [ ] Change detection and incremental updates
- [ ] Metadata versioning with historical snapshots
- [x] Permissioned connector execution lets users run approved connectors without seeing stored credentials
- [x] Connector credentials are masked/write-only in API and UI responses
- [x] Bulk/manual metadata injection through `metadata_payload`, `seed_metadata`, `sample_metadata`, `metadata_endpoint`, and stream endpoint overrides

**Tasks**:

- [x] Build connector framework
- [x] Implement system-specific connector bridges and direct REST/signed/artifact clients
- [ ] Create scheduler for metadata harvesting
- [ ] Build versioning and change tracking
- [ ] Add metadata caching and optimization
- [x] Add tests
- [x] Add documentation

**Implementation Notes (2026-06-06)**:

- Added a managed connector service with connector definitions for SQL Server, PostgreSQL, Snowflake, BigQuery, Databricks, Microsoft Purview, Azure Storage/ADLS, Azure Data Factory, AWS Glue, S3, Redshift, Google Dataplex/Data Catalog, GCS, Power BI, Tableau, Looker, Airflow, dbt, OpenAPI, Git repositories, Kafka, Salesforce, and SAP.
- Expanded mainstream reporting and semantic-layer connector definitions for MicroStrategy Cloud, on-prem SSAS, Power BI Report Server, SSRS, Qlik Cloud, Qlik Sense, Domo, Sigma, Mode, Metabase, Superset, Redash, Amazon QuickSight, Grafana, IBM Cognos, SAP BusinessObjects, Oracle Analytics, ThoughtSpot, and Sisense.
- Added permissioned connector execution so admins can store platform/service-account credential references once and grant users, roles, or groups `view/run/edit/admin` actions.
- Added API routes for connector definitions, connector CRUD, permission grants, dry-run execution, run history, and metadata snapshots.
- Added Connections UI controls for creating managed connectors, granting access, running dry-run harvests, and viewing snapshots.
- Added repo metadata handling for Python scripts so ETL code can become governed catalog evidence without copying raw source content into the response.
- Added connector extraction runtime with shared adapter contract, canonical metadata events, source-family adapters, extraction plans, stream execution, adapter coverage reporting, and actionable connector error handling.
- Added source-specific first-pass stream plans for Power BI, MicroStrategy Cloud, SSAS, and Tableau; all other data, BI, cloud, repo, API, pipeline, streaming, ERP/CRM, and ML connector definitions are plumbed through family adapters.
- Conformed existing SQL Server and SSIS extraction routes to the connector runtime. The existing ingestion UI remains compatible, but live metadata extraction now runs through `SqlServerLiveAdapter` and `SsisLiveAdapter` and returns framework status, stream results, canonical summaries, and connector errors.
- Added unit coverage proving SQL Server and SSIS extractor metadata can be converted into canonical connector events without introducing a second extraction engine.
- Added documented bridge adapters for every connector definition. Each bridge declares required config, accepted credential modes, documented source streams/endpoints, dry-run canonical event output, live-shaped metadata payload normalization, and actionable live-run remediation when `metadata_endpoint`, `catalog_endpoint`, `metadata_payload`, or `seed_metadata` is missing.
- Added regression coverage proving every connector bridge is plumbed and can emit canonical dry-run metadata, and proving live bridge runs return useful remediation when metadata source configuration is incomplete.
- Added direct source-client live harvest support for REST/JSON metadata APIs across Airflow, Azure Data Factory, Purview, Azure Storage/ADLS metadata manifests, AWS Glue/S3/Redshift signed endpoints, BigQuery, Databricks, Domo, Dataplex, GCS, GitHub/Azure DevOps repositories, Grafana, Looker, Metabase, MicroStrategy, Mode, OpenAPI, Power BI, Power BI Report Server, Qlik, QuickSight signed endpoints, Redash, SAP OData, Salesforce, SAP BusinessObjects, Sigma, SSRS, Superset, Tableau, ThoughtSpot, Oracle Analytics, Sisense, Kafka REST, and Schema Registry.
- Added local artifact extraction for configured Git repository file inventories and dbt manifest/catalog-shaped metadata so repo and dbt connectors can extract real code/artifact metadata without sample events.
- Added shared BI report profiling on top of the canonical connector runtime. Reporting connectors now produce metadata-only BI profiles with inventory counts, semantic model/dataset/source/metric coverage, lineage relationships, usage/refresh/subscription signals when available, coverage gaps, computer-friendly packages, Confluence-ready markdown, and assistant-ready answer text.
- Added shared connector metadata profiling for Salesforce, Azure Storage/ADLS, Amazon S3, Google Cloud Storage, Microsoft Purview, AWS Glue Data Catalog, Google Dataplex/Data Catalog, Azure Data Factory, SSIS, Apache Airflow, dbt, and Git repositories. OpenAPI, Kafka, and SAP are intentionally left as next-pass profile connectors.
- Added PostgreSQL and Snowflake native-driver paths that query information schema metadata with installed `pg` and `snowflake-sdk` packages, and return source-specific remediation when credentials or connectivity fail.
- Remaining live extractor work is now isolated to the native/existing extractor families and hardening: SQL Server and SSIS are live through existing extractor bridges; PostgreSQL and Snowflake need installed native drivers and credential smoke tests; SSAS needs XMLA/ADOMD client support or a configured metadata endpoint; AWS signed clients need live Sonic credential smoke tests and operation-specific hardening.
- Full local validation on 2026-06-06: `npm test -- --runInBand --coverage=false` passed 56 suites / 534 tests, `npm run test:e2e` passed 8 Playwright smoke tests, `npm run build` completed successfully, and connector coverage reported 43/43 bridge adapters plus 38 direct source clients.

**Dependencies**: PHASE2-001

---

#### PHASE7D-002: Data Dictionary & Schema Browser

**Story**: Create a comprehensive, navigable data dictionary showing all tables, columns, and transformations  
**Points**: 5  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [x] Schema browser shows table hierarchies with filtering/searching
- [x] Column details include: data type, nullable, semantic role, sensitivity, and business description where metadata is present
- [x] Column metadata includes business definition/semantic role and object ownership context
- [x] Transformation logic shown for computed/derived columns when source expression metadata is present
- [x] Links to documentation, owner contact info, related dashboards
- [ ] Historical view of schema changes (when columns added/removed/modified)
- [x] Export schema documentation as Markdown
- [ ] Export schema documentation as PDF/HTML

**Tasks**:

- [x] Build schema browser UI
- [x] Add column detail views with context
- [ ] Implement schema history tracking
- Add schema change notifications to stewards
- [x] Build schema export templates
- [x] Add tests

**Implementation Notes (2026-06-06)**:

- Added `schemaDictionaryService` to build filterable schema hierarchies, object-level dictionaries, normalized column metadata, downstream/upstream context, completeness flags, and Markdown export output without exposing raw data values.
- Added authenticated dictionary routes: `GET /api/v1/dictionary`, `GET /api/v1/dictionary/:assetId`, and `GET /api/v1/dictionary/:assetId/export.md`.
- Catalog Search object detail now loads dictionary payloads, shows a column dictionary table, and provides a Markdown export action.
- Added a generator-level dictionary enrichment contract so regenerated markdown includes conservative object business fields and column semantic/classification metadata from raw technical metadata.
- Enriched the local markdown catalog on 2026-06-06: 7,224 files scanned, 7,223 changed, 131,313 columns reviewed, 6,981 metric inferences, 16,801 sensitive-column inferences, and 7,191 business-domain inferences.
- Added unit/API/smoke coverage for the dictionary service and protected dictionary route.

**Dependencies**: PHASE7D-001

---

#### PHASE7D-003: Business Metadata & Enrichment

**Story**: Enable business teams to enrich technical metadata with descriptions, ownership, and business context  
**Points**: 5  
**Priority**: 🟠 HIGH

**Acceptance Criteria**:

- [x] UI to add/edit business descriptions for tables and columns
- [x] Assign business owners, technical stewards, and domain managers
- [x] Add business justifications for why data exists ("supports revenue forecasting")
- [x] Tag with business domains and functional areas
- [x] Link to business processes and use cases
- [ ] Track who contributed business metadata (audit trail)
- [ ] Bulk metadata enrichment via API/CSV import

**Tasks**:

- [x] Build metadata editing UI
- [x] Create ownership and domain assignment workflows
- [x] Add business context linking
- [ ] Build audit trail for metadata changes
- Add bulk import capability
- [x] Add tests

**Implementation Notes (2026-06-06)**:

- Extended markdown-backed object metadata updates to accept `business_domain`, `business_justification`, `business_processes`, `use_cases`, `documentation_links`, and `related_dashboards`.
- Catalog Search object detail now edits and saves those enrichment fields through the existing markdown metadata write path and runtime cache refresh.
- Added `scripts/enrich-markdown-data-dictionary.mjs` and `npm run catalog:dictionary:enrich` so existing local markdown can be enriched from metadata-only raw/catalog signals without passing large corpora through Codex.
- Wired the enrichment contract into `src/services/markdownFromSqlServer.js` and `scripts/rebuild-catalog-from-raw.mjs` so future SQL/SSIS/raw rebuilds keep the same dictionary-ready frontmatter.
- Added `docs/DATA_DICTIONARY_AND_METADATA_ENRICHMENT.md` with the API contract, editable fields, UI behavior, and validation commands.

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

## Phase 7s: Lineage Publication, DevOps Data Pack, and Codex Skill Experience

### Objectives

- Publish generated lineage documentation to the Sonic Data Lineage Confluence page in an industry-standard, easy-to-navigate information architecture.
- Publish the machine-readable Azure data pack to DevOps as the primary runtime source for Codex skills and other automated consumers.
- Keep Confluence, DevOps data packs, and generated manifests synchronized from the markdown source of truth without manual edits.
- Improve the computer-readable lineage payloads and Codex skill behavior so lineage, impact, confidence, and unresolved-risk answers are clear, accurate, and useful in plain English.
- Treat Confluence as the human documentation and navigation layer; treat the DevOps/Azure data pack as the authoritative machine-readable answer layer.

### User Stories

#### PHASE7S-001: Confluence Information Architecture And Export Package

**Story**: Generate Confluence-ready lineage documentation organized in an industry-standard structure that is easy for business, data, engineering, and governance users to browse.  
**Points**: 5  
**Priority**: HIGH  
**Status**: In Progress

**Acceptance Criteria**:

- [x] Export builds README, rebuild report, catalog manifest, source inventory, confidence guide, and object index pages
- [x] Export creates a full catalog bundle attachment
- [x] Export writes a manifest with hashes and publish flags
- [x] Export avoids one page per object by default
- [ ] Confluence pages are reorganized into a clear hierarchy, such as overview, source systems, databases, domains, high-value assets, confidence/known gaps, and operating guides
- [ ] Generated page titles, labels, breadcrumbs, and summaries follow consistent governance/catalog conventions
- [ ] Pages support common user journeys: "find a database," "find an object," "understand lineage confidence," "review unresolved facts," and "open the machine-readable data pack"
- [ ] Confluence content links to the DevOps/Azure data pack where appropriate instead of duplicating large machine-readable payloads in page bodies
- [ ] Dry-run output shows the proposed page tree before publishing

#### PHASE7S-002: Confluence Dry-Run And Live Sync

**Story**: Publish the organized Confluence documentation package to the Sonic Data Lineage root page using safe dry-run and live-publish modes.  
**Points**: 5  
**Priority**: HIGH  
**Status**: In Progress

**Acceptance Criteria**:

- [x] Dry-run mode requires no credentials and reports planned pages/attachments
- [x] Live mode requires Confluence URL, space key, parent page ID, email, and API token
- [x] Generated pages use `[AUTO]` titles and generated labels
- [x] Attachments include the object index and zipped markdown catalog as backup/export artifacts
- [ ] Publish mode preserves the industry-standard page hierarchy and updates existing generated pages without breaking stable links
- [ ] Publish mode clearly separates human-readable Confluence pages from machine-readable DevOps/Azure data pack artifacts
- [ ] Live publish validated against the Sonic Data Lineage page

#### PHASE7S-003: DevOps Azure Data Pack Publish

**Story**: Publish a versioned Azure data pack to DevOps as the primary machine-readable lineage runtime for Codex skills and automated consumers.  
**Points**: 5  
**Priority**: HIGH  
**Status**: In Progress

**Acceptance Criteria**:

- [ ] Data pack includes compact object context, registry/index files, answer cards, confidence metadata, unresolved-risk metadata, and source evidence paths
- [ ] Data pack is versioned, checksummed, and published to the agreed DevOps location
- [ ] Publish manifest records package version, build time, source hashes, object counts, and artifact paths
- [ ] Package shape supports fast lookups by object name, object ID, database, schema, source system, and common aliases
- [ ] DevOps publish can run in dry-run and live modes without committing secrets
- [ ] Validation confirms the Codex skill can read the published DevOps package without relying on Confluence page-body search
- [ ] Data pack includes sanitized `profile-index/` shards for database profiles, BI profiles, connector metadata profiles, metric candidates, sensitivity flags, quality gaps, and stale-profile warnings
- [ ] Profile index export follows `docs/PROFILE_INDEX_SPEC.md` and fails validation if raw values, sample values, report result rows, source payloads, credentials, tokens, vault references, or connection strings are present
- [ ] Profile index manifest records source run ids, source artifact paths, object/column counts, checksums, safety validation status, and build timestamp

#### PHASE7S-004: Codex Skill Answer Experience

**Story**: Enhance the Codex lineage skill and computer-readable payloads so users get strong plain-English answers from the DevOps/Azure data pack.  
**Points**: 5  
**Priority**: HIGH  
**Status**: In Progress

**Acceptance Criteria**:

- [ ] Skill answers use the DevOps/Azure data pack as the primary source and cite package artifacts used for evidence
- [ ] Skill reads `profile-index/` before run markdown or Confluence for profile, quality, metric, sensitivity, and freshness questions
- [ ] Skill distinguishes business consumers, maintenance/load-path reads, loaders, upstream sources, downstream impacts, and unresolved risks
- [ ] Skill supports common prompts: "what uses this?", "what feeds this?", "what breaks if this changes?", "how many times is this used?", "show column impact," and "explain the confidence"
- [ ] Computer-readable answer cards include enough semantic grouping for clear plain-English summaries without opening full object context every time
- [ ] Confidence, truncation, ambiguity, stale-source, and unresolved-parser warnings are surfaced in user-friendly language
- [ ] Prompt validation suite covers table lineage, column impact, database summaries, top-used objects, confidence explanations, and unresolved facts
- [ ] Confluence remains a secondary human documentation layer, not a required runtime dependency for Codex answers

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
