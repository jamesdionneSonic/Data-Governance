








/*  Modifications for TrafficSummary Dashboard - DRM 05/03/2023
--MOD001 - Added Columns to working table for new metrics
--MOD002 - Added TaskTypeID 65 for appraisal appointments
--MOD003 - Add in deals for acquired vehicles
--MOD004 - Update new lAcquired metric
--MOD005 - Update to mark the date confirmed for confirmed appointments Per logic in SonicAppointmentActivity Report.
--MOD006 - Add tasktype 65 to updates for appt created/due/shown/confirmed counts.  Also Added updated date logic per Jen Mullin's requirements and logic confirmed by SonicAppointmentActivity report.
--MOD007 - update flag for appraisal appointments
--MOD008 - add column for Appraisal flag to ProcOutput_Sonic source query.
--MOD009 - Add appraisal and acquired metric columns to StageTrafficSummary table and source query
--MOD010 - Add szdealsubstatus to Update of 
--MOD011 - Update For Appraisal Appointments that were Acquired Same Day  ApprApptAcquired metric.
--MOD012 - Add left join to v5 on ldealid and tasktypeid?
--MOD013 - Update lacquired for acquired vehicles without an appointment.
--MOD014 - Update dtAttemptedConfirmed and dtAttemptedConfirmed
--MOD015 - Alter the length of szLegacyDealID to varchar(50)  2024-06-05

--08/24/2023 DMD - Added @dtStart and @dtEnd variables to Source SubSource stored procs at the end for more accurate results
--09/25/2023 DMD - Added CASE WHEN v5.lChildCompanyID <> co.lCompanyID THEN v5.lCompanyID ELSE v5.lChildCompanyID END = co.lCompanyID to JOIN for Appointments Confirmed for dealers with different lCompanyID and lChildCompanyID
--11/20/2023 DMD - Added szSource = CASE WHEN s.szSource LIKE '%Custom Source%' THEN ISNULL(cs.szCompanySource,o.szUpSource) ELSE Coalesce(cs.szCompanySource, s.szSource) END for Custom Source records and added LEFT JOIN to dwFullOpportunity subquery 
--02/20/2025 DMD - Updated logic for MOD005 (dtApptConfirmed) and MOD006 (ApptConfirmed)
--04/
*/

CREATE PROCEDURE [dbo].[STAGINGEvo2_CoreReport_V3_TBI_Sonic_V2_WithDailyProcOutput]
(              
 @lCompanyID INT,             
 @dtStart DATETIME,               
 @dtEnd DATETIME,         
 @bSalesStep BIT,        
 @bAppointment BIT,        
 @bUps BIT,        
 @bSold BIT,
 @bIgnoreShowDMSSoldOnly BIT = 0 ,           
 @bInactive BIT = NULL,
 @bResponseTime BIT = NULL, 
 @bBDC BIT = NULL, 
 @lChildCompanyID INT = NULL, 
 @bInternetUpTier BIT = NULL
)     
WITH RECOMPILE        
AS         

----/* 10-30-2019 - Phil Kay - Removed "AND d.nliColorID != 17" from where clause in the 1st query that inserts into #DealsOfInterest.
----	Added filter on dtCompleted to query that sets lVisit. 
----	Done during audit to compare procedure against dbFresh */

---- ************* START STAGINGEVO2_COREREPORT ************* --        
--SET NOCOUNT ON;
--SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

--TRUNCATE TABLE dbo.ProcOutput_Sonic
--TRUNCATE TABLE dbo.StageTrafficSummary

----Core Report Engine        
--IF object_id('tempdb..#Companies') IS NOT NULL							DROP TABLE #Companies
--IF object_id('tempdb..#tmpResponses') IS NOT NULL						DROP TABLE #tmpResponses;         
--IF object_id('tempdb..#tmpDeal_STAGING_Evo2_CoreReport_V5') IS NOT NULL DROP TABLE #tmpDeal_STAGING_Evo2_CoreReport_V5;         
--IF object_id('tempdb..#tmpSalesTeam') IS NOT NULL						DROP TABLE #tmpSalesTeam;
--IF object_id('tempdb..#FirstVisits') IS NOT NULL						DROP TABLE #FirstVisits;
--IF object_id('tempdb..#TasksOfInterest') IS NOT NULL					DROP TABLE #TasksOfInterest
--IF object_id('tempdb..#DealsOfInterest') IS NOT NULL					DROP TABLE #DealsOfInterest


----Testing Declarations

--DECLARE @bSalesStep BIT, @bAppointment BIT, @bUps BIT, @bSold BIT, @bInactive bit, @bBDC bit, @bResponseTime bit;      
--DECLARE @lCompanyID INT, @lChildCompanyID int, @dtStart DATETIME, @dtEnd DATETIME, @bIgnoreShowDMSSoldOnly BIT, @bInternetUpTier bit      
 
--SELECT 
-- @lCompanyID				= 24671, --607, --18177, --28480,
-- @dtstart					= '04/01/2025',--Cast(Cast(Month(getdate())-1 as varchar) + '/1/' + Cast(year(getdate()) as varchar) as datetime), 
-- @dtend						= '04/30/2025 23:59:59',--DateAdd(minute,-1, Cast(Cast(Month(DateAdd(month, 1, getdate()))-1  as varchar) + '/1/' + Cast(year((DateAdd(month, 1, getdate()))) as varchar) as datetime)),
-- @bSalesStep				= 1,        
-- @bAppointment				= 1,        
-- @bUps						= 1,        
-- @bSold						= 1,
-- @bIgnoreShowDMSSoldOnly	= 0,           
-- @bInactive					= 1,
-- @bResponseTime				= 0, 
-- @bBDC						= 0, 
-- @lChildCompanyID			= @lCompanyID, --607, --18177, --28403,
-- @bInternetUpTier			= null

/* Added for historical date archiving for visits and bebacks*/ 
DECLARE @ArchiveMaxDate DATE = DATEADD(DAY,-45,CONVERT(DATE,GETDATE()))
DECLARE @MonthDiff INT = DATEDIFF(MONTH,@dtstart,GETDATE())
DECLARE @LastDayOfMonth DATE = EOMONTH(GETDATE())

 
--Collect Report Credit Configuration values
	DECLARE @bSalespersonOnly BIT-- not null default (0)            
		SELECT @bSalespersonOnly = 1 FROM dwFullReportCreditConfiguration WITH (NOLOCK) WHERE lCompanyID = @lCompanyID AND nliConfigurationID = 2649        
       
	DECLARE @bOneSalesStepPerDeal BIT --not null default (0)      
		SELECT @bOneSalesStepPerDeal = 1 FROM dwFullReportCreditConfiguration WITH (NOLOCK) WHERE lCompanyID = @lCompanyID AND nliConfigurationID = 2648        
        
	DECLARE @bShowDMSSoldOnly BIT, @szDefaultNewUsed VARCHAR(1)
	SELECT @bShowDMSSoldOnly = bShowDMSSold, @szDefaultNewUsed = CASE WHEN bNewUsed = 1 THEN 'U' ELSE 'N' END FROM dwFullCompany WITH (NOLOCK) WHERE lCompanyID = @lChildCompanyID  
	
	IF @bIgnoreShowDMSSoldOnly = 1 
		SET @bShowDMSSoldOnly = 0 
        
	DECLARE @bDeskLogOnly BIT 
		SELECT @bDeskLogOnly = 1 FROM dwFullReportCreditConfiguration RCC WITH (NOLOCK) WHERE RCC.lCompanyID = @lCompanyID AND RCC.nliConfigurationID = 2592

	DECLARE @bSplitDeals BIT 
		SELECT @bSplitDeals = 1 FROM dwFullReportCreditConfiguration RCC WITH (NOLOCK) WHERE RCC.lCompanyID = @lCompanyID AND RCC.nliConfigurationID = 2587

	DECLARE @bUpTasksToCurrentOwner BIT 
		SELECT @bUpTasksToCurrentOwner = 1 FROM dwFullReportCreditConfiguration RCC WITH (NOLOCK) WHERE RCC.lCompanyID = @lCompanyID AND RCC.nliConfigurationID = 3481

	IF @bInternetUpTier IS NULL
		SET @bInternetUpTier = 0



--Build Working TABLE
	CREATE TABLE #tmpDeal_STAGING_Evo2_CoreReport_V5 (
			--Stat Fields
			szNewUsed VARCHAR(1)
			,lMakeID INT
			, lUp INT NOT NULL DEFAULT (0)
			, lVisit INT NOT NULL DEFAULT (0)
			, lBeBack INT NOT NULL DEFAULT (0)
			, lSold INT NOT NULL DEFAULT (0)
			, lApptCreated INT NOT NULL DEFAULT (0)
			, lApptDue INT NOT NULL DEFAULT (0)
			, lApptShown INT  NOT NULL DEFAULT (0)
			, lApptSold INT NOT NULL DEFAULT (0)
			, lApptConfirmed INT NOT NULL DEFAULT (0)
			, lApptAttemptedConfirmed INT NOT NULL DEFAULT (0)
			, lApptIsAppriasal INT NOT NULL DEFAULT (0)  --MOD001  Added Columns for new metrics
			, lApprApptAcquired INT NOT NULL DEFAULT (0)
			, lAcquired INT NOT NULL DEFAULT (0)
			, lDemo INT NOT NULL DEFAULT (0)
			, lWriteUp INT NOT NULL DEFAULT (0)
			, lTurnOver INT NOT NULL DEFAULT (0)
			, lAppraisal INT NOT NULL DEFAULT (0)  
			, lLost INT NOT NULL DEFAULT (0)
			, lBadLead INT NOT NULL DEFAULT (0)
			, lBoughtElseWhere INT NOT NULL DEFAULT (0)
			, lReassigned INT NOT NULL DEFAULT (0)
			, lPrimaryDeal DECIMAL(6, 1) NOT NULL DEFAULT (0)
			, lSecondaryDeal DECIMAL(6, 1) NOT NULL DEFAULT (0) 
			--Nullable Stats because we need to be able to average these fields.
			, curFront MONEY
			, curBack MONEY
			, curTotal MONEY
			, lResponseTime INT
			, curLeadCost MONEY 
			--Reference Fields
			, lCompanyID INT
			, lChildCompanyID INT
			, lPersonID INT
			, lDealID INT
			, lReferenceID BIGINT
			, nliReferenceSourceID INT
			, lPurchaseDetailsID INT
			, nliCategoryID SMALLINT
			, nliColorID SMALLINT
			, lSourceID INT
			, lDealSubStatusID INT
			, szLegacyDealID VARCHAR(50)  --MOD015  Update the length to varchar(50) from varchar(10)
			, lTaskID BIGINT
			, lTaskTypeID INT
			, szSource VARCHAR(50)
			, szSubSource VARCHAR(75)
			, szDealSubStatus VARCHAR(50)
			, szUpType VARCHAR(40) NULL DEFAULT ''
				--User Fields
			,lPrimarySalespersonID INT
			, lSalespersonID INT
			, lBDCPrimary INT
			, lBDCSecondary INT
			, lCreatedById INT
			, lCurrentOwnerID INT
			, lCompletedByID INT
			, lApptConfirmedByID INT
			
			--Date Fields
			,dtProspectIn DATETIME
			, dtIn DATETIME
			, dtClosed DATETIME
			, dtSold DATETIME
			, dtCreated DATETIME
			, dtDue DATETIME
			, dtCompleted DATETIME
			, dtTaskClosed DATETIME
			, dtApptConfirmed DATETIME
			, dtAttemptedConfirmed DATETIME
			, dtEntry DATETIME
			, dtResponseTask DATETIME
			,nliInternetUpTier SMALLINT);

--drop table #tmpDeal_STAGING_Evo2_CoreReport_V5
--Instead of calling the Process in a loop in reports for corp reports Collect report from Parent Level.
--Each Company can be in different Time Zones,so adjust Start and End Times for Dealership Time Zone.  SCD Children currently use the Parent's Time Zone.  If this ever changes revisions will be necessary.
	
	--##########Need TFS 84130 completed to address the issues with Company Collections##########--
	CREATE TABLE #Companies (lCompanyID INT, dtStart DateTime, dtEnd DateTime, nLocalTimeConversion INT,  CRMSold BIT)

	Insert into #Companies (lCompanyID, dtStart, dtEnd, CRMSold) --drop TABLE #Companies
	Select DISTINCT Coalesce(cc.lCompanyID, ch.lChildID), 
               dbo.fn_GetServerTime(Coalesce(cc.lCompanyID, ch.lChildID), @dtStart), 
               dbo.fn_GetServerTime(Coalesce(cc.lCompanyID, ch.lChildID), @dtEnd),
			   ISNULL(crm.CRMSold,0)
    From [dbo].[dwFullCompanyHierarchy] ch WITH (NOLOCK) 
    left join [dbo].[dwFullCompanyChildCompanyMap] cc WITH (NOLOCK) 
                    on cc.lChildCompanyID = ch.lChildID
	LEFT JOIN [dbo].[ProcCRMSoldLU] crm WITH (NOLOCK)
					ON crm.lCompanyID = Coalesce(cc.lCompanyID, ch.lChildID)
    Where ch.lParentID = @lCompanyID
                    and ch.bChildActive = 1
                    and ch.bChildDealership = 1


--select * from #Companies



    Update #Companies set nLocalTimeConversion = DateDiff(hour, @dtStart, dtStart) --Precalc Offset for Schedule adjustments.  TFS Item 39808

select * from #Companies

	CREATE CLUSTERED INDEX ix_Companies ON #Companies (lCompanyID)
	CREATE NonCLUSTERED INDEX ix_CompaniesDates ON #Companies (lCompanyID, dtStart, dtEnd)

--Do we need to hit dbELEADArchive?	
	Declare @ConsiderArchive bit; set @ConsiderArchive = 0;
	
	Declare @TaskTypes table (lTaskTypeID int)

	insert into @TaskTypes (lTaskTypeID)
		values (7),(8),(9),(13),(21),(31),(65)

	--Collect Tasks that will be used later.
	Create Table #TasksOfInterest (lCompanyID int, lTaskID bigInt, szDB varchar(1))
	--Collect Deals that will be used later.
	Create Table #DealsOfInterest (lCompanyID int, lDealID Int)
