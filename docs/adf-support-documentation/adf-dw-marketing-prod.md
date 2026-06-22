# adf-dw-marketing-prod

Generated: 2026-06-19T08:45:26.936Z
Saved connector: `azure-data-factory-adf-dw-marketing-prod`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-dw-marketing-prod/2026-06-18T19-30-26-484Z-c5fd7f11-4eb8-4b3f-82e8-047dd0dead46.json`

## Plain-English Summary

`adf-dw-marketing-prod` supports the scheduled Marketing AWS export and related marketing/MDP data movement. The factory coordinates root pipelines, child mapping pipelines, datasets, linked services, and triggers. If this factory or its root orchestrator fails, downstream marketing export and mapping data can be stale or incomplete. Start troubleshooting with the active trigger, the parent pipeline run, and then the failed child pipeline.

## At a Glance

| Field                 | Value                                                                                                                                                                |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                  |
| Asset type            | Data factory                                                                                                                                                         |
| Native path           | `adf-dw-marketing-prod`                                                                                                                                              |
| Support role          | Factory / support section root                                                                                                                                       |
| Business process      | Marketing AWS export and marketing data movement                                                                                                                     |
| Primary source        | ds_mdp_elead_activity_parquet, ds_mdp_elead_vehicleinterest_parquet, ds_mdp_elead_individual_parquet, ds_mdp_dms_purchaseinfo_parquet, ds_mdp_dms_individual_parquet |
| Primary target/output | Marketing AWS export and downstream mapping/MDP datasets                                                                                                             |
| Schedule or trigger   | trigger_dailyload, trigger_sunday                                                                                                                                    |
| Runtime/usage signal  | Profiled at 2026-06-18T19:30:26.470Z                                                                                                                                 |
| Status signal         | scheduled active                                                                                                                                                     |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-dw-marketing-prod/2026-06-18T19-30-26-484Z-c5fd7f11-4eb8-4b3f-82e8-047dd0dead46.json`                    |

## Business Use

This factory keeps marketing export workflows and cross-system mapping refreshes organized in ADF. Support should treat `pl_Marketing_AWS_Export` as the current operational root and use child pipeline pages to understand specific mapping or data movement steps.

## Support Checks

1. Confirm the active trigger schedule and target pipeline.
2. Check the latest `pl_Marketing_AWS_Export` parent run.
3. If the parent failed, identify the failed child pipeline and inspect that page.
4. Do not start child pipelines with blank operational parameters.
5. Confirm source and target datasets or linked services are available before rerunning.

## Inventory

| Asset type      | Count |
| --------------- | ----: |
| Pipelines       |    16 |
| Triggers        |     2 |
| Datasets        |    20 |
| Linked services |     9 |
| Folders         |     6 |

## Pipeline Folders

| Folder        | Pipelines |
| ------------- | --------: |
| dms           |         3 |
| elead         |         4 |
| history       |         1 |
| history/dms   |         3 |
| history/elead |         4 |
| root          |         1 |

## Evidence And Caveats

- This overview is generated from saved connector metadata and does not publish secrets or raw activity output.
- Runtime values are support signals as of generation time, not service-level guarantees.
