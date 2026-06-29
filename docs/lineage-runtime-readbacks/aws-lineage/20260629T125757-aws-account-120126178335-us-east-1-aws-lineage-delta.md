# Source Metadata Delta Readback

Generated: 2026-06-29T12:57:57.478Z

Connector: `aws-account-120126178335-us-east-1`

Source family: `aws`

Source scope: `aws-account:120126178335:us-east-1`

Mode: `plan_only`

Baseline: `C:/projects/Sonic-data-lineage/registry/object-registry.jsonl`

## Counts

| Status         | Count |
| -------------- | ----: |
| new            |    12 |
| changed        |     0 |
| unchanged      |     0 |
| retained_stale |     0 |
| removed_stale  |     0 |

## Non-Unchanged Objects

| Status | Canonical ID                                                                                          | Type                   | Database | Schema     | Object                                                         |
| ------ | ----------------------------------------------------------------------------------------------------- | ---------------------- | -------- | ---------- | -------------------------------------------------------------- |
| new    | aws://120126178335/us-east-1/account/120126178335                                                     | aws_account            |          |            | Northwest Motorsport - Production                              |
| new    | aws://120126178335/us-east-1/athena/catalog/AwsDataCatalog                                            | athena_data_catalog    |          | catalogs   | AwsDataCatalog                                                 |
| new    | aws://120126178335/us-east-1/athena/service                                                           | aws_athena_service     |          | athena     | athena                                                         |
| new    | aws://120126178335/us-east-1/athena/workgroup/primary                                                 | athena_workgroup       |          | workgroups | primary                                                        |
| new    | aws://120126178335/us-east-1/glue/service                                                             | aws_glue_service       |          | glue       | glue                                                           |
| new    | aws://120126178335/us-east-1/quicksight/service                                                       | aws_quicksight_service |          | quicksight | quicksight                                                     |
| new    | aws://120126178335/us-east-1/s3/bucket/ami.nwmsrocks.com                                              | s3_bucket              |          |            | ami.nwmsrocks.com                                              |
| new    | aws://120126178335/us-east-1/s3/bucket/aws-glue-assets-120126178335-us-west-2                         | s3_bucket              |          |            | aws-glue-assets-120126178335-us-west-2                         |
| new    | aws://120126178335/us-east-1/s3/bucket/beanstalkstatus-producti-serverlessdeploymentbuck-omyc7kvf25dl | s3_bucket              |          |            | beanstalkstatus-producti-serverlessdeploymentbuck-omyc7kvf25dl |
| new    | aws://120126178335/us-east-1/s3/bucket/blog.nwmsrocks.com                                             | s3_bucket              |          |            | blog.nwmsrocks.com                                             |
| new    | aws://120126178335/us-east-1/s3/bucket/build-inventory-before.nwmsrocks.com                           | s3_bucket              |          |            | build-inventory-before.nwmsrocks.com                           |
| new    | aws://120126178335/us-east-1/s3/service                                                               | aws_s3_service         |          | s3         | s3                                                             |

## Downstream Rule

AI summarization, DevOps writes, runtime package object updates, Rovo artifacts, support docs, and Confluence dry-runs/live publishes must process only `new` and `changed` objects plus directly impacted index/shard pages unless a scoped full refresh is approved.
