# WP-04 Sonic_DW.dbo Human Catalog Publish Review Packet

## Purpose

This packet proves the human Database Catalog pattern end to end for `Sonic_DW.dbo` and prepares a reviewable live-publish decision.

It does not publish, move, archive, or delete Confluence pages.

## Recommendation

Ready for human review as a dry-run publish packet. Live canonical page creation/update still requires explicit user approval. Superseded-page cleanup is not included.

## Dry-Run Output

| Item                          | Value                                                               |
| ----------------------------- | ------------------------------------------------------------------- |
| Dry-run folder                | `C:/projects/Data Governence/data/confluence/human-catalog-dry-run` |
| Generated at                  | 2026-06-19T13:03:35.721Z                                            |
| Validation status             | passed                                                              |
| Leaf pages in packet          | 27                                                                  |
| Planned navigation pages      | 1                                                                   |
| Planned total pages           | 28                                                                  |
| Superseded cleanup candidates | 26                                                                  |

## Sonic_DW.dbo Object Counts

| Object Type | Count |
| ----------- | ----: |
| Total       |  1418 |
| Tables      |   771 |
| Views       |   324 |
| Procedures  |   309 |
| Functions   |     6 |
| Synonyms    |     8 |
| Other       |     0 |

## Object Tag Summary

| Tag               | Count |
| ----------------- | ----- |
| `high-use`        | 25    |
| `lineage-hotspot` | 25    |
| `profiled`        | 25    |
| `review-needed`   | 25    |

## Pages To Create Or Update

