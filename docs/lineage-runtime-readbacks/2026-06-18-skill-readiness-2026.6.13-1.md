# Skill Readiness Smoke Check - Runtime Package 2026.6.13-1

## Purpose

Validate that the Sonic lineage skill answer pattern can use the published
runtime package as the primary source for common lineage, impact, profile,
confidence, and unresolved-fact prompts.

The check is package-only. It does not query Confluence, SQL Server, or local
source markdown.

## Command

```powershell
$env:LINEAGE_RUNTIME_PACKAGE_ROOT='tmp\rtpkg'
npm run lineage:runtime:skill-check
```

## Package

| Field                | Value                                                              |
| -------------------- | ------------------------------------------------------------------ |
| Package              | `sonic-data-lineage-runtime`                                       |
| Version              | `2026.6.13-1`                                                      |
| Runtime content hash | `ab840383d8e4f9b1e1036523965536b03d23f2270959025d63a658f4daeece6e` |
| Focus object         | `L1-5FSQL-01.Sonic_DW.dbo.factFIRE`                                |
| Focus database       | `Sonic_DW`                                                         |

## Result

```json
{
  "status": "passed",
  "commonIntentCards": 9,
  "profileIndexSafe": true,
  "confluenceUsed": false,
  "localSourceMarkdownUsed": false,
  "pathGuessingUsed": false,
  "failures": []
}
```

## Prompt Coverage

| Prompt                                                               | Primary artifacts                                                                                                                                                   |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `what uses factFIRE?`                                                | `answers/downstream/by-object-id/a489fe2e3fad0e62.json`, `context-packs/objects/by-id/a489fe2e3fad0e62.json`                                                        |
| `what feeds factFIRE?`                                               | `answers/upstream/by-object-id/a489fe2e3fad0e62.json`                                                                                                               |
| `what breaks if factFIRE changes?`                                   | `answers/downstream/by-object-id/a489fe2e3fad0e62.json`, `context-packs/objects/by-id/a489fe2e3fad0e62.json`                                                        |
| `how many times is factFIRE used?`                                   | `answers/usage-count/by-object-id/a489fe2e3fad0e62.json`                                                                                                            |
| `profile summary for factFIRE`                                       | `answers/profile-teaser/by-object-id/a489fe2e3fad0e62.json`, `profile-index/by-object-id/L1-5FSQL-01.Sonic_DW.dbo.factFIRE--a489fe2e3f.json`                        |
| `show column impact for factFIRE`                                    | `answers/upstream/by-object-id/a489fe2e3fad0e62.json`, `answers/downstream/by-object-id/a489fe2e3fad0e62.json`, `context-packs/objects/by-id/a489fe2e3fad0e62.json` |
| `database summary for Sonic_DW`                                      | `answers/catalog/databases.json`                                                                                                                                    |
| `top-used Sonic_DW objects`                                          | `indexes/top-used/Sonic_DW--41bf6ee8e4.json`                                                                                                                        |
| `explain confidence for factFIRE`                                    | `answers/summary/by-object-id/a489fe2e3fad0e62.json`, `context-packs/objects/by-id/a489fe2e3fad0e62.json`                                                           |
| `explain ambiguity, stale source, and unresolved facts for factFIRE` | `answers/summary/by-object-id/a489fe2e3fad0e62.json`, `latest.json`                                                                                                 |

## Notes

- The downstream card separates business consumers, maintenance reads, and
  orchestrators.
- The profile answer routes through `answers/profile-teaser/**` and then
  `profile-index/**`.
- The column-impact answer is intentionally honest: `factFIRE` compact context
  exposes table-level column count and SSIS mapping artifacts, not a complete
  column-name impact card.
- Every prompt result includes an evidence line with package version, runtime
  content hash, and artifact paths.
