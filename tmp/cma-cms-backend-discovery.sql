SET NOCOUNT ON;

PRINT 'OBJECT_DEFINITIONS';
SELECT
  s.name AS SchemaName,
  o.name AS ObjectName,
  o.type_desc AS ObjectType,
  m.definition AS DefinitionText
FROM sys.objects o
JOIN sys.schemas s ON o.schema_id = s.schema_id
JOIN sys.sql_modules m ON m.object_id = o.object_id
WHERE
  (s.name = 'cmag' AND o.name IN (
    'usp_dearlerinfo',
    'usp_DailyActivity',
    'pDailyCashSummaryRpt',
    'pNegativeBalanceRpt_Dev_BJ',
    'vw_DealerAcctType'
  ))
  OR (s.name = 'dbo' AND o.name = 'pDailyCashSummaryRpt')
ORDER BY s.name, o.name;

PRINT 'TABLE_COLUMNS';
SELECT
  s.name AS SchemaName,
  t.name AS TableName,
  c.column_id AS ColumnId,
  c.name AS ColumnName,
  ty.name AS DataType,
  CASE
    WHEN ty.name IN ('varchar', 'char', 'nvarchar', 'nchar') THEN
      CASE WHEN c.max_length = -1 THEN 'max'
           WHEN ty.name IN ('nvarchar', 'nchar') THEN CONVERT(varchar(10), c.max_length / 2)
           ELSE CONVERT(varchar(10), c.max_length)
      END
    WHEN ty.name IN ('decimal', 'numeric') THEN CONVERT(varchar(20), c.precision) + ',' + CONVERT(varchar(20), c.scale)
    ELSE NULL
  END AS LengthPrecision,
  c.is_nullable AS IsNullable
FROM sys.tables t
JOIN sys.schemas s ON t.schema_id = s.schema_id
JOIN sys.columns c ON c.object_id = t.object_id
JOIN sys.types ty ON c.user_type_id = ty.user_type_id
WHERE
  (s.name = 'cmag' AND t.name IN ('tblDetails', 'tbldealershipinfo'))
  OR (s.name = 'dbo' AND t.name = 'dimDate')
ORDER BY s.name, t.name, c.column_id;

PRINT 'SQL_DEPENDENCIES';
SELECT DISTINCT
  OBJECT_SCHEMA_NAME(d.referencing_id) AS ReferencingSchema,
  OBJECT_NAME(d.referencing_id) AS ReferencingObject,
  referenced_schema_name AS ReferencedSchema,
  referenced_entity_name AS ReferencedObject
FROM sys.sql_expression_dependencies d
WHERE
  OBJECT_SCHEMA_NAME(d.referencing_id) = 'cmag'
  AND OBJECT_NAME(d.referencing_id) IN (
    'usp_dearlerinfo',
    'usp_DailyActivity',
    'pDailyCashSummaryRpt',
    'pNegativeBalanceRpt_Dev_BJ',
    'vw_DealerAcctType'
  )
ORDER BY ReferencingSchema, ReferencingObject, ReferencedSchema, ReferencedObject;
