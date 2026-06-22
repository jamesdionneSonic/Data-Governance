# PHASE7S-006 FIRE Product Catalog Dry Run

This is the tracked review artifact for the first human-facing Confluence
product catalog pilot. It follows
`docs/CONFLUENCE_HUMAN_LINEAGE_PAGE_CONTRACT.md` and is not a live Confluence
publish.

## Proposed Page Tree

```text
Sonic Data Lineage
  Data Product Catalog
    Data Product - FIRE
```

## Evidence Packet Summary

| Field              | Value                                                                     |
| ------------------ | ------------------------------------------------------------------------- |
| Page type          | product                                                                   |
| Page title         | `Data Product - FIRE`                                                     |
| Canonical ID       | `product-fire`                                                            |
| Source artifact    | `data/products/fire.md`                                                   |
| SSIS evidence root | `servers/V1-SSIS25-01,_11040/ssis_packages/FIRE`                          |
| Evidence hash      | `sha256:14B0AEABE9A51FC085DFACD9B591CA06779DA0C74D36BE920C4B310D929CD792` |
| Confidence         | Strong catalog evidence                                                   |
| Live publish       | No                                                                        |

## Bounded Plain-English Inputs

| Input            | Evidence-Backed Value                                                                                                                                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Business subject | Retail sales and finance reporting                                                                                                                                                                                                   |
| Source summary   | DMS/VSC deal, FI product, lender, SAP/Callidus, SIMS, and staging data surfaced in FIRE metadata                                                                                                                                     |
| Target summary   | Sonic_DW and ETL_Staging FIRE tables/views including `factFIRE`, `FactFireSummary`, `factFIRE_A`, `FactFireBookings_preDW`, `FireSummary_Detail`, `vwFactFIRESummaryReport`, `vwFireSummaryDetailEP`, and `vwFireSummaryDetailSonic` |
| Support impact   | Retail sales reporting, sales gross reporting, booked-deal reporting, finance reporting, operational dashboards, and external sales feeds can show stale or incomplete results                                                       |
| Missing facts    | Certified business owner, SLA, and specific downstream report page links were not surfaced in this dry-run packet                                                                                                                    |

## Draft Confluence Page

# Data Product - FIRE

## Plain-English Summary

FIRE is the retail sales and finance reporting product. It brings together DMS/VSC deal data, FI product data, lender data, SAP/Callidus data, SIMS data, and FIRE staging data into Sonic_DW and ETL_Staging reporting objects.

The main visible targets include `factFIRE`, `factFIRE_A`, `FactFireSummary`, `FactFireBookings_preDW`, `factFIREBookingsWeOwe`, `vwFactFIRESummaryReport`, `vwFireSummaryDetailEP`, and `vwFireSummaryDetailSonic`. If FIRE data is stale or unavailable, retail sales reporting, gross reporting, booked-deal reporting, finance reporting, operational dashboards, and external sales feeds may show incomplete or stale results.

Start troubleshooting by checking the FIRE master/orchestration packages first, then verify row freshness in the named final targets.

## Business Value

FIRE gives the business a governed reporting layer for retail sales and finance activity. It helps support teams and analysts understand sales activity, gross, deal status, FI detail, lender relationships, dealership/entity attributes, and FIRE summary reporting without tracing every staging package by hand.

The most important business value is that FIRE turns multiple operational and staging feeds into warehouse/reporting tables and views that can be consumed by reports, dashboards, and outbound sales feeds.

## Key Data And Final Targets

| Target                                              | Type  | Why It Matters                                                            |
| --------------------------------------------------- | ----- | ------------------------------------------------------------------------- |
| `L1-5FSQL-01.Sonic_DW.dbo.factFIRE`                 | table | Core FIRE fact table used for retail sales and finance reporting.         |
| `L1-5FSQL-01.Sonic_DW.dbo.factFIRE_A`               | table | Alternate or supporting FIRE fact table with strong lineage connectivity. |
| `L1-5FSQL-01.Sonic_DW.dbo.FactFireSummary`          | table | FIRE summary table used by summary/reporting consumers.                   |
| `L1-5FSQL-01.Sonic_DW.dbo.vwFactFIRESummaryReport`  | view  | Reporting-facing summary view over FIRE facts.                            |
| `L1-5FSQL-01.Sonic_DW.dbo.FactFireBookings_preDW`   | table | Pre-warehouse booked deal support table.                                  |
| `L1-5FSQL-01.Sonic_DW.dbo.factFIREBookingsWeOwe`    | table | Supports FIRE booked-deal We Owe reporting/logic.                         |
| `L1-5FSQL-01.Sonic_DW.dbo.vwFireSummaryDetailEP`    | view  | EchoPark-facing FIRE summary detail view.                                 |
| `L1-5FSQL-01.Sonic_DW.dbo.vwFireSummaryDetailSonic` | view  | Sonic-facing FIRE summary detail view.                                    |

## Lineage Summary

