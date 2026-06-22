# ADR-018: Automated NPM Catalog Onboarding With Rovo Hard Gate

## Status

Accepted

## Date

2026-06-19

## Context

ADR-017 defines Rovo-assisted plain-English catalog descriptions for new
database onboarding. The desired operating model is stronger: normal database
onboarding should run from an npm command, not from Codex orchestration, so
repeat onboarding work can approach zero Codex credits.

The initial test target remains:

```text
Server: D1-SQL-07A\INST1
Database: Organization
```

The target command shape is:

```powershell
npm run catalog:onboard -- `
  --connection D1-SQL-07A-INST1 `
  --database Organization `
  --mode incremental `
  --rovo-descriptions auto `
  --publish false
```

The major unknown is whether Rovo can be invoked programmatically, or through an
Atlassian automation bridge, and return structured output that Node.js can
validate and use. The project must not build the full automation flow until
that capability is proven.

## Decision

Build toward a single npm-driven onboarding command, but enforce a hard gate
after the first work packet.

The first work packet must prove or disprove Rovo output usability:

- Node.js can send or stage one bounded evidence packet for Rovo.
- Rovo can generate structured description output.
- Node.js can retrieve that output from a reliable location.
- The validator can accept/reject the output.
- Codex is not used as the description-writing LLM.

No later implementation packet may start until the Rovo output spike readback is
reviewed and explicitly accepted.

## Target Architecture

```text
npm catalog:onboard
  -> load saved connection
  -> extract source metadata
  -> build incremental manifest
  -> generate evidence packets
  -> score confidence
  -> publish/stage hidden Rovo context
  -> invoke Rovo or Atlassian automation bridge
  -> retrieve structured Rovo descriptions
  -> validate descriptions
  -> apply human override store
  -> generate human catalog pages
  -> dry-run or publish changed pages
  -> write readback
```

## Rovo Invocation Options

The spike may prove one of these paths.

### Direct Rovo Invocation

Node.js calls a supported Rovo or Atlassian API and receives structured output
or a job id that can be polled.

### Atlassian Automation Bridge

Node.js creates or updates a known Jira issue, Confluence page, or webhook
payload. Atlassian Automation invokes Rovo, writes structured output to a known
location, and Node.js retrieves it.

### Manual-Rejected Fallback

If neither direct invocation nor automation bridge can provide reliable
structured output, the project must stop and pivot. The fallback may still use
semi-automated Rovo staging, but that is a separate decision and not the Option
B architecture.

## Command Guardrails

The production command must default to safe behavior:

- `--publish false` by default;
- `--changed-only true` by default;
- `--rovo-descriptions auto|stage|import|template-only`;
- `--max-pages` required for broad publishes;
- `--rovo-timeout-minutes`;
- `--fail-on-rovo-error true` for `auto`;
- `--readback` always written;
- no secrets, credentials, raw rows, sample values, or connection strings in
  outputs.

## Codex Credit Boundary

After implementation, normal onboarding runs should cost zero Codex credits
because npm performs the orchestration. Codex credits are only spent when:

- building or changing the automation engine;
- debugging failures;
- adding a new source type or connector capability;
- changing page contracts or validation rules;
- performing one-off analysis outside the npm workflow.

Rovo/Atlassian usage is separate from Codex credits.

## Hard Stop Rule

After packet `ROVOAUTO-01`, stop.

Do not implement the full onboarding command, Confluence publish automation, or
bulk database onboarding until the readback answers:

```text
Can Rovo produce structured, validated, machine-retrievable descriptions from
our evidence packets without Codex acting as the LLM?
```

If the answer is no, the team must pivot before spending more implementation
credits.

## Related Documents

- `docs/adr/ADR-017-Rovo-Assisted-Plain-English-Catalog-Descriptions.md`
- `docs/ROVO_DESCRIPTION_GENERATION_CONTRACT.md`
- `docs/CODEX_ROVO_DESCRIPTION_GENERATION_PACKET.md`
- `docs/ROVO_AUTOMATED_ONBOARDING_CONTRACT.md`
- `docs/CODEX_ROVO_AUTOMATED_ONBOARDING_PACKET.md`
- `docs/ROVO_AUTOMATED_ONBOARDING_BACKLOG.md`
- `docs/ROVO_AUTOMATED_ONBOARDING_WORK_PACKETS.md`
