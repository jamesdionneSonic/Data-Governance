# T2B-057 Tier 2 Batch Publish Packet

## Purpose

This packet prepares a dry-run publish package for the next queued Tier 2 batch
from `docs/DATABASE_CATALOG_TIER2_BATCH_STRATEGY.md`.

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

Ready for review. Live publish requires explicit approval.

## Scope

| Signal                | Value           |
| --------------------- | --------------- |
| Batch                 | `T2B-057`       |
| Platform/Product      | `SQL Server`    |
| Database              | `SONICWEBV_VEH` |
| Schema                | `dbo`           |
| Object type scope     | `table`         |
| Object pages          | 9               |
| Link refresh pages    | 2               |
| Total planned entries | 13              |
| Validation status     | `passed`        |

## Object Pages

| Object                     | Type  | Tags                                               | Downstream | Columns | Confidence | Path                                                                                                  |
| -------------------------- | ----- | -------------------------------------------------- | ---------- | ------- | ---------- | ----------------------------------------------------------------------------------------------------- |
| `mps_decode_vehtype`       | table | profiled, review-needed                            | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SONICWEBV_VEH / dbo / mps_decode_vehtype`       |
| `mps_decode_vinattribute`  | table | profiled, review-needed                            | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SONICWEBV_VEH / dbo / mps_decode_vinattribute`  |
| `mps_decode_vinbody`       | table | profiled, review-needed                            | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SONICWEBV_VEH / dbo / mps_decode_vinbody`       |
| `mps_decode_vinbody_stage` | table | profiled, review-needed                            | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SONICWEBV_VEH / dbo / mps_decode_vinbody_stage` |
| `mps_decode_vinmake`       | table | profiled, review-needed                            | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SONICWEBV_VEH / dbo / mps_decode_vinmake`       |
| `mps_decode_vinmfr`        | table | profiled, review-needed                            | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SONICWEBV_VEH / dbo / mps_decode_vinmfr`        |
| `mps_decode_vinmodel`      | table | profiled, review-needed                            | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SONICWEBV_VEH / dbo / mps_decode_vinmodel`      |
| `mps_decode_vintrim`       | table | profiled, review-needed                            | 0          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SONICWEBV_VEH / dbo / mps_decode_vintrim`       |
| `veh_inventory`            | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / SONICWEBV_VEH / dbo / veh_inventory`            |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-057:publish
```
