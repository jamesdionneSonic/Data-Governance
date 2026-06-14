# Connector Runtime Fix Plan

## Purpose

Unblock live profiling and lineage extraction for saved `sql_server` and `ssis` connectors by making the managed connector runtime behave the same way as the working `Ingestion Studio` path, while adding enough diagnostics to prove where failures still occur.

## What We Know

- The managed connector runtime is using the real Windows process identity:
  - `SONIC\James.Dionne`
- Saved connector failures are not caused by missing browser or ADO credentials.
- `Ingestion Studio` and managed connectors both ultimately call the connector extraction kernel.
- The biggest historical differences were:
  - different Windows-auth connection builders
  - different SSIS extraction paths
  - inconsistent error visibility
- Those code-path differences have now been reduced, and saved connector diagnostics now pass live Windows-auth connection validation for the target SQL Server and SSIS connectors.
- The successful shared-runtime diagnostics used:
  - `msnodesqlv8`
  - `ODBC Driver 17 for SQL Server`
  - `Trusted_Connection=Yes`
  - runtime identity `SONIC\James.Dionne`
  - a killable diagnostic worker so native driver hangs do not wedge the app process.

## Current Live Diagnostic Results

Captured on June 12, 2026 through `diagnoseConnectorConnection`, not direct SQL probes:

| Requested Connector | Resolved Connector | Endpoint | Database | SQL Server Reported | Login | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `VendorData` | `VendorData` | `L1-DWASQL-02,12010` | `VendorData` | `D1-SQL-02B\INST1` | `SONIC\James.Dionne` | Passed |
| `StagingDB` | `StagingDB` | `L1-DWASQL-02,12010` | `StagingDB` | `D1-SQL-02B\INST1` | `SONIC\James.Dionne` | Passed |
| `ETL_Staging` | `ETL_Staging` | `L1-5FSQL-01\INST1` | `ETL_Staging` | `D1-SQL-01B\INST1` | `SONIC\James.Dionne` | Passed |
| `SSIS_UAT` | `SSIS_UAT` | `V1-SSIS25-01,11040` | `SSISDB` | `V1-SSIS25-01` | `SONIC\James.Dionne` | Passed |
| `Sonic_DW` | `GPA` | `L1-5FSQL-01\INST1` | `Sonic_DW` | `D1-SQL-01B\INST1` | `SONIC\James.Dionne` | Passed |

## Root Problem Framing

This is no longer a live connectivity blocker.

The remaining risk is runtime parity staying intact:

- the same app can appear to “connect” in one workflow and fail in another
- saved connectors must use the same connection contract, the same driver choice, and the same diagnostics as the workflow users trust
- when they still fail, the system must prove whether the issue is:
  - DNS / host resolution
  - named-instance resolution
  - TCP port reachability
  - SPN / Kerberos / SSPI negotiation
  - certificate / encryption
  - permission scope after connect

## Fix Goals

1. One SQL Server / SSIS runtime path
2. One shared Windows-auth contract
3. One shared diagnostics model
4. One visible test result model in the UI
5. Proof that saved connectors can run the same real profiling and extraction path as `Ingestion Studio`

## Implementation Plan

### Phase 1: Runtime Parity

- Extract the working SQL/SSIS connection builder behavior into one shared module
- Make both `Ingestion Studio` and managed connectors call that same module
- Remove or deprecate duplicate SQL/SSIS connection-building logic in:
  - `src/api/ingestion.js`
  - `src/api/ssis.js`
  - `src/services/connectorRuntime/sqlServerConnection.js`
- Standardize Windows integrated behavior:
  - `msnodesqlv8`
  - `Trusted_Connection=Yes`
  - explicit trust-server-certificate handling
  - explicit named-instance / port handling

### Phase 2: Deep Diagnostics

- Add a structured probe result for each SQL/SSIS test:
  - runtime Windows identity
  - host machine
  - requested server
  - requested instance
  - requested port
  - resolved endpoint string
  - driver module used
  - authentication mode used
  - connection-string variant used
  - phase reached
