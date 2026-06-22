# Codex Rovo Automated Onboarding Packet

Use this packet when building the npm-driven onboarding workflow.

This packet exists to reduce future Codex cost. After implementation, normal
database onboarding should run through npm rather than Codex orchestration.

## Required Reading

1. `AI_README.md`
2. `AGENTS.md`
3. `docs/adr/ADR-018-Automated-Npm-Catalog-Onboarding-With-Rovo-Hard-Gate.md`
4. `docs/ROVO_AUTOMATED_ONBOARDING_CONTRACT.md`
5. `docs/adr/ADR-017-Rovo-Assisted-Plain-English-Catalog-Descriptions.md`
6. `docs/ROVO_DESCRIPTION_GENERATION_CONTRACT.md`
7. `docs/CODEX_ROVO_DESCRIPTION_GENERATION_PACKET.md`

## Hard Stop

Start with packet `ROVOAUTO-01` only.

After `ROVOAUTO-01`, stop and report the readback. Do not proceed to the rest of
the automation build until the user explicitly confirms the Rovo output path is
usable.

## Pilot Scope

```text
Server: D1-SQL-07A\INST1
Database: Organization
Initial object count: one evidence packet only for the spike
Publish mode: no live catalog publish in ROVOAUTO-01
Description LLM: Rovo only
```

## ROVOAUTO-01 Allowed Work

- Create a minimal evidence packet fixture from existing metadata or a safe
  hand-built test packet.
- Stage hidden Rovo context for one test item if needed.
- Configure or document the Rovo invocation path.
- Trigger Rovo directly or through an Atlassian automation bridge.
- Retrieve structured output.
- Validate the output against
  `docs/ROVO_DESCRIPTION_GENERATION_CONTRACT.md`.
- Write the spike readback.

## ROVOAUTO-01 Not Allowed

- Full Organization metadata extraction.
- Full catalog page generation.
- Live Confluence catalog publish.
- Bulk Rovo generation.
- Codex-authored business descriptions.
- Broad connector/framework refactors.

## Spike Readback Questions

The readback must answer:

1. What Rovo invocation path was tested?
2. Could Node.js trigger or stage the request without Codex acting as LLM?
3. Could Node.js retrieve Rovo output?
4. Was the output structured enough for deterministic import?
5. Did validation pass?
6. What failed or looked risky?
7. Should the project proceed with Option B, pivot to an automation bridge, or
   fall back to semi-automated staging?

## Success Criteria

`ROVOAUTO-01` passes only when:

- one evidence packet reaches Rovo;
- Rovo produces usable structured output;
- Node.js retrieves it;
- validation passes or produces deterministic failures;
- readback proves Codex did not write the description.
