# PHASE7S-010 - Human Summary Quality Gate

## Purpose

Add a local quality gate for the human-centered Confluence lineage dry run.
The gate is designed to stop vague, unsupported, or misleading plain-English
summaries before any reviewed pilot can be published.

## Command

```powershell
npm run confluence:human:check
```

The check reads only local dry-run output under:

```text
data/confluence/human-catalog-dry-run/
```

It does not call Confluence and does not require live Confluence credentials.

## Current Validation Rules

The gate fails a generated page when:

- `Plain-English Summary` is too short to be useful
- the summary does not name a concrete product, schema, package, source, target,
  or object from the evidence packet
- the summary uses generic phrasing such as `handles data movement`
- the page omits the evidence hash
- the evidence packet omits source artifact paths
- missing target/source facts are not labeled with `not surfaced in metadata`
- technical evidence is not below the human summary in an expandable section
- the page appears to expose secrets, credentials, tokens, or connection-string
  values

## Smoke Checks

The script includes built-in smoke checks for:

| Smoke check                   | Purpose                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------ |
| `strong-evidence-object`      | Confirms a FIRE-style summary with named package and target evidence passes.                     |
| `weak-evidence-object`        | Confirms weak evidence can pass when missing facts are labeled honestly.                         |
| `weak-missing-fact-rejection` | Confirms a weak page fails when missing targets are not labeled with `not surfaced in metadata`. |

## Latest Result

```json
{
  "status": "passed",
  "checkedPages": 4,
  "smokeChecks": ["strong-evidence-object", "weak-evidence-object", "weak-missing-fact-rejection"]
}
```

## Notes

This is intentionally a deterministic, medium-safe guardrail. It does not use
an LLM to judge writing quality. The LLM can still be used later to draft better
plain-English text, but this check enforces the minimum evidence discipline
before publish.
