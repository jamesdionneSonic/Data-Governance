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
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

1- **Type**: View
- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_Dim_Customer
AS
SELECT CustomerKey, DMSCustomerKey, CustomerFirstName, CustomerMiddleName, CustomerLastName, AddressLine1, AddressLine2, AddressCity, AddressState, AddressZipCode, LEFT(AddressZipCode, 5) AS ZipCode5, Country, Phone1, Phone2, Email1, Email2, ETLExecution_ID, 
             Meta_ComputerName, Meta_LoadDate, Meta_NaturalKey, Meta_RowLastChangeDate, Meta_SourceSystemName, Meta_SourceTable, Meta_Src_Sys_ID, User_Id, BirthDate, CCPADoNotContact, CCPADoNotShare, op
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