- Add sub-probes:
  - DNS resolution result
  - named-instance parse result
  - TCP probe result when a port is known
  - SQL Browser dependency note when using named instances without a port
  - SSPI/SPN classification when negotiation errors appear

### Phase 3: UI Truthfulness

- Show the structured probe directly in the connector test card
- Distinguish:
  - config valid
  - runtime identity
  - network reachable
  - SQL connection opened
  - metadata discovery passed
- Never leave the UI blank or pending after a failed click

### Phase 4: Endpoint Normalization

- For saved SQL Server-family connectors, normalize endpoint storage to support:
  - host only
  - host + explicit port
  - host + instance
  - host + instance + known port
- Prefer explicit port storage when known
- Keep the original display value for UX, but persist the parsed parts used by the runtime

### Phase 5: Proof Runs

For each target connector, capture:

- saved config
- runtime identity
- connection probe output
- final extraction result

Target connectors:

- `VendorData`
- `StagingDB`
- `ETL_Staging`
- `SSIS_UAT`

The goal is not just “test passed”; the goal is:

- a saved connector can execute the same real extraction path used for profiling / lineage generation

### Proof Run Results - June 12, 2026

SQL Server live profile proof:

- Connector: `GPA` (`Sonic_DW`)
- Target: `Sonic_DW.dbo.DimVehicle`
- Mode: live aggregate profile through the managed connector runtime
- Result: succeeded
- Actions planned: `1`
- Assets profiled: `1`
- Columns profiled: `12` in the verification sample; live metadata reported `41` available columns
- Live row count: `16,955`
- Raw values retained: `false`
- Secret exposed: `false`

SSIS live extraction proof:

- Connector: `SSIS_UAT`
- Target stream: `catalog`
- Mode: live SSISDB catalog extraction through the managed connector runtime
- Options: `extractXml:false`, `catalogLimit:5`
- Result: succeeded
- Source contacted: `true`
- Live connection valid: `true`
- Metadata discovery valid: `true`
- Events returned: `5` package catalog objects in the final sample
- Note: full package XML extraction remains heavier than the default `45s` connector runtime cap; narrow catalog proof runs should use catalog-only extraction and, when needed, a higher operational timeout.

## Investigation Commands To Add

The runtime should surface or record enough evidence to answer:

- Can the app process resolve the host name?
- Can it reach the host/port?
- Is the connector relying on SQL Browser for named-instance resolution?
- Is the connection failing before SQL Server auth or after?
- What Windows identity is SQL Server actually seeing on success?

## Success Criteria

- A saved `sql_server` connector can pass live connection and metadata discovery: **passed for `VendorData`, `StagingDB`, `ETL_Staging`, and `Sonic_DW`/`GPA`.**
- A saved `ssis` connector can pass live connection and metadata discovery: **passed for `SSIS_UAT`.**
- The same saved connector can run a real extraction/profile without switching workflows: **passed for live `GPA`/`Sonic_DW` profiling and limited live `SSIS_UAT` catalog extraction.**
- The UI shows exactly why a connector failed, including runtime identity and endpoint details: **backend diagnostics are available; UI rendering is tracked separately.**
- `Ingestion Studio` and managed connectors no longer drift apart behaviorally: **shared runtime path is now enforced for diagnostics and SQL/SSIS connection config.**

## Next Execution Order

1. Build the shared SQL/SSIS connection factory used by both workflows: **done.**
2. Add structured DNS / endpoint / phase diagnostics: **done for endpoint/runtime identity/driver variant; deeper DNS/TCP sub-probes remain optional.**
3. Add UI rendering for those diagnostics: **owned by the UI workstream.**
4. Retest `VendorData`, `StagingDB`, `ETL_Staging`, `SSIS_UAT`: **done, all passed.**
5. Run narrow real extraction/profile proof through saved connectors: **done for live `GPA`/`Sonic_DW` profiling and limited live `SSIS_UAT` catalog extraction.**
6. Return to lineage tracing with live connectors: **resumed with `Sonic_DW.dbo.DimVehicle`.**
