# ADR-001: Store Sanitized Profile Indexes In The DevOps Azure Data Pack

## Status

Accepted

## Context

The platform needs to answer profile, quality, metric, and sensitivity questions from the app and Codex skills without reconnecting to live source systems. The catalog and profile corpus will grow beyond what can be scanned cheaply from markdown during each question.

DevOps is the planned publication target for the machine-readable Azure data pack. The question is whether profile indexes can live there.

## Decision

Sanitized profile indexes may be published to the DevOps/Azure data pack.

The DevOps/Azure data pack is approved for aggregate metadata, classification flags, quality signals, metric candidates, freshness timestamps, lineage references, source object identifiers, and structured remediation errors.

The DevOps/Azure data pack is not approved for raw rows, sample values, report result rows, dashboard values, credential values, tokens, unrestricted source payloads, or sensitive value examples.

## Consequences

- The app and Codex skill can answer profile questions from repo-backed structured files.
- Profile publication must run safety validation before export.
- DevOps publication must include only compact profile intelligence, not raw data extracts.
- Profile index artifacts must cite source run artifacts so answers remain evidence-backed.

## Related Documents

- `docs/PROFILE_INDEX_SPEC.md`
- `docs/PROFILING_EXECUTION_FRAMEWORK.md`
- `docs/CONNECTOR_EXTRACTION_FRAMEWORK.md`
