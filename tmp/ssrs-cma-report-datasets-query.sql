SET NOCOUNT ON;

WITH reports AS (
  SELECT
    Path,
    Name,
    TRY_CONVERT(xml, TRY_CONVERT(varbinary(max), Content)) AS ReportXml
  FROM dbo.Catalog
  WHERE Type = 2
    AND Path LIKE '/CMA/%'
)
SELECT
  r.Path AS ReportPath,
  r.Name AS ReportName,
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
ORDER BY r.Path, DatasetName;
