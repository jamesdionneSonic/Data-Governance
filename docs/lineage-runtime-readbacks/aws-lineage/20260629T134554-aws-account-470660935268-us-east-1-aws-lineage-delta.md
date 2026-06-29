# Source Metadata Delta Readback

Generated: 2026-06-29T13:45:54.801Z

Connector: `aws-account-470660935268-us-east-1`

Source family: `aws`

Source scope: `aws-account:470660935268:us-east-1`

Mode: `full_refresh`

Full refresh reason: MDP production AWS full ingestion and publication requested 2026-06-29

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

| Status | Canonical ID                                      | Type               | Database | Schema | Object     |
| ------ | ------------------------------------------------- | ------------------ | -------- | ------ | ---------- |
| new    | aws://470660935268/us-east-1/account/470660935268 | aws_account        |          |        | svc_np_mdp |
| new    | aws://470660935268/us-east-1/athena/service       | aws_athena_service |          | athena | athena     |
| new    | aws://470660935268/us-east-1/glue/service         | aws_glue_service   |          | glue   | glue       |
| new    | aws://470660935268/us-east-1/s3/service           | aws_s3_service     |          | s3     | s3         |

## Downstream Rule

AI summarization, DevOps writes, runtime package object updates, Rovo artifacts, support docs, and Confluence dry-runs/live publishes must process only `new` and `changed` objects plus directly impacted index/shard pages unless a scoped full refresh is approved.
