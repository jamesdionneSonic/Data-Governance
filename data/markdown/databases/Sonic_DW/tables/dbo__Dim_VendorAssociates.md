---
name: Dim_VendorAssociates
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - dimension
  - core-schema
depends_on: []
row_count: 0
size_kb: 0
column_count: 6
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

| Name                  | Type    | Nullable | Identity | Default | Description |
| --------------------- | ------- | -------- | -------- | ------- | ----------- |
| `AssociateKey`        | int     |          | ✓        |         |             |
| `AsoEmployeeNumber`   | int     |          |          |         |             |
| `AsoFirstName`        | varchar |          |          |         |             |
| `AsoMiddleName`       | varchar |          |          |         |             |
| `AsoLastName`         | varchar |          |          |         |             |
| `AsoWorkEmailAddress` | varchar |          |          |         |             |

## Constraints

- **Primary Key**: PK**Dim_Vend**18E788885E2497F1
  - Columns: AssociateKey

## Indexes

- **PK**Dim_Vend**18E788885E2497F1** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: AssociateKey ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Dim_VendorAssociates → dbo.DimAssociate
  - Confidence: 80%
  - Evidence: Exact column name match: "asomiddlename" in both tables
  - Column: `AsoMiddleName` → `AsoMiddleName`
- **column_match**: dbo.Dim_VendorAssociates → dbo.DimAssociate_0418
  - Confidence: 80%
  - Evidence: Exact column name match: "asomiddlename" in both tables
  - Column: `AsoMiddleName` → `AsoMiddleName`
- **column_match**: dbo.Dim_VendorAssociates → dbo.DimAssociate_07282023
  - Confidence: 80%
  - Evidence: Exact column name match: "asomiddlename" in both tables
  - Column: `AsoMiddleName` → `AsoMiddleName`
- **column_match**: dbo.Dim_VendorAssociates → dbo.DimAssociate_0816
  - Confidence: 80%
  - Evidence: Exact column name match: "asomiddlename" in both tables
  - Column: `AsoMiddleName` → `AsoMiddleName`
- **column_match**: dbo.Dim_VendorAssociates → dbo.DimAssociate_914_new
  - Confidence: 80%
  - Evidence: Exact column name match: "asomiddlename" in both tables
  - Column: `AsoMiddleName` → `AsoMiddleName`
- **column_match**: dbo.Dim_VendorAssociates → dbo.DimAssociate_bk_0413
  - Confidence: 80%
  - Evidence: Exact column name match: "asomiddlename" in both tables
  - Column: `AsoMiddleName` → `AsoMiddleName`
- **column_match**: dbo.Dim_VendorAssociates → dbo.DimAssociate_FULL
  - Confidence: 80%
  - Evidence: Exact column name match: "asomiddlename" in both tables
  - Column: `AsoMiddleName` → `AsoMiddleName`
- **column_match**: dbo.Dim_VendorAssociates → dbo.DimAssociate_newfile
  - Confidence: 80%
  - Evidence: Exact column name match: "asomiddlename" in both tables
  - Column: `AsoMiddleName` → `AsoMiddleName`
- **column_match**: dbo.Dim_VendorAssociates → dbo.DimAssociate0711
  - Confidence: 80%
  - Evidence: Exact column name match: "asomiddlename" in both tables
  - Column: `AsoMiddleName` → `AsoMiddleName`
- **column_match**: dbo.Dim_VendorAssociates → dbo.DimAssociate0829
  - Confidence: 80%
  - Evidence: Exact column name match: "asomiddlename" in both tables
  - Column: `AsoMiddleName` → `AsoMiddleName`
- **column_match**: dbo.Dim_VendorAssociates → dbo.DimAssociate1010
  - Confidence: 80%
  - Evidence: Exact column name match: "asomiddlename" in both tables
  - Column: `AsoMiddleName` → `AsoMiddleName`
- **column_match**: dbo.Dim_VendorAssociates → dbo.DimAssociate110724
  - Confidence: 80%
  - Evidence: Exact column name match: "asomiddlename" in both tables
  - Column: `AsoMiddleName` → `AsoMiddleName`
- **column_match**: dbo.Dim_VendorAssociates → dbo.testassociate
  - Confidence: 80%
  - Evidence: Exact column name match: "asomiddlename" in both tables
  - Column: `AsoMiddleName` → `AsoMiddleName`
- **column_match**: dbo.Dim_VendorAssociates → dbo.zzzzDimAssociate
  - Confidence: 80%
  - Evidence: Exact column name match: "asomiddlename" in both tables
  - Column: `AsoMiddleName` → `AsoMiddleName`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
