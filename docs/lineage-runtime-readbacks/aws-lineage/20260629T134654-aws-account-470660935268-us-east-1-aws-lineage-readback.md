# AWS Lineage Ingestion Readback

Generated: 2026-06-29T13:46:54.573Z

Source scope: `aws-account:470660935268:us-east-1`

Lineage connector id: `aws-account-470660935268-us-east-1`

Source connectors: `aws-athena-sonic-np-mdp`, `aws-glue-sonic-np-mdp`, `aws-s3-sonic-np-mdp`

## Product Routing

Primary product area: `MDP`

| Product Area | Objects |
| ------------ | ------: |
| MDP          |     709 |

Human catalog roots:

- Sonic Data Lineage / Data Product Catalog / MDP / MDP AWS Lineage Context

## Summary

| Signal  | Count |
| ------- | ----: |
| Objects |   709 |
| Edges   |   757 |
| Gaps    |     0 |

## Objects By Type

| Type                | Count |
| ------------------- | ----: |
| athena_data_catalog |     1 |
| athena_database     |     2 |
| athena_table        |    24 |
| athena_workgroup    |     3 |
| aws_account         |     1 |
| aws_athena_service  |     1 |
| aws_glue_service    |     1 |
| aws_s3_service      |     1 |
| glue_column         |   606 |
| glue_database       |     2 |
| glue_table          |    24 |
| s3_bucket           |    19 |
| s3_prefix           |    24 |

## Edge Sample

| Relationship          | From                                                          | To                                                                                      | Confidence |
| --------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ---------: |
| has_column            | sonic_mdp_athena_query_db_np.raw_elead_sales_activity         | sonic_mdp_athena_query_db_np.raw_elead_sales_activity.address                           |       0.78 |
| contains              | AwsDataCatalog.default                                        | AwsDataCatalog.default.dms_individual                                                   |       0.78 |
| has_column            | default.dms_individual                                        | default.dms_individual.cellular                                                         |       0.78 |
| has_column            | default.dms_individual                                        | default.dms_individual.blockdatashare                                                   |       0.78 |
| has_column            | sonic_mdp_athena_query_db_np.raw_campaign_marketing_activity  | sonic_mdp_athena_query_db_np.raw_campaign_marketing_activity.jobid                      |       0.78 |
| has_column            | sonic_mdp_athena_query_db_np.identified_sales_activity        | sonic_mdp_athena_query_db_np.identified_sales_activity.activity_closed_date             |       0.78 |
| queried_by_athena     | sonic_mdp_athena_query_db_np.identified_vehicle_purchase      | AwsDataCatalog.sonic_mdp_athena_query_db_np.identified_vehicle_purchase                 |       0.72 |
| has_column            | default.elead_individual                                      | default.elead_individual.bdonotemail                                                    |       0.78 |
| has_column            | default.dms_individual                                        | default.dms_individual.blockemail                                                       |       0.78 |
| contains              | AwsDataCatalog.sonic_mdp_athena_query_db_np                   | AwsDataCatalog.sonic_mdp_athena_query_db_np.raw_dms_individual                          |       0.78 |
| has_column            | sonic_mdp_athena_query_db_np.raw_campaign_marketing_activity  | sonic_mdp_athena_query_db_np.raw_campaign_marketing_activity.smsmessagecontent          |       0.78 |
| has_column            | sonic_mdp_athena_query_db_np.identified_vehicle_purchase      | sonic_mdp_athena_query_db_np.identified_vehicle_purchase.first_name                     |       0.78 |
| has_column            | sonic_mdp_athena_query_db_np.identified_individual_email      | sonic_mdp_athena_query_db_np.identified_individual_email.source_system                  |       0.78 |
| contains              | sonic_mdp_athena_query_db_np                                  | sonic_mdp_athena_query_db_np.processed_individual                                       |       0.78 |
| has_column            | sonic_mdp_athena_query_db_np.raw_dms_individual               | sonic_mdp_athena_query_db_np.raw_dms_individual.city                                    |       0.78 |
| has_column            | sonic_mdp_athena_query_db_np.processed_sales_activity         | sonic_mdp_athena_query_db_np.processed_sales_activity.opportunity_up_type               |       0.78 |
| contains              | sonic-mdp-processed-bucket-np                                 | s3://sonic-mdp-processed-bucket-np/domain/individual_phone                              |       0.78 |
| storage_registered_by | s3://sonic-mdp-processed-bucket-np/domain/vehicle_acquisition | sonic_mdp_athena_query_db_np.processed_vehicle_acquisition                              |       0.78 |
| has_column            | sonic_mdp_athena_query_db_np.raw_dms_individual               | sonic_mdp_athena_query_db_np.raw_dms_individual.firstname                               |       0.78 |
| has_column            | sonic_mdp_athena_query_db_np.processed_sales_activity         | sonic_mdp_athena_query_db_np.processed_sales_activity.opportunity_owner_last_name       |       0.78 |
| has_column            | sonic_mdp_athena_query_db_np.identified_sales_activity        | sonic_mdp_athena_query_db_np.identified_sales_activity.opportunity_legacy_deal_id       |       0.78 |
| has_column            | sonic_mdp_athena_query_db_np.processed_individual_email       | sonic_mdp_athena_query_db_np.processed_individual_email.last_name                       |       0.78 |
| contains              | sonic-mdp-raw-bucket-np                                       | s3://sonic-mdp-raw-bucket-np/sfmc/domain/campaign_marketing_activity                    |       0.78 |
| has_column            | sonic_mdp_athena_query_db_np.identified_vehicle_purchase      | sonic_mdp_athena_query_db_np.identified_vehicle_purchase.primary_salesperson_first_name |       0.78 |
| queried_by_athena     | sonic_mdp_athena_query_db_np.processed_vehicle_acquisition    | AwsDataCatalog.sonic_mdp_athena_query_db_np.processed_vehicle_acquisition               |       0.72 |
| has_column            | sonic_mdp_athena_query_db_np.processed_vehicle_purchase       | sonic_mdp_athena_query_db_np.processed_vehicle_purchase.dealership_org_id               |       0.78 |
| queried_by_athena     | default.elead_individual                                      | AwsDataCatalog.default.elead_individual                                                 |       0.72 |
| has_column            | sonic_mdp_athena_query_db_np.raw_dms_individual               | sonic_mdp_athena_query_db_np.raw_dms_individual.dnchomephonesag                         |       0.78 |
| has_column            | default.dms_individual                                        | default.dms_individual.email5                                                           |       0.78 |
| contains              | temp-athena-db-source                                         | s3://temp-athena-db-source/raw-parquet/dms_individual                                   |       0.78 |

## Lineage Gaps

| Object | Gap  | Message |
| ------ | ---- | ------- |
| none   | none | none    |

## Delta

Mode: `full_refresh`

| Status         | Count |
| -------------- | ----: |
| new            |   709 |
| changed        |     0 |
| unchanged      |     0 |
| retained_stale |     0 |
| removed_stale  |     0 |

## AI Description Rule

Human-friendly descriptions must use only the bounded evidence packet for each object. If purpose, owner, steward, SLA, freshness, or business process is not surfaced by metadata, say that it is not surfaced in metadata. Do not infer business meaning from an AWS name alone.
