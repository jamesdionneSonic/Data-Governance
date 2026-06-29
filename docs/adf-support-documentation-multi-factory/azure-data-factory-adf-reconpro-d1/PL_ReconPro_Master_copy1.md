# PL_ReconPro_Master_copy1

Generated: 2026-06-29T10:58:58.178Z
ADF factory: `adf-reconpro-d1`
Saved connector: `azure-data-factory-adf-reconpro-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-reconpro-d1/2026-06-29T10-36-22-878Z-99482e31-df3e-4e9d-a5f0-9226a03807f7.json`

## Plain-English Summary

PL_ReconPro_Master_copy1 is an ADF orchestrator in adf-reconpro-d1. If PL_ReconPro_Master_copy1 fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the latest PL_ReconPro_Master_copy1 parent run and identify the first failed child activity.

## At a Glance

| Field                 | Value                                                                                                                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                      |
| Asset type            | Pipeline                                                                                                                                                                                 |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-ReconPro-D1/pipelines/PL_ReconPro_Master_copy1` |
| Support role          | orchestrator                                                                                                                                                                             |
| Business process      | adf-reconpro-d1 pipeline execution                                                                                                                                                       |
| Primary source        | not surfaced in metadata                                                                                                                                                                 |
| Primary target/output | PL_ReconPro_Child_copy1                                                                                                                                                                  |
| Schedule or trigger   | not directly triggered                                                                                                                                                                   |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:36:22.840Z                                                                                                                                            |
| Status signal         | metadata available                                                                                                                                                                       |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-reconpro-d1/2026-06-29T10-36-22-878Z-99482e31-df3e-4e9d-a5f0-9226a03807f7.json`                                              |

## Business Use

This pipeline supports the adf-reconpro-d1 ADF process. Its available metadata shows 11 activity step(s), 1 child pipeline call(s), 0 source dataset reference(s), and 0 target dataset reference(s).

## Support Checks

1. Check the latest PL_ReconPro_Master_copy1 parent run and identify the first failed child activity.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: not surfaced in metadata.
3. Confirm source datasets are available: not surfaced in metadata.
4. Confirm target datasets or child pipelines completed: PL_ReconPro_Child_copy1.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                   |
| ----------------- | ------------------------ |
| Parent pipelines  | not surfaced in metadata |
| Child pipelines   | PL_ReconPro_Child_copy1  |
| Source datasets   | not surfaced in metadata |
| Target datasets   | not surfaced in metadata |
| Stored procedures | [dbo].[sp_send_dbmail]   |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                           | Type                     | Inputs                   | Outputs                  |
| ---------------------------------- | ------------------------ | ------------------------ | ------------------------ |
| ACT_LKP_CreateETLExecID            | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_SETVAR_MetaLoadDate            | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| ACT_SETVAR_ETLExecID               | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| ACT_SETVAR_MetaSourceSystemName    | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| ACT_SETVAR_MetaSrsSysID            | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| ACT_SETVAR_UserNameForLS           | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| ACT_EXECPL_ReconProIncrementalLoad | ExecutePipeline          | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_GetErrorFileLists          | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_SP_ReconProFailureMailAlert    | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_UpdateDimETLExecution      | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| If Condition1                      | IfCondition              | not surfaced in metadata | not surfaced in metadata |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
