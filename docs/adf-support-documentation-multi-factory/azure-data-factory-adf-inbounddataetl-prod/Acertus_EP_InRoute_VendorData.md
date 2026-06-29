# Acertus_EP_InRoute_VendorData

Generated: 2026-06-29T10:58:59.039Z
ADF factory: `adf-inbounddataetl-prod`
Saved connector: `azure-data-factory-adf-inbounddataetl-prod`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-inbounddataetl-prod/2026-06-29T10-46-28-895Z-0c8e98f2-1277-45d8-864a-42cd5d44bb03.json`

## Plain-English Summary

Acertus_EP_InRoute_VendorData is an ADF child pipeline in adf-inbounddataetl-prod. If Acertus_EP_InRoute_VendorData fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the parent pipeline that called Acertus_EP_InRoute_VendorData; do not start the child with blank operational parameters.

## At a Glance

| Field                 | Value                                                                                                                                                                                                      |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                                        |
| Asset type            | Pipeline                                                                                                                                                                                                   |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/RG-InboundDataServices-Prod/providers/Microsoft.DataFactory/factories/ADF-InboundDataETL-Prod/pipelines/Acertus_EP_InRoute_VendorData` |
| Support role          | child pipeline                                                                                                                                                                                             |
| Business process      | adf-inbounddataetl-prod pipeline execution                                                                                                                                                                 |
| Primary source        | ds_SQL_Acertus_Orders_Staging                                                                                                                                                                              |
| Primary target/output | ds_SQL_Acertus_VendorData_InRoute                                                                                                                                                                          |
| Schedule or trigger   | not directly triggered                                                                                                                                                                                     |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:46:28.849Z                                                                                                                                                              |
| Status signal         | metadata available                                                                                                                                                                                         |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-inbounddataetl-prod/2026-06-29T10-46-28-895Z-0c8e98f2-1277-45d8-864a-42cd5d44bb03.json`                                                        |

## Business Use

This pipeline supports the adf-inbounddataetl-prod ADF process. Its available metadata shows 3 activity step(s), 0 child pipeline call(s), 1 source dataset reference(s), and 1 target dataset reference(s).

## Support Checks

1. Check the parent pipeline that called Acertus_EP_InRoute_VendorData; do not start the child with blank operational parameters.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: not surfaced in metadata.
3. Confirm source datasets are available: ds_SQL_Acertus_Orders_Staging.
4. Confirm target datasets or child pipelines completed: ds_SQL_Acertus_VendorData_InRoute.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                            |
| ----------------- | --------------------------------- |
| Parent pipelines  | Acertus_EnRoute                   |
| Child pipelines   | none surfaced                     |
| Source datasets   | ds_SQL_Acertus_Orders_Staging     |
| Target datasets   | ds_SQL_Acertus_VendorData_InRoute |
| Stored procedures | none surfaced                     |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                             | Type    | Inputs                        | Outputs                           |
| ------------------------------------ | ------- | ----------------------------- | --------------------------------- |
| Copy data from Staging to VendorData | Copy    | ds_SQL_Acertus_Orders_Staging | ds_SQL_Acertus_VendorData_InRoute |
| Get SQL File Names                   | Lookup  | not surfaced in metadata      | not surfaced in metadata          |
| Get File Name list                   | ForEach | not surfaced in metadata      | not surfaced in metadata          |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
