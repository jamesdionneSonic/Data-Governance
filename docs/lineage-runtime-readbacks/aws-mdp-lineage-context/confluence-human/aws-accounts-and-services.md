# AWS Accounts And Services

Generated: 2026-06-29T14:12:46.931Z

## Plain-English Summary

These accounts and services are currently routed to the MDP AWS lineage context. Future AWS connectors must be routed explicitly and should not inherit this placement automatically.

## Technical Evidence

## Accounts

| Account name                      | Account ID   | Region    | Services                              | Objects |
| --------------------------------- | ------------ | --------- | ------------------------------------- | ------- |
| svc_prd_mdp                       | 118570350539 | us-east-1 | account, athena, glue, s3             | 546     |
| Northwest Motorsport - Production | 120126178335 | us-east-1 | account, athena, glue, quicksight, s3 | 111     |
| svc_np_mdp                        | 470660935268 | us-east-1 | account, athena, glue, s3             | 709     |
| svc_pp_mdp                        | 477562029833 | us-east-1 | account, athena, glue, s3             | 823     |
| svc_dev_mdp                       | 499876093606 | us-east-1 | account, athena, glue, s3             | 4260    |
| SVC_Sandbox_MDP                   | 730335615353 | us-east-1 | account, athena, glue, s3             | 22      |

## Objects By Type

| Object type            | Objects |
| ---------------------- | ------- |
| athena_data_catalog    | 6       |
| athena_database        | 15      |
| athena_table           | 231     |
| athena_workgroup       | 21      |
| aws_account            | 6       |
| aws_athena_service     | 6       |
| aws_glue_service       | 6       |
| aws_quicksight_service | 1       |
| aws_s3_service         | 6       |
| glue_column            | 5421    |
| glue_database          | 15      |
| glue_table             | 231     |
| s3_bucket              | 278     |
| s3_prefix              | 228     |
