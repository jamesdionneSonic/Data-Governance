# T2B-132 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-132`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `etl`        |
| Object type scope     | `table`      |
| Object pages          | 7            |
| Link refresh pages    | 2            |
| Total planned entries | 11           |
| Validation status     | `passed`     |

## Object Pages

| Object                                        | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                 |
| --------------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | -------------------------------------------------------------------------------------------------------------------- |
| `bodyshop_staging`                            | table | profiled, review-needed | 1          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / etl / bodyshop_staging`                            |
| `entity_complete_staging_tmp`                 | table | profiled, review-needed | 0          | 58      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / etl / entity_complete_staging_tmp`                 |
| `entity_other_staging`                        | table | profiled, review-needed | 2          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / etl / entity_other_staging`                        |
| `entity_share_staging`                        | table | profiled, review-needed | 0          | 41      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / etl / entity_share_staging`                        |
| `entity_staging`                              | table | profiled, review-needed | 0          | 48      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / etl / entity_staging`                              |
| `entity_staging_compllete`                    | table | profiled, review-needed | 0          | 59      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / etl / entity_staging_compllete`                    |
| `zzzzz_etl.entity_other_staging_bak_20110622` | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / etl / zzzzz_etl.entity_other_staging_bak_20110622` |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-132:publish
```
