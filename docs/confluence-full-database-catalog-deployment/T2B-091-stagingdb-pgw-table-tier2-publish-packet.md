# T2B-091 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-091`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `pgw`        |
| Object type scope     | `table`      |
| Object pages          | 3            |
| Link refresh pages    | 2            |
| Total planned entries | 7            |
| Validation status     | `passed`     |

## Object Pages

| Object                                 | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                          |
| -------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| `webV_personnels`                      | table | profiled, review-needed | 0          | 98      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / webV_personnels`                      |
| `webv_personnels_MatchStaging`         | table | profiled, review-needed | 0          | 98      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / webv_personnels_MatchStaging`         |
| `zzzzz_pgw.veh_inventory_staging_2017` | table | profiled, review-needed | 0          | 156     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / zzzzz_pgw.veh_inventory_staging_2017` |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-091:publish
```
