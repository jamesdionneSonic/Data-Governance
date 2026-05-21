---
name: Dim_Date
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - dimension
  - view
  - core-schema
depends_on:
  - dbo.Fact_Appointment
  - dbo.Fact_Appointment
  - dbo.FACT_JMA_CLAIMS_TBL
  - dbo.FACT_JMA_CLAIMS_TBL
  - dbo.FACT_JMA_CLAIMS_TBL
  - dbo.FACT_JMA_CONTRACT_TBL
  - dbo.FACT_JMA_CONTRACT_TBL
  - dbo.FACT_JMA_CONTRACT_TBL
  - dbo.FACT_JMA_CONTRACT_TBL
  - dbo.FactCBABuyerTarget
  - dbo.FactCBABuyerTarget
  - dbo.FactCBABuyerTarget
  - dbo.FactCBABuyerTarget
  - dbo.FactCBAMarketTarget
  - dbo.FactCBAMarketTarget
  - dbo.FactCollisionCSI
  - dbo.FactCollisionCSI
  - dbo.FactVehiclePurchase
  - dbo.FactVehiclePurchase
  - dbo.FactVehiclePurchase
  - dbo.Fact_BlackBookLeads
  - dbo.Fact_Merchandising
  - dbo.Fact_CallBright
  - dbo.Fact_CarsInvoice
  - dbo.Fact_CarsLeads
  - dbo.Fact_Jumpstart
  - dbo.Fact_PromoMailing
  - dbo.Fact_LeadBySource
  - dbo.Fact_WebPageViews
  - dbo.Fact_WebStats
  - dbo.FACT_JMA_CONTRACT_TBL
  - dbo.FactRemedy
  - dbo.FactRemedy
  - dbo.FactRemedy
  - dbo.FactRemedy
  - dbo.FactRemedy
  - dbo.Fact_AutoTrader
  - dbo.Fact_GoldDigger
row_count: 0
size_kb: 0
column_count: 0
index_count: 0
check_constraint_count: 0
extraction_warnings:
  - MISSING_VIEW_DATABASE_STATE
  - LARGE_EXTRACTION_LITE_MODE
  - VIEW_COLUMN_EXTRACTION_SKIPPED
  - LITE_MODE_ENABLED
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: view
- **Schema**: dbo
- **Row Count**: 0
- **Size**: 0 KB

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.
- **LARGE_EXTRACTION_LITE_MODE**: Column extraction skipped: 751 tables exceeds threshold. Use scoped extraction for column-level lineage.
- **VIEW_COLUMN_EXTRACTION_SKIPPED**: View column extraction skipped: 523 views exceeds threshold. Use scoped extraction for full view metadata.
- **LITE_MODE_ENABLED**: Column-level relationship detection skipped for 751 tables. Column metadata extracted but not cross-table matched.

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

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
