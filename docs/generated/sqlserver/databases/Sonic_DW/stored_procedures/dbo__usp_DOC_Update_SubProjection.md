---
name: usp_DOC_Update_SubProjection
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql





CREATE PROCEDURE [dbo].[usp_DOC_Update_SubProjection]
@EntityID INT,
@NewUnits varchar(50),
@NewPVR varchar(50),
@NFB varchar(50),
@NFBPVR varchar(50),
@UserLogin varchar(50)



As

DECLARE @DDTempUnits table(MetricID INT, MetricNum varchar(50))
DECLARE @DDTempAmount table(MetricID INT, MetricNum varchar(50))
DECLARE @DocID INT = (SELECT DocID FROM [dbo].[Doc_Record] WITH (NOLOCK) WHERE EntityKey = (SELECT EntityKey FROM dbo.Dim_Entity WHERE
		(EntDealerLvl2 =	(SELECT        EntDealerLvl2
                               FROM            dbo.Dim_Entity AS Dim_Entity_1
                               WHERE        (EntityKey = @EntityID))) AND (EntDefaultDlrshpLvl2 = 1))  AND DocDateKey = (SELECT CONVERT(varchar(10),getdate(),112)))


--Insert Units
INSERT INTO @DDTempUnits (MetricID, MetricNum) values (10, @NewUnits)

--Insert Amounts
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (11, @NewPVR)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (31, @NFB)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (34, @NFBPVR)


SET NOCOUNT ON

