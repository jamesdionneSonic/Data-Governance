# Profile Findings

Dataset: `snowflake-dms-shared-consumption`

Latest live profile run: `20260624T181040Z`

## Scope

This packet profiled the two Snowflake shared tables against SQL Server `DMS`
candidate tables using read-only aggregate queries only.

Snowflake:

- `CONSUMPTION_SHARED_E100030.VEHICLE_SALES_RAW`
- `CONSUMPTION_SHARED_E100030.REPAIR_ORDER_RAW`

SQL Server DMS:

- `dbo.vehiclesales`
- `dbo.vehiclesalescurrent`
- `dbo.servicesalesclosed`
- `dbo.servicesalesopen`
- `dbo.servicesalesdetailsclosed`
- `dbo.appointments`

## Vehicle Sales

Selected comparison key:

- Snowflake: `BRANCH + DEALNUMBER`
- SQL Server: `branch + dealno`

Reason:

- Snowflake dealer/deal keys had no null deal numbers and no duplicate
  dealer/deal keys in the live profile output.
- SQL Server dealer/deal keys had no duplicates for the profiled `466` and
  `476` branch families.

Rejected primary key:

- VIN + stock + sales date should not be the primary match key. The live
  profile showed duplicate combinations, so those fields should stay as
  supporting match/detail fields only.

Date decision:

- Start daily vehicle-sales comparison with `salesdate` / `SALESDATE`.
- Carry `contractdate` / `CONTRACTDATE` as a secondary timing field.
- Caveat: Snowflake `CONTRACTDATE` is more populated, but SQL Server DMS
  `contractdate` includes future dates in the profile output.

## Repair Orders

Selected comparison key:

- Snowflake: `DEALERCODE + RONUM`
- SQL Server: `cora_acct_id + ronumber`

Reason:

- Snowflake dealer/RO keys had no null RO numbers and no duplicate dealer/RO
  keys in the live profile output.
- SQL Server `dbo.servicesalesclosed` and `dbo.servicesalesopen` had no null RO
  numbers and no duplicate dealer/RO keys for the profile window.

Selected SQL Server grain:

- Use `dbo.servicesalesclosed` for closed repair orders.
- Use `dbo.servicesalesopen` for open repair orders.

Rejected primary comparison grains:

- `dbo.servicesalesdetailsclosed` is line/detail grain and repeats repair-order
  keys.
- `dbo.appointments` is appointment grain and profiled with null repair-order
  numbers.

Date decision:

- Closed repair orders: compare by `ROCLOSEDATE` / `closedate`.
- Open repair orders: compare by `ROOPENDATE` / `opendate`.

## Dealer Mapping Caveat

The profile evidence identifies strong code families but does not by itself
prove the business dealer names.

Observed vehicle-sales branch families:

- `466D`
- `466S`
- `476D`
- `476S`

Observed SQL Server repair-order DMS account candidates:

- `445`
- `20246`

Known account-family hints from DMS metadata reviewed during profiling:

- `SA466` family includes `445`, `347`, `425`, and `19007`.
- `SA476` family includes `20246`, `20393`, `20395`, and `20396`.

Before business-facing labels are added to Excel dashboards, confirm which
family maps to Jaguar Land Rover Santa Monica and which maps to Mercedes-Benz
of Calabasas.

## Next Build Step

`WP-DVL-005` should build daily summary comparison CSVs using these selections:

- Vehicle sales key: dealer plus deal number.
- Repair order key: dealer plus RO number.
- Vehicle sales date: sales date, carrying contract date as a timing field.
- Repair order date: close date for closed ROs, open date for open ROs.
- SQL Server DMS remains the source of record while Snowflake is evaluated for
  timing and completeness.
