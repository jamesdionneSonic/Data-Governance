---
name: vw_Dim_Customer
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - DimCustomer
dependency_count: 1
column_count: 34
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.DimCustomer** (U )

## Columns

| Name                     | Type      | Nullable | Description |
| ------------------------ | --------- | -------- | ----------- |
| `CustomerKey`            | int       |          |             |
| `DMSCustomerKey`         | int       | ✓        |             |
| `CustomerFirstName`      | varchar   | ✓        |             |
| `CustomerMiddleName`     | varchar   | ✓        |             |
| `CustomerLastName`       | varchar   | ✓        |             |
| `AddressLine1`           | varchar   | ✓        |             |
| `AddressLine2`           | varchar   | ✓        |             |
| `AddressCity`            | varchar   | ✓        |             |
| `AddressState`           | varchar   | ✓        |             |
| `AddressZipCode`         | varchar   | ✓        |             |
| `ZipCode5`               | varchar   | ✓        |             |
| `Country`                | varchar   | ✓        |             |
| `Phone1`                 | varchar   | ✓        |             |
| `Phone2`                 | varchar   | ✓        |             |
| `Email1`                 | varchar   | ✓        |             |
| `Email2`                 | varchar   | ✓        |             |
| `ETLExecution_ID`        | int       |          |             |
| `Meta_ComputerName`      | varchar   |          |             |
| `Meta_LoadDate`          | datetime2 |          |             |
| `Meta_NaturalKey`        | varchar   | ✓        |             |
| `Meta_RowLastChangeDate` | datetime2 |          |             |
| `Meta_SourceSystemName`  | varchar   |          |             |
| `Meta_SourceTable`       | varchar   |          |             |
| `Meta_Src_Sys_ID`        | int       |          |             |
| `User_Id`                | varchar   |          |             |
| `BirthDate`              | date      | ✓        |             |
| `CCPADoNotContact`       | bit       |          |             |
| `CCPADoNotShare`         | bit       |          |             |
| `optoutflag`             | varchar   | ✓        |             |
| `optoutdate`             | datetime  | ✓        |             |
| `deletedataflag`         | varchar   | ✓        |             |
| `deletedatadate`         | datetime  | ✓        |             |
| `optouttime`             | datetime  | ✓        |             |
| `deletedatatime`         | datetime  | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_Dim_Customer
AS
SELECT CustomerKey, DMSCustomerKey, CustomerFirstName, CustomerMiddleName, CustomerLastName, AddressLine1, AddressLine2, AddressCity, AddressState, AddressZipCode, LEFT(AddressZipCode, 5) AS ZipCode5, Country, Phone1, Phone2, Email1, Email2, ETLExecution_ID,
             Meta_ComputerName, Meta_LoadDate, Meta_NaturalKey, Meta_RowLastChangeDate, Meta_SourceSystemName, Meta_SourceTable, Meta_Src_Sys_ID, User_Id, BirthDate, CCPADoNotContact, CCPADoNotShare, optoutflag, optoutdate, deletedataflag, deletedatadate, optouttime,
             deletedatatime
FROM   dbo.DimCustomer

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
