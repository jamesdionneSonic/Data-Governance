# AWS Lineage Ingestion Readback

Generated: 2026-06-29T12:57:57.478Z

Source scope: `aws-account:120126178335:us-east-1`

Lineage connector id: `aws-account-120126178335-us-east-1`

Source connectors: `aws-athena-northwest-motorsport-prod`, `aws-glue-northwest-motorsport-prod`, `aws-quicksight-northwest-motorsport-prod`, `aws-s3-northwest-motorsport-prod`

## Summary

| Signal  | Count |
| ------- | ----: |
| Objects |    12 |
| Edges   |    12 |
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
| s3_bucket              |     5 |

## Edge Sample

| Relationship                    | From                                                      | To                                                             | Confidence |
| ------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------- | ---------: |
| contains                        | Amazon S3 - Northwest Motorsport - Production             | ami.nwmsrocks.com                                              |       0.78 |
| contains                        | Amazon S3 - Northwest Motorsport - Production             | build-inventory-before.nwmsrocks.com                           |       0.78 |
| contains                        | Amazon Athena - Northwest Motorsport - Production         | AwsDataCatalog                                                 |       0.78 |
| contains                        | Northwest Motorsport - Production                         | Amazon S3 - Northwest Motorsport - Production                  |       0.95 |
| contains                        | Northwest Motorsport - Production                         | Amazon QuickSight - Northwest Motorsport - Production          |       0.95 |
| metadata_catalog_used_by_athena | AWS Glue Data Catalog - Northwest Motorsport - Production | AwsDataCatalog                                                 |       0.72 |
| contains                        | Amazon Athena - Northwest Motorsport - Production         | primary                                                        |       0.78 |
| contains                        | Amazon S3 - Northwest Motorsport - Production             | blog.nwmsrocks.com                                             |       0.78 |
| contains                        | Amazon S3 - Northwest Motorsport - Production             | aws-glue-assets-120126178335-us-west-2                         |       0.78 |
| contains                        | Northwest Motorsport - Production                         | AWS Glue Data Catalog - Northwest Motorsport - Production      |       0.95 |
| contains                        | Amazon S3 - Northwest Motorsport - Production             | beanstalkstatus-producti-serverlessdeploymentbuck-omyc7kvf25dl |       0.78 |
| contains                        | Northwest Motorsport - Production                         | Amazon Athena - Northwest Motorsport - Production              |       0.95 |

## Lineage Gaps

| Object | Gap  | Message |
| ------ | ---- | ------- |
| none   | none | none    |

## Delta

Mode: `plan_only`

| Status         | Count |
| -------------- | ----: |
| new            |    12 |
| changed        |     0 |
| unchanged      |     0 |
| retained_stale |     0 |
| removed_stale  |     0 |

## AI Description Rule

Human-friendly descriptions must use only the bounded evidence packet for each object. If purpose, owner, steward, SLA, freshness, or business process is not surfaced by metadata, say that it is not surfaced in metadata. Do not infer business meaning from an AWS name alone.
