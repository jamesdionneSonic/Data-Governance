# AWS Lineage Ingestion Readback

Generated: 2026-06-29T13:46:54.573Z

Source scope: `aws-account:120126178335:us-east-1`

Lineage connector id: `aws-account-120126178335-us-east-1`

Source connectors: `aws-athena-northwest-motorsport-prod`, `aws-glue-northwest-motorsport-prod`, `aws-quicksight-northwest-motorsport-prod`, `aws-s3-northwest-motorsport-prod`

## Product Routing

Primary product area: `MDP`

| Product Area | Objects |
| ------------ | ------: |
| MDP          |     111 |

Human catalog roots:

- Sonic Data Lineage / Data Product Catalog / MDP / MDP AWS Lineage Context

## Summary

| Signal  | Count |
| ------- | ----: |
| Objects |   111 |
| Edges   |   111 |
| Gaps    |     0 |

## Objects By Type

| Type                   | Count |
| ---------------------- | ----: |
| athena_data_catalog    |     1 |
| athena_workgroup       |     1 |
| aws_account            |     1 |
| aws_athena_service     |     1 |
| aws_glue_service       |     1 |
| aws_quicksight_service |     1 |
| aws_s3_service         |     1 |
| s3_bucket              |   104 |

## Edge Sample

| Relationship | From                                              | To                                                              | Confidence |
| ------------ | ------------------------------------------------- | --------------------------------------------------------------- | ---------: |
| contains     | Amazon S3 - Northwest Motorsport - Production     | feed-image-overlay-produ-serverlessdeploymentbuck-17rq77a0yew41 |       0.78 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | nwms-image-recognition                                          |       0.78 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | www.nwmotorsports.com                                           |       0.78 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | developer.nwmsrocks.com                                         |       0.78 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | cdn.nwmsrocks.com                                               |       0.78 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | nwmsgophish-logs                                                |       0.78 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | dealersocket-unzip                                              |       0.78 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | s3resourcesoptimizeimage-serverlessdeploymentbuck-3873nz3mg4sd  |       0.78 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | truckstrucksandmoretrucks.com                                   |       0.78 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | ami.nwmsrocks.com                                               |       0.78 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | dealersocket-import                                             |       0.78 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | reynolds-import-storage                                         |       0.78 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | elasticbeanstalk-us-east-1-120126178335                         |       0.78 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | nwms-lambda-pywebhook                                           |       0.78 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | cross-sell-production-serverlessdeploymentbucket-9msqoslvzg0l   |       0.78 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | reynolds-title-import-storage                                   |       0.78 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | sonic.nwmsrocks.com                                             |       0.78 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | build-inventory-before.nwmsrocks.com                            |       0.78 |
| contains     | Amazon Athena - Northwest Motorsport - Production | AwsDataCatalog                                                  |       0.78 |
| contains     | Northwest Motorsport - Production                 | Amazon S3 - Northwest Motorsport - Production                   |       0.95 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | inventoryautocomplete-pr-serverlessdeploymentbuck-wlmz33azth7x  |       0.78 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | trades.nwmsrocks.com                                            |       0.78 |
| contains     | Northwest Motorsport - Production                 | Amazon QuickSight - Northwest Motorsport - Production           |       0.95 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | local-inventory.nwmsrocks.com                                   |       0.78 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | reynolds-logs                                                   |       0.78 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | store.nwmsrocks.com                                             |       0.78 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | video.nwmsrocks.com                                             |       0.78 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | cf-templates-179dunutbirk8-us-west-2                            |       0.78 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | reynolds-data-trigger                                           |       0.78 |
| contains     | Amazon S3 - Northwest Motorsport - Production     | documents.nwmsrocks.com                                         |       0.78 |

## Lineage Gaps

| Object | Gap  | Message |
| ------ | ---- | ------- |
| none   | none | none    |

## Delta

Mode: `full_refresh`

| Status         | Count |
| -------------- | ----: |
| new            |   111 |
| changed        |     0 |
| unchanged      |     0 |
| retained_stale |     0 |
| removed_stale  |     0 |

## AI Description Rule

Human-friendly descriptions must use only the bounded evidence packet for each object. If purpose, owner, steward, SLA, freshness, or business process is not surfaced by metadata, say that it is not surfaced in metadata. Do not infer business meaning from an AWS name alone.
