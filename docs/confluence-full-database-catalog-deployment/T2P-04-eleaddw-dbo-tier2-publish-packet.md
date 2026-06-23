# T2P-04 eLeadDW.dbo Tier 2 Publish Review Packet

## Purpose

This packet prepares a reviewed Confluence publish for the first complete
one-schema Tier 2 object slice:

`Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo`

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

Ready for user review. Live publish requires explicit approval and assumes Tier 1 parent pages exist.

## Scope

| Signal            | Value                                                |
| ----------------- | ---------------------------------------------------- |
| Packet id         | `T2P-04`                                             |
| Batch id          | `T2P-04-ELEADDW-DBO`                                 |
| Platform/Product  | `SQL Server`                                         |
| Database          | `eLeadDW`                                            |
| Schema            | `dbo`                                                |
| Object scope      | all publishable objects in schema                    |
| Publish mode      | `reviewed publish packet; no live publish performed` |
| Cleanup mode      | `none; cleanup remains separate`                     |
| Validation status | `passed`                                             |

## Planned Pages

| Signal                 | Value |
| ---------------------- | ----: |
| Reference parent pages |     2 |
| Link refresh pages     |     2 |
| Thin object pages      |    55 |
| Total planned entries  |    59 |

Reference parent pages are required to already exist from Tier 1. They are used
only for parent lookup and must not be overwritten by this Tier 2 packet.

## Link Refresh

| Signal                            | Value |
| --------------------------------- | ----: |
| Schema object rows                |    55 |
| Objects planned in packet         |    55 |
| Pending rows before publish       |    55 |
| Schema-page object links rendered |   175 |
| Most-used links rendered          |    10 |

Pending rows are expected before live publish. The post-publish readback must
confirm the pages exist before `canonical_page_exists` can be treated as true.

## Tag Summary

| Tag               | Count |
| ----------------- | ----- |
| `profiled`        | 55    |
| `review-needed`   | 55    |
| `high-use`        | 11    |
| `lineage-hotspot` | 7     |

## Object Pages In Scope

