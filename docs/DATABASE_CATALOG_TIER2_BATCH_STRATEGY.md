# Database Catalog Tier 2 Batch Strategy

This strategy turns the current Tier 2 object backlog into repeatable,
medium-safe batches. It is generated from the T2P-01 coverage manifest and does
not publish to Confluence.

## Current Gate

T2P-04 is the current publish gate:

| Signal           | Value                                                                |
| ---------------- | -------------------------------------------------------------------- |
| Platform/Product | `SQL Server`                                                         |
| Database         | `eLeadDW`                                                            |
| Schema           | `dbo`                                                                |
| Status           | publish packet ready; live publish pending explicit approval         |
| Object pages     | 55                                                                   |
| Canonical path   | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo` |

Do not start a live publish from this strategy. T2P-04 still requires explicit
approval before `npm run confluence:full:tier2:eleaddw-dbo:publish` can run.

## T2B-001 Dry-Run Status

Status: publish packet ready; live publish pending explicit approval.

| Signal                 | Value                                                                                               |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| Platform/Product       | `SQL Server`                                                                                        |
| Database               | `eLeadDW_SF`                                                                                        |
| Schema                 | `dbo`                                                                                               |
| Object pages           | 75                                                                                                  |
| Link refresh pages     | 2                                                                                                   |
| Total planned entries  | 79                                                                                                  |
| Validation status      | `passed`                                                                                            |
| Canonical path         | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo`                             |
| Publish packet         | `docs/confluence-full-database-catalog-deployment/T2B-001-eleaddw-sf-dbo-tier2-publish-packet.md`   |
| Machine publish packet | `docs/confluence-full-database-catalog-deployment/T2B-001-eleaddw-sf-dbo-tier2-publish-packet.json` |
| Dry-run readback       | `docs/confluence-full-database-catalog-deployment/T2B-001-eleaddw-sf-dbo-dry-run-readback.md`       |
| Dry-run command        | `npm run confluence:full:tier2:t2b-001:dry-run`                                                     |
| Live publish command   | `npm run confluence:full:tier2:t2b-001:publish`                                                     |

No live Confluence publish, cleanup, archive, delete, or move action was run
for T2B-001.

## T2B-002 Dry-Run Status

Status: publish packet ready; live publish pending explicit approval.

