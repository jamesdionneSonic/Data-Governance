# T2B-210 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-210`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `mdp`        |
| Object type scope     | `table`      |
| Object pages          | 5            |
| Link refresh pages    | 2            |
| Total planned entries | 9            |
| Validation status     | `passed`     |

## Object Pages

| Object                      | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                               |
| --------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | -------------------------------------------------------------------------------------------------- |
| `DMSOrgIDxref`              | table | profiled, review-needed | 7          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / mdp / DMSOrgIDxref`              |
| `DMSOrgIDxref_BKP_20260417` | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / mdp / DMSOrgIDxref_BKP_20260417` |
| `DMSOrgIDxref_uat`          | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / mdp / DMSOrgIDxref_uat`          |
| `eleadOrgIDxref`            | table | profiled, review-needed | 14         | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / mdp / eleadOrgIDxref`            |
| `eleadOrgIDxref_UAT`        | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / mdp / eleadOrgIDxref_UAT`        |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-210:publish
```
