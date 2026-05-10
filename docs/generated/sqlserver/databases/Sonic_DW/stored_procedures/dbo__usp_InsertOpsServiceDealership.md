---
name: usp_InsertOpsServiceDealership
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





CREATE Procedure [dbo].[usp_InsertOpsServiceDealership]
@EntDealerLvl1 varchar(50),
@OpsReviewItemID int,
@EntityType varchar(50),
@TicketNumber varchar(20) = null


as

DECLARE @ConsecDays int
SET @ConsecDays = isnull((SELECT (max(sd.ConsecDays) + 1) FROM	dbo.OpsReviewItem AS i INNER JOIN
															dbo.OpsServiceDealership AS sd ON i.OpsReviewItemID = sd.OpsReviewItemID INNER JOIN
															dbo.vw_OpsReview AS r ON i.OpsReviewID = r.OpsReviewID INNER JOIN
						
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
