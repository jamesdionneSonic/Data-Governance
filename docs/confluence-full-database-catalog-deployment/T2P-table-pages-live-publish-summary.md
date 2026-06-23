# Tier 2 Table Pages Live Publish Summary

Date: 2026-06-23

## Result

All cataloged table object pages in the Tier 2 manifest were published to
Confluence under the canonical Database Catalog tree.

| Signal                              | Value |
| ----------------------------------- | ----: |
| Total table pages published         |  4037 |
| Queued T2B table objects            |  3982 |
| Separate current-gate table objects |    55 |
| T2B table-bearing batches           |   179 |
| Bulk-logged published T2B batches   |   177 |
| Separately published T2B batches    |     2 |
| Failed live publish batches         |     0 |

## Published Scope

The live publish included:

- `T2P-04`: `SQL Server / eLeadDW / dbo`, 55 table pages.
- `T2B-001`: `SQL Server / eLeadDW_SF / dbo`, 75 table pages.
- `T2B-002`: `SQL Server / eLeadDW_SF / dbo`, 61 table pages.
- `T2B-003` through `T2B-245`: all remaining table-bearing batches from the
  Tier 2 batch strategy.

The publish was table-only for the bulk path. Mixed `all` batches were filtered
to table objects before publishing.

## Controls

No cleanup, archive, delete, or move action was run.

The live publish used canonical paths:

```text
Sonic Data Lineage / Database Catalog / <Platform/Product> / <Database> / <Schema> / <Object>
```

## Evidence

| Artifact             | Path                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| Batch strategy       | `docs/confluence-full-database-catalog-deployment/T2P-05-tier2-batch-strategy.json`            |
| Coverage manifest    | `docs/confluence-full-database-catalog-deployment/T2P-01-tier2-object-coverage-manifest.jsonl` |
| Bulk progress ledger | `docs/confluence-full-database-catalog-deployment/tier2-table-publish-progress.json`           |
| Per-batch local logs | `data/confluence/table-publish-logs/`                                                          |
| Bulk publisher       | `scripts/publish-tier2-table-pages.mjs`                                                        |

## Notes

Two data-quality corrections were needed during the live publish:

- Object-name comparison now tolerates whitespace-only differences such as
  `DMS_ JounalImport_csv` versus `DMS_JounalImport_csv`.
- Tier 2 object-name generation now preserves the requested database/schema
  casing for SQL Server pages, preventing lowercase runtime variants from
  creating the wrong Confluence branch.
