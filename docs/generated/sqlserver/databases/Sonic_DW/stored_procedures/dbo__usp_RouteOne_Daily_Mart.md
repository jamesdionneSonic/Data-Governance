---
name: usp_RouteOne_Daily_Mart
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

-- =============================================
-- Author:        Kriti Joshi
-- Create date:  11/11/2014
-- Description:   Inserts/Update
--5-Sep-2019 - added new column DealerID


--Updated on	: 2021-03-24
--Author		: Jaya Charan
--Description	: Modified merge column for Interval (swapped '' with '-')

-- =============================================
CREATE PROCEDURE [dbo].[usp_RouteOne_Daily_Mart] (
 @User_Id VARCHAR(50)
 ,@Meta_ComputerName VARCHAR(50)
 ,@insertedRowCnts INT OUTPUT
 ,@updatedRowCnts INT OUTPUT
 )
AS
SET NOCOUNT ON;

DECLARE @rowcounts TABLE (MergeAction VARCHAR(20));
DECLARE @insertedCount INT
 ,@updatedCount INT;

MERGE Sonic_DW.dbo.RouteOne_Daily_Mart AS [tgt]
USING ETL_Staging.dbo.[RouteOne_Daily_Mart_Staging] AS [src]
 ON src.ApplicantName = tgt.ApplicantName
  AND src.Dealership = tgt.Dealership
  AND src.RouteOneDealerID=tgt.RouteOneDealerID
  --and isnull(src.DealerShipUser, 'NULL') = isnull (tgt.DealerShipUser, 'NULL')
  AND src.ApplicantAddress = tgt.ApplicantAddress
  AND src.ApplicantInterval + '-' + src.ApplicantOtherIncomeInterval + '-' + src.CoApplicantInterval + '-' + src.CoApplicantOtherInterval + '-' + src.CoApplicantAlimonyIncomeInterval = tgt.ApplicantInterval + '-' + tgt.ApplicantOtherIncomeInterval + '-' + tgt.CoApplicantInterval + '-' + tgt.CoApplicantOtherInterval + '-' + tgt.CoApplicantAlimonyIncomeInterval
WHEN MATCHED
 AND (
  -- src.Dealership<>tgt.Dealership
  src.DealerShipUser <> tgt.DealerShipUser
  --or src.ApplicantAddress <> tgt.ApplicantAddress
  OR Isnull(src.MinSubmissionDate,'1900-01-01') <> Isnull(tgt.MinSubmissionDate,'1900-01-01')
  OR  Isnull(src.MaxSubmissionDate,'1900-01-01')   <>  Isnull(tgt.MaxSubmissionDate ,'1900-01-01')
  OR src.SubmissionDateDeltaInDays <> tgt.SubmissionDateDeltaInDays
  OR src.NoOfConversations <> tgt.NoOfConversations
  OR src.ApplicantInterval <> tgt.ApplicantInterval
  OR src.MinApplicantIncome <> tgt.MinApplicantIncome
  OR src.MaxApplicantIncome <> tgt.MaxApplicantIncome
  OR src.ApplicantOtherIncomeInterval <> tgt.ApplicantOtherIncomeInterval
  OR src.MinApplicantOtherIncome <> tgt.MinApplicantOtherIncome
  OR src.MaxApplicantOtherIncome <> tgt.MaxApplicantOtherIncome
  OR src.CoApplicantInterval <> tgt.CoApplicantInterval
  OR src.MinCoApplicantIncome <> tgt.MinCoApplicantIncome
  OR src.MaxCoApplicantIncome <> tgt.MaxCoApplicantIncome
  OR src.CoApplicantOtherInterval <> tgt.CoApplicantOtherInterval
  OR src.MinCoApplicantOtherIncome <> tgt.MinCoApplicantOtherIncome
  OR src.MaxCoApplicantOtherIncome <> tgt.MaxCoApplicantOtherIncome
  OR src.CoApplicantAlimonyIncomeInterval <> tgt.CoApplicantAlimonyIncomeInterval
  OR src.MinCoApplicantAlimonyIncome <> tgt.MinCoApplicantAlimonyIncome
  OR src.MaxCoApplicantAlimonyIncome <> tgt.MaxCoApplicantAlimonyIncome
  )
 THEN
  UPDATE
  SET
   -- tgt.Dealership=src.Dealership
   tgt.DealerShipUser = src.DealerShipUser
   ,tgt.ApplicantAddress = src.ApplicantAddress
   ,tgt.MinSubmissionDate = src.MinSubmissionDate
   ,tgt.MaxSubmissionDate = src.MaxSubmissionDate
   ,tgt.SubmissionDateDeltaInDays = src.SubmissionDateDeltaInDays
   ,tgt.NoOfConversations = src.NoOfConversations
   ,tgt.ApplicantInterval = src.ApplicantInterval
   ,tgt.MinApplicantIncome = src.MinApplicantIncome
   ,tgt.MaxApplicantIncome = src.MaxApplicantIncome
   ,tgt.ApplicantOtherIncomeInterval = src.ApplicantOtherIncomeInterval
   ,tgt.MinApplicantOtherIncome = src.MinApplicantOtherIncome
   ,tgt.MaxApplicantOtherIncome = src.MaxApplicantOtherIncome
   ,tgt.CoApplicantInterval = src.CoApplicantInterval
   ,tgt.MinCoApplicantIncome = src.MinCoApplicantIncome
   ,tgt.MaxCoApplicantIncome = src.MaxCoApplicantIncome
   ,tgt.CoApplicantOtherInterval = src.CoApplicantOtherInterval
   ,tgt.MinCoApplicantOtherIncome = src.MinCoApplicantOtherIncome
   ,tgt.MaxCoApplicantOtherIncome = src.MaxCoApplicantOtherIncome
   ,tgt.CoApplicantAlimonyIncomeInterval = src.CoApplicantAlimonyIncomeInterval
   ,tgt.MinCoApplicantAlimonyIncome = src.MinCoApplicantAlimonyIncome
   ,tgt.MaxCoApplicantAlimonyIncome = src.MaxCoApplicantAlimonyIncome
   ,tgt.LastUpdateDate = Getdate()
