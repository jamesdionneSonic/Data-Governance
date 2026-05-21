---
name: usp_DOC_Update_Projection
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql






CREATE PROCEDURE [dbo].[usp_DOC_Update_Projection]
@EntityID INT,
@NewUnits varchar(50),
@FleetUnits varchar(50),
@UsedUnits varchar(50),
@NewPVR varchar(50),
@UsedPVR varchar(50),
@FIPVR varchar(50),
@NFB varchar(50),  --New Factory Bonus
@NFBPVR varchar(50),
@UFB varchar(50),  --Used Factory Bonus
@WholesaleGross varchar(50),
@ServiceGross varchar(50),
@BodyShopGross varchar(50),
@PartsGross varchar(50),
@NUSalesComp varchar(50),
@CompSuper varchar(50),
@DelExp varchar(50),
@GasExp varchar(50),
@NetAdSpend varchar(50),
@NetFloorplan varchar(50),
@PolicyClaims varchar(50),
@Demo varchar(50),
@LotDamage varchar(50),
@InventoryMaint varchar(50),
@TotalTrain varchar(50),
@OutsideServ varchar(50),
@Elead varchar(50),
@Freight varchar(50),
@SupplyTools varchar(50),
@Laundry varchar(50),
@Depreciation varchar(50),
@EquipmentRepairs varchar(50),
@ComputerEquip varchar(50),
@LoanerVehicle varchar(50),
@BadDebt varchar(50),
@OtherSalaries varchar(50),
@CompensationClerical varchar(50),
@PayrollTaxes varchar(50),
@AbsenteeWages varchar(50),
@EmployeeBenefits varchar(50),
@XmasParty varchar(50),
@FourK varchar(50),
@WorkersComp varchar(50),
@UninsuredLosses varchar(50),
@Overhead varchar(50),
@OtherIncDed varchar(50),
@FOCompGross varchar(50),
--@FOComp varchar(50),
@ContractComp varchar(50),
@FleetGross varchar(50),
@PFB varchar(50),  --Parts Factory Bonus
@AdvCredit varchar(50),  --Advertising Credits
@OtherOutsideServ varchar(50),
@CreditCardFees varchar(50),
@OnSiteMeals varchar(50),
@CustomerConv varchar(50), --Customer Convience
@Legal varchar(50),
@OfficeSupplies varchar(50),
@DataProcessing varchar(50),
@TravelEnt varchar(50), --Total Travel & Entertainment
@ManagedRepairsMaint varchar(50),
@RepairsMaint varchar(50),
@PropertyTax varchar(50),
@PersonalPropertyTax varchar(50),
@SonicIT varchar(50),
@CommInsLosses varchar(50),

@UserLogin varchar(50)


As

DECLARE @DDTempUnits table(MetricID INT, MetricNum varchar(50))
DECLARE @DDTempAmount table(MetricID INT, MetricNum varchar(50))
DECLARE @DocID INT = (SELECT DocID FROM [dbo].[Doc_Record] WHERE EntityKey = @EntityID AND DocDateKey = (SELECT CONVERT(varchar(10),getdate(),112)))


--Insert Units
INSERT INTO @DDTempUnits (MetricID, MetricNum) values (10, @NewUnits)
INSERT INTO @DDTempUnits (MetricID, MetricNum) values (40, @FleetUnits)
INSERT INTO @DDTempUnits (MetricID, MetricNum) values (20, @UsedUnits)

--Insert Amounts
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (11, @NewPVR)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (21, @UsedPVR)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (111, @FIPVR)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (31, @NFB)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (34, @NFBPVR)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (40, @FleetGross)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (51, @UFB)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (60, @WholesaleGross)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (80, @ServiceGross)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (90, @BodyShopGross)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (100, @PartsGross)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (121, @NUSalesComp)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (140, @CompSuper)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (150, @DelExp)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (160, @GasExp)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (190, @NetAdSpend)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (200, @NetFloorplan)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (210, @PolicyClaims)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (220, @Demo)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (230, @LotDamage)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (240, @InventoryMaint)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (250, @TotalTrain)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (261, @OutsideServ)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (270, @Elead)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (280, @Freight)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (290, @SupplyTools)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (300, @Laundry)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (310, @Depreciation)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (320, @EquipmentRepairs)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (330, @ComputerEquip)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (340, @LoanerVehicle)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (350, @BadDebt)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (360, @OtherSalaries)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (370, @CompensationClerical)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (380, @PayrollTaxes)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (390, @AbsenteeWages)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (400, @EmployeeBenefits)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (410, @XmasParty)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (420, @FourK)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (430, @WorkersComp)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (440, @UninsuredLosses)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (450, @Overhead)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (4501, @ManagedRepairsMaint)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (4502, @RepairsMaint)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (4503, @PropertyTax)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (4504, @PersonalPropertyTax)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (4505, @SonicIT)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (4506, @CommInsLosses)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (460, @OtherIncDed)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (130, @FOCompGross)
--INSERT INTO @DDTempAmount (MetricID, MetricNum) values (131, @FOComp)  --Percent
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (181, @ContractComp)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (102, @PFB)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (191, @AdvCredit)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (260, @OtherOutsideServ)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (262, @CreditCardFees)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (263, @OnSiteMeals)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (291, @CustomerConv)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (520, @Legal)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (530, @OfficeSupplies)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (540, @DataProcessing)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (550, @TravelEnt)



