---
name: usp_DeleteOldStatstics
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
-- Author:		David Ekren
-- Create date: 7/15/2021
-- Description:	Delete Old Stats from DB, insert Historical data into table in DBA db
-- example execution:     exec dbo.usp_DeleteOldStatstics 'DBA', 1000
-- !!!!!!!!!!!! THIS SP NEEDS TO RESIDE IN THE DB, NOT THE DBA DB. THE HISTORICAL DATA WILL GO INTO THE TABLE OldStatsDeletedHistory IN THE DBA DB !!!!!!!!!!
-- =============================================
CREATE PROCEDURE [dbo].[usp_DeleteOldStatstics]
	@DBName varchar(128),
	@NumDays2Retain int = 1000
AS
BEGIN


	IF OBJECT_ID(N'tempdb..##Stats2BeDropped') IS NOT NULL
	BEGIN
	DROP TABLE ##Stats2BeDropped
	END;

	IF OBJECT_ID(N'tempdb..##Stats2BeDropped2') IS NOT NULL
	BEGIN
	DROP TABLE ##Stats2BeDropped2
	END;

	IF OBJECT_ID(N'tempdb..##StatsAfter') IS NOT NULL
	BEGIN
	DROP TABLE ##StatsAfter
	END;

	IF OBJECT_ID(N'tempdb..##Stats') IS NOT NULL
	BEGIN
	DROP TABLE ##Stats
	END;


	IF not exists (select t.[name] from dba.sys.tables t
				  join dba.sys.schemas s on (t.schema_id = s.schema_id)
				  where s.name = 'dbo' and t.name = 'OldStatsDeletedHistory'
				  )
		BEGIN
		CREATE TABLE dba.[dbo].[OldStatsDeletedHistory](
			[InsertDate] [datetime] NOT NULL,
			[DBName] [varchar](128) NOT NULL,
			[BeforeNumberOfStats] [int] NULL,
			[AfterNumberOfStats] [int] NULL,
			[NetStatsDeleted] [int] NULL,
			[NetStatsCreated] [int] NULL,
			[DaysRetained] [int] NULL,
		 CONSTRAINT [PK_OldStatsDeletedHistory] PRIMARY KEY CLUSTERED
		(
			[InsertDate] DESC, DBName ASC
		)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
		) ON [PRIMARY]
		END;
	ELSE
		BEGIN
		Print NULL
		END

	----- Before Data into Temp Table ##Stats
	--print @NumDays2Retain

	SELECT DISTINCT
	OBJECT_NAME(s.[object_id]) AS TableName,
	c.name AS ColumnName,
	s.name AS StatName,
	STATS_DATE(s.[object_id], s.stats_id) AS LastUpdated,
	DATEDIFF(d,STATS_DATE(s.[object_id], s.stats_id),getdate()) DaysOld,
	dsp.modification_counter,
	s.auto_created,
	s.user_created,
	s.no_recompute,
	s.[object_id],
	s.stats_id,
	sc.stats_column_id,
	sc.column_id,
	 'DROP STATISTICS '
	+ SCHEMA_NAME(obj.Schema_id) + '.'
	+ OBJECT_NAME(s.object_id) + '.' +
	s.name DropStatisticsStatement
	INTO ##Stats
	FROM sys.stats s
	JOIN sys.stats_columns sc
	ON sc.[object_id] = s.[object_id] AND sc.stats_id = s.stats_id
	JOIN sys.columns c ON c.[object_id] = sc.[object_id] AND c.column_id = sc.column_id
	JOIN sys.partitions par ON par.[object_id] = s.[object_id]
	JOIN sys.objects obj ON par.[object_id] = obj.[object_id]
	CROSS APPLY sys.dm_db_stats_properties(sc.[object_id], s.stats_id) AS dsp
	WHERE OBJECTPROPERTY(s.OBJECT_ID,'IsUserTable') = 1
	AND auto_created = 1
	AND user_created = 0
	--AND (s.auto_created = 1 OR s.user_created = 1)
	--AND DATEDIFF(d,STATS_DATE(s.[object_id], s.stats_id),getdate()) = 14
	ORDER BY  DaysOld desc;

	----- Set variables

	Declare @BeforeNumberOfStats int,
			@AfterNumberOfStats int

	----- Get Stat Count before Deleting Old Stats

	SET @BeforeNumberOfStats =  (SELECT COUNT(*) FROM ##Stats)

			----- Delete Stats over @NumDays2Retain days old

			SELECT DISTINCT
			OBJECT_NAME(s.[object_id]) AS TableName,
			c.name AS ColumnName,
			s.name AS StatName,
			STATS_DATE(s.[object_id], s.stats_id) AS LastUpdated,
			DATEDIFF(d,STATS_DATE(s.[object_id], s.stats_id),getdate()) DaysOld,
			dsp.modification_counter,
			s.auto_created,
			s.user_created,
			s.no_recompute,
			s.[object_id],
			s.stats_id,
			sc.stats_column_id,
			sc.column_id,
			 'DROP STATISTICS '
			+ SCHEMA_NAME(obj.Schema_id) + '.'
			+ OBJECT_NAME(s.object_id) + '.' +
			s.name DropStatisticsStatement
			INTO ##Stats2BeDropped
			FROM sys.stats s
			JOIN sys.stats_columns sc
			ON sc.[object_id] = s.[object_id] AND sc.stats_id = s.stats_id
			JOIN sys.columns c ON c.[object_id] = sc.[object_id] AND c.column_id = sc.column_id
			JOIN sys.partitions par ON par.[object_id] = s.[object_id]
			JOIN sys.objects obj ON par.[object_id] = obj.[object_id]
			CROSS APPLY sys.dm_db_stats_properties(sc.[object_id], s.stats_id) AS dsp
			WHERE OBJECTPROPERTY(s.OBJECT_ID,'IsUserTable') = 1
			AND auto_created = 1
			AND user_created = 0
			AND DATEDIFF(d,STATS_DATE(s.[object_id], s.stats_id),getdate()) > @NumDays2Retain ------------Number of days to retain stats
			--AND (s.auto_created = 1 OR s.user_created = 1)
			--AND DATEDIFF(d,STATS_DATE(s.[object_id], s.stats_id),getdate()) = 14
			--ORDER BY  DaysOld desc;

			---- create a table to hold drop statements
			CREATE TABLE ##Stats2BeDropped2
			(ID int identity(1,1), DropStatisticsStatement varchar(256))
			INSERT INTO ##Stats2BeDropped2 --(ID,DropStatisticsStatement)
			SELECT DropStatisticsStatement FROM ##Stats2BeDropped;

			----- While loop to execute each line in DropStatisticsStatement

			   ----- select * from ##Stats2BeDropped2

 			DECLARE @Counter INT , @MaxId INT,
					@DropStatisticsStatement NVARCHAR(256)
			SELECT @Counter = min(ID) , @MaxId = max(ID)
			FROM ##Stats2BeDropped2

			WHILE(@Counter IS NOT NULL
				  AND @Counter <= @MaxId)
			BEGIN
			   SET @DropStatisticsStatement = (SELECT DropStatisticsStatement
			   FROM ##Stats2BeDropped2 WHERE Id = @Counter)

			  EXECUTE sp_executesql @DropStatisticsStatement
			   SET @Counter  = @Counter  + 1
			END;

			-- SELECT * FROM ##Stats2BeDropped2

	SELECT DISTINCT
	OBJECT_NAME(s.[object_id]) AS TableName,
	c.name AS ColumnName,
	s.name AS StatName,
	STATS_DATE(s.[object_id], s.stats_id) AS LastUpdated,
	DATEDIFF(d,STATS_DATE(s.[object_id], s.stats_id),getdate()) DaysOld,
	dsp.modification_counter,
	s.auto_created,
	s.user_created,
	s.no_recompute,
	s.[object_id],
	s.stats_id,
	sc.stats_column_id,
	sc.column_id,
	 'DROP STATISTICS '
	+ SCHEMA_NAME(obj.Schema_id) + '.'
	+ OBJECT_NAME(s.object_id) + '.' +
	s.name DropStatisticsStatement
	INTO ##StatsAfter
	FROM sys.stats s
	JOIN sys.stats_columns sc
	ON sc.[object_id] = s.[object_id] AND sc.stats_id = s.stats_id
	JOIN sys.columns c ON c.[object_id] = sc.[object_id] AND c.column_id = sc.column_id
	JOIN sys.partitions par ON par.[object_id] = s.[object_id]
	JOIN sys.objects obj ON par.[object_id] = obj.[object_id]
	CROSS APPLY sys.dm_db_stats_properties(sc.[object_id], s.stats_id) AS dsp
	WHERE OBJECTPROPERTY(s.OBJECT_ID,'IsUserTable') = 1
	AND auto_created = 1
	AND user_created = 0
	--AND (s.auto_created = 1 OR s.user_created = 1)
	--AND DATEDIFF(d,STATS_DATE(s.[object_id], s.stats_id),getdate()) = 14
	ORDER BY  DaysOld desc;

	SET @AfterNumberOfStats = (SELECT COUNT(*) FROM ##StatsAfter)
	--print @AfterNumberOfStats
	--print @BeforeNumberOfStats

	DECLARE @StatsDiff int
	IF @BeforeNumberOfStats - @AfterNumberOfStats >= 0
		SET @StatsDiff = (SELECT @BeforeNumberOfStats - @AfterNumberOfStats)
	ELSE SET @StatsDiff = 0;

	DECLARE @StatsCreated int
	IF @BeforeNumberOfStats - @AfterNumberOfStats < 0
		SET @StatsCreated = (SELECT @AfterNumberOfStats - @BeforeNumberOfStats)
	ELSE SET @StatsCreated = 0;

-- This tells you if you are deleting too many days based off of the retention days.
	IF @StatsCreated > 2

		EXEC msdb.dbo.sp_send_dbmail

		@recipients=N'dba.support@sonicAutomotive.com',
		@subject = N'Too Many Stats Are Being Deleted on ',
		@body = N'Too many stats Are Being Deleted on a database on the server below. You will need to look in the dba.dbo.[OldStatsDeletedHistory] table to see which database. You will probably have to increase the number of day to retain from this database in the SQL job DBA_DeleteOldStats.',
		@query = N'Select @@SERVERNAME',
		@profile_name = 'SQL Alerts';


	INSERT INTO dba.dbo.OldStatsDeletedHistory SELECT getdate(), @DBName, @BeforeNumberOfStats, @AfterNumberOfStats, @StatsDiff, @StatsCreated, @NumDays2Retain

	IF OBJECT_ID(N'tempdb..##Stats2BeDropped') IS NOT NULL
	BEGIN
	DROP TABLE ##Stats2BeDropped
	END;

	IF OBJECT_ID(N'tempdb..##Stats2BeDropped2') IS NOT NULL
	BEGIN
	DROP TABLE ##Stats2BeDropped2
	END;

	IF OBJECT_ID(N'tempdb..##StatsAfter') IS NOT NULL
	BEGIN
	DROP TABLE ##StatsAfter
	END;

	IF OBJECT_ID(N'tempdb..##Stats') IS NOT NULL
	BEGIN
	DROP TABLE ##Stats
	END;

END

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
