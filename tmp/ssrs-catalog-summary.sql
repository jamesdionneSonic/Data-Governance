SET NOCOUNT ON;

DECLARE @Since datetime = DATEADD(month, -6, GETDATE());

;WITH report_usage AS (
    SELECT
        c.ItemID,
        c.Path,
        c.Name,
        LEFT(STUFF(c.Path, 1, 1, ''), CHARINDEX('/', STUFF(c.Path, 1, 1, '') + '/') - 1) AS TopFolder,
        COUNT(el.InstanceName) AS ExecutionsLast6Months,
        MAX(el.TimeStart) AS LastExecution,
        COUNT(DISTINCT el.UserName) AS DistinctUsers
    FROM dbo.Catalog c
    LEFT JOIN dbo.ExecutionLog3 el
        ON el.ItemPath = c.Path
       AND el.TimeStart >= @Since
    WHERE c.Type = 2
    GROUP BY c.ItemID, c.Path, c.Name
)
SELECT
    COUNT(*) AS ReportCount,
    SUM(CASE WHEN ExecutionsLast6Months > 0 THEN 1 ELSE 0 END) AS ActiveReportCount,
    SUM(CASE WHEN ExecutionsLast6Months = 0 THEN 1 ELSE 0 END) AS NoRecentUsageReportCount,
    SUM(ExecutionsLast6Months) AS TotalExecutionsLast6Months,
    CONVERT(varchar(19), MAX(LastExecution), 120) AS MostRecentExecution,
    COUNT(DISTINCT CASE WHEN DistinctUsers > 0 THEN TopFolder END) AS ActiveTopFolderCount
FROM report_usage;

;WITH report_usage AS (
    SELECT
        c.Path,
        LEFT(STUFF(c.Path, 1, 1, ''), CHARINDEX('/', STUFF(c.Path, 1, 1, '') + '/') - 1) AS TopFolder,
        COUNT(el.InstanceName) AS ExecutionsLast6Months,
        MAX(el.TimeStart) AS LastExecution,
        COUNT(DISTINCT el.UserName) AS DistinctUsers
    FROM dbo.Catalog c
    LEFT JOIN dbo.ExecutionLog3 el
        ON el.ItemPath = c.Path
       AND el.TimeStart >= @Since
    WHERE c.Type = 2
    GROUP BY c.Path
)
SELECT
    TopFolder,
    COUNT(*) AS ReportCount,
    SUM(CASE WHEN ExecutionsLast6Months > 0 THEN 1 ELSE 0 END) AS ActiveReportCount,
    SUM(CASE WHEN ExecutionsLast6Months = 0 THEN 1 ELSE 0 END) AS NoRecentUsageReportCount,
    SUM(ExecutionsLast6Months) AS TotalExecutionsLast6Months,
    COALESCE(CONVERT(varchar(19), MAX(LastExecution), 120), '') AS MostRecentExecution,
    SUM(DistinctUsers) AS DistinctUserReportSum
FROM report_usage
GROUP BY TopFolder
ORDER BY TopFolder;
