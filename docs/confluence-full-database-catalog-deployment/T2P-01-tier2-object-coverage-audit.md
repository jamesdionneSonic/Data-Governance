# T2P-01 Tier 2 Object Coverage Audit

Generated: 2026-06-23T15:22:28.334Z

## Purpose

This report completes T2P-01 from
`docs/DATABASE_CATALOG_TIER2_OBJECT_COVERAGE_WORK_PACKETS.md`.

It audits current Tier 2 object-page coverage and writes a machine-readable
object coverage manifest. It does not publish to Confluence and it does not
cleanup, archive, delete, or move pages.

## Result

| Signal                                            | Value                                                                                          |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Publishable objects from schema evidence          | 5348                                                                                           |
| Generated current Tier 2 object pages             | 25                                                                                             |
| Live published objects found in existing readback | 25                                                                                             |
| Stale live published objects                      | 25                                                                                             |
| Missing Tier 2 object pages                       | 5323                                                                                           |
| High-use objects missing or stale                 | 187                                                                                            |
| Schemas with missing or stale objects             | 147                                                                                            |
| Machine-readable manifest                         | `docs/confluence-full-database-catalog-deployment/T2P-01-tier2-object-coverage-manifest.jsonl` |
| Local tooling copy                                | `data/confluence/tier2-object-coverage/t2p-01-object-coverage-manifest.json`                   |

## Interpretation

Tier 2 is not complete. The current dry-run output contains only the first 25
thin object pages, all for `SQL Server / Sonic_DW / dbo`. The existing live
readback also covers only those 25 objects, and it records the old flat parent
path `Database Catalog / Sonic_DW / dbo`, so those published pages are marked
`stale` until refreshed under the platform-grouped objective path.

The expected canonical path for all future Tier 2 pages is:

```text
Database Catalog / <Platform/Product> / <Database> / <Schema> / <Object>
```

## Coverage By Platform

| Platform     | Total | Missing | Generated | Stale | Published |
| ------------ | ----- | ------- | --------- | ----- | --------- |
| `Snowflake`  | 214   | 214     | 0         | 0     | 0         |
| `SQL Server` | 5134  | 5109    | 0         | 25    | 0         |

## Top Schemas With Missing Or Stale Tier 2 Pages

| Platform     | Database           | Schema      | Total | Missing | Stale | High-use missing/stale |
| ------------ | ------------------ | ----------- | ----- | ------- | ----- | ---------------------- |
| `SQL Server` | `eLeadDW_SF`       | `dbo`       | 136   | 136     | 0     | 64                     |
| `SQL Server` | `Sonic_DW`         | `dbo`       | 1418  | 1393    | 25    | 59                     |
| `SQL Server` | `ETL_Staging`      | `dbo`       | 885   | 885     | 0     | 16                     |
| `SQL Server` | `eLeadDW`          | `dbo`       | 55    | 55      | 0     | 11                     |
| `SQL Server` | `SIMS6200Retail`   | `dbo`       | 27    | 27      | 0     | 7                      |
| `SQL Server` | `ETL_Staging`      | `wrk`       | 414   | 414     | 0     | 4                      |
| `SQL Server` | `DMS`              | `dbo`       | 38    | 38      | 0     | 3                      |
| `SQL Server` | `SIMS6200_EP`      | `dbo`       | 26    | 26      | 0     | 3                      |
| `SQL Server` | `VehicleMart`      | `Chrome`    | 30    | 30      | 0     | 2                      |
| `SQL Server` | `GPA`              | `dbo`       | 12    | 12      | 0     | 2                      |
| `SQL Server` | `VendorData`       | `sonicdw`   | 5     | 5       | 0     | 2                      |
| `SQL Server` | `VehicleMart`      | `Stage`     | 4     | 4       | 0     | 2                      |
| `SQL Server` | `echoparkwebv_veh` | `dbo`       | 29    | 29      | 0     | 1                      |
| `SQL Server` | `Sonic_DW`         | `kpi`       | 12    | 12      | 0     | 1                      |
| `SQL Server` | `VendorData`       | `cba`       | 12    | 12      | 0     | 1                      |
| `SQL Server` | `SONICWEBV_VEH`    | `dbo`       | 9     | 9       | 0     | 1                      |
| `SQL Server` | `VendorData`       | `ga`        | 9     | 9       | 0     | 1                      |
| `SQL Server` | `SIMSRT`           | `dbo`       | 6     | 6       | 0     | 1                      |
| `SQL Server` | `VehicleMart`      | `BlackBook` | 4     | 4       | 0     | 1                      |
| `SQL Server` | `VehicleMart`      | `Final`     | 4     | 4       | 0     | 1                      |
| `SQL Server` | `CBS`              | `dbo`       | 3     | 3       | 0     | 1                      |
| `SQL Server` | `Sonic_Xref`       | `dbo`       | 3     | 3       | 0     | 1                      |
| `SQL Server` | `VendorData`       | `callrevu`  | 3     | 3       | 0     | 1                      |
| `SQL Server` | `SIMSEP`           | `dbo`       | 1     | 1       | 0     | 1                      |
| `SQL Server` | `StagingDB`        | `dbo`       | 325   | 325     | 0     | 0                      |

