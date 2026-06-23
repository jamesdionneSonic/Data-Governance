# T2B-185 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-185`    |
| Platform/Product      | `SQL Server` |
| Database              | `VendorData` |
| Schema                | `uipath`     |
| Object type scope     | `table`      |
| Object pages          | 4            |
| Link refresh pages    | 2            |
| Total planned entries | 8            |
| Validation status     | `passed`     |

## Object Pages

| Object                        | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                     |
| ----------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | -------------------------------------------------------------------------------------------------------- |
| `CarNowDailyAgentReport`      | table | profiled, review-needed | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / uipath / CarNowDailyAgentReport`      |
| `CarNowDailyDealershipReport` | table | profiled, review-needed | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / uipath / CarNowDailyDealershipReport` |
| `EleadAppointmentActivity`    | table | profiled, review-needed | 0          | 28      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / uipath / EleadAppointmentActivity`    |
| `EleadTaskDueDateChanged`     | table | profiled, review-needed | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / uipath / EleadTaskDueDateChanged`     |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-185:publish
```
