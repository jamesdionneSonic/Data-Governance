# AWS Lineage Ingestion Readback

Generated: 2026-06-29T12:57:57.478Z

Source scope: `aws-account:118570350539:us-east-1`

Lineage connector id: `aws-account-118570350539-us-east-1`

Source connectors: `aws-athena-sonic-prd-mdp`, `aws-glue-sonic-prd-mdp`, `aws-s3-sonic-prd-mdp`

## Summary

| Signal  | Count |
| ------- | ----: |
| Objects |    16 |
| Edges   |    16 |
| Gaps    |     0 |

## Objects By Type

| Type                | Count |
| ------------------- | ----: |
| athena_data_catalog |     1 |
| athena_database     |     2 |
| athena_workgroup    |     2 |
| aws_account         |     1 |
| aws_athena_service  |     1 |
| aws_glue_service    |     1 |
| aws_s3_service      |     1 |
| glue_database       |     2 |
| s3_bucket           |     5 |

## Edge Sample

| Relationship                    | From                                | To                                            | Confidence |
| ------------------------------- | ----------------------------------- | --------------------------------------------- | ---------: |
| contains                        | Amazon S3 - svc_prd_mdp             | sonic-dealership-tf-state-prod                |       0.78 |
| contains                        | svc_prd_mdp                         | Amazon Athena - svc_prd_mdp                   |       0.95 |
| contains                        | Amazon S3 - svc_prd_mdp             | sonic-mdp-data-dump-prod                      |       0.78 |
| contains                        | Amazon S3 - svc_prd_mdp             | dealership-ui-prod-118570350539               |       0.78 |
| contains                        | AWS Glue Data Catalog - svc_prd_mdp | default                                       |       0.78 |
| contains                        | svc_prd_mdp                         | Amazon S3 - svc_prd_mdp                       |       0.95 |
| contains                        | Amazon Athena - svc_prd_mdp         | primary                                       |       0.78 |
| contains                        | AwsDataCatalog                      | AwsDataCatalog.default                        |       0.78 |
| contains                        | Amazon Athena - svc_prd_mdp         | sonic-mdp-workgroup-prod                      |       0.78 |
| metadata_catalog_used_by_athena | AWS Glue Data Catalog - svc_prd_mdp | AwsDataCatalog                                |       0.72 |
| contains                        | Amazon S3 - svc_prd_mdp             | sonic-mdp-athena-query-bucket-prod            |       0.78 |
| contains                        | Amazon S3 - svc_prd_mdp             | sonic-mdp-artifacts-prod                      |       0.78 |
| contains                        | svc_prd_mdp                         | AWS Glue Data Catalog - svc_prd_mdp           |       0.95 |
| contains                        | AWS Glue Data Catalog - svc_prd_mdp | sonic_mdp_athena_query_db_prod                |       0.78 |
| contains                        | Amazon Athena - svc_prd_mdp         | AwsDataCatalog                                |       0.78 |
| contains                        | AwsDataCatalog                      | AwsDataCatalog.sonic_mdp_athena_query_db_prod |       0.78 |

## Lineage Gaps

| Object | Gap  | Message |
| ------ | ---- | ------- |
| none   | none | none    |

## Delta

Mode: `plan_only`

| Status         | Count |
| -------------- | ----: |
| new            |    16 |
| changed        |     0 |
| unchanged      |     0 |
| retained_stale |     0 |
| removed_stale  |     0 |

## AI Description Rule

Human-friendly descriptions must use only the bounded evidence packet for each object. If purpose, owner, steward, SLA, freshness, or business process is not surfaced by metadata, say that it is not surfaced in metadata. Do not infer business meaning from an AWS name alone.