| Object                                 | Type  | Tags                                               | Downstream | Columns | Confidence | Path                                                                                                        |
| -------------------------------------- | ----- | -------------------------------------------------- | ---------- | ------- | ---------- | ----------------------------------------------------------------------------------------------------------- |
| `CustomerExclusionLookup`              | table | profiled, review-needed                            | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / CustomerExclusionLookup`              |
| `CustomerMatchLookup`                  | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / CustomerMatchLookup`                  |
| `dwDealMerge`                          | table | profiled, review-needed                            | 0          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwDealMerge`                          |
| `dwDiffCustomer_I`                     | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwDiffCustomer_I`                     |
| `dwDiffTextConversation_D`             | table | profiled, review-needed                            | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwDiffTextConversation_D`             |
| `dwDiffTextConversation_I`             | table | profiled, review-needed                            | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwDiffTextConversation_I`             |
| `dwDiffTextConversationElement_D`      | table | profiled, review-needed                            | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwDiffTextConversationElement_D`      |
| `dwDiffTextConversationElement_I`      | table | profiled, review-needed                            | 0          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwDiffTextConversationElement_I`      |
| `dwDiffTextConversationMessage_D`      | table | profiled, review-needed                            | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwDiffTextConversationMessage_D`      |
| `dwDiffTextConversationMessage_I`      | table | profiled, review-needed                            | 0          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwDiffTextConversationMessage_I`      |
| `dwDiffTextCustomerNumber_D`           | table | profiled, review-needed                            | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwDiffTextCustomerNumber_D`           |
| `dwDiffTextCustomerNumber_I`           | table | profiled, review-needed                            | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwDiffTextCustomerNumber_I`           |
| `dwDiffTextOptInStatus_D`              | table | profiled, review-needed                            | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwDiffTextOptInStatus_D`              |
| `dwDiffTextOptInStatus_I`              | table | profiled, review-needed                            | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwDiffTextOptInStatus_I`              |
| `dwFullActivity`                       | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwFullActivity`                       |
| `dwFullCompany`                        | table | high-use, profiled, review-needed                  | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwFullCompany`                        |
| `dwFullCompanyHierarchy`               | table | profiled, review-needed                            | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwFullCompanyHierarchy`               |
| `dwFullCustomer`                       | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwFullCustomer`                       |
| `dwFullDealSalespersonMap`             | table | high-use, profiled, review-needed                  | 0          | 82      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwFullDealSalespersonMap`             |
| `dwFullOpportunity`                    | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 370     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwFullOpportunity`                    |
| `dwFullTextConversation`               | table | profiled, review-needed                            | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwFullTextConversation`               |
| `dwFullTextConversationElement`        | table | profiled, review-needed                            | 0          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwFullTextConversationElement`        |
| `dwFullTextConversationMessage`        | table | profiled, review-needed                            | 0          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwFullTextConversationMessage`        |
| `dwFullTextCustomerNumber`             | table | profiled, review-needed                            | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwFullTextCustomerNumber`             |
| `dwFullTextOptInStatus`                | table | profiled, review-needed                            | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwFullTextOptInStatus`                |
| `dwFullUser`                           | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 61      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwFullUser`                           |
| `dwFullVehicleSought`                  | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 42      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwFullVehicleSought`                  |
| `eLeads_Load_UDI_status`               | table | high-use, profiled, review-needed                  | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / eLeads_Load_UDI_status`               |
| `MatchResultActiveOppPerson`           | table | profiled, review-needed                            | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / MatchResultActiveOppPerson`           |
| `MatchResultAddress`                   | table | profiled, review-needed                            | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / MatchResultAddress`                   |
| `MatchResultAddress_FZYResults`        | table | profiled, review-needed                            | 0          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / MatchResultAddress_FZYResults`        |
| `MatchResultAddress_SourceRef`         | table | profiled, review-needed                            | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / MatchResultAddress_SourceRef`         |
| `MatchResultCity`                      | table | profiled, review-needed                            | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / MatchResultCity`                      |
| `MatchResultEmail`                     | table | profiled, review-needed                            | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / MatchResultEmail`                     |
| `MatchResultFirstName`                 | table | profiled, review-needed                            | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / MatchResultFirstName`                 |
| `MatchResultLiveDealers`               | table | profiled, review-needed                            | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / MatchResultLiveDealers`               |
| `MatchResultPhone`                     | table | profiled, review-needed                            | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / MatchResultPhone`                     |
| `MatchResultSourcePerson`              | table | profiled, review-needed                            | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / MatchResultSourcePerson`              |
| `MatchResultState`                     | table | profiled, review-needed                            | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / MatchResultState`                     |
| `MatchResultTradeVIN`                  | table | profiled, review-needed                            | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / MatchResultTradeVIN`                  |
| `MatchResultVOIMake`                   | table | profiled, review-needed                            | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / MatchResultVOIMake`                   |
| `MatchResultVOIModel`                  | table | profiled, review-needed                            | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / MatchResultVOIModel`                  |
| `MatchResultVOIStockNumber`            | table | profiled, review-needed                            | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / MatchResultVOIStockNumber`            |
| `MatchResultVOIVIN`                    | table | profiled, review-needed                            | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / MatchResultVOIVIN`                    |
| `MatchResultZip`                       | table | profiled, review-needed                            | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / MatchResultZip`                       |
| `previous`                             | table | profiled, review-needed                            | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / previous`                             |
| `ProcCRMSoldLU`                        | table | profiled, review-needed                            | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / ProcCRMSoldLU`                        |
| `ProcOutput_Sonic_MSCTasks`            | table | profiled, review-needed                            | 0          | 32      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / ProcOutput_Sonic_MSCTasks`            |
| `ProcOutput_Sonic_MSCTasks_Department` | table | profiled, review-needed                            | 0          | 35      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / ProcOutput_Sonic_MSCTasks_Department` |
| `SCORES_DealershipLoad`                | table | profiled, review-needed                            | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / SCORES_DealershipLoad`                |
| `Sonic_TMR_Export`                     | table | profiled, review-needed                            | 0          | 37      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / Sonic_TMR_Export`                     |
| `StageSameDayAppt`                     | table | profiled, review-needed                            | 0          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / StageSameDayAppt`                     |
| `StageTrafficDaily`                    | table | profiled, review-needed                            | 0          | 81      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / StageTrafficDaily`                    |
| `tblQuartile`                          | table | profiled, review-needed                            | 0          | 39      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / tblQuartile`                          |
| `Template`                             | table | high-use, profiled, review-needed                  | 0          | 28      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / Template`                             |

## Approval To Publish

Live publish requires explicit user approval for:

`Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo`

The publish command is:

```powershell
npm run confluence:full:tier2:eleaddw-dbo:publish
```

Do not run cleanup commands from this approval.

## Validation

- No packet validation failures.

## Source Artifacts

- Dry-run manifest: `data/confluence/human-catalog-dry-run/manifest.json`
- Dry-run output root: `data/confluence/human-catalog-dry-run`
- T2P-03 readback: `docs/confluence-full-database-catalog-deployment/T2P-03-eleaddw-dbo-thin-object-dry-run-readback.md`
