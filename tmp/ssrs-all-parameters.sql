SET NOCOUNT ON;

WITH reports AS (
  SELECT
    Path,
    Name,
    TRY_CONVERT(xml, TRY_CONVERT(varbinary(max), Content)) AS ReportXml
  FROM dbo.Catalog
  WHERE Type = 2
)
SELECT
  r.Path AS ReportPath,
  r.Name AS ReportName,
  p.node.value('@Name', 'nvarchar(255)') AS ParameterName,
  p.node.value('(./*[local-name()="DataType"]/text())[1]', 'nvarchar(100)') AS DataType,
  p.node.value('(./*[local-name()="Prompt"]/text())[1]', 'nvarchar(255)') AS Prompt,
  p.node.value('(./*[local-name()="AllowBlank"]/text())[1]', 'nvarchar(20)') AS AllowBlank,
  p.node.value('(./*[local-name()="Nullable"]/text())[1]', 'nvarchar(20)') AS Nullable,
  p.node.value('(./*[local-name()="MultiValue"]/text())[1]', 'nvarchar(20)') AS MultiValue
FROM reports r
CROSS APPLY r.ReportXml.nodes('//*[local-name()="ReportParameter"]') AS p(node)
ORDER BY r.Path, ParameterName;
