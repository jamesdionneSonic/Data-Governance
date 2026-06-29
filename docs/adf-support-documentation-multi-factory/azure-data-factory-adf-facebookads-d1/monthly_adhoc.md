# monthly_adhoc

## Plain-English Summary

monthly_adhoc is an ADF trigger in adf-facebookads-d1. It targets `not surfaced in metadata`. If monthly_adhoc fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking trigger state, schedule, and the latest target pipeline run.

## At a Glance

| Field                 | Value                                                                                                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                             |
| Asset type            | Trigger                                                                                                                                                                         |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-FacebookAds-D1/triggers/monthly_adhoc` |
| Support role          | Schedule / operational entry point                                                                                                                                              |
| Business process      | adf-facebookads-d1 scheduling                                                                                                                                                   |
| Primary source        | ADF trigger schedule                                                                                                                                                            |
| Primary target/output | not surfaced in metadata                                                                                                                                                        |
| Schedule or trigger   | Week every 1; time zone UTC                                                                                                                                                     |
| Runtime/usage signal  | Runtime state: Stopped                                                                                                                                                          |
| Status signal         | Stopped                                                                                                                                                                         |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-facebookads-d1/2026-06-29T10-33-50-098Z-594847ac-c07a-4c43-9ce6-d0688eb80812.json`                                  |

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
| Target pipelines | not surfaced in metadata |

## Runtime Or Usage Signals

Runtime state surfaced in metadata: Stopped.

## Technical Details

Schedule: Week every 1; time zone UTC

## Evidence And Caveats

- Trigger parameters are documented only when surfaced by ADF metadata.
- Trigger changes require a separate approved ADF operation packet.
