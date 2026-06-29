# AWS SSO Connector Readiness

Generated: 2026-06-29T12:27:51.052Z

## Connector Samples

| Connector                                | Type       | Account                           | Test      | Sample    | Events | Streams                                             |
| ---------------------------------------- | ---------- | --------------------------------- | --------- | --------- | -----: | --------------------------------------------------- |
| aws-s3-sonic-dev-mdp                     | aws_s3     | svc_dev_mdp                       | succeeded | succeeded |      5 | buckets                                             |
| aws-glue-sonic-dev-mdp                   | aws_glue   | svc_dev_mdp                       | succeeded | succeeded |      5 | databases, tables, columns, jobs                    |
| aws-athena-sonic-dev-mdp                 | aws_athena | svc_dev_mdp                       | succeeded | succeeded |     11 | workgroups, data_catalogs, databases, named_queries |
| aws-s3-sonic-np-mdp                      | aws_s3     | svc_np_mdp                        | succeeded | succeeded |      5 | buckets                                             |
| aws-glue-sonic-np-mdp                    | aws_glue   | svc_np_mdp                        | succeeded | succeeded |    156 | databases, tables, columns, jobs                    |
| aws-athena-sonic-np-mdp                  | aws_athena | svc_np_mdp                        | succeeded | succeeded |      6 | workgroups, data_catalogs, databases, named_queries |
| aws-s3-sonic-pp-mdp                      | aws_s3     | svc_pp_mdp                        | succeeded | succeeded |      5 | buckets                                             |
| aws-glue-sonic-pp-mdp                    | aws_glue   | svc_pp_mdp                        | succeeded | succeeded |    199 | databases, tables, columns, jobs                    |
| aws-athena-sonic-pp-mdp                  | aws_athena | svc_pp_mdp                        | succeeded | succeeded |      7 | workgroups, data_catalogs, databases, named_queries |
| aws-s3-sonic-prd-mdp                     | aws_s3     | svc_prd_mdp                       | succeeded | succeeded |      5 | buckets                                             |
| aws-glue-sonic-prd-mdp                   | aws_glue   | svc_prd_mdp                       | succeeded | succeeded |      2 | databases, tables, columns, jobs                    |
| aws-athena-sonic-prd-mdp                 | aws_athena | svc_prd_mdp                       | succeeded | succeeded |      5 | workgroups, data_catalogs, databases, named_queries |
| aws-s3-sonic-sandbox-mdp                 | aws_s3     | SVC_Sandbox_MDP                   | succeeded | succeeded |      5 | buckets                                             |
| aws-glue-sonic-sandbox-mdp               | aws_glue   | SVC_Sandbox_MDP                   | succeeded | succeeded |      0 | databases, tables, columns, jobs                    |
| aws-athena-sonic-sandbox-mdp             | aws_athena | SVC_Sandbox_MDP                   | succeeded | succeeded |      2 | workgroups, data_catalogs, databases, named_queries |
| aws-s3-northwest-motorsport-prod         | aws_s3     | Northwest Motorsport - Production | succeeded | succeeded |      5 | buckets                                             |
| aws-glue-northwest-motorsport-prod       | aws_glue   | Northwest Motorsport - Production | succeeded | succeeded |      0 | databases, tables, columns, jobs                    |
| aws-athena-northwest-motorsport-prod     | aws_athena | Northwest Motorsport - Production | succeeded | succeeded |      2 | workgroups, data_catalogs, databases, named_queries |
| aws-quicksight-northwest-motorsport-prod | quicksight | Northwest Motorsport - Production | succeeded | succeeded |      0 | dashboards, datasets, data_sources, analyses        |

## Skipped Services

| Service    | Account                           | Reason                                                                                            |
| ---------- | --------------------------------- | ------------------------------------------------------------------------------------------------- |
| quicksight | svc_dev_mdp                       | QuickSight is not subscribed or not metadata-accessible for this account in the initial probe.    |
| quicksight | svc_np_mdp                        | QuickSight is not subscribed or not metadata-accessible for this account in the initial probe.    |
| quicksight | svc_pp_mdp                        | QuickSight is not subscribed or not metadata-accessible for this account in the initial probe.    |
| quicksight | svc_prd_mdp                       | QuickSight is not subscribed or not metadata-accessible for this account in the initial probe.    |
| quicksight | SVC_Sandbox_MDP                   | QuickSight is not subscribed or not metadata-accessible for this account in the initial probe.    |
| redshift   | svc_dev_mdp                       | No Redshift clusters or Redshift Serverless workgroups were found in the initial us-east-1 probe. |
| redshift   | svc_np_mdp                        | No Redshift clusters or Redshift Serverless workgroups were found in the initial us-east-1 probe. |
| redshift   | svc_pp_mdp                        | No Redshift clusters or Redshift Serverless workgroups were found in the initial us-east-1 probe. |
| redshift   | svc_prd_mdp                       | No Redshift clusters or Redshift Serverless workgroups were found in the initial us-east-1 probe. |
| redshift   | SVC_Sandbox_MDP                   | No Redshift clusters or Redshift Serverless workgroups were found in the initial us-east-1 probe. |
| redshift   | Northwest Motorsport - Production | No Redshift clusters or Redshift Serverless workgroups were found in the initial us-east-1 probe. |

## Notes

- Authentication uses AWS CLI SSO profiles; no access keys, passwords, or SSO tokens are stored in connector records.
- Samples are metadata-only and bounded by `max_sample_items`.
- Redshift connectors were not registered because no clusters or serverless workgroups were found during the initial access validation.
