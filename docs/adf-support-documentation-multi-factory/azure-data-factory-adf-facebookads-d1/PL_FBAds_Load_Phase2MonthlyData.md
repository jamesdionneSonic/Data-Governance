# PL_FBAds_Load_Phase2MonthlyData

Generated: 2026-06-29T10:58:57.883Z
ADF factory: `adf-facebookads-d1`
Saved connector: `azure-data-factory-adf-facebookads-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-facebookads-d1/2026-06-29T10-33-50-098Z-594847ac-c07a-4c43-9ce6-d0688eb80812.json`

## Plain-English Summary

PL_FBAds_Load_Phase2MonthlyData is an ADF data movement in adf-facebookads-d1. If PL_FBAds_Load_Phase2MonthlyData fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the latest ADF run for PL_FBAds_Load_Phase2MonthlyData and confirm source and target datasets are available.

## At a Glance

| Field                 | Value                                                                                                                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                                |
| Asset type            | Pipeline                                                                                                                                                                                           |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-FacebookAds-D1/pipelines/PL_FBAds_Load_Phase2MonthlyData` |
| Support role          | data movement                                                                                                                                                                                      |
| Business process      | adf-facebookads-d1 pipeline execution                                                                                                                                                              |
| Primary source        | DS_SQL_FBAds_VendorData                                                                                                                                                                            |
| Primary target/output | DS_SQL_FBAds_ETLStaging                                                                                                                                                                            |
| Schedule or trigger   | not directly triggered                                                                                                                                                                             |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:33:50.083Z                                                                                                                                                      |
| Status signal         | metadata available                                                                                                                                                                                 |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-facebookads-d1/2026-06-29T10-33-50-098Z-594847ac-c07a-4c43-9ce6-d0688eb80812.json`                                                     |

## Business Use

This pipeline supports the adf-facebookads-d1 ADF process. Its available metadata shows 8 activity step(s), 0 child pipeline call(s), 1 source dataset reference(s), and 1 target dataset reference(s).

## Support Checks

1. Check the latest ADF run for PL_FBAds_Load_Phase2MonthlyData and confirm source and target datasets are available.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: ParamETLExecID, ParamMetaLoadDate, ParamMetaSourceSystemName, ParamMetaSrcSysID, ParamMetaUserId, ParamLoadType, ParamMetaComputerName, ParamRelationshipTypeGuid, ParamUserName.
3. Confirm source datasets are available: DS_SQL_FBAds_VendorData.
4. Confirm target datasets or child pipelines completed: DS_SQL_FBAds_ETLStaging.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                                                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Parent pipelines  | not surfaced in metadata                                                                                                                    |
| Child pipelines   | none surfaced                                                                                                                               |
| Source datasets   | DS_SQL_FBAds_VendorData                                                                                                                     |
| Target datasets   | DS_SQL_FBAds_ETLStaging                                                                                                                     |
| Stored procedures | [dbo].[uspLoadDimEntityRelationship], [dbo].[uspLoadDimFBCampaign], [dbo].[uspFactFBCampaignMonthly], [dbo].[usp_insert_audit_load_details] |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                         | Type                     | Inputs                   | Outputs                  |
| -------------------------------- | ------------------------ | ------------------------ | ------------------------ |
| ACT_COPY_SourceToStagingMonthly  | Copy                     | DS_SQL_FBAds_VendorData  | DS_SQL_FBAds_ETLStaging  |
| ACT_SP_LoadDimEntityRelationship | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| ACT_SP_LoadDimFBCampaign         | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| ACT_SP_LoadFactFBCampaignMonthly | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| ACT_SP_InsertAuditDetailsMonthly | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_MaxMetaLoaddateMonthly   | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_UpdatePLDSMonthly        | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_GetMaxFileDate           | Lookup                   | not surfaced in metadata | not surfaced in metadata |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
