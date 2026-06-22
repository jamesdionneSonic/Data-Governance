# Team Codex Lineage Smoke Prompts

## Purpose

Use these prompts to confirm that two teammates using the same approved runtime
package and `$sonic-lineage-consumer` skill get the same baseline behavior.

Run this suite after installing the consumer kit, changing the skill, changing
package-cache behavior, or approving a new package version.

## Before Running

1. Open Codex from the consumer-kit repository root.
2. Invoke `$sonic-lineage-consumer`.
3. Read `docs/SONIC_LINEAGE_RUNTIME_CONSUMER_CONTRACT.md`.
4. Confirm the package version and runtime content hash.
5. Stop if the skill emits a package currency warning for a decision-grade
   answer.

Every decision-grade answer must include:

```text
Evidence: package <version>, hash <runtime_content_hash>; artifacts: <paths>.
```

## Prompt Suite

| ID        | Prompt                                                                                                                                                                                                                          | Expected behavior                                                                                                                                      |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SMOKE-001 | `$sonic-lineage-consumer` then `Use approved package mode. What feeds L1-5FSQL-01.Sonic_DW.dbo.factFIRE? Include version, hash, and artifact paths.`                                                                            | Uses package answer cards/context pack first; names upstream evidence; includes version/hash evidence line                                             |
| SMOKE-002 | `$sonic-lineage-consumer` then `Use approved package mode. What uses L1-5FSQL-01.Sonic_DW.dbo.factFIRE? Include version, hash, and artifact paths.`                                                                             | Uses downstream/usage artifacts; does not search Confluence; includes evidence line                                                                    |
| SMOKE-003 | `$sonic-lineage-consumer` then `Trace SSIS package VehicleMart.DimCarGurusDealer.DimCarGurusDealer.dtsx. Identify source reads, lookup reads, target maintenance, writes, package calls, mapping evidence, and support impact.` | Uses `ssis/**` package artifacts; separates reads, writes, calls, and mappings; does not edit generators                                               |
| SMOKE-004 | `$sonic-lineage-consumer` then `I think the package classified a source/target edge wrong. Help me draft a rule recommendation. Do not change ingestion code.`                                                                  | Produces a structured recommendation using `recommendations/templates/rule-recommendation.md`; cites package artifacts and raw evidence only if needed |
| SMOKE-005 | `$sonic-lineage-consumer` then `Explain the confidence, ambiguity, stale-source, and unresolved facts for L1-5FSQL-01.Sonic_DW.dbo.factFIRE.`                                                                                   | Explains confidence and caveats from package artifacts; reports package generation/currency context                                                    |

## Pass Criteria

The suite passes when:

- every answer cites package version and runtime content hash
- artifact paths are package-advertised paths
- no answer relies on Confluence page-body search
- no answer relies on private local source markdown for ordinary questions
- SSIS output follows the package-first support-doc workflow
- recommendation output is structured and does not modify engine code
- confidence/caveat output is plain English and includes unresolved or stale
  caveats when present

## Fail Criteria

Stop and ask a maintainer when:

- package version/hash is missing
- package currency warning appears for a decision-grade answer
- a path is guessed instead of advertised
- raw evidence is used without explaining why package artifacts were not enough
- Codex tries to edit ingestion, parser, extractor, generator, rebuild, or
  generated catalog files
