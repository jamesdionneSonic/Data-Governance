# PHASE7S-008 High-Value Object Page Pilot

This is the tracked review artifact for the first high-value object page pilot.
It follows `docs/CONFLUENCE_HUMAN_LINEAGE_PAGE_CONTRACT.md` and is not a live
Confluence publish.

## Proposed Page Tree

```text
Sonic Data Lineage
  High-Value Assets
    Object - Sonic_DW.dbo.factFIRE
    Object - Sonic_DW.dbo.vwFactFIRESummaryReport
    Object - Sonic_DW.dbo.usp_DOC_Booked
```

## Evidence Packet Summary

| Field            | Value                                                                     |
| ---------------- | ------------------------------------------------------------------------- |
| Page type        | object pilot                                                              |
| Canonical ID     | `phase7s-008-fire-object-pilot`                                           |
| Evidence hash    | `sha256:180966F2470110C37B26AB71791653DDBD392788438C3C0875F2BF44CD93FDB8` |
| Objects included | 1 table, 1 view, 1 procedure                                              |
| Live publish     | No                                                                        |

## Object Page Draft: Sonic_DW.dbo.factFIRE

### Plain-English Summary

`Sonic_DW.dbo.factFIRE` is a core FIRE retail sales and finance fact table. It is created by FIRE SSIS packages including `FIRE_Bookings.dtsx` and `FIRE_pWrkToFact.dtsx`, and it feeds many downstream procedures and views used by FIRE, Facebook audience, survey, and sales-service customer processes.

If `factFIRE` is stale or wrong, retail sales, finance, gross, customer-audience, FIRE summary, and related downstream reporting may be incomplete. Start troubleshooting by checking the FIRE Dims Fact package chain, then compare row freshness in `factFIRE` against downstream FIRE summary views.

### Business Meaning And Impact

This table stores FIRE fact-level sales and finance measures keyed by dealership/entity, deal, employee, accounting/contract dates, stock, and vehicle/deal attributes. It is a high-impact table because the metadata shows 46 downstream uses and 93 columns.

### At A Glance

| Field            | Value                                        |
| ---------------- | -------------------------------------------- |
| Object           | `L1-5FSQL-01.Sonic_DW.dbo.factFIRE`          |
| Type             | table                                        |
| Columns          | 93                                           |
| Created by       | `FIRE_Bookings.dtsx`, `FIRE_pWrkToFact.dtsx` |
| Downstream uses  | 46                                           |
| Confidence       | very_high                                    |
| Profile coverage | Not surfaced in this packet                  |

### Lineage Summary

| Direction        | Evidence                                                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Loaded by        | `V1-SSIS25-01, 11040.SSISDB.FIRE.FIRE Dims Fact.FIRE_Bookings.dtsx`; `V1-SSIS25-01, 11040.SSISDB.FIRE.FIRE Dims Fact.FIRE_pWrkToFact.dtsx`  |
| Used by examples | `usp_FIRE_BuildSummaryFact`, `vwFireSummaryDetailEP`, `vwFireSummaryDetailSonic`, `vw_FIRE_DealData`, Facebook customer/audience procedures |
| Source objects   | Not surfaced directly on the table metadata; follow the creating SSIS packages for package-level source detail                              |

### Support Checks

1. Confirm `FIRE_Bookings.dtsx` and `FIRE_pWrkToFact.dtsx` completed successfully.
2. Check row freshness in `Sonic_DW.dbo.factFIRE`.
3. If a FIRE summary report is wrong, check `usp_FIRE_BuildSummaryFact` and FIRE summary views after verifying `factFIRE`.
4. If customer audience or survey outputs are wrong, check the downstream procedure/view named in the issue.

### Profile And Quality Signals

Profile row counts and freshness were not surfaced in this packet.

## Object Page Draft: Sonic_DW.dbo.vwFactFIRESummaryReport

### Plain-English Summary

`Sonic_DW.dbo.vwFactFIRESummaryReport` is a FIRE summary reporting view. It reads `FactFireSummary`, `Dim_Date`, `Dim_Entity`, `Dim_DMSEmployee`, and `Dim_DMSCustomer` to expose dealership, date, employee, customer, and FIRE summary fields for reporting.

If this view is wrong, the issue may come from the summary fact table or one of the shared dimensions it joins to. Start troubleshooting by checking `FactFireSummary` first, then verify the date, entity, employee, and customer dimensions used by the view.

### Business Meaning And Impact

This view presents FIRE summary data in a report-friendly shape. It has 159 columns and 516 column-usage records in metadata, which makes it a good candidate for a human object page because support can see both the business shape and the technical dependencies.

### At A Glance

