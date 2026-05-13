---
name: usp_DOC_Update_ProjectionPS
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Doc_ProjectionPS
  - Doc_Record
dependency_count: 2
parameter_count: 63
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Doc_ProjectionPS** (U )
- **dbo.Doc_Record** (U )

## Parameters

| Name                      | Type    | Output | Default |
| ------------------------- | ------- | ------ | ------- |
| `@EntityID`               | int     | No     | No      |
| `@NewUnits`               | varchar | No     | No      |
| `@NewPVR`                 | varchar | No     | No      |
| `@UsedUnits`              | varchar | No     | No      |
| `@UsedPVR`                | varchar | No     | No      |
| `@FIPVR`                  | varchar | No     | No      |
| `@WholesaleGross`         | varchar | No     | No      |
| `@ServiceGross`           | varchar | No     | No      |
| `@PartsGross`             | varchar | No     | No      |
| `@AppGenMerchGross`       | varchar | No     | No      |
| `@NUSalesComp`            | varchar | No     | No      |
| `@ServicePartsComp`       | varchar | No     | No      |
| `@ALComp`                 | varchar | No     | No      |
| `@RallyComp`              | varchar | No     | No      |
| `@Spiffs`                 | varchar | No     | No      |
| `@FIComp`                 | varchar | No     | No      |
| `@CompSuper`              | varchar | No     | No      |
| `@FuelDelExp`             | varchar | No     | No      |
| `@AdCoopSpend`            | varchar | No     | No      |
| `@NetFloorplan`           | varchar | No     | No      |
| `@PolicyClaims`           | varchar | No     | No      |
| `@LotDamage`              | varchar | No     | No      |
| `@ClericalExp`            | varchar | No     | No      |
| `@OtherSalaries`          | varchar | No     | No      |
| `@ControllerOfficeMgrExp` | varchar | No     | No      |
| `@AbsenteeWages`          | varchar | No     | No      |
| `@EmployeeBenefits`       | varchar | No     | No      |
| `@FourK`                  | varchar | No     | No      |
| `@PayrollTaxes`           | varchar | No     | No      |
| `@PersonnelTraining`      | varchar | No     | No      |
| `@WorkersComp`            | varchar | No     | No      |
| `@SupplyTools`            | varchar | No     | No      |
| `@CustomerSupplies`       | varchar | No     | No      |
| `@Laundry`                | varchar | No     | No      |
| `@Freight`                | varchar | No     | No      |
| `@BadDebt`                | varchar | No     | No      |
| `@Rent`                   | varchar | No     | No      |
| `@RepairsMaint`           | varchar | No     | No      |
| `@EquipmentRepairs`       | varchar | No     | No      |
| `@OfficeSupplies`         | varchar | No     | No      |
| `@DataProcessing`         | varchar | No     | No      |
| `@SonicIT`                | varchar | No     | No      |
| `@OutsideServ`            | varchar | No     | No      |
| `@CreditCardFees`         | varchar | No     | No      |
| `@CompanyVehicleExp`      | varchar | No     | No      |
| `@MembershipDues`         | varchar | No     | No      |
| `@Utilities`              | varchar | No     | No      |
| `@TravelEnt`              | varchar | No     | No      |
| `@EventsEnt`              | varchar | No     | No      |
| `@Legal`                  | varchar | No     | No      |
| `@Postage`                | varchar | No     | No      |
| `@PropertyTax`            | varchar | No     | No      |
| `@GarInsurLosses`         | varchar | No     | No      |
| `@Security`               | varchar | No     | No      |
| `@Depreciation`           | varchar | No     | No      |
| `@OtherOverhead`          | varchar | No     | No      |
| `@DocFee`                 | varchar | No     | No      |
| `@FB`                     | varchar | No     | No      |
| `@RidingAcademy`          | varchar | No     | No      |
| `@Rally`                  | varchar | No     | No      |
| `@OtherInc`               | varchar | No     | No      |
| `@OtherDed`               | varchar | No     | No      |
| `@UserLogin`              | varchar | No     | No      |

## Definition