--11/13/2020 start edit
--IF object_id('eLeadDW..TempDealsOfInterest') IS NOT NULL  DROP TABLE dbo.TempDealsOfInterest
--	Create Table dbo.TempDealsOfInterest (LocationNbr varchar(50),lCompanyID int, lDealID Int)
--11/13/2020 end edit

	If @bUps = 1 or @bAppointment = 1
	Begin
		--Completed Tasks (Ups, Visits and Appointments)  ##### Archived Data is out of Sync
		Insert into #TasksOfInterest
		Select c.lCompanyID, ta.lTaskID, 'T'
		From #Companies c WITH (NOLOCK) 
		--join dwFullOpportunity o
		--on c.lCompanyID = o.lChildCompanyID
		Cross Apply (select lCompanyID, lTaskID, szDB = 'T'
			 From dwFullActivity t (NOLOCK) 
				where t.lCompanyID = c.lCompanyID
				and t.dtCompleted between c.dtStart and c.dtEnd
				and t.lDealiD is not null 
				and t.lCustomerID != -1
				) ta
		Where c.lCompanyID > 0

--select lcompanyid, count(*) from #TasksOfInterest group by lcompanyid;

		If @bAppointment = 1
		Begin
			--Index to Make Existence Check Faster
			Create Clustered Index idx_CompanyTask on #TasksOfInterest (lCompanyID asc, lTaskID asc)

			-- We also care about Appointments Due during the report period
			Insert into #TasksOfInterest
			Select C.lCompanyID, t.lTaskID, 'T'
			From #Companies c WITH (NOLOCK) 
			--INNER JOIN dwfullopportunity o  --edited this to get appointments for EP locations.  Can't join to activity on the lcompanyid...
			--on c.lCompanyID = o.lChildCompanyID
			Inner join dwFullActivity t (NOLOCK) 
				ON t.lCompanyID = c.lCompanyID
				and t.dtDue between c.dtStart and c.dtEnd
				and t.lTaskTypeID in (7,65)  --MOD002 added 65 for appraisal appointment activity type
			Left join #TasksOfInterest toi (NOLOCK) 
				on toi.lCompanyID = t.lCompanyID
				and toi.lTaskID = t.lTaskID
			Where c.lCompanyID > 0
				and toi.lCompanyID is null

--select lcompanyid, count(*) from #TasksOfInterest group by lcompanyid;
			

			-- We also care about Appointments Added during the report period
			INSERT INTO #TasksOfInterest
			SELECT C.lCompanyID, t.lTaskID, 'T'
			FROM #Companies c WITH (NOLOCK) 
			INNER JOIN dwFullActivity t (NOLOCK) 
				ON t.lCompanyID = c.lCompanyID
				AND t.dtEntry BETWEEN c.dtStart AND c.dtEnd
				AND t.lTaskTypeID IN (7,65) --MOD002 added 65 for appraisal appointment activity type
			LEFT JOIN #TasksOfInterest toi (NOLOCK) 
				ON toi.lCompanyID = t.lCompanyID
				AND toi.lTaskID = t.lTaskID
			WHERE c.lCompanyID > 0
				AND toi.lCompanyID IS NULL
			
		END
--select lcompanyid, count(*) from #TasksOfInterest group by lcompanyid;

		--Now Collect Details for the Aforementioned Tasks	(including ups via up tasks...)*******
		Insert into #tmpDeal_STAGING_Evo2_CoreReport_V5	
		(lCompanyID
		, lChildCompanyID
		, lPersonID
		, lDealID
		, dtIn
		, dtEntry
		, dtDue
		, lTaskID
		, dtCompleted
		, lTaskTypeID
		, lCREATEdByID
		, lCurrentOwnerID
		, lCompletedByID)
		select t.lCompanyID
		, null
		, t.lCustomerID
		, t.lDealID
		, dtIn = t.dtCompleted
		, t.dtEntry
		, t.dtDue
		, t.lTaskID
		, t.dtCompleted
		, t.lTaskTypeID
		, t.lCreatorID
		, t.lCurrentOwnerID
		, t.lCompletedByID
		From #TasksOfInterest toi
		Inner join dwFullActivity t (NOLOCK) 
			ON t.lCompanyID = toi.lCompanyID
			and t.lTaskID = toi.lTaskID
			and t.lCustomerID != -1
		Inner join @TaskTypes tt on tt.lTaskTypeID = t.lTaskTypeID
		Where toi.lCompanyID > 0

