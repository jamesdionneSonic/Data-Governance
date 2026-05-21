---
name: usp_FactFIREBookings_PreDW_LoadPrep
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






CREATE PROC [dbo].[usp_FactFIREBookings_PreDW_LoadPrep]
AS
-- ============================================================================================
-- Author: Sudip Karki
-- Date: 2017.07.10
-- Description: Update the factFireBookingsWeOwe to filter columns value based on dealcriteria

-- =============================================================================================

BEGIN


UPDATE FF

SET
	apr = CASE WHEN FPC.FIGLProductCategoryKey = 15 AND FGL.FIAccountType = 'S' AND FGL.FIAccount NOT IN ( 6387,6397)  THEN FF.apr ELSE 0 END
   ,age = CASE WHEN FPC.FIGLProductCategoryKey = 15 AND FGL.FIAccountType = 'S' AND FGL.FIAccount NOT IN ( 6387,6397)  THEN FF.age ELSE 0 END
   ,buyrateapr = CASE WHEN FPC.FIGLProductCategoryKey = 15 AND FGL.FIAccountType = 'S' AND FGL.FIAccount NOT IN ( 6387,6397)  THEN FF.buyrateapr ELSE 0 END
   ,buyrateaddon = CASE WHEN FPC.FIGLProductCategoryKey = 15 AND FGL.FIAccountType = 'S' AND FGL.FIAccount NOT IN ( 6387,6397)  THEN FF.buyrateaddon ELSE 0	END
   ,buyratelfm = CASE WHEN FPC.FIGLProductCategoryKey = 15 AND FGL.FIAccountType = 'S' AND FGL.FIAccount NOT IN ( 6387,6397)  THEN FF.buyratelfm ELSE 0 END
   ,frontweowesgrosssales = CASE WHEN FPC.FIGLProductCategoryKey = 15 AND FGL.FIAccountType = 'S' AND FGL.FIAccount NOT IN ( 6387,6397)  THEN FF.frontweowesgrosssales ELSE 0 END
   ,sellrateapr = CASE WHEN FPC.FIGLProductCategoryKey = 15 AND FGL.FIAccountType = 'S' AND FGL.FIAccount NOT IN ( 6387,6397)  THEN FF.sellrateapr ELSE 0 END
   ,totaltradesover = CASE WHEN FPC.FIGLProductCategoryKey = 15 AND FGL.FIAccountType = 'S' AND FGL.FIAccount NOT IN ( 6387,6397)  THEN FF.totaltradesover ELSE 0 END
   ,frontweowes = CASE WHEN FPC.FIGLProductCategoryKey = 15 AND FGL.FIAccountType = 'S' AND FGL.FIAccount NOT IN ( 6387,6397)  THEN FF.frontweowes	ELSE 0 END
   ,mbiname = CASE WHEN FPC.FIGLProductCategoryKey = 12 AND FGL.FIAccountType IN ('C', 'S') THEN FF.mbiname	ELSE NULL END
   ,mbilimit = CASE	WHEN FPC.FIGLProductCategoryKey = 12 AND FGL.FIAccountType IN ('C', 'S') THEN FF.mbilimit ELSE 0 END
   ,mbiterm = CASE WHEN FPC.FIGLProductCategoryKey = 12 AND FGL.FIAccountType IN ('C', 'S') THEN FF.mbiterm ELSE 0	END
   ,cashprice = CASE WHEN FPC.FIGLProductCategoryKey = 15 AND FGL.FIAccountType = 'S'  AND FGL.FIAccount NOT IN ( 6387,6397)  THEN FF.cashprice	ELSE 0 END
   ,term = CASE WHEN FPC.FIGLProductCategoryKey = 15 AND FGL.FIAccountType = 'S' AND FGL.FIAccount NOT IN ( 6387,6397)  THEN FF.term ELSE 0 END

FROM Sonic_DW.dbo.FactFireBookings_preDW AS FF
INNER JOIN Sonic_DW.dbo.dim_FIGLAccounts AS FGL
	ON FGL.FIGLProductKey = FF.FIGLProductKey
INNER JOIN dim_FIGLProductCategory AS FPC
	ON FGL.FIGLProductCategoryKey = FPC.FIGLProductCategoryKey





-- UPDATE the duplicate cashprice, apr etc . Keep the Cashrices for revenue line item that has the highest amount per deal/stockno

; WITH TopAmount AS (
SELECT
	RANK() OVER ( PARTITION BY dealno, StockNo,AccountingDateKey ORDER BY Amount DESC) AS RankByAmount ,
	ROW_NUMBER() OVER ( PARTITION BY  dealno, StockNo,AccountingDateKey ORDER BY Amount DESC) AS Dup,*
FROM Sonic_DW.dbo.FactFireBookings_preDW
	WHERE  cashprice !=0
	)

--Update/filter the cash revenue line item for the top revenue line item record

UPDATE TopAmount
	SET
		 apr = CASE WHEN RankByAmount > 1  THEN 0  WHEN RankByAmount = 1 AND Dup >1 THEN 0 ELSE apr END
		,age = CASE WHEN RankByAmount > 1  THEN 0  WHEN RankByAmount = 1 AND Dup >1 THEN 0 ELSE age END
		,buyrateapr = CASE WHEN RankByAmount > 1  THEN 0  WHEN RankByAmount = 1 AND Dup >1 THEN 0 ELSE buyrateapr END
		,buyrateaddon = CASE WHEN RankByAmount > 1  THEN 0  WHEN RankByAmount = 1 AND Dup >1 THEN 0 ELSE buyrateaddon END
		,buyratelfm = CASE WHEN RankByAmount > 1  THEN 0  WHEN RankByAmount = 1 AND Dup >1 THEN 0 ELSE buyratelfm END
		,sellrateapr = CASE WHEN RankByAmount > 1  THEN 0  WHEN RankByAmount = 1 AND Dup >1 THEN 0 ELSE sellrateapr END
		,totaltradesover = CASE WHEN RankByAmount > 1  THEN 0  WHEN RankByAmount = 1 AND Dup >1 THEN 0 ELSE totaltradesover END
		,frontweowes = CASE WHEN RankByAmount > 1  THEN 0  WHEN RankByAmount = 1 AND Dup >1 THEN 0 ELSE frontweowes END
		,frontweowesgrosssales = CASE WHEN RankByAmount > 1  THEN 0  WHEN RankByAmount = 1 AND Dup >1 THEN 0 ELSE frontweowesgrosssales END
		,extrawarrantyexpmileslease = CASE WHEN RankByAmount > 1  THEN 0  WHEN RankByAmount = 1 AND Dup >1 THEN 0 ELSE extrawarrantyexpmileslease END
		,extrawarrantytermlease = CASE WHEN RankByAmount > 1  THEN 0  WHEN RankByAmount = 1 AND Dup >1 THEN 0 ELSE extrawarrantytermlease END
		,mbiname = NULL
		,mbilimit = CASE WHEN RankByAmount > 1  THEN 0  WHEN RankByAmount = 1 AND Dup >1 THEN 0 ELSE mbilimit END
		,mbiterm = CASE WHEN RankByAmount > 1  THEN 0  WHEN RankByAmount = 1 AND Dup >1 THEN 0 ELSE mbiterm END
		,cashPrice = CASE WHEN RankByAmount > 1  THEN 0  WHEN RankByAmount = 1 AND Dup >1 THEN 0 ELSE cashPrice END
		,term = CASE WHEN RankByAmount > 1  THEN 0  WHEN RankByAmount = 1 AND Dup >1 THEN 0 ELSE term END


END






```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
