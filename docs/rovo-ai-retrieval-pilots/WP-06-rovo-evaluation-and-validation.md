# WP-06 Rovo Evaluation And Validation

## Purpose

This packet makes the Rovo retrieval dry run measurable before any broad
Confluence publish is considered.

No live Confluence publish was performed.

## Commands

```powershell
npm run confluence:rovo:validate
```

Equivalent expanded sequence:

```powershell
npm run confluence:rovo:dry-run
npm run confluence:rovo:check
```

## Evaluation Prompt Set

Tracked prompt file:

```text
docs/rovo-ai-retrieval-pilots/rovo-evaluation-prompts.json
```

Generated Confluence-ready dry-run page:

```text
data/confluence/rovo-ai-retrieval-dry-run/rovo-evaluation-prompts.md
```

Prompt coverage:

| Category                                                   | Covered |
| ---------------------------------------------------------- | ------- |
| `VendorData` database summary                              | Yes     |
| `DimVehicle` object/ambiguity summary                      | Yes     |
| `Sonic_DW.dbo.Dim_Vehicle` canonical object summary        | Yes     |
| `FactOpportunity` ambiguity handling                       | Yes     |
| `Sonic_DW.dbo.FactOpportunity` upstream/downstream lineage | Yes     |
| Alias and normalized-name lookup                           | Yes     |
| Column question without sample values                      | Yes     |
| Unsupported owner/SLA/lifecycle/freshness/certification    | Yes     |

## Validator Coverage

Script:

```text
scripts/check-rovo-ai-retrieval-dry-run.mjs
```

The validator checks:

- all required Rovo page families are present;
- all Rovo pages stay under `Sonic Data Lineage / AI Retrieval Artifacts`;
- locator rows include required fields;
- `VendorData` has a database-level locator row;
- `DimVehicle` and `FactOpportunity` aliases exist;
- database/object contexts mark unsupported governance facts as not surfaced;
- `FactOpportunity` upstream/downstream context targets the canonical object;
- ambiguity groups exist for `dimvehicle` and `factopportunity`;
- evaluation prompts include expected canonical ids, retrieval pages, expected
  behavior, and forbidden invented facts;
- page-size recommendations are produced for oversized context pages;
- raw rows, sample values, secrets, credentials, and connection strings are not
  published.

Smoke fixture coverage:

| Fixture                      | Expected Result               |
| ---------------------------- | ----------------------------- |
| Missing database locator row | Fails                         |
| Missing ambiguity groups     | Fails                         |
| Oversized context page       | Produces split recommendation |

## Latest Result

```json
{
  "status": "passed",
  "checkedPages": 8,
  "failures": []
}
```

The validator also emits one intentional smoke-test split recommendation for an
oversized fixture. That recommendation is not a failure.

## Publish Boundary

Passing this validator means the Rovo dry-run output is ready for human review.
It is not approval to publish, archive, delete, move, or replace Confluence
pages.
