---
name: FactVehiclePurchase
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - core-schema
depends_on: []
row_count: 0
size_kb: 0
extraction_warnings:
  - MISSING_VIEW_DATABASE_STATE
  - LITE_MODE_ENABLED
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: view
- **Schema**: dbo
- **Row Count**: 0
- **Size**: 0 KB

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.
- **LITE_MODE_ENABLED**: Column-level lineage analysis disabled for large extraction (751 tables). Only explicit foreign keys detected.

## Relationships

### High Confidence (≥ 0.8)

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
- **explicit_fk**: dbo.FactVehiclePurchase → dbo.DimAuctionSource
  - Confidence: 100%
  - Evidence: undefined
  - Column: `AuctionSourceKey` → `AuctionSourceKey`
- **explicit_fk**: dbo.FactVehiclePurchase → dbo.DimLineOfBusiness
  - Confidence: 100%
  - Evidence: undefined
  - Column: `LineOfBusinessKey` → `LineOfBusinessKey`
- **explicit_fk**: dbo.FactVehiclePurchase → dbo.DimMarket
  - Confidence: 100%
  - Evidence: undefined
  - Column: `MarketKey` → `MarketKey`
- **explicit_fk**: dbo.FactVehiclePurchase → dbo.DimPurchaseMethod
  - Confidence: 100%
  - Evidence: undefined
  - Column: `PurchaseMethodKey` → `PurchaseMethodKey`
- **explicit_fk**: dbo.FactVehiclePurchase → dbo.DimTransportCompany
  - Confidence: 100%
  - Evidence: undefined
  - Column: `TransportationCompanyKey` → `TransportCompanyKey`
- **explicit_fk**: dbo.FactVehiclePurchase → dbo.DimVin
  - Confidence: 100%
  - Evidence: undefined
  - Column: `VehicleKey` → `VehicleKey`

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
