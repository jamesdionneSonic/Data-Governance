# Legacy ADF Factory Inventory

Generated: 2026-06-26

Scope:

- Subscription: `bee9b611-da99-4cfc-9fb7-50f1359e5ca2`
- Tenant: `b7944855-1c04-4fee-8f07-749ae6f28735`
- Credential mode: delegated `azure_cli`

These Azure Data Factory instances are intentionally documented as legacy ADFs.
The saved connectors exist so the framework can inspect metadata, document
pipelines, and support migration analysis. They should not be treated as new
target architecture.

## Legacy Factories

| Legacy factory        | Saved connector id                       | Resource group           | Pipelines visible | Triggers visible | Active triggers | Current read |
| --------------------- | ---------------------------------------- | ------------------------ | ----------------: | ---------------: | --------------: | ------------ |
| `adf-GoogleSearch-D1` | `azure-data-factory-adf-googlesearch-d1` | `rg-data-warehouse-prod` |                 7 |                2 |               0 | Readable     |
| `adf-XTime-D1`        | `azure-data-factory-adf-xtime-d1`        | `rg-data-warehouse-prod` |                 2 |                1 |               0 | Readable     |

## Operating Rules

- Use the saved connectors for read-only metadata discovery and documentation.
- Do not add new workloads to these factories without an architecture decision.
- Do not start or alter pipelines from Codex without an approved ADF operation
  packet and explicit user approval.
- Prefer documenting dependencies and migration risk over improving these
  factories in place.
- Ingest these factories only through the staged backlog in
  `docs/ADF_MULTI_FACTORY_INGESTION_BACKLOG.md`, and do not start that
  ingestion while another source ingestion is running.

## Recreate Local Saved Connectors

Run:

```powershell
node scripts/register-production-adf-connectors.mjs
```

The connector runtime store is under `data/` and is intentionally ignored by git,
so this script is the durable source for recreating the local saved connectors.