## First Missing Or Stale High-Use Objects

| Object                                   | Platform     | Status    | Downstream | Columns | Canonical Path                                                                                    |
| ---------------------------------------- | ------------ | --------- | ---------- | ------- | ------------------------------------------------------------------------------------------------- |
| `Sonic_DW.dbo.Dim_Entity`                | `SQL Server` | `stale`   | 329        | 121     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Entity`                |
| `Sonic_DW.dbo.Dim_Date`                  | `SQL Server` | `stale`   | 236        | 73      | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Date`                  |
| `Sonic_DW.dbo.DimEntityRelationship`     | `SQL Server` | `stale`   | 77         | 16      | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimEntityRelationship`     |
| `Sonic_DW.dbo.Dim_Vehicle`               | `SQL Server` | `stale`   | 74         | 49      | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Vehicle`               |
| `GPA.dbo.Violation`                      | `SQL Server` | `missing` | 66         | 5       | `Sonic Data Lineage / Database Catalog / SQL Server / GPA / dbo / Violation`                      |
| `eLeadDW.dbo.dwFullOpportunity`          | `SQL Server` | `missing` | 58         | 370     | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwFullOpportunity`          |
| `Sonic_DW.dbo.DimEntityRelationshipType` | `SQL Server` | `stale`   | 55         | 9       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimEntityRelationshipType` |
| `Sonic_DW.dbo.dim_FIGLAccounts`          | `SQL Server` | `stale`   | 52         | 10      | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_FIGLAccounts`          |
| `Sonic_DW.dbo.Dim_DMSCustomer`           | `SQL Server` | `stale`   | 51         | 70      | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_DMSCustomer`           |
| `Sonic_DW.dbo.Dim_DMSEmployee`           | `SQL Server` | `stale`   | 51         | 38      | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_DMSEmployee`           |
| `SONICWEBV_VEH.dbo.veh_inventory`        | `SQL Server` | `missing` | 51         | 3       | `Sonic Data Lineage / Database Catalog / SQL Server / SONICWEBV_VEH / dbo / veh_inventory`        |
| `Sonic_DW.dbo.vw_Dim_date`               | `SQL Server` | `missing` | 48         | 83      | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_Dim_date`               |
| `Sonic_DW.dbo.vw_GPA_RateCap_SRC`        | `SQL Server` | `stale`   | 48         | 28      | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_GPA_RateCap_SRC`        |
| `Sonic_DW.dbo.factFIRE`                  | `SQL Server` | `stale`   | 47         | 93      | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / factFIRE`                  |
| `GPA.dbo.AccountingDays`                 | `SQL Server` | `missing` | 46         | 5       | `Sonic Data Lineage / Database Catalog / SQL Server / GPA / dbo / AccountingDays`                 |
| `ETL_Staging.dbo.dwFullOpportunity`      | `SQL Server` | `missing` | 45         | 73      | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullOpportunity`      |
| `Sonic_DW.dbo.DimAssociate`              | `SQL Server` | `stale`   | 42         | 72      | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimAssociate`              |
| `eLeadDW.dbo.dwDiffCustomer_I`           | `SQL Server` | `missing` | 32         | 11      | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwDiffCustomer_I`           |
| `Sonic_DW.dbo.FBCustomAudience`          | `SQL Server` | `stale`   | 30         | 24      | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FBCustomAudience`          |
| `Sonic_DW.dbo.dim_DealType`              | `SQL Server` | `stale`   | 29         | 4       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_DealType`              |
| `Sonic_DW.dbo.FactOpportunity`           | `SQL Server` | `stale`   | 27         | 68      | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactOpportunity`           |
| `eLeadDW.dbo.dwFullCustomer`             | `SQL Server` | `missing` | 26         | 25      | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwFullCustomer`             |
| `SIMS6200Retail.dbo.Vehicle_Inventory`   | `SQL Server` | `missing` | 26         | 134     | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo / Vehicle_Inventory`   |
| `Sonic_DW.dbo.dim_Time`                  | `SQL Server` | `stale`   | 26         | 8       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_Time`                  |
| `DMS.dbo.dm_cora_account`                | `SQL Server` | `missing` | 25         | 17      | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / dm_cora_account`                |

## eLeadDW High-Use Examples

