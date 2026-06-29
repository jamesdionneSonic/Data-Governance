# PL_Copy_DimEntity_Child

Generated: 2026-06-29T10:58:58.490Z
ADF factory: `adf-ganalytics-d1`
Saved connector: `azure-data-factory-adf-ganalytics-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-ganalytics-d1/2026-06-29T10-42-03-682Z-594902fe-3591-404d-b693-88159eebfa46.json`

## Plain-English Summary

PL_Copy_DimEntity_Child is an ADF child pipeline in adf-ganalytics-d1. If PL_Copy_DimEntity_Child fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the parent pipeline that called PL_Copy_DimEntity_Child; do not start the child with blank operational parameters.

## At a Glance

| Field                 | Value                                                                                                                                                                                     |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                       |
| Asset type            | Pipeline                                                                                                                                                                                  |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-GAnalytics-D1/pipelines/PL_Copy_DimEntity_Child` |
| Support role          | child pipeline                                                                                                                                                                            |
| Business process      | adf-ganalytics-d1 pipeline execution                                                                                                                                                      |
| Primary source        | not surfaced in metadata                                                                                                                                                                  |
| Primary target/output | not surfaced in metadata                                                                                                                                                                  |
| Schedule or trigger   | not directly triggered                                                                                                                                                                    |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:42:03.665Z                                                                                                                                             |
| Status signal         | metadata available                                                                                                                                                                        |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-ganalytics-d1/2026-06-29T10-42-03-682Z-594902fe-3591-404d-b693-88159eebfa46.json`                                             |

## Business Use

This pipeline supports the adf-ganalytics-d1 ADF process. Its available metadata shows 1 activity step(s), 0 child pipeline call(s), 0 source dataset reference(s), and 0 target dataset reference(s).

## Support Checks

1. Check the parent pipeline that called PL_Copy_DimEntity_Child; do not start the child with blank operational parameters.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: UserName, MetaLoadDate.
3. Confirm source datasets are available: not surfaced in metadata.
4. Confirm target datasets or child pipelines completed: not surfaced in metadata.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                   |
| ----------------- | ------------------------ |
| Parent pipelines  | PL_Copy_DimEntity_Master |
| Child pipelines   | none surfaced            |
| Source datasets   | not surfaced in metadata |
| Target datasets   | not surfaced in metadata |
| Stored procedures | none surfaced            |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                | Type    | Inputs                   | Outputs                  |
| ----------------------- | ------- | ------------------------ | ------------------------ |
| ACT_CopyDimEntityTables | ForEach | not surfaced in metadata | not surfaced in metadata |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
