SET NOCOUNT ON;

DECLARE @Since datetime = DATEADD(month, -6, GETDATE());

PRINT 'REPORTS';
SELECT
  c.Path,
  c.Name,
  CONVERT(varchar(19), c.CreationDate, 120) AS Created,
  CONVERT(varchar(19), c.ModifiedDate, 120) AS Modified,
  u.UserName AS ModifiedBy,
  COALESCE(x.Executions, 0) AS ExecutionsLast6Months,
  CONVERT(varchar(19), x.LastExecution, 120) AS LastExecution,
  COALESCE(x.DistinctUsers, 0) AS DistinctUsersLast6Months,
  COALESCE(s.SubscriptionCount, 0) AS SubscriptionCount
FROM dbo.Catalog c
LEFT JOIN dbo.Users u ON c.ModifiedByID = u.UserID
OUTER APPLY (
  SELECT
    COUNT(*) AS Executions,
    MAX(TimeStart) AS LastExecution,
    COUNT(DISTINCT UserName) AS DistinctUsers
  FROM dbo.ExecutionLog3 el
  WHERE el.ItemPath = c.Path
    AND el.TimeStart >= @Since
) x
OUTER APPLY (
  SELECT COUNT(*) AS SubscriptionCount
  FROM dbo.Subscriptions sub
  WHERE sub.Report_OID = c.ItemID
) s
WHERE c.Type = 2
  AND c.Path LIKE '/CMA/%'
ORDER BY c.Path;

PRINT 'DATA_SOURCE_BINDINGS';
SELECT
  c.Path AS ReportPath,
  ds.Name AS DataSourceName,
  linked.Path AS SharedDataSourcePath
FROM dbo.Catalog c
LEFT JOIN dbo.DataSource ds ON ds.ItemID = c.ItemID
LEFT JOIN dbo.Catalog linked ON linked.ItemID = ds.Link
WHERE c.Type = 2
  AND c.Path LIKE '/CMA/%'
ORDER BY c.Path, ds.Name;

PRINT 'DATA_SOURCE_DEFINITIONS';
WITH shared_sources AS (
  SELECT
    Path,
    TRY_CONVERT(xml, TRY_CONVERT(varbinary(max), Content)) AS DefinitionXml
  FROM dbo.Catalog
  WHERE Type = 5
    AND Path LIKE '/CMA/DataSource/%'
)
SELECT
  Path,
  DefinitionXml.value(
    'declare namespace d="http://schemas.microsoft.com/sqlserver/reporting/2006/03/reportdatasource";
     (/d:DataSourceDefinition/d:Extension/text())[1]',
    'nvarchar(100)'
  ) AS Extension,
  DefinitionXml.value(
    'declare namespace d="http://schemas.microsoft.com/sqlserver/reporting/2006/03/reportdatasource";
     (/d:DataSourceDefinition/d:ConnectString/text())[1]',
    'nvarchar(1000)'
  ) AS ConnectString,
  DefinitionXml.value(
    'declare namespace d="http://schemas.microsoft.com/sqlserver/reporting/2006/03/reportdatasource";
     (/d:DataSourceDefinition/d:CredentialRetrieval/text())[1]',
    'nvarchar(100)'
  ) AS CredentialRetrieval,
  DefinitionXml.value(
    'declare namespace d="http://schemas.microsoft.com/sqlserver/reporting/2006/03/reportdatasource";
     (/d:DataSourceDefinition/d:Enabled/text())[1]',
    'nvarchar(20)'
  ) AS Enabled
FROM shared_sources
ORDER BY Path;

PRINT 'DATASETS';
WITH reports AS (
  SELECT
    Path,
    Name,
    TRY_CONVERT(xml, TRY_CONVERT(varbinary(max), Content)) AS ReportXml
  FROM dbo.Catalog
  WHERE Type = 2
    AND Path LIKE '/CMA/%'
),
datasets AS (
  SELECT
    r.Path AS ReportPath,
    ds.node.value('@Name', 'nvarchar(255)') AS DatasetName,
    NULLIF(LTRIM(RTRIM(ds.node.value(
      '(./*[local-name()="Query"]/*[local-name()="CommandType"]/text())[1]',
      'nvarchar(100)'
    ))), '') AS CommandType,
    NULLIF(LTRIM(RTRIM(ds.node.value(
      '(./*[local-name()="Query"]/*[local-name()="CommandText"]/text())[1]',
      'nvarchar(max)'
    ))), '') AS CommandText
  FROM reports r
  CROSS APPLY r.ReportXml.nodes('//*[local-name()="DataSet"]') AS ds(node)
)
SELECT
  ReportPath,
  DatasetName,
  COALESCE(CommandType, 'Text') AS CommandType,
  LEFT(REPLACE(REPLACE(REPLACE(CommandText, CHAR(13), ' '), CHAR(10), ' '), CHAR(9), ' '), 500) AS CommandSnippet
FROM datasets
ORDER BY ReportPath, DatasetName;

PRINT 'PARAMETERS';
WITH reports AS (
  SELECT
    Path,
    TRY_CONVERT(xml, TRY_CONVERT(varbinary(max), Content)) AS ReportXml
  FROM dbo.Catalog
  WHERE Type = 2
    AND Path LIKE '/CMA/%'
)
SELECT
  r.Path AS ReportPath,
  p.node.value('@Name', 'nvarchar(255)') AS ParameterName,
  p.node.value('(./*[local-name()="DataType"]/text())[1]', 'nvarchar(100)') AS DataType,
  p.node.value('(./*[local-name()="Prompt"]/text())[1]', 'nvarchar(255)') AS Prompt,
  p.node.value('(./*[local-name()="AllowBlank"]/text())[1]', 'nvarchar(20)') AS AllowBlank,
  p.node.value('(./*[local-name()="Nullable"]/text())[1]', 'nvarchar(20)') AS Nullable,
  p.node.value('(./*[local-name()="MultiValue"]/text())[1]', 'nvarchar(20)') AS MultiValue
FROM reports r
CROSS APPLY r.ReportXml.nodes('//*[local-name()="ReportParameter"]') AS p(node)
ORDER BY r.Path, ParameterName;
