---
name: vw_eleads_prospects_dmssales
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - Dim_OpportunitySource
  - DimOpportunitySource
  - Dim_OpportunitySource
  - DimOpportunitySource
row_count: 0
size_kb: 0
column_count: 23
index_count: 1
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

| Name                       | Type    | Nullable | Identity | Default | Description |
| -------------------------- | ------- | -------- | -------- | ------- | ----------- |
| `vweLeadDMSSalesID`        | bigint  |          |          |         |             |
| `entregion`                | varchar | ✓        |          |         |             |
| `EntLineOfBusiness`        | varchar | ✓        |          |         |             |
| `entdealerlvl1`            | varchar | ✓        |          |         |             |
| `entbrand`                 | varchar | ✓        |          |         |             |
| `fulldate`                 | date    | ✓        |          |         |             |
| `datekey`                  | int     | ✓        |          |         |             |
| `entitykey`                | int     | ✓        |          |         |             |
| `SrcUpType`                | varchar | ✓        |          |         |             |
| `SrcSourceID`              | int     | ✓        |          |         |             |
| `SrcSourceDesc`            | varchar | ✓        |          |         |             |
| `Standardleadsourcename`   | varchar | ✓        |          |         |             |
| `ThirdPartySourceStandard` | varchar | ✓        |          |         |             |
| `SrcSubSourceID`           | int     | ✓        |          |         |             |
| `SrcSubSourceDesc`         | varchar | ✓        |          |         |             |
| `NewUsed`                  | varchar | ✓        |          |         |             |
| `BoughtVehYear`            | int     | ✓        |          |         |             |
| `BoughtVehMake`            | varchar | ✓        |          |         |             |
| `BoughtVehModel`           | varchar | ✓        |          |         |             |
| `AddressZipCode`           | varchar | ✓        |          |         |             |
| `LeadCountTY`              | int     | ✓        |          |         |             |
| `EleadsDMSSold`            | int     | ✓        |          |         |             |
| `Exclude`                  | int     | ✓        |          |         |             |

## Constraints

- **Primary Key**: vw_eleads_prospects_dmssalesPK
  - Columns: vweLeadDMSSalesID

## Indexes

- **vw_eleads_prospects_dmssalesPK** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: vweLeadDMSSalesID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Dim_OpportunitySource → dbo.vw_eleads_prospects_dmssales
  - Confidence: 80%
  - Evidence: Exact column name match: "srcsourceid" in both tables
  - Column: `SrcSourceID` → `SrcSourceID`
- **column_match**: dbo.DimOpportunitySource → dbo.vw_eleads_prospects_dmssales
  - Confidence: 80%
  - Evidence: Exact column name match: "srcsourceid" in both tables
  - Column: `SrcSourceID` → `SrcSourceID`
- **column_match**: dbo.vw_eleads_prospects_dmssales → dbo.vw_eleads_prospects_dmssales_social
  - Confidence: 80%
  - Evidence: Exact column name match: "srcsourceid" in both tables
  - Column: `SrcSourceID` → `SrcSourceID`
- **column_match**: dbo.Dim_OpportunitySource → dbo.vw_eleads_prospects_dmssales
  - Confidence: 80%
  - Evidence: Exact column name match: "srcsubsourceid" in both tables
  - Column: `SrcSubSourceID` → `SrcSubSourceID`
- **column_match**: dbo.DimOpportunitySource → dbo.vw_eleads_prospects_dmssales
  - Confidence: 80%
  - Evidence: Exact column name match: "srcsubsourceid" in both tables
  - Column: `SrcSubSourceID` → `SrcSubSourceID`
- **column_match**: dbo.vw_eleads_prospects_dmssales → dbo.vw_eleads_prospects_dmssales_social
  - Confidence: 80%
  - Evidence: Exact column name match: "srcsubsourceid" in both tables
  - Column: `SrcSubSourceID` → `SrcSubSourceID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
