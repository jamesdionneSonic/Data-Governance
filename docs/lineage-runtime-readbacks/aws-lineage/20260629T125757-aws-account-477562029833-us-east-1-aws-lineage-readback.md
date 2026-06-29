# AWS Lineage Ingestion Readback

Generated: 2026-06-29T12:57:57.478Z

Source scope: `aws-account:477562029833:us-east-1`

Lineage connector id: `aws-account-477562029833-us-east-1`

Source connectors: `aws-athena-sonic-pp-mdp`, `aws-glue-sonic-pp-mdp`, `aws-s3-sonic-pp-mdp`

## Summary

| Signal  | Count |
| ------- | ----: |
| Objects |   225 |
| Edges   |   234 |
| Gaps    |     0 |

## Objects By Type

| Type                | Count |
| ------------------- | ----: |
| athena_data_catalog |     1 |
| athena_database     |     2 |
| athena_table        |     5 |
| athena_workgroup    |     4 |
| aws_account         |     1 |
| aws_athena_service  |     1 |
| aws_glue_service    |     1 |
| aws_s3_service      |     1 |
| glue_column         |   192 |
| glue_database       |     2 |
| glue_table          |     5 |
| s3_bucket           |     6 |
| s3_prefix           |     4 |

## Edge Sample

| Relationship          | From                                                          | To                                                                      | Confidence |
| --------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------: |
| has_column            | default.elead_sales_activity                                  | default.elead_sales_activity.ltaskitemid                                |       0.78 |
| has_column            | default.elead_sales_activity                                  | default.elead_sales_activity.orgname                                    |       0.78 |
| has_column            | default.dms_individual                                        | default.dms_individual.custno                                           |       0.78 |
| has_column            | default.elead_individual                                      | default.elead_individual.szzip                                          |       0.78 |
| storage_registered_by | s3://sonic-mdp-athena-db-source-pp/raw-parquet/dms_individual | default.dms_individual                                                  |       0.78 |
| has_column            | default.dms_individual_2                                      | default.dms_individual_2.country                                        |       0.78 |
| has_column            | default.dms_individual                                        | default.dms_individual.groupmemberid                                    |       0.78 |
| has_column            | default.elead_sales_activity                                  | default.elead_sales_activity.groupmembername                            |       0.78 |
| has_column            | default.dms_purchase_info                                     | default.dms_purchase_info.salesperson1                                  |       0.78 |
| contains              | Amazon Athena - svc_pp_mdp                                    | mdp                                                                     |       0.78 |
| has_column            | default.dms_purchase_info                                     | default.dms_purchase_info.cashprice                                     |       0.78 |
| has_column            | default.elead_sales_activity                                  | default.elead_sales_activity.activitysubsource                          |       0.78 |
| contains              | sonic-mdp-athena-db-source-pp                                 | s3://sonic-mdp-athena-db-source-pp/raw-parquet/dms_purchase_information |       0.78 |
| has_column            | default.dms_individual                                        | default.dms_individual.dncworkphonedma                                  |       0.78 |
| has_column            | default.elead_sales_activity                                  | default.elead_sales_activity.completedlastname                          |       0.78 |
| has_column            | default.dms_purchase_info                                     | default.dms_purchase_info.salesperson_last_name                         |       0.78 |
| contains              | default                                                       | default.elead_sales_activity                                            |       0.78 |
| has_column            | default.elead_individual                                      | default.elead_individual.bprimary                                       |       0.78 |
| has_column            | default.dms_individual                                        | default.dms_individual.homephone                                        |       0.78 |
| has_column            | default.dms_individual                                        | default.dms_individual.deletedataflag                                   |       0.78 |
| has_column            | default.elead_sales_activity                                  | default.elead_sales_activity.szaddress                                  |       0.78 |
| has_column            | default.dms_individual                                        | default.dms_individual.email3                                           |       0.78 |
| has_column            | default.dms_individual                                        | default.dms_individual.dncworkphonesag                                  |       0.78 |
| has_column            | default.dms_purchase_info                                     | default.dms_purchase_info.trade2year                                    |       0.78 |
| has_column            | default.dms_purchase_info                                     | default.dms_purchase_info.modelname                                     |       0.78 |
| has_column            | default.dms_individual                                        | default.dms_individual.firstname                                        |       0.78 |
| has_column            | default.elead_sales_activity                                  | default.elead_sales_activity.szdealsubstatus                            |       0.78 |
| has_column            | default.dms_individual_2                                      | default.dms_individual_2.blockemail                                     |       0.78 |
| contains              | AwsDataCatalog.default                                        | AwsDataCatalog.default.elead_individual                                 |       0.78 |
| has_column            | default.dms_individual_2                                      | default.dms_individual_2.optoutflag                                     |       0.78 |

## Lineage Gaps

| Object | Gap  | Message |
| ------ | ---- | ------- |
| none   | none | none    |

## Delta

Mode: `plan_only`

| Status         | Count |
| -------------- | ----: |
| new            |   225 |
| changed        |     0 |
| unchanged      |     0 |
| retained_stale |     0 |
| removed_stale  |     0 |

## AI Description Rule

Human-friendly descriptions must use only the bounded evidence packet for each object. If purpose, owner, steward, SLA, freshness, or business process is not surfaced by metadata, say that it is not surfaced in metadata. Do not infer business meaning from an AWS name alone.
