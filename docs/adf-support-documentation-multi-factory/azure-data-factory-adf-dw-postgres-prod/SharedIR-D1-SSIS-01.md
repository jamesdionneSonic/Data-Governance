# SharedIR-D1-SSIS-01

Generated: 2026-06-29T10:58:57.443Z
ADF factory: `adf-dw-postgres-prod`
Saved connector: `azure-data-factory-adf-dw-postgres-prod`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-dw-postgres-prod/2026-06-29T10-12-47-462Z-144774c9-f3bd-41e5-9a48-caa004b8682a.json`

## Plain-English Summary

SharedIR-D1-SSIS-01 is the only surfaced pipeline-like object in adf-dw-postgres-prod. The available profile shows no activities, child pipeline calls, source datasets, target datasets, schedules, linked services, or deterministic lineage edges, so this page is inventory/support context only.

## At a Glance

| Field                 | Value                                                                                                                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                                |
| Asset type            | Pipeline                                                                                                                                                                                           |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-dw-postgres-prod/integrationruntimes/SharedIR-D1-SSIS-01` |
| Support role          | inventory-only pipeline-like object                                                                                                                                                                |
| Business process      | adf-dw-postgres-prod pipeline execution                                                                                                                                                            |
| Primary source        | not surfaced in metadata                                                                                                                                                                           |
| Primary target/output | not surfaced in metadata                                                                                                                                                                           |
| Schedule or trigger   | not directly triggered                                                                                                                                                                             |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:12:47.461Z                                                                                                                                                      |
| Status signal         | inventory-only; no usable deterministic lineage edges                                                                                                                                              |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-dw-postgres-prod/2026-06-29T10-12-47-462Z-144774c9-f3bd-41e5-9a48-caa004b8682a.json`                                                   |

## Business Use

This object is retained so operators can see that adf-dw-postgres-prod was profiled. Its available metadata shows 0 activity steps, 0 child pipeline calls, 0 source dataset references, and 0 target dataset references.

## Support Checks

1. Treat this object as inventory-only unless a future metadata refresh surfaces deterministic ADF lineage edges.
2. If operations are requested, confirm the live Azure factory state before taking action.
3. Do not infer parameters, source datasets, target datasets, or stored procedures from the current profile.
4. Do not change triggers, schedules, retries, linked services, or credentials from documentation work.

## Lineage And Dependencies

| Dependency type   | Values                   |
| ----------------- | ------------------------ |
| Parent pipelines  | not surfaced in metadata |
| Child pipelines   | none surfaced            |
| Source datasets   | not surfaced in metadata |
| Target datasets   | not surfaced in metadata |
| Stored procedures | none surfaced            |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                 | Type | Inputs | Outputs |
| ------------------------ | ---- | ------ | ------- |
| not surfaced in metadata |      |        |         |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
- Closed as inventory-only because no usable deterministic lineage edges were surfaced.
