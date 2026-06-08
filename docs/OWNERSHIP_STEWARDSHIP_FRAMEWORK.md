# Ownership & Stewardship Framework

## Purpose

The ownership framework makes accountability explicit for governed assets without requiring SQL operational storage.

It supports four roles:

| Role | Responsibility |
| --- | --- |
| `owner` | Business purpose, criticality, certification decisions, and funding accountability. |
| `steward` | Definitions, metadata completeness, lineage evidence, quality triage, and daily governance tasks. |
| `domain_manager` | Escalations across a domain and cross-team ownership conflicts. |
| `custodian` | Platform operations, access controls, storage posture, and source-system coordination. |

## Markdown-First Contract

Assets can carry these fields in markdown frontmatter:

```yaml
owner: sales-owner@example.com
steward: sales-steward@example.com
domain_manager: sales-manager@example.com
custodian: platform@example.com
```

The app reads those fields directly from the catalog cache. If an asset is missing a role, the service tries to inherit from a parent domain, database, or schema record when that record exists in the loaded catalog.

## APIs

| Endpoint | Use |
| --- | --- |
| `GET /api/v1/governance-ops/ownership/model` | Returns role definitions and responsibilities. |
| `GET /api/v1/governance-ops/ownership/summary` | Returns role coverage, inherited-role counts, gaps, and escalation chains. |
| `GET /api/v1/governance-ops/ownership/portfolio?subject=<owner-or-steward>` | Returns a steward/owner portfolio with assets, alerts, open tasks, overdue tasks, and quality posture. |
| `POST /api/v1/governance-ops/ownership/bulk-assignment-plan` | Creates an auditable assignment plan and stewardship task for bulk role changes. |

## Stewardship Tasks

Generated tasks route to the best available accountable person:

1. Technical steward
2. Business owner
3. Domain manager
4. Custodian
5. `unassigned`

Tasks include SLA metadata:

- critical: 2 days
- high: 5 days
- medium/low: 14 days

The task list returns `sla.status`, `sla.daysRemaining`, and `sla.overdue` so the UI can highlight breached stewardship work.

## Bulk Assignment

Bulk assignment planning does not silently rewrite markdown. It returns:

- matched assets
- before/after role values
- an auditable task
- `markdownWriteRequired: true`

This keeps Sonic's source-of-truth model intact: stewards review the plan, then apply metadata through the markdown write path or catalog repo workflow.
