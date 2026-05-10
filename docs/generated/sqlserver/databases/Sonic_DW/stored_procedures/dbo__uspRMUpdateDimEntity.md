---
name: uspRMUpdateDimEntity
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

CREATE   PROCEDURE dbo.uspRMUpdateDimEntity(@RelationshipTypeGuid varchar(255))
AS
BEGIN TRY
	BEGIN TRANSACTION
		BEGIN
		    update de 
			set 
			de.SocialMediaInstagram = reqData.SocialMediaInstagram,
			de.SocialMediaYouTube = reqData.SocialMediaYouTube,
			de.SocialMediaFacebook = reqData.SocialMediaFacebook,
			de.SocialMediaTwitter = reqData.SocialMediaTwitter,
			de.TimePeriodsMonday = reqData.TimePeriodsMonday,
			de.TimePeriodsTuesday = reqData.TimePeriodsTuesday,
			de.
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
