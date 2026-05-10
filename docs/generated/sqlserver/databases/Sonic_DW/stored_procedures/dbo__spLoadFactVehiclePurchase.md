---
name: spLoadFactVehiclePurchase
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql

/******************** CHANGE LOG ***************************************************************************
06/01/2020:  Derrick Davis - Create stored proc for MERGE insert/update
01/29/2021:  Chaitra - updated stored proc for populating the Fact_DataAudit table
03/15/2021:  Chaitra - updated stored proc for implementation of new logic for reference from DimAssociate 
06/21/2021:  Shweta -  Added 'n.a' in Case statement for CRGrade
10/07/2021:  Chaitra - Used function [dbo].[RemoveCharSp
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
