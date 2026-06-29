# AT_Auto_Trigger_ManualRun

Generated: 2026-06-29T10:58:57.628Z
ADF factory: `adf-vehiclemart-prod`
Saved connector: `azure-data-factory-adf-vehiclemart-prod`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-vehiclemart-prod/2026-06-29T10-50-13-472Z-a59436b0-d570-4f84-beb9-99db50a52663.json`

## Plain-English Summary

AT_Auto_Trigger_ManualRun is an ADF standalone or utility pipeline in adf-vehiclemart-prod. If AT_Auto_Trigger_ManualRun fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the latest ADF run for AT_Auto_Trigger_ManualRun and confirm source and target datasets are available.

## At a Glance

| Field                 | Value                                                                                                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                         |
| Asset type            | Pipeline                                                                                                                                                                                    |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/RG-VehicleMart-Prod/providers/Microsoft.DataFactory/factories/ADF-VehicleMart-Prod/pipelines/AT_Auto_Trigger_ManualRun` |
| Support role          | standalone or utility pipeline                                                                                                                                                              |
| Business process      | adf-vehiclemart-prod pipeline execution                                                                                                                                                     |
| Primary source        | not surfaced in metadata                                                                                                                                                                    |
| Primary target/output | not surfaced in metadata                                                                                                                                                                    |
| Schedule or trigger   | Autotrader_Manual_Evry15min                                                                                                                                                                 |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:50:13.458Z                                                                                                                                               |
| Status signal         | triggered pipeline                                                                                                                                                                          |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-vehiclemart-prod/2026-06-29T10-50-13-472Z-a59436b0-d570-4f84-beb9-99db50a52663.json`                                            |

## Business Use

This pipeline supports the adf-vehiclemart-prod ADF process. Its available metadata shows 7 activity step(s), 0 child pipeline call(s), 0 source dataset reference(s), and 0 target dataset reference(s).

## Support Checks

1. Check the latest ADF run for AT_Auto_Trigger_ManualRun and confirm source and target datasets are available.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: not surfaced in metadata.
3. Confirm source datasets are available: not surfaced in metadata.
4. Confirm target datasets or child pipelines completed: not surfaced in metadata.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                   |
| ----------------- | ------------------------ |
| Parent pipelines  | not surfaced in metadata |
| Child pipelines   | none surfaced            |
| Source datasets   | not surfaced in metadata |
| Target datasets   | not surfaced in metadata |
| Stored procedures | none surfaced            |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity               | Type        | Inputs                   | Outputs                  |
| ---------------------- | ----------- | ------------------------ | ------------------------ |
| Get Datekey            | Lookup      | not surfaced in metadata | not surfaced in metadata |
| AT LoadDate            | SetVariable | not surfaced in metadata | not surfaced in metadata |
| DateKey                | SetVariable | not surfaced in metadata | not surfaced in metadata |
| Is Date Same           | IfCondition | not surfaced in metadata | not surfaced in metadata |
| Check Pipeline Status  | Lookup      | not surfaced in metadata | not surfaced in metadata |
| AT NextLoadDate        | SetVariable | not surfaced in metadata | not surfaced in metadata |
| Update Pipeline Status | Lookup      | not surfaced in metadata | not surfaced in metadata |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
