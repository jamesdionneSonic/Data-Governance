---
name: update_dim_lender_category
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Dim_Lender_Categories
  - Dim_Lender_FICO_Tiers
  - Dim_Lender_Type
dependency_count: 3
parameter_count: 6
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Dim_Lender_Categories** (U )
- **dbo.Dim_Lender_FICO_Tiers** (U )
- **dbo.Dim_Lender_Type** (U )

## Parameters

| Name                 | Type    | Output | Default |
| -------------------- | ------- | ------ | ------- |
| `@sonic_grouping`    | varchar | No     | No      |
| `@grouping_category` | varchar | No     | No      |
| `@FicoTier`          | varchar | No     | No      |
| `@LenderType`        | varchar | No     | No      |
| `@PreferenceStatus`  | varchar | No     | No      |
| `@userid`            | varchar | No     | No      |

## Definition

```sql
-- stored proc for MSTR --
CREATE PROC dbo.update_dim_lender_category
				 @sonic_grouping VARCHAR(100) = '' ,
				 @grouping_category VARCHAR(100) = '' ,
				 @FicoTier VARCHAR(100) = '' ,
				 @LenderType VARCHAR(100) = '' ,
				 @PreferenceStatus VARCHAR(100) = '' ,
				 @userid VARCHAR(100) = ''
AS

	IF @sonic_grouping = ''
		AND
		@sonic_grouping NOT IN (SELECT DISTINCT Lender_Category FROM dbo.Dim_Lender_Categories)
		INSERT INTO Sonic_DW.dbo.Dim_Lender_Categories (Lender_Category , UserID)
		VALUES (@grouping_category , @userid)

	IF @sonic_grouping <> ''

		UPDATE dl
			   SET dl.LenderCategoryKey = dlc.LenderCategoryKey
		FROM Sonic_DW.dbo.Dim_Lender dl JOIN Dim_Lender_Categories dlc ON dlc.Lender_Category = @grouping_category
		WHERE Sonic_Grouping = @sonic_grouping

	IF @FicoTier <> ''

		UPDATE dl
			   SET dl.LenderFICOTierKey = dlc.LenderFICOTierKey
		FROM Sonic_DW.dbo.Dim_Lender dl JOIN dbo.Dim_Lender_FICO_Tiers dlc ON dlc.FICO_Tier = @FicoTier
		WHERE Sonic_Grouping = @sonic_grouping

	IF @LenderType <> ''

		UPDATE dl
			   SET dl.LenderTypeKey = dlc.LenderTypeKey
		FROM Sonic_DW.dbo.Dim_Lender dl JOIN dbo.Dim_Lender_Type dlc ON dlc.LenderType = @LenderType
		WHERE Sonic_Grouping = @sonic_grouping

	IF @PreferenceStatus <> ''
		UPDATE Sonic_DW.dbo.Dim_Lender
			   SET PreferenceStatus = @PreferenceStatus
		WHERE Sonic_Grouping = @sonic_grouping
```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
