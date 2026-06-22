# FDP-06 Rovo Canonical Link Refresh Readback

Generated: 2026-06-19

## Scope

FDP-06 refreshes the Rovo AI retrieval dry-run artifacts so Rovo can resolve common Sonic lineage questions through a compact retrieval layer, then link back to the canonical human Confluence catalog pages.

This work packet is local dry-run and validation only. No live Confluence publish was performed.

## Commands

```powershell
node --check scripts\build-rovo-ai-retrieval-dry-run.mjs
node --check scripts\check-rovo-ai-retrieval-dry-run.mjs
npm run confluence:rovo:validate
```

## Validation Result

```json
{
  "status": "passed",
  "checkedPages": 8,
  "failures": []
}
```

Dry-run build summary:

```json
{
  "status": "rovo-dry-run-built",
  "pages": 8,
  "locatorRows": 500,
  "ambiguityGroups": 8,
  "acceptanceFailures": []
}
```

The only split recommendation came from the validator smoke test for an intentionally oversized synthetic page. It is not a generated Rovo artifact failure.

## Generated Artifact Root

```text
Sonic Data Lineage / AI Retrieval Artifacts
```

Generated local output:

```text
data/confluence/rovo-ai-retrieval-dry-run/
```

Generated pages:

| Page                            | Purpose                                                         |
| ------------------------------- | --------------------------------------------------------------- |
| Rovo Start Here                 | Agent lookup order and safety instructions.                     |
| Rovo Object Locator 001         | Database/schema/object lookup rows and canonical human links.   |
| Rovo Database Context 001       | Database-level context for VendorData.                          |
| Rovo Object Summary Context 001 | Object summaries for DimVehicle and FactOpportunity candidates. |
| Rovo Upstream Context 001       | Upstream lineage context for Sonic_DW.dbo.FactOpportunity.      |
| Rovo Downstream Context 001     | Downstream lineage context for Sonic_DW.dbo.FactOpportunity.    |
| Rovo Ambiguity Context 001      | Ambiguity groups for normalized aliases.                        |
| Rovo Evaluation Prompts         | Rovo evaluation prompts and expected behavior.                  |

## Canonical Link Readback

### VendorData

The locator includes database-level rows for `VendorData`, `vendordata`, and `vendor data`.

Canonical id:

```text
database:VendorData
```

Rovo retrieval page:

```text
Rovo Database Context 001
```

Canonical human page:

```text
Sonic Data Lineage / Database Catalog / VendorData
```

### DimVehicle

The normalized prompt `DimVehicle` is intentionally ambiguous because metadata surfaces multiple valid candidates, including:

| Canonical id                                | Full name                | Human page                                                           |
| ------------------------------------------- | ------------------------ | -------------------------------------------------------------------- |
| object:L1-5FSQL-01.Sonic_DW.dbo.Dim_Vehicle | Sonic_DW.dbo.Dim_Vehicle | Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / Dim_Vehicle |
| object:L1-5FSQL-01.Sonic_DW.dbo.DimVehicle  | Sonic_DW.dbo.DimVehicle  | not created yet                                                      |
| object:L1-5FSQL-01.Sonic_DW.wrk.Dim_Vehicle | Sonic_DW.wrk.Dim_Vehicle | not created yet                                                      |

Expected Rovo behavior:

```text
Show the DimVehicle ambiguity group and ask the user to choose because several normalized matches exist.
```

### FactOpportunity

The normalized prompt `FactOpportunity` is intentionally ambiguous because metadata surfaces multiple valid candidates, including:

| Canonical id                                         | Full name                         | Human page                                                               |
| ---------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------ |
| object:L1-5FSQL-01.Sonic_DW.dbo.FactOpportunity      | Sonic_DW.dbo.FactOpportunity      | Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / FactOpportunity |
| object:L1-5FSQL-01.Sonic_DW.dbo.Fact_Opportunity     | Sonic_DW.dbo.Fact_Opportunity     | not created yet                                                          |
| object:L1-5FSQL-01.ETL_Staging.clean.FactOpportunity | ETL_Staging.clean.FactOpportunity | not created yet                                                          |

Exact canonical prompt:

```text
Show me the lineage of Sonic_DW.dbo.FactOpportunity.
```

Expected Rovo retrieval pages:

```text
Rovo Upstream Context 001
Rovo Downstream Context 001
```

Canonical human page:

```text
Sonic Data Lineage / Database Catalog / Sonic_DW / dbo / FactOpportunity
```

## Evaluation Prompt Coverage

The dry-run includes evaluation prompts for:

| Prompt family                       | Example                                                 |
| ----------------------------------- | ------------------------------------------------------- |
| Database summary                    | Tell me about the database VendorData.                  |
| Unsupported governance fact         | Who owns VendorData and what is its SLA?                |
| Ambiguous object summary            | Tell me about the DimVehicle table.                     |
| Canonical object summary            | Tell me about Sonic_DW.dbo.Dim_Vehicle.                 |
| Ambiguous lineage                   | Show me the lineage of the FactOpportunity table.       |
| Canonical lineage                   | Show me the lineage of Sonic_DW.dbo.FactOpportunity.    |
| Alias lookup                        | Find dimvehicle.                                        |
| Alias lookup with underscore        | Find fact_opportunity.                                  |
| Column question                     | What columns are surfaced for Sonic_DW.dbo.Dim_Vehicle? |
| Unsupported freshness/certification | Is VendorData fresh and certified?                      |
| Unsupported lifecycle/status        | Is Sonic_DW.dbo.FactOpportunity active or deprecated?   |

## Guardrails Confirmed

- Rovo artifact pages are under `Sonic Data Lineage / AI Retrieval Artifacts`.
- Rovo artifacts are not placed under the human `Database Catalog`, `Data Product Catalog`, or removed `High-Value Assets` sections.
- Locator rows include required fields and database-level entries.
- Normalized aliases such as `DimVehicle` and `FactOpportunity` are present.
- Ambiguous normalized names route to `Rovo Ambiguity Context 001`.
- Exact canonical prompts can route to object summary and lineage context pages.
- Canonical human page links are present where the corresponding human dry-run page exists.
- Unsupported owner, SLA, lifecycle/status, live freshness, and certification facts are marked as not surfaced in metadata.
- Raw rows, sample values, secrets, credentials, and connection strings were not exposed by the validator.

## Remaining Gate

FDP-06 is ready for review. Live Confluence publication of these Rovo AI retrieval artifacts still requires explicit approval.
