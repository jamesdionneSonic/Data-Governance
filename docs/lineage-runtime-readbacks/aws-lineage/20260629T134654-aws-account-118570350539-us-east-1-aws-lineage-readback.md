# AWS Lineage Ingestion Readback

Generated: 2026-06-29T13:46:54.573Z

Source scope: `aws-account:118570350539:us-east-1`

Lineage connector id: `aws-account-118570350539-us-east-1`

Source connectors: `aws-athena-sonic-prd-mdp`, `aws-glue-sonic-prd-mdp`, `aws-s3-sonic-prd-mdp`

## Product Routing

Primary product area: `MDP`

| Product Area | Objects |
| ------------ | ------: |
| MDP          |     546 |

Human catalog roots:

- Sonic Data Lineage / Data Product Catalog / MDP / MDP AWS Lineage Context

## Summary

| Signal  | Count |
| ------- | ----: |
| Objects |   546 |
| Edges   |   586 |
| Gaps    |     0 |

## Objects By Type

| Type                | Count |
| ------------------- | ----: |
| athena_data_catalog |     1 |
| athena_database     |     2 |
| athena_table        |    20 |
| athena_workgroup    |     2 |
| aws_account         |     1 |
| aws_athena_service  |     1 |
| aws_glue_service    |     1 |
| aws_s3_service      |     1 |
| glue_column         |   456 |
| glue_database       |     2 |
| glue_table          |    20 |
| s3_bucket           |    19 |
| s3_prefix           |    20 |

## Edge Sample

| Relationship          | From                                                                     | To                                                                                         | Confidence |
| --------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ---------: |
| has_column            | sonic_mdp_athena_query_db_prod.raw_dms_individual                        | sonic_mdp_athena_query_db_prod.raw_dms_individual.homephone                                |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.processed_vehicle_purchase                | sonic_mdp_athena_query_db_prod.processed_vehicle_purchase.first_name                       |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.raw_dms_individual                        | sonic_mdp_athena_query_db_prod.raw_dms_individual.groupmembername                          |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.raw_dms_individual                        | sonic_mdp_athena_query_db_prod.raw_dms_individual.email4                                   |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.processed_individual_email                | sonic_mdp_athena_query_db_prod.processed_individual_email.source_system                    |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.raw_elead_individual                      | sonic_mdp_athena_query_db_prod.raw_elead_individual.customer_last_name                     |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.raw_elead_sales_activity                  | sonic_mdp_athena_query_db_prod.raw_elead_sales_activity.dtlastedit                         |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.processed_sales_activity                  | sonic_mdp_athena_query_db_prod.processed_sales_activity.creator_first_name                 |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.processed_vehicle_purchase                | sonic_mdp_athena_query_db_prod.processed_vehicle_purchase.source_order_datetime            |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.identified_individual_email               | sonic_mdp_athena_query_db_prod.identified_individual_email.is_primary                      |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.identified_individual_email               | sonic_mdp_athena_query_db_prod.identified_individual_email.last_name                       |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.identified_vehicle_purchase               | sonic_mdp_athena_query_db_prod.identified_vehicle_purchase.dealership_group_member_id      |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.processed_individual                      | sonic_mdp_athena_query_db_prod.processed_individual.id                                     |       0.78 |
| storage_registered_by | s3://sonic-mdp-preprocessing-bucket-prod/                                | sonic_mdp_athena_query_db_prod.preprocessing_campaign_marketing_activity                   |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.processed_individual_email                | sonic_mdp_athena_query_db_prod.processed_individual_email.source_order_datetime            |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.processed_individual_email                | sonic_mdp_athena_query_db_prod.processed_individual_email.first_name                       |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.raw_dms_purchase_information              | sonic_mdp_athena_query_db_prod.raw_dms_purchase_information.telephone                      |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.identified_individual                     | sonic_mdp_athena_query_db_prod.identified_individual.birthday                              |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.raw_elead_sales_activity                  | sonic_mdp_athena_query_db_prod.raw_elead_sales_activity.szworkflow                         |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.identified_sales_activity                 | sonic_mdp_athena_query_db_prod.identified_sales_activity.source_order_datetime             |       0.78 |
| storage_registered_by | s3://sonic-mdp-identified-bucket-prod/domain/individual_email            | sonic_mdp_athena_query_db_prod.identified_individual_email                                 |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.processed_sales_activity                  | sonic_mdp_athena_query_db_prod.processed_sales_activity.dealership_group_member_id         |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.processed_individual_phone                | sonic_mdp_athena_query_db_prod.processed_individual_phone.first_name                       |       0.78 |
| storage_registered_by | s3://sonic-mdp-identified-bucket-prod/domain/campaign_marketing_activity | sonic_mdp_athena_query_db_prod.identified_campaign_marketing_activity                      |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.processed_individual                      | sonic_mdp_athena_query_db_prod.processed_individual.delete_data                            |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.processed_vehicle_acquisition             | sonic_mdp_athena_query_db_prod.processed_vehicle_acquisition.primary_salesperson_last_name |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.processed_sales_activity                  | sonic_mdp_athena_query_db_prod.processed_sales_activity.individual_id                      |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.identified_individual_phone               | sonic_mdp_athena_query_db_prod.identified_individual_phone.do_not_call                     |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.preprocessing_campaign_marketing_activity | sonic_mdp_athena_query_db_prod.preprocessing_campaign_marketing_activity.eventdate         |       0.78 |
| has_column            | sonic_mdp_athena_query_db_prod.raw_elead_sales_activity                  | sonic_mdp_athena_query_db_prod.raw_elead_sales_activity.szdatasource                       |       0.78 |

## Lineage Gaps

| Object | Gap  | Message |
| ------ | ---- | ------- |
| none   | none | none    |

## Delta

Mode: `full_refresh`

| Status         | Count |
| -------------- | ----: |
| new            |   546 |
| changed        |     0 |
| unchanged      |     0 |
| retained_stale |     0 |
| removed_stale  |     0 |

## AI Description Rule

Human-friendly descriptions must use only the bounded evidence packet for each object. If purpose, owner, steward, SLA, freshness, or business process is not surfaced by metadata, say that it is not surfaced in metadata. Do not infer business meaning from an AWS name alone.
