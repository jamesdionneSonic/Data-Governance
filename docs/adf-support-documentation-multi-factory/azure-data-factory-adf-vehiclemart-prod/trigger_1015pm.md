# trigger_1015pm

## Plain-English Summary

trigger_1015pm is an ADF trigger in adf-vehiclemart-prod. It targets `activityMonitor_all_list`. If trigger_1015pm fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking trigger state, schedule, and the latest target pipeline run.

## At a Glance

| Field                 | Value                                                                                                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                             |
| Asset type            | Trigger                                                                                                                                                                         |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/RG-VehicleMart-Prod/providers/Microsoft.DataFactory/factories/ADF-VehicleMart-Prod/triggers/trigger_1015pm` |
| Support role          | Schedule / operational entry point                                                                                                                                              |
| Business process      | adf-vehiclemart-prod scheduling                                                                                                                                                 |
| Primary source        | ADF trigger schedule                                                                                                                                                            |
| Primary target/output | activityMonitor_all_list                                                                                                                                                        |
| Schedule or trigger   | Day every 1; time zone UTC                                                                                                                                                      |
| Runtime/usage signal  | Runtime state: Stopped                                                                                                                                                          |
| Status signal         | Stopped                                                                                                                                                                         |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-vehiclemart-prod/2026-06-29T10-50-13-472Z-a59436b0-d570-4f84-beb9-99db50a52663.json`                                |

## Business Use

Use this page to confirm when ADF is expected to start this factory's pipeline process and which pipeline receives the trigger.

## Support Checks

1. Confirm trigger state.
2. Confirm target pipeline names.
3. Check target pipeline run history around the scheduled time.
4. Do not change trigger state or schedule as part of documentation refresh.

## Lineage And Dependencies

| Dependency type  | Values                   |
| ---------------- | ------------------------ |
| Target pipelines | activityMonitor_all_list |

## Runtime Or Usage Signals

Runtime state surfaced in metadata: Stopped.

## Technical Details

Schedule: Day every 1; time zone UTC

## Evidence And Caveats

- Trigger parameters are documented only when surfaced by ADF metadata.
- Trigger changes require a separate approved ADF operation packet.
