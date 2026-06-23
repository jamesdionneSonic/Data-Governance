# T2B-092 Tier 2 Batch Publish Packet

## Purpose

This packet prepares a dry-run publish package for the next queued Tier 2 batch
from `docs/DATABASE_CATALOG_TIER2_BATCH_STRATEGY.md`.

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

Ready for review. Live publish requires explicit approval.

## Scope

| Signal                | Value        |
| --------------------- | ------------ |
| Batch                 | `T2B-092`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `pgc`        |
| Object type scope     | `table`      |
| Object pages          | 75           |
| Link refresh pages    | 2            |
| Total planned entries | 79           |
| Validation status     | `passed`     |

## Object Pages

| Object                                     | Type  | Tags                                     | Downstream | Columns | Confidence | Path                                                                                                              |
| ------------------------------------------ | ----- | ---------------------------------------- | ---------- | ------- | ---------- | ----------------------------------------------------------------------------------------------------------------- |
| `apcheck_staging`                          | table | profiled, review-needed                  | 1          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / apcheck_staging`                          |
| `apcheckxref_staging`                      | table | profiled, review-needed                  | 1          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / apcheckxref_staging`                      |
| `apinvoice_staging`                        | table | profiled, review-needed                  | 1          | 26      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / apinvoice_staging`                        |
| `apinvoicedetail_staging`                  | table | profiled, review-needed                  | 1          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / apinvoicedetail_staging`                  |
| `appointments_staging`                     | table | profiled, review-needed                  | 1          | 62      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / appointments_staging`                     |
| `appointmentsdetail_staging`               | table | profiled, review-needed                  | 1          | 29      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / appointmentsdetail_staging`               |
| `apvendordetail_staging`                   | table | profiled, review-needed                  | 1          | 60      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / apvendordetail_staging`                   |
| `CiLrsInv_Staging`                         | table | profiled, review-needed                  | 0          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / CiLrsInv_Staging`                         |
| `CiLrsInvDamage_Staging`                   | table | profiled, review-needed                  | 0          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / CiLrsInvDamage_Staging`                   |
| `CiLrsLoans_staging`                       | table | profiled, review-needed                  | 0          | 62      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / CiLrsLoans_staging`                       |
| `customer_staging`                         | table | profiled, review-needed                  | 3          | 163     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / customer_staging`                         |
| `deniedwork_staging`                       | table | profiled, review-needed                  | 1          | 28      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / deniedwork_staging`                       |
| `dm_cora_account_staging`                  | table | profiled, review-needed                  | 2          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / dm_cora_account_staging`                  |
| `dm_dms_server_staging`                    | table | profiled, review-needed                  | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / dm_dms_server_staging`                    |
| `employee_staging`                         | table | profiled, review-needed                  | 1          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / employee_staging`                         |
| `entity_other_staging`                     | table | profiled, review-needed                  | 1          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / entity_other_staging`                     |
| `entity_share_staging`                     | table | profiled, review-needed                  | 1          | 41      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / entity_share_staging`                     |
| `etctimecard_staging`                      | table | profiled, review-needed                  | 1          | 23      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / etctimecard_staging`                      |
| `etctimeexcept_errorout`                   | table | profiled, review-needed                  | 0          | 50      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / etctimeexcept_errorout`                   |
| `etctimeexcept_staging`                    | table | profiled, review-needed                  | 2          | 23      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / etctimeexcept_staging`                    |
| `fiproducts31315_Staging`                  | table | profiled, review-needed                  | 1          | 230     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / fiproducts31315_Staging`                  |
| `fsglpclcodes_staging`                     | table | profiled, review-needed                  | 1          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / fsglpclcodes_staging`                     |
| `glaccountledger_staging`                  | table | profiled, review-needed                  | 1          | 31      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / glaccountledger_staging`                  |
| `glcalendar_staging`                       | table | profiled, review-needed                  | 1          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / glcalendar_staging`                       |
| `glcoa_staging`                            | table | profiled, review-needed                  | 1          | 38      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / glcoa_staging`                            |
| `gldept_staging`                           | table | profiled, review-needed                  | 1          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / gldept_staging`                           |
| `glfiscalyearend_staging`                  | table | profiled, review-needed                  | 1          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / glfiscalyearend_staging`                  |
| `glfiscalyearmap_staging`                  | table | profiled, review-needed                  | 1          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / glfiscalyearmap_staging`                  |
| `gljedetail_cur_staging`                   | table | profiled, review-needed                  | 6          | 43      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / gljedetail_cur_staging`                   |
| `gljeheader_staging`                       | table | profiled, review-needed                  | 2          | 38      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / gljeheader_staging`                       |
| `gljournalledger_staging`                  | table | profiled, review-needed                  | 1          | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / gljournalledger_staging`                  |
| `gljournalsetup_staging`                   | table | profiled, review-needed                  | 1          | 31      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / gljournalsetup_staging`                   |
| `glschedule_staging`                       | table | profiled, review-needed                  | 1          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / glschedule_staging`                       |
| `glschedulebalfwddetail_staging`           | table | profiled, review-needed                  | 1          | 42      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / glschedulebalfwddetail_staging`           |
| `glschedulechanges_staging`                | table | profiled, review-needed                  | 1          | 26      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / glschedulechanges_staging`                |
| `glschedulechangesdetail_staging`          | table | profiled, review-needed                  | 1          | 42      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / glschedulechangesdetail_staging`          |
| `glschedulesetup_staging`                  | table | profiled, review-needed                  | 1          | 53      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / glschedulesetup_staging`                  |
| `glschedulexref_staging`                   | table | profiled, review-needed                  | 2          | 31      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / glschedulexref_staging`                   |
| `glschedulexref_staging_Host`              | table | profiled, review-needed                  | 0          | 32      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / glschedulexref_staging_Host`              |
| `glschedulexrefbalfwd_staging`             | table | profiled, review-needed                  | 1          | 31      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / glschedulexrefbalfwd_staging`             |
| `glschedulexrefchanges_staging`            | table | profiled, review-needed                  | 1          | 31      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / glschedulexrefchanges_staging`            |
| `glstatcount_staging`                      | table | profiled, review-needed                  | 1          | 31      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / glstatcount_staging`                      |
| `inventoryvehicle_staging`                 | table | profiled, review-needed                  | 1          | 171     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / inventoryvehicle_staging`                 |
| `labortype_staging`                        | table | profiled, review-needed                  | 1          | 68      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / labortype_staging`                        |
| `miscellaneousnames_staging`               | table | profiled, review-needed                  | 1          | 78      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / miscellaneousnames_staging`               |
| `namefileevents_staging`                   | table | profiled, review-needed                  | 1          | 23      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / namefileevents_staging`                   |
| `odcgldetail_Staging`                      | table | profiled, review-needed                  | 1          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / odcgldetail_Staging`                      |
| `odcheader2_Staging`                       | table | profiled, review-needed                  | 1          | 31      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / odcheader2_Staging`                       |
| `opcodes_staging`                          | table | profiled, review-needed                  | 2          | 28      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / opcodes_staging`                          |
| `orgaddress_staging`                       | table | profiled, review-needed                  | 1          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / orgaddress_staging`                       |
| `orgname_staging`                          | table | profiled, review-needed                  | 1          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / orgname_staging`                          |
| `partsinventory_staging`                   | table | profiled, review-needed                  | 1          | 129     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / partsinventory_staging`                   |
| `partssales_staging`                       | table | profiled, review-needed                  | 1          | 42      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / partssales_staging`                       |
| `partssalesall_staging`                    | table | profiled, review-needed                  | 1          | 42      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / partssalesall_staging`                    |
| `partssalesdetail_staging`                 | table | profiled, review-needed                  | 1          | 30      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / partssalesdetail_staging`                 |
| `partssalesdetailall_staging`              | table | profiled, review-needed                  | 1          | 32      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / partssalesdetailall_staging`              |
| `pg_dm_download_run_staging`               | table | profiled, review-needed                  | 1          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / pg_dm_download_run_staging`               |
| `pg_load_job_status`                       | table | profiled, review-needed                  | 1          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / pg_load_job_status`                       |
| `PostGresLoadDateSync`                     | table | profiled, lineage-hotspot, review-needed | 1          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / PostGresLoadDateSync`                     |
| `PostgressDMSLoadHistory`                  | table | profiled, review-needed                  | 3          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / PostgressDMSLoadHistory`                  |
| `pricinggridsdetails_staging`              | table | profiled, review-needed                  | 1          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / pricinggridsdetails_staging`              |
| `pricinggridsheader_staging`               | table | profiled, review-needed                  | 1          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / pricinggridsheader_staging`               |
| `romlsdiscount32441_staging`               | table | profiled, review-needed                  | 0          | 27      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / romlsdiscount32441_staging`               |
| `rosourceaccounts_Staging`                 | table | profiled, review-needed                  | 1          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / rosourceaccounts_Staging`                 |
| `salefile_staging`                         | table | profiled, review-needed                  | 1          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / salefile_staging`                         |
| `servicesalesclosed_staging`               | table | profiled, review-needed                  | 3          | 101     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / servicesalesclosed_staging`               |
| `servicesalesdetailsopen_staging`          | table | profiled, review-needed                  | 1          | 39      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / servicesalesdetailsopen_staging`          |
| `servicesalesmlsclosed_staging`            | table | profiled, review-needed                  | 0          | 35      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / servicesalesmlsclosed_staging`            |
| `servicesalesmlsopen_staging`              | table | profiled, review-needed                  | 0          | 35      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / servicesalesmlsopen_staging`              |
| `servicesalesopen_staging`                 | table | profiled, review-needed                  | 1          | 77      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / servicesalesopen_staging`                 |
| `servicesalespartsclosed_PostStagingMerge` | table | profiled, review-needed                  | 2          | 48      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / servicesalespartsclosed_PostStagingMerge` |
| `servicesalespartsclosed_Staging`          | table | profiled, review-needed                  | 1          | 46      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / servicesalespartsclosed_Staging`          |
| `ServiceTimesDetail_Staging`               | table | profiled, review-needed                  | 0          | 23      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / ServiceTimesDetail_Staging`               |
| `vehicle_staging`                          | table | profiled, review-needed                  | 1          | 145     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / vehicle_staging`                          |
| `vehiclesalescurrent_staging`              | table | profiled, review-needed                  | 5          | 244     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / vehiclesalescurrent_staging`              |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-092:publish
```
