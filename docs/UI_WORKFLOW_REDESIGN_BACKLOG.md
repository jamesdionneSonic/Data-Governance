# UI Workflow Redesign Backlog

## Purpose

This backlog starts after `UIWF-010` has split the monolithic frontend into workflow-owned modules. Unlike `UIWF-010`, these stories are allowed to change layouts, reduce clutter, move secondary controls, and improve functionality flow.

The goal is to make each workflow page usable, focused, and less busy without breaking backend contracts or hiding required capabilities.

## Safety Model For Medium

Medium-intelligence Codex may work on one redesign story at a time only when the story defines:

- The primary user job.
- What is visible by default.
- What moves into secondary panels, drawers, accordions, or advanced sections.
- What moves to another workflow page.
- What is removed entirely.
- APIs, permissions, data mutations, and roles that must not change.
- Smoke or visual acceptance checks.

Medium must stop when a decision crosses workflow ownership, role visibility, backend contracts, or data mutation semantics.

## Triage Buckets

Every busy control on a page must be assigned to one bucket before implementation:

| Bucket | Meaning |
| --- | --- |
| Primary | Visible on page load because it supports the page's main job. |
| Secondary | Still available, but moved into a card, drawer, accordion, detail panel, or advanced section. |
| Moved | Belongs to another workflow page and should deep-link there instead of duplicating controls. |
| Removed | Deleted from the UI only when explicitly approved by the story. |

## Proposed Stories

| ID | Priority | Status | Work |
| --- | --- | --- | --- |
| UIR-001 | Critical | Done | Create the page ownership matrix and clutter triage table for every primary workflow page. |
| UIR-002 | Critical | Done | Redesign Home / Find Data as a focused search-first landing page with no secondary workbench content below the search area by default. |
| UIR-003 | Critical | Done | Simplify Search / Catalog so search, disambiguation, recent-search recall, and asset detail are visually clear without exposing technical metadata first. |
| UIR-004 | Critical | Done | Redesign Lineage Explorer around plain-English answer first, impact summary second, graph/evidence drilldowns third. |
| UIR-005 | High | Done | Simplify Business Glossary and Metric Intelligence so definitions, metric variants, and technical evidence have separate visual lanes. |
| UIR-006 | High | Done | Redesign Governance Ops as a steward work queue with bite-sized cards, ownership, severity, due dates, and deep links to fixing workflows. |
| UIR-007 | Critical | Done | Simplify Connections into a connector inventory/detail workspace; move non-connection operations to Profiling or Lineage Acquisition. |
| UIR-008 | Critical | Done | Redesign Profiling around schedule health, queue progress, run history, blockers, and publish readiness. |
| UIR-009 | Critical | Done | Redesign Lineage Acquisition around domain refresh workflows and hide raw extraction/debug details behind advanced troubleshooting. |
| UIR-010 | High | Done | Simplify Platform Admin into grouped operational panels with safe defaults and advanced controls separated. |
| UIR-011 | High | Done | Add screenshot/visual regression baselines for redesigned workflow pages. |
| UIR-012 | High | Done | Tighten guardrails so mixed-workflow controls, retired labels, and duplicated operational buttons cannot return. |

## Execution Queue

Current working order for the cleanup pass:

| Queue | Story | Status | Plain-English Outcome |
| --- | --- | --- | --- |
| 1 | UIR-001 Page Ownership Matrix | Done | Every page has a declared job and rules for what belongs there. |
| 2 | UIR-002 Home / Find Data | Done | Home starts with search and shows results in place. |
| 3 | UIR-003 Search / Catalog | Done | Advanced catalog search is no longer the normal search landing page. |
| 4 | UIR-004 Selected-Asset Lineage | Done | Lineage starts with an answer and hides graph/evidence until requested. |
| 5A | UIR-005 Metric Intelligence | Done | Metrics starts with business meaning and variants; source columns, profile checks, runtime pack, and advanced runs are tucked behind supporting lanes. |
| 5B | UIR-005 Business Glossary | Done | Glossary starts with business-owned definitions; linked assets, mapping edits, and semantic resolver are supporting lanes. |
| 6 | UIR-006 Governance Ops | Done | Governance opens on steward review queues; ownership, tasks, incidents, readiness, context lookup, and event delivery are supporting lanes. |
| 7 | UIR-007 Connections | Done | Connections opens on reusable connection inventory/detail; builder and related Profiling links are supporting lanes. |
| 8 | UIR-008 Profiling | Done | Profiling opens on schedule health, queue progress, blockers, and publish readiness; worker/runtime controls are a support lane. |
| 9 | UIR-009 Lineage Acquisition | Done | Acquisition focuses on domain refresh workflows and hides debug internals behind advanced troubleshooting. |
| 10 | UIR-010 Platform Admin | Done | Admin groups safe operational panels and hides dangerous/advanced controls. |
| 11 | UIR-011 Visual Regression Baselines | Done | Redesigned pages have visual smoke coverage through stable page anchors and collapsed support-lane checks. |
| 12 | UIR-012 Post-Redesign Guardrails | Done | Guardrails block retired Home clutter, missing support lanes, duplicated buttons, and mixed-workflow controls from creeping back. |

