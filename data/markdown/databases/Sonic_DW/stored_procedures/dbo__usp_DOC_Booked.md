---
name: usp_DOC_Booked
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Dim_Date
  - Dim_DOCMetrics
  - Dim_Entity
  - Doc_AccountGrouping
  - Doc_Booked
  - Doc_Booked_Historical
  - Doc_Projection
  - Doc_SubProjection
  - vw_Dim_Account
  - vw_Dim_date
  - vw_FIREBkdDealsAsFUEL
dependency_count: 11
parameter_count: 0
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Dim_Date** (U )
- **dbo.Dim_DOCMetrics** (U )
- **dbo.Dim_Entity** (U )
- **dbo.Doc_AccountGrouping** (U )
- **dbo.Doc_Booked** (U )
- **dbo.Doc_Booked_Historical** (U )
- **dbo.Doc_Projection** (U )
- **dbo.Doc_SubProjection** (U )
- **dbo.vw_Dim_Account** (V )
- **dbo.vw_Dim_date** (V )
- **dbo.vw_FIREBkdDealsAsFUEL** (V )

## Definition

```sql



-- =============================================
-- Author:		Jonathan Henin
-- Create date: 6/4/2014
-- Description:	Insert new records into FUEL Daily Doc datamart
-- =============================================
CREATE PROCEDURE [dbo].[usp_DOC_Booked]

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

/*
Delete all booked records
Insert booked records into Doc_Booked
*/

DELETE FROM [dbo].[Doc_Booked]

 INSERT INTO [dbo].[Doc_Booked]
 SELECT 	a11.[EntityKey]  EntityKey,
			a11.[AccountingDateKey]  DateKey,
			a14.[GroupElementSort]  GroupElementSort,
			a14.[GroupElement]  GroupElement,
			a14.[GroupSubElement]  GroupSubElement,
			CASE WHEN a14.[GroupSubElement] in ('Dealership Gross', 'Units') THEN sum(a11.[PostingAmount] * -1) ELSE sum(a11.[PostingAmount]) END  Amount,
			sum(a11.[StatCount])  StatCount,
			max(2)  MetricTypeKey
	FROM	dbo.vw_FIREBkdDealsAsFUEL	a11
		JOIN dbo.vw_Dim_Account a12
			ON a11.AccountKey = a12.AccountKey
		JOIN dbo.Doc_AccountGrouping a13
			ON a12.AccAccount = a13.AccAccount
		JOIN dbo.Dim_DOCMetrics a14
			ON a13.GroupElementSort = a14.GroupElementSort
	WHERE
		a14.[GroupElementSort] NOT IN (32, 52)
	GROUP BY	a11.[EntityKey],
		a11.[AccountingDateKey],
		a14.[GroupElementSort],
		a14.[GroupElement],
		a14.[GroupSubElement]

--Take Pack and Doc from projection table and put them in the Booked Table
DECLARE @DDTempTable table(EntityKey INT, DateKey INT, MetricID INT, MetricNum MONEY)

;with CalcTable as
(SELECT
	P12.EntDealerLvl2,
	E1.EntityKey,
	P12.DateKey,
	P12.NewUnits,
	P12.UsedUnits,
	P11.NewPackDoc,
	P11.UsedPackDoc,
	mfc.MultiFranchiseCounter,
	IIF(mfc.MultiFranchiseCounter = 1, P11.NFBPVR, P13.NFBPVR) NFBPVR
	FROM
	 (SELECT
			EntDealerLvl2,
			sum(ROUND((CASE WHEN P.GroupElementSort = 33 THEN P.Amount END),2)) NewPackDoc,
			sum(ROUND((CASE WHEN P.GroupElementSort = 53 THEN P.Amount END),2)) UsedPackDoc,
			sum(ROUND((CASE WHEN P.GroupElementSort = 34 THEN P.Amount END),2)) NFBPVR
		  FROM [dbo].[Doc_Projection] P
			JOIN
				(SELECT MAX(DATEKEY)	DateKey,
										EntDealerLvl2,
										E.EntityKey
				FROM [dbo].[Doc_Projection] P1
					JOIN
					[dbo].[Dim_Entity] E
					ON P1.EntityKey = E.EntityKey
				WHERE GroupElementSort in (33, 34, 53)
					and Amount IS NOT NULL
					and EntDefaultDlrshpLvl2 = 1
					and DateKey <= (SELECT CONVERT(char(8),getdate(),112))
				GROUP BY EntDealerLvl2, E.EntityKey) MDE
			ON p.DateKey = mde.datekey and p.EntityKey = mde.EntityKey
		GROUP BY EntDealerLvl2) P11
		LEFT OUTER JOIN
		(SELECT
			EntDealerLvl2,
			max(ROUND((CASE WHEN P.GroupElementSort = 34 THEN P.Amount END),2)) NFBPVR
		  FROM [dbo].[Doc_SubProjection] P
			JOIN
				(SELECT MAX(DATEKEY)	DateKey,
										EntDealerLvl2,
										E.EntityKey
				FROM [dbo].[Doc_SubProjection] P1
					JOIN
					[dbo].[Dim_Entity] E
					ON P1.EntityKey = E.EntityKey
				WHERE GroupElementSort in (33, 34, 53)
					and Amount IS NOT NULL
					and DateKey <= (SELECT CONVERT(char(8),getdate(),112))
				GROUP BY EntDealerLvl2, E.EntityKey) MDE
			ON p.DateKey = mde.datekey and p.EntityKey = mde.EntityKey
		GROUP BY EntDealerLvl2) P13
		ON P11.EntDealerLvl2 = P13.EntDealerLvl2
		LEFT OUTER JOIN
		(SELECT [EntDealerLvl2],
		Count(*) AS MultiFranchiseCounter
  FROM [Sonic_DW].[dbo].[Dim_Entity]
  WHERE EntDOCReportFlag = 'Active'
  and EntDefaultDlrshpLvl0 = 1
  group by [EntDealerLvl2]) as mfc
  on p11.EntDealerLvl2 = mfc.EntDealerLvl2

	JOIN
	 (SELECT
		EntDealerLvl2,
		DateKey,
		SUM(isnull(NewUnits,0)) NewUnits,
		SUM(isnull(UsedUnits,0)) UsedUnits
		FROM
		 (SELECT
			P.EntityKey,
			P.DateKey,
			ROUND((CASE WHEN P.GroupElementSort = 10 THEN P.StatCount END),0) NewUnits,
			ROUND((CASE WHEN P.GroupElementSort = 20 THEN P.StatCount END),0) UsedUnits
		  FROM [dbo].[Doc_Booked] P)  P1
		 JOIN
			[dbo].[Dim_Entity] E
			ON P1.EntityKey = E.EntityKey
		  GROUP BY EntDealerLvl2
		  ,DateKey
		  ) P12
	ON
	P11.EntDealerLvl2 = P12.EntDealerLvl2
	JOIN
		(SELECT EntityKey,
				EntDealerLvl2
		FROM [dbo].[Dim_Entity] E
		WHERE EntDefaultDlrshpLvl2 = 1) E1
	ON E1.EntDealerLvl2 = P11.EntDealerLvl2)

INSERT INTO @DDTempTable (EntityKey, DateKey, MetricID, MetricNum)
SELECT EntityKey, DateKey, 32, (NewPackDoc * NewUnits) FROM CalcTable WHERE NewUnits <> 0
	UNION ALL
SELECT EntityKey, DateKey, 52, (UsedPackDoc * UsedUnits) FROM CalcTable WHERE UsedUnits <> 0
	UNION ALL
SELECT EntityKey, DateKey, 31, (NFBPVR * NewUnits) FROM CalcTable WHERE NewUnits <> 0


INSERT INTO [dbo].[Doc_Booked]
	SELECT a11.[EntityKey]  EntityKey,
		a11.[DateKey]  DateKey,
		a12.[GroupElementSort]  GroupElementSort,
		a12.[GroupElement]  GroupElement,
		a12.[GroupSubElement]  GroupSubElement,
		MetricNum,
		0,
		2  MetricTypeKey
	FROM @DDTempTable a11
	JOIN dbo.Dim_DOCMetrics a12
			ON a11.MetricID = a12.GroupElementSort


DELETE FROM [dbo].[Doc_Booked_Historical]
WHERE DateKey = (SELECT CONVERT(varchar(10),getdate(),112))

INSERT INTO [dbo].[Doc_Booked_Historical]
SELECT 	a11.[EntityKey]  EntityKey,
			(SELECT CONVERT(varchar(10),getdate(),112))  DateKey,
			a11.[GroupElementSort]  GroupElementSort,
			a11.[GroupElement]  GroupElement,
			a11.[GroupSubElement]  GroupSubElement,
			sum(a11.[Amount]) Amount,
			sum(a11.[StatCount])  StatCount,
			max(2)  MetricTypeKey
	FROM	Doc_Booked a11
	WHERE (a11.[DateKey] BETWEEN (SELECT MonthStartDateKey FROM [dbo].[vw_Dim_date] WHERE DateKey = (SELECT DocRolloverDate FROM [dbo].[Dim_Date] WHERE DateKey = (SELECT CONVERT(char(8),getdate(),112)))) AND  (SELECT MonthEndDateKey FROM [dbo].[vw_Dim_date] WHERE DateKey = (SELECT DocRolloverDate FROM [dbo].[Dim_Date] WHERE DateKey = (SELECT CONVERT(char(8),getdate(),112))))
 and a11.[DateKey] <=  (SELECT CONVERT(char(8),getdate(),112)))
	GROUP BY	a11.[EntityKey],
		a11.[GroupElementSort],
		a11.[GroupElement],
		a11.[GroupSubElement]


END

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
