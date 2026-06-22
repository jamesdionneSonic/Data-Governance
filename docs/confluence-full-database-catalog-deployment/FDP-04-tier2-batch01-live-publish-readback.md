# FDP-04 Tier 2 Batch 01 Live Publish Readback

Generated: 2026-06-19

## Scope

Tier 2 thin object pages were published live to Confluence under:

```text
Sonic Data Lineage / Database Catalog / Sonic_DW / dbo
```

This publish covered the first reviewed object-page batch only. It did not publish
Tier 3 rich object pages, Rovo AI retrieval artifacts, or any cleanup, archive,
delete, or move actions.

## Publish Result

| Signal                   | Value                                                                                                                                                                               |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Publish command          | `node scripts\publish-human-confluence-catalog-pilot.mjs --packet docs\confluence-full-database-catalog-deployment\FDP-04-tier2-thin-object-batch-01-publish-packet.json --publish` |
| Publish status           | Published                                                                                                                                                                           |
| Root page ID             | `2221670415`                                                                                                                                                                        |
| Database Catalog page ID | `2282422274`                                                                                                                                                                        |
| Database page ID         | `2282684417`                                                                                                                                                                        |
| Schema page ID           | `2286518360`                                                                                                                                                                        |
| Reference parent pages   | 3                                                                                                                                                                                   |
| Thin object pages        | 25                                                                                                                                                                                  |
| Total checked entries    | 28                                                                                                                                                                                  |

## Post-Publish Verification

| Command                                                 | Result |
| ------------------------------------------------------- | ------ |
| `npm run confluence:full:tier2:batch01:published:check` | Passed |

Verification checked all 28 planned entries and reported no failures. Object
pages were verified for the required Tier 2 labels and support sections:
`Plain-English Summary`, `Business Meaning And Impact`, and `Technical Evidence`.

## Confluence Title Adjustment

Confluence rejected repeated object titles such as `Dim_Account` because page
titles collide at the space/API level. The Tier 2 packet now uses fully qualified
display titles for object pages while preserving the logical catalog path.

Examples:

| Logical Path                                                               | Confluence Page Title          |
| -------------------------------------------------------------------------- | ------------------------------ |
| `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_Account`     | `Sonic_DW.dbo.Dim_Account`     |
| `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_Vehicle`     | `Sonic_DW.dbo.Dim_Vehicle`     |
| `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / FactOpportunity` | `Sonic_DW.dbo.FactOpportunity` |

This keeps the sidebar hierarchy database-first while making page titles unique
and easier for Rovo-style retrieval to disambiguate.

## Published Object Pages

| Object                                   | Confluence page ID |
| ---------------------------------------- | ------------------ |
| `Sonic_DW.dbo.Dim_Account`               | `2287305009`       |
| `Sonic_DW.dbo.Dim_AccountMgmt`           | `2287305033`       |
| `Sonic_DW.dbo.Dim_Date`                  | `2286518544`       |
| `Sonic_DW.dbo.dim_DealType`              | `2287894743`       |
| `Sonic_DW.dbo.Dim_DMSCustomer`           | `2287698105`       |
| `Sonic_DW.dbo.Dim_DMSEmployee`           | `2287993038`       |
| `Sonic_DW.dbo.Dim_Entity`                | `2286682225`       |
| `Sonic_DW.dbo.dim_FIGLAccounts`          | `2287599814`       |
| `Sonic_DW.dbo.dim_Time`                  | `2287894767`       |
| `Sonic_DW.dbo.Dim_Vehicle`               | `2285764917`       |
| `Sonic_DW.dbo.DimActivityType`           | `2287305057`       |
| `Sonic_DW.dbo.DimAssociate`              | `2286518568`       |
| `Sonic_DW.dbo.DimEntityRelationship`     | `2285764941`       |
| `Sonic_DW.dbo.DimEntityRelationshipType` | `2286715653`       |
| `Sonic_DW.dbo.DimLeadStatus`             | `2287599838`       |
| `Sonic_DW.dbo.DimOpportunitySource`      | `2288255159`       |
| `Sonic_DW.dbo.DimUpType`                 | `2288091423`       |
| `Sonic_DW.dbo.dwDiffActivity_I`          | `2288025848`       |
| `Sonic_DW.dbo.Fact_Service`              | `2286223517`       |
| `Sonic_DW.dbo.FactActivity`              | `2287993062`       |
| `Sonic_DW.dbo.factFIRE`                  | `2286223541`       |
| `Sonic_DW.dbo.factFIRE_A`                | `2287305081`       |
| `Sonic_DW.dbo.FactOpportunity`           | `2287927574`       |
| `Sonic_DW.dbo.FBCustomAudience`          | `2287599862`       |
| `Sonic_DW.dbo.vw_GPA_RateCap_SRC`        | `2286223565`       |

## Guardrails Preserved

- No cleanup, archive, delete, or move was performed.
- Tier 3 rich object pages remain unpublished unless separately approved.
- Rovo AI retrieval artifacts remain unpublished unless separately approved.
- SSIS package/catalog artifacts from `ssisdb` remain excluded from Database Catalog publication.

## Next Gate

Tier 2 batch 01 is live and verified. The next approval options are:

1. Review the 25 live thin object pages in Confluence.
2. Publish Tier 3 rich object batch 01 after Tier 2 review.
3. Publish Rovo AI retrieval artifacts after the human catalog pages are reviewed.
4. Run cleanup only after separate explicit cleanup approval.