## Medium-Ready Implementation Rules

Each redesign story must be implemented as one page or one page region. Medium may change layout and functionality only inside the story's page boundary and only after the primary, secondary, moved, and removed buckets are written in the work packet.

Allowed medium changes:

- Reorder existing sections inside one page.
- Move existing controls into drawers, accordions, detail panels, or advanced sections on the same page.
- Replace duplicated same-page controls with one shared control if the same handler and permissions are preserved.
- Add deep links to the workflow owner named in this backlog.
- Add or update smoke/visual checks for the changed page.

Medium must stop before:

- Moving a control to another page unless this backlog explicitly says where it goes.
- Deleting a control unless the story marks it `Removed`.
- Changing an API request, response shape, data mutation, permission, role, route, or backend service.
- Changing search ranking, lineage confidence, profile execution, connector runtime, schedule persistence, publishing, approval, or certification semantics.
- Redesigning more than one primary workflow page in a single implementation pass.

## Medium-Ready Story Packets

### UIR-001: Page Ownership Matrix

- Scope: documentation only.
- Deliverable: a table for every workflow page with primary, secondary, moved, and removed buckets.
- Acceptance: every later `UIR-*` story has a page contract before implementation.
- Medium safe: yes.
- Status: Done on June 11, 2026.

### UIR-002: Home / Find Data

- Scope: `Home / Find Data` only.
- Primary: search input and ask action only.
- Secondary: none visible on Home by default after user review.
- Moved: connector setup, profiling, lineage acquisition, raw admin operations.
- Removed: common-start helper pills, Home routing bubbles, recent objects card, role shortcuts, quality radar, pipeline progress, persona insights, and platform health from Home.
- Acceptance: Home opens with only search/ask; anything below the search bar is absent; all existing search/ask actions still work.
- Medium safe: yes if only this page template and matching tests are touched.
- Status: Done on June 11, 2026.
- Implementation: reshaped `homeFindDataPageTemplate` into a centered search/ask-only landing state, hid the generic Home intro/telemetry chrome, removed common-start helpers, routing bubbles, recent catalog cards, role shortcuts, quality radar, pipeline progress, persona insights, and platform health from Home.
- Follow-up: design recent-search recall as a lightweight Search / Catalog affordance, such as an input dropdown or command-palette history, not a Home card. Move pipeline progress to Lineage Acquisition or Profiling cleanup, quality/platform signals to Governance Ops or Platform Admin cleanup, and role shortcuts to role-aware navigation/backlog if still needed.
- Validation: `node --check docker/frontend/workflows/findAndUnderstandTemplates.js`, `node --check docker/frontend/app.js`, `npm run ui:workflow:guardrails`, `npm run test:e2e -- tests/e2e/ui-workflow.spec.js --workers=1`, and `git diff --check`.

### UIR-003: Search / Catalog

- Scope: `Search / Catalog` only.
- Primary: query, browse mode switch, result list with source location, type, match reason, and confidence.
- Secondary: facets, database tree, selected object technical detail, metadata enrichment.
- Moved: selected-asset lineage graph/explanation stays inside Search / Catalog as a deep-link action; access/product workflow remains parked until Data Products is defined.
- Removed: none unless separately approved.
- Acceptance: search and browse still work; asset detail starts with business summary/confidence before columns.
- Medium safe: yes if search APIs and ranking are unchanged.
- Status: Done on June 12, 2026.
- Implementation: preserved existing Search / Catalog search, browse, result-card, and business-first detail behavior; added lightweight persisted recent-search recall directly below the Search input with a clear action so it is no longer a Home card or separate box. Follow-up merge now makes Search the primary entry point for selected-asset lineage.
- Validation: `node --check docker/frontend/app.js`, `node --check docker/frontend/workflows/findAndUnderstandTemplates.js`, `npm run ui:workflow:guardrails`, `npm run test:e2e -- tests/e2e/ui-workflow.spec.js`, and `npm run build`.

