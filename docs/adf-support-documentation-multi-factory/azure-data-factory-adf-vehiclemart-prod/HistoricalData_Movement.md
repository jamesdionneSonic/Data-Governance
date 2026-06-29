# HistoricalData_Movement

Generated: 2026-06-29T10:58:57.641Z
ADF factory: `adf-vehiclemart-prod`
Saved connector: `azure-data-factory-adf-vehiclemart-prod`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-vehiclemart-prod/2026-06-29T10-50-13-472Z-a59436b0-d570-4f84-beb9-99db50a52663.json`

## Plain-English Summary

HistoricalData_Movement is an ADF data movement in adf-vehiclemart-prod. If HistoricalData_Movement fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the latest ADF run for HistoricalData_Movement and confirm source and target datasets are available.

## At a Glance

| Field                 | Value                                                                                                                                                                                     |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                       |
| Asset type            | Pipeline                                                                                                                                                                                  |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/RG-VehicleMart-Prod/providers/Microsoft.DataFactory/factories/ADF-VehicleMart-Prod/pipelines/HistoricalData_Movement` |
| Support role          | data movement                                                                                                                                                                             |
| Business process      | adf-vehiclemart-prod pipeline execution                                                                                                                                                   |
| Primary source        | T1_SMCampaignDaily, T1_SMCampaignMonthly, T1_AuditTable                                                                                                                                   |
| Primary target/output | D1_SMCampaignDaily, D1_SMCampaignMonthly, D1_AuditTable                                                                                                                                   |
| Schedule or trigger   | not directly triggered                                                                                                                                                                    |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:50:13.458Z                                                                                                                                             |
| Status signal         | metadata available                                                                                                                                                                        |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-vehiclemart-prod/2026-06-29T10-50-13-472Z-a59436b0-d570-4f84-beb9-99db50a52663.json`                                          |

## Business Use

This pipeline supports the adf-vehiclemart-prod ADF process. Its available metadata shows 3 activity step(s), 0 child pipeline call(s), 3 source dataset reference(s), and 3 target dataset reference(s).

## Support Checks

1. Check the latest ADF run for HistoricalData_Movement and confirm source and target datasets are available.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: not surfaced in metadata.
3. Confirm source datasets are available: T1_SMCampaignDaily, T1_SMCampaignMonthly, T1_AuditTable.
4. Confirm target datasets or child pipelines completed: D1_SMCampaignDaily, D1_SMCampaignMonthly, D1_AuditTable.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                                                  |
| ----------------- | ------------------------------------------------------- |
| Parent pipelines  | not surfaced in metadata                                |
| Child pipelines   | none surfaced                                           |
| Source datasets   | T1_SMCampaignDaily, T1_SMCampaignMonthly, T1_AuditTable |
| Target datasets   | D1_SMCampaignDaily, D1_SMCampaignMonthly, D1_AuditTable |
| Stored procedures | none surfaced                                           |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                | Type | Inputs               | Outputs              |
| ----------------------- | ---- | -------------------- | -------------------- |
| FBSMAdByCampaignDaily   | Copy | T1_SMCampaignDaily   | D1_SMCampaignDaily   |
| FBSMAdByCampaignMonthly | Copy | T1_SMCampaignMonthly | D1_SMCampaignMonthly |
| SSIS_AuditTable         | Copy | T1_AuditTable        | D1_AuditTable        |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