| Kind       | Type       | Title                       | Path                                                                                 | Evidence                                                                  |
| ---------- | ---------- | --------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| navigation | navigation | `Database Catalog`          | `Sonic Data Lineage / Database Catalog`                                              | navigation page                                                           |
| leaf       | database   | `Sonic_DW`                  | `Sonic Data Lineage / Database Catalog / Sonic_DW`                                   | `sha256:9966327B06C4C08C8B8F440ACB75B8DB1DF25EF7E6CAB77DF5FC08AE7563F792` |
| leaf       | schema     | `dbo`                       | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo`                             | `sha256:CCD3517ED49B3D25B93EE044AEBF17FECEF39B96EFBCCA9AA2214F598F8DAADC` |
| leaf       | object     | `Dim_Account`               | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_Account`               | `sha256:4405DEF0C863E1EA290C6C274A5F7EA722195EEAE21B05C2E3375DB6BD199B5E` |
| leaf       | object     | `Dim_AccountMgmt`           | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_AccountMgmt`           | `sha256:B56F95A752EDD680118302CC7FD67E5B26227F6A627521C76544EDB8E1A7DE76` |
| leaf       | object     | `Dim_Date`                  | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_Date`                  | `sha256:B9A56B3426D9EE8CBB4D93730C95E179FAD782D9BCD5A087EC5C1703C37CF23C` |
| leaf       | object     | `dim_DealType`              | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / dim_DealType`              | `sha256:649C14D74DFF51AEBE2A9F1CF67EEE42B6E6DCB96DB4351FBAC77B87703B9FBA` |
| leaf       | object     | `Dim_DMSCustomer`           | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_DMSCustomer`           | `sha256:0D3EF5A010161E156DF33EB7F8AFA3A895A71478E4112DDF41174830A8A889C5` |
| leaf       | object     | `Dim_DMSEmployee`           | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_DMSEmployee`           | `sha256:DCAE33EC34C7C323BDEE7105965723C3BEA5E8A12CFB143534EE2D191E6FF729` |
| leaf       | object     | `Dim_Entity`                | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_Entity`                | `sha256:6D11820A3AD6D87C1F13EE945ADE450A3965543AD714EA71DEE620899725CE8B` |
| leaf       | object     | `dim_FIGLAccounts`          | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / dim_FIGLAccounts`          | `sha256:687876BFDAE3C5694BFE1522B0CAE5C6D5BA84C6B702CCBB599C26BDCD871AF0` |
| leaf       | object     | `dim_Time`                  | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / dim_Time`                  | `sha256:B25406C0C09511584E1A0529838EBD1B53B3FC3B191090A8E9C1303B74C7AFD4` |
| leaf       | object     | `Dim_Vehicle`               | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_Vehicle`               | `sha256:8BD6F82AF88CA251D5A0F05DCB877FB890AE6E61D1A71B66A043FFCE5EECA3CC` |
| leaf       | object     | `DimActivityType`           | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimActivityType`           | `sha256:6E4E351F623E6ED00B2E0B5C554C288720FFF85DEDDC4B2820BD530B6A1ACC88` |
| leaf       | object     | `DimAssociate`              | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimAssociate`              | `sha256:3EBCBA284AA8BE953E3BCA2723BD05DAEEB510A9AEF42035396AA87D9B0AB720` |
| leaf       | object     | `DimEntityRelationship`     | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimEntityRelationship`     | `sha256:72DDBF19E3E5C9ED7D92ECDF0EAB54CAD4B9ACA29473185A8A35C424F54000BF` |
| leaf       | object     | `DimEntityRelationshipType` | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimEntityRelationshipType` | `sha256:57A1DA60351BD90C5AAEAB6366819C4B4F7163A867217AB305293A0C89FCD2C1` |
| leaf       | object     | `DimLeadStatus`             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimLeadStatus`             | `sha256:E5380B5E060DF68032A39A05913B77FF2931ED2CDA9C1EA8192311511F76007B` |
| leaf       | object     | `DimOpportunitySource`      | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimOpportunitySource`      | `sha256:1834D94CF1B5597128294B78F40FD05AB9E948F7BE1819E90055E9C8FDEA6078` |
| leaf       | object     | `DimUpType`                 | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimUpType`                 | `sha256:C5D00F5C59EEA63E39523F2653517636562523BEBCBCD7F5C283590A628064A5` |
| leaf       | object     | `dwDiffActivity_I`          | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / dwDiffActivity_I`          | `sha256:81D6F6D878C9BFF1887A604E7BAD188107E009DC43E5006418130A3D00F851C0` |
| leaf       | object     | `Fact_Service`              | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Fact_Service`              | `sha256:8E25037A3436A8954682BDB2E2F36311E4B396616D2B490EF8C5BBE2F18702C3` |
| leaf       | object     | `FactActivity`              | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / FactActivity`              | `sha256:672203BF6AE2336059E263E73EB4EF79966268042AE0E59AAE3560840D6D9B8B` |
| leaf       | object     | `factFIRE`                  | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / factFIRE`                  | `sha256:7933BE37C785CB7D21B90D273205184CA9FB2557541CA58FC89BCD5914607736` |
| leaf       | object     | `factFIRE_A`                | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / factFIRE_A`                | `sha256:C66D46AB53E4DDBCCE34CE77ADC50A51F937CD765AB7FB4F27EFF419771A9F66` |
| leaf       | object     | `FactOpportunity`           | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / FactOpportunity`           | `sha256:499D66D4756E09992929A21DAC437C8A85EEE77B28CAFD4BEED9B71AFF10B8AA` |
| leaf       | object     | `FBCustomAudience`          | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / FBCustomAudience`          | `sha256:0115FB721AE565AA83E28BBBCB8FD24715628EF11D16894E8ADD7CB92E3D6A50` |
| leaf       | object     | `vw_GPA_RateCap_SRC`        | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / vw_GPA_RateCap_SRC`        | `sha256:BE4CD8A3BC244015B67DA94700D19136FD014BC7C84829B7FCAB0E626DC73300` |

## Canonical Object Pages In Scope