WHEN NOT MATCHED
 THEN
  INSERT (
   ApplicantName
   ,Dealership
   ,RouteOneDealerID
   ,DealerShipUser
   ,ApplicantAddress
   ,MinSubmissionDate
   ,MaxSubmissionDate
   ,SubmissionDateDeltaInDays
   ,NoOfConversations
   ,ApplicantInterval
   ,MinApplicantIncome
   ,MaxApplicantIncome
   ,ApplicantOtherIncomeInterval
   ,MinApplicantOtherIncome
   ,MaxApplicantOtherIncome
   ,CoApplicantInterval
   ,MinCoApplicantIncome
   ,MaxCoApplicantIncome
   ,CoApplicantOtherInterval
   ,MinCoApplicantOtherIncome
   ,MaxCoApplicantOtherIncome
   ,CoApplicantAlimonyIncomeInterval
   ,MinCoApplicantAlimonyIncome
   ,MaxCoApplicantAlimonyIncome
   ,LoadDate
   ,LastUpdateDate
   ,[User_ID]
   ,Meta_ComputerName
   )
  VALUES (
   src.ApplicantName
   ,src.Dealership
   ,src.RouteOneDealerID
   ,src.DealerShipUser
   ,src.ApplicantAddress
   ,src.MinSubmissionDate
   ,src.MaxSubmissionDate
   ,src.SubmissionDateDeltaInDays
   ,src.NoOfConversations
   ,src.ApplicantInterval
   ,src.MinApplicantIncome
   ,src.MaxApplicantIncome
   ,src.ApplicantOtherIncomeInterval
   ,src.MinApplicantOtherIncome
   ,src.MaxApplicantOtherIncome
   ,src.CoApplicantInterval
   ,src.MinCoApplicantIncome
   ,src.MaxCoApplicantIncome
   ,src.CoApplicantOtherInterval
   ,src.MinCoApplicantOtherIncome
   ,src.MaxCoApplicantOtherIncome
   ,src.CoApplicantAlimonyIncomeInterval
   ,src.MinCoApplicantAlimonyIncome
   ,src.MaxCoApplicantAlimonyIncome
   ,GetDate()
   ,GetDate()
   ,@User_Id
   ,@Meta_ComputerName
   )
OUTPUT $ACTION
INTO @rowcounts;

SELECT @insertedCount = [INSERT]
 ,@updatedCount = [UPDATE]
FROM (
 SELECT MergeAction
  ,1 ROWS
 FROM @rowcounts
 ) AS p
PIVOT(COUNT(rows) FOR p.MergeAction IN (
   [INSERT]
   ,[UPDATE]
   )) AS pvt

SELECT @insertedRowCnts = isnull(@insertedcount, 0)
 ,@updatedRowCnts = isnull(@updatedCount, 0)
```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
