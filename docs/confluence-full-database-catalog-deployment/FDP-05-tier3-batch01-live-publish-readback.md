# FDP-05 Tier 3 Batch 01 Live Publish Readback

Generated: 2026-06-19

## Scope

Tier 3 rich object pages were published live to Confluence under:

```text
Sonic Data Lineage / Database Catalog / Sonic_DW / dbo
```

This publish updated the first reviewed rich object batch only. It did not
publish Rovo AI retrieval artifacts or perform cleanup, archive, delete, or move
actions.

## Publish Result

| Signal                   | Value                                                                                                                                                                               |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Publish command          | `node scripts\publish-human-confluence-catalog-pilot.mjs --packet docs\confluence-full-database-catalog-deployment\FDP-05-tier3-rich-object-batch-01-publish-packet.json --publish` |
| Publish status           | Published                                                                                                                                                                           |
| Root page ID             | `2221670415`                                                                                                                                                                        |
| Database Catalog page ID | `2282422274`                                                                                                                                                                        |
| Database page ID         | `2282684417`                                                                                                                                                                        |
| Schema page ID           | `2286518360`                                                                                                                                                                        |
| Reference parent pages   | 3                                                                                                                                                                                   |
| Rich object pages        | 5                                                                                                                                                                                   |
| Total checked entries    | 8                                                                                                                                                                                   |

## Post-Publish Verification

| Command                                                 | Result |
| ------------------------------------------------------- | ------ |
| `npm run confluence:full:tier3:batch01:published:check` | Passed |

Verification checked all 8 planned entries and reported no failures. The 5 rich
object pages were verified for Tier 3 labels and required support sections:
`Plain-English Summary`, `Business Meaning And Impact`, and `Technical Evidence`.

## Updated Rich Object Pages

| Object page                    | Page ID      | Version after publish |
| ------------------------------ | ------------ | --------------------- |
| `Sonic_DW.dbo.Dim_Date`        | `2286518544` | 2                     |
| `Sonic_DW.dbo.Dim_Vehicle`     | `2285764917` | 2                     |
| `Sonic_DW.dbo.Fact_Service`    | `2286223517` | 2                     |
| `Sonic_DW.dbo.factFIRE`        | `2286223541` | 2                     |
| `Sonic_DW.dbo.FactOpportunity` | `2287927574` | 2                     |

## Confluence Title Adjustment

Tier 3 uses the same fully qualified page title convention as Tier 2, such as
`Sonic_DW.dbo.FactOpportunity`. This allowed the live publish to update the
existing Tier 2 object pages rather than creating duplicate short-title pages.

The logical navigation path remains database-first:

```text
Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / <object>
```

## Guardrails Preserved

- No cleanup, archive, delete, or move was performed.
- Rovo AI retrieval artifacts remain unpublished unless separately approved.
- Tier 3 rich pages remain evidence-bound and continue to mark missing business facts as not surfaced in metadata.
- SSIS package/catalog artifacts from `ssisdb` remain excluded from Database Catalog publication.

## Next Gate

Tier 3 batch 01 is live and verified. The next approval options are:

1. Review the 5 rich object pages in Confluence.
2. Publish Rovo AI retrieval artifacts after the human catalog pages are reviewed.
3. Run cleanup only after separate explicit cleanup approval.
