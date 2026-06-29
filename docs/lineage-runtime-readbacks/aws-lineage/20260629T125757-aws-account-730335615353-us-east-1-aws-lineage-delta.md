# Source Metadata Delta Readback

Generated: 2026-06-29T12:57:57.478Z

Connector: `aws-account-730335615353-us-east-1`

Source family: `aws`

Source scope: `aws-account:730335615353:us-east-1`

Mode: `plan_only`

Baseline: `C:/projects/Sonic-data-lineage/registry/object-registry.jsonl`

## Counts

| Status         | Count |
| -------------- | ----: |
| new            |    11 |
| changed        |     0 |
| unchanged      |     0 |
| retained_stale |     0 |
| removed_stale  |     0 |

## Non-Unchanged Objects

| Status | Canonical ID                                                                                 | Type                | Database | Schema     | Object                                                |
| ------ | -------------------------------------------------------------------------------------------- | ------------------- | -------- | ---------- | ----------------------------------------------------- |
| new    | aws://730335615353/us-east-1/account/730335615353                                            | aws_account         |          |            | SVC_Sandbox_MDP                                       |
| new    | aws://730335615353/us-east-1/athena/catalog/AwsDataCatalog                                   | athena_data_catalog |          | catalogs   | AwsDataCatalog                                        |
| new    | aws://730335615353/us-east-1/athena/service                                                  | aws_athena_service  |          | athena     | athena                                                |
| new    | aws://730335615353/us-east-1/athena/workgroup/primary                                        | athena_workgroup    |          | workgroups | primary                                               |
| new    | aws://730335615353/us-east-1/glue/service                                                    | aws_glue_service    |          | glue       | glue                                                  |
| new    | aws://730335615353/us-east-1/s3/bucket/acq-listingsingestion-bucket                          | s3_bucket           |          |            | acq-listingsingestion-bucket                          |
| new    | aws://730335615353/us-east-1/s3/bucket/acq-openlane-files-temp-holder                        | s3_bucket           |          |            | acq-openlane-files-temp-holder                        |
| new    | aws://730335615353/us-east-1/s3/bucket/andrei-sandbox-eus1-andreicreditapp-codedeploy-bucket | s3_bucket           |          |            | andrei-sandbox-eus1-andreicreditapp-codedeploy-bucket |
| new    | aws://730335615353/us-east-1/s3/bucket/ciaran-ciaran-eus1-apiinteg-codedeploy-bucket         | s3_bucket           |          |            | ciaran-ciaran-eus1-apiinteg-codedeploy-bucket         |
| new    | aws://730335615353/us-east-1/s3/bucket/ciaran-ciaran-eus1-xmas-codedeploy-bucket             | s3_bucket           |          |            | ciaran-ciaran-eus1-xmas-codedeploy-bucket             |
| new    | aws://730335615353/us-east-1/s3/service                                                      | aws_s3_service      |          | s3         | s3                                                    |

## Downstream Rule

AI summarization, DevOps writes, runtime package object updates, Rovo artifacts, support docs, and Confluence dry-runs/live publishes must process only `new` and `changed` objects plus directly impacted index/shard pages unless a scoped full refresh is approved.
