---
name: FactCreditApp
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
column_count: 29
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

| Name                            | Type     | Nullable | Identity | Default | Description |
| ------------------------------- | -------- | -------- | -------- | ------- | ----------- |
| `FactCreditAppID`               | int      |          | ✓        |         |             |
| `EntityKey`                     | int      | ✓        |          |         |             |
| `VehicleKey`                    | int      | ✓        |          |         |             |
| `ApplicantKey`                  | int      | ✓        |          |         |             |
| `CoApplicantKey`                | int      | ✓        |          |         |             |
| `AppCreationDateKey`            | int      | ✓        |          |         |             |
| `AppSubmissionDateKey`          | int      | ✓        |          |         |             |
| `LastActivityDateKey`           | int      | ✓        |          |         |             |
| `ApplicationSourceKey`          | int      | ✓        |          |         |             |
| `DecisionKey`                   | int      | ✓        |          |         |             |
| `eContractingStatusKey`         | int      | ✓        |          |         |             |
| `FinanceSourceKey`              | int      | ✓        |          |         |             |
| `LastComplianceActivityDateKey` | int      | ✓        |          |         |             |
| `TUCBScore`                     | int      | ✓        |          |         |             |
| `EQCBScore`                     | int      | ✓        |          |         |             |
| `EXPCBScore`                    | int      | ✓        |          |         |             |
| `CoApplicantTUCBScore`          | int      | ✓        |          |         |             |
| `CoApplicantEQCBScore`          | int      | ✓        |          |         |             |
| `CoApplicantEXPCBScore`         | int      | ✓        |          |         |             |
| `ApplicantTotalAnnualIncome`    | decimal  | ✓        |          |         |             |
| `CoApplicantTotalAnnualIncome`  | decimal  | ✓        |          |         |             |
| `VehicleMileage`                | int      | ✓        |          |         |             |
| `ConversationID`                | varchar  | ✓        |          |         |             |
| `Meta_NaturalKey`               | varchar  | ✓        |          |         |             |
| `Meta_RowIsCurrent`             | bit      | ✓        |          |         |             |
| `Meta_RowEffectiveDate`         | datetime | ✓        |          |         |             |
| `ApplicantLast4SSN`             | varchar  | ✓        |          |         |             |
| `CoApplicantLast4SSN`           | varchar  | ✓        |          |         |             |
| `Meta_RowExpiredDate`           | datetime | ✓        |          |         |             |

## Constraints

- **Primary Key**: Pk_FactCreditApp_FactCreditAppID
  - Columns: FactCreditAppID

## Indexes

- ** Pk_FactCreditApp_FactCreditAppID** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: FactCreditAppID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
