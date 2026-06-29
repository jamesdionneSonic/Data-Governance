# pl_MktBudget_EstimatedSpend

Generated: 2026-06-29T10:58:59.157Z
ADF factory: `adf-inbounddataetl-prod`
Saved connector: `azure-data-factory-adf-inbounddataetl-prod`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-inbounddataetl-prod/2026-06-29T10-46-28-895Z-0c8e98f2-1277-45d8-864a-42cd5d44bb03.json`

## Plain-English Summary

pl_MktBudget_EstimatedSpend is an ADF data movement in adf-inbounddataetl-prod. If pl_MktBudget_EstimatedSpend fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the latest ADF run for pl_MktBudget_EstimatedSpend and confirm source and target datasets are available.

## At a Glance

| Field                 | Value                                                                                                                                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                                      |
| Asset type            | Pipeline                                                                                                                                                                                                 |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/RG-InboundDataServices-Prod/providers/Microsoft.DataFactory/factories/ADF-InboundDataETL-Prod/pipelines/pl_MktBudget_EstimatedSpend` |
| Support role          | data movement                                                                                                                                                                                            |
| Business process      | adf-inbounddataetl-prod pipeline execution                                                                                                                                                               |
| Primary source        | mktblb                                                                                                                                                                                                   |
| Primary target/output | dfMktBudget_EstimatedSpend_landing                                                                                                                                                                       |
| Schedule or trigger   | LoadEstimatedSpend_MktBudget                                                                                                                                                                             |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:46:28.849Z                                                                                                                                                            |
| Status signal         | triggered pipeline                                                                                                                                                                                       |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-inbounddataetl-prod/2026-06-29T10-46-28-895Z-0c8e98f2-1277-45d8-864a-42cd5d44bb03.json`                                                      |

## Business Use

This pipeline supports the adf-inbounddataetl-prod ADF process. Its available metadata shows 4 activity step(s), 0 child pipeline call(s), 1 source dataset reference(s), and 1 target dataset reference(s).

## Support Checks

1. Check the latest ADF run for pl_MktBudget_EstimatedSpend and confirm source and target datasets are available.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: not surfaced in metadata.
3. Confirm source datasets are available: mktblb.
4. Confirm target datasets or child pipelines completed: dfMktBudget_EstimatedSpend_landing.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                             |
| ----------------- | ---------------------------------- |
| Parent pipelines  | not surfaced in metadata           |
| Child pipelines   | none surfaced                      |
| Source datasets   | mktblb                             |
| Target datasets   | dfMktBudget_EstimatedSpend_landing |
| Stored procedures | [dbo].[usp_MktBudget_stg]          |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                              | Type                     | Inputs                   | Outputs                            |
| ------------------------------------- | ------------------------ | ------------------------ | ---------------------------------- |
| dfImportGS2Blob                       | ExecuteDataFlow          | not surfaced in metadata | not surfaced in metadata           |
| cdblb2estimatedspend                  | Copy                     | mktblb                   | dfMktBudget_EstimatedSpend_landing |
| truncate table EstimatedSpend_landing | Script                   | not surfaced in metadata | not surfaced in metadata           |
| Run usp_MktBudget_stg                 | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata           |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
