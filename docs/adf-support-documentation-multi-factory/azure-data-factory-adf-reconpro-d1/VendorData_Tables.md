# VendorData_Tables

Generated: 2026-06-29T10:58:58.192Z
ADF factory: `adf-reconpro-d1`
Saved connector: `azure-data-factory-adf-reconpro-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-reconpro-d1/2026-06-29T10-36-22-878Z-99482e31-df3e-4e9d-a5f0-9226a03807f7.json`

## Plain-English Summary

VendorData_Tables is an ADF data movement in adf-reconpro-d1. If VendorData_Tables fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the latest ADF run for VendorData_Tables and confirm source and target datasets are available.

## At a Glance

| Field                 | Value                                                                                                                                                                             |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                               |
| Asset type            | Pipeline                                                                                                                                                                          |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-ReconPro-D1/pipelines/VendorData_Tables` |
| Support role          | data movement                                                                                                                                                                     |
| Business process      | adf-reconpro-d1 pipeline execution                                                                                                                                                |
| Primary source        | DS_SQL_SourceStageVendordata                                                                                                                                                      |
| Primary target/output | DS_SQL_StageVendordata                                                                                                                                                            |
| Schedule or trigger   | not directly triggered                                                                                                                                                            |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:36:22.840Z                                                                                                                                     |
| Status signal         | metadata available                                                                                                                                                                |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-reconpro-d1/2026-06-29T10-36-22-878Z-99482e31-df3e-4e9d-a5f0-9226a03807f7.json`                                       |

## Business Use

This pipeline supports the adf-reconpro-d1 ADF process. Its available metadata shows 11 activity step(s), 0 child pipeline call(s), 1 source dataset reference(s), and 1 target dataset reference(s).

## Support Checks

1. Check the latest ADF run for VendorData_Tables and confirm source and target datasets are available.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: not surfaced in metadata.
3. Confirm source datasets are available: DS_SQL_SourceStageVendordata.
4. Confirm target datasets or child pipelines completed: DS_SQL_StageVendordata.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                       |
| ----------------- | ---------------------------- |
| Parent pipelines  | not surfaced in metadata     |
| Child pipelines   | none surfaced                |
| Source datasets   | DS_SQL_SourceStageVendordata |
| Target datasets   | DS_SQL_StageVendordata       |
| Stored procedures | none surfaced                |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity              | Type | Inputs                       | Outputs                |
| --------------------- | ---- | ---------------------------- | ---------------------- |
| OrderPhases           | Copy | DS_SQL_SourceStageVendordata | DS_SQL_StageVendordata |
| OrderVehicles         | Copy | DS_SQL_SourceStageVendordata | DS_SQL_StageVendordata |
| OrderLogs             | Copy | DS_SQL_SourceStageVendordata | DS_SQL_StageVendordata |
| TechnicianDetails     | Copy | DS_SQL_SourceStageVendordata | DS_SQL_StageVendordata |
| Inspectionvehicles    | Copy | DS_SQL_SourceStageVendordata | DS_SQL_StageVendordata |
| ServiceOrderQuestions | Copy | DS_SQL_SourceStageVendordata | DS_SQL_StageVendordata |
| ServiceReqServices    | Copy | DS_SQL_SourceStageVendordata | DS_SQL_StageVendordata |
| LocationWorkingHours  | Copy | DS_SQL_SourceStageVendordata | DS_SQL_StageVendordata |
| WIP_Report            | Copy | DS_SQL_SourceStageVendordata | DS_SQL_StageVendordata |
| PhaseAggregators      | Copy | DS_SQL_SourceStageVendordata | DS_SQL_StageVendordata |
| OrderServices         | Copy | DS_SQL_SourceStageVendordata | DS_SQL_StageVendordata |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
