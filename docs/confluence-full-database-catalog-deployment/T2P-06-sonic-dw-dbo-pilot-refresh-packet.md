# T2P-06 Sonic_DW.dbo Pilot Refresh Review Packet

## Purpose

This packet prepares a dry-run refresh for the 25 live Tier 2 pilot pages that
were published before the platform-grouped Database Catalog standard.

It does not publish to Confluence and it does not clean up, archive, delete, or
move the old pages.

## Recommendation

Ready for review. Live refresh publish requires explicit approval; cleanup remains separate.

## Scope

| Signal                 | Value                                                      |
| ---------------------- | ---------------------------------------------------------- |
| Platform/Product       | `SQL Server`                                               |
| Database               | `Sonic_DW`                                                 |
| Schema                 | `dbo`                                                      |
| Old pilot pages        | 25                                                         |
| Refreshed object pages | 25                                                         |
| Link refresh pages     | 2                                                          |
| Publish mode           | `reviewed refresh packet; no live publish performed`       |
| Cleanup mode           | `none; old flat-path pages remain cleanup candidates only` |
| Validation status      | `passed`                                                   |

## Compliance Summary

| Object                                   | Old page ID  | Old status      | New status       | Action                                                                         |
| ---------------------------------------- | ------------ | --------------- | ---------------- | ------------------------------------------------------------------------------ |
| `Sonic_DW.dbo.Dim_Entity`                | `2286682225` | stale-flat-path | platform-grouped | publish refreshed canonical page; leave old page for separate cleanup approval |
| `Sonic_DW.dbo.Dim_Date`                  | `2286518544` | stale-flat-path | platform-grouped | publish refreshed canonical page; leave old page for separate cleanup approval |
| `Sonic_DW.dbo.DimEntityRelationship`     | `2285764941` | stale-flat-path | platform-grouped | publish refreshed canonical page; leave old page for separate cleanup approval |
| `Sonic_DW.dbo.Dim_Vehicle`               | `2285764917` | stale-flat-path | platform-grouped | publish refreshed canonical page; leave old page for separate cleanup approval |
| `Sonic_DW.dbo.DimEntityRelationshipType` | `2286715653` | stale-flat-path | platform-grouped | publish refreshed canonical page; leave old page for separate cleanup approval |
| `Sonic_DW.dbo.dim_FIGLAccounts`          | `2287599814` | stale-flat-path | platform-grouped | publish refreshed canonical page; leave old page for separate cleanup approval |
| `Sonic_DW.dbo.factFIRE`                  | `2286223541` | stale-flat-path | platform-grouped | publish refreshed canonical page; leave old page for separate cleanup approval |
| `Sonic_DW.dbo.Dim_DMSCustomer`           | `2287698105` | stale-flat-path | platform-grouped | publish refreshed canonical page; leave old page for separate cleanup approval |
| `Sonic_DW.dbo.Dim_DMSEmployee`           | `2287993038` | stale-flat-path | platform-grouped | publish refreshed canonical page; leave old page for separate cleanup approval |
| `Sonic_DW.dbo.DimAssociate`              | `2286518568` | stale-flat-path | platform-grouped | publish refreshed canonical page; leave old page for separate cleanup approval |
| `Sonic_DW.dbo.FBCustomAudience`          | `2287599862` | stale-flat-path | platform-grouped | publish refreshed canonical page; leave old page for separate cleanup approval |
| `Sonic_DW.dbo.dim_DealType`              | `2287894743` | stale-flat-path | platform-grouped | publish refreshed canonical page; leave old page for separate cleanup approval |
| `Sonic_DW.dbo.FactOpportunity`           | `2287927574` | stale-flat-path | platform-grouped | publish refreshed canonical page; leave old page for separate cleanup approval |
| `Sonic_DW.dbo.dim_Time`                  | `2287894767` | stale-flat-path | platform-grouped | publish refreshed canonical page; leave old page for separate cleanup approval |
| `Sonic_DW.dbo.Dim_Account`               | `2287305009` | stale-flat-path | platform-grouped | publish refreshed canonical page; leave old page for separate cleanup approval |
| `Sonic_DW.dbo.vw_GPA_RateCap_SRC`        | `2286223565` | stale-flat-path | platform-grouped | publish refreshed canonical page; leave old page for separate cleanup approval |
| `Sonic_DW.dbo.DimUpType`                 | `2288091423` | stale-flat-path | platform-grouped | publish refreshed canonical page; leave old page for separate cleanup approval |
| `Sonic_DW.dbo.DimLeadStatus`             | `2287599838` | stale-flat-path | platform-grouped | publish refreshed canonical page; leave old page for separate cleanup approval |
| `Sonic_DW.dbo.DimOpportunitySource`      | `2288255159` | stale-flat-path | platform-grouped | publish refreshed canonical page; leave old page for separate cleanup approval |
| `Sonic_DW.dbo.Fact_Service`              | `2286223517` | stale-flat-path | platform-grouped | publish refreshed canonical page; leave old page for separate cleanup approval |
| `Sonic_DW.dbo.FactActivity`              | `2287993062` | stale-flat-path | platform-grouped | publish refreshed canonical page; leave old page for separate cleanup approval |
| `Sonic_DW.dbo.Dim_AccountMgmt`           | `2287305033` | stale-flat-path | platform-grouped | publish refreshed canonical page; leave old page for separate cleanup approval |
| `Sonic_DW.dbo.factFIRE_A`                | `2287305081` | stale-flat-path | platform-grouped | publish refreshed canonical page; leave old page for separate cleanup approval |
| `Sonic_DW.dbo.DimActivityType`           | `2287305057` | stale-flat-path | platform-grouped | publish refreshed canonical page; leave old page for separate cleanup approval |
| `Sonic_DW.dbo.dwDiffActivity_I`          | `2288025848` | stale-flat-path | platform-grouped | publish refreshed canonical page; leave old page for separate cleanup approval |

## Approval To Publish

Live publish requires explicit user approval for:

`Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo`

The live publish command after approval is:

```powershell
npm run confluence:full:tier2:pilot-refresh:publish
```

Do not run cleanup commands from this approval.

## Validation

- No packet validation failures.
