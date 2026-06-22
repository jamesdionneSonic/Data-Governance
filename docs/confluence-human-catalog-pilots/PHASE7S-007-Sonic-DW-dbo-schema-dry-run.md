# PHASE7S-007 Sonic_DW.dbo Schema Catalog Dry Run

This is the tracked review artifact for the first database/schema catalog pilot.
It follows `docs/CONFLUENCE_HUMAN_LINEAGE_PAGE_CONTRACT.md` and is not a live
Confluence publish.

## Proposed Page Tree

```text
Sonic Data Lineage
  Database Catalog
    Sonic_DW
      dbo
```

## Evidence Packet Summary

| Field                | Value                                                                     |
| -------------------- | ------------------------------------------------------------------------- |
| Page type            | schema                                                                    |
| Page title           | `Schema Catalog - Sonic_DW.dbo`                                           |
| Canonical ID         | `schema-sonic-dw-dbo`                                                     |
| Source metadata root | `data/markdown/servers/L1-5FSQL-01/databases/Sonic_DW`                    |
| Evidence hash        | `sha256:E700F4B3BFC98994EE558C75DA3652E65FEA7590D7E5E50004DB29F8A8D2AD83` |
| Confidence           | Strong catalog evidence                                                   |
| Live publish         | No                                                                        |

## Draft Confluence Page

# Schema Catalog - Sonic_DW.dbo

## Plain-English Summary

`Sonic_DW.dbo` is the main shared warehouse schema for many Sonic reporting and integration objects. It contains dimensions, facts, reporting views, and stored procedures that support retail sales, finance, service, traffic, customer, vehicle, and operational reporting.

The highest-use objects in this slice include `Dim_Entity`, `Dim_Date`, `Dim_Vehicle`, `factFIRE`, and `FactOpportunity`. If these objects are stale, changed, or unavailable, many reports, procedures, views, SSIS loads, and product domains may be affected.

Start troubleshooting by checking the specific high-usage object named in the report or issue, then follow its upstream loaders and downstream consumers from the object page or AI retrieval artifact.

## At A Glance

| Signal                  | Value                               |
| ----------------------- | ----------------------------------- |
| Database                | `Sonic_DW`                          |
| Schema                  | `dbo`                               |
| Total cataloged objects | 1,408                               |
| Tables                  | 761                                 |
| Views                   | 324                                 |
| Procedures              | 309                                 |
| Functions               | 6                                   |
| Synonyms                | 8                                   |
| Evidence strength       | Strong catalog evidence             |
| Profile coverage        | Not surfaced in this dry-run packet |

## Tables

| Object                      | Downstream Uses | Columns | Confidence | Why Start Here                                                               |
| --------------------------- | --------------: | ------: | ---------- | ---------------------------------------------------------------------------- |
| `Dim_Entity`                |             301 |     121 | very_high  | Broad dealership/entity dimension used across many reports and facts.        |
| `Dim_Date`                  |             224 |      73 | very_high  | Shared calendar/date dimension used by reporting and period logic.           |
| `DimEntityRelationship`     |              75 |      16 | very_high  | Entity relationship table with broad dependency footprint.                   |
| `Dim_Vehicle`               |              71 |      49 | very_high  | Vehicle dimension used across sales, service, and inventory-style reporting. |
| `DimEntityRelationshipType` |              53 |       9 | very_high  | Relationship type reference table for entity relationship logic.             |
| `dim_FIGLAccounts`          |              51 |      10 | very_high  | FI/GL account reference table used in finance-related reporting.             |
| `factFIRE`                  |              46 |      93 | very_high  | Core FIRE retail sales and finance fact table.                               |
| `Dim_DMSCustomer`           |              42 |      70 | very_high  | DMS customer dimension used by customer and sales/service reporting.         |
| `Dim_DMSEmployee`           |              41 |      38 | very_high  | DMS employee dimension used by dealership and associate reporting.           |
| `DimAssociate`              |              35 |      72 | very_high  | Associate dimension used across people/associate reporting.                  |

## Views

This pilot confirms `Sonic_DW.dbo` has 324 cataloged views. A later object-page pilot should promote the most important views into high-value object pages. For FIRE, examples already surfaced in the product pilot include `vwFactFIRESummaryReport`, `vwFireSummaryDetailEP`, and `vwFireSummaryDetailSonic`.

## Procedures

This pilot confirms `Sonic_DW.dbo` has 309 cataloged stored procedures. Procedure detail pages should prioritize procedures that load final tables, perform delete/insert/upsert behavior, or are called by top-most SSIS packages.

## High-Impact Dependencies

| Object            | Type  | Impact Pattern                                                                          |
| ----------------- | ----- | --------------------------------------------------------------------------------------- |
| `Dim_Entity`      | table | High shared downstream count; entity/dealership changes can ripple broadly.             |
| `Dim_Date`        | table | High shared downstream count; date/calendar issues can affect many report periods.      |
| `Dim_Vehicle`     | table | Vehicle identity/attribute dimension used across sales, service, and inventory domains. |
| `factFIRE`        | table | FIRE product fact table; stale data can affect retail sales and finance reporting.      |
| `FactOpportunity` | table | Opportunity fact table; stale data can affect lead/opportunity reporting.               |

## Profile Coverage

Profile coverage was not surfaced in this dry-run packet. The next implementation pass should pull profile-index coverage for `Sonic_DW.dbo` before promoting this page to live Confluence.

## Known Gaps And Confidence

| Item             | Status                                                        |
| ---------------- | ------------------------------------------------------------- |
| Profile coverage | Not surfaced in this dry-run packet.                          |
| Business owner   | Not surfaced at schema level.                                 |
| SLA              | Not surfaced at schema level.                                 |
| Object pages     | Not generated in this pilot.                                  |
| Confidence       | Strong catalog evidence for inventory and high-usage ranking. |

## Dry-Run Review

| Review Question                                                      | Result |
| -------------------------------------------------------------------- | ------ |
| Can a human answer what this page is about from the first paragraph? | Yes    |
| Can support identify what to check first?                            | Yes    |
| Are source, target, and downstream impact backed by packet evidence? | Yes    |
| Are weak or missing facts labeled honestly?                          | Yes    |
| Is technical detail below the human summary?                         | Yes    |
