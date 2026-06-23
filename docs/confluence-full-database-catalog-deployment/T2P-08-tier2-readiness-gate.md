# T2P-08 Tier 2 Readiness Gate

## Purpose

This gate prevents Tier 2 from being called complete until every publishable
object is live under the platform-grouped path or is explicitly blocked.

It is read-only. It does not publish to Confluence, regenerate the full catalog,
archive, delete, move, or clean up pages.

## Decision

Tier 2 is not complete. Continue publishing reviewed packets and queued batches before declaring completion.

## Coverage Summary

| Signal                                  | Value |
| --------------------------------------- | ----: |
| Publishable Tier 2 objects              |  5348 |
| Current live platform-path object pages |     0 |
| Current stale live object pages         |    25 |
| Reviewed pending object pages           |    80 |
| Remaining after pending packets publish |  5268 |
| Blocked human-catalog objects           |     6 |
| Queued batches after current gate       |   245 |

## Status Counts

| Status    | Count |
| --------- | ----- |
| `missing` | 5323  |
| `stale`   | 25    |

## Pending Packets

| Packet   | Status                                    | Objects | Scope                                     |
| -------- | ----------------------------------------- | ------- | ----------------------------------------- |
| `T2P-04` | publish pending explicit approval         | 55      | SQL Server / eLeadDW / dbo                |
| `T2P-06` | refresh publish pending explicit approval | 25      | SQL Server / Sonic_DW / dbo pilot refresh |
| `T2P-07` | Rovo publish pending explicit approval    | 0       | AI Retrieval Artifacts link alignment     |

## Top Remaining Schemas After Pending Packets

| Platform     | Database           | Schema      | Remaining | High-use | Downstream |
| ------------ | ------------------ | ----------- | --------- | -------- | ---------- |
| `SQL Server` | `eLeadDW_SF`       | `dbo`       | 136       | 64       | 1074       |
| `SQL Server` | `Sonic_DW`         | `dbo`       | 1393      | 34       | 1782       |
| `SQL Server` | `ETL_Staging`      | `dbo`       | 885       | 16       | 908        |
| `SQL Server` | `SIMS6200Retail`   | `dbo`       | 27        | 7        | 178        |
| `SQL Server` | `ETL_Staging`      | `wrk`       | 414       | 4        | 373        |
| `SQL Server` | `DMS`              | `dbo`       | 38        | 3        | 171        |
| `SQL Server` | `SIMS6200_EP`      | `dbo`       | 26        | 3        | 138        |
| `SQL Server` | `GPA`              | `dbo`       | 12        | 2        | 138        |
| `SQL Server` | `VehicleMart`      | `Chrome`    | 30        | 2        | 30         |
| `SQL Server` | `VendorData`       | `sonicdw`   | 5         | 2        | 30         |
| `SQL Server` | `VehicleMart`      | `Stage`     | 4         | 2        | 24         |
| `SQL Server` | `echoparkwebv_veh` | `dbo`       | 29        | 1        | 77         |
| `SQL Server` | `SONICWEBV_VEH`    | `dbo`       | 9         | 1        | 67         |
| `SQL Server` | `SIMSRT`           | `dbo`       | 6         | 1        | 36         |
| `SQL Server` | `Sonic_DW`         | `kpi`       | 12        | 1        | 30         |
| `SQL Server` | `CBS`              | `dbo`       | 3         | 1        | 28         |
| `SQL Server` | `VehicleMart`      | `Final`     | 4         | 1        | 25         |
| `SQL Server` | `SIMSEP`           | `dbo`       | 1         | 1        | 24         |
| `SQL Server` | `VendorData`       | `ga`        | 9         | 1        | 21         |
| `SQL Server` | `Sonic_Xref`       | `dbo`       | 3         | 1        | 21         |
| `SQL Server` | `VendorData`       | `cba`       | 12        | 1        | 16         |
| `SQL Server` | `VehicleMart`      | `BlackBook` | 4         | 1        | 16         |
| `SQL Server` | `VendorData`       | `callrevu`  | 3         | 1        | 10         |
| `SQL Server` | `ETL_Staging`      | `stage`     | 169       | 0        | 159        |
| `SQL Server` | `VendorData`       | `dbo`       | 161       | 0        | 125        |

