# PL_GoogleAds_Conversion_Master_old

Generated: 2026-06-29T10:58:59.152Z
ADF factory: `adf-inbounddataetl-prod`
Saved connector: `azure-data-factory-adf-inbounddataetl-prod`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-inbounddataetl-prod/2026-06-29T10-46-28-895Z-0c8e98f2-1277-45d8-864a-42cd5d44bb03.json`

## Plain-English Summary

PL_GoogleAds_Conversion_Master_old is an ADF orchestrator in adf-inbounddataetl-prod. If PL_GoogleAds_Conversion_Master_old fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the latest PL_GoogleAds_Conversion_Master_old parent run and identify the first failed child activity.

## At a Glance

| Field                 | Value                                                                                                                                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                                             |
| Asset type            | Pipeline                                                                                                                                                                                                        |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/RG-InboundDataServices-Prod/providers/Microsoft.DataFactory/factories/ADF-InboundDataETL-Prod/pipelines/PL_GoogleAds_Conversion_Master_old` |
| Support role          | orchestrator                                                                                                                                                                                                    |
| Business process      | adf-inbounddataetl-prod pipeline execution                                                                                                                                                                      |
| Primary source        | not surfaced in metadata                                                                                                                                                                                        |
| Primary target/output | PL_GoogleAds_Conversion_IncrementalLoad_old                                                                                                                                                                     |
| Schedule or trigger   | not directly triggered                                                                                                                                                                                          |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:46:28.849Z                                                                                                                                                                   |
| Status signal         | metadata available                                                                                                                                                                                              |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-inbounddataetl-prod/2026-06-29T10-46-28-895Z-0c8e98f2-1277-45d8-864a-42cd5d44bb03.json`                                                             |

## Business Use

This pipeline supports the adf-inbounddataetl-prod ADF process. Its available metadata shows 11 activity step(s), 1 child pipeline call(s), 0 source dataset reference(s), and 0 target dataset reference(s).

## Support Checks

1. Check the latest PL_GoogleAds_Conversion_Master_old parent run and identify the first failed child activity.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: not surfaced in metadata.
3. Confirm source datasets are available: not surfaced in metadata.
4. Confirm target datasets or child pipelines completed: PL_GoogleAds_Conversion_IncrementalLoad_old.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                                      |
| ----------------- | ------------------------------------------- |
| Parent pipelines  | not surfaced in metadata                    |
| Child pipelines   | PL_GoogleAds_Conversion_IncrementalLoad_old |
| Source datasets   | not surfaced in metadata                    |
| Target datasets   | not surfaced in metadata                    |
| Stored procedures | [dbo].[sp_send_dbmail]                      |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                         | Type                     | Inputs                   | Outputs                  |
| -------------------------------- | ------------------------ | ------------------------ | ------------------------ |
| Create ETLExecID                 | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| Get Email List                   | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| Set MetaLoadDate                 | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| Set MetaSourceSystemName         | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| Set MetaSrcSysID                 | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| Set ETLExecID                    | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| ExecuteGoogleAds_IncrementalLoad | ExecutePipeline          | not surfaced in metadata | not surfaced in metadata |
| Check if Pipeline Disabled       | IfCondition              | not surfaced in metadata | not surfaced in metadata |
| Get Error File Lists             | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| Failure Mail Alert               | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| Update Dim ETL executionID       | Lookup                   | not surfaced in metadata | not surfaced in metadata |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
