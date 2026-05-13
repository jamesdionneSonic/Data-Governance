---
name: vw_Fact_GECReportDaily
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_Fact_GECReportDaily
AS
SELECT        a.Id, a.CompanyName, a.ChildCompanyID, a.AgentOrder, a.Agent, a.lUserID, a.ChildUserID, a.UserName, a.UpTypeOrder,
                         CASE WHEN UpTypeOrder = 3 THEN 'Internet' WHEN UpTypeOrder = 5 THEN 'Phone' WHEN UpTypeOrder = 7 THEN 'Showroom' WHEN UpTypeOrder = 9 THEN 'Campaign' ELSE 'N/A' END AS UpType, a.NewUsedOrder,
                         a.NewUsed, a.Ups, a.Visit, a.ApptsSet, a.ApptsDue, a.ApptsShown, a.ApptsNoShow, a.ApptsCancel, a.CRMSold, a.DMSSold, a.CloseRatio, a.ApptShowRatio, a.ApptLeadRatio, a.Meta_SourceFileName, a.Meta_FileDate,
                         a.Meta_UpdateDate, a.Meta_LoadDate, a.Meta_ComputerName, a.Meta_UserID, a.Meta_SourceSystemName, a.Meta_SrcSysID, a.ETLExecutionID, a.ApprApptsDue, a.ApprApptsShown, a.DeliveryApptsDue,
                         a.DeliveryApptsShown, e.EntityKey, CASE WHEN a.UserName LIKE 'Grace RP%' THEN 'Grace' WHEN a.UserName LIKE 'Grace EP%' THEN 'Grace' WHEN gg.GroupName IS NOT NULL
                         THEN gg.GroupName ELSE 'GEC' END AS GroupName
FROM            (SELECT        EchoParkGECReportDailyID AS Id, CompanyName, ChildCompanyID, AgentOrder, Agent, lUserID, ChildUserID, UserName, UpTypeOrder, NewUsedOrder, NewUsed, Ups, Visit, ApptsSet, ApptsDue, ApptsShown,
                                                    ApptsNoShow, ApptsCancel, CRMSold, DMSSold, CloseRatio, ApptShowRatio, ApptLeadRatio, Meta_SourceFileName, Meta_FileDate, Meta_UpdateDate, Meta_LoadDate, Meta_ComputerName, Meta_UserID,
                                                    Meta_SourceSystemName, Meta_SrcSysID, ETLExecutionID, ApprApptsDue, ApprApptsShown, DeliveryApptsDue, DeliveryApptsShown
                          FROM            [L1-DWASQL-02,12010].VendorData.Elead.EchoParkGECReportDaily AS EPDaily
                          UNION ALL
                          SELECT        RetailGECReportDailyID AS Id, CompanyName, ChildCompanyID, AgentOrder, Agent, lUserID, ChildUserID, UserName, UpTypeOrder, NewUsedOrder, NewUsed, Ups, Visit, ApptsSet, ApptsDue, ApptsShown,
                                                   ApptsNoShow, ApptsCancel, CRMSold, DMSSold, CloseRatio, ApptShowRatio, ApptLeadRatio, Meta_SourceFileName, Meta_FileDate, Meta_UpdateDate, Meta_LoadDate, Meta_ComputerName, Meta_UserID,
                                                   Meta_SourceSystemName, Meta_SrcSysID, ETLExecutionID, ApprApptsDue, ApprApptsShown, DeliveryApptsDue, DeliveryApptsShown
                          FROM            [L1-DWASQL-02,12010].VendorData.Elead.RetailGECReportDaily AS RetDaily) AS a LEFT OUTER JOIN
                         dbo.Dim_Entity AS e ON a.ChildCompanyID = e.EntEleadNewID LEFT OUTER JOIN
                         dbo.Dim_GECGroup AS gg ON a.lUserID = gg.UserID
WHERE        (a.UpTypeOrder IN (3, 5, 7, 9)) AND (a.AgentOrder = 1) AND (e.EntActive = 'Active') AND (e.EntStoreBrand <> 'Hibernated')

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