### UIR-004: Lineage Explorer

- Scope: `Lineage Explorer` only.
- Primary: plain-English answer, upstream/downstream summary, impact summary.
- Secondary: graph, evidence tables, blast radius, raw technical trace.
- Moved: evidence refresh to Lineage Acquisition.
- Removed: duplicated refresh/extraction controls from the explorer page if equivalent deep links remain.
- Acceptance: users can answer impact questions without reading graph internals first.
- Medium safe: yes if lineage confidence and graph APIs are unchanged.
- Status: Done on June 12, 2026.
- Implementation: consolidated Lineage Explorer into selected-asset lineage reached from Search / Catalog. The route remains available for deep links, but it is no longer a primary navigation item.
- Validation: `node --check docker/frontend/workflows/findAndUnderstandTemplates.js`, `node --check docker/frontend/app.js`, `npm run ui:workflow:guardrails`, `npm run test:e2e -- tests/e2e/ui-workflow.spec.js`, and `npm run build`.

### UIR-005: Business Glossary And Metric Intelligence

- Scope: one of `Business Glossary` or `Metric Intelligence` per pass.
- Primary: business definitions for Glossary; metric concepts/variants for Metrics.
- Secondary: technical evidence, source columns, SQL/report/procedure detail.
- Moved: steward queue work to Governance Ops; lineage impact to Search / Catalog selected-asset lineage.
- Removed: none unless separately approved.
- Acceptance: business meaning appears before technical evidence.
- Medium safe: yes if glossary persistence and metric detection semantics are unchanged.
- Status: Done on June 12, 2026.
- Implementation: Metric Intelligence now opens on business meaning, concepts, variants, and selected metric explanation. Source columns, profile/runtime evidence, and advanced profile runs are collapsed supporting lanes. Business Glossary now keeps the left rail focused on terms and definitions, with linked technical evidence, asset mapping, and semantic resolver as collapsed supporting lanes. Metric detection, glossary persistence, profile, runtime pack, mapping, resolver, and impact APIs are unchanged.
- Validation: `node --check docker/frontend/workflows/governAndImproveTemplates.js`, `node --check docker/frontend/app.js`, `npm run ui:workflow:guardrails`, `npm run test:e2e -- tests/e2e/ui-workflow.spec.js`, `npm run build`, and Browser verification of closed Metric/Glossary support lanes.

### UIR-006: Governance Ops

- Scope: `Governance Ops` only.
- Primary: steward work queues with severity, owner, due/status, and next action.
- Secondary: queue filters, work item details, history, warning explanations.
- Moved: profile reruns to Profiling; lineage refresh to Lineage Acquisition; asset detail edits to Search / Catalog.
- Removed: duplicated operational controls once deep links exist.
- Acceptance: Governance Ops shows work to do, not raw operational consoles.
- Medium safe: yes if workflow state and approvals are unchanged.
- Status: Done on June 12, 2026.
- Implementation: Governance Ops now opens on `Governance Work Queue` and `Steward Review Work Queues` with failed profile, failed lineage, and suspicious lineage queues showing severity, owner, due/status, and next action. Ownership detail, task filters/actions, incidents, publication readiness, adoption leaders, AI context lookup, store status, and event delivery are collapsed supporting lanes. Workflow state, approvals, transitions, and APIs are unchanged.
- Validation: `node --check docker/frontend/workflows/governAndImproveTemplates.js`, `node --check docker/frontend/app.js`, `npm run ui:workflow:guardrails`, `npm run test:e2e -- tests/e2e/ui-workflow.spec.js`, `npm run build`, and Browser verification of closed Governance support lanes.

### UIR-007: Connections

- Scope: `Connections` only.
- Primary: connector inventory, connection status, login test, discovery test, open/edit/disable.
- Secondary: advanced config, access eligibility, related schedules as read-only deep links.
- Moved: schedule editing, profile queues, profile publishing, and run history to Profiling.
- Removed: duplicated profiling controls from Connections after deep links are present.
- Acceptance: Connections is about reusable source access, not running profile operations.
- Medium safe: yes if connector runtime contracts and credential handling are unchanged.
- Status: Done on June 12, 2026.
- Implementation: Connections now opens on reusable source access inventory and selected connection detail. The connection builder is a collapsed support lane that opens for active drafts; Profiling run/history/publishing links are collapsed under related workflow links. Connector testing, diagnostics, credential handling, access grants, and runtime contracts are unchanged.
- Validation: `node --check docker/frontend/workflows/connectAndOperateTemplates.js`, `node --check docker/frontend/app.js`, `npm run ui:workflow:guardrails`, `npm run test:e2e -- tests/e2e/ui-workflow.spec.js`, `npm run build`, and Browser verification of collapsed builder/profiling support lanes.

