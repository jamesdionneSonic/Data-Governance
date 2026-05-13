---
name: DimStandardLeadSource
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - DimLeadSource
  - DimLeadSource
  - DimLeadSource_Backup
  - DimLeadSource
  - DimLeadSource_Backup
  - DimLeadSource
  - DimLeadSource_Backup
  - DimLeadSourceTier
row_count: 0
size_kb: 0
column_count: 10
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

| Name                     | Type     | Nullable | Identity | Default | Description |
| ------------------------ | -------- | -------- | -------- | ------- | ----------- |
| `StandardLeadSourceID`   | int      |          | ✓        |         |             |
| `StandardLeadSourceName` | varchar  | ✓        |          |         |             |
| `CreatedOn`              | datetime |          |          |         |             |
| `CreatedBy`              | varchar  |          |          |         |             |
| `ModifiedOn`             | datetime | ✓        |          |         |             |
| `ModifiedBy`             | varchar  | ✓        |          |         |             |
| `LeadSourceTierID`       | int      | ✓        |          | ((5))   |             |
| `LeadSourceTierEPID`     | int      | ✓        |          |         |             |
| `UpTypeTierID`           | int      | ✓        |          |         |             |
| `LeadSourceTierPSID`     | int      | ✓        |          |         |             |

## Constraints

- **Primary Key**: Pk_StandardLeadSource_StandardLeadSourceID
  - Columns: StandardLeadSourceID

## Indexes

- **Pk_StandardLeadSource_StandardLeadSourceID** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: StandardLeadSourceID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.DimLeadSource → dbo.DimStandardLeadSource
  - Confidence: 100%
  - Evidence: undefined
  - Column: `StandardLeadSourceID` → `StandardLeadSourceID`
- **column_match**: dbo.DimLeadSource → dbo.DimStandardLeadSource
  - Confidence: 80%
  - Evidence: Exact column name match: "standardleadsourceid" in both tables
  - Column: `StandardLeadSourceID` → `StandardLeadSourceID`
- **column_match**: dbo.DimLeadSource_Backup → dbo.DimStandardLeadSource
  - Confidence: 80%
  - Evidence: Exact column name match: "standardleadsourceid" in both tables
  - Column: `StandardLeadSourceID` → `StandardLeadSourceID`
- **column_match**: dbo.DimStandardLeadSource → dbo.StandardLeadSource_bkp
  - Confidence: 80%
  - Evidence: Exact column name match: "standardleadsourceid" in both tables
  - Column: `StandardLeadSourceID` → `StandardLeadSourceID`
- **column_match**: dbo.DimLeadSource → dbo.DimStandardLeadSource
  - Confidence: 80%
  - Evidence: Exact column name match: "leadsourcetierepid" in both tables
  - Column: `LeadSourceTierEPID` → `LeadSourceTierEPID`
- **column_match**: dbo.DimLeadSource_Backup → dbo.DimStandardLeadSource
  - Confidence: 80%
  - Evidence: Exact column name match: "leadsourcetierepid" in both tables
  - Column: `LeadSourceTierEPID` → `LeadSourceTierEPID`
- **column_match**: dbo.DimLeadSource → dbo.DimStandardLeadSource
  - Confidence: 80%
  - Evidence: Exact column name match: "leadsourcetierpsid" in both tables
  - Column: `LeadSourceTierPSID` → `LeadSourceTierPSID`
- **column_match**: dbo.DimLeadSource_Backup → dbo.DimStandardLeadSource
  - Confidence: 80%
  - Evidence: Exact column name match: "leadsourcetierpsid" in both tables
  - Column: `LeadSourceTierPSID` → `LeadSourceTierPSID`
- **column_match**: dbo.DimLeadSourceTier → dbo.DimStandardLeadSource
  - Confidence: 80%
  - Evidence: Exact column name match: "leadsourcetierid" in both tables
  - Column: `LeadSourceTierID` → `LeadSourceTierID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
