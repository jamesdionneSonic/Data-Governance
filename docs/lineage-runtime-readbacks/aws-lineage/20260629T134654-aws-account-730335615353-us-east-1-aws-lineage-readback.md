# AWS Lineage Ingestion Readback

Generated: 2026-06-29T13:46:54.573Z

Source scope: `aws-account:730335615353:us-east-1`

Lineage connector id: `aws-account-730335615353-us-east-1`

Source connectors: `aws-athena-sonic-sandbox-mdp`, `aws-glue-sonic-sandbox-mdp`, `aws-s3-sonic-sandbox-mdp`

## Product Routing

Primary product area: `MDP`

| Product Area | Objects |
| ------------ | ------: |
| MDP          |      22 |

Human catalog roots:

- Sonic Data Lineage / Data Product Catalog / MDP / MDP AWS Lineage Context

## Summary

| Signal  | Count |
| ------- | ----: |
| Objects |    22 |
| Edges   |    22 |
| Gaps    |     0 |

## Objects By Type

| Type                | Count |
| ------------------- | ----: |
| athena_data_catalog |     1 |
| athena_workgroup    |     1 |
| aws_account         |     1 |
| aws_athena_service  |     1 |
| aws_glue_service    |     1 |
| aws_s3_service      |     1 |
| s3_bucket           |    16 |

## Edge Sample

| Relationship                    | From                                    | To                                                       | Confidence |
| ------------------------------- | --------------------------------------- | -------------------------------------------------------- | ---------: |
| contains                        | Amazon S3 - SVC_Sandbox_MDP             | devcreditapp-sandbox-eus1-creditapp-codedeploy-bucket    |       0.78 |
| contains                        | Amazon S3 - SVC_Sandbox_MDP             | acq-listingsingestion-bucket                             |       0.78 |
| contains                        | Amazon S3 - SVC_Sandbox_MDP             | ciaran-ciaran-eus1-xmas-codedeploy-bucket                |       0.78 |
| contains                        | Amazon S3 - SVC_Sandbox_MDP             | gabe-poc-s3                                              |       0.78 |
| contains                        | Amazon S3 - SVC_Sandbox_MDP             | sonic-mdp-tf-state-sbx                                   |       0.78 |
| contains                        | Amazon S3 - SVC_Sandbox_MDP             | sonic-sbx-eus1-vipsharedinfra-test-bucket-s3             |       0.78 |
| contains                        | Amazon S3 - SVC_Sandbox_MDP             | vas-vasdev-eus1-testproj-codedeploy-bucket               |       0.78 |
| contains                        | SVC_Sandbox_MDP                         | Amazon Athena - SVC_Sandbox_MDP                          |       0.95 |
| contains                        | Amazon S3 - SVC_Sandbox_MDP             | sonic-sbx-eus1-deleteme-codedeploy-bucket                |       0.78 |
| contains                        | Amazon S3 - SVC_Sandbox_MDP             | ciaran-ciaran-eus1-apiinteg-codedeploy-bucket            |       0.78 |
| contains                        | Amazon S3 - SVC_Sandbox_MDP             | tsc-lambda-bucket                                        |       0.78 |
| contains                        | Amazon S3 - SVC_Sandbox_MDP             | sonic-mdp-test-s3bucket-edemir                           |       0.78 |
| contains                        | Amazon S3 - SVC_Sandbox_MDP             | test-edemir                                              |       0.78 |
| contains                        | SVC_Sandbox_MDP                         | Amazon S3 - SVC_Sandbox_MDP                              |       0.95 |
| contains                        | Amazon S3 - SVC_Sandbox_MDP             | acq-openlane-files-temp-holder                           |       0.78 |
| contains                        | Amazon S3 - SVC_Sandbox_MDP             | sonic-sbx-eus1-holidays-codedeploy-bucket                |       0.78 |
| metadata_catalog_used_by_athena | AWS Glue Data Catalog - SVC_Sandbox_MDP | AwsDataCatalog                                           |       0.72 |
| contains                        | Amazon Athena - SVC_Sandbox_MDP         | AwsDataCatalog                                           |       0.78 |
| contains                        | Amazon S3 - SVC_Sandbox_MDP             | andrei-sandbox-eus1-andreicreditapp-codedeploy-bucket    |       0.78 |
| contains                        | SVC_Sandbox_MDP                         | AWS Glue Data Catalog - SVC_Sandbox_MDP                  |       0.95 |
| contains                        | Amazon S3 - SVC_Sandbox_MDP             | sonic-sbx-eus1-eventtracingelasticsrch-codedeploy-bucket |       0.78 |
| contains                        | Amazon Athena - SVC_Sandbox_MDP         | primary                                                  |       0.78 |

## Lineage Gaps

| Object | Gap  | Message |
| ------ | ---- | ------- |
| none   | none | none    |

## Delta

Mode: `full_refresh`

| Status         | Count |
| -------------- | ----: |
| new            |    22 |
| changed        |     0 |
| unchanged      |     0 |
| retained_stale |     0 |
| removed_stale  |     0 |

## AI Description Rule

Human-friendly descriptions must use only the bounded evidence packet for each object. If purpose, owner, steward, SLA, freshness, or business process is not surfaced by metadata, say that it is not surfaced in metadata. Do not infer business meaning from an AWS name alone.
