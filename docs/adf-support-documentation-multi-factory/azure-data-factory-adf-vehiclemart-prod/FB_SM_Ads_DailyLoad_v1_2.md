# FB_SM_Ads_DailyLoad_v1_2

Generated: 2026-06-29T10:58:57.635Z
ADF factory: `adf-vehiclemart-prod`
Saved connector: `azure-data-factory-adf-vehiclemart-prod`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-vehiclemart-prod/2026-06-29T10-50-13-472Z-a59436b0-d570-4f84-beb9-99db50a52663.json`

## Plain-English Summary

FB_SM_Ads_DailyLoad_v1_2 is an ADF standalone or utility pipeline in adf-vehiclemart-prod. If FB_SM_Ads_DailyLoad_v1_2 fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the latest ADF run for FB_SM_Ads_DailyLoad_v1_2 and confirm source and target datasets are available.

## At a Glance

| Field                 | Value                                                                                                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Platform              | ADF                                                                                                                                                                                        |
| Asset type            | Pipeline                                                                                                                                                                                   |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/RG-VehicleMart-Prod/providers/Microsoft.DataFactory/factories/ADF-VehicleMart-Prod/pipelines/FB_SM_Ads_DailyLoad_v1_2` |
| Support role          | standalone or utility pipeline                                                                                                                                                             |
| Business process      | adf-vehiclemart-prod pipeline execution                                                                                                                                                    |
| Primary source        | not surfaced in metadata                                                                                                                                                                   |
| Primary target/output | not surfaced in metadata                                                                                                                                                                   |
| Schedule or trigger   | not directly triggered                                                                                                                                                                     |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:50:13.458Z                                                                                                                                              |
| Status signal         | metadata available                                                                                                                                                                         |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-vehiclemart-prod/2026-06-29T10-50-13-472Z-a59436b0-d570-4f84-beb9-99db50a52663.json`                                           |

## Business Use

This pipeline supports the adf-vehiclemart-prod ADF process. Its available metadata shows 13 activity step(s), 0 child pipeline call(s), 0 source dataset reference(s), and 0 target dataset reference(s).

## Support Checks

1. Check the latest ADF run for FB_SM_Ads_DailyLoad_v1_2 and confirm source and target datasets are available.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: ETLExecutionID, MetaLoadDate, MetaSourceSystemName, MetaSrcSysID, MetaUserID.
3. Confirm source datasets are available: not surfaced in metadata.
4. Confirm target datasets or child pipelines completed: not surfaced in metadata.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                      |
| ----------------- | --------------------------- |
| Parent pipelines  | not surfaced in metadata    |
| Child pipelines   | none surfaced               |
| Source datasets   | not surfaced in metadata    |
| Target datasets   | not surfaced in metadata    |
| Stored procedures | msdb.[dbo].[sp_send_dbmail] |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                     | Type                     | Inputs                   | Outputs                  |
| ---------------------------- | ------------------------ | ------------------------ | ------------------------ |
| Iterate Daily Files          | ForEach                  | not surfaced in metadata | not surfaced in metadata |
| Get Daily Files              | GetMetadata              | not surfaced in metadata | not surfaced in metadata |
| FilterDailyFiles             | Filter                   | not surfaced in metadata | not surfaced in metadata |
| Are Files available          | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| No Files to Process          | Wait                     | not surfaced in metadata | not surfaced in metadata |
| Get Files                    | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| FB Failure MailAlert         | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| FB Success MailAlert         | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| Get FileLists                | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| Get ErrorFileLists           | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| IterateAvailableFiles        | ForEach                  | not surfaced in metadata | not surfaced in metadata |
| Send Mail for Empty Files    | IfCondition              | not surfaced in metadata | not surfaced in metadata |
| FB Failure MailAlert_NoFIles | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
