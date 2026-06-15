SET NOCOUNT ON;

WITH shared_sources AS (
  SELECT DISTINCT
    linked.ItemID,
    linked.Path,
    TRY_CONVERT(xml, TRY_CONVERT(varbinary(max), linked.Content)) AS DefinitionXml
  FROM dbo.Catalog c
  JOIN dbo.DataSource ds ON ds.ItemID = c.ItemID
  JOIN dbo.Catalog linked ON linked.ItemID = ds.Link
  WHERE c.Type = 2
    AND linked.Type = 5
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
