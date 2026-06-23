# T2B-116 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-116`    |
| Platform/Product      | `SQL Server` |
| Database              | `VendorData` |
| Schema                | `uccx`       |
| Object type scope     | `table`      |
| Object pages          | 10           |
| Link refresh pages    | 2            |
| Total planned entries | 14           |
| Validation status     | `passed`     |

## Object Pages

| Object                  | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                             |
| ----------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------ |
| `AgentConnectionDetail` | table | profiled, review-needed | 0          | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / uccx / AgentConnectionDetail` |
| `ContactCallDetail`     | table | profiled, review-needed | 0          | 53      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / uccx / ContactCallDetail`     |
| `ContactQueueDetail`    | table | profiled, review-needed | 0          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / uccx / ContactQueueDetail`    |
| `ContactRoutingDetail`  | table | profiled, review-needed | 0          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / uccx / ContactRoutingDetail`  |
| `ContactServiceQueue`   | table | profiled, review-needed | 0          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / uccx / ContactServiceQueue`   |
| `ProfileIDMapping`      | table | profiled, review-needed | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / uccx / ProfileIDMapping`      |
| `Resource`              | table | profiled, review-needed | 0          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / uccx / Resource`              |
| `ResourceGroup`         | table | profiled, review-needed | 0          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / uccx / ResourceGroup`         |
| `Team`                  | table | profiled, review-needed | 0          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / uccx / Team`                  |
| `TeamCSQMapping`        | table | profiled, review-needed | 0          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / uccx / TeamCSQMapping`        |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-116:publish
```
