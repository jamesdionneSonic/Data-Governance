# ADR-002: Separate Profile Run Artifacts From Queryable Profile Indexes

## Status

Accepted

## Context

Connector and profile runs produce audit evidence. The system also needs cheap lookup files for app screens and Codex skill answers. A single markdown or run-history file structure cannot serve both needs at Azure scale.

## Decision

Profile storage is split into three layers:

- operational run store for local connector and scheduler state
- sanitized run artifacts for per-run evidence
- profile indexes for latest-state query and skill access

Run artifacts may be verbose because they represent what happened in one run. Profile indexes must be compact, sharded, and optimized for lookup by database, object id, object name, column name, and flags.

Markdown summaries are allowed as human evidence, but they are not the primary profile index.

## Consequences

- Large profile answers do not require scanning all run artifacts.
- The skill can retrieve one or a few compact shards.
- Historical evidence remains available without bloating the primary answer path.
- Export code must maintain run artifacts and profile indexes as separate outputs.

## Related Documents

- `docs/PROFILE_INDEX_SPEC.md`
- `docs/BI_PROFILE_FRAMEWORK.md`
- `docs/CONNECTOR_METADATA_PROFILE_FRAMEWORK.md`
