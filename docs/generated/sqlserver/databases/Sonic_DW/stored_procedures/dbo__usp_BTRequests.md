---
name: usp_BTRequests
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

-- =============================================
-- Author:		Jonathan Henin
-- Create date: 8/31/2016
-- Description:	Insert Record for BTRequests
-- =============================================
CREATE PROCEDURE [dbo].[usp_BTRequests]
	@BTIssuesKey INT,
	@EntityKey INT,
	@IssueOwner VARCHAR(250),
	@IssueComment VARCHAR(2000),
	@IssueCompleteDate DATE,
	@IssueTicket NVARCHAR(50),
	@IssueTicketOpened VARCHAR(50),
	@IssueCategoryID INT,
	@IssueResolution VARCHAR(2000),
	@Requester
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