| Object                                 | Status    | Downstream | Columns | Canonical Path                                                                                  |
| -------------------------------------- | --------- | ---------- | ------- | ----------------------------------------------------------------------------------------------- |
| `eLeadDW.dbo.dwFullOpportunity`        | `missing` | 58         | 370     | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwFullOpportunity`        |
| `eLeadDW.dbo.dwDiffCustomer_I`         | `missing` | 32         | 11      | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwDiffCustomer_I`         |
| `eLeadDW.dbo.dwFullCustomer`           | `missing` | 26         | 25      | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwFullCustomer`           |
| `eLeadDW.dbo.dwFullVehicleSought`      | `missing` | 24         | 42      | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwFullVehicleSought`      |
| `eLeadDW.dbo.dwFullUser`               | `missing` | 22         | 61      | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwFullUser`               |
| `eLeadDW.dbo.CustomerMatchLookup`      | `missing` | 20         | 24      | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / CustomerMatchLookup`      |
| `eLeadDW.dbo.dwFullActivity`           | `missing` | 16         | 4       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwFullActivity`           |
| `eLeadDW.dbo.dwFullCompany`            | `missing` | 14         | 8       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwFullCompany`            |
| `eLeadDW.dbo.dwFullDealSalespersonMap` | `missing` | 14         | 82      | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwFullDealSalespersonMap` |
| `eLeadDW.dbo.Template`                 | `missing` | 14         | 28      | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / Template`                 |

## Stale Published Pilot Pages

| Object                                   | Page ID    | Current Generated Path                                                                            | Reason                                                                                                                                     |
| ---------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `Sonic_DW.dbo.Dim_Account`               | 2287305009 | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Account`               | Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted. |
| `Sonic_DW.dbo.Dim_AccountMgmt`           | 2287305033 | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_AccountMgmt`           | Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted. |
| `Sonic_DW.dbo.Dim_Date`                  | 2286518544 | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Date`                  | Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted. |
| `Sonic_DW.dbo.dim_DealType`              | 2287894743 | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_DealType`              | Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted. |
| `Sonic_DW.dbo.Dim_DMSCustomer`           | 2287698105 | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_DMSCustomer`           | Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted. |
| `Sonic_DW.dbo.Dim_DMSEmployee`           | 2287993038 | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_DMSEmployee`           | Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted. |
| `Sonic_DW.dbo.Dim_Entity`                | 2286682225 | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Entity`                | Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted. |
| `Sonic_DW.dbo.dim_FIGLAccounts`          | 2287599814 | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_FIGLAccounts`          | Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted. |
| `Sonic_DW.dbo.dim_Time`                  | 2287894767 | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_Time`                  | Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted. |
| `Sonic_DW.dbo.Dim_Vehicle`               | 2285764917 | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Vehicle`               | Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted. |
| `Sonic_DW.dbo.DimActivityType`           | 2287305057 | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimActivityType`           | Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted. |
| `Sonic_DW.dbo.DimAssociate`              | 2286518568 | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimAssociate`              | Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted. |
| `Sonic_DW.dbo.DimEntityRelationship`     | 2285764941 | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimEntityRelationship`     | Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted. |
| `Sonic_DW.dbo.DimEntityRelationshipType` | 2286715653 | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimEntityRelationshipType` | Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted. |
| `Sonic_DW.dbo.DimLeadStatus`             | 2287599838 | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimLeadStatus`             | Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted. |
| `Sonic_DW.dbo.DimOpportunitySource`      | 2288255159 | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimOpportunitySource`      | Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted. |
| `Sonic_DW.dbo.DimUpType`                 | 2288091423 | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimUpType`                 | Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted. |
| `Sonic_DW.dbo.dwDiffActivity_I`          | 2288025848 | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dwDiffActivity_I`          | Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted. |
| `Sonic_DW.dbo.Fact_Service`              | 2286223517 | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_Service`              | Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted. |
| `Sonic_DW.dbo.FactActivity`              | 2287993062 | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactActivity`              | Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted. |
| `Sonic_DW.dbo.factFIRE`                  | 2286223541 | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / factFIRE`                  | Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted. |
| `Sonic_DW.dbo.factFIRE_A`                | 2287305081 | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / factFIRE_A`                | Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted. |
| `Sonic_DW.dbo.FactOpportunity`           | 2287927574 | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactOpportunity`           | Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted. |
| `Sonic_DW.dbo.FBCustomAudience`          | 2287599862 | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FBCustomAudience`          | Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted. |
| `Sonic_DW.dbo.vw_GPA_RateCap_SRC`        | 2286223565 | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_GPA_RateCap_SRC`        | Existing readback states these pages were published under Database Catalog / Sonic_DW / dbo, before the platform/product path was adopted. |

## Validation

| Check                                    | Result |
| ---------------------------------------- | ------ |
| Schema objects found                     | passed |
| Generated versus published separated     | passed |
| Stale pilot artifacts distinguished      | passed |
| eLeadDW missing high-use examples listed | passed |
| Live Confluence publish avoided          | passed |
| Cleanup avoided                          | passed |

## Next Packet

Proceed with T2P-02 to add deterministic link status to schema/database evidence,
then T2P-03 for the first complete one-schema dry run. The suggested first
schema remains `SQL Server / eLeadDW / dbo` because it contains
`dwFullOpportunity` and other high-use objects that currently lack current
Tier 2 pages.
