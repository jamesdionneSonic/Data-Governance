# Acertus_EnRoute

Generated: 2026-06-29T10:58:59.036Z
ADF factory: `adf-inbounddataetl-prod`
Saved connector: `azure-data-factory-adf-inbounddataetl-prod`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-inbounddataetl-prod/2026-06-29T10-46-28-895Z-0c8e98f2-1277-45d8-864a-42cd5d44bb03.json`

## Plain-English Summary

Acertus_EnRoute is an ADF orchestrator in adf-inbounddataetl-prod. If Acertus_EnRoute fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the latest Acertus_EnRoute parent run and identify the first failed child activity.

## At a Glance

| Field                 | Value                                                                                                                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                          |
| Asset type            | Pipeline                                                                                                                                                                                     |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/RG-InboundDataServices-Prod/providers/Microsoft.DataFactory/factories/ADF-InboundDataETL-Prod/pipelines/Acertus_EnRoute` |
| Support role          | orchestrator                                                                                                                                                                                 |
| Business process      | adf-inbounddataetl-prod pipeline execution                                                                                                                                                   |
| Primary source        | not surfaced in metadata                                                                                                                                                                     |
| Primary target/output | Acertus_InRoute_GetFiles1, Acertus_EP_InRoute_Staging, Acertus_EP_InRoute_VendorData                                                                                                         |
| Schedule or trigger   | not directly triggered                                                                                                                                                                       |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:46:28.849Z                                                                                                                                                |
| Status signal         | metadata available                                                                                                                                                                           |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-inbounddataetl-prod/2026-06-29T10-46-28-895Z-0c8e98f2-1277-45d8-864a-42cd5d44bb03.json`                                          |

## Business Use

This pipeline supports the adf-inbounddataetl-prod ADF process. Its available metadata shows 3 activity step(s), 3 child pipeline call(s), 0 source dataset reference(s), and 0 target dataset reference(s).

## Support Checks

1. Check the latest Acertus_EnRoute parent run and identify the first failed child activity.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: not surfaced in metadata.
3. Confirm source datasets are available: not surfaced in metadata.
4. Confirm target datasets or child pipelines completed: Acertus_InRoute_GetFiles1, Acertus_EP_InRoute_Staging, Acertus_EP_InRoute_VendorData.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                                                                               |
| ----------------- | ------------------------------------------------------------------------------------ |
| Parent pipelines  | Acertus_Data_Transfer                                                                |
| Child pipelines   | Acertus_InRoute_GetFiles1, Acertus_EP_InRoute_Staging, Acertus_EP_InRoute_VendorData |
| Source datasets   | not surfaced in metadata                                                             |
| Target datasets   | not surfaced in metadata                                                             |
| Stored procedures | none surfaced                                                                        |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                      | Type            | Inputs                   | Outputs                  |
| ----------------------------- | --------------- | ------------------------ | ------------------------ |
| Acertus_InRoute_GetFiles      | ExecutePipeline | not surfaced in metadata | not surfaced in metadata |
| Acertus_EP_InRoute_Staging    | ExecutePipeline | not surfaced in metadata | not surfaced in metadata |
| Acertus_EP_InRoute_VendorData | ExecutePipeline | not surfaced in metadata | not surfaced in metadata |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
