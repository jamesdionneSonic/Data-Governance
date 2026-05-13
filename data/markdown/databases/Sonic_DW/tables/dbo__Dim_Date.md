---
name: Dim_Date
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - dimension
  - core-schema
depends_on:
  - Fact_Appointment
  - Fact_Appointment
  - FACT_JMA_CLAIMS_TBL
  - FACT_JMA_CLAIMS_TBL
  - FACT_JMA_CLAIMS_TBL
  - FACT_JMA_CONTRACT_TBL
  - FACT_JMA_CONTRACT_TBL
  - FACT_JMA_CONTRACT_TBL
  - FACT_JMA_CONTRACT_TBL
  - FactCBABuyerTarget
  - FactCBABuyerTarget
  - FactCBABuyerTarget
  - FactCBABuyerTarget
  - FactCBAMarketTarget
  - FactCBAMarketTarget
  - FactCollisionCSI
  - FactCollisionCSI
  - FactVehiclePurchase
  - FactVehiclePurchase
  - FactVehiclePurchase
  - Fact_BlackBookLeads
  - Fact_Merchandising
  - Fact_CallBright
  - Fact_CarsInvoice
  - Fact_CarsLeads
  - Fact_Jumpstart
  - Fact_PromoMailing
  - Fact_LeadBySource
  - Fact_WebPageViews
  - Fact_WebStats
  - FACT_JMA_CONTRACT_TBL
  - FactRemedy
  - FactRemedy
  - FactRemedy
  - FactRemedy
  - FactRemedy
  - Fact_AutoTrader
  - Fact_GoldDigger
row_count: 0
size_kb: 0
column_count: 73
index_count: 18
check_constraint_count: 0
extraction_warnings:
  - MISSING_VIEW_DATABASE_STATE
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: table
- **Schema**: dbo
- **Row Count**: 0
- **Size**: 0 KB

## Columns

