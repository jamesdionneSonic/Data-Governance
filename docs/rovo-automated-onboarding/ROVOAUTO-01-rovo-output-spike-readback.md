# ROVOAUTO-01 Rovo Output Spike Readback

Generated: 2026-06-19

## Scope

This readback covers the hard-gated first work packet from
`docs/ROVO_AUTOMATED_ONBOARDING_WORK_PACKETS.md`.

Pilot target:

```text
Server: D1-SQL-07A\INST1
Database: Organization
```

ROVOAUTO-01 tested one bounded evidence packet only. It did not run full
Organization extraction, generate full catalog pages, or publish live catalog
documentation.

## Artifacts

| Artifact        | Path                                                                                    |
| --------------- | --------------------------------------------------------------------------------------- |
| Evidence packet | `data/rovo-automated-onboarding/ROVOAUTO-01/evidence-packet-organization-database.json` |
| Probe result    | `data/rovo-automated-onboarding/ROVOAUTO-01/rovo-search-probe-result.json`              |

## Invocation Paths Reviewed

### Rovo Search Connector

Tool tested:

```text
mcp__atlassian.search
```

Result:

The tool searched Jira and Confluence and returned matching pages/issues. It did
not invoke a Rovo agent and did not return generated structured description
JSON.

Conclusion:

Rovo Search alone is not a usable Option B generation path.

### Forge Rovo Agent / Automation Bridge

Atlassian developer documentation shows two relevant interaction points:

- Forge Rovo agents can be defined with prompts and actions.
- Agents can be added to Jira/Confluence Automation rules, and the response can
  be passed to later automation steps through smart values.

This suggests the likely viable Option B path is an Atlassian Automation or
Forge bridge, but that bridge is not currently exposed as a callable local
Node.js path in this repo/session.

Reference:

`https://developer.atlassian.com/platform/forge/manifest-reference/modules/rovo-agent/`

## Spike Questions

### 1. What Rovo invocation path was tested?

The exposed Rovo Search connector was tested as a direct prompt path. It behaved
as search, not as agent generation.

### 2. Could Node.js trigger or stage the request without Codex acting as LLM?

Node.js can stage an evidence packet locally. The available Rovo Search connector
can accept a query, but it cannot trigger description generation.

### 3. Could Node.js retrieve Rovo output?

Node.js could retrieve search results, but not generated Rovo description output.

### 4. Was the output structured enough for deterministic import?

No. The output was search results, not the required structure:

```json
{
  "canonical_id": "",
  "purpose": "",
  "business_use": "",
  "support_notes": [],
  "lineage_summary": "",
  "confidence_used": "strong | medium",
  "unsupported_facts": [],
  "evidence_hash": ""
}
```

### 5. Did validation pass?

No. Validation could not pass because no Rovo-generated description payload was
returned.

### 6. What failed or looked risky?

- The currently exposed connector is Rovo Search, not Rovo Agent invocation.
- A direct server-side Rovo generation API was not available in the current tool
  surface.
- Forge bridge appears designed for Forge app/UI interaction, not a simple
  local npm command by itself.
- Atlassian Automation appears promising, but requires a configured automation
  rule or Forge app bridge before Node.js can trigger and retrieve output.

### 7. Should the project proceed with Option B, pivot to an automation bridge,

or fall back to semi-automated staging?

Do not proceed to the full Option B build yet.

Recommended pivot:

Build or configure a minimal Atlassian Automation/Forge bridge as the next
decision step. The bridge must accept one evidence packet, invoke the Rovo
description agent, write structured JSON to a known Confluence page, Jira issue,
or webhook-accessible store, and let Node.js retrieve it.

If that bridge cannot be built or approved, fall back to semi-automated staging.

## Hard Stop Decision

ROVOAUTO-01 did not prove direct machine-retrievable Rovo description output.

Stop here per ADR-018. Do not implement ROVOAUTO-02 or later packets until the
team decides whether to:

1. build an Atlassian Automation/Forge bridge;
2. install/expose a direct Rovo agent invocation capability;
3. pivot to semi-automated Rovo staging.

## Codex LLM Boundary

Codex did not write a production catalog description. The only description-like
content in this packet is a bounded test evidence packet and this readback.
