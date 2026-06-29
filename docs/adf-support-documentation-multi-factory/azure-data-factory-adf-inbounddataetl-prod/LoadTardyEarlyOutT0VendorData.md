# LoadTardyEarlyOutT0VendorData

Generated: 2026-06-29T10:58:59.103Z
ADF factory: `adf-inbounddataetl-prod`
Saved connector: `azure-data-factory-adf-inbounddataetl-prod`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-inbounddataetl-prod/2026-06-29T10-46-28-895Z-0c8e98f2-1277-45d8-864a-42cd5d44bb03.json`

## Plain-English Summary

LoadTardyEarlyOutT0VendorData is an ADF data movement in adf-inbounddataetl-prod. If LoadTardyEarlyOutT0VendorData fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the latest ADF run for LoadTardyEarlyOutT0VendorData and confirm source and target datasets are available.

## At a Glance

| Field                 | Value                                                                                                                                                                                                      |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                                        |
| Asset type            | Pipeline                                                                                                                                                                                                   |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/RG-InboundDataServices-Prod/providers/Microsoft.DataFactory/factories/ADF-InboundDataETL-Prod/pipelines/LoadTardyEarlyOutT0VendorData` |
| Support role          | data movement                                                                                                                                                                                              |
| Business process      | adf-inbounddataetl-prod pipeline execution                                                                                                                                                                 |
| Primary source        | Verint_Staging_TardyEarlyOut_ds1                                                                                                                                                                           |
| Primary target/output | Verint_TardyEarlyOut_VendorData_ds                                                                                                                                                                         |
| Schedule or trigger   | not directly triggered                                                                                                                                                                                     |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:46:28.849Z                                                                                                                                                              |
| Status signal         | metadata available                                                                                                                                                                                         |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-inbounddataetl-prod/2026-06-29T10-46-28-895Z-0c8e98f2-1277-45d8-864a-42cd5d44bb03.json`                                                        |

## Business Use

This pipeline supports the adf-inbounddataetl-prod ADF process. Its available metadata shows 1 activity step(s), 0 child pipeline call(s), 1 source dataset reference(s), and 1 target dataset reference(s).

## Support Checks

1. Check the latest ADF run for LoadTardyEarlyOutT0VendorData and confirm source and target datasets are available.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: not surfaced in metadata.
3. Confirm source datasets are available: Verint_Staging_TardyEarlyOut_ds1.
4. Confirm target datasets or child pipelines completed: Verint_TardyEarlyOut_VendorData_ds.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                             |
| ----------------- | ---------------------------------- |
| Parent pipelines  | not surfaced in metadata           |
| Child pipelines   | none surfaced                      |
| Source datasets   | Verint_Staging_TardyEarlyOut_ds1   |
| Target datasets   | Verint_TardyEarlyOut_VendorData_ds |
| Stored procedures | none surfaced                      |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                            | Type | Inputs                           | Outputs                            |
| ----------------------------------- | ---- | -------------------------------- | ---------------------------------- |
| Copy Tardy Early Out to Vendor Data | Copy | Verint_Staging_TardyEarlyOut_ds1 | Verint_TardyEarlyOut_VendorData_ds |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
