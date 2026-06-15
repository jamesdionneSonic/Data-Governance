SET NOCOUNT ON;

WITH ds AS (
  SELECT
    Path,
    TRY_CONVERT(xml, TRY_CONVERT(varbinary(max), Content)) AS DefinitionXml
  FROM dbo.Catalog
  WHERE Type = 5
    AND Path IN (
      '/CMA/DataSource/CMA',
      '/CMA/DataSource/CMAListener',
      '/CMA/DataSource/CMATest'
    )
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
FROM ds
ORDER BY Path;
