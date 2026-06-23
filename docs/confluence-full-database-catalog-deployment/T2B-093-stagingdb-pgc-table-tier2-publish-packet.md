# T2B-093 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-093`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `pgc`        |
| Object type scope     | `table`      |
| Object pages          | 52           |
| Link refresh pages    | 2            |
| Total planned entries | 56           |
| Validation status     | `passed`     |

## Object Pages

| Object                                                     | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                              |
| ---------------------------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `ADP_StagingExceptions`                                    | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / ADP_StagingExceptions`                                    |
| `BodyShop_LookUp`                                          | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / BodyShop_LookUp`                                          |
| `customer_staging_9`                                       | table | profiled, review-needed | 0          | 354     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / customer_staging_9`                                       |
| `customer_staging_errorlist`                               | table | profiled, review-needed | 0          | 462     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / customer_staging_errorlist`                               |
| `customer_staging_new`                                     | table | profiled, review-needed | 0          | 148     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / customer_staging_new`                                     |
| `customercomments_staging`                                 | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / customercomments_staging`                                 |
| `date_temp`                                                | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / date_temp`                                                |
| `entity_staging`                                           | table | profiled, review-needed | 0          | 48      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / entity_staging`                                           |
| `etccalendar_staging`                                      | table | profiled, review-needed | 1          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / etccalendar_staging`                                      |
| `etcdata_staging`                                          | table | profiled, review-needed | 1          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / etcdata_staging`                                          |
| `etctrans_staging`                                         | table | profiled, review-needed | 1          | 38      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / etctrans_staging`                                         |
| `etctrans_staging_errorout`                                | table | profiled, review-needed | 0          | 86      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / etctrans_staging_errorout`                                |
| `etctranshist_staging`                                     | table | profiled, review-needed | 1          | 38      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / etctranshist_staging`                                     |
| `glcoa_Cora_exclude`                                       | table | profiled, review-needed | 0          | 34      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / glcoa_Cora_exclude`                                       |
| `gljedetail_arc_staging`                                   | table | profiled, review-needed | 0          | 33      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / gljedetail_arc_staging`                                   |
| `gljedetail_cur_SIMS_staging`                              | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / gljedetail_cur_SIMS_staging`                              |
| `gljedetail_cur_staging_tmp`                               | table | profiled, review-needed | 0          | 33      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / gljedetail_cur_staging_tmp`                               |
| `gljedetail_cur_staging_tmp_c167`                          | table | profiled, review-needed | 0          | 33      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / gljedetail_cur_staging_tmp_c167`                          |
| `gljeDetail_Staging_Temp`                                  | table | profiled, review-needed | 0          | 57      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / gljeDetail_Staging_Temp`                                  |
| `odcdetail_Staging`                                        | table | profiled, review-needed | 1          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / odcdetail_Staging`                                        |
| `odcheader_Staging`                                        | table | profiled, review-needed | 0          | 52      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / odcheader_Staging`                                        |
| `pg_dm_download_run_staging_bak`                           | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / pg_dm_download_run_staging_bak`                           |
| `pg_Load_UDI_status_staging`                               | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / pg_Load_UDI_status_staging`                               |
| `PostgresDMSLoadHistoryErrorOut`                           | table | profiled, review-needed | 0          | 23      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / PostgresDMSLoadHistoryErrorOut`                           |
| `PostgressDMSLoadHistory_4Dev`                             | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / PostgressDMSLoadHistory_4Dev`                             |
| `servicesalesdetailsclosed_staging`                        | table | profiled, review-needed | 1          | 81      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / servicesalesdetailsclosed_staging`                        |
| `servicesalesdetailsclosed_staging_ErrorOut`               | table | profiled, review-needed | 0          | 42      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / servicesalesdetailsclosed_staging_ErrorOut`               |
| `ServiceTimesDetail_Staging_old`                           | table | profiled, review-needed | 0          | 23      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / ServiceTimesDetail_Staging_old`                           |
| `sourceaccts_Staging`                                      | table | profiled, review-needed | 1          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / sourceaccts_Staging`                                      |
| `story_staging`                                            | table | profiled, review-needed | 1          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / story_staging`                                            |
| `tblbadrecords_NotExists`                                  | table | profiled, review-needed | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / tblbadrecords_NotExists`                                  |
| `tblbadrecords_staging`                                    | table | profiled, review-needed | 1          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / tblbadrecords_staging`                                    |
| `tblbadrecords_staging_error`                              | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / tblbadrecords_staging_error`                              |
| `tblbadrecords_staging_old`                                | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / tblbadrecords_staging_old`                                |
| `tblperformance`                                           | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / tblperformance`                                           |
| `tblperformance_staging`                                   | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / tblperformance_staging`                                   |
| `technician_Staging`                                       | table | profiled, review-needed | 1          | 23      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / technician_Staging`                                       |
| `TestPostgresStatusOutput`                                 | table | profiled, review-needed | 0          | 21      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / TestPostgresStatusOutput`                                 |
| `vehiclesales_staging`                                     | table | profiled, review-needed | 1          | 145     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / vehiclesales_staging`                                     |
| `vehiclesales29459_staging`                                | table | profiled, review-needed | 1          | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / vehiclesales29459_staging`                                |
| `vendor_staging`                                           | table | profiled, review-needed | 1          | 41      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / vendor_staging`                                           |
| `weowe_staging`                                            | table | profiled, review-needed | 1          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / weowe_staging`                                            |
| `zzzzz_pgc.appointments_staging_rev`                       | table | profiled, review-needed | 0          | 99      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / zzzzz_pgc.appointments_staging_rev`                       |
| `zzzzz_pgc.appointments_staging_rev2`                      | table | profiled, review-needed | 0          | 56      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / zzzzz_pgc.appointments_staging_rev2`                      |
| `zzzzz_pgc.customer_staging_new_20110720`                  | table | profiled, review-needed | 0          | 148     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / zzzzz_pgc.customer_staging_new_20110720`                  |
| `zzzzz_pgc.PostGresLoadDateSync_01112016`                  | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / zzzzz_pgc.PostGresLoadDateSync_01112016`                  |
| `zzzzz_pgc.PostgresLoadDateSync_2016_08_14`                | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / zzzzz_pgc.PostgresLoadDateSync_2016_08_14`                |
| `zzzzz_pgc.PostGresLoadDateSync_old`                       | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / zzzzz_pgc.PostGresLoadDateSync_old`                       |
| `zzzzz_pgc.PostgressDMSLoadHistory_08222016`               | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / zzzzz_pgc.PostgressDMSLoadHistory_08222016`               |
| `zzzzz_pgc.PostgressDMSLoadHistory_old`                    | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / zzzzz_pgc.PostgressDMSLoadHistory_old`                    |
| `zzzzz_pgc.servicesalesclosed_staging_20100602`            | table | profiled, review-needed | 0          | 77      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / zzzzz_pgc.servicesalesclosed_staging_20100602`            |
| `zzzzz_pgc.servicesalesdetailsclosed_staging_bak_20111201` | table | profiled, review-needed | 0          | 39      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc / zzzzz_pgc.servicesalesdetailsclosed_staging_bak_20111201` |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-093:publish
```