## Top Remaining Objects After Pending Packets

| Object                                          | Status  | Downstream | Columns | Path                                                                                                     |
| ----------------------------------------------- | ------- | ---------- | ------- | -------------------------------------------------------------------------------------------------------- |
| `GPA.dbo.Violation`                             | missing | 66         | 5       | `Sonic Data Lineage / Database Catalog / SQL Server / GPA / dbo / Violation`                             |
| `SONICWEBV_VEH.dbo.veh_inventory`               | missing | 51         | 3       | `Sonic Data Lineage / Database Catalog / SQL Server / SONICWEBV_VEH / dbo / veh_inventory`               |
| `Sonic_DW.dbo.vw_Dim_date`                      | missing | 48         | 83      | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_Dim_date`                      |
| `GPA.dbo.AccountingDays`                        | missing | 46         | 5       | `Sonic Data Lineage / Database Catalog / SQL Server / GPA / dbo / AccountingDays`                        |
| `ETL_Staging.dbo.dwFullOpportunity`             | missing | 45         | 73      | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullOpportunity`             |
| `SIMS6200Retail.dbo.Vehicle_Inventory`          | missing | 26         | 134     | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / Vehicle_Inventory`          |
| `ETL_Staging.dbo.dwFullActivity`                | missing | 25         | 37      | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullActivity`                |
| `DMS.dbo.dm_cora_account`                       | missing | 25         | 17      | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / dm_cora_account`                       |
| `ETL_Staging.dbo.dwFullVehicleSought`           | missing | 24         | 24      | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullVehicleSought`           |
| `CBS.dbo.Template`                              | missing | 24         | 116     | `Sonic Data Lineage / Database Catalog / SQL Server / CBS / dbo / Template`                              |
| `SIMSEP.dbo.Book`                               | missing | 24         | 30      | `Sonic Data Lineage / Database Catalog / SQL Server / SIMSEP / dbo / Book`                               |
| `ETL_Staging.wrk.eLead_liveDealers`             | missing | 23         | 5       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / eLead_liveDealers`             |
| `eLeadDW_SF.dbo.dwFullEmail`                    | missing | 22         | 6       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullEmail`                    |
| `ETL_Staging.dbo.pLoadDailyDiff`                | missing | 21         | 0       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / pLoadDailyDiff`                |
| `ETL_Staging.dbo.pLoadDailyDiff_with_ETL_stamp` | missing | 21         | 0       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / pLoadDailyDiff_with_ETL_stamp` |
| `eLeadDW_SF.dbo.dwDiffCustomer_D`               | missing | 20         | 2       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffCustomer_D`               |
| `ETL_Staging.dbo.dwDiffPhone_U`                 | missing | 20         | 14      | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffPhone_U`                 |
| `Sonic_DW.kpi.Dim_KPIMetrics`                   | missing | 20         | 13      | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / kpi / Dim_KPIMetrics`                   |
| `VendorData.ga.GoogleAnalyticsReport`           | missing | 20         | 0       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / ga / GoogleAnalyticsReport`           |
| `Sonic_DW.dbo.usp_DimVehicle`                   | missing | 19         | 0       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / usp_DimVehicle`                   |
| `VehicleMart.Final.Vehicle`                     | missing | 19         | 9       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Final / Vehicle`                     |
| `ETL_Staging.dbo.dwFullVehicle`                 | missing | 19         | 89      | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullVehicle`                 |
| `Sonic_DW.dbo.vw_Dim_EntityEP`                  | missing | 19         | 74      | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_Dim_EntityEP`                  |
| `ETL_Staging.dbo.dwDiffActivity_U`              | missing | 18         | 35      | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffActivity_U`              |
| `eLeadDW_SF.dbo.dwDiffCustomer_U`               | missing | 18         | 1       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffCustomer_U`               |
| `eLeadDW_SF.dbo.dwDiffEmail_I`                  | missing | 18         | 11      | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffEmail_I`                  |
| `eLeadDW_SF.dbo.dwDiffEmail_U`                  | missing | 18         | 12      | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffEmail_U`                  |
| `eLeadDW_SF.dbo.dwDiffPhone_I`                  | missing | 18         | 13      | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffPhone_I`                  |
| `ETL_Staging.dbo.dwDiffDealSalespersonMap_U`    | missing | 18         | 9       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffDealSalespersonMap_U`    |
| `ETL_Staging.dbo.dwDiffLegacyCustomerID_U`      | missing | 18         | 8       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffLegacyCustomerID_U`      |
| `ETL_Staging.dbo.dwDiffLegacyEmployeeID_U`      | missing | 18         | 8       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffLegacyEmployeeID_U`      |
| `ETL_Staging.dbo.dwDiffOpportunity_U`           | missing | 18         | 71      | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffOpportunity_U`           |
| `ETL_Staging.dbo.dwDiffVehicle_U`               | missing | 18         | 87      | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffVehicle_U`               |
| `ETL_Staging.dbo.dwDiffVehicleSought_U`         | missing | 18         | 22      | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffVehicleSought_U`         |
| `eLeadDW_SF.dbo.dwDiffActivity_D`               | missing | 16         | 2       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffActivity_D`               |
| `eLeadDW_SF.dbo.dwDiffAudit_I`                  | missing | 16         | 10      | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffAudit_I`                  |
| `eLeadDW_SF.dbo.dwDiffCompanyChildCompanyMap_D` | missing | 16         | 2       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffCompanyChildCompanyMap_D` |
| `eLeadDW_SF.dbo.dwDiffCompanyChildCompanyMap_I` | missing | 16         | 3       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffCompanyChildCompanyMap_I` |
| `eLeadDW_SF.dbo.dwDiffCompanyHierarchy_D`       | missing | 16         | 2       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffCompanyHierarchy_D`       |
| `eLeadDW_SF.dbo.dwDiffCompanyHierarchy_I`       | missing | 16         | 9       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffCompanyHierarchy_I`       |
| `eLeadDW_SF.dbo.dwDiffCompanyOption_D`          | missing | 16         | 2       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffCompanyOption_D`          |
| `eLeadDW_SF.dbo.dwDiffCompanyOption_I`          | missing | 16         | 9       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffCompanyOption_I`          |
| `eLeadDW_SF.dbo.dwDiffCompanySource_D`          | missing | 16         | 2       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffCompanySource_D`          |
| `eLeadDW_SF.dbo.dwDiffCompanySource_I`          | missing | 16         | 11      | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffCompanySource_I`          |
| `eLeadDW_SF.dbo.dwDiffCustomer_I`               | missing | 16         | 77      | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffCustomer_I`               |
| `eLeadDW_SF.dbo.dwDiffDaylightSavingTime_D`     | missing | 16         | 2       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffDaylightSavingTime_D`     |
| `eLeadDW_SF.dbo.dwDiffDaylightSavingTime_I`     | missing | 16         | 3       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffDaylightSavingTime_I`     |
| `eLeadDW_SF.dbo.dwDiffDealerProgram_D`          | missing | 16         | 2       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffDealerProgram_D`          |
| `eLeadDW_SF.dbo.dwDiffDealerProgram_I`          | missing | 16         | 17      | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffDealerProgram_I`          |
| `eLeadDW_SF.dbo.dwDiffDealSalespersonMap_D`     | missing | 16         | 2       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffDealSalespersonMap_D`     |

## Validation

- No validation failures.

## Next Work

1. Live publish is still pending for T2P-04 and T2P-06 if approved.
2. After those publish and pass readback, rerun this gate to lower remaining counts.
3. Continue with the next queued Tier 2 batches from T2P-05.