### UIR-008: Profiling

- Scope: `Profiling` only.
- Primary: schedule health, queue progress, blockers, run-now, publish readiness.
- Secondary: run history, worker state, failure detail, retry paths.
- Moved: credential edits to Connections.
- Removed: none unless duplicated controls exist on this page after consolidation.
- Acceptance: active/failed/draft/deactivated schedules are easy to distinguish and operate.
- Medium safe: yes if schedule execution, queue persistence, and publish semantics are unchanged.
- Status: Done on June 12, 2026.
- Implementation: Profiling now keeps `Schedule Queue` visible as the anchor for schedule health, blockers, queue progress, and publish readiness. Worker start/stop/run-due controls and runtime status are collapsed under `Worker And Runtime Controls`. Operator lanes were renamed to `Queue Detail`, `Run History`, `Publish Readiness`, and `Schedule Settings`. Schedule execution, queue persistence, dry-run guard behavior, and publish semantics are unchanged.
- Validation: `node --check docker/frontend/workflows/connectAndOperateTemplates.js`, `node --check docker/frontend/app.js`, `npm run ui:workflow:guardrails`, `npm run test:e2e -- tests/e2e/ui-workflow.spec.js`, `npm run build`, and Browser verification of closed worker/runtime support lane.

### UIR-009: Lineage Acquisition

- Scope: `Lineage Acquisition` only.
- Primary: domain refresh workflow and configured domain status.
- Secondary: scope override, raw extraction details, parser output, debug logs.
- Moved: end-user lineage answers to Search / Catalog selected-asset lineage.
- Removed: raw/debug panels from default view after advanced troubleshooting remains available.
- Acceptance: admins can refresh evidence without normal users seeing extraction internals.
- Medium safe: yes if extraction contracts and confidence scoring are unchanged.
- Status: Done on June 12, 2026.
- Implementation: Lineage Acquisition now opens on the configured `Lineage Acquisition Domain` and source status table with full-domain refresh as the primary action. Scope overrides, targeted extractors, markdown validate/load, raw evidence output, and export controls are collapsed under `Advanced Source Troubleshooting`; the Override Scope action opens that lane when needed. Extraction contracts, confidence scoring, and runtime behavior are unchanged.
- Validation: `node --check docker/frontend/workflows/connectAndOperateTemplates.js`, `node --check docker/frontend/app.js`, `npm run ui:workflow:guardrails`, `npm run test:e2e -- tests/e2e/ui-workflow.spec.js`, `npm run build`, and `git diff --check -- docker/frontend/workflows/connectAndOperateTemplates.js docker/frontend/app.js docker/frontend/app.css tests/e2e/ui-workflow.spec.js docs/UI_WORKFLOW_REDESIGN_BACKLOG.md`.

### UIR-010: Platform Admin

- Scope: `Platform Admin` only.
- Primary: safe operational overview, users, audit, health, settings.
- Secondary: API diagnostics, dangerous controls, raw logs.
- Moved: workflow-specific operations to their owning pages.
- Removed: duplicated workflow controls after deep links exist.
- Acceptance: admin page is grouped by operational concern and hides risky details by default.
- Medium safe: yes if role visibility and security-sensitive operations are unchanged.
- Status: Done on June 12, 2026.
- Implementation: Platform Admin now opens on `Platform Operations Overview` with user, active-user, audit, and captured-error summary metrics. User administration, user snapshot, platform health, settings, and audit remain visible as the safe default admin surface. Raw API errors and the clear-error action moved under collapsed `Advanced Diagnostics`. Role visibility, security-sensitive operations, audit behavior, user APIs, and admin APIs are unchanged.
- Validation: deferred to end-of-queue run per operator instruction.

### UIR-011: Visual Regression Baselines

- Scope: test assets only.
- Deliverable: screenshot baselines or equivalent visual smoke assertions for redesigned pages.
- Acceptance: each redesigned page has a visual guard before the next page is changed.
- Medium safe: yes.
- Status: Done on June 12, 2026.
- Implementation: Added stable visual smoke anchors to the workflow e2e matrix for Home, Glossary, Metrics, Governance Ops, Connections, Profiling, Lineage Acquisition, Platform Admin, and parked Data Products. Support-lane pages also assert those lanes are closed by default, giving the redesign a low-noise visual regression guard without brittle pixel screenshots.
- Validation: deferred to end-of-queue run per operator instruction.

