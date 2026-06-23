# T2B-054 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-054`    |
| Platform/Product      | `SQL Server` |
| Database              | `VendorData` |
| Schema                | `sonicdw`    |
| Object type scope     | `table`      |
| Object pages          | 5            |
| Link refresh pages    | 2            |
| Total planned entries | 9            |
| Validation status     | `passed`     |

## Object Pages

| Object                      | Type  | Tags                              | Downstream | Columns | Confidence | Path                                                                                                    |
| --------------------------- | ----- | --------------------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------- |
| `Dim_Date`                  | table | high-use, profiled, review-needed | 10         | 73      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / sonicdw / Dim_Date`                  |
| `Dim_Entity`                | table | profiled, review-needed           | 4          | 121     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / sonicdw / Dim_Entity`                |
| `DimEntityRelationship`     | table | high-use, profiled, review-needed | 10         | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / sonicdw / DimEntityRelationship`     |
| `DimEntityRelationshipType` | table | profiled, review-needed           | 6          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / sonicdw / DimEntityRelationshipType` |
| `vw_Dim_date`               | table | profiled, review-needed           | 0          | 76      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / sonicdw / vw_Dim_date`               |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-054:publish
```
