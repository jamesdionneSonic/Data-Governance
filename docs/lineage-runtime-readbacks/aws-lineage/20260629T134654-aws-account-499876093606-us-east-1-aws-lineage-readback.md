# AWS Lineage Ingestion Readback

Generated: 2026-06-29T13:46:54.573Z

Source scope: `aws-account:499876093606:us-east-1`

Lineage connector id: `aws-account-499876093606-us-east-1`

Source connectors: `aws-athena-sonic-dev-mdp`, `aws-glue-sonic-dev-mdp`, `aws-s3-sonic-dev-mdp`

## Product Routing

Primary product area: `MDP`

| Product Area | Objects |
| ------------ | ------: |
| MDP          |    4260 |

Human catalog roots:

- Sonic Data Lineage / Data Product Catalog / MDP / MDP AWS Lineage Context

## Summary

| Signal  | Count |
| ------- | ----: |
| Objects |  4260 |
| Edges   |  4580 |
| Gaps    |     0 |

## Objects By Type

| Type                | Count |
| ------------------- | ----: |
| athena_data_catalog |     1 |
| athena_database     |     9 |
| athena_table        |   160 |
| athena_workgroup    |    10 |
| aws_account         |     1 |
| aws_athena_service  |     1 |
| aws_glue_service    |     1 |
| aws_s3_service      |     1 |
| glue_column         |  3648 |
| glue_database       |     9 |
| glue_table          |   160 |
| s3_bucket           |    99 |
| s3_prefix           |   160 |

## Edge Sample

