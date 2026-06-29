# Source Metadata Delta Readback

Generated: 2026-06-29T13:28:42.756Z

Connector: `aws-account-118570350539-us-east-1`

Source family: `aws`

Source scope: `aws-account:118570350539:us-east-1`

Mode: `plan_only`

Baseline: `C:/projects/Sonic-data-lineage/registry/object-registry.jsonl`

## Counts

| Status         | Count |
| -------------- | ----: |
| new            |     4 |
| changed        |     0 |
| unchanged      |     0 |
| retained_stale |     0 |
| removed_stale  |     0 |

## Non-Unchanged Objects

| Status | Canonical ID                                      | Type               | Database | Schema | Object      |
| ------ | ------------------------------------------------- | ------------------ | -------- | ------ | ----------- |
| new    | aws://118570350539/us-east-1/account/118570350539 | aws_account        |          |        | svc_prd_mdp |
| new    | aws://118570350539/us-east-1/athena/service       | aws_athena_service |          | athena | athena      |
| new    | aws://118570350539/us-east-1/glue/service         | aws_glue_service   |          | glue   | glue        |
| new    | aws://118570350539/us-east-1/s3/service           | aws_s3_service     |          | s3     | s3          |

## Downstream Rule

AI summarization, DevOps writes, runtime package object updates, Rovo artifacts, support docs, and Confluence dry-runs/live publishes must process only `new` and `changed` objects plus directly impacted index/shard pages unless a scoped full refresh is approved.
