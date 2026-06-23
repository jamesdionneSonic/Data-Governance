# T2B-167 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-167`    |
| Platform/Product      | `SQL Server` |
| Database              | `Sonic_DW`   |
| Schema                | `mstrtemp`   |
| Object type scope     | `table`      |
| Object pages          | 35           |
| Link refresh pages    | 2            |
| Total planned entries | 39           |
| Validation status     | `passed`     |

## Object Pages

| Object           | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                        |
| ---------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------- |
| `TT829IST0MD001` | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TT829IST0MD001` |
| `TT962GL4GMD002` | table | profiled, review-needed | 0          | 100     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TT962GL4GMD002` |
| `TTAK1ILBHMD002` | table | profiled, review-needed | 0          | 100     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TTAK1ILBHMD002` |
| `TTK013M9LMD003` | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TTK013M9LMD003` |
| `TTM01O5D1MD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TTM01O5D1MD000` |
| `TUA175F4MMD001` | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TUA175F4MMD001` |
| `TUC0BFK3AMD001` | table | profiled, review-needed | 0          | 65      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TUC0BFK3AMD001` |
| `TUR5KI074MD001` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TUR5KI074MD001` |
| `TURDSKXQHMD000` | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TURDSKXQHMD000` |
| `TUVYBRHONMD001` | table | profiled, review-needed | 0          | 65      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TUVYBRHONMD001` |
| `TUW01RTEJMD003` | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TUW01RTEJMD003` |
| `TV5DK00GIMD001` | table | profiled, review-needed | 0          | 62      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TV5DK00GIMD001` |
| `TVO9LMSYPMD001` | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TVO9LMSYPMD001` |
| `TW25XN0Z6MD001` | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TW25XN0Z6MD001` |
| `TW801NQ0WMD001` | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TW801NQ0WMD001` |
| `TWBF66LC0MD000` | table | profiled, review-needed | 0          | 67      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TWBF66LC0MD000` |
| `TWGFQMOWWMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TWGFQMOWWMD000` |
| `TWXL6G9L0MD001` | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TWXL6G9L0MD001` |
| `TX5T8STHSMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TX5T8STHSMD000` |
| `TX8HCDGOOMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TX8HCDGOOMD000` |
| `TXCQRBQLMMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TXCQRBQLMMD000` |
| `TXIJFV8IRMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TXIJFV8IRMD000` |
| `TXOKRG7D4MD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TXOKRG7D4MD000` |
| `TXORFSXLCMD000` | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TXORFSXLCMD000` |
| `TXPQWPKJEMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TXPQWPKJEMD000` |
| `TXXF079PGMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TXXF079PGMD000` |
| `TY0011AEDMD001` | table | profiled, review-needed | 0          | 89      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TY0011AEDMD001` |
| `TY29TIVDGMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TY29TIVDGMD000` |
| `TYG01NJ34MD000` | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TYG01NJ34MD000` |
| `TYU01ZAN0MD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TYU01ZAN0MD000` |
| `TYW01EBIRMD000` | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TYW01EBIRMD000` |
| `TZ2U4IBHEMD001` | table | profiled, review-needed | 0          | 67      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TZ2U4IBHEMD001` |
| `TZCZ11CWAMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TZCZ11CWAMD000` |
| `TZN5JW9XCMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TZN5JW9XCMD000` |
| `TZSENX850MD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TZSENX850MD000` |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-167:publish
```
