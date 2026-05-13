---
name: Dim_SourceEntity
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
column_count: 48
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
| `SourceEntityKey`        | int      |          | ✓        |         |             |
| `SenCora_Account_ID`     | int      |          |          |         |             |
| `SenADPCompanyID`        | varchar  | ✓        |          |         |             |
| `SenAccountingPrefix`    | char     | ✓        |          |         |             |
| `SenHFMEntityID`         | varchar  | ✓        |          |         |             |
| `SenFranchiseID`         | char     | ✓        |          |         |             |
| `SenEntityType`          | varchar  | ✓        |          |         |             |
| `SenBACCode`             | varchar  | ✓        |          |         |             |
| `SenRVP_RCRegionCode`    | varchar  | ✓        |          |         |             |
| `SenHFMDealershipName`   | varchar  | ✓        |          |         |             |
| `SenRegion`              | varchar  | ✓        |          |         |             |
| `SenAcquiredDate`        | datetime | ✓        |          |         |             |
| `SenAddressLine1`        | varchar  | ✓        |          |         |             |
| `SenAddressMailingLine1` | varchar  | ✓        |          |         |             |
| `SenAddressCity`         | varchar  | ✓        |          |         |             |
| `SenAddressState`        | varchar  | ✓        |          |         |             |
| `SenAddressZipCode`      | varchar  | ✓        |          |         |             |
| `SenMainPhoneNumber`     | varchar  | ✓        |          |         |             |
| `SenDealerCode`          | varchar  | ✓        |          |         |             |
| `SenRegionSubLevel`      | varchar  | ✓        |          |         |             |
| `SenConsolidated`        | bit      | ✓        |          |         |             |
| `SenDealershipSize`      | varchar  | ✓        |          |         |             |
| `SenLegalStructure`      | varchar  | ✓        |          |         |             |
| `SenLegalParent`         | varchar  | ✓        |          |         |             |
| `SenOwnershipPct`        | int      | ✓        |          |         |             |
| `SenFranchiseCount`      | int      | ✓        |          |         |             |
| `SenLegalName`           | varchar  | ✓        |          |         |             |
| `SenSameStoreFlg`        | bit      | ✓        |          |         |             |
| `SenDisposedFlg`         | bit      | ✓        |          |         |             |
| `SenContinuingOpsFlg`    | bit      | ✓        |          |         |             |
| `SenStateTaxID`          | varchar  | ✓        |          |         |             |
| `SenIncorporationNumber` | varchar  | ✓        |          |         |             |
| `SenFedTaxID`            | varchar  | ✓        |          |         |             |
| `SenDMVNumber`           | varchar  | ✓        |          |         |             |
| `SenFilingNumbers`       | varchar  | ✓        |          |         |             |
| `SenServiceBayQty`       | int      | ✓        |          |         |             |
| `SenLiftQty`             | int      | ✓        |          |         |             |
| `SenSquareFootage`       | int      | ✓        |          |         |             |
| `SenNumberOfProperties`  | int      | ✓        |          |         |             |
| `SenLeasePropertyQty`    | int      | ✓        |          |         |             |
| `SenLuxuryFlag`          | bit      | ✓        |          |         |             |
| `SenBrandOrigin`         | varchar  | ✓        |          |         |             |
| `SenBrandGroup`          | varchar  | ✓        |          |         |             |
| `SenBrand`               | varchar  | ✓        |          |         |             |
| `SenBodyShopFlag`        | bit      | ✓        |          |         |             |
| `SenDFIDRegion`          | varchar  | ✓        |          |         |             |
| `SenDFODRegion`          | varchar  | ✓        |          |         |             |
| `SenUVDRegion`           | varchar  | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK18_1
  - Columns: SourceEntityKey

## Indexes

- **PK18_1** (NONCLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: SourceEntityKey ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
