# Source Metadata Delta Readback

Generated: 2026-06-29T13:04:55.978Z

Connector: `aws-account-470660935268-us-east-1`

Source family: `aws`

Source scope: `aws-account:470660935268:us-east-1`

Mode: `plan_only`

Baseline: `C:/projects/Sonic-data-lineage/registry/object-registry.jsonl`

## Counts

| Status         | Count |
| -------------- | ----: |
| new            |   180 |
| changed        |     0 |
| unchanged      |     0 |
| retained_stale |     0 |
| removed_stale  |     0 |

## Non-Unchanged Objects

| Status | Canonical ID                                                                                      | Type                | Database                     | Schema               | Object                               |
| ------ | ------------------------------------------------------------------------------------------------- | ------------------- | ---------------------------- | -------------------- | ------------------------------------ |
| new    | aws://470660935268/us-east-1/account/470660935268                                                 | aws_account         |                              |                      | svc_np_mdp                           |
| new    | aws://470660935268/us-east-1/athena/catalog/AwsDataCatalog                                        | athena_data_catalog |                              | catalogs             | AwsDataCatalog                       |
| new    | aws://470660935268/us-east-1/athena/database/AwsDataCatalog/default                               | athena_database     | default                      | AwsDataCatalog       | default                              |
| new    | aws://470660935268/us-east-1/athena/database/AwsDataCatalog/sonic_mdp_athena_query_db_np          | athena_database     | sonic_mdp_athena_query_db_np | AwsDataCatalog       | sonic_mdp_athena_query_db_np         |
| new    | aws://470660935268/us-east-1/athena/service                                                       | aws_athena_service  |                              | athena               | athena                               |
| new    | aws://470660935268/us-east-1/athena/table/AwsDataCatalog/default/dms_individual                   | athena_table        | default                      | AwsDataCatalog       | dms_individual                       |
| new    | aws://470660935268/us-east-1/athena/table/AwsDataCatalog/default/dms_purchase_info                | athena_table        | default                      | AwsDataCatalog       | dms_purchase_info                    |
| new    | aws://470660935268/us-east-1/athena/table/AwsDataCatalog/default/elead_individual                 | athena_table        | default                      | AwsDataCatalog       | elead_individual                     |
| new    | aws://470660935268/us-east-1/athena/table/AwsDataCatalog/default/elead_sales_activity             | athena_table        | default                      | AwsDataCatalog       | elead_sales_activity                 |
| new    | aws://470660935268/us-east-1/athena/workgroup/primary                                             | athena_workgroup    |                              | workgroups           | primary                              |
| new    | aws://470660935268/us-east-1/athena/workgroup/sonic-mdp-workgroup-np                              | athena_workgroup    |                              | workgroups           | sonic-mdp-workgroup-np               |
| new    | aws://470660935268/us-east-1/athena/workgroup/temp-mdp-wg                                         | athena_workgroup    |                              | workgroups           | temp-mdp-wg                          |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/address                           | glue_column         | default                      | dms_individual       | address                              |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/birthdate                         | glue_column         | default                      | dms_individual       | birthdate                            |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/blockdatashare                    | glue_column         | default                      | dms_individual       | blockdatashare                       |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/blockemail                        | glue_column         | default                      | dms_individual       | blockemail                           |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/blockemailnational                | glue_column         | default                      | dms_individual       | blockemailnational                   |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/blockphone                        | glue_column         | default                      | dms_individual       | blockphone                           |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/businessphone                     | glue_column         | default                      | dms_individual       | businessphone                        |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/cellular                          | glue_column         | default                      | dms_individual       | cellular                             |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/city                              | glue_column         | default                      | dms_individual       | city                                 |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/country                           | glue_column         | default                      | dms_individual       | country                              |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/custno                            | glue_column         | default                      | dms_individual       | custno                               |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/deletedataflag                    | glue_column         | default                      | dms_individual       | deletedataflag                       |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/deletedatatime                    | glue_column         | default                      | dms_individual       | deletedatatime                       |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/dnccellphonedma                   | glue_column         | default                      | dms_individual       | dnccellphonedma                      |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/dnccellphoneftc                   | glue_column         | default                      | dms_individual       | dnccellphoneftc                      |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/dnccellphonesag                   | glue_column         | default                      | dms_individual       | dnccellphonesag                      |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/dnchomephonedma                   | glue_column         | default                      | dms_individual       | dnchomephonedma                      |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/dnchomephoneftc                   | glue_column         | default                      | dms_individual       | dnchomephoneftc                      |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/dnchomephonesag                   | glue_column         | default                      | dms_individual       | dnchomephonesag                      |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/dncworkphonedma                   | glue_column         | default                      | dms_individual       | dncworkphonedma                      |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/dncworkphoneftc                   | glue_column         | default                      | dms_individual       | dncworkphoneftc                      |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/dncworkphonesag                   | glue_column         | default                      | dms_individual       | dncworkphonesag                      |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/email                             | glue_column         | default                      | dms_individual       | email                                |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/email2                            | glue_column         | default                      | dms_individual       | email2                               |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/email3                            | glue_column         | default                      | dms_individual       | email3                               |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/email4                            | glue_column         | default                      | dms_individual       | email4                               |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/email5                            | glue_column         | default                      | dms_individual       | email5                               |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/email6                            | glue_column         | default                      | dms_individual       | email6                               |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/firstname                         | glue_column         | default                      | dms_individual       | firstname                            |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/gender                            | glue_column         | default                      | dms_individual       | gender                               |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/groupmemberid                     | glue_column         | default                      | dms_individual       | groupmemberid                        |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/groupmembername                   | glue_column         | default                      | dms_individual       | groupmembername                      |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/homephone                         | glue_column         | default                      | dms_individual       | homephone                            |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/lastname                          | glue_column         | default                      | dms_individual       | lastname                             |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/optoutflag                        | glue_column         | default                      | dms_individual       | optoutflag                           |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/optouttime                        | glue_column         | default                      | dms_individual       | optouttime                           |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/orgid                             | glue_column         | default                      | dms_individual       | orgid                                |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/orgname                           | glue_column         | default                      | dms_individual       | orgname                              |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/rowlastupdated                    | glue_column         | default                      | dms_individual       | rowlastupdated                       |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/state                             | glue_column         | default                      | dms_individual       | state                                |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/telephone                         | glue_column         | default                      | dms_individual       | telephone                            |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_individual/ziporpostalcode                   | glue_column         | default                      | dms_individual       | ziporpostalcode                      |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/address                        | glue_column         | default                      | dms_purchase_info    | address                              |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/buyrateapr                     | glue_column         | default                      | dms_purchase_info    | buyrateapr                           |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/cashdown                       | glue_column         | default                      | dms_purchase_info    | cashdown                             |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/cashprice                      | glue_column         | default                      | dms_purchase_info    | cashprice                            |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/custno                         | glue_column         | default                      | dms_purchase_info    | custno                               |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/customer_first_name            | glue_column         | default                      | dms_purchase_info    | customer_first_name                  |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/customer_last_name             | glue_column         | default                      | dms_purchase_info    | customer_last_name                   |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/dealno                         | glue_column         | default                      | dms_purchase_info    | dealno                               |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/email                          | glue_column         | default                      | dms_purchase_info    | email                                |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/eventdate                      | glue_column         | default                      | dms_purchase_info    | eventdate                            |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/fiwipstatuscode                | glue_column         | default                      | dms_purchase_info    | fiwipstatuscode                      |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/groupmemberid                  | glue_column         | default                      | dms_purchase_info    | groupmemberid                        |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/groupmembername                | glue_column         | default                      | dms_purchase_info    | groupmembername                      |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/makename                       | glue_column         | default                      | dms_purchase_info    | makename                             |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/modelname                      | glue_column         | default                      | dms_purchase_info    | modelname                            |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/orgid                          | glue_column         | default                      | dms_purchase_info    | orgid                                |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/orgname                        | glue_column         | default                      | dms_purchase_info    | orgname                              |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/rowlastupdated                 | glue_column         | default                      | dms_purchase_info    | rowlastupdated                       |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/salesdate                      | glue_column         | default                      | dms_purchase_info    | salesdate                            |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/salesperson_first_name         | glue_column         | default                      | dms_purchase_info    | salesperson_first_name               |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/salesperson_last_name          | glue_column         | default                      | dms_purchase_info    | salesperson_last_name                |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/salesperson1                   | glue_column         | default                      | dms_purchase_info    | salesperson1                         |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/stockno                        | glue_column         | default                      | dms_purchase_info    | stockno                              |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/telephone                      | glue_column         | default                      | dms_purchase_info    | telephone                            |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/term                           | glue_column         | default                      | dms_purchase_info    | term                                 |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/trade1acv                      | glue_column         | default                      | dms_purchase_info    | trade1acv                            |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/trade1make                     | glue_column         | default                      | dms_purchase_info    | trade1make                           |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/trade1model                    | glue_column         | default                      | dms_purchase_info    | trade1model                          |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/trade1vin                      | glue_column         | default                      | dms_purchase_info    | trade1vin                            |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/trade1year                     | glue_column         | default                      | dms_purchase_info    | trade1year                           |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/trade2acv                      | glue_column         | default                      | dms_purchase_info    | trade2acv                            |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/trade2make                     | glue_column         | default                      | dms_purchase_info    | trade2make                           |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/trade2model                    | glue_column         | default                      | dms_purchase_info    | trade2model                          |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/trade2vin                      | glue_column         | default                      | dms_purchase_info    | trade2vin                            |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/trade2year                     | glue_column         | default                      | dms_purchase_info    | trade2year                           |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/vin                            | glue_column         | default                      | dms_purchase_info    | vin                                  |
| new    | aws://470660935268/us-east-1/glue/column/default/dms_purchase_info/year                           | glue_column         | default                      | dms_purchase_info    | year                                 |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_individual/address                         | glue_column         | default                      | elead_individual     | address                              |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_individual/bcelldnc                        | glue_column         | default                      | elead_individual     | bcelldnc                             |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_individual/bdonotcall                      | glue_column         | default                      | elead_individual     | bdonotcall                           |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_individual/bdonotemail                     | glue_column         | default                      | elead_individual     | bdonotemail                          |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_individual/bhomednc                        | glue_column         | default                      | elead_individual     | bhomednc                             |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_individual/bprimary                        | glue_column         | default                      | elead_individual     | bprimary                             |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_individual/bworkdnc                        | glue_column         | default                      | elead_individual     | bworkdnc                             |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_individual/customer_first_name             | glue_column         | default                      | elead_individual     | customer_first_name                  |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_individual/customer_last_name              | glue_column         | default                      | elead_individual     | customer_last_name                   |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_individual/dtbirthday                      | glue_column         | default                      | elead_individual     | dtbirthday                           |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_individual/dtlastedit                      | glue_column         | default                      | elead_individual     | dtlastedit                           |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_individual/groupmemberid                   | glue_column         | default                      | elead_individual     | groupmemberid                        |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_individual/groupmembername                 | glue_column         | default                      | elead_individual     | groupmembername                      |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_individual/lchildcompanyid                 | glue_column         | default                      | elead_individual     | lchildcompanyid                      |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_individual/lpersonid                       | glue_column         | default                      | elead_individual     | lpersonid                            |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_individual/orgid                           | glue_column         | default                      | elead_individual     | orgid                                |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_individual/orgname                         | glue_column         | default                      | elead_individual     | orgname                              |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_individual/szabbreviation                  | glue_column         | default                      | elead_individual     | szabbreviation                       |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_individual/szaddress                       | glue_column         | default                      | elead_individual     | szaddress                            |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_individual/szcity                          | glue_column         | default                      | elead_individual     | szcity                               |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_individual/szcountry                       | glue_column         | default                      | elead_individual     | szcountry                            |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_individual/szgender                        | glue_column         | default                      | elead_individual     | szgender                             |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_individual/sznumber                        | glue_column         | default                      | elead_individual     | sznumber                             |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_individual/szphonetype                     | glue_column         | default                      | elead_individual     | szphonetype                          |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_individual/szzip                           | glue_column         | default                      | elead_individual     | szzip                                |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/activitysubsource           | glue_column         | default                      | elead_sales_activity | activitysubsource                    |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/activityszsource            | glue_column         | default                      | elead_sales_activity | activityszsource                     |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/address                     | glue_column         | default                      | elead_sales_activity | address                              |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/bnewprospect                | glue_column         | default                      | elead_sales_activity | bnewprospect                         |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/completedfirstname          | glue_column         | default                      | elead_sales_activity | completedfirstname                   |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/completedlastname           | glue_column         | default                      | elead_sales_activity | completedlastname                    |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/creatorfirstname            | glue_column         | default                      | elead_sales_activity | creatorfirstname                     |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/creatorlastname             | glue_column         | default                      | elead_sales_activity | creatorlastname                      |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/dtclosed                    | glue_column         | default                      | elead_sales_activity | dtclosed                             |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/dtcompleted                 | glue_column         | default                      | elead_sales_activity | dtcompleted                          |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/dtlastedit                  | glue_column         | default                      | elead_sales_activity | dtlastedit                           |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/dtprospectin                | glue_column         | default                      | elead_sales_activity | dtprospectin                         |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/dtreminder                  | glue_column         | default                      | elead_sales_activity | dtreminder                           |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/groupmemberid               | glue_column         | default                      | elead_sales_activity | groupmemberid                        |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/groupmembername             | glue_column         | default                      | elead_sales_activity | groupmembername                      |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/lchildcompanyid             | glue_column         | default                      | elead_sales_activity | lchildcompanyid                      |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/lcompletedbyid              | glue_column         | default                      | elead_sales_activity | lcompletedbyid                       |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/lcreatorid                  | glue_column         | default                      | elead_sales_activity | lcreatorid                           |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/lcurrentownerid             | glue_column         | default                      | elead_sales_activity | lcurrentownerid                      |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/ldealid                     | glue_column         | default                      | elead_sales_activity | ldealid                              |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/lpersonid                   | glue_column         | default                      | elead_sales_activity | lpersonid                            |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/ltaskid                     | glue_column         | default                      | elead_sales_activity | ltaskid                              |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/ltaskitemid                 | glue_column         | default                      | elead_sales_activity | ltaskitemid                          |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/orgid                       | glue_column         | default                      | elead_sales_activity | orgid                                |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/orgname                     | glue_column         | default                      | elead_sales_activity | orgname                              |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/remindercompleted           | glue_column         | default                      | elead_sales_activity | remindercompleted                    |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/salespersonfirstname        | glue_column         | default                      | elead_sales_activity | salespersonfirstname                 |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/salespersonlastname         | glue_column         | default                      | elead_sales_activity | salespersonlastname                  |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/szaddress                   | glue_column         | default                      | elead_sales_activity | szaddress                            |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/szdatasource                | glue_column         | default                      | elead_sales_activity | szdatasource                         |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/szdealsubstatus             | glue_column         | default                      | elead_sales_activity | szdealsubstatus                      |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/szfirstname                 | glue_column         | default                      | elead_sales_activity | szfirstname                          |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/szinactivereason            | glue_column         | default                      | elead_sales_activity | szinactivereason                     |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/szitem                      | glue_column         | default                      | elead_sales_activity | szitem                               |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/szlastname                  | glue_column         | default                      | elead_sales_activity | szlastname                           |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/szlegacydealid              | glue_column         | default                      | elead_sales_activity | szlegacydealid                       |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/szlistitem                  | glue_column         | default                      | elead_sales_activity | szlistitem                           |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/sznumber                    | glue_column         | default                      | elead_sales_activity | sznumber                             |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/szsourcedetails             | glue_column         | default                      | elead_sales_activity | szsourcedetails                      |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/szstatus                    | glue_column         | default                      | elead_sales_activity | szstatus                             |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/szsubsource                 | glue_column         | default                      | elead_sales_activity | szsubsource                          |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/sztask                      | glue_column         | default                      | elead_sales_activity | sztask                               |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/sztasktype                  | glue_column         | default                      | elead_sales_activity | sztasktype                           |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/szupsource                  | glue_column         | default                      | elead_sales_activity | szupsource                           |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/szuptype                    | glue_column         | default                      | elead_sales_activity | szuptype                             |
| new    | aws://470660935268/us-east-1/glue/column/default/elead_sales_activity/szworkflow                  | glue_column         | default                      | elead_sales_activity | szworkflow                           |
| new    | aws://470660935268/us-east-1/glue/database/default                                                | glue_database       | default                      | glue                 | default                              |
| new    | aws://470660935268/us-east-1/glue/database/sonic_mdp_athena_query_db_np                           | glue_database       | sonic_mdp_athena_query_db_np | glue                 | sonic_mdp_athena_query_db_np         |
| new    | aws://470660935268/us-east-1/glue/service                                                         | aws_glue_service    |                              | glue                 | glue                                 |
| new    | aws://470660935268/us-east-1/glue/table/default/dms_individual                                    | glue_table          | default                      | glue                 | dms_individual                       |
| new    | aws://470660935268/us-east-1/glue/table/default/dms_purchase_info                                 | glue_table          | default                      | glue                 | dms_purchase_info                    |
| new    | aws://470660935268/us-east-1/glue/table/default/elead_individual                                  | glue_table          | default                      | glue                 | elead_individual                     |
| new    | aws://470660935268/us-east-1/glue/table/default/elead_sales_activity                              | glue_table          | default                      | glue                 | elead_sales_activity                 |
| new    | aws://470660935268/us-east-1/s3/bucket/dealership-ui-non-prod-470660935268                        | s3_bucket           |                              |                      | dealership-ui-non-prod-470660935268  |
| new    | aws://470660935268/us-east-1/s3/bucket/sonic-dealership-tf-state-np                               | s3_bucket           |                              |                      | sonic-dealership-tf-state-np         |
| new    | aws://470660935268/us-east-1/s3/bucket/sonic-mdp-artifacts-np                                     | s3_bucket           |                              |                      | sonic-mdp-artifacts-np               |
| new    | aws://470660935268/us-east-1/s3/bucket/sonic-mdp-athena-query-bucket-np                           | s3_bucket           |                              |                      | sonic-mdp-athena-query-bucket-np     |
| new    | aws://470660935268/us-east-1/s3/bucket/sonic-mdp-data-dump-np                                     | s3_bucket           |                              |                      | sonic-mdp-data-dump-np               |
| new    | aws://470660935268/us-east-1/s3/bucket/temp-athena-db-source                                      | s3_bucket           |                              |                      | temp-athena-db-source                |
| new    | aws://470660935268/us-east-1/s3/prefix/temp-athena-db-source/raw-parquet/dms_individual           | s3_prefix           |                              |                      | raw-parquet/dms_individual           |
| new    | aws://470660935268/us-east-1/s3/prefix/temp-athena-db-source/raw-parquet/dms_purchase_information | s3_prefix           |                              |                      | raw-parquet/dms_purchase_information |
| new    | aws://470660935268/us-east-1/s3/prefix/temp-athena-db-source/raw-parquet/elead_individual         | s3_prefix           |                              |                      | raw-parquet/elead_individual         |
| new    | aws://470660935268/us-east-1/s3/prefix/temp-athena-db-source/raw-parquet/elead_sales_activity     | s3_prefix           |                              |                      | raw-parquet/elead_sales_activity     |
| new    | aws://470660935268/us-east-1/s3/service                                                           | aws_s3_service      |                              | s3                   | s3                                   |

## Downstream Rule

AI summarization, DevOps writes, runtime package object updates, Rovo artifacts, support docs, and Confluence dry-runs/live publishes must process only `new` and `changed` objects plus directly impacted index/shard pages unless a scoped full refresh is approved.
