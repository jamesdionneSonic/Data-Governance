# Raw Evidence Access Control

## Purpose

Raw evidence helps teammates trace lineage and recommend rule improvements. It must not become a back door for editing ingestion engines or publishing unvalidated changes.

## Access Model

| Area                              | Teammate Access                    | Maintainer Access             | Notes                            |
| --------------------------------- | ---------------------------------- | ----------------------------- | -------------------------------- |
| Approved runtime package          | Read                               | Publish through pipeline      | Primary source for Codex answers |
| Generated DevOps catalog repo     | Read                               | Publish through pipeline      | Inspectable generated companion  |
| Raw evidence bundle               | Read                               | Publish through pipeline      | Only sanitized/approved evidence |
| Recommendation queue              | Create recommendation              | Review/triage/convert to work | No engine edits in intake        |
| Ingestion/parsing/generation code | No write through evidence workflow | Controlled maintainer change  | Requires tests and review        |

## Allowed Raw Evidence

- SSIS package XML or parsed SSIS evidence needed to validate package behavior
- SQL module text or generated markdown needed to verify lineage claims
- parser evidence summaries
- context packs and answer cards
- source evidence paths advertised by the approved runtime package

## Prohibited Raw Evidence

- raw row values
- sample values
- report result rows
- dashboard cell values
- unrestricted API payloads
- credentials, tokens, connection strings, vault references, or secrets
- customer names, emails, phone numbers, VINs, addresses, SSNs, or other PII values

## Required Workflow

1. Resolve the object/package from the approved runtime package.
2. Record package version and runtime content hash.
3. Open only advertised evidence paths.
4. If deeper raw evidence is needed, document why.
5. Submit findings as a recommendation in `recommendations/intake/`.
6. Maintainer reviews and decides whether to reject, request more evidence, document an exception, or create implementation work.

## Forbidden Workflow

Teammates must not use evidence review to directly modify:

- ingestion engines
- parser engines
- extractor code
- generator code
- catalog rebuild scripts
- publish scripts
- package validation gates

## Minimum Recommendation Evidence

Every recommendation must include:

- package version
- runtime content hash
- focus object or package
- observed current behavior
- expected behavior
- artifact paths
- raw evidence paths when used
- impact
- confidence
