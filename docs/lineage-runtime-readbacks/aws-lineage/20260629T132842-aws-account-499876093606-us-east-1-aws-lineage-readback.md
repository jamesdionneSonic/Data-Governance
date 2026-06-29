# AWS Lineage Ingestion Readback

Generated: 2026-06-29T13:28:42.756Z

Source scope: `aws-account:499876093606:us-east-1`

Lineage connector id: `aws-account-499876093606-us-east-1`

Source connectors: `aws-athena-sonic-dev-mdp`, `aws-glue-sonic-dev-mdp`, `aws-s3-sonic-dev-mdp`

## Product Routing

Primary product area: `MDP`

| Product Area | Objects |
| ------------ | ------: |
| MDP          |       4 |

Human catalog roots:

- Sonic Data Lineage / Data Product Catalog / MDP / MDP AWS Lineage Context

## Summary

| Signal  | Count |
| ------- | ----: |
| Objects |     4 |
| Edges   |     3 |
| Gaps    |     0 |

## Objects By Type

| Type               | Count |
| ------------------ | ----: |
| aws_account        |     1 |
| aws_athena_service |     1 |
| aws_glue_service   |     1 |
| aws_s3_service     |     1 |

## Edge Sample

| Relationship | From        | To                                  | Confidence |
| ------------ | ----------- | ----------------------------------- | ---------: |
| contains     | svc_dev_mdp | Amazon S3 - svc_dev_mdp             |       0.95 |
| contains     | svc_dev_mdp | AWS Glue Data Catalog - svc_dev_mdp |       0.95 |
| contains     | svc_dev_mdp | Amazon Athena - svc_dev_mdp         |       0.95 |

## Lineage Gaps

| Object | Gap  | Message |
| ------ | ---- | ------- |
| none   | none | none    |

## Delta

Mode: `plan_only`

| Status         | Count |
| -------------- | ----: |
| new            |     4 |
| changed        |     0 |
| unchanged      |     0 |
| retained_stale |     0 |
| removed_stale  |     0 |

## AI Description Rule

Human-friendly descriptions must use only the bounded evidence packet for each object. If purpose, owner, steward, SLA, freshness, or business process is not surfaced by metadata, say that it is not surfaced in metadata. Do not infer business meaning from an AWS name alone.