| Field                | Value                                              |
| -------------------- | -------------------------------------------------- |
| Object               | `L1-5FSQL-01.Sonic_DW.dbo.vwFactFIRESummaryReport` |
| Type                 | view                                               |
| Reads from           | 5 objects                                          |
| Columns              | 159                                                |
| Column usage records | 516                                                |
| Validated edges      | 5                                                  |
| Confidence           | high                                               |

### Lineage Summary

| Role                        | Object                                     |
| --------------------------- | ------------------------------------------ |
| Summary fact source         | `L1-5FSQL-01.Sonic_DW.dbo.FactFireSummary` |
| Date dimension              | `L1-5FSQL-01.Sonic_DW.dbo.Dim_Date`        |
| Entity/dealership dimension | `L1-5FSQL-01.Sonic_DW.dbo.Dim_Entity`      |
| Employee dimension          | `L1-5FSQL-01.Sonic_DW.dbo.Dim_DMSEmployee` |
| Customer dimension          | `L1-5FSQL-01.Sonic_DW.dbo.Dim_DMSCustomer` |

### Support Checks

1. Check whether `FactFireSummary` has current rows for the reporting period.
2. Verify `Dim_Date` if fiscal month, date, or period fields look wrong.
3. Verify `Dim_Entity` if dealership, brand, region, or company fields look wrong.
4. Verify `Dim_DMSEmployee` or `Dim_DMSCustomer` if employee/customer attributes are missing.

### Profile And Quality Signals

Profile row counts and downstream report consumers were not surfaced in this packet.

## Object Page Draft: Sonic_DW.dbo.usp_DOC_Booked

### Plain-English Summary

`Sonic_DW.dbo.usp_DOC_Booked` builds booked DOC metrics used by FIRE/DOC reporting. It reads FIRE booked-deal and dimension/reference objects, applies metric logic, and writes `Doc_Booked` and `Doc_Booked_Historical`.

If this procedure fails or produces bad data, booked-deal, gross, units, and DOC/FIRE reporting can be wrong. Start troubleshooting by checking the calling SSIS package, then verify source availability from `vw_FIREBkdDealsAsFUEL`, `Dim_DOCMetrics`, `Dim_Entity`, `Dim_Date`, and the existing `Doc_Booked` targets.

### Business Meaning And Impact

This procedure is important because it turns FIRE booked-deal and DOC metric inputs into reporting tables. The metadata shows 10 read dependencies, 2 write targets, 166 column-usage records, and 12 validated lineage edges.

### At A Glance

| Field                | Value                                     |
| -------------------- | ----------------------------------------- |
| Object               | `L1-5FSQL-01.Sonic_DW.dbo.usp_DOC_Booked` |
| Type                 | procedure                                 |
| Reads from           | 10 objects                                |
| Writes to            | 2 objects                                 |
| Column usage records | 166                                       |
| Validated edges      | 12                                        |
| Confidence           | high                                      |

### Lineage Summary

| Direction       | Object                                                                                                                                                                                  |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reads           | `Doc_Booked`, `vw_FIREBkdDealsAsFUEL`, `vw_Dim_Account`, `Doc_AccountGrouping`, `Dim_DOCMetrics`, `Dim_Entity`, `Doc_SubProjection`, `Doc_Booked_Historical`, `vw_Dim_date`, `Dim_Date` |
| Writes          | `Doc_Booked`, `Doc_Booked_Historical`                                                                                                                                                   |
| Orchestrated by | FIRE DOC SSIS package evidence surfaced in the FIRE product and SSIS folder pilots                                                                                                      |

### Business Logic Highlight

The procedure includes metric calculation logic. One surfaced rule applies sign handling for `Dim_DOCMetrics.GroupSubElement` values such as `Dealership Gross` and `Units`, and other surfaced expressions calculate `Doc_Booked.Amount` and `Doc_Booked.StatCount`.

### Support Checks

1. Confirm the FIRE DOC master SSIS package called this procedure successfully.
2. Check source availability from `vw_FIREBkdDealsAsFUEL` and the DOC/dimension reference objects.
3. Check row freshness in `Doc_Booked` and `Doc_Booked_Historical`.
4. If gross or unit values look inverted or unexpected, review the `Dim_DOCMetrics.GroupSubElement` sign-handling logic.

### Profile And Quality Signals

Runtime baseline and row-count profile signals were not surfaced in this packet.

## Dry-Run Review

| Review Question                                                                    | Result |
| ---------------------------------------------------------------------------------- | ------ |
| Includes at least one table, one view, and one procedure?                          | Yes    |
| Starts each page with plain-English purpose and impact?                            | Yes    |
| Includes upstream loaders/sources and downstream consumers/targets where surfaced? | Yes    |
| Labels weak or missing facts honestly?                                             | Yes    |
| Keeps technical evidence below the summary?                                        | Yes    |
