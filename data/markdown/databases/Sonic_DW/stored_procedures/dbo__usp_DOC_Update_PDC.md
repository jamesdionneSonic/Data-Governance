---
name: usp_DOC_Update_PDC
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Doc_Projection
  - Doc_Record
dependency_count: 2
parameter_count: 8
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Doc_Projection** (U )
- **dbo.Doc_Record** (U )

## Parameters

| Name                 | Type    | Output | Default |
| -------------------- | ------- | ------ | ------- |
| `@EntityID`          | int     | No     | No      |
| `@NewPack`           | varchar | No     | No      |
| `@UsedPack`          | varchar | No     | No      |
| `@DeliveryPackNew`   | varchar | No     | No      |
| `@DeliveryPackUsed`  | varchar | No     | No      |
| `@TotalFactoryBonus` | varchar | No     | No      |
| `@PermaPlatePack`    | varchar | No     | No      |
| `@UserLogin`         | varchar | No     | No      |

## Definition

```sql






CREATE PROCEDURE [dbo].[usp_DOC_Update_PDC]
@EntityID INT,
@NewPack varchar(50),
@UsedPack varchar(50),
@DeliveryPackNew varchar(50),
@DeliveryPackUsed varchar(50),
@TotalFactoryBonus varchar(50),
@PermaPlatePack varchar(50),
@UserLogin varchar(50)



As

DECLARE @DDTempAmount table(MetricID INT, MetricNum varchar(50))
DECLARE @DocID INT = (SELECT DocID FROM [dbo].[Doc_Record] WITH (NOLOCK) WHERE EntityKey = @EntityID AND DocDateKey = (SELECT CONVERT(varchar(10),getdate(),112)))


--Insert Amounts into Temp Table
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (33, @NewPack)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (53, @UsedPack)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (172, @DeliveryPackNew)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (173, @DeliveryPackUsed)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (510, @TotalFactoryBonus)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (1171, @PermaPlatePack)


SET NOCOUNT ON

BEGIN TRY

 IF @DocID IS NOT NULL

    BEGIN

	;with a as (
		SELECT MetricID, MetricNum FROM @DDTempAmount
	)
	UPDATE dbo.Doc_Projection

	SET Amount = MetricNum,
		ControllerUserID = @UserLogin,
		UpdateDate = GETDATE()
	FROM a
		INNER JOIN dbo.Doc_Projection b WITH (NOLOCK)
			ON (b.GroupElementSort = a.MetricID)
	WHERE
		DocID = @DocID AND MetricNum IS NOT NULL AND MetricNum <> ''


	--Calculated Total values for projection table
	DECLARE @DDTempTable table(EntityKey INT, DateKey INT, MetricID INT, MetricNum MONEY)

	;with CalcTable as
		(SELECT     EntityKey,
					DateKey,
					SUM(isnull(FOGross,0)) AS FOGross,
					SUM(isnull(DealershipGross,0)) AS DealershipGross,
					(SUM(isnull(NewUnits,0)) * (Sum(isnull(NewPVR,0)) + Sum(isnull(NFBPVR,0)))) AS NewGross,
					(SUM(isnull(UsedUnits,0)) * Sum(isnull(UsedPVR,0))) AS UsedGross,
					((SUM(isnull(NewUnits,0)) + SUM(isnull(UsedUnits,0))) * SUM(isnull(FIPVR,0))) AS FIGross,
					(SUM(isnull(Expenses,0)) + ((SUM(isnull(NewUnits,0)) + SUM(isnull(UsedUnits,0))) * SUM(isnull(NUSalesComp,0)))) AS Expenses,
					SUM(isnull(Other,0)) AS Other,
					SUM(isnull(NewUnits,0)) AS NewUnits,
					SUM(isnull(UsedUnits,0)) AS UsedUnits,
					(SUM(isnull(NewUnits,0)) + SUM(isnull(UsedUnits,0))) AS TotalUnits,
					SUM(isnull(NewPVR,0)) AS NewPVR,
					SUM(isnull(UsedPVR,0)) AS UsedPVR,
					SUM(isnull(FIPVR,0)) AS FIPVR,
					SUM(isnull(DeliveryPackNew,0)) AS DeliveryPackNew,
					SUM(isnull(DeliveryPackUsed,0)) AS DeliveryPackUsed,
					SUM(isnull(FIComp,0)) AS FIComp,
					SUM(isnull(PartsFB,0)) AS PartsFB,
					(SUM(isnull(UsedUnits,0)) * SUM(isnull(PermaPackPUR,0))) AS PermaPack
					--SUM(isnull(FOComp,0)) AS FOComp
		FROM         (SELECT    EntityKey,
								DateKey,
								CASE WHEN GroupElementSort IN (10) THEN StatCount END AS NewUnits,
								CASE WHEN GroupElementSort IN (20) THEN StatCount END AS UsedUnits,
								CASE WHEN GroupElementSort IN (40) THEN StatCount END AS FleetUnits,
								CASE WHEN GroupElementSort IN (11, 33) THEN Amount END AS NewPVR,
								CASE WHEN GroupElementSort IN (34) THEN Amount END AS NFBPVR,
								CASE WHEN GroupElementSort IN (21, 53) THEN Amount END AS UsedPVR,
								CASE WHEN GroupElementSort IN (111) THEN Amount END AS FIPVR,
						 		CASE WHEN GroupElementSort IN (181) THEN Amount END As FIComp,
								--CASE WHEN GroupElementSort IN (131) THEN Amount END As FOComp,
								CASE WHEN GroupElementSort IN (172) THEN Amount END As DeliveryPackNew,
								CASE WHEN GroupElementSort IN (173) THEN Amount END As DeliveryPackUsed,
								CASE WHEN GroupElementSort IN (80, 90, 100) THEN Amount END As FOGross,
								CASE WHEN GroupElementSort IN (121) THEN Amount END AS NUSalesComp,
								CASE WHEN GroupElementSort IN (102) THEN Amount END AS PartsFB,
								CASE WHEN GroupElementSort IN (1171) THEN Amount END AS PermaPackPUR,
								CASE WHEN GroupSubElement IN ('Dealership Gross', 'Units') THEN Amount END AS DealershipGross,
								CASE WHEN GroupSubElement IN ('Selling Expenses', 'Operating Expenses', 'Overhead') THEN Amount END AS Expenses,
								CASE WHEN GroupSubElement IN ('Other Inc/Ded') THEN Amount END AS Other
					   FROM dbo.Doc_Projection WITH (NOLOCK)
					   WHERE EntityKey = @EntityID
					   AND DocID = @DocID
					   ) a11
		GROUP BY EntityKey, DateKey)

	--Unpivot calculated values and assign key values
	INSERT INTO @DDTempTable (EntityKey, DateKey, MetricID, MetricNum)
	SELECT EntityKey, DateKey, 119, ((DealershipGross) + (NewGross) + (UsedGross) + (FIGross) - (PartsFB) + (PermaPack)) FROM CalcTable
		UNION ALL
	SELECT EntityKey, DateKey, 451, (Expenses + (FIGross * FIComp) + (DeliveryPackNew * NewUnits) + (DeliveryPackUsed * UsedUnits)) FROM CalcTable
		UNION ALL
	SELECT EntityKey, DateKey, 500, ((DealershipGross + NewGross + UsedGross + FIGross + PermaPack - PartsFB) - (Expenses  + (FIGross * FIComp) + (DeliveryPackNew * NewUnits) + (DeliveryPackUsed * UsedUnits)) + Other) FROM CalcTable

	--Update Calculated Totals
	;with tCalc as (
		SELECT MetricID, MetricNum FROM @DDTempTable
	)
	UPDATE dbo.Doc_Projection

	SET Amount = MetricNum,
		ControllerUserID = @UserLogin,
		UpdateDate = GETDATE()
	FROM tCalc
		INNER JOIN dbo.Doc_Projection b WITH (NOLOCK)
			ON (b.GroupElementSort = tCalc.MetricID)
	WHERE
		DocID = @DocID AND MetricNum IS NOT NULL AND MetricNum <> ''

	END

END TRY

BEGIN CATCH
    SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
    RETURN -1
END CATCH


SET NOCOUNT OFF



```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
