# T2B-200 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-200`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `cars`       |
| Object type scope     | `table`      |
| Object pages          | 10           |
| Link refresh pages    | 2            |
| Total planned entries | 14           |
| Validation status     | `passed`     |

## Object Pages

| Object                         | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                   |
| ------------------------------ | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------ |
| `Ad_Prints_staging`            | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cars / Ad_Prints_staging`            |
| `Email_leads_staging`          | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cars / Email_leads_staging`          |
| `Map_views_staging`            | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cars / Map_views_staging`            |
| `nlp_staging`                  | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cars / nlp_staging`                  |
| `Phone_leads_staging`          | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cars / Phone_leads_staging`          |
| `Sonic_Dealers_staging`        | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cars / Sonic_Dealers_staging`        |
| `Sonic_invoice_detail_staging` | table | profiled, review-needed | 0          | 22      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cars / Sonic_invoice_detail_staging` |
| `SRP_staging`                  | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cars / SRP_staging`                  |
| `VDP_staging`                  | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cars / VDP_staging`                  |
| `website_transfers_Staging`    | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cars / website_transfers_Staging`    |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-200:publish
```
