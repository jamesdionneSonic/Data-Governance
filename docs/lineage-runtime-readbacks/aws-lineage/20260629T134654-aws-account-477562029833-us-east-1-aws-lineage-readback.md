# AWS Lineage Ingestion Readback

Generated: 2026-06-29T13:46:54.573Z

Source scope: `aws-account:477562029833:us-east-1`

Lineage connector id: `aws-account-477562029833-us-east-1`

Source connectors: `aws-athena-sonic-pp-mdp`, `aws-glue-sonic-pp-mdp`, `aws-s3-sonic-pp-mdp`

## Product Routing

Primary product area: `MDP`

| Product Area | Objects |
| ------------ | ------: |
| MDP          |     823 |

Human catalog roots:

- Sonic Data Lineage / Data Product Catalog / MDP / MDP AWS Lineage Context

## Summary

| Signal  | Count |
| ------- | ----: |
| Objects |   823 |
| Edges   |   877 |
| Gaps    |     0 |

## Objects By Type

| Type                | Count |
| ------------------- | ----: |
| athena_data_catalog |     1 |
| athena_database     |     2 |
| athena_table        |    27 |
| athena_workgroup    |     4 |
| aws_account         |     1 |
| aws_athena_service  |     1 |
| aws_glue_service    |     1 |
| aws_s3_service      |     1 |
| glue_column         |   711 |
| glue_database       |     2 |
| glue_table          |    27 |
| s3_bucket           |    21 |
| s3_prefix           |    24 |

## Edge Sample

| Relationship          | From                                                               | To                                                                                | Confidence |
| --------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------- | ---------: |
| has_column            | default.elead_sales_activity                                       | default.elead_sales_activity.ltaskitemid                                          |       0.78 |
| contains              | sonic-mdp-processed-bucket-pp                                      | s3://sonic-mdp-processed-bucket-pp/domain/individual                              |       0.78 |
| has_column            | sonic_mdp_athena_query_db_pp.raw_dms_purchase_information          | sonic_mdp_athena_query_db_pp.raw_dms_purchase_information.trade1acv               |       0.78 |
| contains              | sonic_mdp_athena_query_db_pp                                       | sonic_mdp_athena_query_db_pp.processed_vehicle_acquisition                        |       0.78 |
| has_column            | default.elead_sales_activity                                       | default.elead_sales_activity.orgname                                              |       0.78 |
| has_column            | default.dms_individual                                             | default.dms_individual.custno                                                     |       0.78 |
| has_column            | sonic_mdp_athena_query_db_pp.processed_sales_activity              | sonic_mdp_athena_query_db_pp.processed_sales_activity.opportunity_deal_sub_status |       0.78 |
| has_column            | sonic_mdp_athena_query_db_pp.raw_dms_individual                    | sonic_mdp_athena_query_db_pp.raw_dms_individual.optoutflag                        |       0.78 |
| contains              | sonic-mdp-processed-bucket-pp                                      | s3://sonic-mdp-processed-bucket-pp/domain/sales_activity                          |       0.78 |
| has_column            | default.elead_individual                                           | default.elead_individual.szzip                                                    |       0.78 |
| has_column            | sonic_mdp_athena_query_db_pp.raw_dms_individual                    | sonic_mdp_athena_query_db_pp.raw_dms_individual.gender                            |       0.78 |
| has_column            | default.identified_sales_activity                                  | default.identified_sales_activity.task_reminder_date                              |       0.78 |
| has_column            | sonic_mdp_athena_query_db_pp.processed_individual                  | sonic_mdp_athena_query_db_pp.processed_individual.zip                             |       0.78 |
| has_column            | sonic_mdp_athena_query_db_pp.identified_vehicle_acquisition        | sonic_mdp_athena_query_db_pp.identified_vehicle_acquisition.first_name            |       0.78 |
| has_column            | sonic_mdp_athena_query_db_pp.processed_individual                  | sonic_mdp_athena_query_db_pp.processed_individual.identifying_phone               |       0.78 |
| storage_registered_by | s3://sonic-mdp-athena-db-source-pp/raw-parquet/dms_individual      | default.dms_individual                                                            |       0.78 |
| has_column            | default.dms_individual_2                                           | default.dms_individual_2.country                                                  |       0.78 |
| queried_by_athena     | sonic_mdp_athena_query_db_pp.processed_campaign_marketing_activity | AwsDataCatalog.sonic_mdp_athena_query_db_pp.processed_campaign_marketing_activity |       0.72 |
| has_column            | default.dms_individual                                             | default.dms_individual.groupmemberid                                              |       0.78 |
| has_column            | sonic_mdp_athena_query_db_pp.identified_individual                 | sonic_mdp_athena_query_db_pp.identified_individual.dealership_org_id              |       0.78 |
| has_column            | sonic_mdp_athena_query_db_pp.raw_dms_individual                    | sonic_mdp_athena_query_db_pp.raw_dms_individual.lastname                          |       0.78 |
| has_column            | default.elead_sales_activity                                       | default.elead_sales_activity.groupmembername                                      |       0.78 |
| has_column            | sonic_mdp_athena_query_db_pp.identified_individual                 | sonic_mdp_athena_query_db_pp.identified_individual.birthday                       |       0.78 |
| has_column            | sonic_mdp_athena_query_db_pp.processed_vehicle_purchase            | sonic_mdp_athena_query_db_pp.processed_vehicle_purchase.last_name                 |       0.78 |
| has_column            | sonic_mdp_athena_query_db_pp.identified_individual_phone           | sonic_mdp_athena_query_db_pp.identified_individual_phone.phone_number             |       0.78 |
| has_column            | sonic_mdp_athena_query_db_pp.processed_campaign_marketing_activity | sonic_mdp_athena_query_db_pp.processed_campaign_marketing_activity.linktoasset    |       0.78 |
| has_column            | sonic_mdp_athena_query_db_pp.processed_vehicle_acquisition         | sonic_mdp_athena_query_db_pp.processed_vehicle_acquisition.vin                    |       0.78 |
| has_column            | default.dms_purchase_info                                          | default.dms_purchase_info.salesperson1                                            |       0.78 |
| has_column            | sonic_mdp_athena_query_db_pp.raw_dms_individual                    | sonic_mdp_athena_query_db_pp.raw_dms_individual.telephone                         |       0.78 |
| contains              | sonic-mdp-identified-bucket-pp                                     | s3://sonic-mdp-identified-bucket-pp/domain/individual_email                       |       0.78 |

## Lineage Gaps

| Object | Gap  | Message |
| ------ | ---- | ------- |
| none   | none | none    |

## Delta

Mode: `full_refresh`

| Status         | Count |
| -------------- | ----: |
| new            |   823 |
| changed        |     0 |
| unchanged      |     0 |
| retained_stale |     0 |
| removed_stale  |     0 |

## AI Description Rule

Human-friendly descriptions must use only the bounded evidence packet for each object. If purpose, owner, steward, SLA, freshness, or business process is not surfaced by metadata, say that it is not surfaced in metadata. Do not infer business meaning from an AWS name alone.
