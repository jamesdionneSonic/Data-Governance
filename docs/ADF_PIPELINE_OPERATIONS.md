# Azure Data Factory Pipeline Operations

## Purpose

This guide makes ADF pipeline operations safe enough for a balanced Codex model
at normal speed with medium thinking. It applies when an operator asks Codex to
discover, queue, trigger, monitor, or summarize Azure Data Factory pipelines.

## Source Of Truth

Use the saved connector first:

- connector id: `azure-data-factory-adf-dw-marketing-prod`
- type: `azure_data_factory`
- factory: `adf-dw-marketing-prod`
- resource group: `rg-data-warehouse-prod`
- subscription id: `bee9b611-da99-4cfc-9fb7-50f1359e5ca2`
- tenant id: `b7944855-1c04-4fee-8f07-749ae6f28735`
- credential mode: `azure_cli`

Additional readable production ADF factories in the same subscription are
registered as individual saved connectors by
`scripts/register-production-adf-connectors.mjs`. See
`docs/ADF_PRODUCTION_FACTORY_ACCESS_INVENTORY.md` for the current connector ids,
resource groups, pipeline visibility, trigger visibility, and active-trigger
inventory.

ADF multi-factory metadata ingestion, support documentation, DevOps runtime
publication, and Confluence publication were completed under
`docs/ADF_MULTI_FACTORY_INGESTION_BACKLOG.md`. The
`azure-data-factory-adf-dw-postgres-prod` connector is closed as inventory-only
because it surfaced no usable deterministic lineage edges.

ADF metadata and lineage must stay in the shared connector runtime. Direct Azure
Management API calls are allowed only for operational actions that the connector
service does not yet expose, such as `createRun` and immediate run-status
checks.

## Medium-Safe Workflow

1. Read `docs/adr/ADR-010-ADF-Operations-Through-Saved-Connector.md`.
2. Confirm which factory and saved connector are in scope.
3. List live pipeline names from the factory.
4. Create an ordered queue.
5. Select one pipeline explicitly.
6. Start only that pipeline.
7. Capture the `runId`.
8. Poll the run status at least once.
9. Report the queue, selected pipeline, run id, start time, current status, and
   any parameters used.
10. Stop before continuing to the next pipeline unless the user explicitly asks
    to continue.

## Stop Conditions

Stop and ask the user before taking action when:

- the requested process does not clearly map to a live pipeline name;
- more than one pipeline could match;
- parameters are required and not supplied;
- the user asks to run all pipelines in parallel;
- a prior run is still active and the user has not said to start another;
- a run fails, is cancelled, or returns an error;
- permissions, tenant, subscription, or factory identity do not match the saved
  connector;
- the action would change code, secrets, permissions, retries, schedules, or
  production trigger behavior.

## Commands

List pipelines:

```powershell
az rest --method get --url "https://management.azure.com/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-dw-marketing-prod/pipelines?api-version=2018-06-01" --query "value[].name" --output table
```

Start one pipeline:

```powershell
az rest --method post --url "https://management.azure.com/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-dw-marketing-prod/pipelines/<PIPELINE_NAME>/createRun?api-version=2018-06-01" --body "{}" --output json
```

Check a pipeline run:

```powershell
az rest --method get --url "https://management.azure.com/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-dw-marketing-prod/pipelineruns/<RUN_ID>?api-version=2018-06-01" --output json
```

## Current Operational Queue

The operational queue starts at parent/orchestrator pipelines, not child
pipelines. Child pipelines receive required operational IDs from the parent and
should not be started manually with blank parameters.

1. `pl_Marketing_AWS_Export`
2. `pl_Marketing_AWS_Export_history` only when the user explicitly requests the history process

## Current Run Log

| Pipeline                | Run id                                 | Started              | First status |
| ----------------------- | -------------------------------------- | -------------------- | ------------ |
| `pl_eLead_Org_Mappings` | `25a7eb13-deff-4018-bdc5-ddd70d980f2b` | 2026-06-18T18:20:03Z | `InProgress` |

That child run later failed because it was started with blank operational
parameters. Use `docs/ADF_MARKETING_AWS_EXPORT_METADATA.md` for the corrected
metadata root and parent/child execution model.

## Reporting Format

Use this concise shape after each trigger:

```text
Started: <pipeline>
Run id: <run id>
Status: <status>
Started at: <timestamp>
Parameters: <none/defaulted/list>
Next queue item: <pipeline or none>
```

Do not include tokens, connection strings, linked-service secret details, or raw
activity output.