| Signal                 | Value                                                                                               |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| Platform/Product       | `SQL Server`                                                                                        |
| Database               | `eLeadDW_SF`                                                                                        |
| Schema                 | `dbo`                                                                                               |
| Object pages           | 61                                                                                                  |
| Link refresh pages     | 2                                                                                                   |
| Total planned entries  | 65                                                                                                  |
| Validation status      | `passed`                                                                                            |
| Canonical path         | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo`                             |
| Publish packet         | `docs/confluence-full-database-catalog-deployment/T2B-002-eleaddw-sf-dbo-tier2-publish-packet.md`   |
| Machine publish packet | `docs/confluence-full-database-catalog-deployment/T2B-002-eleaddw-sf-dbo-tier2-publish-packet.json` |
| Dry-run readback       | `docs/confluence-full-database-catalog-deployment/T2B-002-eleaddw-sf-dbo-dry-run-readback.md`       |
| Dry-run command        | `npm run confluence:full:tier2:t2b-002:dry-run`                                                     |
| Live publish command   | `npm run confluence:full:tier2:t2b-002:publish`                                                     |

No live Confluence publish, cleanup, archive, delete, or move action was run
for T2B-002.

## Batch Rules

| Rule                       | Value                                                                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Max object pages per batch | 75                                                                                                                              |
| Preferred unit             | one platform/database/schema when object count is within the ceiling                                                            |
| Split rule                 | schemas above the ceiling split by object type, then into deterministic chunks by downstream use, upstream use, and object name |
| Priority rule              | high-use object count, then downstream use count, then upstream input count, then object count                                  |
| Publish gate               | every batch needs dry-run, reviewed publish packet, explicit live approval, and post-publish readback                           |
| Cleanup gate               | cleanup/archive/delete/move stays out of Tier 2 publish batches                                                                 |

## Summary

| Signal                                     | Value |
| ------------------------------------------ | ----: |
| Publishable objects in manifest            |  5348 |
| Missing objects in manifest                |  5323 |
| Stale live pilot objects in manifest       |    25 |
| Schemas with missing/stale objects         |   147 |
| Queued batches after current gate          |   245 |
| Objects covered by first 20 queued batches |  1381 |

## First 20 Queued Batches

| Batch     | Platform     | Database     | Schema | Type        | Objects | High-use | Downstream | Path                                                                    |
| --------- | ------------ | ------------ | ------ | ----------- | ------- | -------- | ---------- | ----------------------------------------------------------------------- |
| `T2B-001` | `SQL Server` | `eLeadDW_SF` | `dbo`  | `all`       | 75      | 64       | 1068       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo` |
| `T2B-002` | `SQL Server` | `eLeadDW_SF` | `dbo`  | `all`       | 61      | 0        | 6          | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo` |
| `T2B-003` | `SQL Server` | `Sonic_DW`   | `dbo`  | `table`     | 75      | 51       | 1894       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo`   |
| `T2B-004` | `SQL Server` | `Sonic_DW`   | `dbo`  | `table`     | 75      | 0        | 300        | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo`   |
| `T2B-005` | `SQL Server` | `Sonic_DW`   | `dbo`  | `table`     | 75      | 0        | 156        | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo`   |
| `T2B-006` | `SQL Server` | `Sonic_DW`   | `dbo`  | `table`     | 75      | 0        | 96         | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo`   |
| `T2B-007` | `SQL Server` | `Sonic_DW`   | `dbo`  | `table`     | 75      | 0        | 75         | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo`   |
| `T2B-008` | `SQL Server` | `Sonic_DW`   | `dbo`  | `table`     | 75      | 0        | 22         | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo`   |
| `T2B-009` | `SQL Server` | `Sonic_DW`   | `dbo`  | `table`     | 75      | 0        | 0          | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo`   |
| `T2B-010` | `SQL Server` | `Sonic_DW`   | `dbo`  | `table`     | 75      | 0        | 0          | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo`   |
| `T2B-011` | `SQL Server` | `Sonic_DW`   | `dbo`  | `table`     | 75      | 0        | 0          | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo`   |
| `T2B-012` | `SQL Server` | `Sonic_DW`   | `dbo`  | `table`     | 75      | 0        | 0          | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo`   |
| `T2B-013` | `SQL Server` | `Sonic_DW`   | `dbo`  | `table`     | 21      | 0        | 0          | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo`   |
| `T2B-014` | `SQL Server` | `Sonic_DW`   | `dbo`  | `view`      | 75      | 6        | 317        | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo`   |
| `T2B-015` | `SQL Server` | `Sonic_DW`   | `dbo`  | `view`      | 75      | 0        | 18         | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo`   |
| `T2B-016` | `SQL Server` | `Sonic_DW`   | `dbo`  | `view`      | 75      | 0        | 0          | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo`   |
| `T2B-017` | `SQL Server` | `Sonic_DW`   | `dbo`  | `view`      | 75      | 0        | 0          | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo`   |
| `T2B-018` | `SQL Server` | `Sonic_DW`   | `dbo`  | `view`      | 24      | 0        | 0          | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo`   |
| `T2B-019` | `SQL Server` | `Sonic_DW`   | `dbo`  | `procedure` | 75      | 2        | 154        | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo`   |
| `T2B-020` | `SQL Server` | `Sonic_DW`   | `dbo`  | `procedure` | 75      | 0        | 75         | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo`   |

## Work Process For Each Batch

1. Build a scoped Tier 2 dry run for the selected batch.
2. Validate page count, canonical paths, object identity, missing facts, and
   schema/database link state.
3. Build a reviewed publish packet.
4. Stop for explicit live publish approval.
5. After approval, publish only that packet.
6. Run post-publish readback and record page IDs, labels, snippets, and link
   checks.
7. Only then update coverage/readiness counts.

## Medium-Safe Handoff Prompt

```text
Start the next Tier 2 batch from docs/DATABASE_CATALOG_TIER2_BATCH_STRATEGY.md.
Use the next unblocked batch after the current T2P-04 publish gate. Stay dry-run
only unless I explicitly approve live publish. Generate thin object pages under
Database Catalog / <Platform/Product> / <Database> / <Schema> / <Object>,
refresh schema/database links for objects in the batch, build a reviewed publish
packet, and stop before live publish.
```