```sql







CREATE PROCEDURE [dbo].[usp_DOC_Update_ProjectionPS]
@EntityID INT,
@NewUnits varchar(50),
@NewPVR varchar(50),
@UsedUnits varchar(50),
@UsedPVR varchar(50),
@FIPVR varchar(50),
@WholesaleGross varchar(50),
@ServiceGross varchar(50),
@PartsGross varchar(50),
@AppGenMerchGross varchar(50),
@NUSalesComp varchar(50),
@ServicePartsComp varchar(50),
@ALComp varchar(50),
@RallyComp varchar(50),
@Spiffs varchar(50),
@FIComp varchar(50),
@CompSuper varchar(50),
@FuelDelExp varchar(50),
@AdCoopSpend varchar(50),
@NetFloorplan varchar(50),
@PolicyClaims varchar(50),
@LotDamage varchar(50),
@ClericalExp varchar(50),
@OtherSalaries varchar(50),
@ControllerOfficeMgrExp varchar(50),
@AbsenteeWages varchar(50),
@EmployeeBenefits varchar(50),
@FourK varchar(50),
@PayrollTaxes varchar(50),
@PersonnelTraining varchar(50),
@WorkersComp varchar(50),
@SupplyTools varchar(50),
@CustomerSupplies varchar(50),
@Laundry varchar(50),
@Freight varchar(50),
@BadDebt varchar(50),
@Rent varchar(50),
@RepairsMaint varchar(50),
@EquipmentRepairs varchar(50),
@OfficeSupplies varchar(50),
@DataProcessing varchar(50),
@SonicIT varchar(50),
@OutsideServ varchar(50),
@CreditCardFees varchar(50),
@CompanyVehicleExp varchar(50),
@MembershipDues varchar(50),
@Utilities varchar(50),
@TravelEnt varchar(50), --Total Travel & Entertainment
@EventsEnt varchar(50),
@Legal varchar(50),
@Postage varchar(50),
@PropertyTax varchar(50),
@GarInsurLosses varchar(50),
@Security varchar(50),
@Depreciation varchar(50),
@OtherOverhead varchar(50),
@DocFee varchar(50),
@FB varchar(50),  --Factory Bonus
@RidingAcademy varchar(50),
@Rally varchar(50),
@OtherInc varchar(50),
@OtherDed varchar(50),
@UserLogin varchar(50)


As

DECLARE @DDTempUnits table(MetricID INT, MetricNum varchar(50))
DECLARE @DDTempAmount table(MetricID INT, MetricNum varchar(50))
DECLARE @DocID INT = (SELECT DocID FROM [dbo].[Doc_Record] WHERE EntityKey = @EntityID AND DocDateKey = (SELECT CONVERT(varchar(10),getdate(),112)))


--Insert Units
INSERT INTO @DDTempUnits (MetricID, MetricNum) values (10, @NewUnits)
INSERT INTO @DDTempUnits (MetricID, MetricNum) values (20, @UsedUnits)
--INSERT INTO @DDTempUnits (MetricID, MetricNum) values (40, @FleetUnits)

--Insert Amounts
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (10, @NewUnits)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (11, @NewPVR)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (20, @UsedUnits)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (21, @UsedPVR)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (71, @FIPVR)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (32, @WholesaleGross)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (40, @ServiceGross)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (50, @PartsGross)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (60, @AppGenMerchGross)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (90, @NUSalesComp)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (100, @ServicePartsComp)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (110, @ALComp)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (111, @RallyComp)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (120, @Spiffs)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (130, @FIComp)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (140, @CompSuper)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (150, @FuelDelExp)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (160, @AdCoopSpend)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (170, @NetFloorplan)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (190, @PolicyClaims)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (200, @LotDamage)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (210, @ClericalExp)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (220, @OtherSalaries)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (230, @ControllerOfficeMgrExp)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (240, @AbsenteeWages)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (250, @EmployeeBenefits)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (260, @FourK)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (270, @PayrollTaxes)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (280, @PersonnelTraining)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (290, @WorkersComp)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (300, @SupplyTools)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (310, @CustomerSupplies)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (320, @Laundry)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (330, @Freight)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (340, @BadDebt)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (360, @Rent)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (370, @RepairsMaint)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (380, @EquipmentRepairs)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (390, @OfficeSupplies)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (400, @DataProcessing)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (410, @SonicIT)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (420, @OutsideServ)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (430, @CreditCardFees)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (440, @CompanyVehicleExp)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (450, @MembershipDues)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (460, @Utilities)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (470, @TravelEnt)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (480, @EventsEnt)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (490, @Legal)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (500, @Postage)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (510, @PropertyTax)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (520, @GarInsurLosses)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (530, @Security)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (540, @Depreciation)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (550, @OtherOverhead)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (580, @DocFee)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (590, @FB)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (600, @RidingAcademy)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (610, @Rally)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (620, @OtherInc)
INSERT INTO @DDTempAmount (MetricID, MetricNum) values (630, @OtherDed)




SET NOCOUNT ON

BEGIN TRY

 IF @DocID IS NOT NULL

	--Update unit metrics.
    BEGIN

	;with tUnits as (
		SELECT MetricID, MetricNum FROM @DDTempUnits
	)
	UPDATE dbo.Doc_ProjectionPS

	SET StatCount = MetricNum,
		ControllerUserID = @UserLogin,
		UpdateDate = GETDATE()
	FROM tUnits
		INNER JOIN dbo.Doc_ProjectionPS b WITH (NOLOCK)
			ON (b.GroupElementSort = tUnits.MetricID)
	WHERE
		DocID = @DocID AND MetricNum IS NOT NULL AND MetricNum <> ''


	--Update amount metrics.

	;with tAmount as (
		SELECT MetricID, MetricNum FROM @DDTempAmount
	)
	UPDATE dbo.Doc_ProjectionPS

	SET Amount = MetricNum,
		ControllerUserID = @UserLogin,
		UpdateDate = GETDATE()
	FROM tAmount
		INNER JOIN dbo.Doc_ProjectionPS b WITH (NOLOCK)
			ON (b.GroupElementSort = tAmount.MetricID)
	WHERE
		DocID = @DocID AND MetricNum IS NOT NULL AND MetricNum <> ''

	-----------------



	--Calculated Total values for projection table
	--DECLARE @DDTempTable table(EntityKey INT, DateKey INT, MetricID INT, MetricNum MONEY)

	--;with CalcTable as
	--	(SELECT     EntityKey,
	--				DateKey,
	--				--SUM(isnull(FOGross,0)) AS FOGross,
	--				SUM(isnull(DealershipGross,0)) AS DealershipGross,
	--				(SUM(isnull(NewUnits,0)) * (Sum(isnull(NewPVR,0)))) AS NewGross,
	--				(SUM(isnull(UsedUnits,0)) * Sum(isnull(UsedPVR,0))) AS UsedGross,
	--				((SUM(isnull(NewUnits,0)) + SUM(isnull(UsedUnits,0))) * SUM(isnull(FIPVR,0))) AS FIGross,
	--				--(SUM(isnull(Expenses,0)) + ((SUM(isnull(NewUnits,0)) + SUM(isnull(UsedUnits,0))) * SUM(isnull(NUSalesComp,0)))) AS Expenses,
	--				SUM(isnull(Other,0)) AS Other,
	--				SUM(isnull(NewUnits,0)) AS NewUnits,
	--				SUM(isnull(UsedUnits,0)) AS UsedUnits,
	--				(SUM(isnull(NewUnits,0)) + SUM(isnull(UsedUnits,0))) AS TotalUnits,
	--				SUM(isnull(NewPVR,0)) AS NewPVR,
	--				SUM(isnull(UsedPVR,0)) AS UsedPVR,
	--				SUM(isnull(FIPVR,0)) AS FIPVR
	--				--SUM(isnull(DeliveryPackNew,0)) AS DeliveryPackNew,
	--				--SUM(isnull(DeliveryPackUsed,0)) AS DeliveryPackUsed,
	--				--SUM(isnull(FIComp,0)) AS FIComp,
	--				--SUM(isnull(PartsFB,0)) AS PartsFB
	--				--SUM(isnull(FOComp,0)) AS FOComp
	--	FROM         (SELECT    EntityKey,
	--							DateKey,
	--							CASE WHEN pps.GroupElementSort IN (10) THEN StatCount END AS NewUnits,
	--							CASE WHEN pps.GroupElementSort IN (101) THEN StatCount END AS NewPVR,
	--						CASE WHEN pps.GroupElementSort IN (20) THEN StatCount END AS UsedUnits,
	--						CASE WHEN pps.GroupElementSort IN (21) THEN StatCount END AS UsedPVR,
	--						CASE WHEN pps.GroupElementSort IN (10, 12) THEN Amount END AS NewGross,
	--						CASE WHEN pps.GroupElementSort IN (20, 22) THEN Amount END AS UsedGross,
	--						CASE WHEN pps.GroupElementSort IN (71) THEN Amount END AS FIPVR,
	--						CASE WHEN pps.GroupElementSort IN (40,50) THEN Amount END AS FOGross,
	--						CASE WHEN GroupSubElement IN ('Dealership Gross', 'Units') THEN Amount END AS DealershipGross,
	--						CASE WHEN GroupSubElement IN ('Overhead') THEN Amount END AS TotalOverhead,
	--						CASE WHEN GroupSubElement IN ('Selling Expenses') THEN Amount END AS TotalSellingExpenses,
	--						CASE WHEN GroupSubElement IN ('Operating Expenses') THEN Amount END AS TotalOperatingExpenses,
	--						CASE WHEN GroupSubElement IN ('Selling Expenses', 'Operating Expenses', 'Overhead') THEN Amount END AS Expenses,
	--						CASE WHEN GroupSubElement IN ('Other Inc/Ded') THEN Amount END AS Other
	--				   FROM dbo.Doc_ProjectionPS pps WITH (NOLOCK)
	--				   JOIN dbo.Doc_MetricsPS mps
	--				   ON pps.GroupElementSort = mps.GroupElementSort
	--				   WHERE EntityKey = @EntityID
	--				   AND DocID = @DocID
	--				   ) a11
	--	GROUP BY EntityKey, DateKey)

	--Unpivot calculated values and assign key values
	--INSERT INTO @DDTempTable (EntityKey, DateKey, MetricID, MetricNum)
	--SELECT EntityKey, DateKey, 101, (FOGross) FROM CalcTable
	--	UNION ALL
	--SELECT EntityKey, DateKey, 119, ((DealershipGross) + (NewGross) + (UsedGross) + (FIGross) - (PartsFB)) FROM CalcTable
	--	UNION ALL
	----SELECT EntityKey, DateKey, 451, (Expenses + (FOGross * FOComp) + (FIGross * FIComp) + (DeliveryPackNew * NewUnits) + (DeliveryPackUsed * UsedUnits)) FROM CalcTable
	--SELECT EntityKey, DateKey, 451, (Expenses + (FIGross * FIComp) + (DeliveryPackNew * NewUnits) + (DeliveryPackUsed * UsedUnits)) FROM CalcTable
	--	UNION ALL
	----SELECT EntityKey, DateKey, 500, ((DealershipGross + NewGross + UsedGross + FIGross) - (Expenses + (FOGross * FOComp) + (FIGross * FIComp) + (DeliveryPackNew * NewUnits) + (DeliveryPackUsed * UsedUnits)) + Other) FROM CalcTable
	--SELECT EntityKey, DateKey, 500, ((DealershipGross + NewGross + UsedGross + FIGross - PartsFB) - (Expenses  + (FIGross * FIComp) + (DeliveryPackNew * NewUnits) + (DeliveryPackUsed * UsedUnits)) + Other) FROM CalcTable

	----Update Calculated Totals
	--;with tCalc as (
	--	SELECT MetricID, MetricNum FROM @DDTempTable
	--)
	--UPDATE dbo.Doc_ProjectionPS

	--SET Amount = MetricNum,
	--	ControllerUserID = @UserLogin,
	--	UpdateDate = GETDATE()
	--FROM tCalc
	--	INNER JOIN dbo.Doc_ProjectionPS b WITH (NOLOCK)
	--		ON (b.GroupElementSort = tCalc.MetricID)
	--WHERE
	--	DocID = @DocID AND MetricNum IS NOT NULL AND MetricNum <> ''

	END

END TRY

BEGIN CATCH
    SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
    RETURN -1
END CATCH


SET NOCOUNT OFF


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