| Name                                 | Type     | Nullable | Identity | Default | Description |
| ------------------------------------ | -------- | -------- | -------- | ------- | ----------- |
| `DateKey`                            | int      |          |          |         |             |
| `DateKey_LY`                         | int      | ✓        |          |         |             |
| `FullDate`                           | date     |          |          |         |             |
| `FullDate_LY_Join`                   | date     | ✓        |          |         |             |
| `MonthNumberOfYear`                  | tinyint  |          |          |         |             |
| `MonthNumberOfQuarter`               | tinyint  |          |          |         |             |
| `ISOYearAndWeekNumber`               | char     |          |          |         |             |
| `ISOWeekNumberOfYear`                | tinyint  |          |          |         |             |
| `SSWeekNumberOfYear`                 | tinyint  |          |          |         |             |
| `ISOWeekNumberOfQuarter_454_Pattern` | tinyint  |          |          |         |             |
| `SSWeekNumberOfQuarter_454_Pattern`  | tinyint  |          |          |         |             |
| `SSWeekNumberOfMonth`                | tinyint  |          |          |         |             |
| `DayNumberOfYear`                    | smallint |          |          |         |             |
| `DaysSince1900`                      | int      |          |          |         |             |
| `DayNumberOfFiscalYear`              | smallint |          |          |         |             |
| `DayNumberOfQuarter`                 | smallint |          |          |         |             |
| `DayNumberOfMonth`                   | tinyint  |          |          |         |             |
| `DayNumberOfWeek_Sun_Start`          | tinyint  |          |          |         |             |
| `MonthName`                          | varchar  |          |          |         |             |
| `MonthNameAbbreviation`              | char     |          |          |         |             |
| `DayName`                            | varchar  |          |          |         |             |
| `DayNameAbbreviation`                | char     |          |          |         |             |
| `CalendarYear`                       | smallint |          |          |         |             |
| `CalendarYearMonth`                  | char     |          |          |         |             |
| `CalendarYearQtr`                    | char     |          |          |         |             |
| `CalendarSemester`                   | tinyint  |          |          |         |             |
| `CalendarQuarter`                    | tinyint  |          |          |         |             |
| `FiscalYear`                         | smallint |          |          |         |             |
| `FiscalMonth`                        | tinyint  |          |          |         |             |
| `FiscalMonthKey`                     | int      | ✓        |          |         |             |
| `FiscalQuarter`                      | tinyint  |          |          |         |             |
| `FiscalYearMonth`                    | char     |          |          |         |             |
| `FiscalYearQtr`                      | char     |          |          |         |             |
| `QuarterNumber`                      | int      |          |          |         |             |
| `YYYYMMDD`                           | char     |          |          |         |             |
| `MM/DD/YYYY`                         | char     |          |          |         |             |
| `YYYY/MM/DD`                         | char     |          |          |         |             |
| `YYYY-MM-DD`                         | char     |          |          |         |             |
| `MonDDYYYY`                          | char     |          |          |         |             |
| `SonicVarBusinessDay`                | int      | ✓        |          |         |             |
| `FixedOpsDayFlag`                    | int      | ✓        |          |         |             |
| `FixedOpsDayMTD`                     | int      | ✓        |          |         |             |
| `FOpsDaysMonth`                      | int      | ✓        |          |         |             |
| `FixedOpsDayMonthKey`                | int      | ✓        |          |         |             |
| `VariableOpsDayFlag`                 | int      | ✓        |          |         |             |
| `VariableOpsDayMTD`                  | int      | ✓        |          |         |             |
| `VOpsDaysMonth`                      | int      | ✓        |          |         |             |
| `VariableOpsDayMonthKey`             | int      | ✓        |          |         |             |
| `IsFirstDayOfMonth`                  | char     | ✓        |          |         |             |
| `IsLastDayOfMonth`                   | char     |          |          |         |             |
| `IsWeekday`                          | char     |          |          |         |             |
| `IsSonicWeekday`                     | char     | ✓        |          | ('N')   |             |
| `IsWeekend`                          | char     |          |          |         |             |
| `IsSonicWeekend`                     | char     | ✓        |          | ('N')   |             |
| `IsWorkday`                          | char     |          |          | ('N')   |             |
| `IsFederalHoliday`                   | char     |          |          | ('N')   |             |
| `IsBankHoliday`                      | char     |          |          | ('N')   |             |
| `IsCompanyHoliday`                   | char     |          |          | ('N')   |             |
| `IsCurrentDay`                       | char     | ✓        |          |         |             |
| `IsPreviousDay`                      | char     | ✓        |          |         |             |
| `IsCurrentWeek`                      | char     | ✓        |          |         |             |
| `IsPreviousWeek`                     | char     | ✓        |          |         |             |
| `IsCurrentMonth`                     | char     | ✓        |          |         |             |
| `IsPreviousMonth`                    | char     | ✓        |          |         |             |
| `IsCurrentQuarter`                   | char     | ✓        |          |         |             |
| `IsPreviousQuarter`                  | char     | ✓        |          |         |             |
| `IsCurrentYear`                      | char     | ✓        |          |         |             |
| `IsPreviousYear`                     | char     | ✓        |          |         |             |
| `DocRolloverFlag`                    | int      | ✓        |          |         |             |
| `DocRolloverDate`                    | int      | ✓        |          |         |             |
| `DaysAlignedFullKey`                 | int      | ✓        |          |         |             |
| `DaylightSavingsAdjustment`          | int      | ✓        |          |         |             |
| `DateKeyTMPriorYear`                 | int      | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_Dim_Date1
  - Columns: DateKey

## Indexes

- **\_dta_index_Dim_Date_10_1138103095\_\_K1_K27_K26** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: DateKey ASC, FiscalMonth ASC, FiscalYear ASC
  - Included Columns: MonthNumberOfYear, DayNumberOfMonth, DayNumberOfWeek_Sun_Start
- **\_dta_index_Dim_Date_10_1138103095\_\_K2** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: FullDate ASC
- **\_dta_index_Dim_Date_10_1138103095\_\_K26_K27** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: FiscalYear ASC, FiscalMonth ASC
- **\_dta_index_Dim_Date_10_1138103095\_\_K26_K27_K1** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: FiscalYear ASC, FiscalMonth ASC, DateKey ASC
- **\_dta_index_Dim_Date_10_1138103095\_\_K26_K27_K1_18** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: FiscalYear ASC, FiscalMonth ASC, DateKey ASC
  - Included Columns: MonthNameAbbreviation