| Signal                    | Value                                                        |
| ------------------------- | ------------------------------------------------------------ |
| Product domain            | Retail Sales and Finance                                     |
| Catalog objects matched   | 177                                                          |
| SSIS packages matched     | 30                                                           |
| Main source/landing areas | `DMS`, `VSC`, `SAP/Callidus`, `SIMS`, `ETL_Staging`          |
| Main target areas         | `Sonic_DW`, `ETL_Staging`, `SIMS6200Retail`, `DMS`           |
| Main object types         | 59 tables, 45 views, 31 datasets, 30 packages, 12 procedures |
| Evidence strength         | Strong catalog evidence                                      |

### Key Orchestration And Load Jobs

| Package                                         | Role                                                           |
| ----------------------------------------------- | -------------------------------------------------------------- |
| `FIRE.Dims.Sonic_DW_FIRE_Dims_Fact_Master.dtsx` | Master/orchestration package for FIRE dimensions/facts.        |
| `FIRE.Dims.FIRE_Bookings.dtsx`                  | Booking-related FIRE package with high lineage connectivity.   |
| `FIRE.Dims.FIRE_pWrkToFact.dtsx`                | Moves prepared FIRE work data into fact-facing structures.     |
| `FIRE.Dims.FIRE_pVSCtoStg.dtsx`                 | Stages VSC-related FIRE data.                                  |
| `FIRE.Dims.FIRE_pGLtoStg.dtsx`                  | Stages GL-related FIRE data.                                   |
| `FIRE.Summary.FIRESummary_Fact.dtsx`            | Loads FIRE summary fact data.                                  |
| `FIRE.SIMS.SIMS_FIRE_DealData.dtsx`             | Moves SIMS FIRE deal data.                                     |
| `FIRE.DOC.Sonic_DW_FIRE_DOC_MSTR_Master.dtsx`   | Orchestrates DOC booked metrics related to FIRE/DOC reporting. |

## Support Checks

1. Check the top-most FIRE orchestration packages first, especially `Sonic_DW_FIRE_Dims_Fact_Master.dtsx`, FIRE Summary master packages, FIRE SIMS DealData master packages, and FIRE DOC master packages.
2. Check row freshness and row counts in `Sonic_DW.dbo.factFIRE`, `Sonic_DW.dbo.FactFireSummary`, and the FIRE summary detail views.
3. If booked-deal or gross reporting is wrong, review `FIRE_Bookings.dtsx`, `FIRE_pWrkToFact.dtsx`, and the DOC booked procedure/package chain.
4. If VSC, lender, or FI detail is missing, review the VSC staging, lender dimension, SAP/Callidus, and SIMS package families.
5. If a downstream report or feed is stale, compare the report complaint to the named final targets before opening raw shard or quick-context artifacts.

## Known Gaps And Confidence

| Item                         | Status                                                                                                                     |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Business owner               | Not surfaced in metadata beyond Data Engineering.                                                                          |
| SLA                          | Not surfaced in metadata.                                                                                                  |
| Downstream report page links | Not surfaced in this dry-run packet.                                                                                       |
| Cross-subject evidence       | `MCI Franchise DMS` appears under the FIRE SSIS folder but is treated as cross-subject evidence, not FIRE business impact. |
| Confidence                   | Strong catalog evidence based on product metadata and SSIS/package lineage.                                                |

## Related Pages

| Page                                      | Intended Link                                                   |
| ----------------------------------------- | --------------------------------------------------------------- |
| `SSIS Folder - FIRE`                      | Existing SSIS support documentation for FIRE packages.          |
| `Database Catalog / Sonic_DW / dbo`       | Future database/schema browse page.                             |
| `Object - Sonic_DW.dbo.factFIRE`          | Future high-value object page.                                  |
| `Object - Sonic_DW.dbo.FactFireSummary`   | Future high-value object page.                                  |
| `AI Retrieval Artifacts / Object Locator` | Machine-oriented lookup pages, separated from human navigation. |

## Technical Evidence

<details>
<summary>Evidence Packet</summary>

- Source product metadata: `data/products/fire.md`
- Source evidence hash: `sha256:14B0AEABE9A51FC085DFACD9B591CA06779DA0C74D36BE920C4B310D929CD792`
- SSIS evidence root: `servers/V1-SSIS25-01,_11040/ssis_packages/FIRE`

</details>

<details>
<summary>Catalog Counts</summary>

| Type      | Count |
| --------- | ----: |
| table     |    59 |
| view      |    45 |
| dataset   |    31 |
| package   |    30 |
| procedure |    12 |

</details>

<details>
<summary>Main Databases</summary>

| Database         | Matched Objects |
| ---------------- | --------------: |
| `Sonic_DW`       |              59 |
| `ETL_Staging`    |              54 |
| `SIMS6200Retail` |               2 |
| `DMS`            |               1 |

</details>

## Dry-Run Review

| Review Question                                                      | Result |
| -------------------------------------------------------------------- | ------ |
| Can a human answer what this page is about from the first paragraph? | Yes    |
| Can support identify what to check first?                            | Yes    |
| Are source, target, and downstream impact backed by packet evidence? | Yes    |
| Are weak or missing facts labeled honestly?                          | Yes    |
| Is technical detail below the human summary?                         | Yes    |