| Relationship          | From                                                                    | To                                                                                     | Confidence |
| --------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---------: |
| contains              | sonic-mdp-raw-bucket-corynivens                                         | s3://sonic-mdp-raw-bucket-corynivens/elead/domain/individual                           |       0.78 |
| storage_registered_by | s3://sonic-mdp-processed-bucket-corynivens/domain/individual_phone      | sonic_mdp_athena_query_db_corynivens.processed_individual_phone                        |       0.78 |
| has_column            | sonic_mdp_athena_query_db_ashish.processed_sales_activity               | sonic_mdp_athena_query_db_ashish.processed_sales_activity.dealership_org_name          |       0.78 |
| storage_registered_by | s3://sonic-mdp-identified-bucket-mitaghude/domain/sales_activity        | sonic_mdp_athena_query_db_mitaghude.identified_sales_activity                          |       0.78 |
| has_column            | sonic_mdp_athena_query_db_dev.raw_dms_individual                        | sonic_mdp_athena_query_db_dev.raw_dms_individual.country                               |       0.78 |
| has_column            | sonic_mdp_athena_query_db_mitaghude.raw_dms_purchase_information        | sonic_mdp_athena_query_db_mitaghude.raw_dms_purchase_information.trade2year            |       0.78 |
| has_column            | sonic_mdp_athena_query_db_kcarter.raw_elead_sales_activity              | sonic_mdp_athena_query_db_kcarter.raw_elead_sales_activity.szworkflow                  |       0.78 |
| queried_by_athena     | sonic_mdp_athena_query_db_corynivens.processed_vehicle_purchase         | AwsDataCatalog.sonic_mdp_athena_query_db_corynivens.processed_vehicle_purchase         |       0.72 |
| has_column            | sonic_mdp_athena_query_db_dev.processed_sales_activity                  | sonic_mdp_athena_query_db_dev.processed_sales_activity.activity_completed_date         |       0.78 |
| has_column            | sonic_mdp_athena_query_db_ashish.processed_sales_activity               | sonic_mdp_athena_query_db_ashish.processed_sales_activity.dealership_group_member_id   |       0.78 |
| has_column            | sonic_mdp_athena_query_db_vsound.identified_individual_phone            | sonic_mdp_athena_query_db_vsound.identified_individual_phone.individual_id             |       0.78 |
| has_column            | sonic_mdp_athena_query_db_kcarter.identified_individual                 | sonic_mdp_athena_query_db_kcarter.identified_individual.country                        |       0.78 |
| has_column            | sonic_mdp_athena_query_db_mitaghude.identified_individual               | sonic_mdp_athena_query_db_mitaghude.identified_individual.delete_data_date             |       0.78 |
| has_column            | sonic_mdp_athena_query_db_kcarter.raw_dms_individual                    | sonic_mdp_athena_query_db_kcarter.raw_dms_individual.businessphone                     |       0.78 |
| has_column            | sonic_mdp_athena_query_db_ciarangg.raw_elead_sales_activity             | sonic_mdp_athena_query_db_ciarangg.raw_elead_sales_activity.szstatus                   |       0.78 |
| has_column            | sonic_mdp_athena_query_db_vsound.raw_elead_individual                   | sonic_mdp_athena_query_db_vsound.raw_elead_individual.dtibrthday                       |       0.78 |
| has_column            | sonic_mdp_athena_query_db_ankur.identified_vehicle_acquisition          | sonic_mdp_athena_query_db_ankur.identified_vehicle_acquisition.model                   |       0.78 |
| has_column            | sonic_mdp_athena_query_db_kcarter.raw_elead_sales_activity              | sonic_mdp_athena_query_db_kcarter.raw_elead_sales_activity.dtlastedit                  |       0.78 |
| queried_by_athena     | sonic_mdp_athena_query_db_mitaghude.raw_dms_individual                  | AwsDataCatalog.sonic_mdp_athena_query_db_mitaghude.raw_dms_individual                  |       0.72 |
| has_column            | sonic_mdp_athena_query_db_kcarter.processed_sales_activity              | sonic_mdp_athena_query_db_kcarter.processed_sales_activity.creator_first_name          |       0.78 |
| has_column            | sonic_mdp_athena_query_db_ankur.processed_sales_activity                | sonic_mdp_athena_query_db_ankur.processed_sales_activity.individual_id                 |       0.78 |
| has_column            | sonic_mdp_athena_query_db_dev.raw_elead_sales_activity                  | sonic_mdp_athena_query_db_dev.raw_elead_sales_activity.lpersonid                       |       0.78 |
| contains              | AwsDataCatalog.sonic_mdp_athena_query_db_ashish                         | AwsDataCatalog.sonic_mdp_athena_query_db_ashish.identified_campaign_marketing_activity |       0.78 |
| has_column            | sonic_mdp_athena_query_db_dev.preprocessing_campaign_marketing_activity | sonic_mdp_athena_query_db_dev.preprocessing_campaign_marketing_activity.phone          |       0.78 |
| has_column            | sonic_mdp_athena_query_db_corynivens.raw_elead_individual               | sonic_mdp_athena_query_db_corynivens.raw_elead_individual.dtibrthday                   |       0.78 |
| has_column            | sonic_mdp_athena_query_db_ciarangg.processed_individual_phone           | sonic_mdp_athena_query_db_ciarangg.processed_individual_phone.email                    |       0.78 |
| has_column            | sonic_mdp_athena_query_db_vsound.processed_campaign_marketing_activity  | sonic_mdp_athena_query_db_vsound.processed_campaign_marketing_activity.jobid           |       0.78 |
| has_column            | sonic_mdp_athena_query_db_mitaghude.raw_dms_purchase_information        | sonic_mdp_athena_query_db_mitaghude.raw_dms_purchase_information.cashprice             |       0.78 |
| has_column            | sonic_mdp_athena_query_db_dev.identified_sales_activity                 | sonic_mdp_athena_query_db_dev.identified_sales_activity.task                           |       0.78 |
| contains              | sonic-mdp-identified-bucket-vsound                                      | s3://sonic-mdp-identified-bucket-vsound/domain/individual                              |       0.78 |

## Lineage Gaps

| Object | Gap  | Message |
| ------ | ---- | ------- |
| none   | none | none    |

## Delta

Mode: `full_refresh`

| Status         | Count |
| -------------- | ----: |
| new            |  4260 |
| changed        |     0 |
| unchanged      |     0 |
| retained_stale |     0 |
| removed_stale  |     0 |

## AI Description Rule

Human-friendly descriptions must use only the bounded evidence packet for each object. If purpose, owner, steward, SLA, freshness, or business process is not surfaced by metadata, say that it is not surfaced in metadata. Do not infer business meaning from an AWS name alone.
