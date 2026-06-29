# FacebookAdsDaily

## Plain-English Summary

FacebookAdsDaily is an ADF trigger in adf-facebookads-d1. It targets `PL_FacebookAds_Master`. If FacebookAdsDaily fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking trigger state, schedule, and the latest target pipeline run.

## At a Glance

| Field                 | Value                                                                                                                                                                              |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                |
| Asset type            | Trigger                                                                                                                                                                            |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-FacebookAds-D1/triggers/FacebookAdsDaily` |
| Support role          | Schedule / operational entry point                                                                                                                                                 |
| Business process      | adf-facebookads-d1 scheduling                                                                                                                                                      |
| Primary source        | ADF trigger schedule                                                                                                                                                               |
| Primary target/output | PL_FacebookAds_Master                                                                                                                                                              |
| Schedule or trigger   | Day every 1; time zone Eastern Standard Time                                                                                                                                       |
| Runtime/usage signal  | Runtime state: Started                                                                                                                                                             |
| Status signal         | Started                                                                                                                                                                            |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-facebookads-d1/2026-06-29T10-33-50-098Z-594847ac-c07a-4c43-9ce6-d0688eb80812.json`                                     |

## Business Use

Use this page to confirm when ADF is expected to start this factory's pipeline process and which pipeline receives the trigger.

## Support Checks

1. Confirm trigger state.
2. Confirm target pipeline names.
3. Check target pipeline run history around the scheduled time.
4. Do not change trigger state or schedule as part of documentation refresh.

## Lineage And Dependencies

| Dependency type  | Values                |
| ---------------- | --------------------- |
| Target pipelines | PL_FacebookAds_Master |

## Runtime Or Usage Signals

Runtime state surfaced in metadata: Started.

## Technical Details

Schedule: Day every 1; time zone Eastern Standard Time

## Evidence And Caveats

- Trigger parameters are documented only when surfaced by ADF metadata.
- Trigger changes require a separate approved ADF operation packet.