BEGIN TRY

 IF @DocID IS NOT NULL

	--Update unit metrics.
    BEGIN

	;with tUnits as (
		SELECT MetricID, MetricNum FROM @DDTempUnits
	)
	UPDATE dbo.Doc_SubProjection

	SET StatCount = MetricNum,
		ControllerUserID = @UserLogin,
		UpdateDate = GETDATE()
	FROM tUnits
		INNER JOIN dbo.Doc_SubProjection b WITH (NOLOCK)
			ON (b.GroupElementSort = tUnits.MetricID)
	WHERE
		DocID = @DocID AND MetricNum IS NOT NULL AND MetricNum <> '' AND EntityKey = @EntityID


	--Update amount metrics.

	;with tAmount as (
		SELECT MetricID, MetricNum FROM @DDTempAmount
	)
	UPDATE dbo.Doc_SubProjection

	SET Amount = MetricNum,
		ControllerUserID = @UserLogin,
		UpdateDate = GETDATE()
	FROM tAmount
		INNER JOIN dbo.Doc_SubProjection b WITH (NOLOCK)
			ON (b.GroupElementSort = tAmount.MetricID)
	WHERE
		DocID = @DocID AND MetricNum IS NOT NULL AND MetricNum <> '' AND EntityKey = @EntityID


	--Calculate aggregated values for projection table from subprojection
	DECLARE @DDTempTableAgg table(DocID INT, MetricID INT, AmountNum varchar(50), UnitNum varchar(50))

	;with CalcAggTable as
	(SELECT	DocID,
			SUM(isnull(NewUnits,0)) AS NewUnits,
			SUM(isnull(NFB,0)) AS NFB,
			SUM(isnull(NewPVRCalc,0)) AS NewPVR,
			SUM(isnull(NFBPVR,0)) AS NFBPVR,
			SUM(isnull(NFBPVRCalc,0)) AS NFBPVRCalc
	FROM
			(SELECT	EntityKey,
					DocID,
					NewUnits,
					NewPVR,
					NFB,
					NFBPVR,
					(NewUnits * NewPVR) AS NewPVRCalc,
					(NewUnits * NFBPVR) AS NFBPVRCalc
			FROM
					(SELECT			EntityKey,
									DocID,
									SUM(isnull(NewUnits,0)) AS NewUnits,
									SUM(isnull(NewPVR,0)) AS NewPVR,
									SUM(isnull(NFB,0)) AS NFB,
									SUM(isnull(NFBPVR,0)) AS NFBPVR
					FROM
									(SELECT		EntityKey,
												DocID,
												CASE WHEN GroupElementSort IN (10) THEN StatCount END AS NewUnits,
												CASE WHEN GroupElementSort IN (11) THEN Amount END AS NewPVR,
												CASE WHEN GroupElementSort IN (31) THEN Amount END AS NFB,
												CASE WHEN GroupElementSort IN (34) THEN Amount END AS NFBPVR
									FROM dbo.Doc_SubProjection WITH (NOLOCK)
									WHERE DocID = @DocID) a11
					GROUP BY EntityKey, DocID) a111
			) a
	GROUP BY DOCID)

	INSERT INTO @DDTempTableAgg (DocID, MetricID, AmountNum, UnitNum)
		SELECT DocID, 10, NULL, NewUnits FROM CalcAggTable
			UNION ALL
		SELECT DocID, 11, CASE WHEN NewUnits = 0 THEN 0 ELSE (NewPVR / nullif(NewUnits,0)) END, NULL  FROM CalcAggTable
			UNION ALL
		SELECT DocID, 31, NFB, NULL FROM CalcAggTable
			UNION ALL
		SELECT DocID, 34, CASE WHEN NewUnits = 0 THEN 0 ELSE (NFBPVRCalc / nullif(NewUnits,0)) END, NULL FROM CalcAggTable
		--SELECT DocID, 31, NFB + NFBPVRCalc, NULL FROM CalcAggTable --Old Code but double counting NFB



	--Update Calculated Totals
	;with AggCalc as (
		SELECT DocID, MetricID, AmountNum, UnitNum FROM @DDTempTableAgg
	)
	UPDATE dbo.Doc_Projection

	SET Amount = isnull(AmountNum,0),
		StatCount = isnull(UnitNum,0),
		ControllerUserID = @UserLogin,
		UpdateDate = GETDATE()
	FROM AggCalc
		INNER JOIN dbo.Doc_Projection b WITH (NOLOCK)
			ON ((b.GroupElementSort = AggCalc.MetricID) AND (AggCalc.DocID = b.DocID))
	WHERE
		((AmountNum IS NOT NULL AND AmountNum <> '') OR (UnitNum IS NOT NULL AND UnitNum <> ''))






	--Calculated Total values for projection table
	DECLARE @DDTempTable table(EntityKey INT, DateKey INT, MetricID INT, MetricNum varchar(50))

	;with CalcTable as
		(SELECT     EntityKey,
					DateKey,
					SUM(isnull(FOGross,0)) AS FOGross,
					SUM(isnull(DealershipGross,0)) AS DealershipGross,
					--(SUM(isnull(NewUnits,0)) * Sum(isnull(NewPVR,0))) AS NewGross, Old NewGross Calc
					(SUM(isnull(NewUnits,0)) * (Sum(isnull(NewPVR,0)) + Sum(isnull(NFBPVR,0)))) AS NewGross, --Changed to Included NFBPVR 1/29/2021
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
					SUM(isnull(PartsFB,0)) AS PartsFB
					--SUM(isnull(FOComp,0)) AS FOComp
		FROM         (SELECT    EntityKey,
								DateKey,
								CASE WHEN GroupElementSort IN (10) THEN StatCount END AS NewUnits,
								CASE WHEN GroupElementSort IN (34) THEN Amount END AS NFBPVR,
								CASE WHEN GroupElementSort IN (20) THEN StatCount END AS UsedUnits,
								CASE WHEN GroupElementSort IN (40) THEN StatCount END AS FleetUnits,
								CASE WHEN GroupElementSort IN (11, 33) THEN Amount END AS NewPVR,
								CASE WHEN GroupElementSort IN (21, 53) THEN Amount END AS UsedPVR,
								CASE WHEN GroupElementSort IN (111) THEN Amount END AS FIPVR,
						 		CASE WHEN GroupElementSort IN (181) THEN Amount END As FIComp,
								--CASE WHEN GroupElementSort IN (131) THEN Amount END As FOComp,
								CASE WHEN GroupElementSort IN (172) THEN Amount END As DeliveryPackNew,
								CASE WHEN GroupElementSort IN (173) THEN Amount END As DeliveryPackUsed,
								CASE WHEN GroupElementSort IN (80, 90, 100) THEN Amount END As FOGross,
								CASE WHEN GroupElementSort IN (121) THEN Amount END AS NUSalesComp,
								CASE WHEN GroupElementSort IN (102) THEN Amount END AS PartsFB,
								CASE WHEN GroupSubElement IN ('Dealership Gross', 'Units') THEN Amount END AS DealershipGross,
								CASE WHEN GroupSubElement IN ('Selling Expenses', 'Operating Expenses', 'Overhead') THEN Amount END AS Expenses,
								CASE WHEN GroupSubElement IN ('Other Inc/Ded') THEN Amount END AS Other
					   FROM dbo.Doc_Projection WITH (NOLOCK)
					   WHERE DocID = @DocID
					   ) a11
		GROUP BY EntityKey, DateKey)

	--Unpivot calculated values and assign key values
	INSERT INTO @DDTempTable (EntityKey, DateKey, MetricID, MetricNum)
	SELECT EntityKey, DateKey, 119, ((DealershipGross) + (NewGross) + (UsedGross) + (FIGross) - (PartsFB)) FROM CalcTable
		UNION ALL
	--SELECT EntityKey, DateKey, 451, (Expenses + (FOGross * FOComp) + (FIGross * FIComp) + (DeliveryPackNew * NewUnits) + (DeliveryPackUsed * UsedUnits)) FROM CalcTable
	SELECT EntityKey, DateKey, 451, (Expenses + (FIGross * FIComp) + (DeliveryPackNew * NewUnits) + (DeliveryPackUsed * UsedUnits)) FROM CalcTable
		UNION ALL
	--SELECT EntityKey, DateKey, 500, ((DealershipGross + NewGross + UsedGross + FIGross) - (Expenses + (FOGross * FOComp) + (FIGross * FIComp) + (DeliveryPackNew * NewUnits) + (DeliveryPackUsed * UsedUnits)) + Other) FROM CalcTable
	SELECT EntityKey, DateKey, 500, ((DealershipGross + NewGross + UsedGross + FIGross - PartsFB) - (Expenses + (FIGross * FIComp) + (DeliveryPackNew * NewUnits) + (DeliveryPackUsed * UsedUnits)) + Other) FROM CalcTable

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
