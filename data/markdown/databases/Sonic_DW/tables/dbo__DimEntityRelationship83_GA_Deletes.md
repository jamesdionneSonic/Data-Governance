---
name: DimEntityRelationship83_GA_Deletes
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - DimEntityRelationship
  - DimEntityRelationship
  - DimEntityRelationship
row_count: 0
size_kb: 0
column_count: 16
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

| Name                   | Type             | Nullable | Identity | Default | Description |
| ---------------------- | ---------------- | -------- | -------- | ------- | ----------- |
| `RelationshipGuid`     | uniqueidentifier |          |          |         |             |
| `RelationshipId`       | int              |          | ✓        |         |             |
| `RelationshipTypeGuid` | uniqueidentifier |          |          |         |             |
| `EntityKey`            | int              |          |          |         |             |
| `StartDate`            | datetime         |          |          |         |             |
| `EndDate`              | datetime         |          |          |         |             |
| `IsActive`             | bit              |          |          |         |             |
| `CreatedDate`          | datetime         |          |          |         |             |
| `UpdatedDate`          | datetime         |          |          |         |             |
| `CreatedBy`            | nvarchar         | ✓        |          |         |             |
| `UpdatedBy`            | nvarchar         | ✓        |          |         |             |
| `IntegerField`         | int              | ✓        |          |         |             |
| `AttributeField`       | nvarchar         | ✓        |          |         |             |
| `DateField`            | datetime         | ✓        |          |         |             |
| `NumericField`         | decimal          | ✓        |          |         |             |
| `BigIntegerField`      | bigint           | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.DimEntityRelationship → dbo.DimEntityRelationship83_GA_Deletes
  - Confidence: 80%
  - Evidence: Exact column name match: "relationshipguid" in both tables
  - Column: `RelationshipGuid` → `RelationshipGuid`
- **column_match**: dbo.DimEntityRelationship83_GA_Deletes → dbo.DimEntityRelationshipBkp20211104
  - Confidence: 80%
  - Evidence: Exact column name match: "relationshipguid" in both tables
  - Column: `RelationshipGuid` → `RelationshipGuid`
- **column_match**: dbo.DimEntityRelationship → dbo.DimEntityRelationship83_GA_Deletes
  - Confidence: 80%
  - Evidence: Exact column name match: "relationshipid" in both tables
  - Column: `RelationshipId` → `RelationshipId`
- **column_match**: dbo.DimEntityRelationship83_GA_Deletes → dbo.DimEntityRelationshipBkp20211104
  - Confidence: 80%
  - Evidence: Exact column name match: "relationshipid" in both tables
  - Column: `RelationshipId` → `RelationshipId`
- **column_match**: dbo.DimEntityRelationship83_GA_Deletes → dbo.DimEntityRelationshipType
  - Confidence: 80%
  - Evidence: Exact column name match: "relationshipid" in both tables
  - Column: `RelationshipId` → `RelationshipId`
- **column_match**: dbo.DimEntityRelationship → dbo.DimEntityRelationship83_GA_Deletes
  - Confidence: 80%
  - Evidence: Exact column name match: "relationshiptypeguid" in both tables
  - Column: `RelationshipTypeGuid` → `RelationshipTypeGuid`
- **column_match**: dbo.DimEntityRelationship83_GA_Deletes → dbo.DimEntityRelationshipBkp20211104
  - Confidence: 80%
  - Evidence: Exact column name match: "relationshiptypeguid" in both tables
  - Column: `RelationshipTypeGuid` → `RelationshipTypeGuid`
- **column_match**: dbo.DimEntityRelationship83_GA_Deletes → dbo.DimEntityRelationshipType
  - Confidence: 80%
  - Evidence: Exact column name match: "relationshiptypeguid" in both tables
  - Column: `RelationshipTypeGuid` → `RelationshipTypeGuid`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