- **\_dta_index_Dim_Date_10_1138103095\_\_K26_K27_K3_K17_K4_K1_K2_18** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: FiscalYear ASC, FiscalMonth ASC, MonthNumberOfYear ASC, MonthName ASC, MonthNumberOfQuarter ASC, DateKey ASC, FullDate ASC
  - Included Columns: MonthNameAbbreviation
- **\_dta_index_Dim_Date_10_1138103095\_\_K26_K27_K3_K4_K17** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: FiscalYear ASC, FiscalMonth ASC, MonthNumberOfYear ASC, MonthNumberOfQuarter ASC, MonthName ASC
- **\_dta_index_Dim_Date_10_1138103095\_\_K27_K26_2_18** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: FiscalMonth ASC, FiscalYear ASC
  - Included Columns: FullDate, MonthNameAbbreviation
- **\_dta_index_Dim_Date_10_1138103095\_\_K27_K26_K1** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: FiscalMonth ASC, FiscalYear ASC, DateKey ASC
- **\_dta_index_Dim_Date_12_2008446279\_\_K30_K1_K80_K49_K44_72** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: FiscalMonthKey ASC, DateKey ASC, DateKeyTMPriorYear ASC, VOpsDaysMonth ASC, FOpsDaysMonth ASC
  - Included Columns: DocRolloverDate
- **\_dta_index_Dim_Date_6_473573271\_\_K3_K1_K73_K30** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: FullDate ASC, DateKey ASC, DateKeyTMPriorYear ASC, FiscalMonthKey ASC
- **\_dta_index_Dim_Date_6_473573271\_\_K30_K3_1_73** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: FiscalMonthKey ASC, FullDate ASC
  - Included Columns: DateKey, DateKeyTMPriorYear
- **IDX_DaysAligned** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: DaysAlignedFullKey ASC
- **IDX_Dim_Date_DateKey** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: FullDate ASC, DateKey ASC, FiscalYear ASC, FiscalMonth ASC
  - Included Columns: DateKey_LY
- **IDX_Dim_Date_DateKeyLY** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: DateKey ASC, DateKey_LY ASC, FullDate ASC
- **IDX_FiscalMonthKey** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: FiscalMonthKey ASC
- **month** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: FiscalYear ASC, FiscalMonth ASC
- **PK_Dim_Date1** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: DateKey ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.Fact_Appointment → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `AppointmentDateKey` → `DateKey`
- **explicit_fk**: dbo.Fact_Appointment → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `EstimatedCompletionDateKey` → `DateKey`
- **explicit_fk**: dbo.FACT_JMA_CLAIMS_TBL → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `AUTHORIZATION_DATEKEY` → `DateKey`
- **explicit_fk**: dbo.FACT_JMA_CLAIMS_TBL → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `PAID_DATEKEY` → `DateKey`
- **explicit_fk**: dbo.FACT_JMA_CLAIMS_TBL → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `TRANSACTION_DATEKEY` → `DateKey`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `CANCELLATION_EFFECTIVE_DATEKEY` → `DateKey`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `CONTRACT_PURCHASE_DATEKEY` → `DateKey`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `INVOICE_BILLING_DATEKEY` → `DateKey`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `TRANSACTION_DATEKEY` → `DateKey`
- **explicit_fk**: dbo.FactCBABuyerTarget → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `WeekStartDateKey` → `DateKey`
- **explicit_fk**: dbo.FactCBABuyerTarget → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `WeekEndDateKey` → `DateKey`
- **explicit_fk**: dbo.FactCBABuyerTarget → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `CreatedOnDateKey` → `DateKey`
- **explicit_fk**: dbo.FactCBABuyerTarget → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `ModifiedOnDateKey` → `DateKey`
- **explicit_fk**: dbo.FactCBAMarketTarget → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `WeekStartDateKey` → `DateKey`
- **explicit_fk**: dbo.FactCBAMarketTarget → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `WeekEndDateKey` → `DateKey`
- **explicit_fk**: dbo.FactCollisionCSI → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `FiscalMonthDateKey` → `DateKey`
- **explicit_fk**: dbo.FactCollisionCSI → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `FiscalMonthDateKey` → `DateKey`
- **explicit_fk**: dbo.FactVehiclePurchase → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `PurchaseDateKey` → `DateKey`
- **explicit_fk**: dbo.FactVehiclePurchase → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `CreatedOnDateKey` → `DateKey`
- **explicit_fk**: dbo.FactVehiclePurchase → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `ModifiedOnDateKey` → `DateKey`
- **explicit_fk**: dbo.Fact_BlackBookLeads → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `DateKey` → `DateKey`
- **explicit_fk**: dbo.Fact_Merchandising → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `DateKey` → `DateKey`
- **explicit_fk**: dbo.Fact_CallBright → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `DateKey` → `DateKey`
- **explicit_fk**: dbo.Fact_CarsInvoice → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `InvoiceDateKey` → `DateKey`
- **explicit_fk**: dbo.Fact_CarsLeads → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `DateKey` → `DateKey`
- **explicit_fk**: dbo.Fact_Jumpstart → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `DateKey` → `DateKey`
- **explicit_fk**: dbo.Fact_PromoMailing → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `MailedDateKey` → `DateKey`
- **explicit_fk**: dbo.Fact_LeadBySource → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `DateKey` → `DateKey`
- **explicit_fk**: dbo.Fact_WebPageViews → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `PageViewDateKey` → `DateKey`
- **explicit_fk**: dbo.Fact_WebStats → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `DateKey` → `DateKey`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.Dim_Date
  - Confidence: 95%
  - Evidence: undefined
  - Column: `CHECK_DATEKEY` → `DateKey`
