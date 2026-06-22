# trigger_dailyload

## Plain-English Summary

trigger_dailyload is an ADF trigger for `pl_Marketing_AWS_Export`. It matters because it starts the scheduled marketing workflow; if it is stopped or misconfigured, downstream export and mapping data may not refresh on time. Start troubleshooting by confirming trigger state, schedule, and the latest target pipeline run.

## At a Glance

| Field                 | Value                                                                                                                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                    |
| Asset type            | Trigger                                                                                                                                                                                |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-dw-marketing-prod/triggers/trigger_dailyload` |
| Support role          | Schedule / operational entry point                                                                                                                                                     |
| Business process      | Marketing AWS export scheduling                                                                                                                                                        |
| Primary source        | ADF trigger schedule                                                                                                                                                                   |
| Primary target/output | pl_Marketing_AWS_Export                                                                                                                                                                |
| Schedule or trigger   | Week every 1; time zone Eastern Standard Time                                                                                                                                          |
| Runtime/usage signal  | Runtime state: Started                                                                                                                                                                 |
| Status signal         | Started                                                                                                                                                                                |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-dw-marketing-prod/2026-06-18T19-30-26-484Z-c5fd7f11-4eb8-4b3f-82e8-047dd0dead46.json`                                      |

## Business Use

Use this page to confirm when ADF is expected to start the Marketing AWS export process and which root pipeline receives the trigger.

## Support Checks

1. Confirm the trigger state is started.
2. Confirm the target pipeline is the expected root orchestrator.
3. Check the latest target pipeline run around the scheduled time.
4. If the target pipeline did not start, validate trigger configuration and ADF permissions.

## Evidence And Caveats

- Trigger parameters are documented only when surfaced by ADF metadata.
- Do not change trigger state or schedule as part of documentation refresh.
