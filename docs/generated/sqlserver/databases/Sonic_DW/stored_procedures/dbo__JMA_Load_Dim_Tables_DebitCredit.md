---
name: JMA_Load_Dim_Tables_DebitCredit
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

create PROCEDURE [dbo].[JMA_Load_Dim_Tables_DebitCredit]
    @ETLExecution_ID VARCHAR(40)
AS
BEGIN
--DECLARE @ETLEXECUTION_ID AS VARCHAR(50) = 'Manual_Test_Load_1111';
    DECLARE @JsonData NVARCHAR(MAX)
    DECLARE @SQL NVARCHAR(MAX)
    DECLARE @TableName NVARCHAR(100)
    DECLARE @Dim_ColCode NVARCHAR(50)
    DECLARE @Dim_ColDescription NVARCHAR(100)
	DECLARE @Dim_ColGroup NVARCHAR(100)
    DECLARE @ColCode NVARCHAR(50)
    DECLARE @ColDescription NVARCHAR(100)
    DECLARE @ColGroup NVARCHAR(50)
    DECLARE @DynamicTableName NVARCHAR(200)
    DECLARE @ErrorMessage NVARCHAR(4000)
    DECLARE @TAB_NAME_TGT VARCHAR(50)
    DECLARE @column_names_tgt NVARCHAR(MAX)


    SET @JsonData ='[

					{"Table": "[dbo].[DIM_JMA_DEBIT_CREDIT_TBL]", "Dim_Col_code": "JMA_DEBIT_CREDIT_CODE", "Dim_Col_description": "JMA_DEBIT_CREDIT_DESC", "Dim_ColGroup": "Domain","Col_code": "CLAIM_DEBIT_CREDIT_CODE", "Col_description": "CLAIM_CREDIT_DEBIT_CODE_DESCRIPTION", "Col_Group": "CLAIMS"},
					{"Table": "[dbo].[DIM_JMA_DEBIT_CREDIT_TBL]", "Dim_Col_code": "JMA_DEBIT_CREDIT_CODE", "Dim_Col_description": "JMA_DEBIT_CREDIT_DESC", "Dim_ColGroup": "Domain","Col_code": "DEBIT_CREDIT_CODE", "Col_description": "DEBIT_CREDIT_CODE_DESCRIPTION", "Col_Group": "CONTRACT"}

				]'
    -- Create a table to hold parsed JSON values
    CREATE TABLE #Temp_JSON_Data (
        TableName NVARCHAR(100),
        Dim_ColCode NVARCHAR(50),
        Dim_ColDescription NVARCHAR(100),
		Dim_ColGroup NVARCHAR(100),
        ColCode NVARCHAR(50),
        ColDescription NVARCHAR(100),
        ColGroup NVARCHAR(50)
    )

    -- Insert parsed JSON data into the temporary table
    INSERT INTO #Temp_JSON_Data (TableName, Dim_ColCode, Dim_ColDescription,Dim_ColGroup, ColCode, ColDescription, ColGroup)
    SELECT
        JSON_VALUE(value, '$.Table') AS TableName,
        JSON_VALUE(value, '$.Dim_Col_code') AS Dim_ColCode,
        JSON_VALUE(value, '$.Dim_Col_description') AS Dim_ColDescription,
		JSON_VALUE(value, '$.Dim_ColGroup') AS Dim_ColGroup,
        JSON_VALUE(value, '$.Col_code') AS ColCode,
        JSON_VALUE(value, '$.Col_description') AS ColDescription,
        JSON_VALUE(value, '$.Col_Group') AS ColGroup
    FROM OPENJSON(@JsonData)

    -- Declare a cursor to iterate over the records in JSON
    DECLARE db_cursor CURSOR FOR
    SELECT TableName, Dim_ColCode, Dim_ColDescription,Dim_ColGroup, ColCode, ColDescription, ColGroup
    FROM #Temp_JSON_Data

    OPEN db_cursor
    FETCH NEXT FROM db_cursor INTO @TableName, @Dim_ColCode, @Dim_ColDescription,@Dim_ColGroup, @ColCode, @ColDescription, @ColGroup

    WHILE @@FETCH_STATUS = 0
    BEGIN
        BEGIN TRY
            -- Clean the table name for proper use in dynamic queries
            SET @TAB_NAME_TGT = REPLACE(REPLACE(REPLACE(@TableName, '[dbo].', ''), '[', ''), ']', '')

            -- Build dynamic table name based on ColGroup (Contract or Claims)
            SET @DynamicTableName = 'ETL_Staging.JMA.ETL_STG_JMA_' + @ColGroup + '_FINANCIAL_TRANSACTIONS_TBL'

            -- Concatenate the 2nd and 3rd column names into a single string separated by commas
            SELECT @column_names_tgt = STUFF(
                (SELECT ', ' + COLUMN_NAME
                 FROM SONIC_DW.INFORMATION_SCHEMA.COLUMNS
                 WHERE TABLE_NAME = @TAB_NAME_TGT
                   AND ORDINAL_POSITION IN (2, 3) order by ORDINAL_POSITION asc
                 FOR XML PATH('')), 1, 2, '')

            -- Build the dynamic MERGE query
            SET @SQL = '
                MERGE ' + @TableName + ' AS TGT
                USING (
                    SELECT ' + @ColCode + ' AS STG_CODE, ' + @ColDescription + ' AS STG_DESC, ''' + @ColGroup + ''' AS STG_Group
                    FROM ' + @DynamicTableName + '
                    WHERE ' + @ColCode + ' IS NOT NULL AND  LTRIM(RTRIM(' + @ColCode + ')) <> ''''
                    GROUP BY ' + @ColCode + ', ' + @ColDescription + ') AS Src
                ON TGT.' + @Dim_ColCode + ' = Src.STG_CODE AND  TGT.DOMAIN = ''' + @ColGroup + '''
                WHEN MATCHED AND TGT.' + @Dim_ColDescription + ' <> Src.STG_DESC
                THEN
                    UPDATE SET TGT.' + @Dim_ColDescription + ' = Src.STG_DESC, TGT.' + @Dim_ColGroup + ' = ''' + @ColGroup + ''',
                               TGT.META_ROWLASTCHANGEDDATE = SYSDATETIME()
                WHEN NOT MATCHED BY TARGET
                THEN
                    INSERT (' + @column_names_tgt + ',Domain, ACTIVE_IND, META_LOADDATE, META_ROWLASTCHANGEDDATE, ETLEXECUTION_ID)
                    VALUES (Src.STG_CODE, Src.STG_DESC,''' + @ColGroup + ''', 1, SYSDATETIME(), SYSDATETIME(), @ETLExecution_ID);
            '

            -- Print and execute the dynamic SQL query
            PRINT @SQL;  -- For debugging, this prints the dynamic SQL
            EXEC sp_executesql @SQL, N'@ETLExecution_ID VARCHAR(40)', @ETLExecution_ID;
        END TRY
        BEGIN CATCH
            -- Capture error message
            SET @ErrorMessage = ERROR_MESSAGE();

            -- Insert the error into the error log table
            INSERT INTO dbo.Error_Log (TableName, ColCode, ColDescription, ColGroup, ErrorMessage)
            VALUES (@TableName, @ColCode, @ColDescription, @ColGroup, @ErrorMessage);
        END CATCH

        -- Fetch the next record from the cursor
        FETCH NEXT FROM db_cursor INTO @TableName, @Dim_ColCode, @Dim_ColDescription,@Dim_ColGroup, @ColCode, @ColDescription, @ColGroup
    END

    -- Close and deallocate the cursor
    CLOSE db_cursor
    DEALLOCATE db_cursor

    -- Clean up temporary table
    DROP TABLE #Temp_JSON_Data
END


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
