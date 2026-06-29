# GSC_Incremental_Load

Generated: 2026-06-29T10:58:57.497Z
ADF factory: `adf-googlesearch-d1`
Saved connector: `azure-data-factory-adf-googlesearch-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-googlesearch-d1/2026-06-29T10-13-07-708Z-7a609b5f-65c7-491c-bb59-b36c758eb21b.json`

## Plain-English Summary

GSC_Incremental_Load is an ADF orchestrator in adf-googlesearch-d1. If GSC_Incremental_Load fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the latest GSC_Incremental_Load parent run and identify the first failed child activity.

## At a Glance

| Field                 | Value                                                                                                                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                      |
| Asset type            | Pipeline                                                                                                                                                                                 |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-GoogleSearch-D1/pipelines/GSC_Incremental_Load` |
| Support role          | orchestrator                                                                                                                                                                             |
| Business process      | adf-googlesearch-d1 pipeline execution                                                                                                                                                   |
| Primary source        | not surfaced in metadata                                                                                                                                                                 |
| Primary target/output | GSC_Load_Phase1DailyFiles, GSC_Load_Phase2StagingTables, GSC_Load_Phase2DimensionTables, GSC_Load_Phase2FactTables                                                                       |
| Schedule or trigger   | not directly triggered                                                                                                                                                                   |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:13:07.704Z                                                                                                                                            |
| Status signal         | metadata available                                                                                                                                                                       |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-googlesearch-d1/2026-06-29T10-13-07-708Z-7a609b5f-65c7-491c-bb59-b36c758eb21b.json`                                          |

## Business Use

This pipeline supports the adf-googlesearch-d1 ADF process. Its available metadata shows 22 activity step(s), 4 child pipeline call(s), 0 source dataset reference(s), and 0 target dataset reference(s).

## Support Checks

1. Check the latest GSC_Incremental_Load parent run and identify the first failed child activity.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: ETLExecutionID, MetaLoadDate, MetaSourceSystemName, MetaSrcSysID, MetaUserID, UserName, LoadType, RelationshipTypeGuid, SuccessEmailList.
3. Confirm source datasets are available: not surfaced in metadata.
4. Confirm target datasets or child pipelines completed: GSC_Load_Phase1DailyFiles, GSC_Load_Phase2StagingTables, GSC_Load_Phase2DimensionTables, GSC_Load_Phase2FactTables.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| Parent pipelines  | GoogleSearchConsole_Master                                                                                         |
| Child pipelines   | GSC_Load_Phase1DailyFiles, GSC_Load_Phase2StagingTables, GSC_Load_Phase2DimensionTables, GSC_Load_Phase2FactTables |
| Source datasets   | not surfaced in metadata                                                                                           |
| Target datasets   | not surfaced in metadata                                                                                           |
| Stored procedures | [dbo].[sp_send_dbmail], [dbo].[uspGSCSearchOfOrphanWebsites]                                                       |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                                    | Type                     | Inputs                   | Outputs                  |
| ------------------------------------------- | ------------------------ | ------------------------ | ------------------------ |
| ACT_LKP_CheckStatus                         | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_IF_IsPipelineEnabled                    | IfCondition              | not surfaced in metadata | not surfaced in metadata |
| ACT_GETMETA_GetDailyFiles                   | GetMetadata              | not surfaced in metadata | not surfaced in metadata |
| ACT_FIL_FilterDailyFiles                    | Filter                   | not surfaced in metadata | not surfaced in metadata |
| ACT_FE_LogAvailableFiles                    | ForEach                  | not surfaced in metadata | not surfaced in metadata |
| ACT_IF_SendMailForEmptyFiles                | IfCondition              | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_GetFileListsPhase1                  | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_SP_GSCSuccessMailAlertPhase1            | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| ACT_IF_CheckIfNoFilesPresent                | IfCondition              | not surfaced in metadata | not surfaced in metadata |
| ACT_FIL_CheckIfNoFilesPresent               | Filter                   | not surfaced in metadata | not surfaced in metadata |
| ACT_EXECPL_LoadGSCPhase1Daily               | ExecutePipeline          | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_NewlyInsertedSites                  | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_SWH_SendMailForNewAndNon-MatchingStores | Switch                   | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_isNonMatchingSites                  | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_GetStartTimePhase2                  | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_GetPhase2RowsHTML                   | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_EXECPL_LoadGSCStagingData               | ExecutePipeline          | not surfaced in metadata | not surfaced in metadata |
| ACT_EXECPL_LoadDimensionData                | ExecutePipeline          | not surfaced in metadata | not surfaced in metadata |
| ACT_EXECPL_LoadFactData                     | ExecutePipeline          | not surfaced in metadata | not surfaced in metadata |
| ACT_GetsFilesExistance                      | GetMetadata              | not surfaced in metadata | not surfaced in metadata |
| ACT_IF_IsFilesMerge                         | IfCondition              | not surfaced in metadata | not surfaced in metadata |
| If Condition2                               | IfCondition              | not surfaced in metadata | not surfaced in metadata |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