### UIR-012: Post-Redesign Guardrails

- Scope: guardrail/test scripts only.
- Deliverable: checks that block retired labels, mixed-workflow controls, and duplicated operational buttons from returning.
- Acceptance: guardrails fail on known bad patterns and pass on the redesigned pages.
- Medium safe: yes if guardrails do not change app behavior.
- Status: Done on June 12, 2026.
- Implementation: The workflow guardrail now scans workflow-owned template modules as well as `app.js`, checks duplicated operational action references across both places, blocks retired Home clutter labels from returning to `homeFindDataPageTemplate`, and requires the redesigned secondary-control support lanes to remain present.
- Validation: deferred to end-of-queue run per operator instruction.

## Page Contracts

The table below is the implementation gate for `UIR-002` through `UIR-010`. A later story may refine one row, but medium must not begin code changes unless the target page has explicit Primary, Secondary, Moved, Removed, and Must Not Change entries.

| Page | Primary | Secondary | Moved | Removed | Must Not Change |
| --- | --- | --- | --- | --- | --- |
| Home / Find Data | Search for data and show ranked results in place. | Ranked results sorted by match/confidence, source location, type, match reason, and confidence. | Pipeline progress to Lineage Acquisition or Profiling; quality/platform signals to Governance Ops or Platform Admin; raw ingestion, profiling, connector setup, lineage acquisition, and admin operations stay on owning pages. | Common-start helper pills, Home routing bubbles, recent searches box, recent objects card, role shortcuts, quality radar, pipeline progress, persona insights, platform health, and automatic routing to Search. | Search API contracts, ranking semantics, role-aware navigation, deep-link fallback, quick action permissions. |
| Asset Detail | Explain the selected asset before lineage or technical drilldowns. | Business summary, confidence, owner, selected-asset lineage entry point, columns and technical metadata below the summary. | Advanced filters/database browse remain in internal Search / Catalog; evidence refresh stays in Lineage Acquisition. | Separate Lineage Explorer primary navigation. | Selected-object loading, governance context, lineage confidence semantics, graph resolution, evidence data shape. |
| Search / Catalog | Internal advanced catalog console for filters and database browsing. | Facets, database tree, technical catalog inspection, metadata enrichment. | Normal search results stay on Home; selected asset review moves to Asset Detail; access/product workflow remains parked until Data Products is defined. | Primary navigation promotion. | Search API contracts, permission filtering, catalog facet contracts. |
| Selected-Asset Lineage | Answer lineage/impact questions in plain English for the asset selected from Asset Detail. | Graph, evidence tables, blast radius, raw technical trace, confidence caveats. | Evidence refresh to Lineage Acquisition. | Standalone starting workflow. | Lineage confidence semantics, graph resolution, permission filtering, evidence data shape. |
| Business Glossary | Maintain business-owned terms, definitions, owners, synonyms, related terms, and asset mappings. | Semantic resolver, technical evidence drilldown, mapping search, status/version facts. | Steward queue work to Governance Ops; lineage impact to Search / Catalog selected-asset lineage. | None approved. | Glossary persistence, mapping APIs, term status semantics, permissions. |
| Metric Intelligence | Show metric concepts, variants, suggested definitions, business logic, and impact context. | Source columns/tables, SQL/report/procedure details, profiling context, review detail. | Steward review queues to Governance Ops; lineage impact to Search / Catalog selected-asset lineage. | None approved. | Metric detection, grouping, approval, certification, and profile semantics. |
| Governance Ops | Show steward work queues with severity, owner, status, due/next action, and deep links. | Filters, work item details, warning explanations, history, publication readiness context. | Profile reruns to Profiling; lineage refresh to Lineage Acquisition; asset detail edits to Search / Catalog. | Duplicated operational controls after deep links exist. | Workflow state, approval routing, global rule application, permission checks. |
| Connections | Manage reusable source access inventory, connection detail, login test, discovery test, open/edit/disable actions. | Advanced config, access eligibility, test results, related schedules as read-only links. | Schedule editing, profile queues, profile publishing, and run history to Profiling; lineage extraction to Lineage Acquisition. | Duplicated profiling/extraction controls after deep links exist. | Connector runtime contracts, credential handling, RBAC, draft resume behavior. |
| Profiling | Operate profile schedules, queue progress, blockers, run-now, publish readiness, and schedule health. | Run history, worker state, failure detail, retry paths, artifacts, SQL preview where already present. | Credential edits to Connections. | Duplicated connection-edit controls if present. | Schedule execution, queue persistence, publish semantics, artifact scrubbing, no-raw-values contract. |
| Lineage Acquisition | Refresh lineage evidence for configured domains and show domain status/default refresh path. | Scope override, raw extraction details, parser output, debug logs, advanced troubleshooting. | End-user lineage answers to Search / Catalog selected-asset lineage. | Raw/debug panels from default view after advanced troubleshooting remains available. | Extraction contracts, confidence scoring, inferred-edge publishing, domain source mapping. |
| Platform Admin | Provide safe operational overview and admin actions grouped by concern. | API diagnostics, raw logs, dangerous controls, audit-sensitive details. | Workflow-specific operations to their owning pages. | Duplicated workflow controls after deep links exist. | Role visibility, audit-sensitive operations, security controls, user/admin APIs. |
| Data Products Future-State | Explain that Data Products is parked until a concrete product definition exists. | Definition gaps, draft examples if present, links to Search and Metrics. | Active report metadata workflows to Search / Catalog selected-asset lineage and Metrics. | Primary navigation promotion until definition is approved. | Parked/future-state semantics and role visibility. |
| Help Center | Help users understand current workflow navigation and where to do each job. | Workflow descriptions, role guidance, migration notes. | Product operations to their owning workflow pages. | None approved. | Help-only behavior; no operational side effects. |

