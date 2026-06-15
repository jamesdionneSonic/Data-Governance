SET NOCOUNT ON;

SELECT
  c.Path AS ReportPath,
  c.Name AS ReportName,
  ds.Name AS DataSourceName,
  linked.Path AS SharedDataSourcePath,
  linked.ItemID AS SharedDataSourceItemID
FROM dbo.Catalog c
LEFT JOIN dbo.DataSource ds ON ds.ItemID = c.ItemID
LEFT JOIN dbo.Catalog linked ON linked.ItemID = ds.Link
WHERE c.Type = 2
ORDER BY c.Path, ds.Name;
