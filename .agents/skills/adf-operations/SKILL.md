---
name: adf-operations
description: Use when asked to inspect, queue, trigger, monitor, or summarize Sonic Azure Data Factory pipelines through the saved ADF connector. Applies to adf-dw-marketing-prod and any future saved ADF connector operations.
---

# ADF Operations Skill

## Purpose

Operate Azure Data Factory safely through saved connector context. This skill is
for operational actions such as listing pipelines, building a queue, starting one
pipeline, and checking run status.

## Required Reading

Before triggering or monitoring a pipeline, read:

1. `docs/adr/ADR-010-ADF-Operations-Through-Saved-Connector.md`
2. `docs/ADF_PIPELINE_OPERATIONS.md`

For repeated or multi-pipeline work, also read:

1. `docs/CODEX_ADF_OPERATION_PACKET.md`

## Default Connector

Use the saved connector:

- connector id: `azure-data-factory-adf-dw-marketing-prod`
- factory: `adf-dw-marketing-prod`
- subscription id: `bee9b611-da99-4cfc-9fb7-50f1359e5ca2`
- resource group: `rg-data-warehouse-prod`
- tenant id: `b7944855-1c04-4fee-8f07-749ae6f28735`
- credential mode: `azure_cli`

## Operating Rules

- Build a live ordered queue before selecting a pipeline.
- For `adf-dw-marketing-prod`, use `pl_Marketing_AWS_Export` as the current
  operational root. Do not start child pipelines directly unless the user
  supplies valid operational parameters and accepts that risk.
- Start one pipeline at a time.
- Capture `runId` immediately.
- Poll status at least once after start.
- Report the run id, status, timestamps, parameters, and next queue item.
- Stop on failure, cancellation, missing parameters, ambiguous pipeline names, or
  Azure context mismatch.
- Do not expose tokens, connection strings, linked-service secret details, or raw
  activity output.
- Do not continue to the next queue item unless the user explicitly asks.

## Medium-Safe Commands

List pipelines:

```powershell
az rest --method get --url "https://management.azure.com/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-dw-marketing-prod/pipelines?api-version=2018-06-01" --query "value[].name" --output table
```

Start one pipeline:

```powershell
az rest --method post --url "https://management.azure.com/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-dw-marketing-prod/pipelines/<PIPELINE_NAME>/createRun?api-version=2018-06-01" --body "{}" --output json
```

Check one run:

```powershell
az rest --method get --url "https://management.azure.com/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-dw-marketing-prod/pipelineruns/<RUN_ID>?api-version=2018-06-01" --output json
```

## Response Shape

Return:

- selected pipeline
- run id
- current status
- started timestamp
- parameter note
- next queue item

Keep it short unless the user asks for full run diagnostics.
