# Source Metadata Delta Readback

Generated: 2026-06-29T12:57:57.478Z

Connector: `aws-account-499876093606-us-east-1`

Source family: `aws`

Source scope: `aws-account:499876093606:us-east-1`

Mode: `plan_only`

Baseline: `C:/projects/Sonic-data-lineage/registry/object-registry.jsonl`

## Counts

| Status         | Count |
| -------------- | ----: |
| new            |    25 |
| changed        |     0 |
| unchanged      |     0 |
| retained_stale |     0 |
| removed_stale  |     0 |

## Non-Unchanged Objects

| Status | Canonical ID                                                                                     | Type                | Database                             | Schema         | Object                                  |
| ------ | ------------------------------------------------------------------------------------------------ | ------------------- | ------------------------------------ | -------------- | --------------------------------------- |
| new    | aws://499876093606/us-east-1/account/499876093606                                                | aws_account         |                                      |                | svc_dev_mdp                             |
| new    | aws://499876093606/us-east-1/athena/catalog/AwsDataCatalog                                       | athena_data_catalog |                                      | catalogs       | AwsDataCatalog                          |
| new    | aws://499876093606/us-east-1/athena/database/AwsDataCatalog/default                              | athena_database     | default                              | AwsDataCatalog | default                                 |
| new    | aws://499876093606/us-east-1/athena/database/AwsDataCatalog/sonic_mdp_athena_query_db_ankur      | athena_database     | sonic_mdp_athena_query_db_ankur      | AwsDataCatalog | sonic_mdp_athena_query_db_ankur         |
| new    | aws://499876093606/us-east-1/athena/database/AwsDataCatalog/sonic_mdp_athena_query_db_ashish     | athena_database     | sonic_mdp_athena_query_db_ashish     | AwsDataCatalog | sonic_mdp_athena_query_db_ashish        |
| new    | aws://499876093606/us-east-1/athena/database/AwsDataCatalog/sonic_mdp_athena_query_db_ciarangg   | athena_database     | sonic_mdp_athena_query_db_ciarangg   | AwsDataCatalog | sonic_mdp_athena_query_db_ciarangg      |
| new    | aws://499876093606/us-east-1/athena/database/AwsDataCatalog/sonic_mdp_athena_query_db_corynivens | athena_database     | sonic_mdp_athena_query_db_corynivens | AwsDataCatalog | sonic_mdp_athena_query_db_corynivens    |
| new    | aws://499876093606/us-east-1/athena/service                                                      | aws_athena_service  |                                      | athena         | athena                                  |
| new    | aws://499876093606/us-east-1/athena/workgroup/primary                                            | athena_workgroup    |                                      | workgroups     | primary                                 |
| new    | aws://499876093606/us-east-1/athena/workgroup/sonic-mdp-workgroup-ankur                          | athena_workgroup    |                                      | workgroups     | sonic-mdp-workgroup-ankur               |
| new    | aws://499876093606/us-east-1/athena/workgroup/sonic-mdp-workgroup-ashish                         | athena_workgroup    |                                      | workgroups     | sonic-mdp-workgroup-ashish              |
| new    | aws://499876093606/us-east-1/athena/workgroup/sonic-mdp-workgroup-ciarangg                       | athena_workgroup    |                                      | workgroups     | sonic-mdp-workgroup-ciarangg            |
| new    | aws://499876093606/us-east-1/athena/workgroup/sonic-mdp-workgroup-corynivens                     | athena_workgroup    |                                      | workgroups     | sonic-mdp-workgroup-corynivens          |
| new    | aws://499876093606/us-east-1/glue/database/default                                               | glue_database       | default                              | glue           | default                                 |
| new    | aws://499876093606/us-east-1/glue/database/sonic_mdp_athena_query_db_ankur                       | glue_database       | sonic_mdp_athena_query_db_ankur      | glue           | sonic_mdp_athena_query_db_ankur         |
| new    | aws://499876093606/us-east-1/glue/database/sonic_mdp_athena_query_db_ashish                      | glue_database       | sonic_mdp_athena_query_db_ashish     | glue           | sonic_mdp_athena_query_db_ashish        |
| new    | aws://499876093606/us-east-1/glue/database/sonic_mdp_athena_query_db_ciarangg                    | glue_database       | sonic_mdp_athena_query_db_ciarangg   | glue           | sonic_mdp_athena_query_db_ciarangg      |
| new    | aws://499876093606/us-east-1/glue/database/sonic_mdp_athena_query_db_corynivens                  | glue_database       | sonic_mdp_athena_query_db_corynivens | glue           | sonic_mdp_athena_query_db_corynivens    |
| new    | aws://499876093606/us-east-1/glue/service                                                        | aws_glue_service    |                                      | glue           | glue                                    |
| new    | aws://499876093606/us-east-1/s3/bucket/cf-templates-fnbje2phr39m-us-east-1                       | s3_bucket           |                                      |                | cf-templates-fnbje2phr39m-us-east-1     |
| new    | aws://499876093606/us-east-1/s3/bucket/dealership-ui-dev-499876093606                            | s3_bucket           |                                      |                | dealership-ui-dev-499876093606          |
| new    | aws://499876093606/us-east-1/s3/bucket/mulesoft-adesa-listings-bucket-test1                      | s3_bucket           |                                      |                | mulesoft-adesa-listings-bucket-test1    |
| new    | aws://499876093606/us-east-1/s3/bucket/photo-review-viewer-dev-499876093606                      | s3_bucket           |                                      |                | photo-review-viewer-dev-499876093606    |
| new    | aws://499876093606/us-east-1/s3/bucket/sat2-prowlerfindingsbucket-umcnbti60w6d                   | s3_bucket           |                                      |                | sat2-prowlerfindingsbucket-umcnbti60w6d |
| new    | aws://499876093606/us-east-1/s3/service                                                          | aws_s3_service      |                                      | s3             | s3                                      |

## Downstream Rule

AI summarization, DevOps writes, runtime package object updates, Rovo artifacts, support docs, and Confluence dry-runs/live publishes must process only `new` and `changed` objects plus directly impacted index/shard pages unless a scoped full refresh is approved.
