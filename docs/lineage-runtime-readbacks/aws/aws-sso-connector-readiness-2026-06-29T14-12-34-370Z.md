# AWS SSO Connector Readiness

Generated: 2026-06-29T14:12:34.370Z

## Product Route

| Signal             | Value                                                               |
| ------------------ | ------------------------------------------------------------------- |
| Product area       | MDP                                                                 |
| Product route id   | mdp-aws-lineage-context                                             |
| Human catalog root | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context |
| System owner       | MDP team                                                            |
| Data team role     | feed contributor and lineage consumer                               |

## Connector Samples

| Connector                                | Type       | Account                           | Test    | Sample  | Events | Streams                                             |
| ---------------------------------------- | ---------- | --------------------------------- | ------- | ------- | -----: | --------------------------------------------------- |
| aws-s3-sonic-dev-mdp                     | aws_s3     | svc_dev_mdp                       | not_run | not_run |      0 | buckets                                             |
| aws-glue-sonic-dev-mdp                   | aws_glue   | svc_dev_mdp                       | not_run | not_run |      0 | databases, tables, columns, jobs                    |
| aws-athena-sonic-dev-mdp                 | aws_athena | svc_dev_mdp                       | not_run | not_run |      0 | workgroups, data_catalogs, databases, named_queries |
| aws-s3-sonic-np-mdp                      | aws_s3     | svc_np_mdp                        | not_run | not_run |      0 | buckets                                             |
| aws-glue-sonic-np-mdp                    | aws_glue   | svc_np_mdp                        | not_run | not_run |      0 | databases, tables, columns, jobs                    |
| aws-athena-sonic-np-mdp                  | aws_athena | svc_np_mdp                        | not_run | not_run |      0 | workgroups, data_catalogs, databases, named_queries |
| aws-s3-sonic-pp-mdp                      | aws_s3     | svc_pp_mdp                        | not_run | not_run |      0 | buckets                                             |
| aws-glue-sonic-pp-mdp                    | aws_glue   | svc_pp_mdp                        | not_run | not_run |      0 | databases, tables, columns, jobs                    |
| aws-athena-sonic-pp-mdp                  | aws_athena | svc_pp_mdp                        | not_run | not_run |      0 | workgroups, data_catalogs, databases, named_queries |
| aws-s3-sonic-prd-mdp                     | aws_s3     | svc_prd_mdp                       | not_run | not_run |      0 | buckets                                             |
| aws-glue-sonic-prd-mdp                   | aws_glue   | svc_prd_mdp                       | not_run | not_run |      0 | databases, tables, columns, jobs                    |
| aws-athena-sonic-prd-mdp                 | aws_athena | svc_prd_mdp                       | not_run | not_run |      0 | workgroups, data_catalogs, databases, named_queries |
| aws-s3-sonic-sandbox-mdp                 | aws_s3     | SVC_Sandbox_MDP                   | not_run | not_run |      0 | buckets                                             |
| aws-glue-sonic-sandbox-mdp               | aws_glue   | SVC_Sandbox_MDP                   | not_run | not_run |      0 | databases, tables, columns, jobs                    |
| aws-athena-sonic-sandbox-mdp             | aws_athena | SVC_Sandbox_MDP                   | not_run | not_run |      0 | workgroups, data_catalogs, databases, named_queries |
| aws-s3-northwest-motorsport-prod         | aws_s3     | Northwest Motorsport - Production | not_run | not_run |      0 | buckets                                             |
| aws-glue-northwest-motorsport-prod       | aws_glue   | Northwest Motorsport - Production | not_run | not_run |      0 | databases, tables, columns, jobs                    |
| aws-athena-northwest-motorsport-prod     | aws_athena | Northwest Motorsport - Production | not_run | not_run |      0 | workgroups, data_catalogs, databases, named_queries |
| aws-quicksight-northwest-motorsport-prod | quicksight | Northwest Motorsport - Production | not_run | not_run |      0 | dashboards, datasets, data_sources, analyses        |

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
