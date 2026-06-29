# GSC_Load_Phase2DimensionTables

Generated: 2026-06-29T10:58:57.499Z
ADF factory: `adf-googlesearch-d1`
Saved connector: `azure-data-factory-adf-googlesearch-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-googlesearch-d1/2026-06-29T10-13-07-708Z-7a609b5f-65c7-491c-bb59-b36c758eb21b.json`

## Plain-English Summary

GSC_Load_Phase2DimensionTables is an ADF child pipeline in adf-googlesearch-d1. If GSC_Load_Phase2DimensionTables fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the parent pipeline that called GSC_Load_Phase2DimensionTables; do not start the child with blank operational parameters.

## At a Glance

| Field                 | Value                                                                                                                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                                |
| Asset type            | Pipeline                                                                                                                                                                                           |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-GoogleSearch-D1/pipelines/GSC_Load_Phase2DimensionTables` |
| Support role          | child pipeline                                                                                                                                                                                     |
| Business process      | adf-googlesearch-d1 pipeline execution                                                                                                                                                             |
| Primary source        | not surfaced in metadata                                                                                                                                                                           |
| Primary target/output | not surfaced in metadata                                                                                                                                                                           |
| Schedule or trigger   | not directly triggered                                                                                                                                                                             |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:13:07.704Z                                                                                                                                                      |
| Status signal         | metadata available                                                                                                                                                                                 |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-googlesearch-d1/2026-06-29T10-13-07-708Z-7a609b5f-65c7-491c-bb59-b36c758eb21b.json`                                                    |

## Business Use

This pipeline supports the adf-googlesearch-d1 ADF process. Its available metadata shows 2 activity step(s), 0 child pipeline call(s), 0 source dataset reference(s), and 0 target dataset reference(s).

## Support Checks

1. Check the parent pipeline that called GSC_Load_Phase2DimensionTables; do not start the child with blank operational parameters.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: ETLExecutionID, MetaLoadDate, MetaSourceSystemName, MetaSrcSysID, MetaUserId, MetaComputerName, RelationshipTypeGuid, UserName.
3. Confirm source datasets are available: not surfaced in metadata.
4. Confirm target datasets or child pipelines completed: not surfaced in metadata.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                                  |
| ----------------- | --------------------------------------- |
| Parent pipelines  | GSC_Incremental_Load                    |
| Child pipelines   | none surfaced                           |
| Source datasets   | not surfaced in metadata                |
| Target datasets   | not surfaced in metadata                |
| Stored procedures | [dbo].[uspLoadGSCDimEntityRelationship] |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                   | Type                     | Inputs                   | Outputs                  |
| -------------------------- | ------------------------ | ------------------------ | ------------------------ |
| ForEach Iterate Dim Tables | ForEach                  | not surfaced in metadata | not surfaced in metadata |
| LoadDimEntityRelationship  | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
