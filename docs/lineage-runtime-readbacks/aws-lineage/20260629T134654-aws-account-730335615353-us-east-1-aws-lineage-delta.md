# Source Metadata Delta Readback

Generated: 2026-06-29T13:46:54.573Z

Connector: `aws-account-730335615353-us-east-1`

Source family: `aws`

Source scope: `aws-account:730335615353:us-east-1`

Mode: `full_refresh`

Full refresh reason: MDP production AWS full ingestion and publication requested 2026-06-29

Baseline: `C:/projects/Sonic-data-lineage/registry/object-registry.jsonl`

## Counts

| Status         | Count |
| -------------- | ----: |
| new            |    22 |
| changed        |     0 |
| unchanged      |     0 |
| retained_stale |     0 |
| removed_stale  |     0 |

## Non-Unchanged Objects

| Status | Canonical ID                                                                                    | Type                | Database | Schema     | Object                                                   |
| ------ | ----------------------------------------------------------------------------------------------- | ------------------- | -------- | ---------- | -------------------------------------------------------- |
| new    | aws://730335615353/us-east-1/account/730335615353                                               | aws_account         |          |            | SVC_Sandbox_MDP                                          |
| new    | aws://730335615353/us-east-1/athena/catalog/AwsDataCatalog                                      | athena_data_catalog |          | catalogs   | AwsDataCatalog                                           |
| new    | aws://730335615353/us-east-1/athena/service                                                     | aws_athena_service  |          | athena     | athena                                                   |
| new    | aws://730335615353/us-east-1/athena/workgroup/primary                                           | athena_workgroup    |          | workgroups | primary                                                  |
| new    | aws://730335615353/us-east-1/glue/service                                                       | aws_glue_service    |          | glue       | glue                                                     |
| new    | aws://730335615353/us-east-1/s3/bucket/acq-listingsingestion-bucket                             | s3_bucket           |          |            | acq-listingsingestion-bucket                             |
| new    | aws://730335615353/us-east-1/s3/bucket/acq-openlane-files-temp-holder                           | s3_bucket           |          |            | acq-openlane-files-temp-holder                           |
| new    | aws://730335615353/us-east-1/s3/bucket/andrei-sandbox-eus1-andreicreditapp-codedeploy-bucket    | s3_bucket           |          |            | andrei-sandbox-eus1-andreicreditapp-codedeploy-bucket    |
| new    | aws://730335615353/us-east-1/s3/bucket/ciaran-ciaran-eus1-apiinteg-codedeploy-bucket            | s3_bucket           |          |            | ciaran-ciaran-eus1-apiinteg-codedeploy-bucket            |
| new    | aws://730335615353/us-east-1/s3/bucket/ciaran-ciaran-eus1-xmas-codedeploy-bucket                | s3_bucket           |          |            | ciaran-ciaran-eus1-xmas-codedeploy-bucket                |
| new    | aws://730335615353/us-east-1/s3/bucket/devcreditapp-sandbox-eus1-creditapp-codedeploy-bucket    | s3_bucket           |          |            | devcreditapp-sandbox-eus1-creditapp-codedeploy-bucket    |
| new    | aws://730335615353/us-east-1/s3/bucket/gabe-poc-s3                                              | s3_bucket           |          |            | gabe-poc-s3                                              |
| new    | aws://730335615353/us-east-1/s3/bucket/sonic-mdp-test-s3bucket-edemir                           | s3_bucket           |          |            | sonic-mdp-test-s3bucket-edemir                           |
| new    | aws://730335615353/us-east-1/s3/bucket/sonic-mdp-tf-state-sbx                                   | s3_bucket           |          |            | sonic-mdp-tf-state-sbx                                   |
| new    | aws://730335615353/us-east-1/s3/bucket/sonic-sbx-eus1-deleteme-codedeploy-bucket                | s3_bucket           |          |            | sonic-sbx-eus1-deleteme-codedeploy-bucket                |
| new    | aws://730335615353/us-east-1/s3/bucket/sonic-sbx-eus1-eventtracingelasticsrch-codedeploy-bucket | s3_bucket           |          |            | sonic-sbx-eus1-eventtracingelasticsrch-codedeploy-bucket |
| new    | aws://730335615353/us-east-1/s3/bucket/sonic-sbx-eus1-holidays-codedeploy-bucket                | s3_bucket           |          |            | sonic-sbx-eus1-holidays-codedeploy-bucket                |
| new    | aws://730335615353/us-east-1/s3/bucket/sonic-sbx-eus1-vipsharedinfra-test-bucket-s3             | s3_bucket           |          |            | sonic-sbx-eus1-vipsharedinfra-test-bucket-s3             |
| new    | aws://730335615353/us-east-1/s3/bucket/test-edemir                                              | s3_bucket           |          |            | test-edemir                                              |
| new    | aws://730335615353/us-east-1/s3/bucket/tsc-lambda-bucket                                        | s3_bucket           |          |            | tsc-lambda-bucket                                        |
| new    | aws://730335615353/us-east-1/s3/bucket/vas-vasdev-eus1-testproj-codedeploy-bucket               | s3_bucket           |          |            | vas-vasdev-eus1-testproj-codedeploy-bucket               |
| new    | aws://730335615353/us-east-1/s3/service                                                         | aws_s3_service      |          | s3         | s3                                                       |

## Downstream Rule

AI summarization, DevOps writes, runtime package object updates, Rovo artifacts, support docs, and Confluence dry-runs/live publishes must process only `new` and `changed` objects plus directly impacted index/shard pages unless a scoped full refresh is approved.
