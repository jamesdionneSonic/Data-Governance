---
name: uspLoadDimOpportunityPositionXREF
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



CREATE PROCEDURE [dbo].[uspLoadDimOpportunityPositionXREF]
AS

BEGIN
MERGE dbo.DimOpportunityPositionXREF tgt USING 
(
	SELECT DISTINCT --TOP 1000 	6698715
			ISNULL(opp.FactOpportunityKey,-1) AS [FactOpportunityKey]
			,ISNULL(ass.AssociateKey,-1) AS [AssociateKey]
			,opp.EntityKey
			--,stg.lChildCompanyID
			,stg.lDealID
			,opp.Meta_OriginalDealID
			--,stg.lSalespersonID
			,stg.szFirstName
			,stg.szLastName
			,stg.bPrimaryDealAssociate
			,stg.nliPositionType
			
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
