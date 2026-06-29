# AWS Lineage Ingestion Readback

Generated: 2026-06-29T12:57:57.478Z

Source scope: `aws-account:499876093606:us-east-1`

Lineage connector id: `aws-account-499876093606-us-east-1`

Source connectors: `aws-athena-sonic-dev-mdp`, `aws-glue-sonic-dev-mdp`, `aws-s3-sonic-dev-mdp`

## Summary

| Signal  | Count |
| ------- | ----: |
| Objects |    25 |
| Edges   |    25 |
| Gaps    |     0 |

## Objects By Type

| Type                | Count |
| ------------------- | ----: |
| athena_data_catalog |     1 |
| athena_database     |     5 |
| athena_workgroup    |     5 |
| aws_account         |     1 |
| aws_athena_service  |     1 |
| aws_glue_service    |     1 |
| aws_s3_service      |     1 |
| glue_database       |     5 |
| s3_bucket           |     5 |

## Edge Sample

| Relationship                    | From                                | To                                                  | Confidence |
| ------------------------------- | ----------------------------------- | --------------------------------------------------- | ---------: |
| contains                        | AWS Glue Data Catalog - svc_dev_mdp | sonic_mdp_athena_query_db_ankur                     |       0.78 |
| contains                        | svc_dev_mdp                         | Amazon S3 - svc_dev_mdp                             |       0.95 |
| contains                        | Amazon Athena - svc_dev_mdp         | sonic-mdp-workgroup-ankur                           |       0.78 |
| contains                        | svc_dev_mdp                         | AWS Glue Data Catalog - svc_dev_mdp                 |       0.95 |
| contains                        | Amazon Athena - svc_dev_mdp         | primary                                             |       0.78 |
| contains                        | AWS Glue Data Catalog - svc_dev_mdp | sonic_mdp_athena_query_db_ciarangg                  |       0.78 |
| contains                        | Amazon Athena - svc_dev_mdp         | sonic-mdp-workgroup-corynivens                      |       0.78 |
| contains                        | AWS Glue Data Catalog - svc_dev_mdp | sonic_mdp_athena_query_db_ashish                    |       0.78 |
| contains                        | AwsDataCatalog                      | AwsDataCatalog.default                              |       0.78 |
| contains                        | Amazon Athena - svc_dev_mdp         | AwsDataCatalog                                      |       0.78 |
| metadata_catalog_used_by_athena | AWS Glue Data Catalog - svc_dev_mdp | AwsDataCatalog                                      |       0.72 |
| contains                        | svc_dev_mdp                         | Amazon Athena - svc_dev_mdp                         |       0.95 |
| contains                        | AwsDataCatalog                      | AwsDataCatalog.sonic_mdp_athena_query_db_ankur      |       0.78 |
| contains                        | AwsDataCatalog                      | AwsDataCatalog.sonic_mdp_athena_query_db_ashish     |       0.78 |
| contains                        | Amazon S3 - svc_dev_mdp             | dealership-ui-dev-499876093606                      |       0.78 |
| contains                        | Amazon S3 - svc_dev_mdp             | photo-review-viewer-dev-499876093606                |       0.78 |
| contains                        | Amazon S3 - svc_dev_mdp             | cf-templates-fnbje2phr39m-us-east-1                 |       0.78 |
| contains                        | AwsDataCatalog                      | AwsDataCatalog.sonic_mdp_athena_query_db_ciarangg   |       0.78 |
| contains                        | Amazon S3 - svc_dev_mdp             | sat2-prowlerfindingsbucket-umcnbti60w6d             |       0.78 |
| contains                        | Amazon Athena - svc_dev_mdp         | sonic-mdp-workgroup-ciarangg                        |       0.78 |
| contains                        | AwsDataCatalog                      | AwsDataCatalog.sonic_mdp_athena_query_db_corynivens |       0.78 |
| contains                        | AWS Glue Data Catalog - svc_dev_mdp | default                                             |       0.78 |
| contains                        | Amazon S3 - svc_dev_mdp             | mulesoft-adesa-listings-bucket-test1                |       0.78 |
| contains                        | AWS Glue Data Catalog - svc_dev_mdp | sonic_mdp_athena_query_db_corynivens                |       0.78 |
| contains                        | Amazon Athena - svc_dev_mdp         | sonic-mdp-workgroup-ashish                          |       0.78 |

## Lineage Gaps

| Object | Gap  | Message |
| ------ | ---- | ------- |
| none   | none | none    |

## Delta

Mode: `plan_only`

| Status         | Count |
| -------------- | ----: |
| new            |    25 |
| changed        |     0 |
| unchanged      |     0 |
| retained_stale |     0 |
| removed_stale  |     0 |

## AI Description Rule

Human-friendly descriptions must use only the bounded evidence packet for each object. If purpose, owner, steward, SLA, freshness, or business process is not surfaced by metadata, say that it is not surfaced in metadata. Do not infer business meaning from an AWS name alone.