SET NOCOUNT ON

BEGIN TRY

 IF @DocID IS NOT NULL

	--Update unit metrics.
    BEGIN

	;with tUnits as (
		SELECT MetricID, MetricNum FROM @DDTempUnits
	)
	UPDATE dbo.Doc_Projection

	SET StatCount = MetricNum,
		ControllerUserID = @UserLogin,
		UpdateDate = GETDATE()
	FROM tUnits
		INNER JOIN dbo.Doc_Projection b WITH (NOLOCK)
			ON (b.GroupElementSort = tUnits.MetricID)
	WHERE
		DocID = @DocID AND MetricNum IS NOT NULL AND MetricNum <> ''


	--Update amount metrics.

	;with tAmount as (
		SELECT MetricID, MetricNum FROM @DDTempAmount
	)
	UPDATE dbo.Doc_Projection

	SET Amount = MetricNum,
		ControllerUserID = @UserLogin,
		UpdateDate = GETDATE()
	FROM tAmount
		INNER JOIN dbo.Doc_Projection b WITH (NOLOCK)
			ON (b.GroupElementSort = tAmount.MetricID)
	WHERE
		DocID = @DocID AND MetricNum IS NOT NULL AND MetricNum <> ''


	-----------------
	IF @NFB IS NOT NULL AND @NFB <> ''
		BEGIN

		UPDATE dbo.Doc_SubProjection
		SET		Amount				= @NFB,
				ControllerUserID	= @UserLogin,
				UpdateDate			= GETDATE()
		WHERE	DocID = @DocID and EntityKey = @EntityID and GroupElementSort = 31;
	END

	IF @NFBPVR IS NOT NULL AND @NFBPVR <> ''
		BEGIN

		UPDATE dbo.Doc_SubProjection
		SET		Amount				= @NFBPVR,
				ControllerUserID	= @UserLogin,
				UpdateDate			= GETDATE()
		WHERE	DocID = @DocID and EntityKey = @EntityID and GroupElementSort = 34;
	END

	IF @NewPVR IS NOT NULL AND @NewPVR <> ''
		BEGIN

		UPDATE dbo.Doc_SubProjection
		SET		Amount				= @NewPVR,
				ControllerUserID	= @UserLogin,
				UpdateDate			= GETDATE()
		WHERE	DocID = @DocID and EntityKey = @EntityID and GroupElementSort = 11;
	END

	IF @NewUnits IS NOT NULL AND @NewUnits <> ''
		BEGIN

		UPDATE dbo.Doc_SubProjection
		SET		StatCount			= @NewUnits,
				ControllerUserID	= @UserLogin,
				UpdateDate			= GETDATE()
		WHERE	DocID = @DocID and EntityKey = @EntityID and GroupElementSort = 10;
		END





	-----------------



	--Calculated Total values for projection table
	DECLARE @DDTempTable table(EntityKey INT, DateKey INT, MetricID INT, MetricNum MONEY)

	;with CalcTable as
		(SELECT     EntityKey,
					DateKey,
					SUM(isnull(FOGross,0)) AS FOGross,
					SUM(isnull(DealershipGross,0)) AS DealershipGross,
					(SUM(isnull(NewUnits,0)) * (Sum(isnull(NewPVR,0)) + Sum(isnull(NFBPVR,0)))) AS NewGross, --Changed to Included NFB 1/29/2021
					(SUM(isnull(UsedUnits,0)) * Sum(isnull(UsedPVR,0))) AS UsedGross,
					((SUM(isnull(NewUnits,0)) + SUM(isnull(UsedUnits,0))) * SUM(isnull(FIPVR,0))) AS FIGross,
					(SUM(isnull(Expenses,0)) + ((SUM(isnull(NewUnits,0)) + SUM(isnull(UsedUnits,0))) * SUM(isnull(NUSalesComp,0)))) AS Expenses,
					SUM(isnull(Other,0)) AS Other,
					SUM(isnull(NewUnits,0)) AS NewUnits,
					SUM(isnull(UsedUnits,0)) AS UsedUnits,
					(SUM(isnull(NewUnits,0)) + SUM(isnull(UsedUnits,0))) AS TotalUnits,
					SUM(isnull(NewPVR,0)) AS NewPVR,
					SUM(isnull(UsedPVR,0)) AS UsedPVR,
					SUM(isnull(FIPVR,0)) AS FIPVR,
					SUM(isnull(DeliveryPackNew,0)) AS DeliveryPackNew,
					SUM(isnull(DeliveryPackUsed,0)) AS DeliveryPackUsed,
					SUM(isnull(FIComp,0)) AS FIComp,
					SUM(isnull(PartsFB,0)) AS PartsFB
					--SUM(isnull(FOComp,0)) AS FOComp
		FROM         (SELECT    EntityKey,
								DateKey,
								CASE WHEN GroupElementSort IN (10) THEN StatCount END AS NewUnits,
								CASE WHEN GroupElementSort IN (20) THEN StatCount END AS UsedUnits,
								CASE WHEN GroupElementSort IN (40) THEN StatCount END AS FleetUnits,
								CASE WHEN GroupElementSort IN (11, 33) THEN Amount END AS NewPVR,
								CASE WHEN GroupElementSort IN (31) THEN Amount END AS NFB, --Added for NewGross 1/29/2021
								CASE WHEN GroupElementSort IN (34) THEN Amount END AS NFBPVR,
								CASE WHEN GroupElementSort IN (21, 53) THEN Amount END AS UsedPVR,
								CASE WHEN GroupElementSort IN (111) THEN Amount END AS FIPVR,
						 		CASE WHEN GroupElementSort IN (181) THEN Amount END As FIComp,
								--CASE WHEN GroupElementSort IN (131) THEN Amount END As FOComp,
								CASE WHEN GroupElementSort IN (172) THEN Amount END As DeliveryPackNew,
								CASE WHEN GroupElementSort IN (173) THEN Amount END As DeliveryPackUsed,
								CASE WHEN GroupElementSort IN (80, 90, 100) THEN Amount END As FOGross,
								CASE WHEN GroupElementSort IN (121) THEN Amount END AS NUSalesComp,
								CASE WHEN GroupElementSort IN (102) THEN Amount END AS PartsFB,
								CASE WHEN GroupSubElement IN ('Dealership Gross', 'Units') THEN Amount END AS DealershipGross,
								CASE WHEN GroupSubElement IN ('Selling Expenses', 'Operating Expenses', 'Overhead') THEN Amount END AS Expenses,
								CASE WHEN GroupSubElement IN ('Other Inc/Ded') THEN Amount END AS Other
					   FROM dbo.Doc_Projection WITH (NOLOCK)
					   WHERE EntityKey = @EntityID
					   AND DocID = @DocID
					   ) a11
		GROUP BY EntityKey, DateKey)

	--Unpivot calculated values and assign key values
	INSERT INTO @DDTempTable (EntityKey, DateKey, MetricID, MetricNum)
	SELECT EntityKey, DateKey, 101, (FOGross) FROM CalcTable
		UNION ALL
	SELECT EntityKey, DateKey, 119, ((DealershipGross) + (NewGross) + (UsedGross) + (FIGross) - (PartsFB)) FROM CalcTable
		UNION ALL
	--SELECT EntityKey, DateKey, 451, (Expenses + (FOGross * FOComp) + (FIGross * FIComp) + (DeliveryPackNew * NewUnits) + (DeliveryPackUsed * UsedUnits)) FROM CalcTable
	SELECT EntityKey, DateKey, 451, (Expenses + (FIGross * FIComp) + (DeliveryPackNew * NewUnits) + (DeliveryPackUsed * UsedUnits)) FROM CalcTable
		UNION ALL
	--SELECT EntityKey, DateKey, 500, ((DealershipGross + NewGross + UsedGross + FIGross) - (Expenses + (FOGross * FOComp) + (FIGross * FIComp) + (DeliveryPackNew * NewUnits) + (DeliveryPackUsed * UsedUnits)) + Other) FROM CalcTable
	SELECT EntityKey, DateKey, 500, ((DealershipGross + NewGross + UsedGross + FIGross - PartsFB) - (Expenses  + (FIGross * FIComp) + (DeliveryPackNew * NewUnits) + (DeliveryPackUsed * UsedUnits)) + Other) FROM CalcTable

	--Update Calculated Totals
	;with tCalc as (
		SELECT MetricID, MetricNum FROM @DDTempTable
	)
	UPDATE dbo.Doc_Projection

	SET Amount = MetricNum,
		ControllerUserID = @UserLogin,
		UpdateDate = GETDATE()
	FROM tCalc
		INNER JOIN dbo.Doc_Projection b WITH (NOLOCK)
			ON (b.GroupElementSort = tCalc.MetricID)
	WHERE
		DocID = @DocID AND MetricNum IS NOT NULL AND MetricNum <> ''

	END

END TRY

BEGIN CATCH
    SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
    RETURN -1
END CATCH


SET NOCOUNT OFF


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
