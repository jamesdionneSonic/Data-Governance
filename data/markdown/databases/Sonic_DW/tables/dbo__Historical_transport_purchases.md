---
name: Historical_transport_purchases
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on: []
row_count: 0
size_kb: 0
column_count: 28
index_count: 0
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

| Name               | Type     | Nullable | Identity | Default | Description |
| ------------------ | -------- | -------- | -------- | ------- | ----------- |
| `SnapshotDate`     | date     | ✓        |          |         |             |
| `Remove`           | int      | ✓        |          |         |             |
| `VIN`              | varchar  | ✓        |          |         |             |
| `Entry`            | date     | ✓        |          |         |             |
| `Receiving_Market` | varchar  | ✓        |          |         |             |
| `Trans_Loc`        | varchar  | ✓        |          |         |             |
| `CBS_Location`     | varchar  | ✓        |          |         |             |
| `Store`            | varchar  | ✓        |          |         |             |
| `Trans_Status`     | varchar  | ✓        |          |         |             |
| `CBS_Status`       | varchar  | ✓        |          |         |             |
| `Status_Rollup`    | varchar  | ✓        |          |         |             |
| `Stock_No`         | varchar  | ✓        |          |         |             |
| `Year`             | float    | ✓        |          |         |             |
| `Make`             | varchar  | ✓        |          |         |             |
| `Model`            | varchar  | ✓        |          |         |             |
| `Trim`             | varchar  | ✓        |          |         |             |
| `DT`               | varchar  | ✓        |          |         |             |
| `Age`              | smallint | ✓        |          |         |             |
| `Days_In_Recon`    | int      | ✓        |          |         |             |
| `Rec_Mkt_2`        | varchar  | ✓        |          |         |             |
| `Purch_Dealer`     | varchar  | ✓        |          |         |             |
| `Buyer`            | varchar  | ✓        |          |         |             |
| `Source`           | varchar  | ✓        |          |         |             |
| `Auction`          | varchar  | ✓        |          |         |             |
| `Seller`           | varchar  | ✓        |          |         |             |
| `Purchase_Date`    | datetime | ✓        |          |         |             |
| `Run_Date`         | datetime | ✓        |          |         |             |
| `origintype`       | varchar  | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