| Object                      | Type  | Tags                                               | Page Level | Rich Candidate | Path                                                                                 |
| --------------------------- | ----- | -------------------------------------------------- | ---------- | -------------- | ------------------------------------------------------------------------------------ |
| `Dim_Account`               | table | high-use, profiled, lineage-hotspot, review-needed | thin       | no             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_Account`               |
| `Dim_AccountMgmt`           | table | high-use, profiled, lineage-hotspot, review-needed | thin       | no             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_AccountMgmt`           |
| `Dim_Date`                  | table | high-use, profiled, lineage-hotspot, review-needed | thin       | no             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_Date`                  |
| `dim_DealType`              | table | high-use, profiled, lineage-hotspot, review-needed | thin       | no             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / dim_DealType`              |
| `Dim_DMSCustomer`           | table | high-use, profiled, lineage-hotspot, review-needed | thin       | no             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_DMSCustomer`           |
| `Dim_DMSEmployee`           | table | high-use, profiled, lineage-hotspot, review-needed | thin       | no             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_DMSEmployee`           |
| `Dim_Entity`                | table | high-use, profiled, lineage-hotspot, review-needed | thin       | no             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_Entity`                |
| `dim_FIGLAccounts`          | table | high-use, profiled, lineage-hotspot, review-needed | thin       | no             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / dim_FIGLAccounts`          |
| `dim_Time`                  | table | high-use, profiled, lineage-hotspot, review-needed | thin       | no             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / dim_Time`                  |
| `Dim_Vehicle`               | table | high-use, profiled, lineage-hotspot, review-needed | thin       | no             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_Vehicle`               |
| `DimActivityType`           | table | high-use, profiled, lineage-hotspot, review-needed | thin       | no             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimActivityType`           |
| `DimAssociate`              | table | high-use, profiled, lineage-hotspot, review-needed | thin       | no             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimAssociate`              |
| `DimEntityRelationship`     | table | high-use, profiled, lineage-hotspot, review-needed | thin       | no             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimEntityRelationship`     |
| `DimEntityRelationshipType` | table | high-use, profiled, lineage-hotspot, review-needed | thin       | no             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimEntityRelationshipType` |
| `DimLeadStatus`             | table | high-use, profiled, lineage-hotspot, review-needed | thin       | no             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimLeadStatus`             |
| `DimOpportunitySource`      | table | high-use, profiled, lineage-hotspot, review-needed | thin       | no             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimOpportunitySource`      |
| `DimUpType`                 | table | high-use, profiled, lineage-hotspot, review-needed | thin       | no             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimUpType`                 |
| `dwDiffActivity_I`          | table | high-use, profiled, lineage-hotspot, review-needed | thin       | no             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / dwDiffActivity_I`          |
| `Fact_Service`              | table | high-use, profiled, lineage-hotspot, review-needed | thin       | no             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Fact_Service`              |
| `FactActivity`              | table | high-use, profiled, lineage-hotspot, review-needed | thin       | no             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / FactActivity`              |
| `factFIRE`                  | table | high-use, profiled, lineage-hotspot, review-needed | thin       | no             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / factFIRE`                  |
| `factFIRE_A`                | table | high-use, profiled, lineage-hotspot, review-needed | thin       | no             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / factFIRE_A`                |
| `FactOpportunity`           | table | high-use, profiled, lineage-hotspot, review-needed | thin       | no             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / FactOpportunity`           |
| `FBCustomAudience`          | table | high-use, profiled, lineage-hotspot, review-needed | thin       | no             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / FBCustomAudience`          |
| `vw_GPA_RateCap_SRC`        | table | high-use, profiled, lineage-hotspot, review-needed | thin       | no             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / vw_GPA_RateCap_SRC`        |

## Superseded Pages Requiring Separate Cleanup Approval

These are review candidates only. They are not part of canonical page creation/update.

| Type              | Old Title                                                    | Old Path                                                                                              | Canonical Path                                                                       | Action                                                                             |
| ----------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| high-value-object | `High-Value Object - Sonic_DW.dbo.Dim_Account`               | `Sonic Data Lineage / High-Value Assets / High-Value Object - Sonic_DW.dbo.Dim_Account`               | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_Account`               | archive candidate after the canonical object page is reviewed and linked correctly |
| high-value-object | `High-Value Object - Sonic_DW.dbo.Dim_AccountMgmt`           | `Sonic Data Lineage / High-Value Assets / High-Value Object - Sonic_DW.dbo.Dim_AccountMgmt`           | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_AccountMgmt`           | archive candidate after the canonical object page is reviewed and linked correctly |
| high-value-object | `High-Value Object - Sonic_DW.dbo.Dim_Date`                  | `Sonic Data Lineage / High-Value Assets / High-Value Object - Sonic_DW.dbo.Dim_Date`                  | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_Date`                  | archive candidate after the canonical object page is reviewed and linked correctly |
| high-value-object | `High-Value Object - Sonic_DW.dbo.dim_DealType`              | `Sonic Data Lineage / High-Value Assets / High-Value Object - Sonic_DW.dbo.dim_DealType`              | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / dim_DealType`              | archive candidate after the canonical object page is reviewed and linked correctly |
| high-value-object | `High-Value Object - Sonic_DW.dbo.Dim_DMSCustomer`           | `Sonic Data Lineage / High-Value Assets / High-Value Object - Sonic_DW.dbo.Dim_DMSCustomer`           | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_DMSCustomer`           | archive candidate after the canonical object page is reviewed and linked correctly |
| high-value-object | `High-Value Object - Sonic_DW.dbo.Dim_DMSEmployee`           | `Sonic Data Lineage / High-Value Assets / High-Value Object - Sonic_DW.dbo.Dim_DMSEmployee`           | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_DMSEmployee`           | archive candidate after the canonical object page is reviewed and linked correctly |
| high-value-object | `High-Value Object - Sonic_DW.dbo.Dim_Entity`                | `Sonic Data Lineage / High-Value Assets / High-Value Object - Sonic_DW.dbo.Dim_Entity`                | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_Entity`                | archive candidate after the canonical object page is reviewed and linked correctly |
| high-value-object | `High-Value Object - Sonic_DW.dbo.dim_FIGLAccounts`          | `Sonic Data Lineage / High-Value Assets / High-Value Object - Sonic_DW.dbo.dim_FIGLAccounts`          | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / dim_FIGLAccounts`          | archive candidate after the canonical object page is reviewed and linked correctly |
| high-value-object | `High-Value Object - Sonic_DW.dbo.dim_Time`                  | `Sonic Data Lineage / High-Value Assets / High-Value Object - Sonic_DW.dbo.dim_Time`                  | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / dim_Time`                  | archive candidate after the canonical object page is reviewed and linked correctly |
| high-value-object | `High-Value Object - Sonic_DW.dbo.Dim_Vehicle`               | `Sonic Data Lineage / High-Value Assets / High-Value Object - Sonic_DW.dbo.Dim_Vehicle`               | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_Vehicle`               | archive candidate after the canonical object page is reviewed and linked correctly |
| high-value-object | `High-Value Object - Sonic_DW.dbo.DimActivityType`           | `Sonic Data Lineage / High-Value Assets / High-Value Object - Sonic_DW.dbo.DimActivityType`           | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimActivityType`           | archive candidate after the canonical object page is reviewed and linked correctly |
| high-value-object | `High-Value Object - Sonic_DW.dbo.DimAssociate`              | `Sonic Data Lineage / High-Value Assets / High-Value Object - Sonic_DW.dbo.DimAssociate`              | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimAssociate`              | archive candidate after the canonical object page is reviewed and linked correctly |
| high-value-object | `High-Value Object - Sonic_DW.dbo.DimEntityRelationship`     | `Sonic Data Lineage / High-Value Assets / High-Value Object - Sonic_DW.dbo.DimEntityRelationship`     | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimEntityRelationship`     | archive candidate after the canonical object page is reviewed and linked correctly |
| high-value-object | `High-Value Object - Sonic_DW.dbo.DimEntityRelationshipType` | `Sonic Data Lineage / High-Value Assets / High-Value Object - Sonic_DW.dbo.DimEntityRelationshipType` | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimEntityRelationshipType` | archive candidate after the canonical object page is reviewed and linked correctly |
| high-value-object | `High-Value Object - Sonic_DW.dbo.DimLeadStatus`             | `Sonic Data Lineage / High-Value Assets / High-Value Object - Sonic_DW.dbo.DimLeadStatus`             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimLeadStatus`             | archive candidate after the canonical object page is reviewed and linked correctly |
| high-value-object | `High-Value Object - Sonic_DW.dbo.DimOpportunitySource`      | `Sonic Data Lineage / High-Value Assets / High-Value Object - Sonic_DW.dbo.DimOpportunitySource`      | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimOpportunitySource`      | archive candidate after the canonical object page is reviewed and linked correctly |
| high-value-object | `High-Value Object - Sonic_DW.dbo.DimUpType`                 | `Sonic Data Lineage / High-Value Assets / High-Value Object - Sonic_DW.dbo.DimUpType`                 | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / DimUpType`                 | archive candidate after the canonical object page is reviewed and linked correctly |
| high-value-object | `High-Value Object - Sonic_DW.dbo.dwDiffActivity_I`          | `Sonic Data Lineage / High-Value Assets / High-Value Object - Sonic_DW.dbo.dwDiffActivity_I`          | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / dwDiffActivity_I`          | archive candidate after the canonical object page is reviewed and linked correctly |
| high-value-object | `High-Value Object - Sonic_DW.dbo.Fact_Service`              | `Sonic Data Lineage / High-Value Assets / High-Value Object - Sonic_DW.dbo.Fact_Service`              | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Fact_Service`              | archive candidate after the canonical object page is reviewed and linked correctly |
| high-value-object | `High-Value Object - Sonic_DW.dbo.FactActivity`              | `Sonic Data Lineage / High-Value Assets / High-Value Object - Sonic_DW.dbo.FactActivity`              | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / FactActivity`              | archive candidate after the canonical object page is reviewed and linked correctly |
| high-value-object | `High-Value Object - Sonic_DW.dbo.factFIRE`                  | `Sonic Data Lineage / High-Value Assets / High-Value Object - Sonic_DW.dbo.factFIRE`                  | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / factFIRE`                  | archive candidate after the canonical object page is reviewed and linked correctly |
| high-value-object | `High-Value Object - Sonic_DW.dbo.factFIRE_A`                | `Sonic Data Lineage / High-Value Assets / High-Value Object - Sonic_DW.dbo.factFIRE_A`                | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / factFIRE_A`                | archive candidate after the canonical object page is reviewed and linked correctly |
| high-value-object | `High-Value Object - Sonic_DW.dbo.FactOpportunity`           | `Sonic Data Lineage / High-Value Assets / High-Value Object - Sonic_DW.dbo.FactOpportunity`           | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / FactOpportunity`           | archive candidate after the canonical object page is reviewed and linked correctly |
| high-value-object | `High-Value Object - Sonic_DW.dbo.FBCustomAudience`          | `Sonic Data Lineage / High-Value Assets / High-Value Object - Sonic_DW.dbo.FBCustomAudience`          | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / FBCustomAudience`          | archive candidate after the canonical object page is reviewed and linked correctly |
| high-value-object | `High-Value Object - Sonic_DW.dbo.vw_GPA_RateCap_SRC`        | `Sonic Data Lineage / High-Value Assets / High-Value Object - Sonic_DW.dbo.vw_GPA_RateCap_SRC`        | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / vw_GPA_RateCap_SRC`        | archive candidate after the canonical object page is reviewed and linked correctly |
| schema-title      | `Schema - Sonic_DW.dbo`                                      | `Sonic Data Lineage / Database Catalog / Sonic_DW / Schema - Sonic_DW.dbo`                            | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo`                             | archive candidate after the canonical schema page is reviewed and linked correctly |

## Known Gaps

- Business owner, data steward, SLA, lifecycle/status, live freshness, and certification are not inferred.
- Rich object prose is not promoted while business definition or description confidence remains weak.
- Cleanup candidates require live Confluence page-id review before archive or move.
- This packet does not include Rovo AI Retrieval Artifact pages; those belong to WP-05.

## Rollback And No-Change Plan

Before live publish:

1. Run `npm run confluence:human:dry-run`.
2. Run `npm run confluence:human:check`.
3. Rebuild this packet and confirm the planned pages remain limited to `Sonic Data Lineage / Database Catalog / Sonic_DW`.
4. Do not run a live publish if any page path enters `High-Value Assets`, `AI Retrieval Artifacts`, or an unexpected Confluence branch.

If a later approved live publish updates existing pages, use Confluence page history to restore prior versions.

If a later approved live publish creates new pages, identify them by the publish labels and remove only after a separate rollback approval.

Cleanup of superseded pages is a separate operation and is not authorized by this packet.

## Validation Details

- No packet validation failures.
