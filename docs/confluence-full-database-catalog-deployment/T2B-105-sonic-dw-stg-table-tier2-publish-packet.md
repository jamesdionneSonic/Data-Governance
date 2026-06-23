# T2B-105 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-105`    |
| Platform/Product      | `SQL Server` |
| Database              | `Sonic_DW`   |
| Schema                | `stg`        |
| Object type scope     | `table`      |
| Object pages          | 10           |
| Link refresh pages    | 2            |
| Total planned entries | 14           |
| Validation status     | `passed`     |

## Object Pages

| Object                          | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                  |
| ------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ----------------------------------------------------------------------------------------------------- |
| `TextConversation`              | table | profiled, review-needed | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / stg / TextConversation`              |
| `TextConversationDelete`        | table | profiled, review-needed | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / stg / TextConversationDelete`        |
| `TextConversationElement`       | table | profiled, review-needed | 0          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / stg / TextConversationElement`       |
| `TextConversationElementDelete` | table | profiled, review-needed | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / stg / TextConversationElementDelete` |
| `TextConversationMessage`       | table | profiled, review-needed | 0          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / stg / TextConversationMessage`       |
| `TextConversationMessageDelete` | table | profiled, review-needed | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / stg / TextConversationMessageDelete` |
| `TextCustomerNumber`            | table | profiled, review-needed | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / stg / TextCustomerNumber`            |
| `TextCustomerNumberDelete`      | table | profiled, review-needed | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / stg / TextCustomerNumberDelete`      |
| `TextOptInStatus`               | table | profiled, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / stg / TextOptInStatus`               |
| `TextOptInStatusDelete`         | table | profiled, review-needed | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / stg / TextOptInStatusDelete`         |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-105:publish
```
