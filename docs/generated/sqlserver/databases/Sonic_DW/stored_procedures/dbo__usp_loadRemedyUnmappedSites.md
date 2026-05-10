---
name: usp_loadRemedyUnmappedSites
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




CREATE PROC [dbo].[usp_loadRemedyUnmappedSites]
AS 

/*********************************************************

Author: Sudip Karki 
Description: Merges Unmapped SiteIds from RemedyTicketData to DimRemedyUnmappedSites 
Log:    Created on: 11.09.2018


***********************************************************/

BEGIN 


; WITH UnmappedSites AS 
(
SELECT DISTINCT RTD.TicketNumber,
				 RTD.Site_ID , 
				 0 AS DWProcessed,
				 RTD.TicketNumber AS Meta_NaturalKey,
	
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