--select lcompanyid, count(*) from #tmpDeal_STAGING_Evo2_CoreReport_V5 group by lcompanyid;
				
	
	CREATE NONCLUSTERED INDEX [IX_tmpDeal_STAGING_Evo2_CoreReport_V5_lDealID]
	ON [#tmpDeal_STAGING_Evo2_CoreReport_V5] ([lDealID])
	INCLUDE ([lSold],lTaskID);

	CREATE NONCLUSTERED INDEX [IX_tmpDeal_STAGING_Evo2_CoreReport_V5_lTaskID]
	ON [#tmpDeal_STAGING_Evo2_CoreReport_V5] ([lTaskID])
	INCLUDE ([lPurchaseDetailsID]);

	CREATE NONCLUSTERED INDEX [IX_tmpDeal_STAGING_Evo2_CoreReport_V5_lLost_nliCategoryID]
	ON [#tmpDeal_STAGING_Evo2_CoreReport_V5] ([lLost],[nliCategoryID])
	INCLUDE ([lCompanyID],[lSourceID],[lDealSubStatusID]);

	CREATE NONCLUSTERED INDEX [IX_tmpDeal_STAGING_Evo2_CoreReport_V5_nliColorID_dtClosed]
	ON [#tmpDeal_STAGING_Evo2_CoreReport_V5] ([nliColorID],[dtClosed])
	INCLUDE ([lDealID],[lTaskID],[dtCompleted]);

	CREATE NONCLUSTERED INDEX [IX_tmpDeal_STAGING_Evo2_CoreReport_V5_lTaskTypeID]
	ON [#tmpDeal_STAGING_Evo2_CoreReport_V5] ([lTaskTypeID])
	INCLUDE ([lDealID],[lTaskID],[dtCompleted]);

	CREATE NONCLUSTERED INDEX IX_tmpDeal_STAGING_Evo2_CoreReport_V5_lCompanyID_lTaskTypeID
	ON [#tmpDeal_STAGING_Evo2_CoreReport_V5] ([lCompanyID],[lTaskTypeID])
	INCLUDE ([dtDue],[dtCompleted],[dtApptConfirmed],[dtEntry]);

	CREATE NONCLUSTERED INDEX [IX_tmpDeal_STAGING_Evo2_CoreReport_V5_lSold]
	ON [#tmpDeal_STAGING_Evo2_CoreReport_V5] ([lSold])
	INCLUDE ([szNewUsed],[lDealID],[lPurchaseDetailsID],[dtSold]);
	
	CREATE NONCLUSTERED INDEX [IX_tmpDeal_STAGING_Evo2_CoreReport_V5_dtResponseTask]
	ON [#tmpDeal_STAGING_Evo2_CoreReport_V5] ([dtResponseTask])
	INCLUDE ([lDealID],[lCompanyID],[dtCompleted],[lResponseTime]);

	CREATE NONCLUSTERED INDEX [IX_tmpDeal_STAGING_Evo2_CoreReport_V5_lResponseTime]
	ON [#tmpDeal_STAGING_Evo2_CoreReport_V5] ([lResponseTime])
	INCLUDE ([lDealID],[dtResponseTask]);

	CREATE NONCLUSTERED INDEX [IX_tmpDeal_STAGING_Evo2_CoreReport_V5_lSourceID]
	ON [#tmpDeal_STAGING_Evo2_CoreReport_V5] ([lSourceID])

		--Deals with dtProspectIn but not included in the task inserts (Ups without an Up Task)
		INSERT INTO #DealsOfInterest (lCompanyID, lDealID)
		SELECT --*
		C.lCompanyID, d.lDealID
		FROM #Companies c WITH (NOLOCK) 
		INNER JOIN dwFullDeal d WITH (NOLOCK) 
			ON d.lCompanyID = c.lCompanyID 
			AND d.dtProspectIn BETWEEN c.dtStart AND c.dtEnd
			AND d.nliColorID BETWEEN 15 AND 18
			AND d.lSourceID IS NOT NULL
		LEFT JOIN #tmpDeal_STAGING_Evo2_CoreReport_V5 v5 WITH (NOLOCK) 
			ON d.lDealID = v5.lDealID 
			AND d.lCompanyID = v5.lCompanyID
			AND v5.lTaskTypeID IN (8,9,13,21)
		WHERE c.lCompanyID > 0 AND v5.lDealID IS NULL 
			/* 10-30-2019 - Phil Kay - removed nliColorID filter to match to production */
			--AND d.nliColorID != 17

--select lcompanyid, count(*) from #DealsOfInterest group by lcompanyid;
	
----MOD003 Add in deals for acquired vehicles
--			--Get Acquisitions for 'Acquired' metric
--	 Insert into #DealsOfInterest (lCompanyID, lDealID)
--		select d.lcompanyid,d.ldealid
--From #Companies c WITH (NOLOCK) 
--		INNER JOIN dwFullDeal d WITH (NOLOCK) 
--		on d.lCompanyID = c.lCompanyID 
--			AND d.dtClosed between c.dtStart and c.dtEnd
--			AND d.nliColorID between 15 and 18
--			AND d.lSourceID is not null
--	 where d.dtClosed is not null
--	 and d.szDealSubStatus = 'Vehicle Acquired'
----End MOD003 Add in deals for acquired vehicles

--select lcompanyid, count(*) from #DealsOfInterest group by lcompanyid;


--select count(*) from #DealsOfInterest			

	END

--Inactive and Sold needs Closed Deals
if @bSold = 1 or @bInactive = 1
	Begin		
	
		If (@bUps = 0 and @bAppointment = 0) --Didn't Query Tasks So it is possible we still need Deals
			or @ConsiderArchive = 1 --Queried Tasks therefore we already know if we need the Archived Deals or not.
			Insert into #DealsOfInterest (lCompanyID, lDealID)
			select C.lCompanyID, d.lDealID
			From #Companies c WITH (NOLOCK) 
			INNER JOIN dwFullDeal d WITH (NOLOCK) 
				on d.lCompanyID = c.lCompanyID 
				AND d.dtClosed between c.dtStart and c.dtEnd
				AND d.nliColorID in (16,17)
				and d.lSourceID is not null
			left join #tmpDeal_STAGING_Evo2_CoreReport_V5 v5 WITH (NOLOCK) 
				on d.lDealID = v5.lDealID 
				and d.lCompanyID = v5.lCompanyID
			left join #DealsOfInterest doi WITH (NOLOCK) 
				on d.lDealID = doi.lDealID 
			Where c.lCompanyID > 0 
				AND v5.lDealID is null 
				AND doi.lDealID is null

		if @@ROWCOUNT > 0 
			set @ConsiderArchive = 1

		Insert into #DealsOfInterest (lCompanyID, lDealID)
		--select '(Deals of Interest)'
		select C.lCompanyID, d.lDealID
		From #Companies c WITH (NOLOCK) 
		INNER JOIN dwFullDeal d WITH (NOLOCK) 
			on d.lCompanyID = c.lCompanyID 
			AND d.dtClosed between c.dtStart and c.dtEnd
			AND d.nliColorID in (16,17)
			and d.lSourceID is not null
		left join #tmpDeal_STAGING_Evo2_CoreReport_V5 v5 WITH (NOLOCK) 
			on d.lDealID = v5.lDealID 
			and d.lCompanyID = v5.lCompanyID
		left join #DealsOfInterest doi WITH (NOLOCK) 
			on d.lDealID = doi.lDealID 
		Where c.lCompanyID > 0 
			AND v5.lDealID is null 
			AND doi.lDealID is null
				--and d.lPersonID = 35208436
	
		 INSERT INTO #DealsOfInterest (lCompanyID, lDealID)
		SELECT d.lcompanyid,d.ldealid
FROM #Companies c WITH (NOLOCK) 
		INNER JOIN dwFullDeal d WITH (NOLOCK) 
		ON d.lCompanyID = c.lCompanyID 
			AND d.dtClosed BETWEEN c.dtStart AND c.dtEnd
			AND d.nliColorID BETWEEN 15 AND 18
			AND d.lSourceID IS NOT NULL
		LEFT JOIN #tmpDeal_STAGING_Evo2_CoreReport_V5 v5-- MOD012
		ON v5.ldealid = d.ldealid
	 WHERE d.dtClosed IS NOT NULL
	 AND d.szDealSubStatus IN ( 'Vehicle Acquired', 'Bad Lead')  --Added Bad Lead here to get leads into ProcOutput_Sonic 06/29/2023.
	 AND v5.ldealid IS NULL
		--select lcompanyid, count(*) from #DealsOfInterest group by lcompanyid;

	END
--11/13/2020 start edit
	--Insert into TempDealsOfInterest (LocationNbr,lCompanyID, lDealID)
	--Select 'DOI1',lCompanyID,lDealID from #DealsOfInterest
--11/13/2020 end edit
--select * from #DealsOfInterest where ldealid = 225627698

	--Interesting Deals been collected too.  Insert them into #tmpDeal_STAGING_Evo2_CoreReport_V5
	Insert into #tmpDeal_STAGING_Evo2_CoreReport_V5 
	(lCompanyID
	, lChildCompanyID
	, lPersonID
	, lDealID
	, nliColorID
	, lSourceID
	, lDealSubStatusID
	, szLegacyDealID
	, dtClosed
	, dtProspectIN
	, dtEntry
	, szDealSubStatus)
	 --select '(Deals of Interest2)'
	select distinct 
	d.lCompanyID
	, d.lChildCompanyID
	, d.lPersonID
	, d.lDealID
	, d.nliColorID
	, d.lSourceID
	, d.lDealSubStatusID
	, NULL
	, d.dtClosed
	, d.dtProspectIN
	, d.dtEntry
	, d.szDealSubStatus
	From #DealsOfInterest doi
	Inner join dwFullDeal d (NOLOCK) 
		on doi.lDealID = d.lDealID
		and doi.lCompanyID = d.lCompanyID

--select lcompanyid, count(*) from #tmpDeal_STAGING_Evo2_CoreReport_V5 group by lcompanyid;

	Delete v5
	from #tmpDeal_STAGING_Evo2_CoreReport_V5 v5
	left join dwFullCustomer p (NOLOCK) 
		on p.lPersonID = v5.lPersonID
		and p.lCompanyID = v5.lCompanyID
		and p.bActive = 1
	Where p.lPersonID is null
	
	--11/13/2020 start edit DOI2
--	Insert into TempDealsOfInterest (LocationNbr,lCompanyID, lDealID)
--	Select 'DOI2',lCompanyID,lDealID from #tmpDeal_STAGING_Evo2_CoreReport_V5
----11/13/2020 end edit

	delete #tmpDeal_STAGING_Evo2_CoreReport_V5 where lDealID is null

	----deals merged 1/29/2020
	--delete from  #tmpDeal_STAGING_Evo2_CoreReport_V5  where lDealID in (215469184,215472896,215468575,215440302,215469207,215469279,215465135)
	--delete from #tmpDeal_STAGING_Evo2_CoreReport_V5 where lPersonID in (175764761)
 --  	update v5 set lSourceID = 791 from #tmpDeal_STAGING_Evo2_CoreReport_V5 v5 where ldealid in (215470477)
	----deals merged 1/29/2020^^^


-- For All of the Data Collected so far set ChildCompanyID and Curent DealSubStatus  	
	Update #tmpDeal_STAGING_Evo2_CoreReport_V5 
	set lChildCompanyID = dd.lChildCompanyID
	, lDealSubStatusID = dd.lDealSubStatusID
	, szUpType = dd.szUpType
	--Added update of szSubSource here.  DRM 08/10/2020
	, szSubSource = dd.szSubSource
	, szDealSubStatus = dd.szDealSubStatus  --MOD010 -Added update from dwFullDeal of szDealSubStatus
	From dwFullDeal dd WITH (NOLOCK) 
	WHERE dd.lDealID = #tmpDeal_STAGING_Evo2_CoreReport_V5.LDealID 


-- All Rows of interest have been Added, Apply Deletes and updates
	if @lCompanyID != Coalesce(@lChildCompanyID, @lCompanyID)
		Delete #tmpDeal_STAGING_Evo2_CoreReport_V5 where Coalesce(lChildCompanyID, -1) != @lChildCompanyID

	--Add lSourceID to Deals
	update #tmpDeal_STAGING_Evo2_CoreReport_V5 
	set lSourceID = d.lSourceID, nliColorID = d.nliColorID
	from dwFullDeal d WITH (NOLOCK) 
	Where d.lCompanyID = #tmpDeal_STAGING_Evo2_CoreReport_V5.lCompanyID
		and d.lDealID = #tmpDeal_STAGING_Evo2_CoreReport_V5.lDealID
		and d.nliColorID between 15 and 18 --TFS Item 30106 / 30142
		and #tmpDeal_STAGING_Evo2_CoreReport_V5.lSourceID is null

				
	delete #tmpDeal_STAGING_Evo2_CoreReport_V5 where lSourceID is null



	--Set New Used for ALL Deals
	Update #tmpDeal_STAGING_Evo2_CoreReport_V5 
	set szNewUsed = Case when vs.bNewUsed = 1 then 'U' when vs.bNewUsed = 0 then 'N' else @szDefaultNewUsed END, lMakeID = vs.lMakeID
	FROM #tmpDeal_STAGING_Evo2_CoreReport_V5 v5
	CROSS APPLY (
		select top 1 vs.lDealID, vs.bNewUsed, vs.lMakeID, vs.bActive
		from dwFullVehicleSought vs WITH (NOLOCK) 
		where v5.lDealID = vs.lDealID
            And vs.bActive = 1
		order by dtLastEdit desc 
			)  VS

		
	--Updates the New Used for any NULL szNewUsed values 
	UPDATE v5 
		set szNewUsed = @szDefaultNewUsed
	from #tmpDeal_STAGING_Evo2_CoreReport_V5 v5
	where szNewUsed is NULL 


	----set nliCategory, szSource 
	IF @bInternetUpTier = 0
	Begin
		Update #tmpDeal_STAGING_Evo2_CoreReport_V5 set szSource = CASE WHEN s.szSource LIKE '%Custom%Source%' AND ISNULL(cs.szCompanySource,'Custom Source') NOT LIKE '%Custom%Source%' THEN ISNULL(cs.szCompanySource,o.szUpSource) 
																	   WHEN s.szSource LIKE '%Custom%Source%' AND ISNULL(cs.szCompanySource,'Custom Source') LIKE '%Custom%Source%' THEN o.szUpSource
																	   ELSE Coalesce(cs.szCompanySource, s.szSource) END
														, nliCategoryID = s.nliCategoryID
		--Update #tmpDeal_STAGING_Evo2_CoreReport_V5 set szSource = Coalesce(cs.szCompanySource, s.szSource), nliCategoryID = s.nliCategoryID
		From #tmpDeal_STAGING_Evo2_CoreReport_V5 v5 WITH (NOLOCK) 
		Inner join dwFullSource s WITH (NOLOCK) 
			on V5.lSourceID = s.lSourceID
		LEFT JOIN dwFullCompanySource cs WITH (NOLOCK) 
			on cs.lSourceID = s.lSourceID
			and cs.lCompanyID = v5.lcompanyID
		LEFT JOIN (SELECT *
					FROM (
					SELECT DISTINCT lSourceID, szUpSource, lChildCompanyID, ROW_NUMBER() OVER(PARTITION BY lSourceID, lChildCompanyID ORDER BY dtEntry DESC) AS RN
					FROM dwFullOpportunity WITH (NOLOCK)
					where lSourceID IN (SELECT DISTINCT lSourceID FROM eLeadDW.dbo.dwFullSource WITH (NOLOCK) WHERE szSource LIKE '%Custom%Source%') 
						AND szUpSource NOT LIKE '%Custom%Source%'
					)a
					WHERE lChildCompanyID IS NOT NULL
					AND RN = 1
					) o  
			on o.lSourceID = s.lSourceID
			and o.lChildCompanyID = v5.lChildCompanyID
	End
	ELSE
	BEGIN
		--alter table #tmpDeal_STAGING_Evo2_CoreReport_V5 add nliInternetUpTier smallint;

		Update #tmpDeal_STAGING_Evo2_CoreReport_V5 set szSource = CASE WHEN s.szSource LIKE '%Custom%Source%' AND ISNULL(cs.szCompanySource,'Custom Source') NOT LIKE '%Custom%Source%' THEN ISNULL(cs.szCompanySource,o.szUpSource) 
																	   WHEN s.szSource LIKE '%Custom%Source%' AND ISNULL(cs.szCompanySource,'Custom Source') LIKE '%Custom%Source%' THEN o.szUpSource
																	   ELSE Coalesce(cs.szCompanySource, s.szSource) END
														, nliCategoryID = s.nliCategoryID
														, nliInternetUpTier = NULL
		--Update #tmpDeal_STAGING_Evo2_CoreReport_V5 set szSource = Coalesce(cs.szCompanySource, s.szSource), nliCategoryID = s.nliCategoryID, nliInternetUpTier = NULL --Coalesce(cs.nliInternetUpTierID, 3053)
		FROM #tmpDeal_STAGING_Evo2_CoreReport_V5 v5 WITH (NOLOCK) 
		INNER JOIN dwFullSource s WITH (NOLOCK) 
			ON V5.lSourceID = s.lSourceID
		LEFT JOIN dwFullCompanySource cs WITH (NOLOCK) 
			ON cs.lSourceID = s.lSourceID
			AND cs.lCompanyID = v5.lcompanyID
		LEFT JOIN (SELECT *
					FROM (
					SELECT DISTINCT lSourceID, szUpSource, lChildCompanyID, ROW_NUMBER() OVER(PARTITION BY lSourceID, lChildCompanyID ORDER BY dtEntry DESC) AS RN
					FROM dwFullOpportunity WITH (NOLOCK)
					WHERE lSourceID IN (SELECT DISTINCT lSourceID FROM eLeadDW.dbo.dwFullSource WITH (NOLOCK) WHERE szSource LIKE '%Custom%Source%') 
						AND szUpSource NOT LIKE '%Custom%Source%'
					)a
					WHERE lChildCompanyID IS NOT NULL
					AND RN = 1
					) o  
			ON o.lSourceID = s.lSourceID
			AND o.lChildCompanyID = v5.lChildCompanyID
	END


	update #tmpDeal_STAGING_Evo2_CoreReport_V5 set lResponseTime = null where nliCategoryID != 22 and lResponseTime is not null

 --11/1/2017 Testing from here above--(Deals of Interest - Archived Missing All Data)--(Deals of Interest) Prod 3316/ Staging 3490--nliInternetUpTier completely missing from Staging dwtblCompanySource-----------------------------------------------------------------------------------------------------------------



 /*Everything above here is collecting rows.  
select count(*) from #tmpDeal_STAGING_Evo2_CoreReport_V5
 Everything below is updating specific bits for different types of activity.
 
  --DRM 8/26/2020 */

	--Common Values addressed Time to update specific rows  
	IF @bUps = 1
	BEGIN
	--Update First Up Task with dtProspectIn
		Update #tmpDeal_STAGING_Evo2_CoreReport_V5 set dtProspectIn = d.dtProspectIn
		From (
			Select UpTask = Row_Number() over (Partition by v5.lDealID order by Abs(DateDiff(dd, d.dtProspectIn, v5.dtCompleted)), lTaskTypeID desc)
				, v5.lDealID, v5.lTaskID, d.dtProspectIn
			from #tmpDeal_STAGING_Evo2_CoreReport_V5 v5 WITH(NOLOCK) 
			inner join #Companies c WITH(NOLOCK) on c.lCompanyID = v5.lCompanyID
			Inner join dwFullDeal d WITH(NOLOCK) 
				on d.lDealID = v5.lDealID
				and d.lCompanyID = v5.lCompanyID
				AND d.dtProspectIn between c.dtStart and c.dtEnd
				AND d.nliColorID between 15 and 18
			Where 
				Coalesce(v5.lTaskTypeID, 8) in (8,9,13,21)
				and Coalesce(v5.dtCompleted, d.dtProspectIn) between c.dtStart and c.dtEnd
			) d
		Where d.UpTask = 1
			and #tmpDeal_STAGING_Evo2_CoreReport_V5.lTaskID = d.lTaskID

					
		Update d set lUp = 1
		From #tmpDeal_STAGING_Evo2_CoreReport_V5 d (NOLOCK)
		inner join #Companies c WITH (NOLOCK)
			on c.lCompanyID = d.lCompanyID
			and d.dtProspectIn between c.dtStart and c.dtEnd
 
 	--11/13/2020 start edit DOI2
--	Insert into TempDealsOfInterest (LocationNbr,lCompanyID, lDealID)
--	Select 'DOI3 - Ups',lCompanyID,lDealID from #tmpDeal_STAGING_Evo2_CoreReport_V5
----11/13/2020 end edit

	--Set Visit Info for Showroom Type Tasks
	    UPDATE v5 SET lVisit = 1, dtIn = dv.dtIN
		--select * 
		FROM dwFullDesklogVisit dv WITH (NOLOCK) 
		INNER JOIN #tmpDeal_STAGING_Evo2_CoreReport_V5 v5 
			ON dv.lTaskID = v5.lTaskID
			AND dv.lCompanyID = v5.lChildCompanyID
			AND v5.lTaskTypeID IN (7,8,31)
			AND dv.lScratch != 1
		INNER JOIN #Companies c
			ON dv.dtIn BETWEEN c.dtStart AND c.dtEnd  -- from CDK original logic
			/* 10-30-2019 - Phil Kay - Added to match production procedure */
			--and dv.dtIn between @dtStart and @dtEnd --testing this...  DM 20230324
			--and v5.dtCompleted between @dtStart and @dtEnd -- Brian J - Appointments might be entered but not completed during the date range assuming.

			
/*BeBacks logic for Start Date over 45 days ago*/
IF @dtstart < @ArchiveMaxDate AND (@MonthDiff > 1 OR @LastDayOfMonth = CONVERT(DATE,GETDATE()))	
	BEGIN
	--Set BeBack for Any Visit which had a previous visit.
		Update v5 set lBeBack = 1--, lVisit = 0 --<<<--Added lVisit = 0 to match current TMR Logic
		From #tmpDeal_STAGING_Evo2_CoreReport_V5 v5 WITH (NOLOCK) 
		Inner join dwFullActivity t WITH (NOLOCK) 
			on v5.lPersonID = t.lCustomerID
			and t.lDealID = v5.lDealID
			and t.lCompanyID = v5.lCompanyID
			and t.lTaskTypeID in (7,8,31)
			and t.dtCompleted < v5.dtIN
		Inner join dwFullDesklogVisit dv WITH (NOLOCK) 
			on dv.lCompanyID = v5.lChildCompanyID
			and dv.lTaskID = t.lTaskID
			and dv.dtIn < v5.dtIn 
		--INNER JOIN dbo.dwFullOpportunity o
		--	ON o.lDealID = t.lDealID
		WHERE v5.lVisit = 1
		--AND 
		--		(			/*5/30/2025:  DMD - Added for Archived Records > 45 days old*/								
		--			(COALESCE(t.dtClosed,t.dtCompleted) < @ArchiveMaxDate 											/*1. The task has a dtCompleted or dtClosed date older than 60 days*/
		--				OR COALESCE(t.dtClosed,t.dtCompleted) > DATEADD(DAY,-60,CONVERT(DATE,GETDATE())))
		--			OR o.nliColorID NOT IN (16,17)																	/*2. The deal the task belongs to is currently in a Sold or Inactive status*/
		--			OR (t.dtEntry < @ArchiveMaxDate  																/*3. The task has a dtEntry date older than 30 days*/
		--				OR t.dtEntry > DATEADD(DAY,-30,CONVERT(DATE,GETDATE())))
		--		)
	END

/*BeBacks logic for Start Date under 45 days ago*/
ELSE
--IF @dtstart >= @ArchiveMaxDate	
	BEGIN
	--Set BeBack for Any Visit which had a previous visit.
		Update v5 set lBeBack = 1--, lVisit = 0 --<<<--Added lVisit = 0 to match current TMR Logic
		From #tmpDeal_STAGING_Evo2_CoreReport_V5 v5 WITH (NOLOCK) 
		Inner join dwFullActivity t WITH (NOLOCK) 
			on v5.lPersonID = t.lCustomerID
			and t.lDealID = v5.lDealID
			and t.lCompanyID = v5.lCompanyID
			and t.lTaskTypeID in (7,8,31)
			and t.dtCompleted < v5.dtIN
		Inner join dwFullDesklogVisit dv WITH (NOLOCK) 
			on dv.lCompanyID = v5.lChildCompanyID
			and dv.lTaskID = t.lTaskID
			and dv.dtIn < v5.dtIn 
		INNER JOIN dbo.dwFullOpportunity o
			ON o.lDealID = t.lDealID
		WHERE v5.lVisit = 1
		AND 
				(			/*5/30/2025:  DMD - Added for Archived Records < 45 Days old*/								
					COALESCE(t.dtClosed,t.dtCompleted) > DATEADD(DAY,-60,CONVERT(DATE,GETDATE()))					/*1. The task has a dtCompleted or dtClosed date older than 60 days*/
					OR (o.nliColorID NOT IN (16,17))																/*2. The deal the task belongs to is currently in a Sold or Inactive status*/
					OR t.dtEntry > DATEADD(DAY,-30,CONVERT(DATE,GETDATE()))											/*3. The task has a dtEntry date older than 30 days*/
				)
				
	END
		
	
	
	--Response Times for Internet leads Response Times are dependent upon retreiving the Ups above
		IF @bResponseTime = 1
		BEGIN
		
			Update #tmpDeal_STAGING_Evo2_CoreReport_V5 set dtResponseTask = null, lResponseTime = 1--, dtCompleted = me.dtEntry /* 10-1-2020 - PK - Sync to production */
			From dwFullMessages me WITH (NOLOCK) 
			Where 1=1 --me.lCompanyID = #tmpDeal_STAGING_Evo2_CoreReport_V5.lCompanyID
				AND #tmpDeal_STAGING_Evo2_CoreReport_V5.lTaskID = me.lTaskID
				AND #tmpDeal_STAGING_Evo2_CoreReport_V5.lUp = 1
				AND #tmpDeal_STAGING_Evo2_CoreReport_V5.lTaskTypeID = 13

			Create Table #tmpResponses (lCompanyID int, lDealID int, lTaskID bigint, dtResponseTask datetime, lResponse int); /* 10-1-2020 - PK - Sync to production */

			insert into #tmpResponses
			select d.lCompanyID, d.lDealID, t.lTaskID, dtResponseTask = t.dtCompleted, lResponse = 0 --lResponse = Row_Number() over (Partition by d.lDealID order by t.dtCompleted asc) /* 10-1-2020 - PK - Sync to production */
			From #tmpDeal_STAGING_Evo2_CoreReport_V5 d WITH (NOLOCK) 
			INNER JOIN dwFullActivity t WITH (NOLOCK) 
				ON t.lCompanyID = d.lCompanyID
				AND d.lDealID = t.lDealID
				and t.lCustomerID = d.lPersonID	
				AND d.lResponseTime = 1
				AND t.dtCompleted > d.dtCompleted
				and t.dtClosed is null
				AND t.lTaskTypeID IN (2,3,7,14,41);

			/* 10-1-2020 - PK - Sync to production */
            Update #tmpResponses set lResponse = calc.lResponse
            FROM (
                select lTaskID, lResponse = Row_Number() over (Partition by lDealID order by dtResponseTask asc)
                from #tmpResponses
            ) calc
            where calc.lTaskID = #tmpResponses.lTaskID

			
			Create Clustered Index idxResponseCompanyDeal on #tmpResponses (lCompanyID, lDealID);

			CREATE NONCLUSTERED INDEX [IX_tmpResponses_lDealId_lResponse]
			ON [#tmpResponses] ([lDealID],[lResponse])
			INCLUDE ([dtResponseTask]);

			CREATE NONCLUSTERED INDEX [IX_tmpResponses_lResponse]
			ON [#tmpResponses] ([lResponse])
			INCLUDE ([dtResponseTask]);

			Update #tmpDeal_STAGING_Evo2_CoreReport_V5 set dtResponseTask = r.dtResponseTask			
			from #tmpResponses r  WITH (NOLOCK) 
			Where r.lDealID = #tmpDeal_STAGING_Evo2_CoreReport_V5.lDealID
				and r.lResponse = 1
				and #tmpDeal_STAGING_Evo2_CoreReport_V5.lResponseTime = 1

			if (Object_ID('tempdb..#ResponseHours') is not null) drop TABLE #ResponseHours
			CREATE TABLE #ResponseHours (ID int not null identity(1,1) primary key, lCompanyID int, ResponseDay datetime, StartTime datetime, EndTime datetime)

			; WITH E1(N) AS (
					 SELECT 1 UNION ALL SELECT 1 UNION ALL SELECT 1 UNION ALL 
					 SELECT 1 UNION ALL SELECT 1 UNION ALL SELECT 1 UNION ALL 
					 SELECT 1 UNION ALL SELECT 1 UNION ALL SELECT 1 UNION ALL SELECT 1
					),                          --10E+1 or 10 rows
		   E2(N) AS (SELECT 1 FROM E1 a, E1 b),  --10E+2 or 100 rows,
		   E4(N) AS (SELECT 1 FROM E2 a, E2 b),  --10E+4 or 10,000 rows,
		   Tally(N) AS (
					 SELECT TOP (DATEDIFF(dd,@dtStart, GETDATE() + 1) + 1) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) - 2 FROM E4)
				 
			INSERT INTO #ResponseHours (lCompanyID, ResponseDay, StartTime, EndTime)
			SELECT c.lCompanyID, ResponseDay = DATEADD(dd,n, @dtStart), 
				--Adjusted to use Pre-Calculated OffSet.  TFS Item 39808
				StartTime = DATEADD(HOUR, nLocalTimeConversion, DATEADD(MINUTE, DATEPART(MINUTE, COALESCE(dtStartTime, '1/1/1900 00:00')), DATEADD(HOUR, DATEPART(HOUR, COALESCE(dtStartTime, '1/1/1900 00:00')), DATEADD(dd,n, @dtStart)))),
				EndTime = DATEADD(HOUR, nLocalTimeConversion, DATEADD(MINUTE, DATEPART(MINUTE, COALESCE(dtEndTime, '1/1/1900 23:59:59')), DATEADD(HOUR, DATEPART(HOUR, COALESCE(dtEndTime, '1/1/1900 23:59:59')), DATEADD(dd,n, @dtStart))))
			FROM Tally t
			INNER JOIN #Companies c ON 1 = 1
			LEFT JOIN dwFullCompanyOption co WITH (NOLOCK) ON c.lCompanyID = co.lCompanyID AND co.lAppConfigID = 7
			LEFT JOIN dwFullSchedule S WITH (NOLOCK) 
				ON s.lCompanyID = c.lCompanyID
				AND DATEPART(WEEKDAY, DATEADD(dd,n, @dtStart)) = cDayOn
				AND s.lDepartmentID = co.lDepartmentID
			LEFT JOIN dwFullHoliday h WITH (NOLOCK) 
				ON h.lCompanyID = c.lCompanyID
				AND DATEDIFF(dd,DATEADD(dd,n, @dtStart), h.dtDate) = 0
			WHERE h.lHolidayID IS NULL
				AND DATEADD(dd,n, @dtStart) >= c.dtStart - 1
				AND DATEADD(dd,n, @dtStart) <= GETDATE() + 1

			DELETE #ResponseHours WHERE ResponseDay = StartTime AND EndTime = CAST(CONVERT(VARCHAR, ResponseDay, 101) + ' 23:59:00.000' AS DATETIME) AND lCompanyID IN (SELECT lCompanyID FROM #ResponseHours WHERE  ResponseDay != StartTime)

			UPDATE rt SET 
				lResponseTime = Response.lmins
			FROM #tmpDeal_STAGING_Evo2_CoreReport_V5 rt
			INNER JOIN ( SELECT lDealID, 
				lMins = SUM(DATEDIFF(MINUTE, 
					CASE 
						WHEN dtCompleted < StartTime THEN StartTime
						WHEN dtCompleted >= StartTime AND dtCompleted < EndTime THEN dtCompleted
						ELSE EndTime END, 
					CASE 
						WHEN dtResponseTask < StartTime THEN StartTime
						WHEN dtResponseTask >= StartTime AND dtResponseTask < EndTime THEN dtResponseTask
						ELSE EndTime END))  
			FROM #tmpDeal_STAGING_Evo2_CoreReport_V5 d
			LEFT JOIN #ResponseHours h
				ON h.lCompanyID = d.lCompanyID
				AND h.StartTime < h.EndTime
				AND (
					CONVERT(VARCHAR, h.ResponseDay, 101) = CONVERT(VARCHAR,d.dtCompleted, 101) 
					OR CONVERT(VARCHAR, h.ResponseDay, 101) = CONVERT(VARCHAR,d.dtResponseTask, 101) 
					OR h.ResponseDay BETWEEN d.dtCompleted AND d.dtResponseTask
					OR d.dtCompleted BETWEEN StartTime AND EndTime
					OR d.dtResponseTask BETWEEN StartTime AND EndTime
					)
			WHERE dtResponseTask IS NOT NULL
			GROUP BY lDealID) response
			ON rt.lDealiD = response.lDealID
			WHERE dtResponseTask IS NOT NULL
				AND response.lMins > 1
		
			UPDATE #tmpDeal_STAGING_Evo2_CoreReport_V5 SET lResponseTime = 1 WHERE lResponseTime <= 0
					
		END
	
	END	

	if @bSold = 1
	BEGIN
		UPDATE #tmpDeal_STAGING_Evo2_CoreReport_V5 set dtSold = pd.dtSold, curFront = pd.curFrontGross, curBack = pd.curBackGross, curTotal = pd.curTotalGross, lSold = CASE WHEN ISNULL(pd.CRMSold,0) = 0 AND pd.lDealSubStatusID = 7 THEN 0 ELSE 1 END, szNewUsed = pd.szNewUsed, lMakeID = pd.lMakeID, lPurchaseDetailsID = pd.lPurchaseDetailsID
		From (
			Select v5.lTaskID, v5.lDealID, pd.dtSold, pd.curFrontGross, pd.curBackGross, pd.curTotalGross, pd.szNewUsed, v.lMakeID, pd.lPurchaseDetailsID, 
				SoldRow = row_number() over (partition by v5.lDealID order by Abs(DateDiff(dd, pd.dtSold, Coalesce(v5.dtCompleted, v5.dtClosed))), lVisit Desc, v5.lTaskID desc)
				, lDealSubStatusID = Case when nliDataSourceID = 172 then 8 WHEN pd.nliDataSourceID = 171 AND ISNULL(c.CRMSold,0) = 1 THEN 7 else lDealSubStatusID end -- Added to standardize DMS Sold to lDealSubStatusID 8 to better support CRM + DMS Sold Reporting when bIgnoreDMSSold bit is passed.
				, CRMSold = ISNULL(c.CRMSold,0)
			From #tmpDeal_STAGING_Evo2_CoreReport_V5 v5 WITH(NOLOCK) 
			INNER JOIN #Companies c ON COALESCE(v5.lCompanyID,v5.lChildCompanyID) = c.lCompanyID
			Inner join dwFullPurchaseDetails pd WITH (NOLOCK) on pd.lDealID = v5.lDealID
			Left join dwFullVehicle v WITH(NOLOCK) on pd.lVehicleID = v.lVehicleID
			Where v5.nliColorID = 16
				and (v5.lTaskID is null or v5.dtCompleted is not null)
				and pd.dtSold between @dtStart and @dtEnd 
				and (
						(@bIgnoreShowDMSSoldOnly = 0 or nliDataSourceID = 172)
						OR (nliDataSourceID = 171 AND ISNULL(c.CRMSold,0) = 1)		------ Added for Powersports 04/28/2025
					)
				--and v5.sznewused = 'n'
				) pd
		WHERE pd.SoldRow = 1
			AND #tmpDeal_STAGING_Evo2_CoreReport_V5.lDealID = pd.lDealID
			AND COALESCE(#tmpDeal_STAGING_Evo2_CoreReport_V5.lTaskID, #tmpDeal_STAGING_Evo2_CoreReport_V5.lDealID * -1) = COALESCE(pd.lTaskID, pd.lDealID * -1)

	--MOD013 --Update lacquired for acquired vehicles without an appointment.

    --         UPDATE v5 
    --         set lAcquired = 1
			 --,dtclosed = fd.dtclosed
	
    --                From #tmpDeal_STAGING_Evo2_CoreReport_V5 v5 WITH(NOLOCK) 
				--	Inner join dwFullDeal fd
				--	on fd.lDealID = v5.lDealID
    --                Inner join dwFullDesklogVisit dv WITH (NOLOCK) 
				--	on dv.lDealID = v5.lDealID
				--	and dv.lTaskID = v5.lTaskID
				--	Left Join #tmpDeal_STAGING_Evo2_CoreReport_V5 aa --acquisition appts 
				--	on aa.ldealid = v5.ldealid
				--	and aa.lTaskTypeID = 65
    --                Where v5.nliColorID = 17
    --                  --     and (v5.lTaskID is null or (v5.dtCompleted is not null)) -- and v5.lTaskTypeID in (7,65)))
    --                       and fd.dtClosed between @dtStart and @dtEnd 
    --                --     and convert(date,fd.dtclosed) = convert(date,v5.dtcompleted)
    --                       and fd.szDealSubStatus = 'Vehicle Acquired'--fd.lDealSubStatusID = 52072956
				--		   and aa.lTaskID is null --(v5.lTaskTypeID <> 65 or v5.lTaskTypeID is null)  -- Testing this with or ltasktypeid is null added. 08102023 DRM
          
		  --This section updates lacquired for acquired vehicles where there is no lup=1 record.  Appointments that result in acquired.
		      UPDATE #tmpDeal_STAGING_Evo2_CoreReport_V5 
             SET lAcquired = 1
			 ,dtclosed = pd.dtclosed

             FROM (
                    SELECT v5.lTaskID, v5.lDealID, fd.dtClosed,
                           --AcqRow = row_number() over (partition by v5.lDealID order by Abs(DateDiff(dd, fd.dtClosed, v5.dtClosed)), lVisit Desc, v5.ltasktypeid desc, v5.lTaskID desc)
                           AcqRow = ROW_NUMBER() OVER (PARTITION BY v5.lDealID ORDER BY v5.ltaskid DESC) -- v5.lapptshown, v5.lVisit, v5.ltasktypeid desc, v5.lTaskID desc) -- Testing taking out the order by on apptshown,lvisit,ltasktypeid. 08102023 DRM
                           ,fd.lDealSubStatusID  -- Added to standardize DMS Sold to lDealSubStatusID 8 to better support CRM + DMS Sold Reporting when bIgnoreDMSSold bit is passed.
                    FROM #tmpDeal_STAGING_Evo2_CoreReport_V5 v5 WITH(NOLOCK) 
                    INNER JOIN dwFullDeal fd WITH (NOLOCK) ON fd.lDealID = v5.lDealID
					LEFT JOIN #tmpDeal_STAGING_Evo2_CoreReport_V5 ups
					ON ups.ldealid = v5.ldealid
					AND ups.lAcquired = 1
                    WHERE v5.nliColorID = 17
                        --   and (v5.lTaskID is null or (v5.dtCompleted is not null)) -- and v5.lTaskTypeID in (7,65)))
                           AND fd.dtClosed BETWEEN @dtStart AND @dtEnd 
                    --     and convert(date,fd.dtclosed) = convert(date,v5.dtcompleted)
                           AND fd.szDealSubStatus = 'Vehicle Acquired'--fd.lDealSubStatusID = 52072956
						--   and v5.lTaskTypeID = 65
						--   and ups.ldealid is null
                           --and v5.sznewused = 'n'
                           ) pd
             WHERE AcqRow = 1
                    AND #tmpDeal_STAGING_Evo2_CoreReport_V5.lDealID = pd.lDealID
					--and #tmpDeal_STAGING_Evo2_CoreReport_V5.ltasktypeid = 65
                    AND COALESCE(#tmpDeal_STAGING_Evo2_CoreReport_V5.lTaskID, #tmpDeal_STAGING_Evo2_CoreReport_V5.lDealID) = COALESCE(pd.lTaskID, pd.lDealID)




--MOD003 Add in deals for acquired vehicles
			--Get Acquisitions for 'Acquired' metric
/*  -- This section was commented out to move it up with the other inserts into #DealsOfInterest
	 Insert into #DealsOfInterest (lCompanyID, lDealID)
		select d.lcompanyid,d.ldealid
From #Companies c WITH (NOLOCK) 
		INNER JOIN dwFullDeal d WITH (NOLOCK) 
		on d.lCompanyID = c.lCompanyID 
			AND d.dtClosed between c.dtStart and c.dtEnd
			AND d.nliColorID between 15 and 18
			AND d.lSourceID is not null
		LEFT JOIN #tmpDeal_STAGING_Evo2_CoreReport_V5 v5-- MOD012
		on v5.ldealid = d.ldealid
	 where d.dtClosed is not null
	 and d.szDealSubStatus in ( 'Vehicle Acquired', 'Bad Lead')  --Added Bad Lead here to get leads into ProcOutput_Sonic 06/29/2023.
	 and v5.ldealid is null

*/	 
--End MOD003 Add in deals for acquired vehicles




		UPDATE V5 SET szNewUsed = d.szNewUsed
		--select d.szNewUsed, v5.szNewUsed,* 
		FROM #tmpDeal_STAGING_Evo2_CoreReport_V5 v5
		INNER JOIN #tmpDeal_STAGING_Evo2_CoreReport_V5 d
			ON d.lSold = 1
			AND d.lDealID = V5.lDealID
			AND d.szNewUsed != v5.szNewUsed

	END

	/*Added Logic to handle DMS Sold Only Output ---Adjusted Logic to handle CRM Sold for Powersports on 4/28/2025*/
	IF @bIgnoreShowDMSSoldOnly = 0 
	UPDATE v5 set lSold = 0 from #tmpDeal_STAGING_Evo2_CoreReport_V5 v5 INNER JOIN #Companies c ON COALESCE(v5.lChildCompanyID,v5.lCompanyID) = c.lCompanyID where lSold = 1 and lDealSubStatusID != 8 and CRMSold = 0

		
	-- New Used has now been set from Vehicle Sought, then Updated from PurchaseDetails, Everything else Assumes Store Default
	Update #tmpDeal_STAGING_Evo2_CoreReport_V5 set szNewUsed = @szDefaultNewUsed where Coalesce(szNewUsed, '?') not in ('N', 'U')

	if @bAppointment = 1
	BEGIN
	 
		UPDATE #tmpDeal_STAGING_Evo2_CoreReport_V5 
		set dtApptConfirmed = COALESCE(tr.dtCompleted, tr.dtEntry), 
			lApptConfirmedByID = tr.lCompletedByID
		From dbo.dwFullTaskReminder tr WITH (NOLOCK)
		Where #tmpDeal_STAGING_Evo2_CoreReport_V5.lTaskID = tr.lTaskID
		and tr.lCompanyID = #tmpDeal_STAGING_Evo2_CoreReport_V5.lCompanyID
		and tr.nliOutcomeId = 1; 

	--MOD005 Update to mark the date confirmed for confirmed appointments Per logic in SonicAppointmentActivity Report.
		--UPDATE v5 set dtApptConfirmed = COALESCE(tr.dtEntry,tr.dtCompleted), lApptConfirmedByID = tr.lCompletedByID												
		--UPDATE v5 set dtApptConfirmed = DateAdd(hh,nLocalTimeConversion *-1,COALESCE(tr.dtEntry,tr.dtCompleted)), lApptConfirmedByID = tr.lCompletedByID		 		
		UPDATE v5 set dtApptConfirmed = IIF(DATEDIFF(HOUR, dtApptConfirmed, dtApptConfirmed AT TIME ZONE 'Central Standard Time' AT TIME ZONE 'UTC') = nLocalTimeConversion *-1  --5  EP Phoenix fix to use nLocalTimeConversion *-1 w/o DST
																			AND fc.bHasDaylightSavingTime = 0,
														DATEADD(HOUR, -1, (DATEADD(HOUR, nLocalTimeConversion *-1, dtApptConfirmed))),
														DATEADD(HOUR, nLocalTimeConversion *-1, dtApptConfirmed)), lApptConfirmedByID = tr.lCompletedByID
		From dwFullTaskReminder tr WITH (NOLOCK) 
		join #tmpDeal_STAGING_Evo2_CoreReport_V5 v5 
		   on v5.lTaskID = tr.lTaskID
			join #Companies co
		   on CASE 
				WHEN v5.lChildCompanyID <> co.lCompanyID 
				THEN v5.lCompanyID ELSE v5.lChildCompanyID END = co.lCompanyID			-----------------**********UPDATED 09/25/2023 by Derrick for dealers with different lCompanyID and lChildCompanyID
		LEFT JOIN dbo.dwFullCompany fc
			ON co.lCompanyID = fc.lCompanyID
			--and tr.lCompanyID = v5.lCompanyID
			--and dtdue between co.dtStart and co.dtEnd
			and v5.dtApptConfirmed IS NOT NULL;
	--End MOD005 


	--MOD006 - Add tasktype 65 to updates for appt created/due/shown/confirmed counts.  Also Added updated date logic per Jen Mullin's requirements and logic confirmed by SonicAppointmentActivity report.
		UPDATE v5 SET 
			lApptCreated = CASE WHEN lTaskTypeID IN (7,65) AND dtEntry BETWEEN co.dtStart AND co.dtEnd THEN 1 ELSE 0 END, 
			lApptDue = CASE WHEN lTaskTypeID IN (7,65) AND dtDue BETWEEN @dtStart AND @dtEnd THEN 1 ELSE 0 END,   --Updated 09/14/2023 DRM.  To use date params vs. co.dtstart and co.dtend in between statement.
			--lApptShown = CASE WHEN lTaskTypeID IN (7,65) AND dtCompleted BETWEEN co.dtStart AND co.dtEnd THEN 1 ELSE 0 END,			----DMD Commented out to use separate update statement to use dtCompleted instead of dtDue
			--lApptConfirmed = Case when lTaskTypeID = 7 and dtApptConfirmed between co.dtStart and co.dtEnd and dtApptConfirmed <= Coalesce(dtCompleted, dtDue) then 1 else 0 end		----1b
			--lApptConfirmed =   Case WHEN lTaskTypeID = 7 and ( convert(date,v5.[dtApptConfirmed])  >= 
			--					case when datename(dw,dtdue) = 'Monday' and datename(dw,v5.dtApptConfirmed) = 'Saturday'
			--					then dateadd(dd,-2,convert(date,convert(date,dtdue)))
			--					else dateadd(dd,-1,convert(date,convert(date,dtdue))) end
			--				and v5.[dtApptConfirmed]  <= Coalesce(dtCompleted, dtDue)) then 1 else 0 END			----2b
			lApptConfirmed = (CASE 
								--if dtDue has a midnight timestamp, credit a confirmation later that same day
							WHEN DATEPART(HOUR, dtDue) = 0 
								AND DATEPART(MINUTE, dtDue) = 0 
								AND dtApptConfirmed BETWEEN IIF(DATEPART(WEEKDAY, dtDue) = 2, DATEADD(DAY,-2,CAST(dtDue AS DATE)), DATEADD(DAY,-1,CAST(dtDue AS DATE))) AND DATEADD(SECOND, -1, DATEADD(DAY, 1, dtDue)) 
									THEN 1
							WHEN dtApptConfirmed BETWEEN IIF(DATEPART(WEEKDAY, dtDue) = 2, DATEADD(DAY,-2,CAST(dtDue AS DATE)), DATEADD(DAY,-1,CAST(dtDue AS DATE))) AND dtDue 
								THEN 1
							ELSE 0 END)
	FROM #tmpDeal_STAGING_Evo2_CoreReport_V5 v5
	JOIN #Companies co
	ON co.lCompanyID = v5.lCompanyID
	--CASE WHEN v5.lChildCompanyID <> co.lCompanyID THEN v5.lCompanyID ELSE v5.lChildCompanyID END = co.lCompanyID				-----------------**********UPDATED 09/25/2023 by Derrick for dealers with different lCompanyID and lChildCompanyID
			WHERE lTaskTypeID IN(7,65)
			AND v5.dtDue BETWEEN @dtStart AND @dtEnd; 

		--	and co.lCompanyID = v5.lCompanyID
		--	and dtdue between co.dtStart and co.dtEnd  --Removed the time conversion here.  8/10/2023 DRM  Updated to use the start and end times from #Companies.  
	
	-----------------DMD:  Added separate update for ApptShown to be considered based on dtCompleted and not dtDue in above query
		UPDATE v5 SET 
			lApptShown = CASE WHEN lTaskTypeID IN (7,65) AND dtCompleted BETWEEN co.dtStart AND co.dtEnd THEN 1 ELSE 0 END
	FROM #tmpDeal_STAGING_Evo2_CoreReport_V5 v5
	JOIN #Companies co
	ON co.lCompanyID = v5.lCompanyID
	--CASE WHEN v5.lChildCompanyID <> co.lCompanyID THEN v5.lCompanyID ELSE v5.lChildCompanyID END = co.lCompanyID				-----------------**********UPDATED 09/25/2023 by Derrick for dealers with different lCompanyID and lChildCompanyID
			WHERE lTaskTypeID IN(7,65)
			AND v5.dtCompleted BETWEEN co.dtStart AND co.dtEnd; 

	--End MOD006
	--set lApptIsAppraisal
	
	--MOD007 - update flag for appraisal appointments
	UPDATE v5 SET lApptIsAppriasal = 1
	FROM #tmpDeal_STAGING_Evo2_CoreReport_V5 v5 	
	WHERE lTaskTypeID = 65
	--End MOD007 - update flag for appraisal appointments
			
			--Case when lTaskTypeID = 7 and dtDue between c.dtStart and c.dtEnd and dtApptConfirmed <= Coalesce(dtCompleted, dtDue) then 1 else 0 end  --Updated to include current month apptDue and priormonth confirmation date.
	

		--MOD014 Update dtAttemptedConfirmed and dtAttemptedConfirmed.  20230915 - moved to after confirmed query.   And updated 

	UPDATE v5
SET lapptAttemptedConfirmed = 1
,dtAttemptedConfirmed = att.dtDate

FROM (	select	cu.szlastname,
				cu.szfirstname,
				appt.dtDue,
				appt.lApptConfirmed, 
				ti.lTaskItemID,
                ti.lTaskID,
                ti.lDealID,
                ti.lCompanyID,
                ti.nliListID,
                ti.nliListItemID,
                ti.szListItem,
                --ti.dtDate,
				IIF(DATEDIFF(HOUR, ti.dtDate, ti.dtDate AT TIME ZONE 'Central Standard Time' AT TIME ZONE 'UTC') = c.nLocalTimeConversion *-1  --5  EP Phoenix fix to use nLocalTimeConversion *-1 w/o DST
						AND fc.bHasDaylightSavingTime = 0,
					DATEADD(HOUR, -1, (DATEADD(HOUR, c.nLocalTimeConversion *-1, ti.dtDate))),
					DATEADD(HOUR, c.nLocalTimeConversion *-1, ti.dtDate)) AS dtDate,
                ti.lItem,
                ti.szItem,
                ti.dwActive,
                ti.ETLExecution_ID,
				ROW_NUMBER() over (partition by appt.ltaskID order by Abs(DateDiff(dd, ti.dtdate,appt.DtDue))) as Rowid
	FROM #tmpDeal_STAGING_Evo2_CoreReport_V5 appt
	--Left join  conf
	--on att.lTaskID = conf.lTaskID
	--and appt.lApptConfirmed = 1
	JOIN dwfullactivity a
		   ON a.lTaskID = appt.lTaskID 
	JOIN dwfulltaskitem ti
	ON a.ltaskid = ti.lTaskID
	JOIN dwFullOpportunity o
	ON o.ldealid = a.ldealid
	JOIN dwFullCustomer cu
	ON o.lpersonid = cu.lpersonid
	LEFT JOIN #tmpDeal_STAGING_Evo2_CoreReport_V5 conf
	ON conf.ltaskid = appt.ltaskid
	AND conf.lApptConfirmed = 1
	--left join dwFullTaskReminder tr
	--on tr.lTaskID = a.lTaskID
	LEFT JOIN #Companies c
	on appt.lCompanyID = c.lCompanyID
	LEFT JOIN dbo.dwFullCompany fc
		ON c.lCompanyID = fc.lCompanyID
	WHERE a.lTaskTypeID= 7
	AND ti.nliListID = 175
	AND ti.nlilistitemid NOT IN (2621,7813)
	--and convert(date,ti.[dtdate])  >= 
	--	case when datename(dw,appt.dtdue) = 'Monday' and datename(dw,ti.[dtdate]) = 'Saturday'
	--	then dateadd(dd,-2,convert(date,convert(date,appt.dtdue)))
	--	else dateadd(dd,-1,convert(date,convert(date,appt.dtdue))) end
	AND IIF(DATEDIFF(HOUR, ti.dtDate, ti.dtDate AT TIME ZONE 'Central Standard Time' AT TIME ZONE 'UTC') = c.nLocalTimeConversion *-1  --5  EP Phoenix fix to use nLocalTimeConversion *-1 w/o DST
									AND fc.bHasDaylightSavingTime = 0,
								DATEADD(HOUR, -1, (DATEADD(HOUR, c.nLocalTimeConversion *-1, ti.dtDate))),
								DATEADD(HOUR, c.nLocalTimeConversion *-1, ti.dtDate)) BETWEEN CASE 
																WHEN DATEPART(WEEKDAY,a.dtDue) = 2 THEN DATEADD(DAY,-2,CAST(a.dtDue AS DATE)) 
																ELSE DATEADD(DAY,-1,CAST(a.dtDue AS DATE)) END 
														AND CASE	--if due date is midnight, credit an attempt of the same day
																WHEN DATEPART(HOUR, a.dtDue) = 0 AND DATEPART(MINUTE, a.dtDue) = 0 THEN DATEADD(SECOND, -1, DATEADD(DAY, 1, a.dtDue))
																ELSE a.dtDue END
	--and ti.[dtdate]  <= appt.dtdue
	AND appt.dtdue BETWEEN @dtStart AND @dtEnd
	AND conf.ltaskid IS NULL
	) att
	JOIN #tmpDeal_STAGING_Evo2_CoreReport_V5 v5
	ON att.lTaskID = v5.ltaskid
	WHERE att.Rowid = 1 

	--END MOD014

		UPDATE #tmpDeal_STAGING_Evo2_CoreReport_V5 
		set lApptSold = 1
		, lPurchaseDetailsID = apptSold.lPurchaseDetailsID
		From (
			Select appt.lTaskID
			, sold.lPurchaseDetailsID
			, ApptSold = Row_Number() over (partition by sold.lDealID order by Abs(DateDiff(dd, appt.dtCompleted, sold.dtSold)))
			From #tmpDeal_STAGING_Evo2_CoreReport_V5 sold WITH (NOLOCK) 
			inner join #tmpDeal_STAGING_Evo2_CoreReport_V5 appt WITH (NOLOCK) 
				on appt.lDealID = sold.lDealID 
				and (DATEDIFF(dd, appt.dtCompleted, sold.dtSold) = 0 
						OR (appt.lChildCompanyID = 18467 AND (DATEDIFF(dd, appt.dtCompleted, sold.dtSold) BETWEEN 0 AND 7))		---- 4/7/2025:  DMD - Added for Sun Chevrolet ApptSold Fix
					) 
				and appt.lTaskTypeID in (7)
			Where sold.lSold = 1) apptSold
		Where #tmpDeal_STAGING_Evo2_CoreReport_V5.lTaskID = apptSold.lTaskID
			and ApptSold.ApptSold = 1
	END

	if @bInactive = 1
	BEGIN 

		Update #tmpDeal_STAGING_Evo2_CoreReport_V5 
		set dtClosed = d.dtClosed
		From dwFullDeal d WITH(NOLOCK) 
		inner join #Companies c WITH(NOLOCK) on c.lCompanyID = d.lCompanyID
		Where #tmpDeal_STAGING_Evo2_CoreReport_V5.lDealID = d.lDealID 
				and #tmpDeal_STAGING_Evo2_CoreReport_V5.lCompanyID = d.lCompanyID
				AND d.dtClosed between c.dtStart and c.dtEnd
				AND d.nliColorID = 17

		-- Find Top row to mark as Lost
		UPDATE #tmpDeal_STAGING_Evo2_CoreReport_V5 set lLost = 1
		From (
			Select v5.lTaskID, v5.lDealID,
				LostRow = row_number() over (partition by v5.lDealID order by Abs(DateDiff(dd, v5.dtClosed, Coalesce(v5.dtCompleted, v5.dtClosed))))
			From #tmpDeal_STAGING_Evo2_CoreReport_V5 v5 WITH(NOLOCK) 
			Where v5.nliColorID = 17
				and dtClosed is not null) pd
		Where pd.LostRow = 1
			and #tmpDeal_STAGING_Evo2_CoreReport_V5.lDealID = pd.lDealID
			and Coalesce(#tmpDeal_STAGING_Evo2_CoreReport_V5.lTaskID, #tmpDeal_STAGING_Evo2_CoreReport_V5.lDealID * -1) = Coalesce(pd.lTaskID, pd.lDealID * -1)

		-- Set Bought Elsewhere and Bad Lead
		Update #tmpDeal_STAGING_Evo2_CoreReport_V5 set lBoughtelseWhere = 1 where szDealSubStatus = 'Bought Elsewhere' and lLost = 1 AND lUp <> 0
		Update #tmpDeal_STAGING_Evo2_CoreReport_V5 set lBadLead = 1 where szDealSubStatus = 'Bad Lead' AND lUp <> 0 --and nliCategoryID = 22 and lLost = 1   --Commented out 06/29/2023 for bad lead triage.

		Update #tmpDeal_STAGING_Evo2_CoreReport_V5 set lBadLead = 1 
		From dwFullLeadProviderInactiveReasonMap dss WITH (NOLOCK) 
		Where #tmpDeal_STAGING_Evo2_CoreReport_V5.lDealSubStatusID = dss.lDealSubStatusID
			and #tmpDeal_STAGING_Evo2_CoreReport_V5.lSourceID = dss.lSourceID -- TFS ITEM 46949
			and #tmpDeal_STAGING_Evo2_CoreReport_V5.lCompanyID = dss.lCompanyID
			and #tmpDeal_STAGING_Evo2_CoreReport_V5.nliCategoryID = 22 
			and #tmpDeal_STAGING_Evo2_CoreReport_V5.lLost = 1

	END
--select * from #tmpDeal_STAGING_Evo2_CoreReport_V5
	IF @bSalesStep = 1
	BEGIN
		UPDATE #tmpDeal_STAGING_Evo2_CoreReport_V5 set lTurnOver = ti.lTO, lWriteUp = ti.lWriteUp, lDemo = ti.lDemo, lAppraisal = ti.lAppraisal
		From (
			Select v5.lDealID,  v5.lTaskID, 
			  lTO = Max(CASE WHEN TI.nliListItemID = 162 THEN 1 ELSE 0 END),         
			  lWriteUp = Max(CASE WHEN TI.nliListItemID = 163 THEN 1 ELSE 0 END),         
			  lDemo = Max(CASE WHEN TI.nliListItemID = 164 THEN 1 ELSE 0 END),         
			  lAppraisal = Max(CASE WHEN TI.nliListItemID = 280 THEN 1 ELSE 0 END)
			FROM #tmpDeal_STAGING_Evo2_CoreReport_V5 v5 WITH (NOLOCK) 
			INNER JOIN dwFullTaskItem TI WITH (NOLOCK) ON TI.lCompanyID = v5.lCompanyID AND TI.lTaskID = v5.lTaskID         
			WHERE v5.lVisit = 1 and v5.lTaskTypeID IN (7, 8, 31)  
			Group by v5.lDealID, v5.lTaskID
			) TI       
			Where #tmpDeal_STAGING_Evo2_CoreReport_V5.lTaskID = ti.lTaskID

		if @ConsiderArchive = 1
			UPDATE #tmpDeal_STAGING_Evo2_CoreReport_V5 set lTurnOver = ti.lTO, lWriteUp = ti.lWriteUp, lDemo = ti.lDemo, lAppraisal = ti.lAppraisal
			From (
				Select v5.lDealID,  v5.lTaskID, 
				  lTO = Max(CASE WHEN TI.nliListItemID = 162 THEN 1 ELSE 0 END),         
				  lWriteUp = Max(CASE WHEN TI.nliListItemID = 163 THEN 1 ELSE 0 END),         
				  lDemo = Max(CASE WHEN TI.nliListItemID = 164 THEN 1 ELSE 0 END),         
				  lAppraisal = Max(CASE WHEN TI.nliListItemID = 280 THEN 1 ELSE 0 END)
				FROM #tmpDeal_STAGING_Evo2_CoreReport_V5 v5 WITH (NOLOCK) 
				INNER JOIN dwFullTaskItem TI WITH (NOLOCK) ON TI.lCompanyID = v5.lCompanyID AND TI.lTaskID = v5.lTaskID         
				WHERE v5.lVisit = 1 and v5.lTaskTypeID IN (7, 8, 31)  
				Group by v5.lDealID, v5.lTaskID
				) TI       
				Where #tmpDeal_STAGING_Evo2_CoreReport_V5.lTaskID = ti.lTaskID

	END

	if @bOneSalesStepPerDeal = 1
	BEGIN
	--Find First Visit 
		Create Table #FirstVisits (lDealID int, lFirstVisit BIGINT)
		insert into #FirstVisits
		select lDealID, lFirstVisit = min(lTaskID)
		From #tmpDeal_STAGING_Evo2_CoreReport_V5 v WITH (NOLOCK) 
		Where v.lVisit = 1
		group by lDealID

		Update #tmpDeal_STAGING_Evo2_CoreReport_V5
			set lDemo = c.lDemo, lWriteUp = c.lWriteUp, lTurnOver = c.lTurnOver, lAppraisal = c.lAppraisal
		From #FirstVisits v
		Cross Apply (select lDemo = max(lDemo), lWriteUp = max(lWriteUp), lTurnOver = Max(lTurnOver), lAppraisal = Max(lAppraisal)  from #tmpDeal_STAGING_Evo2_CoreReport_V5 v5 WITH (NOLOCK) where v5.lDealID = v.lDealID) c
		Where #tmpDeal_STAGING_Evo2_CoreReport_V5.lTaskID = v.lFirstVisit

		Update v5
			set lDemo = 0, lWriteUp = 0, lTurnOver = 0, lAppraisal = 0
		FROM #tmpDeal_STAGING_Evo2_CoreReport_V5 v5
		left join #FirstVisits fv on v5.lTaskID = fv.lFirstVisit
		Where fv.lFirstVisit is null

	END

--MOD004 Update new lApprApptAcquired metric  this section updated 8/3/2023
		 update v5 
	 set  lApprApptAcquired = 1
	 --,dtClosed = d.dtClosed
	 from #tmpDeal_STAGING_Evo2_CoreReport_V5 v5
	 join dbo.dwFullDeal d
	 on v5.lDealID = d.lDealID
	 where v5.lApptIsAppriasal = 1--v5.dtClosed between @dtStart and @dtEnd --
	 and d.szDealSubStatus = 'Vehicle Acquired'  
	 --and v5.dtCompleted between  @dtStart and @dtEnd  --Changed from d.dtclosed to v5.dtcompleted on 8/4/2023
	 and v5.lApptShown =1
	 and v5.lApptIsAppriasal = 1;

--MOD011 - Update For Appraisal Appointments that were Acquired Same Day  ApprApptAcquired metric.
--This section Replaced by updated MOD004 section above.  08/03/2023.  DRM
       --      update V5 
       --      set lApprApptAcquired = 1

       --      from (select distinct ldealid from #tmpDeal_STAGING_Evo2_CoreReport_V5
       --      where lacquired = 1) acq
       --      join dwFullDeal d
       --      on acq.lDealID = d.lDealID
       --      join  #tmpDeal_STAGING_Evo2_CoreReport_V5 V5
       --      on d.ldealid = v5.ldealid 
       ----     and convert(date, d.dtClosed) = convert(date, v5.dtcompleted)
       --        where --v5.lApptIsAppriasal = 1
       --      v5.lApptShown = 1 
       --       and lAcquired = 1
--update #tmpDeal_STAGING_Evo2_CoreReport_V5 
--		set lApprApptAcquired = 1
	
--		From (
--			Select appt.lTaskID
--			, ApprApptAcquired = Row_Number() over (partition by acq.lDealID order by Abs(DateDiff(dd, appt.dtCompleted,acq.DtClosed)))
--			From dwfulldeal acq WITH (NOLOCK) 
--			inner join #tmpDeal_STAGING_Evo2_CoreReport_V5 appt WITH (NOLOCK) 
--				on appt.lDealID = acq.lDealID 
--				and DateDiff(dd, appt.dtCompleted, acq.dtClosed) = 0--between -7 and 
--				and appt.lTaskTypeID in (65)
--			Where acq.szDealSubStatus = 'Vehicle Acquired' /*acq.lDealSubStatusID = 52072956*/) apptAcq
--		Where #tmpDeal_STAGING_Evo2_CoreReport_V5.lTaskID = apptAcq.lTaskID
--			and ApptAcq.ApprApptAcquired = 1


-- Collect Salesteam information --6/16/2016 CG TFS46097 
CREATE TABLE #tmpSalesTeam
    (
      lDealID INT ,
      lSalesPersonID INT ,
      lPrimary INT ,
      nliPositionType INT ,
      lPositionPrimary INT
    )
INSERT  INTO #tmpSalesTeam
        SELECT DISTINCT
                dsm.lDealID ,
                dsm.lSalesPersonID ,
                lPrimary = ROW_NUMBER() OVER ( PARTITION BY v5.lDealID,v5.lTaskID, v5.dtEntry ORDER BY bPrimary DESC, 
							CASE WHEN COALESCE(nliPositionType, 355) = 355 THEN 1 ELSE 0 END DESC, dtLastEdit DESC ) ,
                nliPositionType = COALESCE(nliPositionType, 355) ,
                lPositionPrimarySQL = ROW_NUMBER() OVER ( PARTITION BY v5.lDealID, v5.lTaskID, v5.dtEntry, COALESCE(nliPositionType, 355) ORDER BY bPositionPrimary DESC )
        FROM    #tmpDeal_STAGING_Evo2_CoreReport_V5 v5 WITH ( NOLOCK )
                INNER JOIN dwFullDealSalespersonMap dsm WITH ( NOLOCK ) ON dsm.lDealID = v5.lDealID

/* End 6/16/2016 Change */

	CREATE NONCLUSTERED INDEX IX_tmpSalesTeam_nliPositionType_lPositionPrimary
	ON [dbo].[#tmpSalesTeam] ([nliPositionType],[lPositionPrimary])
	INCLUDE ([lDealID],[lSalesPersonID]);

	-- set salesperson
	Update #tmpDeal_STAGING_Evo2_CoreReport_V5 set lPrimarySalesPersonID = dsm.lSalesPersonID, lPrimaryDeal = 1
	from #tmpSalesTeam dsm
	where dsm.lPrimary = 1 AND (Coalesce(@bSalesPersonOnly,0) = 0 or nliPositionType =355)
		and #tmpDeal_STAGING_Evo2_CoreReport_V5.lDealID = dsm.lDealID

	-- set Secondary salesperson and Deal Split 
	Update #tmpDeal_STAGING_Evo2_CoreReport_V5 set lSalesPersonID = dsm.lSalesPersonID, 
		lPrimaryDeal = Case when lSold = 1 and @bSplitDeals = 1 then .5 else 1 end, 
		lSecondaryDeal = Case when lSold = 1 and @bSplitDeals = 1 then .5 else 0 end
	from #tmpSalesTeam dsm
	where dsm.lPrimary = 2
		and dsm.nliPositionType = 355
		and #tmpDeal_STAGING_Evo2_CoreReport_V5.lDealID = dsm.lDealID


	if @bBDC = 1 
	BEGIN
		--set bdc
		Update #tmpDeal_STAGING_Evo2_CoreReport_V5 set lBDCprimary  = dsm.lSalesPersonID
		from #tmpSalesTeam dsm
		where dsm.lPositionPrimary = 1
			and dsm.nliPositionType = 408
			and #tmpDeal_STAGING_Evo2_CoreReport_V5.lDealID = dsm.lDealID

		Update #tmpDeal_STAGING_Evo2_CoreReport_V5 set lBDCSecondary  = dsm.lSalesPersonID
		from #tmpSalesTeam dsm
		where dsm.lPositionPrimary != 1
			and dsm.nliPositionType = 408
			and #tmpDeal_STAGING_Evo2_CoreReport_V5.lDealID = dsm.lDealID
	END

	--When Lock Completed by company option is on, it is necessary to change the lCompletedByID to the lCurrentOwnerID to keep Reports like Salesperson Logging Performance crediting the salesperson
	--This is being implemented for the Hendrick Auto Group. 
	if @bUpTasksToCurrentOwner = 1
	BEGIN 
	
		Update #tmpDeal_STAGING_Evo2_CoreReport_V5 set lCompletedByID = lCurrentOwnerID where lTaskTypeID in (7,8,31) 

		Update #tmpDeal_STAGING_Evo2_CoreReport_V5 set lCompletedByID = lPrimarySalesPersonID
		from dwFullUser u (NOLOCK) 
		inner join dwtblPerson p (NOLOCK) 
			on p.lPersonID = u.lPersonID
			and p.lCompanyID = u.lCompanyID
		Where p.szFirstName = 'Guest'
			and u.lUserID = #tmpDeal_STAGING_Evo2_CoreReport_V5.lCompletedByID
			and #tmpDeal_STAGING_Evo2_CoreReport_V5.lTaskTypeID in (7,8,31)
			
	END
	
	--10/1/2015 MarcM Added dtProspectIn to prevent it from being null in the temp table.
	update #tmpDeal_STAGING_Evo2_CoreReport_V5 set dtProspectIn = d.dtProspectIn 
	from dwFullDeal d WITH (NOLOCK) 
	Where d.lCompanyID = #tmpDeal_STAGING_Evo2_CoreReport_V5.lCompanyID
		and d.lDealID = #tmpDeal_STAGING_Evo2_CoreReport_V5.lDealID
		and d.nliColorID between 15 and 18 --TFS Item 30106 / 30142

		
	--6/19/2017 Brian J - Update lCreatorID to be Mapped Child User if report is run from a child dealership.
	Update #tmpDeal_STAGING_Evo2_CoreReport_V5 set lCreatedByID = lei.lUserID
	from dwFullLegacyEmployeeID lei (NOLOCK) 
	Where #tmpDeal_STAGING_Evo2_CoreReport_V5.lCompanyID = lei.lCompanyID
		and Cast(#tmpDeal_STAGING_Evo2_CoreReport_V5.lCreatedByID as varchar) = lei.szLegacyID

	Update #tmpDeal_STAGING_Evo2_CoreReport_V5 set lCompletedByID = lei.lUserID
	from dwFullLegacyEmployeeID lei (NOLOCK) 
	Where #tmpDeal_STAGING_Evo2_CoreReport_V5.lCompanyID = lei.lCompanyID
		and Cast(#tmpDeal_STAGING_Evo2_CoreReport_V5.lCompletedByID as varchar) = lei.szLegacyID
	
	--Reassigned Deals have different Up Task Completed By than the current Primary Salesperson
	update #tmpDeal_STAGING_Evo2_CoreReport_V5 set lReassigned = 1 where lCompletedByID != lPrimarySalesPersonID and lUp = 1

	--Assign Lead Costs
	update #tmpDeal_STAGING_Evo2_CoreReport_V5 set 
		curLeadCost = Case 
			When curActualPerSold > 0 and lSold = 1 then curActualPerSold
			When curActualPerItem > 0 and lUp = 1 then curActualPerItem
			WHEN curActualFlatRate > 0 and lUp = 1 and Ups > 0 then curActualFlatRate / Ups
			ELSE NULL END
	From (
		Select lSourceID, Ups = sum(lUp), Sold = sum(lSold)
		from #tmpDeal_STAGING_Evo2_CoreReport_V5 s WITH (NOLOCK) 
		Group by lSourceID 
		having Sum(lUp) > 0 or sum(lSold) > 0) s
	INNER JOIN dwFullProductOrService POS WITH (NOLOCK) ON POS.szCode=convert(VARCHAR(30),s.lSourceId)  
		AND POS.lProductOrServiceTypeId=30   
	INNER JOIN dwFullDealerProgram DP WITH (NOLOCK) ON DP.lProductOrServiceId=POS.lProductOrServiceId   
		AND DP.lCompanyID=@lCompanyID  
		AND DP.bActive=1
	Where #tmpDeal_STAGING_Evo2_CoreReport_V5.lSourceID = s.lSourceID
	
--select * from #tmpDeal_STAGING_Evo2_CoreReport_V5
	
	if @bInactive  is null and @bBDC is null and @bResponseTime is null and @lChildCompanyID is null --Being Called like Old v3 
		Begin
			select lCompanyID, lChildCompanyID, lDealID, dtProspectIn, nliColorID, nliCategoryID,
            lPurchaseDetailsID, dtClosed, dtSold, lTaskID, lTaskTypeID, dtCREATEd = dtentry,
            dtDue, dtCompleted, dtTaskClosed, lCreatorID = lCREATEdByID, dtEntry, dtIn,
            lPrimarySalespersonID, lSalespersonID, lCurrentOwnerID, lCompletedByID, lPersonID,
            lApptConfirmedCompletedByID = lApptConfirmedByID, dtApptConfirmed, bBeBack = Cast(case when lBeBack = 0 then 0 else 1 end as bit), lSourceID, szNewUsedSought = szNewUsed,
            szNewUsedPurchased = szNewUsed, SalespersonCount = Case when lSalespersonID is not null and lPrimarySalesPersonID is not null then 2 else 1 end, lPrimaryDeal, lSecondaryDeal,
            curFrontGross = curFront, curBackGross = curBack, curTotalGross = curTotal, 
			bTO = Cast(case when lTurnOver = 0 then 0 else 1 end as bit), 
			bWriteUp = Cast(case when lWriteUp = 0 then 0 else 1 end as bit), 
			bDemo = Cast(case when lDemo = 0 then 0 else 1 end as bit), 
			bAppraisal = Cast(case when lAppraisal = 0 then 0 else 1 end as bit), 
			bShowroom = Cast(case when lVisit = 0 then 0 else 1 end as bit),
            lDealSubStatusID, szDealSubStatus, szLegacyDealID
			from #tmpDeal_STAGING_Evo2_CoreReport_V5
		End
	else --Caller knows about additional fields return whole data set
		BEGIN

		/*Testing Values
			select --* 
			sum(lUp) as lUp, sum(lvisit) as lVisit, sum(lbeback) as lBeBack, sum(lsold) as lSold, sum(lapptcreated) as lApptCreated, 
			sum(lapptdue) as lApptDue, sum(lapptshown) as lApptShown, sum(lapptsold) as lApptSold, sum(lapptconfirmed) as lApptConfirmed, 
			sum(ldemo) as lDemo, sum(lwriteup) as lWriteUp, sum(lturnover) as lTurnOver, sum(lappraisal) as lAppraisal, sum(llost) as lLost, 
			sum(lbadlead) as lBadLead, sum(lboughtelsewhere) as lBoughtElseWhere, sum(lreassigned) as lReassigned, sum(lprimarydeal) as lPrimaryDeal, 
			sum(lsecondarydeal) as lSecondaryDeal, sum(curFront) as curfront, sum(curBack) as curback, sum(curtotal) as curTotal  
			from #tmpDeal_STAGING_Evo2_CoreReport_V5 

			select count(distinct lDealID) as [Distinct lDealIDs] from #tmpDeal_STAGING_Evo2_CoreReport_V5 

			select count(distinct lTaskID) as [Distinct lTaskIDs] from #tmpDeal_STAGING_Evo2_CoreReport_V5 
		*/

/*
Modifications below this point capture the temp table content for daily summary staging.  
This will need to be compared to what is in the current process in PROD to make sure that anything below this line is not 
changing what is currently used, but only adding new functionality to capture daily data in dbo.ProcOutput_Sonic and to process 
that into dbo.StageTrafficDaily  -DRM


*/
--Get tasks of interest
--select * into ProcOutput_TasksOfInterest
--from #TasksOfInterest
--select * from #tmpDeal_STAGING_Evo2_CoreReport_V5
--Get full ProcOutput table
INSERT INTO [dbo].[ProcOutput_Sonic] --MOD008 (this tablename was used for testing.  The '_QA2' should be removed when deployed.
           ([szNewUsed]
           ,[lMakeID]
           ,[lUp]
           ,[lVisit]
           ,[lBeBack]
           ,[lSold]
           ,[lApptCreated]
           ,[lApptDue]
           ,[lApptShown]
           ,[lApptSold]
           ,[lApptConfirmed]
		   ,[lApptAttemptedConfirmed]
		   ,[IsAppraisalAppt]  --MOD008 - add column for Appraisal flag to ProcOutput_Sonic table
		   ,[lApprApptAcquired]
		   ,[lAcquired]
           ,[lDemo]
           ,[lWriteUp]
           ,[lTurnOver]
           ,[lAppraisal]
           ,[lLost]
           ,[lBadLead]
           ,[lBoughtElseWhere]
           ,[lReassigned]
           ,[lPrimaryDeal]
           ,[lSecondaryDeal]
           ,[curFront]
           ,[curBack]
           ,[curTotal]
           ,[lResponseTime]
           ,[curLeadCost]
           ,[lCompanyID]
           ,[lChildCompanyID]
           ,[lPersonID]
           ,[lDealID]
           ,[lReferenceID]
           ,[nliReferenceSourceID]
           ,[lPurchaseDetailsID]
           ,[nliCategoryID]
           ,[nliColorID]
           ,[lSourceID]
           ,[lDealSubStatusID]
           ,[szLegacyDealID]
           ,[lTaskID]
           ,[lTaskTypeID]
           ,[szSource]
		   ,[szSubSource]
           ,[szDealSubStatus]
           ,[szUpType]
           ,[lPrimarySalespersonID]
           ,[lSalespersonID]
           ,[lBDCPrimary]
           ,[lBDCSecondary]
           ,[lCreatedById]
           ,[lCurrentOwnerID]
           ,[lCompletedByID]
           ,[lApptConfirmedByID]
           ,[dtProspectIn]
           ,[dtIn]
           ,[dtClosed]
           ,[dtSold]
           ,[dtCreated]
           ,[dtDue]
           ,[dtCompleted]
           ,[dtTaskClosed]
           ,[dtApptConfirmed]
		   ,[dtAttemptedConfirmed]
           ,[dtEntry]
           ,[dtResponseTask]
           ,[nliInternetUpTier])


SELECT [szNewUsed]
      ,[lMakeID]
      ,[lUp]
      ,[lVisit]
      ,[lBeBack]
      ,[lSold]
      ,[lApptCreated]
      ,[lApptDue]
      ,[lApptShown]
      ,[lApptSold]
      --,[lApptConfirmed]
      ,case when lApptConfirmed = 1 and lApptIsAppriasal = 0 then 1 else 0 END [lApptConfirmed]
	  ,[lApptAttemptedConfirmed]
	  ,[lApptIsAppriasal] --MOD008 - add column for Appraisal flag to ProcOutput_Sonic source query.
	  ,[lApprApptAcquired]
	  ,[lAcquired]
      ,[lDemo]
      ,[lWriteUp]
      ,[lTurnOver]
      ,[lAppraisal]
      ,[lLost]
      ,[lBadLead]
      ,[lBoughtElseWhere]
      ,[lReassigned]
      ,[lPrimaryDeal]
      ,[lSecondaryDeal]
      ,[curFront]
      ,[curBack]
      ,[curTotal]
      ,[lResponseTime]
      ,[curLeadCost]
      ,[lCompanyID]
      ,[lChildCompanyID]
      ,[lPersonID]
      ,[lDealID]
      ,[lReferenceID]
      ,[nliReferenceSourceID]
      ,[lPurchaseDetailsID]
      ,[nliCategoryID]
      ,[nliColorID]
      ,[lSourceID]
      ,[lDealSubStatusID]
      ,[szLegacyDealID]
      ,[lTaskID]
      ,[lTaskTypeID]
      ,[szSource]
	  ,[szSubSource]
      ,[szDealSubStatus]
      ,[szUpType]
      ,[lPrimarySalespersonID]
      ,[lSalespersonID]
      ,[lBDCPrimary]
      ,[lBDCSecondary]
      ,[lCreatedById]
      ,[lCurrentOwnerID]
      ,[lCompletedByID]
      ,[lApptConfirmedByID]
      ,[dtProspectIn]
      ,[dtIn]
      ,[dtClosed]
      ,[dtSold]
      ,[dtCreated]
      ,[dtDue]
      ,[dtCompleted]
      ,[dtTaskClosed]
      ,[dtApptConfirmed]
	  ,[dtAttemptedConfirmed]
      ,[dtEntry]
      ,[dtResponseTask]
      ,[nliInternetUpTier]
  FROM #tmpDeal_STAGING_Evo2_CoreReport_V5 ;

  --MOD009 Add appraisal and acquired metric columns to StageTrafficSummary table and source query
	INSERT INTO [eLeadDW].[dbo].[StageTrafficSummary]
           (ParentCompany
		   ,[ParentCompanyID]
		   ,ChildCompany
           ,[ChildCompanyID]
           ,[szNewUsed]
           ,[StartDate]
           ,[EndDate]
           ,[LeadCount]
           ,[ShowroomVisits]
           ,[Bebacks]
           ,[Sold]
           ,[ApptCreated]
           ,[ApptDue]
           ,[ApptShown]
           ,[ApptSold]
		   ,[ApptConfirmed]
		   ,[ApptAttemptedConfirmed]
		   ,[ApprApptCreated] --MOD009 Add appraisal metric columns to StageTrafficSummary table
		   ,[ApprApptDue] --MOD009 Add appraisal metric columns to StageTrafficSummary table
		   ,[ApprApptShown] --MOD009 Add appraisal metric columns to StageTrafficSummary table
		   ,[ApprApptAcquired] --MOD009 Add appraisal metric columns to StageTrafficSummary table
		   ,[ApprApptConfirmed] --MOD009 Add appraisal metric columns to StageTrafficSummary table
		   ,[Acquired] --MOD009 Add appraisal metric columns to StageTrafficSummary table
		   ,IsAppraisalAppt --MOD009 Add appraisal metric columns to StageTrafficSummary table
           ,[Demos]
           ,[WriteUps]
           ,[TOs]
           ,[Appraisals]
           ,[Lost]
           ,[BadLead]
           ,[BoughtElsewhere]
           ,[Reassigned]
		   ,[ResponseTime]
		   ,[szUpType]
		   ,[Meta_LoadDate]
		   ,MTD
		  -- ,[ETLExecution_ID]
		  )

		Select
cp.szcompany
,v.lCompanyID
,cc.szcompany
,v.lChildCompanyID
,isnull(szNewUsed,'Unknown')
,@dtStart as StartDate
,@dtEnd as EndDate
--,nliCategoryID
--,isnull(szuptype,'N/A')  as UpType
--,lMakeID
,sum(lUp) as LeadCount
,(sum(lVisit) - sum(lBeBack)) as ShowroomVisits
,sum(lBeBack) as Bebacks
,sum(lSold) as Sold
,sum(case when lApptCreated = 1 and lApptIsAppriasal = 0 then 1 else 0 end) as ApptCreated  --MOD009 Alter logic for old appt metrics to exclude appraisal appointments
,sum(case when lApptDue = 1 and lApptIsAppriasal = 0 then 1 else 0 end) as ApptDue  --MOD009 Alter logic for old appt metrics to exclude appraisal appointments
,sum(case when lApptShown = 1 and lApptIsAppriasal = 0 then 1 else 0 end) as ApptShown   --MOD009 Alter logic for old appt metrics to exclude appraisal appointments
,sum(case when lApptSold = 1 and lApptIsAppriasal = 0 then 1 else 0 end) as ApptSold  --MOD009 Alter logic for old appt metrics to exclude appraisal appointments
,sum(case when lApptConfirmed = 1 and lApptIsAppriasal = 0 then 1 else 0 end) as ApptConfirmed  --MOD009 Alter logic for old appt metrics to exclude appraisal appointments
--,sum(lApptCreated) as ApptCreated
--,sum(lApptDue) as ApptDue
--,sum(lApptShown) as ApptShown 
--,sum(lApptSold) as ApptSold
--,sum(lApptConfirmed) as ApptConfirmed
,sum(case when lApptAttemptedConfirmed = 1 and lApptConfirmed = 0 then 1 else 0 end) as AttemptedConfirmed
,sum(case when lApptCreated = 1 and lApptIsAppriasal = 1 then 1 else 0 end) as ApprApptCreated --MOD009 Add source columns for appraisal appt metrics.
,sum(case when lApptDue = 1 and lApptIsAppriasal = 1 then 1 else 0 end) as ApprApptDue  --MOD009 Add source columns for appraisal appt metrics.
,sum(case when lApptShown = 1 and lApptIsAppriasal = 1 then 1 else 0 end) as ApprApptShown  --MOD009 Add source columns for appraisal appt metrics.
,sum(lApprApptAcquired)--,sum(case when lAcquired = 1 and lApptIsAppriasal = 1 then 1 else 0 end) as ApprApptAcquired --MOD009 Add source columns for appraisal appt metrics.
,sum(case when lApptConfirmed = 1 and lApptIsAppriasal = 1 then 1 else 0 end) as ApprApptConfirmed --MOD009 Add source columns for appraisal appt metrics.

,sum(lAcquired) as Acquired --MOD009 Add source columns for appraisal appt metrics.


,sum(lApptIsAppriasal) as IsAppriasalAppt --MOD009 Add source columns for appraisal appt metrics.
,sum(lDemo) as Demos
,sum(lWriteUp) as WriteUps
,sum(lTurnOver) as TOs
,sum(lAppraisal) as Appraisals
,sum(lLost) as Lost
,sum(lBadLead) as BadLead
,sum(lBoughtElseWhere) as BoughtElsewhere
,sum(lReassigned) as Reassigned
,avg(lResponseTime) as ResponseTime
,isnull(szuptype,'N/A')  as UpType
,Getdate()
,1

--into eLeadDW.dbo.ProcOutput
from #tmpDeal_STAGING_Evo2_CoreReport_V5 v
		join dwFullCompany cp
			on v.lCompanyID = cp.lCompanyID
		join dwfullcompany cc
			on v.lChildCompanyID = cc.lcompanyid
Group by 
v.lCompanyID
,cp.szcompany
,v.lChildCompanyID
,cc.szcompany
,szNewUsed
--,nliCategoryID
,szUpType




	--INSERT INTO [eLeadDW].[dbo].[StageTrafficSummary_QA_Dealership]
 --          (ParentCompany
	--	   ,[ParentCompanyID]
	--	   ,ChildCompany
 --          ,[ChildCompanyID]
 --          ,[StartDate]
 --          ,[EndDate]
 --          ,[LeadCount]
 --          ,[ShowroomVisits]
 --          ,[Bebacks]
 --          ,[Sold]
 --          ,[ApptCreated]
 --          ,[ApptDue]
 --          ,[ApptShown]
 --          ,[ApptSold]
	--	   ,[ApptConfirmed]
	--	   ,[ApprApptCreated]
	--	   ,[ApprApptDue]
	--	   ,[ApprApptShown]
	--	   ,[ApprApptSold]
	--	   ,[ApprApptConfirmed]
	--	   ,[Acquired]
	--	   ,IsAppraisalAppt
 --          ,[Demos]
 --          ,[WriteUps]
 --          ,[TOs]
 --          ,[Appraisals]
 --          ,[Lost]
 --          ,[BadLead]
 --          ,[BoughtElsewhere]
 --          ,[Reassigned]
	--	   ,[ResponseTime]
	--	   ,[Meta_LoadDate]
	--	   ,MTD
	--	  -- ,[ETLExecution_ID]
	--	  )

--		Select
----cp.szcompany
--v.lCompanyID
--,cc.szcompany
--,v.lChildCompanyID
----,isnull(szNewUsed,'Unknown')
--,@dtStart as StartDate
--,@dtEnd as EndDate
----,nliCategoryID
----,isnull(szuptype,'N/A')  as UpType
----,lMakeID
--,sum(lUp) as LeadCount
--,(sum(lVisit) - sum(lBeBack)) as ShowroomVisits
--,sum(lBeBack) as Bebacks
--,sum(lSold) as Sold
--,sum(case when lApptCreated = 1 and lApptIsAppriasal = 0 then 1 else 0 end) as ApptCreated
--,sum(case when lApptDue = 1 and lApptIsAppriasal = 0 then 1 else 0 end) as ApptDue
--,sum(case when lApptShown = 1 and lApptIsAppriasal = 0 then 1 else 0 end) as ApptShown 
--,sum(case when lApptSold = 1 and lApptIsAppriasal = 0 then 1 else 0 end) as ApptSold
--,sum(case when lApptConfirmed = 1 and lApptIsAppriasal = 0 then 1 else 0 end) as ApptConfirmed
----,sum(lApptCreated) as ApptCreated
----,sum(lApptDue) as ApptDue
----,sum(lApptShown) as ApptShown 
----,sum(lApptSold) as ApptSold
----,sum(lApptConfirmed) as ApptConfirmed

--,sum(case when lApptCreated = 1 and lApptIsAppriasal = 1 then 1 else 0 end) as ApprApptCreated
--,sum(case when lApptDue = 1 and lApptIsAppriasal = 1 then 1 else 0 end) as ApprApptDue
--,sum(case when lApptShown = 1 and lApptIsAppriasal = 1 then 1 else 0 end) as ApprApptShown 
--,sum(case when lApptSold = 1 and lApptIsAppriasal = 1 then 1 else 0 end) as ApprApptSold
--,sum(case when lApptConfirmed = 1 and lApptIsAppriasal = 1 then 1 else 0 end) as ApprApptConfirmed
--,sum(lAcquired) as Acquired


--,sum(lApptIsAppriasal) as IsAppriasalAppt
--,sum(lDemo) as Demos
--,sum(lWriteUp) as WriteUps
--,sum(lTurnOver) as TOs
--,sum(lAppraisal) as Appraisals
--,sum(lLost) as Lost
--,sum(lBadLead) as BadLead
--,sum(lBoughtElseWhere) as BoughtElsewhere
--,sum(lReassigned) as Reassigned
--,avg(lResponseTime) as ResponseTime
----,isnull(szuptype,'N/A')  as UpType
--,Getdate()
--,1

----into eLeadDW.dbo.ProcOutput
--from #tmpDeal_STAGING_Evo2_CoreReport_V5 v
--		join dwFullCompany cp
--			on v.lCompanyID = cp.lCompanyID
--		join dwfullcompany cc
--			on v.lChildCompanyID = cc.lcompanyid
--Group by 
--v.lCompanyID
--,cp.szcompany
--,v.lChildCompanyID
--,cc.szcompany
--,szNewUsed
--,nliCategoryID
--,szUpType

----The below procedure creates rows for each day/store/uptype in dbo.StageTrafficSummary.  DRM 08/30/2020
;
exec usp_LoadStageTrafficDailyEmptyRecords @lCompanyid, @lChildCompanyID, @dtStart, @dtEnd;
exec usp_LoadTrafficSummaryDepartmentRecords @dtStart, @dtEnd;


--The procedures below update values in dbo.StageTrafficSummary for the individual metrics. DRM 08/31/2020
exec usp_TrafficSummaryDailyUpdateLeadCounts @dtstart, @dtend;
exec usp_TrafficSummaryDailyUpdateShowroomVisits @dtStart, @dtEnd;
exec usp_TrafficSummaryUpdateSoldLeads @dtStart, @dtEnd;
exec usp_TrafficSummaryUpdateApptsCreated @dtStart, @dtEnd;
exec usp_TrafficSummaryUpdateApptsDue_QA @dtStart, @dtEnd;
exec usp_TrafficSummaryUpdateApptsShown @dtStart, @dtEnd;
exec usp_TrafficSummaryUpdateApptsSold @dtStart, @dtEnd;
exec usp_TrafficSummaryUpdateApptConfirmations @dtStart, @dtEnd;
exec usp_TrafficSummaryUpdateBadLeads @dtStart, @dtEnd;

--Procs for AppraisalAppts
exec usp_TrafficSummaryUpdateAcquiredLeads @dtStart, @dtEnd;
exec usp_TrafficSummaryUpdateApprApptsCreated @dtStart, @dtEnd;
exec usp_TrafficSummaryUpdateApprApptsDue @dtStart, @dtEnd;
exec usp_TrafficSummaryUpdateApprApptsShown @dtStart, @dtEnd;
exec usp_TrafficSummaryUpdateApprApptsAcquired @dtStart, @dtEnd;
exec usp_TrafficSummaryUpdateApprApptConfirmations @dtStart, @dtEnd;
exec usp_TrafficSummaryUpdateApptAttemptedConfirmed @dtStart, @dtEnd

--Load Data to the SubSource Level into Staging table, then sum it all up.
exec [dbo].[usp_StageTrafficSummaryDailySubsourceAcquired] @dtStart, @dtEnd;
exec [dbo].[usp_StageTrafficSummaryDailySubsourceAppraisal]  @dtStart, @dtEnd;  --
exec [dbo].[usp_StageTrafficSummaryDailySubsourceApprApptAcq]  @dtStart, @dtEnd;  --
exec [dbo].[usp_StageTrafficSummaryDailySubsourceApprApptConf]  @dtStart, @dtEnd;  --
exec [dbo].[usp_StageTrafficSummaryDailySubsourceApprApptCr]  @dtStart, @dtEnd;--
exec [dbo].[usp_StageTrafficSummaryDailySubsourceApprApptDue]  @dtStart, @dtEnd; --
exec [dbo].[usp_StageTrafficSummaryDailySubsourceApprApptShow]  @dtStart, @dtEnd;--
exec [dbo].[usp_StageTrafficSummaryDailySubsourceApptAttConf]  @dtStart, @dtEnd;--
exec [dbo].[usp_StageTrafficSummaryDailySubsourceApptConf]  @dtStart, @dtEnd;--
exec [dbo].[usp_StageTrafficSummaryDailySubsourceApptCrt]  @dtStart, @dtEnd;--
exec [dbo].[usp_StageTrafficSummaryDailySubsourceApptDue]  @dtStart, @dtEnd;--
exec [dbo].[usp_StageTrafficSummaryDailySubsourceApptShow]  @dtStart, @dtEnd;--
exec [dbo].[usp_StageTrafficSummaryDailySubsourceApptSold]  @dtStart, @dtEnd;--
exec [dbo].[usp_StageTrafficSummaryDailySubsourceBadLead]  @dtStart, @dtEnd;--
exec [dbo].[usp_StageTrafficSummaryDailySubsourceBeback]  @dtStart, @dtEnd;-- --beback?
exec [dbo].[usp_StageTrafficSummaryDailySubsourceBoughtElswr]  @dtStart, @dtEnd;--
exec [dbo].[usp_StageTrafficSummaryDailySubsourceDemo]  @dtStart, @dtEnd;--
exec [dbo].[usp_StageTrafficSummaryDailySubsourceDWT]  @dtStart, @dtEnd;--
exec [dbo].[usp_StageTrafficSummaryDailySubsourceLeads]  @dtStart, @dtEnd;--
exec [dbo].[usp_StageTrafficSummaryDailySubsourceLost]  @dtStart, @dtEnd;--
exec [dbo].[usp_StageTrafficSummaryDailySubsourceReassgnd]  @dtStart, @dtEnd;
exec [dbo].[usp_StageTrafficSummaryDailySubsourceSold]  @dtStart, @dtEnd;--
exec [dbo].[usp_StageTrafficSummaryDailySubsourceVisits]  @dtStart, @dtEnd;--

--Load Aggregate stage table - this needs to become a dataflow to ETL_Staging
--exec [dbo].[usp_StageTrafficSummaryDailySubsourceAgg] ;

END

