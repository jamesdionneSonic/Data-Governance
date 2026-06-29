# PL_FBAds_OfflineMetrices_Master

Generated: 2026-06-29T10:58:57.891Z
ADF factory: `adf-facebookads-d1`
Saved connector: `azure-data-factory-adf-facebookads-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-facebookads-d1/2026-06-29T10-33-50-098Z-594847ac-c07a-4c43-9ce6-d0688eb80812.json`

## Plain-English Summary

PL_FBAds_OfflineMetrices_Master is an ADF orchestrator in adf-facebookads-d1. If PL_FBAds_OfflineMetrices_Master fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the latest PL_FBAds_OfflineMetrices_Master parent run and identify the first failed child activity.

## At a Glance

| Field                 | Value                                                                                                                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                                |
| Asset type            | Pipeline                                                                                                                                                                                           |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-FacebookAds-D1/pipelines/PL_FBAds_OfflineMetrices_Master` |
| Support role          | orchestrator                                                                                                                                                                                       |
| Business process      | adf-facebookads-d1 pipeline execution                                                                                                                                                              |
| Primary source        | not surfaced in metadata                                                                                                                                                                           |
| Primary target/output | PL_FBAds_OfflineMetrices_IncrementalLoad                                                                                                                                                           |
| Schedule or trigger   | FacebookAdsOfflineMetrices                                                                                                                                                                         |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:33:50.083Z                                                                                                                                                      |
| Status signal         | triggered pipeline                                                                                                                                                                                 |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-facebookads-d1/2026-06-29T10-33-50-098Z-594847ac-c07a-4c43-9ce6-d0688eb80812.json`                                                     |

## Business Use

This pipeline supports the adf-facebookads-d1 ADF process. Its available metadata shows 14 activity step(s), 1 child pipeline call(s), 0 source dataset reference(s), and 0 target dataset reference(s).

## Support Checks

1. Check the latest PL_FBAds_OfflineMetrices_Master parent run and identify the first failed child activity.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: ParamLoadType.
3. Confirm source datasets are available: not surfaced in metadata.
4. Confirm target datasets or child pipelines completed: PL_FBAds_OfflineMetrices_IncrementalLoad.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                                   |
| ----------------- | ---------------------------------------- |
| Parent pipelines  | not surfaced in metadata                 |
| Child pipelines   | PL_FBAds_OfflineMetrices_IncrementalLoad |
| Source datasets   | not surfaced in metadata                 |
| Target datasets   | not surfaced in metadata                 |
| Stored procedures | [dbo].[sp_send_dbmail]                   |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                           | Type                     | Inputs                   | Outputs                  |
| ---------------------------------- | ------------------------ | ------------------------ | ------------------------ |
| ACT_LKP_CreateETLExecID            | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_SETVAR_SetETLExecID            | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| ACT_SETVAR_SetMetaLoadDate         | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| ACT_SETVAR_SetMetaSourceSystemName | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| ACT_SETVAR_SetMetaSrcSysID         | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| ACT_SETVAR_SetRelationshipTypeGuid | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_CreateRelationshipTypeGuid | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_SETVAR_SetUserNameForLS        | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| ACT_EXECPL_ExecuteFBAdsLoad        | ExecutePipeline          | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_GetErrorFileListsPhase1    | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_UpdateDimETLExecution      | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_SP_FBFailureMailAlert          | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| ACT_IF_PLDisabled                  | IfCondition              | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_GetEmailList               | Lookup                   | not surfaced in metadata | not surfaced in metadata |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
