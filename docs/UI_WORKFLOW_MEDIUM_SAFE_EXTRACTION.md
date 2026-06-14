# UI Workflow Medium-Safe Extraction Guide

## Purpose

This guide makes the remaining `UIWF-010` frontend architecture work safe for medium-intelligence Codex sessions. It applies only to move-only extraction work that splits `docker/frontend/app.js` into workflow-owned template modules.

It does not authorize visual redesign, workflow simplification, backend/API changes, role changes, or moving controls between workflows.

## Current Status

`UIWF-010` page-template extraction is complete as of June 11, 2026. `docker/frontend/app.js` should contain only workflow page-template seams, not primary `activeView` page markup. Keep this guide as the rollback-prevention and future-maintenance contract.

## Medium-Safe Rule

Medium may proceed only when the task is one exact page extraction:

- Move one `activeView` template block at a time.
- Keep markup, bindings, copy, handlers, roles, routes, CSS classes, API calls, and behavior unchanged.
- Compose the moved template back into `docker/frontend/app.js` with a named `${...PageTemplate}` seam.
- Add the seam to `scripts/check-ui-workflow-guardrails.mjs`.
- Update `docs/PROJECT_BACKLOG.md` with the extraction and validation evidence.

If any item above is not true, stop and ask for the stronger setting listed in `docs/UI_WORKFLOW_MIGRATION_PLAN.md`.

## Required Work Packet

Before editing files, write a short packet with:

- Backlog item: `UIWF-010`
- Page/view being moved
- Owning workflow module
- Start marker
- End marker
- Target export name
- Explicit statement: no layout, behavior, role, API, CSS, or copy changes
- Validation commands

## Stop Conditions

Medium must stop before editing when:

- The start or end marker is unclear.
- A page block overlaps an already extracted template seam.
- The work requires changing JavaScript handlers, API calls, data shape, permissions, or role visibility.
- The work requires changing CSS or page layout.
- A template literal escaping issue cannot be fixed mechanically.
- `node --check`, guardrails, or serial e2e fail for a reason other than known browser-worker resource pressure.
- The user asks to simplify, remove clutter, redesign, or change functionality. That belongs to `docs/UI_WORKFLOW_REDESIGN_BACKLOG.md`.

## Remaining Extraction Map

Use the current `docker/frontend/app.js` as the source of truth, because line numbers shift after every extraction.

| View | Owner | Start Marker | End Marker | Target Export |
| --- | --- | --- | --- | --- |
| `governance` | Govern & Improve | `<div v-if="activeView === 'governance'" class="governance-page">` | `<div v-if="activeView === 'governanceOps'" class="governance-page">` | `advancedGovernancePageTemplate` |
| `governanceOps` | Govern & Improve | `<div v-if="activeView === 'governanceOps'" class="governance-page">` | `<div v-if="activeView === 'lineageAsk'">` | `governanceOpsPageTemplate` |
| `lineageAsk` | Find & Understand | `<div v-if="activeView === 'lineageAsk'">` | `<div v-if="activeView === 'metrics'">` | `lineageAssistantPageTemplate` |
| `metrics` | Govern & Improve | `<div v-if="activeView === 'metrics'">` | `<div v-if="activeView === 'discovery'">` | `metricIntelligencePageTemplate` |
| `discovery` | Find & Understand | `<div v-if="activeView === 'discovery'">` | `<div v-if="activeView === 'reports'">` | `lineageExplorerPageTemplate` |
| `reports` | Package & Report | `<div v-if="activeView === 'reports'">` | `<div v-if="activeView === 'integrations'" class="grid integrations-secondary-grid">` | `governanceInsightsPageTemplate` |
| `integrations` | Connect & Operate | `<div v-if="activeView === 'integrations'" class="grid integrations-secondary-grid">` | `<div v-if="activeView === 'scheduler'" class="workflow-page scheduler-page">` | `connectionsPageTemplate` |
| `scheduler` | Connect & Operate | `<div v-if="activeView === 'scheduler'" class="workflow-page scheduler-page">` | `<div v-if="activeView === 'integrations' && integrations.connectorWorkflowTab === 'integrations'" class="workflow-page connector-workflow-page">` | `profilingSchedulerPageTemplate` |
| `integrations` connector workflow | Connect & Operate | `<div v-if="activeView === 'integrations' && integrations.connectorWorkflowTab === 'integrations'" class="workflow-page connector-workflow-page">` | `<div v-if="activeView === 'import'" class="import-page">` | `connectorWorkflowPageTemplate` |
| `import` | Connect & Operate | `<div v-if="activeView === 'import'" class="import-page">` | `<div v-if="activeView === 'admin'">` | `lineageAcquisitionPageTemplate` |
| `admin` | Connect & Operate | `<div v-if="activeView === 'admin'">` | `</v-main>` closing page content marker | `platformAdminPageTemplate` |

## Validation Commands

Use these commands after every extraction:

```powershell
node --check docker/frontend/app.js
node --check <target-template-file>
node --check scripts/check-ui-workflow-guardrails.mjs
npm run ui:workflow:guardrails
npm run test:e2e -- tests/e2e/ui-workflow.spec.js --workers=1
git diff --check
```

The serial e2e command is intentional. The default parallel run has previously hit browser worker out-of-memory failures unrelated to the template extraction.
