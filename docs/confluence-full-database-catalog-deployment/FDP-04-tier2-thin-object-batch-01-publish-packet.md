# FDP-04 Tier 2 Thin Object Batch 01 Publish Review Packet

## Purpose

This packet prepares the first safe Tier 2 thin object-page batch for the
canonical Database Catalog.

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

Ready for user review. Live Tier 2 object-page publish requires explicit approval and assumes Tier 1 parent pages exist.

## Batch Strategy

| Signal            | Value                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------ |
| Batch id          | `FDP-04-BATCH-01`                                                                          |
| Database          | `Sonic_DW`                                                                                 |
| Schema            | `dbo`                                                                                      |
| Object type       | `table`                                                                                    |
| Max objects       | 25                                                                                         |
| Selection rule    | highest downstream count, then highest upstream count, from validated dry-run object pages |
| Publish mode      | `reviewed publish packet; no live publish performed`                                       |
| Cleanup mode      | `none; cleanup remains separate`                                                           |
| Required labels   | `human-lineage-catalog`, `database-catalog`, `database-catalog-tier2`, `thin-object-page`  |
| Validation status | `passed`                                                                                   |

## Planned Pages

| Signal                 | Value |
| ---------------------- | ----- |
| Reference parent pages | 3     |
| Thin object pages      | 25    |
| Total planned entries  | 28    |

Reference parent pages are required to already exist from Tier 1. They are used
only for parent lookup and must not be overwritten by this Tier 2 packet.

## Tag Summary

| Tag               | Count |
| ----------------- | ----- |
| `high-use`        | 25    |
| `lineage-hotspot` | 25    |
| `profiled`        | 25    |
| `review-needed`   | 25    |

## Object Pages In Scope

| Object                      | Type  | Tags                                               | Downstream | Columns | Confidence | Path                                                                                 |
| --------------------------- | ----- | -------------------------------------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------ |
| `Dim_Entity`                | table | high-use, profiled, lineage-hotspot, review-needed | 301        | 20      | high       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_Entity`                |
| `Dim_Date`                  | table | high-use, profiled, lineage-hotspot, review-needed | 224        | 20      | high       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_Date`                  |
| `DimEntityRelationship`     | table | high-use, profiled, lineage-hotspot, review-needed | 75         | 16      | high       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimEntityRelationship`     |
| `Dim_Vehicle`               | table | high-use, profiled, lineage-hotspot, review-needed | 71         | 20      | high       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_Vehicle`               |
| `DimEntityRelationshipType` | table | high-use, profiled, lineage-hotspot, review-needed | 53         | 9       | high       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimEntityRelationshipType` |
| `dim_FIGLAccounts`          | table | high-use, profiled, lineage-hotspot, review-needed | 51         | 10      | high       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / dim_FIGLAccounts`          |
| `factFIRE`                  | table | high-use, profiled, lineage-hotspot, review-needed | 46         | 20      | high       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / factFIRE`                  |
| `Dim_DMSCustomer`           | table | high-use, profiled, lineage-hotspot, review-needed | 42         | 20      | high       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_DMSCustomer`           |
| `Dim_DMSEmployee`           | table | high-use, profiled, lineage-hotspot, review-needed | 41         | 20      | high       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_DMSEmployee`           |
| `DimAssociate`              | table | high-use, profiled, lineage-hotspot, review-needed | 35         | 20      | high       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimAssociate`              |
| `FBCustomAudience`          | table | high-use, profiled, lineage-hotspot, review-needed | 30         | 20      | high       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / FBCustomAudience`          |
| `dim_DealType`              | table | high-use, profiled, lineage-hotspot, review-needed | 29         | 4       | high       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / dim_DealType`              |
| `FactOpportunity`           | table | high-use, profiled, lineage-hotspot, review-needed | 27         | 20      | high       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / FactOpportunity`           |
| `dim_Time`                  | table | high-use, profiled, lineage-hotspot, review-needed | 26         | 8       | high       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / dim_Time`                  |
| `Dim_Account`               | table | high-use, profiled, lineage-hotspot, review-needed | 24         | 20      | high       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_Account`               |
| `vw_GPA_RateCap_SRC`        | table | high-use, profiled, lineage-hotspot, review-needed | 24         | 20      | high       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / vw_GPA_RateCap_SRC`        |
| `DimUpType`                 | table | high-use, profiled, lineage-hotspot, review-needed | 21         | 8       | high       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimUpType`                 |
| `DimLeadStatus`             | table | high-use, profiled, lineage-hotspot, review-needed | 20         | 19      | high       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimLeadStatus`             |
| `DimOpportunitySource`      | table | high-use, profiled, lineage-hotspot, review-needed | 20         | 20      | high       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimOpportunitySource`      |
| `Fact_Service`              | table | high-use, profiled, lineage-hotspot, review-needed | 20         | 20      | high       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Fact_Service`              |
| `FactActivity`              | table | high-use, profiled, lineage-hotspot, review-needed | 20         | 20      | high       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / FactActivity`              |
| `Dim_AccountMgmt`           | table | high-use, profiled, lineage-hotspot, review-needed | 19         | 20      | high       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_AccountMgmt`           |
| `factFIRE_A`                | table | high-use, profiled, lineage-hotspot, review-needed | 19         | 20      | high       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / factFIRE_A`                |
| `DimActivityType`           | table | high-use, profiled, lineage-hotspot, review-needed | 15         | 13      | high       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimActivityType`           |
| `dwDiffActivity_I`          | table | high-use, profiled, lineage-hotspot, review-needed | 6          | 20      | high       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / dwDiffActivity_I`          |

## Approval To Publish

Live publish requires explicit user approval for:

`Sonic Data Lineage / Database Catalog / Sonic_DW / dbo`

The publish command is:

```powershell
npm run confluence:full:tier2:batch01:publish
```

Do not run cleanup commands from this approval.

## Validation

- No packet validation failures.

## Source Artifacts

- Dry-run manifest: `data/confluence/human-catalog-dry-run/manifest.json`
- Dry-run output root: `data/confluence/human-catalog-dry-run`
