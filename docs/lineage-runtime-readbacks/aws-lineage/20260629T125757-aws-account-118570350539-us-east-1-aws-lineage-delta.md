# Source Metadata Delta Readback

Generated: 2026-06-29T12:57:57.478Z

Connector: `aws-account-118570350539-us-east-1`

Source family: `aws`

Source scope: `aws-account:118570350539:us-east-1`

Mode: `plan_only`

Baseline: `C:/projects/Sonic-data-lineage/registry/object-registry.jsonl`

## Counts

| Status         | Count |
| -------------- | ----: |
| new            |    16 |
| changed        |     0 |
| unchanged      |     0 |
| retained_stale |     0 |
| removed_stale  |     0 |

## Non-Unchanged Objects

| Status | Canonical ID                                                                               | Type                | Database                       | Schema         | Object                             |
| ------ | ------------------------------------------------------------------------------------------ | ------------------- | ------------------------------ | -------------- | ---------------------------------- |
| new    | aws://118570350539/us-east-1/account/118570350539                                          | aws_account         |                                |                | svc_prd_mdp                        |
| new    | aws://118570350539/us-east-1/athena/catalog/AwsDataCatalog                                 | athena_data_catalog |                                | catalogs       | AwsDataCatalog                     |
| new    | aws://118570350539/us-east-1/athena/database/AwsDataCatalog/default                        | athena_database     | default                        | AwsDataCatalog | default                            |
| new    | aws://118570350539/us-east-1/athena/database/AwsDataCatalog/sonic_mdp_athena_query_db_prod | athena_database     | sonic_mdp_athena_query_db_prod | AwsDataCatalog | sonic_mdp_athena_query_db_prod     |
| new    | aws://118570350539/us-east-1/athena/service                                                | aws_athena_service  |                                | athena         | athena                             |
| new    | aws://118570350539/us-east-1/athena/workgroup/primary                                      | athena_workgroup    |                                | workgroups     | primary                            |
| new    | aws://118570350539/us-east-1/athena/workgroup/sonic-mdp-workgroup-prod                     | athena_workgroup    |                                | workgroups     | sonic-mdp-workgroup-prod           |
| new    | aws://118570350539/us-east-1/glue/database/default                                         | glue_database       | default                        | glue           | default                            |
| new    | aws://118570350539/us-east-1/glue/database/sonic_mdp_athena_query_db_prod                  | glue_database       | sonic_mdp_athena_query_db_prod | glue           | sonic_mdp_athena_query_db_prod     |
| new    | aws://118570350539/us-east-1/glue/service                                                  | aws_glue_service    |                                | glue           | glue                               |
| new    | aws://118570350539/us-east-1/s3/bucket/dealership-ui-prod-118570350539                     | s3_bucket           |                                |                | dealership-ui-prod-118570350539    |
| new    | aws://118570350539/us-east-1/s3/bucket/sonic-dealership-tf-state-prod                      | s3_bucket           |                                |                | sonic-dealership-tf-state-prod     |
| new    | aws://118570350539/us-east-1/s3/bucket/sonic-mdp-artifacts-prod                            | s3_bucket           |                                |                | sonic-mdp-artifacts-prod           |
| new    | aws://118570350539/us-east-1/s3/bucket/sonic-mdp-athena-query-bucket-prod                  | s3_bucket           |                                |                | sonic-mdp-athena-query-bucket-prod |
| new    | aws://118570350539/us-east-1/s3/bucket/sonic-mdp-data-dump-prod                            | s3_bucket           |                                |                | sonic-mdp-data-dump-prod           |
| new    | aws://118570350539/us-east-1/s3/service                                                    | aws_s3_service      |                                | s3             | s3                                 |

## Downstream Rule

AI summarization, DevOps writes, runtime package object updates, Rovo artifacts, support docs, and Confluence dry-runs/live publishes must process only `new` and `changed` objects plus directly impacted index/shard pages unless a scoped full refresh is approved.
