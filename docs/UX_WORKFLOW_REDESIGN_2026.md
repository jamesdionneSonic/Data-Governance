# UX Workflow Redesign 2026

## Design Intent

The application is an operational data governance workspace. It should feel consistent, dense, readable, and workflow-led. Pages should not look like separate prototypes.

## Information Architecture

Navigation is grouped by the job the user is doing:

| Group | Pages | User Job |
| --- | --- | --- |
| Find & Understand | Command Center, Catalog Search, Lineage Assistant, Lineage Explorer | Locate assets and understand dependencies. |
| Govern & Improve | Business Glossary, Trust & Compliance, Governance Ops, Metric Intelligence | Improve metadata, trust, ownership, quality, and metrics. |
| Package & Report | Data Products, Governance Insights | Package governed assets and communicate impact. |
| Connect & Operate | Connector Admin, Ingestion Studio, Profile Scheduler, Platform Admin | Configure sources, ingest metadata, schedule profiles, and administer the platform. |

## Page Pattern

Every primary page should use the same top-level pattern:

1. App header with product location and user context.
2. Page intro with workflow label, title, short purpose, and quick actions.
3. Telemetry strip for ingestion, pipeline progress, and search index.
4. Workflow content grouped into cards or panels.

## Workflow Separation

Connector Admin owns connector registration, credentials, permissions, notifications, webhooks, external links, and CI/CD checks.

Profile Scheduler is a separate operational page. It owns recurring profile jobs, worker state, run history, and schedule health. It should not be buried under Connector Admin.

Ingestion Studio owns extraction and markdown/index workflow.

## Visual Rules

- Cards use 8px or smaller radius.
- Page sections use the shared page intro and telemetry pattern.
- Search surfaces are compact utility panels, not dark hero sections.
- Chips, buttons, fields, and tables use shared contrast rules for readability.
- Avoid nested page cards unless the card represents a repeated item, modal, or framed tool.

## Next UX Debt

- Convert remaining one-off inline styles in large workflow pages into named classes.
- Break the large single-file Vue template into reusable components once the current POC stabilizes.
- Add visual regression coverage for Command Center, Catalog Search, Governance Ops, Connector Admin, Profile Scheduler, and Ingestion Studio.
