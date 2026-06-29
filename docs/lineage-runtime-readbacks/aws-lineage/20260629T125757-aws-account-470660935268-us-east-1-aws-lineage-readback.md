# AWS Lineage Ingestion Readback

Generated: 2026-06-29T12:57:57.478Z

Source scope: `aws-account:470660935268:us-east-1`

Lineage connector id: `aws-account-470660935268-us-east-1`

Source connectors: `aws-athena-sonic-np-mdp`, `aws-glue-sonic-np-mdp`, `aws-s3-sonic-np-mdp`

## Summary

| Signal  | Count |
| ------- | ----: |
| Objects |   180 |
| Edges   |   187 |
| Gaps    |     0 |

## Objects By Type

| Type                | Count |
| ------------------- | ----: |
| athena_data_catalog |     1 |
| athena_database     |     2 |
| athena_table        |     4 |
| athena_workgroup    |     3 |
| aws_account         |     1 |
| aws_athena_service  |     1 |
| aws_glue_service    |     1 |
| aws_s3_service      |     1 |
| glue_column         |   150 |
| glue_database       |     2 |
| glue_table          |     4 |
| s3_bucket           |     6 |
| s3_prefix           |     4 |

## Edge Sample

| Relationship          | From                                                    | To                                                          | Confidence |
| --------------------- | ------------------------------------------------------- | ----------------------------------------------------------- | ---------: |
| contains              | AwsDataCatalog.default                                  | AwsDataCatalog.default.dms_individual                       |       0.78 |
| has_column            | default.dms_individual                                  | default.dms_individual.cellular                             |       0.78 |
| has_column            | default.dms_individual                                  | default.dms_individual.blockdatashare                       |       0.78 |
| has_column            | default.elead_individual                                | default.elead_individual.bdonotemail                        |       0.78 |
| has_column            | default.dms_individual                                  | default.dms_individual.blockemail                           |       0.78 |
| queried_by_athena     | default.elead_individual                                | AwsDataCatalog.default.elead_individual                     |       0.72 |
| has_column            | default.dms_individual                                  | default.dms_individual.email5                               |       0.78 |
| contains              | temp-athena-db-source                                   | s3://temp-athena-db-source/raw-parquet/dms_individual       |       0.78 |
| contains              | AwsDataCatalog.default                                  | AwsDataCatalog.default.dms_purchase_info                    |       0.78 |
| has_column            | default.dms_purchase_info                               | default.dms_purchase_info.trade2vin                         |       0.78 |
| has_column            | default.elead_sales_activity                            | default.elead_sales_activity.orgid                          |       0.78 |
| contains              | temp-athena-db-source                                   | s3://temp-athena-db-source/raw-parquet/elead_sales_activity |       0.78 |
| storage_registered_by | s3://temp-athena-db-source/raw-parquet/elead_individual | default.elead_individual                                    |       0.78 |
| has_column            | default.dms_purchase_info                               | default.dms_purchase_info.customer_first_name               |       0.78 |
| has_column            | default.dms_purchase_info                               | default.dms_purchase_info.cashdown                          |       0.78 |
| has_column            | default.elead_sales_activity                            | default.elead_sales_activity.salespersonfirstname           |       0.78 |
| has_column            | default.dms_purchase_info                               | default.dms_purchase_info.orgname                           |       0.78 |
| has_column            | default.dms_individual                                  | default.dms_individual.dnccellphoneftc                      |       0.78 |
| has_column            | default.dms_individual                                  | default.dms_individual.lastname                             |       0.78 |
| has_column            | default.dms_purchase_info                               | default.dms_purchase_info.year                              |       0.78 |
| has_column            | default.dms_purchase_info                               | default.dms_purchase_info.rowlastupdated                    |       0.78 |
| has_column            | default.elead_sales_activity                            | default.elead_sales_activity.completedfirstname             |       0.78 |
| has_column            | default.dms_individual                                  | default.dms_individual.email                                |       0.78 |
| has_column            | default.elead_sales_activity                            | default.elead_sales_activity.creatorfirstname               |       0.78 |
| contains              | AWS Glue Data Catalog - svc_np_mdp                      | sonic_mdp_athena_query_db_np                                |       0.78 |
| has_column            | default.elead_sales_activity                            | default.elead_sales_activity.groupmembername                |       0.78 |
| has_column            | default.dms_individual                                  | default.dms_individual.email3                               |       0.78 |
| has_column            | default.elead_sales_activity                            | default.elead_sales_activity.szlegacydealid                 |       0.78 |
| has_column            | default.dms_purchase_info                               | default.dms_purchase_info.trade2model                       |       0.78 |
| contains              | AwsDataCatalog.default                                  | AwsDataCatalog.default.elead_sales_activity                 |       0.78 |

## Lineage Gaps

| Object | Gap  | Message |
| ------ | ---- | ------- |
| none   | none | none    |

## Delta

Mode: `plan_only`

| Status         | Count |
| -------------- | ----: |
| new            |   180 |
| changed        |     0 |
| unchanged      |     0 |
| retained_stale |     0 |
| removed_stale  |     0 |

## AI Description Rule

Human-friendly descriptions must use only the bounded evidence packet for each object. If purpose, owner, steward, SLA, freshness, or business process is not surfaced by metadata, say that it is not surfaced in metadata. Do not infer business meaning from an AWS name alone.
