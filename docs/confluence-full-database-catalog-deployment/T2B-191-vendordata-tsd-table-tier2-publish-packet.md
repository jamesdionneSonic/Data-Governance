# T2B-191 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-191`    |
| Platform/Product      | `SQL Server` |
| Database              | `VendorData` |
| Schema                | `tsd`        |
| Object type scope     | `table`      |
| Object pages          | 3            |
| Link refresh pages    | 2            |
| Total planned entries | 7            |
| Validation status     | `passed`     |

## Object Pages

| Object            | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                      |
| ----------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ----------------------------------------------------------------------------------------- |
| `Appointment`     | table | profiled, review-needed | 0          | 35      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / tsd / Appointment`     |
| `ClosedAgreement` | table | profiled, review-needed | 0          | 61      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / tsd / ClosedAgreement` |
| `Fleet`           | table | profiled, review-needed | 0          | 43      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / tsd / Fleet`           |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-191:publish
```
