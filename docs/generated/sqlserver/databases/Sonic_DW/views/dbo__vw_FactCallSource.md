---
name: vw_FactCallSource
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

2- **Type**: View

- **Schema**: dbo

## Definition

```sql

CREATE VIEW [dbo].[vw_FactCallSource]
AS
--added Adsource4 and ThirdPartySourceStandard. Point of this was to use this view for all callsource as its most updated. Changes made 12/3/2024

SELECT        a.FactCallSourceId, CASE WHEN a.EntityKey = 170 THEN 401 ELSE a.EntityKey END AS EntityKey, a.CallDateKey, a.ResultKey, a.AdSourceKey, a.ReviewStatusKey, a.CallDurationSeconds, a.CallCount, UPPER(a.CallerNumber)
                         AS CallerNumber, case when a.adsource4='DNI' then 'Website' else a.adsource4 end as adsource4 , ThirdPartySourceStandard,  a.User_ID, a.Meta_Src_Sys_ID, a.Meta_LoadDate, a.Meta_ComputerName, a.ETLExecution_ID, a.Meta_NaturalKey, a.AgentReached, a.Opportunity, a.Appointment, a.NoConnection, a.MonitoredCall,
                         a.AbandonedCall, a.SameDayAppointment, a.AppointmentSetWithTime, a.CallOfflined, a.ObtainedName, a.ObtainedNumber, a.ObtainedEmail, a.AgentConfirmEmail, a.AgentConfirmName, a.AgentConfirmPhone,
                         a.AgentRequestedAppointment, a.AlertSent, a.AlertClosed, a.TrackingNumber, a.Target, a.CallRevuAIDepartment, a.NewUsed, a.EntDealerLvl1, dbo.DimResult.ResultDescription, dbo.DimResult.Result,
                         (CASE WHEN a.DepartmentKey <> 10 THEN (CASE WHEN dbo.DimResult.Result = 'C' THEN 1 ELSE 0 END) ELSE COALESCE (a.HadConversation, - 1) END) AS HadConversation, COALESCE (a.StoreWasOpen, - 1)
                         AS StoreWasOpen, COALESCE (a.RoutedCall, - 1) AS RoutedCall, a.IVROption_1Key, a.IVROption_2Key, a.IVROption_3Key, a.IVROption_4Key, a.IVROption_5Key, a.DepartmentKey, 'Phone' AS SrcUpType,
                         dbo.DimTrafficManagementNewUsed.NewUsedDesc
FROM            (SELECT        cs.FactCallSourceId, cs.EntityKey, cs.CallDateKey, cs.ResultKey, cs.AdSourceKey, ad.adsource4,  isnull(m.thirdpartystandard, 'Other') ThirdPartySourceStandard, cs.ReviewStatusKey, cs.CallDurationSeconds, cs.CallCount, cs.CallerNumber, cs.User_ID, cs.Meta_Src_Sys_ID,
                                                    cs.Meta_LoadDate, cs.Meta_ComputerName, cs.ETLExecution_ID, cs.Meta_NaturalKey, cs.AgentReached, cs.Opportunity, cs.Appointment, cs.NoConnection, cs.MonitoredCall, cs.AbandonedCall,
                                                    cs.SameDayAppointment, cs.AppointmentSetWithTime, cs.CallOfflined, cs.ObtainedName, cs.ObtainedNumber, cs.ObtainedEmail, cs.AgentConfirmEmail, cs.AgentConfirmName, cs.AgentConfirmPhone,
                                                    cs.AgentRequestedAppointment, cs.AlertSent, cs.AlertClosed, cs.TrackingNumber, cs.Target, crd.CallRevuAIDepartment,
                                                    CASE WHEN crd.CallRevuAIDepartment = 'Used' THEN 'U' WHEN crd.CallRevuAIDepartment IN ('New') THEN 'N' WHEN (e_1.CallRevuIVRDate <> '1900-01-01') THEN 'N' ELSE 'N' END AS NewUsed,
                                                    dbo.Dim_Entity.EntDealerLvl1, cs.RoutedCall, cs.IVROption_1Key, cs.IVROption_2Key, cs.IVROption_3Key, cs.IVROption_4Key, cs.IVROption_5Key, cs.AnsweredCall, cs.HadConversation, cs.StoreWasOpen,
                                                    cs.DepartmentKey
                          FROM            dbo.FactCallSource AS cs INNER JOIN
                                                    dbo.DimAdSource AS ad ON cs.AdSourceKey = ad.AdSourceKey
													left join [sonic_dw].[dbo].[callsourceThirdPartyMapping] m on ad.adsource4=m.[adsource4]
													INNER JOIN
                                                    dbo.DimCallRevuDepartment AS crd ON cs.DepartmentKey = crd.DepartmentKey INNER JOIN
                                                    dbo.Dim_Entity ON cs.EntityKey = dbo.Dim_Entity.EntityKey INNER JOIN
                                                        (SELECT        e.EntityKey, COALESCE (a_1.DateField, '1900-01-01') AS CallRevuIVRDate
                                                          FROM            dbo.Dim_Entity AS e LEFT OUTER JOIN
                                                                                        (SELECT        er.EntityKey, er.DateField
                                                                                          FROM            dbo.DimEntityRelationship AS er INNER JOIN
                                                                                                                    dbo.DimEntityRelationshipType AS ert ON er.RelationshipTypeGuid = ert.RelationshipTypeGuid
                                                                                          WHERE        (ert.RelationshipId = 138) AND (er.IsActive = 1)) AS a_1 ON e.EntityKey = a_1.EntityKey
                                                          WHERE        (e.EntActive = 'Active')) AS e_1 ON cs.EntityKey = e_1.EntityKey
                          WHERE        (crd.CallRevuAIDepartment IN ('New', 'Used', 'Sales'))) AS a INNER JOIN
                         dbo.DimResult ON a.ResultKey = dbo.DimResult.ResultKey LEFT OUTER JOIN
                         dbo.DimTrafficManagementNewUsed ON a.NewUsed = dbo.DimTrafficManagementNewUsed.NewUsedID
WHERE        (a.NewUsed IN ('N', 'U'))




```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
