SET NOCOUNT ON;

DECLARE @Since datetime = DATEADD(month, -6, GETDATE());

;WITH report_usage AS (
    SELECT
        c.ItemID,
        c.Path,
        c.Name,
        COUNT(el.InstanceName) AS ExecutionsLast6Months,
        MAX(el.TimeStart) AS LastExecution,
        COUNT(DISTINCT el.UserName) AS DistinctUsers
    FROM dbo.Catalog c
    LEFT JOIN dbo.ExecutionLog3 el
        ON el.ItemPath = c.Path
       AND el.TimeStart >= @Since
    WHERE c.Type = 2
      AND c.Path LIKE '/AcctStd/%'
    GROUP BY c.ItemID, c.Path, c.Name
),
subscriptions AS (
    SELECT
        Report_OID AS ItemID,
        COUNT(*) AS SubscriptionCount
    FROM dbo.Subscriptions
    GROUP BY Report_OID
)
SELECT
    'USAGE' AS Section,
    u.Path,
    u.Name,
    CONVERT(varchar(12), u.ExecutionsLast6Months) AS Metric1,
    COALESCE(CONVERT(varchar(19), u.LastExecution, 120), '') AS Metric2,
    CONVERT(varchar(12), u.DistinctUsers) AS Metric3,
    CONVERT(varchar(12), COALESCE(s.SubscriptionCount, 0)) AS Metric4,
    '' AS Detail
FROM report_usage u
LEFT JOIN subscriptions s
    ON s.ItemID = u.ItemID
ORDER BY u.Path;

;WITH reports AS (
    SELECT
        Path,
        Name,
        TRY_CONVERT(xml, TRY_CONVERT(varbinary(max), Content)) AS ReportXml
    FROM dbo.Catalog
    WHERE Type = 2
      AND Path LIKE '/AcctStd/%'
)
SELECT
    'PARAMETER' AS Section,
    r.Path,
    r.Name,
    p.node.value('@Name', 'nvarchar(255)') AS Metric1,
    p.node.value('(./*[local-name()="Prompt"]/text())[1]', 'nvarchar(255)') AS Metric2,
    p.node.value('(./*[local-name()="DataType"]/text())[1]', 'nvarchar(100)') AS Metric3,
    p.node.value('(./*[local-name()="MultiValue"]/text())[1]', 'nvarchar(20)') AS Metric4,
    '' AS Detail
FROM reports r
CROSS APPLY r.ReportXml.nodes('//*[local-name()="ReportParameter"]') p(node)
ORDER BY r.Path, Metric1;

;WITH reports AS (
    SELECT
        Path,
        Name,
        TRY_CONVERT(xml, TRY_CONVERT(varbinary(max), Content)) AS ReportXml
    FROM dbo.Catalog
    WHERE Type = 2
      AND Path LIKE '/AcctStd/%'
)
SELECT
    'DATASET' AS Section,
    r.Path,
    r.Name,
    ds.node.value('@Name', 'nvarchar(255)') AS Metric1,
    COALESCE(NULLIF(LTRIM(RTRIM(ds.node.value('(./*[local-name()="Query"]/*[local-name()="CommandType"]/text())[1]', 'nvarchar(100)'))), ''), 'Text') AS Metric2,
    '' AS Metric3,
    '' AS Metric4,
    LEFT(
        REPLACE(REPLACE(REPLACE(NULLIF(LTRIM(RTRIM(ds.node.value('(./*[local-name()="Query"]/*[local-name()="CommandText"]/text())[1]', 'nvarchar(max)'))), ''), CHAR(13), ' '), CHAR(10), ' '), CHAR(9), ' '),
        1800
    ) AS Detail
FROM reports r
CROSS APPLY r.ReportXml.nodes('//*[local-name()="DataSet"]') ds(node)
ORDER BY r.Path, Metric1;
