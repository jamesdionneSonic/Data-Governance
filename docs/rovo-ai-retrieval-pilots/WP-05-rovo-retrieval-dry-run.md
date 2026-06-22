# WP-05 Rovo Retrieval Dry Run

## Purpose

This dry run creates the first Rovo-optimized retrieval surface for Sonic Data
Lineage questions.

It supports these first prompts:

- `Tell me about the database VendorData.`
- `Tell me about the DimVehicle table.`
- `Show me the lineage of the FactOpportunity table.`

No live Confluence publish was performed.

## Command

```powershell
npm run confluence:rovo:dry-run
```

## Output

```text
data/confluence/rovo-ai-retrieval-dry-run
```

Generated pages:

| Page                              | Purpose                                                                                             |
| --------------------------------- | --------------------------------------------------------------------------------------------------- |
| `Rovo Start Here`                 | Tells Rovo the lookup order and unsupported-fact rules.                                             |
| `Rovo Object Locator 001`         | Resolves database, schema, and object names to canonical ids.                                       |
| `Rovo Database Context 001`       | Answers database-level questions for `VendorData`.                                                  |
| `Rovo Object Summary Context 001` | Answers object summary questions for `DimVehicle`, `Dim_Vehicle`, and `FactOpportunity` candidates. |
| `Rovo Upstream Context 001`       | Provides upstream lineage for `Sonic_DW.dbo.FactOpportunity`.                                       |
| `Rovo Downstream Context 001`     | Provides downstream lineage for `Sonic_DW.dbo.FactOpportunity`.                                     |
| `Rovo Ambiguity Context 001`      | Lists duplicate/normalized lookup-key matches such as `dimvehicle` and `factopportunity`.           |

## Dry-Run Result

| Signal              | Value |
| ------------------- | ----: |
| Pages generated     |     7 |
| Locator rows        |   500 |
| Ambiguity groups    |     8 |
| Acceptance failures |     0 |

## Review Notes

- `VendorData` resolves as a database through `Rovo Object Locator 001`.
- `DimVehicle` is intentionally ambiguous because multiple catalog objects share normalized lookup keys.
- `FactOpportunity` lineage resolves to `Sonic_DW.dbo.FactOpportunity` for upstream/downstream context, while ambiguity context still lists similarly named objects.
- Owner, data steward, SLA, lifecycle/status, live freshness, and certification are marked as not surfaced in metadata.
- Rovo pages are under `Sonic Data Lineage / AI Retrieval Artifacts`, not under the human `Database Catalog`.

## Next Packet

WP-06 should add evaluation prompts and validators for this Rovo artifact shape
before any broad publish is considered.
