# T2B-158 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-158`    |
| Platform/Product      | `SQL Server` |
| Database              | `VendorData` |
| Schema                | `recon`      |
| Object type scope     | `table`      |
| Object pages          | 14           |
| Link refresh pages    | 2            |
| Total planned entries | 18           |
| Validation status     | `passed`     |

## Object Pages

| Object                         | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                     |
| ------------------------------ | ----- | ----------------------- | ---------- | ------- | ---------- | -------------------------------------------------------------------------------------------------------- |
| `DirtReport_WIP`               | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / recon / DirtReport_WIP`               |
| `Documents`                    | table | profiled, review-needed | 0          | 25      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / recon / Documents`                    |
| `InspectionVehicles`           | table | profiled, review-needed | 0          | 59      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / recon / InspectionVehicles`           |
| `LocationWorkingHours`         | table | profiled, review-needed | 0          | 53      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / recon / LocationWorkingHours`         |
| `NetworkPeriods`               | table | profiled, review-needed | 0          | 20      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / recon / NetworkPeriods`               |
| `OrderLogs`                    | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / recon / OrderLogs`                    |
| `OrderPhases`                  | table | profiled, review-needed | 1          | 35      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / recon / OrderPhases`                  |
| `OrderServices`                | table | profiled, review-needed | 0          | 87      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / recon / OrderServices`                |
| `OrderServices_Backup20230209` | table | profiled, review-needed | 0          | 87      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / recon / OrderServices_Backup20230209` |
| `OrderVehicles`                | table | profiled, review-needed | 1          | 74      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / recon / OrderVehicles`                |
| `PhaseAggregators`             | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / recon / PhaseAggregators`             |
| `ServiceOrderQuestions`        | table | profiled, review-needed | 0          | 28      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / recon / ServiceOrderQuestions`        |
| `ServiceReqServices`           | table | profiled, review-needed | 0          | 25      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / recon / ServiceReqServices`           |
| `TechnicianDetails`            | table | profiled, review-needed | 0          | 20      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / recon / TechnicianDetails`            |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-158:publish
```
