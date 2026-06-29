# PL_FBAds_IncrementalLoad

Generated: 2026-06-29T10:58:57.879Z
ADF factory: `adf-facebookads-d1`
Saved connector: `azure-data-factory-adf-facebookads-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-facebookads-d1/2026-06-29T10-33-50-098Z-594847ac-c07a-4c43-9ce6-d0688eb80812.json`

## Plain-English Summary

PL_FBAds_IncrementalLoad is an ADF child pipeline in adf-facebookads-d1. If PL_FBAds_IncrementalLoad fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the parent pipeline that called PL_FBAds_IncrementalLoad; do not start the child with blank operational parameters.

## At a Glance

| Field                 | Value                                                                                                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                         |
| Asset type            | Pipeline                                                                                                                                                                                    |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-FacebookAds-D1/pipelines/PL_FBAds_IncrementalLoad` |
| Support role          | child pipeline                                                                                                                                                                              |
| Business process      | adf-facebookads-d1 pipeline execution                                                                                                                                                       |
| Primary source        | not surfaced in metadata                                                                                                                                                                    |
| Primary target/output | not surfaced in metadata                                                                                                                                                                    |
| Schedule or trigger   | not directly triggered                                                                                                                                                                      |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:33:50.083Z                                                                                                                                               |
| Status signal         | metadata available                                                                                                                                                                          |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-facebookads-d1/2026-06-29T10-33-50-098Z-594847ac-c07a-4c43-9ce6-d0688eb80812.json`                                              |

## Business Use

This pipeline supports the adf-facebookads-d1 ADF process. Its available metadata shows 15 activity step(s), 0 child pipeline call(s), 0 source dataset reference(s), and 0 target dataset reference(s).

## Support Checks

1. Check the parent pipeline that called PL_FBAds_IncrementalLoad; do not start the child with blank operational parameters.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: ParamETLExecutionID, ParamMetaLoadDate, ParamMetaSourceSystemName, ParamMetaSrcSysID, ParamMetaUserID, ParamUserName, ParamLoadType, ParamRelationshipTypeGuid, ParamEmailList.
3. Confirm source datasets are available: not surfaced in metadata.
4. Confirm target datasets or child pipelines completed: not surfaced in metadata.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                                                      |
| ----------------- | ----------------------------------------------------------- |
| Parent pipelines  | PL_FacebookAds_Master                                       |
| Child pipelines   | none surfaced                                               |
| Source datasets   | not surfaced in metadata                                    |
| Target datasets   | not surfaced in metadata                                    |
| Stored procedures | [dbo].[uspSearchOfOrphanAccountIDs], [dbo].[sp_send_dbmail] |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                                       | Type                     | Inputs                   | Outputs                  |
| ---------------------------------------------- | ------------------------ | ------------------------ | ------------------------ |
| ACT_LKP_GetFileListsPhase1                     | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_FE_CheckEmptyFiles                         | ForEach                  | not surfaced in metadata | not surfaced in metadata |
| ACT_IF_SendMailForEmptyFiles                   | IfCondition              | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_CheckLogsToProcessFiles                | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_GETMETA_GetFiles                           | GetMetadata              | not surfaced in metadata | not surfaced in metadata |
| ACT_FIL_FilterForFiles                         | Filter                   | not surfaced in metadata | not surfaced in metadata |
| ACT_FE_LogAvailableFiles                       | ForEach                  | not surfaced in metadata | not surfaced in metadata |
| ACT_SWT_Phase1Load                             | Switch                   | not surfaced in metadata | not surfaced in metadata |
| ACT_SWT_Phase2Load                             | Switch                   | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_IsNonMatchingAccounts                  | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_NewlyInsertedAccountIDs                | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_CheckStatus                            | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_SP_FBSuccessMailAlertPhase1                | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| ACT_SWT_SendMailForNewAndNonMatchingAccountIDs | Switch                   | not surfaced in metadata | not surfaced in metadata |
| ACT_IF_IsPipelineEnabled                       | IfCondition              | not surfaced in metadata | not surfaced in metadata |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
