# GoogleSearchConsole_Master

Generated: 2026-06-29T10:58:57.495Z
ADF factory: `adf-googlesearch-d1`
Saved connector: `azure-data-factory-adf-googlesearch-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-googlesearch-d1/2026-06-29T10-13-07-708Z-7a609b5f-65c7-491c-bb59-b36c758eb21b.json`

## Plain-English Summary

GoogleSearchConsole_Master is an ADF orchestrator in adf-googlesearch-d1. If GoogleSearchConsole_Master fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the latest GoogleSearchConsole_Master parent run and identify the first failed child activity.

## At a Glance

| Field                 | Value                                                                                                                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                            |
| Asset type            | Pipeline                                                                                                                                                                                       |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-GoogleSearch-D1/pipelines/GoogleSearchConsole_Master` |
| Support role          | orchestrator                                                                                                                                                                                   |
| Business process      | adf-googlesearch-d1 pipeline execution                                                                                                                                                         |
| Primary source        | not surfaced in metadata                                                                                                                                                                       |
| Primary target/output | GSC_Incremental_Load                                                                                                                                                                           |
| Schedule or trigger   | Trigger_Adhoc, Google_Search_Console_Daily                                                                                                                                                     |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:13:07.704Z                                                                                                                                                  |
| Status signal         | triggered pipeline                                                                                                                                                                             |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-googlesearch-d1/2026-06-29T10-13-07-708Z-7a609b5f-65c7-491c-bb59-b36c758eb21b.json`                                                |

## Business Use

This pipeline supports the adf-googlesearch-d1 ADF process. Its available metadata shows 9 activity step(s), 1 child pipeline call(s), 0 source dataset reference(s), and 0 target dataset reference(s).

## Support Checks

1. Check the latest GoogleSearchConsole_Master parent run and identify the first failed child activity.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: LoadType.
3. Confirm source datasets are available: not surfaced in metadata.
4. Confirm target datasets or child pipelines completed: GSC_Incremental_Load.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                   |
| ----------------- | ------------------------ |
| Parent pipelines  | not surfaced in metadata |
| Child pipelines   | GSC_Incremental_Load     |
| Source datasets   | not surfaced in metadata |
| Target datasets   | not surfaced in metadata |
| Stored procedures | [dbo].[sp_send_dbmail]   |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                              | Type                     | Inputs                   | Outputs                  |
| ------------------------------------- | ------------------------ | ------------------------ | ------------------------ |
| ACT_LKP_InitMetaColumns               | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_SetUserNameForLS              | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_CreateRelationshipTypeGuid    | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_EXECPL_GSC_Incremental_Load       | ExecutePipeline          | not surfaced in metadata | not surfaced in metadata |
| ACT_IF_PLDisabled                     | IfCondition              | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_GetErrorFileLists             | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_SP_GSCFailureMailAlert            | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_UpdateDim_ETLExecution        | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_GetSuccessAndFailureEmailList | Lookup                   | not surfaced in metadata | not surfaced in metadata |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
