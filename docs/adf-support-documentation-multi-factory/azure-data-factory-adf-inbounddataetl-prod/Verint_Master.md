# Verint_Master

Generated: 2026-06-29T10:58:59.169Z
ADF factory: `adf-inbounddataetl-prod`
Saved connector: `azure-data-factory-adf-inbounddataetl-prod`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-inbounddataetl-prod/2026-06-29T10-46-28-895Z-0c8e98f2-1277-45d8-864a-42cd5d44bb03.json`

## Plain-English Summary

Verint_Master is an ADF orchestrator in adf-inbounddataetl-prod. If Verint_Master fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the latest Verint_Master parent run and identify the first failed child activity.

## At a Glance

| Field                 | Value                                                                                                                                                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Platform              | ADF                                                                                                                                                                                                                                        |
| Asset type            | Pipeline                                                                                                                                                                                                                                   |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/RG-InboundDataServices-Prod/providers/Microsoft.DataFactory/factories/ADF-InboundDataETL-Prod/pipelines/Verint_Master`                                                 |
| Support role          | orchestrator                                                                                                                                                                                                                               |
| Business process      | adf-inbounddataetl-prod pipeline execution                                                                                                                                                                                                 |
| Primary source        | not surfaced in metadata                                                                                                                                                                                                                   |
| Primary target/output | LoadAgentAdherenceStaging1, LoadAgentStatusStaging1, LoadStandardRosterStaging1, LoadTardyEarlyOutStaging1, LoadAgentAdherenceToVendorData1, LoadAgentStatusToVendorData1, LoadStandardRosterToVendorData1, LoadTardyEarlyOutT0VendorData1 |
| Schedule or trigger   | trverint                                                                                                                                                                                                                                   |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:46:28.849Z                                                                                                                                                                                              |
| Status signal         | triggered pipeline                                                                                                                                                                                                                         |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-inbounddataetl-prod/2026-06-29T10-46-28-895Z-0c8e98f2-1277-45d8-864a-42cd5d44bb03.json`                                                                                        |

## Business Use

This pipeline supports the adf-inbounddataetl-prod ADF process. Its available metadata shows 13 activity step(s), 13 child pipeline call(s), 0 source dataset reference(s), and 0 target dataset reference(s).

## Support Checks

1. Check the latest Verint_Master parent run and identify the first failed child activity.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: not surfaced in metadata.
3. Confirm source datasets are available: not surfaced in metadata.
4. Confirm target datasets or child pipelines completed: LoadAgentAdherenceStaging1, LoadAgentStatusStaging1, LoadStandardRosterStaging1, LoadTardyEarlyOutStaging1, LoadAgentAdherenceToVendorData1, LoadAgentStatusToVendorData1, LoadStandardRosterToVendorData1, LoadTardyEarlyOutT0VendorData1, LoadFilesSFTP_to_ADLS1, MoveAgentAdherenceFilesToArchive1, MoveAgentStatusFilesToArchive1, MoveStandardRosterFilesToArchive1, MoveTardyEarlyOutFilesToArchive1.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Parent pipelines  | not surfaced in metadata                                                                                                                                                                                                                                                                                                                                                                                   |
| Child pipelines   | LoadAgentAdherenceStaging1, LoadAgentStatusStaging1, LoadStandardRosterStaging1, LoadTardyEarlyOutStaging1, LoadAgentAdherenceToVendorData1, LoadAgentStatusToVendorData1, LoadStandardRosterToVendorData1, LoadTardyEarlyOutT0VendorData1, LoadFilesSFTP_to_ADLS1, MoveAgentAdherenceFilesToArchive1, MoveAgentStatusFilesToArchive1, MoveStandardRosterFilesToArchive1, MoveTardyEarlyOutFilesToArchive1 |
| Source datasets   | not surfaced in metadata                                                                                                                                                                                                                                                                                                                                                                                   |
| Target datasets   | not surfaced in metadata                                                                                                                                                                                                                                                                                                                                                                                   |
| Stored procedures | none surfaced                                                                                                                                                                                                                                                                                                                                                                                              |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                         | Type            | Inputs                   | Outputs                  |
| -------------------------------- | --------------- | ------------------------ | ------------------------ |
| Load Agent Adherence Staging     | ExecutePipeline | not surfaced in metadata | not surfaced in metadata |
| Load Agent Status Staging        | ExecutePipeline | not surfaced in metadata | not surfaced in metadata |
| Load Standard Roster Staging     | ExecutePipeline | not surfaced in metadata | not surfaced in metadata |
| Load Tardy Early Out Staging     | ExecutePipeline | not surfaced in metadata | not surfaced in metadata |
| Load Agent Adherence Vendor Data | ExecutePipeline | not surfaced in metadata | not surfaced in metadata |
| Load Agent Status Vendor Data    | ExecutePipeline | not surfaced in metadata | not surfaced in metadata |
| Load Standard Roster Vendor Data | ExecutePipeline | not surfaced in metadata | not surfaced in metadata |
| Load Tardy Early Out Vendor Data | ExecutePipeline | not surfaced in metadata | not surfaced in metadata |
| Get Files from Verint SFTP       | ExecutePipeline | not surfaced in metadata | not surfaced in metadata |
| Move Agent Adherence To Archive  | ExecutePipeline | not surfaced in metadata | not surfaced in metadata |
| Move Agent Status to Archive     | ExecutePipeline | not surfaced in metadata | not surfaced in metadata |
| Move Standard Roster To Archive  | ExecutePipeline | not surfaced in metadata | not surfaced in metadata |
| Move Tardy Early Out To Archive  | ExecutePipeline | not surfaced in metadata | not surfaced in metadata |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