- **explicit_fk**: dbo.FactRemedy → dbo.Dim_Date
  - Confidence: 95%
  - Evidence: undefined
  - Column: `ClosedDateKey` → `DateKey`
- **explicit_fk**: dbo.FactRemedy → dbo.Dim_Date
  - Confidence: 95%
  - Evidence: undefined
  - Column: `LastModifiedDateKey` → `DateKey`
- **explicit_fk**: dbo.FactRemedy → dbo.Dim_Date
  - Confidence: 95%
  - Evidence: undefined
  - Column: `LastResolvedDateKey` → `DateKey`
- **explicit_fk**: dbo.FactRemedy → dbo.Dim_Date
  - Confidence: 95%
  - Evidence: undefined
  - Column: `ReportedDateKey` → `DateKey`
- **explicit_fk**: dbo.FactRemedy → dbo.Dim_Date
  - Confidence: 95%
  - Evidence: undefined
  - Column: `SubmitDateKey` → `DateKey`
- **explicit_fk**: dbo.Fact_AutoTrader → dbo.Dim_Date
  - Confidence: 95%
  - Evidence: undefined
  - Column: `DateKey` → `DateKey`
- **explicit_fk**: dbo.Fact_GoldDigger → dbo.Dim_Date
  - Confidence: 95%
  - Evidence: undefined
  - Column: `DateKey` → `DateKey`
- **column_match**: dbo.Dim_Date → dbo.Dim_Date_Filtered
  - Confidence: 80%
  - Evidence: Exact column name match: "isfederalholiday" in both tables
  - Column: `IsFederalHoliday` → `IsFederalHoliday`
- **column_match**: dbo.Dim_Date → dbo.Dim_DateClone
  - Confidence: 80%
  - Evidence: Exact column name match: "isfederalholiday" in both tables
  - Column: `IsFederalHoliday` → `IsFederalHoliday`
- **column_match**: dbo.Dim_Date → dbo.Dim_Date_Filtered
  - Confidence: 80%
  - Evidence: Exact column name match: "isbankholiday" in both tables
  - Column: `IsBankHoliday` → `IsBankHoliday`
- **column_match**: dbo.Dim_Date → dbo.Dim_DateClone
  - Confidence: 80%
  - Evidence: Exact column name match: "isbankholiday" in both tables
  - Column: `IsBankHoliday` → `IsBankHoliday`
- **column_match**: dbo.Dim_Date → dbo.Dim_Date_Filtered
  - Confidence: 80%
  - Evidence: Exact column name match: "iscompanyholiday" in both tables
  - Column: `IsCompanyHoliday` → `IsCompanyHoliday`
- **column_match**: dbo.Dim_Date → dbo.Dim_DateClone
  - Confidence: 80%
  - Evidence: Exact column name match: "iscompanyholiday" in both tables
  - Column: `IsCompanyHoliday` → `IsCompanyHoliday`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
