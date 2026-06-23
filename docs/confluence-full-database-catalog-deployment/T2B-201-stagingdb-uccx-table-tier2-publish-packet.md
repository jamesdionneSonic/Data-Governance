# T2B-201 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-201`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `uccx`       |
| Object type scope     | `table`      |
| Object pages          | 10           |
| Link refresh pages    | 2            |
| Total planned entries | 14           |
| Validation status     | `passed`     |

## Object Pages

| Object                  | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                            |
| ----------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ----------------------------------------------------------------------------------------------- |
| `AgentConnectionDetail` | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / uccx / AgentConnectionDetail` |
| `ContactCallDetail`     | table | profiled, review-needed | 0          | 45      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / uccx / ContactCallDetail`     |
| `ContactQueueDetail`    | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / uccx / ContactQueueDetail`    |
| `ContactRoutingDetail`  | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / uccx / ContactRoutingDetail`  |
| `ContactServiceQueue`   | table | profiled, review-needed | 0          | 28      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / uccx / ContactServiceQueue`   |
| `ProfileIDMapping`      | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / uccx / ProfileIDMapping`      |
| `Resource`              | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / uccx / Resource`              |
| `ResourceGroup`         | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / uccx / ResourceGroup`         |
| `Team`                  | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / uccx / Team`                  |
| `TeamCSQMapping`        | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / uccx / TeamCSQMapping`        |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-201:publish
```
