SET NOCOUNT ON;

DECLARE @Since datetime = DATEADD(month, -6, GETDATE());

SELECT
  c.ItemID,
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
ORDER BY c.Path;
