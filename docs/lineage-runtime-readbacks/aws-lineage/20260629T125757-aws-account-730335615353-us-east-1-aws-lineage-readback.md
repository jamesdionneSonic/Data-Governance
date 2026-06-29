# AWS Lineage Ingestion Readback

Generated: 2026-06-29T12:57:57.478Z

Source scope: `aws-account:730335615353:us-east-1`

Lineage connector id: `aws-account-730335615353-us-east-1`

Source connectors: `aws-athena-sonic-sandbox-mdp`, `aws-glue-sonic-sandbox-mdp`, `aws-s3-sonic-sandbox-mdp`

## Summary

| Signal  | Count |
| ------- | ----: |
| Objects |    11 |
| Edges   |    11 |
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
| s3_bucket           |     5 |

## Edge Sample

| Relationship                    | From                                    | To                                                    | Confidence |
| ------------------------------- | --------------------------------------- | ----------------------------------------------------- | ---------: |
| contains                        | Amazon S3 - SVC_Sandbox_MDP             | acq-listingsingestion-bucket                          |       0.78 |
| contains                        | Amazon S3 - SVC_Sandbox_MDP             | ciaran-ciaran-eus1-xmas-codedeploy-bucket             |       0.78 |
| contains                        | SVC_Sandbox_MDP                         | Amazon Athena - SVC_Sandbox_MDP                       |       0.95 |
| contains                        | Amazon S3 - SVC_Sandbox_MDP             | ciaran-ciaran-eus1-apiinteg-codedeploy-bucket         |       0.78 |
| contains                        | SVC_Sandbox_MDP                         | Amazon S3 - SVC_Sandbox_MDP                           |       0.95 |
| contains                        | Amazon S3 - SVC_Sandbox_MDP             | acq-openlane-files-temp-holder                        |       0.78 |
| metadata_catalog_used_by_athena | AWS Glue Data Catalog - SVC_Sandbox_MDP | AwsDataCatalog                                        |       0.72 |
| contains                        | Amazon Athena - SVC_Sandbox_MDP         | AwsDataCatalog                                        |       0.78 |
| contains                        | Amazon S3 - SVC_Sandbox_MDP             | andrei-sandbox-eus1-andreicreditapp-codedeploy-bucket |       0.78 |
| contains                        | SVC_Sandbox_MDP                         | AWS Glue Data Catalog - SVC_Sandbox_MDP               |       0.95 |
| contains                        | Amazon Athena - SVC_Sandbox_MDP         | primary                                               |       0.78 |

## Lineage Gaps

| Object | Gap  | Message |
| ------ | ---- | ------- |
| none   | none | none    |

## Delta

Mode: `plan_only`

| Status         | Count |
| -------------- | ----: |
| new            |    11 |
| changed        |     0 |
| unchanged      |     0 |
| retained_stale |     0 |
| removed_stale  |     0 |

## AI Description Rule

Human-friendly descriptions must use only the bounded evidence packet for each object. If purpose, owner, steward, SLA, freshness, or business process is not surfaced by metadata, say that it is not surfaced in metadata. Do not infer business meaning from an AWS name alone.
