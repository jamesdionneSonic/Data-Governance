# FDP-03 Tier 1 Live Publish Readback

Generated: 2026-06-19

## Scope

Tier 1 Database Catalog pages were published live to Confluence under:

```text
Sonic Data Lineage / Database Catalog
```

This publish covered Database Catalog navigation, database pages, and schema pages only. It did not publish Tier 2 object pages, Tier 3 rich object pages, Rovo AI retrieval artifacts, or cleanup/archive/delete/move actions.

## Publish Result

| Signal                                       | Value                                                                                                                                                          |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Publish command                              | `node scripts\publish-human-confluence-catalog-pilot.mjs --packet docs\confluence-full-database-catalog-deployment\FDP-03-tier1-publish-packet.json --publish` |
| Publish status                               | Published                                                                                                                                                      |
| Root page ID                                 | `2221670415`                                                                                                                                                   |
| Database Catalog page ID                     | `2282422274`                                                                                                                                                   |
| Planned pages                                | 178                                                                                                                                                            |
| Database pages                               | 32                                                                                                                                                             |
| Schema pages                                 | 145                                                                                                                                                            |
| Included objects represented on schema pages | 5,134                                                                                                                                                          |
| Excluded SSIS package/catalog artifacts      | 2,051                                                                                                                                                          |

## Post-Publish Verification

| Command                                         | Result |
| ----------------------------------------------- | ------ |
| `npm run confluence:full:tier1:published:check` | Passed |

Verification checked all 178 planned pages and reported no failures.

## Confluence Title Adjustment

Confluence rejected repeated schema page titles such as `dbo` because page titles must be unique enough for the API workflow. The Tier 1 packet was adjusted so schema pages use unique display titles while keeping the same logical catalog path.

Examples:

| Logical Path                                                  | Confluence Page Title |
| ------------------------------------------------------------- | --------------------- |
| `Sonic Data Lineage / Database Catalog / BI_WorkDB / dbo`     | `BI_WorkDB.dbo`       |
| `Sonic Data Lineage / Database Catalog / CBS / dbo`           | `CBS.dbo`             |
| `Sonic Data Lineage / Database Catalog / ETL_Staging / clean` | `ETL_Staging.clean`   |
| `Sonic Data Lineage / Database Catalog / VendorData / dbo`    | `VendorData.dbo`      |

This keeps the new catalog away from the old `Schema - <Database>.<Schema>` title pattern while avoiding duplicate-title publish failures.

## Guardrails Preserved

- No cleanup, archive, delete, or move was performed.
- Old `Schema - <Database>.<Schema>` pages remain cleanup candidates only.
- Old high-value object pages remain cleanup candidates only.
- Tier 2 and Tier 3 object pages remain unpublished unless separately approved.
- Rovo AI retrieval artifacts remain unpublished unless separately approved.
- SSIS package/catalog artifacts from `ssisdb` remain excluded from Database Catalog publication.

## Next Gate

Tier 1 is live and verified. The next approval options are:

1. Publish Tier 2 thin object batch 01.
2. Publish Tier 3 rich object batch 01 after Tier 2 review.
3. Publish Rovo AI retrieval artifacts after the human catalog pages are reviewed.
4. Run cleanup only after separate explicit cleanup approval.
