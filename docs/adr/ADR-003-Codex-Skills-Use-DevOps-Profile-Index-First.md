# ADR-003: Codex Skills Use The DevOps Profile Index First

## Status

Accepted

## Context

Sonic users need plain-English answers that include technical object names, sources, and evidence. The skill should avoid Confluence page-body searches and should not load large markdown folders when a compact machine-readable data pack exists.

## Decision

For profile, quality, metric, sensitivity, and freshness questions, Codex skills must use the DevOps/Azure profile index as the primary source.

The skill may use run markdown as a citation or human-readable detail source after it has resolved the target object from the profile index. Confluence is a fallback for curated explanation, not the primary profile-answer source.

## Consequences

- Skill answers stay fast and token-efficient.
- Answers cite concrete profile-index and run-artifact paths.
- The profile index becomes part of the skill compatibility contract.
- DevOps data pack validation must include skill-readiness checks.

## Related Documents

- `docs/PROFILE_INDEX_SPEC.md`
- `docs/LINEAGE_RUNTIME_PACKAGE_BACKLOG.md`
- `docs/PROJECT_BACKLOG.md`
