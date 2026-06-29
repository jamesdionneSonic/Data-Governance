# PL_MCI_NWMSTrafficLeadSale_Master

Generated: 2026-06-29T10:58:58.357Z
ADF factory: `adf-mci-d1`
Saved connector: `azure-data-factory-adf-mci-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-mci-d1/2026-06-29T10-38-55-091Z-34f3170a-d1ea-4186-b53f-3f09641fbeae.json`

## Plain-English Summary

PL_MCI_NWMSTrafficLeadSale_Master is an ADF standalone or utility pipeline in adf-mci-d1. If PL_MCI_NWMSTrafficLeadSale_Master fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the latest ADF run for PL_MCI_NWMSTrafficLeadSale_Master and confirm source and target datasets are available.

## At a Glance

| Field                 | Value                                                                                                                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                          |
| Asset type            | Pipeline                                                                                                                                                                                     |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-MCI-D1/pipelines/PL_MCI_NWMSTrafficLeadSale_Master` |
| Support role          | standalone or utility pipeline                                                                                                                                                               |
| Business process      | adf-mci-d1 pipeline execution                                                                                                                                                                |
| Primary source        | not surfaced in metadata                                                                                                                                                                     |
| Primary target/output | not surfaced in metadata                                                                                                                                                                     |
| Schedule or trigger   | Tr_LeadSale_Daily                                                                                                                                                                            |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:38:55.070Z                                                                                                                                                |
| Status signal         | triggered pipeline                                                                                                                                                                           |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-mci-d1/2026-06-29T10-38-55-091Z-34f3170a-d1ea-4186-b53f-3f09641fbeae.json`                                                       |

## Business Use

This pipeline supports the adf-mci-d1 ADF process. Its available metadata shows 6 activity step(s), 0 child pipeline call(s), 0 source dataset reference(s), and 0 target dataset reference(s).

## Support Checks

1. Check the latest ADF run for PL_MCI_NWMSTrafficLeadSale_Master and confirm source and target datasets are available.
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

| Activity                              | Type        | Inputs                   | Outputs                  |
| ------------------------------------- | ----------- | ------------------------ | ------------------------ |
| SetUserNameForLS                      | SetVariable | not surfaced in metadata | not surfaced in metadata |
| Check Dependency                      | Lookup      | not surfaced in metadata | not surfaced in metadata |
| Condition Checks                      | IfCondition | not surfaced in metadata | not surfaced in metadata |
| Check LoadDate                        | Lookup      | not surfaced in metadata | not surfaced in metadata |
| Check IsEnabled                       | Lookup      | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_GetSuccessAndFailureEmailList | Lookup      | not surfaced in metadata | not surfaced in metadata |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
