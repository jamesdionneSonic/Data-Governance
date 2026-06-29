# PL_PriceFx_VDP_Master

Generated: 2026-06-29T10:58:59.604Z
ADF factory: `adf-pricefx-d1`
Saved connector: `azure-data-factory-adf-pricefx-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-pricefx-d1/2026-06-29T10-49-10-481Z-ea190808-2542-4272-b648-bcc818870f5e.json`

## Plain-English Summary

PL_PriceFx_VDP_Master is an ADF orchestrator in adf-pricefx-d1. If PL_PriceFx_VDP_Master fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the latest PL_PriceFx_VDP_Master parent run and identify the first failed child activity.

## At a Glance

| Field                 | Value                                                                                                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Platform              | ADF                                                                                                                                                                                  |
| Asset type            | Pipeline                                                                                                                                                                             |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-PriceFx-D1/pipelines/PL_PriceFx_VDP_Master` |
| Support role          | orchestrator                                                                                                                                                                         |
| Business process      | adf-pricefx-d1 pipeline execution                                                                                                                                                    |
| Primary source        | not surfaced in metadata                                                                                                                                                             |
| Primary target/output | PL_VDP_Getdata, PL_VDP_Senddata                                                                                                                                                      |
| Schedule or trigger   | Tr_VDP_Daily                                                                                                                                                                         |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:49:10.426Z                                                                                                                                        |
| Status signal         | triggered pipeline                                                                                                                                                                   |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-pricefx-d1/2026-06-29T10-49-10-481Z-ea190808-2542-4272-b648-bcc818870f5e.json`                                           |

## Business Use

This pipeline supports the adf-pricefx-d1 ADF process. Its available metadata shows 11 activity step(s), 2 child pipeline call(s), 0 source dataset reference(s), and 0 target dataset reference(s).

## Support Checks

1. Check the latest PL_PriceFx_VDP_Master parent run and identify the first failed child activity.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: not surfaced in metadata.
3. Confirm source datasets are available: not surfaced in metadata.
4. Confirm target datasets or child pipelines completed: PL_VDP_Getdata, PL_VDP_Senddata.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                                                                                                                                                                            |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Parent pipelines  | not surfaced in metadata                                                                                                                                                          |
| Child pipelines   | PL_VDP_Getdata, PL_VDP_Senddata                                                                                                                                                   |
| Source datasets   | not surfaced in metadata                                                                                                                                                          |
| Target datasets   | not surfaced in metadata                                                                                                                                                          |
| Stored procedures | [dbo].[usp_ADFInsertMasterProcessExecutionLog], [dbo].[usp_UpdateProcessExecutionLogStatus], [dbo].[usp_UpdateMasterProcessExecutionLog], [dbo].[usp_CloseOutProcessExecutionLog] |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                          | Type                     | Inputs                   | Outputs                  |
| --------------------------------- | ------------------------ | ------------------------ | ------------------------ |
| Get Master Process Parameters     | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| Set OpProcessExecutionID variable | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| Set OpBatchID variable            | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| Set OpProcessExecutionStatusID    | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| Execute VDP_Getdata               | ExecutePipeline          | not surfaced in metadata | not surfaced in metadata |
| Execute VDP_Senddata              | ExecutePipeline          | not surfaced in metadata | not surfaced in metadata |
| Set VDP Getdata Failure           | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| Set VDP Senddata Failure          | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| Set Master Pipeline Metrics       | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| Close out master pipeline process | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| ACT_SETVAR_SetUserNameForLS       | SetVariable              | not surfaced in metadata | not surfaced in metadata |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
