---
name: usp_FBEntityCheck_Notification
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Dim_Entity
  - DimEntityRelationship
  - DimEntityRelationshipType
dependency_count: 3
parameter_count: 5
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Dim_Entity** (U )
- **dbo.DimEntityRelationship** (U )
- **dbo.DimEntityRelationshipType** (U )

## Parameters

| Name              | Type     | Output | Default |
| ----------------- | -------- | ------ | ------- |
| `@Profile1`       | varchar  | No     | No      |
| `@ToLine1`        | varchar  | No     | No      |
| `@LoadDate`       | datetime | No     | No      |
| `@ETLExecutionId` | int      | No     | No      |
| `@xmlXML`         | varchar  | Yes    | No      |

## Definition

```sql
CREATE    PROCEDURE [dbo].[usp_FBEntityCheck_Notification]
(@Profile1       VARCHAR(250),
 @ToLine1        VARCHAR(1000),
 @LoadDate       DATETIME,
 @ETLExecutionId INT,
 @xmlXML         VARCHAR(8000) OUTPUT
)
AS
     BEGIN
         DECLARE @Profile NVARCHAR(MAX)= 'SONIC ETL Mail Profile' --@Profile
         , @ToLine NVARCHAR(MAX)= @ToLine1,
     @Body_Line1 NVARCHAR(MAX)= 'Facebook Audience Entity Check',
     @tableHTML NVARCHAR(MAX)= '',
     @Body_Line2 VARCHAR(1000)= 'Start Time :'+CONVERT(VARCHAR(20),@LoadDate, 100)+' - The check runs every Monday',
     @SourceCount INT,
     @NewlyInsertedRows INT,
     @InsertedRows INT,
     @UpdatedRows INT,
     @UnChangedRows INT,

     @Metafiledate DATETIME;
       ------

	  DECLARE @A TABLE (EntityKey INT)
DECLARE @B TABLE (EntityKey INT)
DECLARE @C TABLE (EntityKey INT)
DECLARE @NewCounts INT;

INSERT INTO @A (EntityKey) (
SELECT DISTINCT a.entitykey FROM DimEntityRelationship et
JOIN DimEntityRelationshipType ert ON et.RelationshipTypeGuid = ert.RelationshipTypeGuid
JOIN dim_entity a ON et.EntityKey = a.EntityKey)

INSERT INTO @B (EntityKey) (
	SELECT DISTINCT entitykey FROM dim_entity WHERE 1 = 1

	AND entactive = 'active'
	)

INSERT INTO @C (EntityKey)(
	SELECT * FROM @B
	except
	SELECT * FROM @A
	)
	set @NewCounts=(SELECT count(*) FROM @C) -149
     SET @Metafiledate =    (GETDATE());

     -----------------
         SET @tableHTML = N'<H3 style="font-family:Calibri;font-size:20px;color:#820000" >'
     +@Body_Line1+'</H3>'+N'<H3 style="font-family:Calibri;font-size:20px;color:#820000" >'
     +@Body_Line2+'</H3>'+N'<TABLE style=" font-family: Calibri; font-size: small" >'+
     N'<TR bgcolor=#276399 style=" color:#FFFFFF;word-wrap:break-word;">'+
     N'<th style="font-family:Calibri;font-size:15px;color:#FFFFFF";><b>Count of Missing Entities</b></th>'+

 N'<th style="font-family:Calibri;font-size:15px;color:#FFFFFF"><b>Date</b></th>'+N'</TR>'+
     CAST((SELECT @NewCounts AS TD,
               '',
               cast(@Metafiledate as date) AS TD,
               '' FOR XML PATH('TR'), TYPE
               ) AS NVARCHAR(MAX));
         SET @tableHTML = @tableHTML+'</TABLE></BODY></HTML>';
         SET @xmlXML = @tableHTML;

     END;

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
