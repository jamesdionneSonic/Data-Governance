# T2B-195 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-195`    |
| Platform/Product      | `SQL Server` |
| Database              | `VendorData` |
| Schema                | `buyer`      |
| Object type scope     | `table`      |
| Object pages          | 15           |
| Link refresh pages    | 2            |
| Total planned entries | 19           |
| Validation status     | `passed`     |

## Object Pages

| Object                              | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                          |
| ----------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| `AppDirectSitesVINsHeader`          | table | profiled, review-needed | 0          | 44      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / buyer / AppDirectSitesVINsHeader`          |
| `AppDirectSitesVINsLine`            | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / buyer / AppDirectSitesVINsLine`            |
| `AuctionAndDirectSitesExecutions`   | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / buyer / AuctionAndDirectSitesExecutions`   |
| `CarfaxVINs`                        | table | profiled, review-needed | 0          | 39      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / buyer / CarfaxVINs`                        |
| `CBAPurchasesByVIN`                 | table | profiled, review-needed | 0          | 57      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / buyer / CBAPurchasesByVIN`                 |
| `CompetitorAppraisals_LogTable`     | table | profiled, review-needed | 0          | 58      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / buyer / CompetitorAppraisals_LogTable`     |
| `CriticalDataHolding`               | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / buyer / CriticalDataHolding`               |
| `Dim_DNBReason`                     | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / buyer / Dim_DNBReason`                     |
| `DirectSitesVINsHeader`             | table | profiled, review-needed | 0          | 44      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / buyer / DirectSitesVINsHeader`             |
| `DirectSitesVINsLine`               | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / buyer / DirectSitesVINsLine`               |
| `LiveAuctionVINs`                   | table | profiled, review-needed | 0          | 25      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / buyer / LiveAuctionVINs`                   |
| `TXN_DirectSitePreviewList`         | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / buyer / TXN_DirectSitePreviewList`         |
| `TXN_DirectSitePreviewList_History` | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / buyer / TXN_DirectSitePreviewList_History` |
| `VINsProcByAutomation`              | table | profiled, review-needed | 0          | 38      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / buyer / VINsProcByAutomation`              |
| `VINToBuyer`                        | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / buyer / VINToBuyer`                        |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-195:publish
```
