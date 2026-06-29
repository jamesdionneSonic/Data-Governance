# AWS Lineage Ingestion Readback

Generated: 2026-06-29T13:45:54.801Z

Source scope: `aws-account:120126178335:us-east-1`

Lineage connector id: `aws-account-120126178335-us-east-1`

Source connectors: `aws-athena-northwest-motorsport-prod`, `aws-glue-northwest-motorsport-prod`, `aws-quicksight-northwest-motorsport-prod`, `aws-s3-northwest-motorsport-prod`

## Product Routing

Primary product area: `MDP`

| Product Area | Objects |
| ------------ | ------: |
| MDP          |       5 |

Human catalog roots:

- Sonic Data Lineage / Data Product Catalog / MDP / MDP AWS Lineage Context

## Summary

| Signal  | Count |
| ------- | ----: |
| Objects |     5 |
| Edges   |     4 |
| Gaps    |     0 |

## Objects By Type

| Type                   | Count |
| ---------------------- | ----: |
| aws_account            |     1 |
| aws_athena_service     |     1 |
| aws_glue_service       |     1 |
| aws_quicksight_service |     1 |
| aws_s3_service         |     1 |

## Edge Sample

| Relationship | From                              | To                                                        | Confidence |
| ------------ | --------------------------------- | --------------------------------------------------------- | ---------: |
| contains     | Northwest Motorsport - Production | Amazon S3 - Northwest Motorsport - Production             |       0.95 |
| contains     | Northwest Motorsport - Production | Amazon QuickSight - Northwest Motorsport - Production     |       0.95 |
| contains     | Northwest Motorsport - Production | AWS Glue Data Catalog - Northwest Motorsport - Production |       0.95 |
| contains     | Northwest Motorsport - Production | Amazon Athena - Northwest Motorsport - Production         |       0.95 |

## Lineage Gaps

| Object | Gap  | Message |
| ------ | ---- | ------- |
| none   | none | none    |

## Delta

Mode: `full_refresh`

| Status         | Count |
| -------------- | ----: |
| new            |     5 |
| changed        |     0 |
| unchanged      |     0 |
| retained_stale |     0 |
| removed_stale  |     0 |

## AI Description Rule

Human-friendly descriptions must use only the bounded evidence packet for each object. If purpose, owner, steward, SLA, freshness, or business process is not surfaced by metadata, say that it is not surfaced in metadata. Do not infer business meaning from an AWS name alone.
