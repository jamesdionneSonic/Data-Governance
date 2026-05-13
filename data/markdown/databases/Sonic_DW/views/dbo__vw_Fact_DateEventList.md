---
name: vw_Fact_DateEventList
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_Date
  - Dim_DateEvent
  - Fact_DateEvent
dependency_count: 3
column_count: 3
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Date** (U )
- **dbo.Dim_DateEvent** (U )
- **dbo.Fact_DateEvent** (U )

## Columns

| Name                    | Type    | Nullable | Description |
| ----------------------- | ------- | -------- | ----------- |
| `DateKey`               | int     |          |             |
| `DateEventIDs`          | varchar | ✓        |             |
| `DateEventDescriptions` | varchar | ✓        |             |

## Definition

```sql

--CREATE VIEW dbo.vw_Fact_DateEventList
--AS
--SELECT
--    d.DateKey,
--    CASE
--        WHEN COUNT(f.DateEventID) = 0
--            THEN '0'
--        ELSE STRING_AGG(CAST(f.DateEventID AS VARCHAR(10)), ',')
--    END AS DateEventIDs
--FROM dbo.Dim_Date d
--LEFT JOIN dbo.Fact_DateEventDate f
--    ON d.DateKey = f.DateKey
--WHERE d.FullDate >= DATEFROMPARTS(YEAR(GETDATE()) - 4, 1, 1)
--  AND d.FullDate <= CAST(GETDATE() AS DATE)
--GROUP BY d.DateKey;
--GO

CREATE VIEW [dbo].[vw_Fact_DateEventList]
AS

SELECT
    d.DateKey,

    -- Comma-separated list of DateEventIDs (or 0 if none)
    CASE
        WHEN EXISTS
        (
            SELECT 1
            FROM dbo.Fact_DateEvent f
            WHERE f.DateKey = d.DateKey
        )
        THEN
            STUFF
            (
                (
                    SELECT
                        ',' + CAST(f2.DateEventID AS VARCHAR(10))
                    FROM dbo.Fact_DateEvent f2
                    WHERE f2.DateKey = d.DateKey
                    ORDER BY f2.DateEventID
                    FOR XML PATH(''), TYPE
                ).value('.', 'VARCHAR(MAX)'),
                1, 1, ''
            )
        ELSE '0'
    END AS DateEventIDs,

    -- Comma-separated list of Event Descriptions (NULL if none)
    CASE
        WHEN EXISTS
        (
            SELECT 1
            FROM dbo.Fact_DateEvent f
            WHERE f.DateKey = d.DateKey
        )

        THEN
            STUFF
            (
                (
                    SELECT
                        ',"' + REPLACE(e.EventDescription, '"', '""') + '"'
                    FROM dbo.Fact_DateEvent f3
                    INNER JOIN dbo.Dim_DateEvent e
                        ON e.DateEventID = f3.DateEventID
                    WHERE f3.DateKey = d.DateKey
                    ORDER BY f3.DateEventID
                    FOR XML PATH(''), TYPE
                ).value('.', 'VARCHAR(MAX)'),
                1, 1, ''
            )
        ELSE '"Normal Day"'
    END AS DateEventDescriptions


FROM dbo.Dim_Date d
WHERE d.FullDate >= DATEFROMPARTS(YEAR(GETDATE()) - 4, 1, 1)
  AND d.FullDate <= CAST(GETDATE() AS DATE);

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
