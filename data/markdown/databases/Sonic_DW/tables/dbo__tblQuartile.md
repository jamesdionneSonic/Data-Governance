---
name: tblQuartile
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
column_count: 39
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

| Name                        | Type          | Nullable | Identity | Default | Description |
| --------------------------- | ------------- | -------- | -------- | ------- | ----------- |
| `DISTRICT`                  | varchar       | ✓        |          |         |             |
| `REGION`                    | varchar       | ✓        |          |         |             |
| `DEALERSHIP`                | varchar       | ✓        |          |         |             |
| `COMPANYID`                 | int           | ✓        |          |         |             |
| `dtMonthEnd`                | smalldatetime | ✓        |          |         |             |
| `lLotUpNew`                 | int           | ✓        |          |         |             |
| `lLotUpUsed`                | int           | ✓        |          |         |             |
| `lLotUpSoldNew`             | int           | ✓        |          |         |             |
| `lLotUpSoldUsed`            | int           | ✓        |          |         |             |
| `lDemo`                     | int           | ✓        |          |         |             |
| `lWriteUps`                 | int           | ✓        |          |         |             |
| `lTO`                       | int           | ✓        |          |         |             |
| `lPhoneUpNew`               | int           | ✓        |          |         |             |
| `lPhoneUpUsed`              | int           | ✓        |          |         |             |
| `lPhoneUpApptNew`           | int           | ✓        |          |         |             |
| `lPhoneUpApptUsed`          | int           | ✓        |          |         |             |
| `lPhoneUpApptShowNew`       | int           | ✓        |          |         |             |
| `lPhoneUpApptShowUsed`      | int           | ✓        |          |         |             |
| `lPhoneUpApptSoldNew`       | int           | ✓        |          |         |             |
| `lPhoneUpApptSoldUsed`      | int           | ✓        |          |         |             |
| `lPhoneUpSoldNew`           | int           | ✓        |          |         |             |
| `lPhoneUpSoldUsed`          | int           | ✓        |          |         |             |
| `lWebUpNew`                 | int           | ✓        |          |         |             |
| `lWebUpUsed`                | int           | ✓        |          |         |             |
| `lWebUpApptNew`             | int           | ✓        |          |         |             |
| `lWebUpApptUsed`            | int           | ✓        |          |         |             |
| `lWebUpApptShowNew`         | int           | ✓        |          |         |             |
| `lWebUpApptShowUsed`        | int           | ✓        |          |         |             |
| `lWebUpApptSoldNew`         | int           | ✓        |          |         |             |
| `lWebUpApptSoldUsed`        | int           | ✓        |          |         |             |
| `lWebUpSoldNew`             | int           | ✓        |          |         |             |
| `lWebUpSoldUsed`            | int           | ✓        |          |         |             |
| `lResponseTimeNumberInSet`  | int           | ✓        |          |         |             |
| `lResponseTimeTotalMinutes` | int           | ✓        |          |         |             |
| `lTotalApptSetMTD`          | int           | ✓        |          |         |             |
| `lTotalApptShowedMTD`       | int           | ✓        |          |         |             |
| `lTotalApptSoldMTD`         | int           | ✓        |          |         |             |
| `lTotalSurveysMTD`          | int           | ✓        |          |         |             |
| `lTotalSurveysSoldMTD`      | int           | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.tblQuartile → dbo.xrefQuartileDealership
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `COMPANYID` → `COMPANYID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
