---
name: usp_LoadDimDepartmentCDK_tables_MSC
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on: []
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql

CREATE   PROCEDURE dbo.usp_LoadDimDepartmentCDK_tables_MSC
AS

	/******** DimDepartmentCDK *********/
	MERGE sonic_dw.dbo.DimDepartmentCDK AS tgt
	USING (
		SELECT DISTINCT Department
		FROM [ETL_Staging].stage.Sonic_MSC_Tasks_Department
	) AS src
	ON tgt.Department = src.Department
	-- WHEN MATCHED -- since there are no additional attributes, there is nothing to update when MATCHED.
	WHEN NOT MATCHED BY TARGET THEN
		INSERT (Department, Meta_LoadDate)
		VALUES (src.Department, GETDATE());


	/******** DimUserDepartmentMapCDK *********/
	MERGE sonic_dw.dbo.DimUserDepartmentMapCDK AS tgt
    USING (
        SELECT DISTINCT
            stg.lUserID AS CDKUserID,
            LTRIM(RTRIM(LEFT(Stg.SalesRep, CHARINDEX('<', Stg.SalesRep + '<') - 1))) AS SalesAssociateName,
            e.EntityKey,
            dd.DimDepartmentCDKID,
            stg.Department
        FROM [ETL_Staging].stage.Sonic_MSC_Tasks_Department stg
        JOIN sonic_dw.dbo.DimDepartmentCDK dd
            ON dd.Department = stg.Department
        JOIN (
            SELECT DISTINCT
                ISNULL(enteleadnewid, enteleadid) AS eleadid,
                EntityKey
            FROM sonic_dw.dbo.dim_entity
            WHERE entactive = 'Active'
              AND ententitytype = 'Dealership'
              AND EntEleadDefault = 1
              AND ISNULL(enteleadnewid, enteleadid) IS NOT NULL
        ) e
            ON stg.lChildCompanyID = e.eleadid
    ) AS src
    ON tgt.CDKUserID = src.CDKUserID
    AND tgt.EntityKey = src.EntityKey

    WHEN MATCHED AND (
           (tgt.DimDepartmentCDKID <> src.DimDepartmentCDKID AND tgt.MSCDefault = 1) -- If Dept NOT match, but the MSCDefault record exists -> UPDATE the Dept
        OR (tgt.DimDepartmentCDKID = src.DimDepartmentCDKID AND tgt.MSCDefault IS NULL) -- If Dept match, but the MSCDefault record doesnt exist -> UPDATE the MSCDefault
    )
    THEN UPDATE SET
        tgt.DimDepartmentCDKID = CASE
            WHEN tgt.DimDepartmentCDKID <> src.DimDepartmentCDKID
                 AND tgt.MSCDefault = 1
            THEN src.DimDepartmentCDKID
            ELSE tgt.DimDepartmentCDKID
        END,

        tgt.Department = CASE
            WHEN tgt.DimDepartmentCDKID <> src.DimDepartmentCDKID
                 AND tgt.MSCDefault = 1
            THEN src.Department
            ELSE tgt.Department
        END,

        tgt.MSCDefault = CASE
            WHEN tgt.DimDepartmentCDKID = src.DimDepartmentCDKID
                 AND tgt.MSCDefault IS NULL
            THEN 1
            ELSE tgt.MSCDefault
        END,

        tgt.Meta_RowLastChangeDate = GETDATE()

    WHEN NOT MATCHED THEN
        INSERT (
            CDKUserID,
            SalesAssociateName,
            EntityKey,
            DimDepartmentCDKID,
            Department,
            MSCDefault,
            Meta_LoadDate,
            Meta_RowLastChangeDate
        )
        VALUES (
            src.CDKUserID,
            src.SalesAssociateName,
            src.EntityKey,
            src.DimDepartmentCDKID,
            src.Department,
            1,
            GETDATE(),
            GETDATE()
    );

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
