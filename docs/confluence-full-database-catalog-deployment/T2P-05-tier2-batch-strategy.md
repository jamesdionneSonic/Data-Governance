# T2P-05 Tier 2 Repeatable Batch Strategy Readback

Date: 2026-06-23

This packet defined the repeatable batch strategy for the remaining Tier 2
Database Catalog object pages. It did not publish to Confluence.

## Outputs

| Signal                    | Value                                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| Strategy doc              | `docs/DATABASE_CATALOG_TIER2_BATCH_STRATEGY.md`                                                |
| Machine-readable strategy | `docs/confluence-full-database-catalog-deployment/T2P-05-tier2-batch-strategy.json`            |
| Source manifest           | `docs/confluence-full-database-catalog-deployment/T2P-01-tier2-object-coverage-manifest.jsonl` |

## Current Gate

T2P-04 remains the live publish gate for
`Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo`.

Status: publish packet ready; live publish pending explicit approval.

## Summary

| Signal                             | Value |
| ---------------------------------- | ----: |
| Publishable objects in manifest    |  5348 |
| Missing objects in manifest        |  5323 |
| Schemas with missing/stale objects |   147 |
| Queued batches after current gate  |   245 |
| Max object pages per batch         |    75 |

## First 10 Batches After Current Gate

| Batch     | Platform     | Database     | Schema | Type    | Objects | High-use |
| --------- | ------------ | ------------ | ------ | ------- | ------- | -------- |
| `T2B-001` | `SQL Server` | `eLeadDW_SF` | `dbo`  | `all`   | 75      | 64       |
| `T2B-002` | `SQL Server` | `eLeadDW_SF` | `dbo`  | `all`   | 61      | 0        |
| `T2B-003` | `SQL Server` | `Sonic_DW`   | `dbo`  | `table` | 75      | 51       |
| `T2B-004` | `SQL Server` | `Sonic_DW`   | `dbo`  | `table` | 75      | 0        |
| `T2B-005` | `SQL Server` | `Sonic_DW`   | `dbo`  | `table` | 75      | 0        |
| `T2B-006` | `SQL Server` | `Sonic_DW`   | `dbo`  | `table` | 75      | 0        |
| `T2B-007` | `SQL Server` | `Sonic_DW`   | `dbo`  | `table` | 75      | 0        |
| `T2B-008` | `SQL Server` | `Sonic_DW`   | `dbo`  | `table` | 75      | 0        |
| `T2B-009` | `SQL Server` | `Sonic_DW`   | `dbo`  | `table` | 75      | 0        |
| `T2B-010` | `SQL Server` | `Sonic_DW`   | `dbo`  | `table` | 75      | 0        |

## Validation

- Batch IDs are generated from the manifest, not hard-coded database names.
- Batches are capped at 75 object pages.
- Large schemas are split by object type and deterministic object ordering.
- Live publish and cleanup remain separate approval gates.
