# Data Team Feed Summary

Generated: 2026-06-29T14:12:46.931Z

## Plain-English Summary

The current AWS lineage evidence is MDP-specific. The data team should treat this as a feed and dependency context, not as proof that the data team owns the full AWS implementation.

## Technical Evidence

## Source Packages

| Source scope                       | Lineage connector                  | Generated                | Objects | Edges | File                                                                                                                                               |
| ---------------------------------- | ---------------------------------- | ------------------------ | ------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| aws-account:118570350539:us-east-1 | aws-account-118570350539-us-east-1 | 2026-06-29T13:46:54.573Z | 546     | 586   | C:/projects/Data Governence/docs/lineage-runtime-readbacks/aws-lineage/20260629T134654-aws-account-118570350539-us-east-1-aws-lineage-package.json |
| aws-account:120126178335:us-east-1 | aws-account-120126178335-us-east-1 | 2026-06-29T13:46:54.573Z | 111     | 111   | C:/projects/Data Governence/docs/lineage-runtime-readbacks/aws-lineage/20260629T134654-aws-account-120126178335-us-east-1-aws-lineage-package.json |
| aws-account:470660935268:us-east-1 | aws-account-470660935268-us-east-1 | 2026-06-29T13:46:54.573Z | 709     | 757   | C:/projects/Data Governence/docs/lineage-runtime-readbacks/aws-lineage/20260629T134654-aws-account-470660935268-us-east-1-aws-lineage-package.json |
| aws-account:477562029833:us-east-1 | aws-account-477562029833-us-east-1 | 2026-06-29T13:46:54.573Z | 823     | 877   | C:/projects/Data Governence/docs/lineage-runtime-readbacks/aws-lineage/20260629T134654-aws-account-477562029833-us-east-1-aws-lineage-package.json |
| aws-account:499876093606:us-east-1 | aws-account-499876093606-us-east-1 | 2026-06-29T13:46:54.573Z | 4260    | 4580  | C:/projects/Data Governence/docs/lineage-runtime-readbacks/aws-lineage/20260629T134654-aws-account-499876093606-us-east-1-aws-lineage-package.json |
| aws-account:730335615353:us-east-1 | aws-account-730335615353-us-east-1 | 2026-06-29T13:46:54.573Z | 22      | 22    | C:/projects/Data Governence/docs/lineage-runtime-readbacks/aws-lineage/20260629T134654-aws-account-730335615353-us-east-1-aws-lineage-package.json |

## Highest Relationship Assets

| Asset                                                          | Type           | Account                           | Service | Relationships | Human page                                                                                      |
| -------------------------------------------------------------- | -------------- | --------------------------------- | ------- | ------------- | ----------------------------------------------------------------------------------------------- |
| Amazon S3 - Northwest Motorsport - Production                  | aws_s3_service | Northwest Motorsport - Production | s3      | 105           | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / AWS Accounts And Services |
| Amazon S3 - svc_dev_mdp                                        | aws_s3_service | svc_dev_mdp                       | s3      | 100           | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / AWS Accounts And Services |
| sonic_mdp_athena_query_db_prod.raw_elead_sales_activity        | glue_table     | svc_prd_mdp                       | glue    | 50            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_np.raw_elead_sales_activity          | glue_table     | svc_np_mdp                        | glue    | 50            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_pp.raw_elead_sales_activity          | glue_table     | svc_pp_mdp                        | glue    | 50            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_ankur.raw_elead_sales_activity       | glue_table     | svc_dev_mdp                       | glue    | 50            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_ashish.raw_elead_sales_activity      | glue_table     | svc_dev_mdp                       | glue    | 50            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_ciarangg.raw_elead_sales_activity    | glue_table     | svc_dev_mdp                       | glue    | 50            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_corynivens.raw_elead_sales_activity  | glue_table     | svc_dev_mdp                       | glue    | 50            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_dev.raw_elead_sales_activity         | glue_table     | svc_dev_mdp                       | glue    | 50            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_kcarter.raw_elead_sales_activity     | glue_table     | svc_dev_mdp                       | glue    | 50            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_mitaghude.raw_elead_sales_activity   | glue_table     | svc_dev_mdp                       | glue    | 50            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_vsound.raw_elead_sales_activity      | glue_table     | svc_dev_mdp                       | glue    | 50            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| default.elead_sales_activity                                   | glue_table     | svc_np_mdp                        | glue    | 49            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| default.elead_sales_activity                                   | glue_table     | svc_pp_mdp                        | glue    | 49            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_prod.identified_sales_activity       | glue_table     | svc_prd_mdp                       | glue    | 48            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_prod.processed_sales_activity        | glue_table     | svc_prd_mdp                       | glue    | 48            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_np.identified_sales_activity         | glue_table     | svc_np_mdp                        | glue    | 48            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_np.processed_sales_activity          | glue_table     | svc_np_mdp                        | glue    | 48            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_pp.identified_sales_activity         | glue_table     | svc_pp_mdp                        | glue    | 48            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_pp.processed_sales_activity          | glue_table     | svc_pp_mdp                        | glue    | 48            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_ankur.identified_sales_activity      | glue_table     | svc_dev_mdp                       | glue    | 48            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_ankur.processed_sales_activity       | glue_table     | svc_dev_mdp                       | glue    | 48            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_ashish.identified_sales_activity     | glue_table     | svc_dev_mdp                       | glue    | 48            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_ashish.processed_sales_activity      | glue_table     | svc_dev_mdp                       | glue    | 48            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_ciarangg.identified_sales_activity   | glue_table     | svc_dev_mdp                       | glue    | 48            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_ciarangg.processed_sales_activity    | glue_table     | svc_dev_mdp                       | glue    | 48            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_corynivens.identified_sales_activity | glue_table     | svc_dev_mdp                       | glue    | 48            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_corynivens.processed_sales_activity  | glue_table     | svc_dev_mdp                       | glue    | 48            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_dev.identified_sales_activity        | glue_table     | svc_dev_mdp                       | glue    | 48            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_dev.processed_sales_activity         | glue_table     | svc_dev_mdp                       | glue    | 48            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_kcarter.identified_sales_activity    | glue_table     | svc_dev_mdp                       | glue    | 48            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_kcarter.processed_sales_activity     | glue_table     | svc_dev_mdp                       | glue    | 48            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_mitaghude.identified_sales_activity  | glue_table     | svc_dev_mdp                       | glue    | 48            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_mitaghude.processed_sales_activity   | glue_table     | svc_dev_mdp                       | glue    | 48            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_vsound.identified_sales_activity     | glue_table     | svc_dev_mdp                       | glue    | 48            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_vsound.processed_sales_activity      | glue_table     | svc_dev_mdp                       | glue    | 48            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| default.identified_sales_activity                              | glue_table     | svc_pp_mdp                        | glue    | 47            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_prod.raw_dms_individual              | glue_table     | svc_prd_mdp                       | glue    | 46            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
| sonic_mdp_athena_query_db_np.raw_dms_individual                | glue_table     | svc_np_mdp                        | glue    | 46            | Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context / S3 Glue Athena Lineage    |