## UIR-001 Completion Notes

- Added the page ownership matrix for active workflow pages plus parked Data Products and Help Center.
- Assigned every page to Primary, Secondary, Moved, Removed, and Must Not Change buckets.
- Established that later medium redesign stories must work from a single page row and stop before cross-page ownership or backend/permission changes.

### Home / Find Data

- Primary: search or ask about data.
- Secondary: none visible on Home by default after user review.
- Moved: raw ingestion, profiling, connector setup, admin operations.
- Must not change: search route behavior, role-aware navigation, deep-link fallback.

### Search / Catalog

- Primary: internal advanced search, filtering, and database browsing.
- Secondary: facets, object detail, technical metadata, governance enrichment.
- Moved: normal search results stay on Home; selected asset review and lineage entry move to Asset Detail; access request/product workflow remains parked until Data Products is defined.
- Must not change: search API contracts, ranking semantics, permission filtering.

### Lineage Explorer

- Primary: internal/deep-link selected-asset lineage and impact answers in plain English.
- Secondary: graph, evidence, raw technical trace.
- Moved: evidence refresh to Lineage Acquisition.
- Must not change: lineage confidence semantics, graph resolution, permission filtering.

### Business Glossary And Metric Intelligence

- Primary: business definitions and metric meaning.
- Secondary: technical evidence, source columns, SQL/report/procedure details.
- Moved: steward tasks to Governance Ops, lineage impact to Asset Detail / selected-asset lineage.
- Must not change: glossary persistence, metric detection, certification or approval semantics.

### Governance Ops

- Primary: steward work queues.
- Secondary: queue filters, history, warnings, deep-link context.
- Moved: actual profile reruns to Profiling, lineage refresh to Lineage Acquisition, asset detail editing to Search/Catalog.
- Must not change: workflow state, approval routing, global rule application.

### Connections

- Primary: reusable source access inventory and connection detail.
- Secondary: login test, discovery test, access eligibility, advanced config.
- Moved: schedules, profile queues, publishing, lineage extraction, raw run history.
- Must not change: connector runtime contracts, credential handling, RBAC.

### Profiling

- Primary: schedule health, queue progress, manual run-now, publish readiness.
- Secondary: run history, failures, retry paths, worker state.
- Moved: credential editing to Connections.
- Must not change: schedule execution, queue persistence, publish semantics.

### Lineage Acquisition

- Primary: refresh lineage evidence for configured domains.
- Secondary: scope override, raw extraction details, parser output, debug logs.
- Moved: end-user lineage answers to Asset Detail / selected-asset lineage.
- Must not change: extraction contracts, confidence scoring, inferred-edge publishing.

### Platform Admin

- Primary: safe operational overview and admin actions.
- Secondary: raw diagnostics and dangerous controls.
- Moved: workflow-specific operations to their owning pages.
- Must not change: role visibility, audit-sensitive operations, security controls.
