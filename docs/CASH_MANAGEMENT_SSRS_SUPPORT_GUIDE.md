# Cash Management SSRS Reports Support Guide

Generated: 2026-06-15  
Jira: DATA-16119  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`  
Application database reviewed: `CMS` on `D1-SQL-01B\INST1`

## Purpose

This guide documents the Cash Management SSRS reports found in the SSRS catalog. It is written as a support document for Data, BI, Operations, and application support teams that need to understand what each report does, where its data comes from, and where to begin troubleshooting when a report returns unexpected results.

The production Cash Management reports are located in the SSRS folder:

`/CMA`

## Executive Summary

Four production Cash Management reports were found under `/CMA`.

| Report                  | SSRS path                      | Status signal       |            Last 6 months usage | Last execution        | Primary datasource    |
| ----------------------- | ------------------------------ | ------------------- | -----------------------------: | --------------------- | --------------------- |
| Activity Details Report | `/CMA/Activity Details Report` | Active, high usage  | 37,944 executions by 228 users | 2026-06-12 13:33:29   | `/CMA/DataSource/CMA` |
| DailyActivitySummary    | `/CMA/DailyActivitySummary`    | Active              |  2,317 executions by 144 users | 2026-06-08 12:11:14   | `/CMA/DataSource/CMA` |
| DailyCashSummary        | `/CMA/DailyCashSummary`        | Active, lower usage |     885 executions by 68 users | 2026-04-10 10:38:18   | `/CMA/DataSource/CMA` |
| NegativeBalanceReportv3 | `/CMA/NegativeBalanceReportv3` | Review candidate    |                   0 executions | None in last 6 months | `/CMA/DataSource/CMA` |

No subscriptions were found for the production `/CMA` reports.

## Shared Data Sources

All production `/CMA` reports use the same SSRS shared datasource.

| SSRS datasource       | Type | Connection                                   | Credential mode | Enabled |
| --------------------- | ---- | -------------------------------------------- | --------------- | ------- |
| `/CMA/DataSource/CMA` | SQL  | `Data Source=cor-sql-02;Initial Catalog=CMS` | Integrated      | True    |

Additional datasource objects exist in the `/CMA/DataSource` folder, but they are not used by the production reports documented here.

| SSRS datasource               | Type | Connection                                                                    | Notes                                                           |
| ----------------------------- | ---- | ----------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `/CMA/DataSource/CMAListener` | SQL  | NULL in catalog definition                                                    | Not bound to the production `/CMA` reports found in this review |
| `/CMA/DataSource/CMATest`     | SQL  | `Data Source=L1-5FSQL-01,12013;Initial Catalog=CMS;MultiSubnetFailover=True;` | Test-oriented datasource object                                 |

## Production Report Inventory

### Activity Details Report

**SSRS path:** `/CMA/Activity Details Report`  
**Usage:** 37,944 executions in the last 6 months  
**Last execution:** 2026-06-12 13:33:29  
**Datasource:** `/CMA/DataSource/CMA`  
**Backend database:** `CMS`

#### What This Report Does

This report provides transaction-level Cash Management detail for a selected dealership, account, transaction type, date range, and optional text, amount, or check number filters.

Use this report when a user needs to research specific Cash Management transactions rather than view summarized daily balances.

#### User Parameters

| Parameter     | Prompt              | Type     | Notes                                           |
| ------------- | ------------------- | -------- | ----------------------------------------------- |
| `Dealership`  | Dealership          | String   | Required dealership selection                   |
| `AcctNumber`  | Acct Number         | String   | Multi-value account selector                    |
| `CDString`    | Debit or Credit     | String   | Multi-value debit or credit selector            |
| `DateStart`   | Date Start          | DateTime | Start of transaction date range                 |
| `DateEnd`     | Date End            | DateTime | End of transaction date range                   |
| `Textstring`  | Description Text    | String   | Optional text search against transaction text   |
| `Amount`      | Amount Greater Than | Float    | Optional lower amount filter                    |
| `Amount2`     | Amount Less Than    | Float    | Optional upper amount filter                    |
| `CheckNumber` | Check Number        | String   | Optional customer reference/check number filter |

#### Data Logic

The main dataset reads from `cmag.tblDetails` and joins to `cmag.vw_DealerAcctType` by account number.

In plain language, the report:

1. Starts with Cash Management transaction detail records.
2. Adds dealership and account type information from a dealer/account view.
3. Filters the result set by dealership.
4. Filters by one or more account numbers.
5. Filters by debit/credit transaction type.
6. Filters by transaction date range.
7. Optionally filters by description text, amount range, and check number.

#### Backend Dependencies

| Object                       | Purpose                                                             |
| ---------------------------- | ------------------------------------------------------------------- |
| `cmag.tblDetails`            | Transaction detail source for report results                        |
| `cmag.vw_DealerAcctType`     | Maps dealer/account numbers to dealer and account type descriptions |
| `cmag.usp_dearlerinfo`       | Dealer list helper used by report parameters                        |
| `cmag.tblDealershipInfo`     | Dealer master data used by helper objects                           |
| `cmag.tblDlrAccts`           | Dealer account mapping used by `vw_DealerAcctType`                  |
| `cmag.tblValidationElements` | Account type description source used by `vw_DealerAcctType`         |

#### Support Notes

If the report returns no rows, first verify the selected dealership, account numbers, transaction type, and date range. This report has several filters that can narrow the result set to zero.

If the dealership or account list looks incorrect, check the dealer/account metadata path: `cmag.vw_DealerAcctType`, `cmag.tblDealershipInfo`, `cmag.tblDlrAccts`, and `cmag.tblValidationElements`.

Because this is the highest-usage Cash Management report found in SSRS, production changes should be treated carefully.

### DailyActivitySummary

**SSRS path:** `/CMA/DailyActivitySummary`  
**Usage:** 2,317 executions in the last 6 months  
**Last execution:** 2026-06-08 12:11:14  
**Datasource:** `/CMA/DataSource/CMA`  
**Backend database:** `CMS`

#### What This Report Does

This report provides a daily Cash Management activity summary for a selected activity date.

Use this report when a user needs a date-specific view of daily Cash Management balances and activity across active dealerships.

#### User Parameters

| Parameter      | Prompt        | Type     | Notes                  |
| -------------- | ------------- | -------- | ---------------------- |
| `ActivityDate` | Activity Date | DateTime | Required activity date |

#### Data Logic

The report calls `cmag.usp_DailyActivity`, which returns rows from `cmag.tvfn_DailyActivity`.

In plain language, the report:

1. Accepts a single activity date.
2. Pulls active dealership activity for that date.
3. Joins activity data to dealership metadata.
4. Calculates beginning balance and daily cash balance values.
5. Applies special handling for `Sonic Automotive-CMA`, adding an adjustment of `46438.39` in the function logic.

#### Backend Dependencies

| Object                       | Purpose                                                  |
| ---------------------------- | -------------------------------------------------------- |
| `cmag.usp_DailyActivity`     | Report stored procedure                                  |
| `cmag.tvfn_DailyActivity`    | Main table-valued function returning daily activity      |
| `cmag.tblActivity`           | Daily activity, deposits, CDA, payroll, and balance data |
| `cmag.tblDealershipInfo`     | Dealer metadata and active dealer filtering              |
| `cmag.tblValidationElements` | Region or validation metadata used by the function       |

#### Support Notes

If a dealership is missing from the report, check whether the dealership is active in `cmag.tblDealershipInfo`.

If balances look off for `Sonic Automotive-CMA`, be aware that the backend function contains a hard-coded adjustment of `46438.39`. That adjustment should be reviewed before changing the report or function logic.

### DailyCashSummary

**SSRS path:** `/CMA/DailyCashSummary`  
**Usage:** 885 executions in the last 6 months  
**Last execution:** 2026-04-10 10:38:18  
**Datasource:** `/CMA/DataSource/CMA`  
**Backend database:** `CMS`

#### What This Report Does

This report provides a daily cash summary for one selected company/dealership and one selected year-month period.

Use this report when a user needs daily cash balance, deposit, and CDA movement for a specific company during a specific month.

#### User Parameters

| Parameter   | Prompt     | Type   | Notes                                 |
| ----------- | ---------- | ------ | ------------------------------------- |
| `Company`   | Company    | String | Required company/dealership selection |
| `YearMonth` | Year Month | String | Required `YYYY-MM` period             |

#### Data Logic

The main dataset calls `pDailyCashSummaryRpt`. In the `cmag` schema, the procedure is `cmag.pDailyCashSummaryRpt`. A `dbo.pDailyCashSummaryRpt` version also exists.

The report also uses helper datasets to populate:

| Dataset                      | Purpose                           |
| ---------------------------- | --------------------------------- |
| `CMS.cmag.tbldealershipinfo` | Company/dealership parameter list |
| `CMS.dbo.dimDate`            | Available year-month values       |
| `cmag.usp_dearlerinfo`       | Dealer helper procedure           |

In plain language, the stored procedure:

1. Looks up the dealer ID for the selected company from `CMS.cmag.tblDealershipInfo`.
2. Uses `CMS.dbo.DimDate` to build the list of dates in the selected `YYYY-MM` month.
3. Finds the most recent activity date before the selected month.
4. Uses that prior activity date to establish the beginning cash balance.
5. Loops through each date in the selected month.
6. Adds daily deposits and daily CDA from `CMS.cmag.tblActivity`.
7. Produces one row per day with cash balance, deposits, and CDA.

#### Backend Dependencies

| Object                      | Purpose                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------ |
| `cmag.pDailyCashSummaryRpt` | Main report stored procedure                                                                           |
| `dbo.pDailyCashSummaryRpt`  | Similar procedure present in `dbo`; report definition references `pDailyCashSummaryRpt` without schema |
| `cmag.tblActivity`          | Daily balance, deposits, and CDA values                                                                |
| `cmag.tblDealershipInfo`    | Dealer lookup for selected company                                                                     |
| `dbo.DimDate`               | Month/date calendar used to generate the selected period                                               |
| `cmag.usp_dearlerinfo`      | Dealer list helper                                                                                     |

#### Support Notes

If the report returns no rows, check that the selected company name exists in `CMS.cmag.tblDealershipInfo` and that `CMS.dbo.DimDate` contains the selected `CalendarYearMonth`.

If balances are incorrect, review the prior-month beginning balance lookup in `cmag.tblActivity`, then verify the daily `Act_Daily_Deposits` and `Act_Daily_CDA` values for the selected dealer and month.

The SSRS dataset command references `pDailyCashSummaryRpt` without a schema in the report definition. Both `cmag.pDailyCashSummaryRpt` and `dbo.pDailyCashSummaryRpt` exist in `CMS`; support should confirm execution context before changing either object.

### NegativeBalanceReportv3

**SSRS path:** `/CMA/NegativeBalanceReportv3`  
**Usage:** 0 executions in the last 6 months  
**Last execution:** None found in the last 6 months  
**Datasource:** `/CMA/DataSource/CMA`  
**Backend database:** `CMS`

#### What This Report Does

This report appears to calculate cash balances across active dealerships for a selected year-month period. Based on the name and procedure comments, it is intended to support Cash Management negative balance review.

Because no executions were found in the last 6 months, confirm whether the report is still needed before investing in changes.

#### User Parameters

| Parameter   | Prompt                           | Type   | Notes                     |
| ----------- | -------------------------------- | ------ | ------------------------- |
| `YearMonth` | Enter Year and Month as: YYYY-MM | String | Required `YYYY-MM` period |

#### Data Logic

The report calls `cmag.pNegativeBalanceRpt_Dev_BJ`.

In plain language, the stored procedure:

1. Builds a list of dates for the selected `YYYY-MM` month from `CMS.dbo.DimDate`.
2. Builds a list of active dealerships from `CMS.cmag.tblDealershipInfo`.
3. Finds the most recent activity date before the selected month.
4. Loops through each active dealership.
5. For each dealership, starts with the prior activity balance.
6. Loops through each day in the selected month.
7. Adds daily deposits and daily CDA from `CMS.cmag.tblActivity`.
8. Returns daily calculated cash balance rows by dealership.

#### Backend Dependencies

| Object                            | Purpose                                                  |
| --------------------------------- | -------------------------------------------------------- |
| `cmag.pNegativeBalanceRpt_Dev_BJ` | Main report stored procedure                             |
| `cmag.tblActivity`                | Daily balance, deposits, and CDA values                  |
| `cmag.tblDealershipInfo`          | Active dealership list and dealership names              |
| `dbo.DimDate`                     | Month/date calendar used to generate the selected period |

#### Support Notes

This report is a strong review candidate. It has no observed executions in the last 6 months and the procedure name includes `Dev_BJ`, which may indicate development or historical naming.

Before canceling, deleting, or replacing it, confirm with Cash Management users whether they still need a negative balance report.

## Test and Non-Production Report

One related test report was found outside the production `/CMA` folder.

| Report                | Path                          |                             Usage | Datasource              |
| --------------------- | ----------------------------- | --------------------------------: | ----------------------- |
| DailyCashSummary_TEST | `/Test/DailyCashSummary_TEST` | 0 executions in the last 6 months | `/Test/DataSource_TEST` |

The test datasource `/Test/DataSource_TEST` is SQL, uses Integrated credentials, and has a NULL connection string in the SSRS catalog definition.

Do not treat `/Test/DailyCashSummary_TEST` as a production Cash Management report unless a user specifically references the `/Test` path.

## Dependency Map

| SSRS report                    | Dataset command                   | Backend objects                                                         |
| ------------------------------ | --------------------------------- | ----------------------------------------------------------------------- |
| `/CMA/Activity Details Report` | Inline SQL                        | `cmag.tblDetails`, `cmag.vw_DealerAcctType`                             |
| `/CMA/Activity Details Report` | `cmag.usp_dearlerinfo`            | `cmag.tvfn_dearlerinfo`, `cmag.tblDealershipInfo`                       |
| `/CMA/DailyActivitySummary`    | `cmag.usp_DailyActivity`          | `cmag.tvfn_DailyActivity`, `cmag.tblActivity`, `cmag.tblDealershipInfo` |
| `/CMA/DailyCashSummary`        | `pDailyCashSummaryRpt`            | `cmag.tblActivity`, `cmag.tblDealershipInfo`, `dbo.DimDate`             |
| `/CMA/DailyCashSummary`        | Inline SQL                        | `CMS.cmag.tbldealershipinfo`, `CMS.dbo.dimDate`                         |
| `/CMA/DailyCashSummary`        | `cmag.usp_dearlerinfo`            | `cmag.tvfn_dearlerinfo`, `cmag.tblDealershipInfo`                       |
| `/CMA/NegativeBalanceReportv3` | `cmag.pNegativeBalanceRpt_Dev_BJ` | `cmag.tblActivity`, `cmag.tblDealershipInfo`, `dbo.DimDate`             |

## Key Backend Tables and Views

### `cmag.tblActivity`

Main daily activity and balance table used by summary reports.

Important columns include:

| Column                   | Meaning                 |
| ------------------------ | ----------------------- |
| `Act_Date`               | Activity date           |
| `Act_DLR_ID`             | Dealer ID               |
| `Act_Daily_Cash_Balance` | Daily cash balance      |
| `Act_Daily_Deposits`     | Daily deposits          |
| `Act_Daily_CDA`          | Daily CDA               |
| `Act_Daily_Payroll`      | Daily payroll           |
| `BeginingBalance`        | Beginning balance field |
| `EndingBalance`          | Ending balance field    |

### `cmag.tblDetails`

Transaction detail table used by Activity Details Report.

Important columns include:

| Column        | Meaning                                   |
| ------------- | ----------------------------------------- |
| `Det_TxnDate` | Transaction date                          |
| `Det_AcctNum` | Account number                            |
| `Det_TxnType` | Transaction type, such as debit or credit |
| `Det_TxnDesc` | Transaction description                   |
| `Det_Amount`  | Transaction amount                        |
| `Det_CustRef` | Customer reference or check number        |
| `Det_BankRef` | Bank reference                            |
| `Det_Text`    | Searchable transaction text               |

### `cmag.tblDealershipInfo`

Dealer master and metadata table used for report parameters, active dealer filtering, and dealer ID lookups.

Important columns include:

| Column             | Meaning                          |
| ------------------ | -------------------------------- |
| `Dlr_id`           | Dealer ID                        |
| `Dlr_dealership`   | Dealership/company name          |
| `Dlr_active`       | Active dealership flag           |
| `Dlr_DW_ID`        | Data warehouse dealer identifier |
| `Dlr_VE_Region_ID` | Region metadata identifier       |

### `cmag.vw_DealerAcctType`

View used by Activity Details Report to enrich account-level detail with dealer and account type information.

It joins:

| Source                       | Role                     |
| ---------------------------- | ------------------------ |
| `cmag.tblDealershipInfo`     | Dealer information       |
| `cmag.tblDlrAccts`           | Dealer account mapping   |
| `cmag.tblValidationElements` | Account type description |

### `dbo.DimDate`

Calendar/date dimension used to produce valid month/date values for summary reports.

Important columns include:

| Column              | Meaning                             |
| ------------------- | ----------------------------------- |
| `FullDate`          | Calendar date                       |
| `CalendarYearMonth` | `YYYY-MM` month key used by reports |
| `CalendarYear`      | Calendar year                       |
| `MonthName`         | Month name                          |

## Support Troubleshooting Guide

### User Cannot Find the Report

Confirm the user is looking in the production SSRS folder:

`/CMA`

The related test report is under `/Test` and should not be used unless specifically requested.

### Report Returns No Data

Check these items first:

1. Confirm the user selected the expected dealership/company.
2. Confirm the selected date or `YYYY-MM` period has data.
3. Confirm the selected account or transaction type filters are not too narrow.
4. For summary reports, confirm `CMS.dbo.DimDate` contains the selected month.
5. For dealership-specific reports, confirm the dealership exists and is active in `CMS.cmag.tblDealershipInfo`.

### Balances Look Incorrect

For Daily Cash Summary or Negative Balance:

1. Check the prior activity date used as the beginning balance date.
2. Validate `Act_Daily_Cash_Balance` for that prior activity date.
3. Validate daily `Act_Daily_Deposits` and `Act_Daily_CDA` values for the selected month.
4. Review whether the report is using `cmag.pDailyCashSummaryRpt` or `dbo.pDailyCashSummaryRpt`.

For Daily Activity Summary:

1. Check `cmag.tvfn_DailyActivity`.
2. Review the hard-coded `Sonic Automotive-CMA` adjustment of `46438.39`.

### Dealer or Account Lists Look Wrong

Check:

1. `CMS.cmag.tblDealershipInfo`
2. `CMS.cmag.tblDlrAccts`
3. `CMS.cmag.tblValidationElements`
4. `CMS.cmag.vw_DealerAcctType`
5. `CMS.cmag.tvfn_dearlerinfo`

### Datasource or Connection Failure

The production SSRS reports use:

`/CMA/DataSource/CMA`

with connection:

`Data Source=cor-sql-02;Initial Catalog=CMS`

From this discovery session, the `CMS` database was also reachable through:

`D1-SQL-01B\INST1`

If SSRS fails but direct SQL access works, check SSRS datasource configuration, Windows integrated authentication, and the availability of the `cor-sql-02` alias from the SSRS server.

## Reports Needing Business Review

### `/CMA/NegativeBalanceReportv3`

Reason for review:

| Signal | Detail                                                   |
| ------ | -------------------------------------------------------- |
| Usage  | 0 executions in the last 6 months                        |
| Naming | Backend procedure is `cmag.pNegativeBalanceRpt_Dev_BJ`   |
| Risk   | May be unused, historical, or replaced by another report |

Recommended next step: confirm with Cash Management stakeholders whether this report is still needed.

## Technical Appendix

### SSRS Dataset Commands

| Report                  | Dataset    | Command type    | Command                                                                                                                                                     |
| ----------------------- | ---------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Activity Details Report | `DataSet1` | Text            | Reads `cmag.tblDetails` joined to `cmag.vw_DealerAcctType`; filters by dealership, account number, debit/credit, date range, text, amount, and check number |
| Activity Details Report | `DataSet2` | Text            | `select distinct dlr_dealership from vw_DealerAcctType order by dlr_dealership`                                                                             |
| Activity Details Report | `DataSet3` | Text            | Reads `vw_DealerAcctType` for the selected dealership and adds an `All Dealerships` row                                                                     |
| Activity Details Report | `DataSet4` | StoredProcedure | `cmag.usp_dearlerinfo`                                                                                                                                      |
| DailyActivitySummary    | `DataSet1` | StoredProcedure | `cmag.usp_DailyActivity`                                                                                                                                    |
| DailyCashSummary        | `DataSet1` | StoredProcedure | `pDailyCashSummaryRpt`                                                                                                                                      |
| DailyCashSummary        | `DataSet2` | Text            | `select dlr_dealership from CMS.cmag.tbldealershipinfo order by dlr_dealership`                                                                             |
| DailyCashSummary        | `DataSet3` | Text            | Reads distinct `CalendarYearMonth` from `CMS.dbo.dimDate` through current date                                                                              |
| DailyCashSummary        | `DataSet4` | StoredProcedure | `cmag.usp_dearlerinfo`                                                                                                                                      |
| NegativeBalanceReportv3 | `DataSet1` | StoredProcedure | `cmag.pNegativeBalanceRpt_Dev_BJ`                                                                                                                           |

### Backend Object Definitions Reviewed

Definitions were extracted from `CMS` for:

| Object                            | Type                         |
| --------------------------------- | ---------------------------- |
| `cmag.pDailyCashSummaryRpt`       | Stored procedure             |
| `dbo.pDailyCashSummaryRpt`        | Stored procedure             |
| `cmag.pNegativeBalanceRpt_Dev_BJ` | Stored procedure             |
| `cmag.usp_DailyActivity`          | Stored procedure             |
| `cmag.usp_dearlerinfo`            | Stored procedure             |
| `cmag.tvfn_DailyActivity`         | Inline table-valued function |
| `cmag.tvfn_dearlerinfo`           | Inline table-valued function |
| `cmag.vw_DealerAcctType`          | View                         |

### Local Discovery Artifacts

The following local files were produced during discovery:

| File                                        | Purpose                                                        |
| ------------------------------------------- | -------------------------------------------------------------- |
| `tmp/ssrs-cma-discovery-summary.sql`        | SSRS catalog, datasource, dataset, and parameter summary query |
| `tmp/ssrs-cma-report-datasets-output.txt`   | Raw SSRS dataset extraction output                             |
| `tmp/cma-cms-backend-discovery.sql`         | CMS backend object, table, and dependency extraction query     |
| `tmp/cma-cms-backend-discovery-output.txt`  | Raw CMS backend extraction output                              |
| `tmp/cma-cms-function-discovery.sql`        | CMS function extraction query                                  |
| `tmp/cma-cms-function-discovery-output.txt` | Raw CMS function extraction output                             |
