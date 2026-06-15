SET NOCOUNT ON;

SELECT
  s.name AS SchemaName,
  o.name AS ObjectName,
  o.type_desc AS ObjectType,
  m.definition AS DefinitionText
FROM sys.objects o
JOIN sys.schemas s ON o.schema_id = s.schema_id
JOIN sys.sql_modules m ON m.object_id = o.object_id
WHERE s.name = 'cmag'
  AND o.name IN ('tvfn_DailyActivity', 'tvfn_dearlerinfo')
ORDER BY o.name;
