# Database Catalog And Rovo Work Packets

This document groups `docs/DATABASE_CATALOG_MEDIUM_BACKLOG.md` into six
execution packets. Each packet is intended to fit a balanced Codex run at normal
speed with medium thinking.

No packet authorizes live Confluence publish, archive, delete, or move unless
the user explicitly approves a reviewed dry run.

## Token Budget Summary

| Packet | Backlog Items                                              | Estimated Tokens | Recommended Mode                              |
| ------ | ---------------------------------------------------------- | ---------------: | --------------------------------------------- |
| WP-01  | DCAT-001, DCAT-002                                         |         80k-130k | Balanced Codex, normal speed, medium thinking |
| WP-02  | DCAT-003, DCAT-004, DCAT-005, DCAT-006, DCAT-007           |        220k-340k | Balanced Codex, normal speed, medium thinking |
| WP-03  | DCAT-008, DCAT-009, DCAT-010                               |        140k-230k | Balanced Codex, normal speed, medium thinking |
| WP-04  | DCAT-011, DCAT-012                                         |         90k-150k | Balanced Codex, normal speed, medium thinking |
| WP-05  | DCAT-013, DCAT-014, DCAT-015, DCAT-016, DCAT-017, DCAT-018 |        230k-360k | Balanced Codex, normal speed, medium thinking |
| WP-06  | DCAT-019, DCAT-020                                         |         90k-140k | Balanced Codex, normal speed, medium thinking |

Total expected range: 850k-1.35M tokens.

Inefficient execution, especially one fresh run per backlog item, may exceed
1.5M tokens because each run must reload the same ADRs, packets, and generator
context.

## Required Reading For Every Packet

Before starting any packet, read:

1. `AI_README.md`
2. `AGENTS.md`
3. `docs/DATABASE_CATALOG_MEDIUM_BACKLOG.md`
4. `docs/adr/ADR-013-Complete-Database-Catalog-And-Object-Library-Pages.md`
5. `docs/adr/ADR-014-Canonical-Object-Catalog-Trust-Signals-And-Medium-Backlog.md`
6. `docs/adr/ADR-015-Rovo-Optimized-AI-Retrieval-Artifacts.md`
7. `docs/CONFLUENCE_DATABASE_CATALOG_LAYOUT.md`
8. `docs/CODEX_CONFLUENCE_DATABASE_CATALOG_PACKET.md`
9. `docs/ROVO_AI_RETRIEVAL_ARTIFACTS_CONTRACT.md`
10. `docs/CODEX_ROVO_AI_RETRIEVAL_PACKET.md`

## Global Guardrails

- Dry-run first.
- Do not publish live Confluence changes without explicit user approval.
- Do not archive, delete, or move Confluence pages without explicit user
  approval.
- Do not infer owner, data steward, SLA, lifecycle/status, live freshness, or
  certification from weak metadata.
- Do not publish secrets, credentials, connection strings, raw rows, or sample
  values.
- Do not treat Rovo as the lineage engine. Rovo retrieves and explains facts
  computed by deterministic lineage/catalog logic.
- Do not mix Rovo retrieval artifacts into the human `Database Catalog` tree.

## WP-01: Evidence Trust And Tags

Backlog items: DCAT-001, DCAT-002

Estimated tokens: 80k-130k

### Goal

Create the evidence contract needed by every later human and Rovo page:
confidence fields, missing-facts handling, and deterministic tags.

### Scope

- Add object-page evidence fields for:
  - `lineage_confidence`
  - `description_confidence`
  - `profile_confidence`
  - `documentation_confidence`
  - `not_surfaced_facts`
- Add deterministic tag assignment for:
  - `high-use`
  - `profiled`
  - `lineage-hotspot`
  - `review-needed`
- Keep `high-value` human-reviewed only.
- Write tag reasons into evidence packets.

### Deliverables

- Updated dry-run evidence packet shape.
- Tag assignment helper or equivalent deterministic implementation.
- A small fixture or dry-run sample showing trust fields and tag reasons.
- Validation or checks proving no LLM is used for tag assignment.

### Acceptance Criteria

- One dry-run object page evidence packet contains all confidence fields.
- Missing owner, SLA, live freshness, lifecycle/status, and business definition
  show as `not surfaced in metadata` when absent.
- Schema object rows can show tags and tag reasons.
- `high-value` does not appear unless explicitly supplied by reviewed input.
- No live Confluence write occurs.

### Stop Conditions

Stop and ask for stronger review before changing ingestion, parser, extractor,
or semantic-lineage scoring behavior.

## WP-02: Human Catalog Object Library Foundation

Backlog items: DCAT-003, DCAT-004, DCAT-005, DCAT-006, DCAT-007

Estimated tokens: 220k-340k

### Goal

Make the human `Database Catalog` usable as a complete object library for one
pilot slice.

Recommended slice: `Sonic_DW.dbo`

### Scope

- Generate a complete schema object table for one schema.
- Generate thin canonical object pages for one object type.
- Add aliases/search metadata.
- Add missing-facts sections.
- Add backlinks and related navigation.

### Deliverables

- Dry-run schema page with grouped object tables.
- Dry-run thin canonical object pages under:

```text
Database Catalog / Sonic_DW / dbo / <ObjectName>
```

- Evidence packets with aliases, confidence, tags, missing facts, and backlinks.
- Local dry-run output that can be reviewed as markdown or HTML.

### Acceptance Criteria

- Every cataloged object in the selected schema appears once on the schema page.
- Counts reconcile to the evidence packet.
- Thin object pages include identity, tags, columns, upstream/downstream counts,
  profile availability, confidence, evidence links, backlinks, aliases, and
  missing facts.
- Pages do not show `Owner: Data Team` as a generated fallback.
- Pages do not infer live freshness or lifecycle/status.
- No pages are generated under `High-Value Assets`.
- No live Confluence write occurs.

### Stop Conditions

Stop if the generator cannot reconcile object counts for `Sonic_DW.dbo`; do not
publish partial inventory as if it were complete.

## WP-03: Cleanup Reporting, Promotion Rules, And Human Validators

Backlog items: DCAT-008, DCAT-009, DCAT-010

Estimated tokens: 140k-230k

### Goal

Protect the human catalog from duplicate page paths, vague rich prose, and
noncanonical page generation.

### Scope

- Report superseded schema pages such as `Schema - Sonic_DW.dbo`.
- Report superseded high-value pages such as
  `High-Value Object - Sonic_DW.dbo.Dim_Vehicle`.
- Add deterministic rich object page promotion rules.
- Update human catalog validators for canonical IA and trust signals.

### Deliverables

- Dry-run duplicate/superseded page report.
- Promotion criteria for rich object pages.
- Validator coverage for:
  - noncanonical schema titles;
  - object pages under `High-Value Assets`;
  - missing complete schema object inventory;
  - missing confidence, aliases, backlinks, or missing-facts sections;
  - generic unsupported prose.

### Acceptance Criteria

- Dry-run report distinguishes `replace`, `archive candidate`, and
  `manual review`.
- Count/evidence mismatches between duplicate pages are surfaced.
- Rich prose uses bounded evidence packets only.
- Validator rejects generic summaries such as `This object handles data`.
- Validator fails fixtures for `Schema - Sonic_DW.dbo` and
  `High-Value Object - ...` under the old branch.
- No live archive, delete, move, or publish occurs.

### Stop Conditions

Stop before any cleanup. Cleanup is a separate explicit user approval after
canonical replacements exist.

## WP-04: End-To-End Pilot Dry Run And Publish Packet

Backlog items: DCAT-011, DCAT-012

Estimated tokens: 90k-150k

### Goal

Prove the human catalog pattern end to end for `Sonic_DW.dbo` and prepare a
review packet for a possible later live publish.

### Scope

- Run or generate the end-to-end dry-run output for:
  - database page update;
  - complete `dbo` schema page;
  - thin canonical table pages;
  - tag evidence;
  - duplicate/superseded-page report.
- Prepare a reviewed live publish packet.

### Deliverables

- Dry-run output location.
- Dry-run summary with object counts and generated page counts.
- Page list to create/update.
- Superseded page list requiring explicit cleanup approval.
- Known gaps.
- Rollback plan.
- Recommendation on whether the pilot is ready for user approval.

### Acceptance Criteria

- Dry-run output is reviewable in local markdown or HTML.
- Object counts reconcile.
- The publish packet separates canonical page creation from cleanup.
- The user can approve or reject live publish from the packet.
- No live action is taken by this packet itself.

### Stop Conditions

Stop if the dry run produces pages outside the approved `Sonic Data Lineage`
families or mixes AI retrieval pages into the human catalog.

## WP-05: Rovo Retrieval Surface

Backlog items: DCAT-013, DCAT-014, DCAT-015, DCAT-016, DCAT-017, DCAT-018

Estimated tokens: 230k-360k

### Goal

Create the Rovo retrieval layer that lets Rovo answer database, object, and
lineage questions from compact scoped Confluence pages.

Target prompts:

```text
Tell me about the database VendorData.
Tell me about the DimVehicle table.
Show me the lineage of the FactOpportunity table.
```

### Scope

- Generate `Rovo Start Here`.
- Generate Rovo Object Locator rows for one slice.
- Generate Rovo Database Context pages.
- Generate Rovo Object Summary Context pages.
- Generate Rovo Upstream and Downstream Context pages.
- Generate Rovo Ambiguity Context.

Suggested initial slice:

```text
VendorData database
Sonic_DW.dbo requested objects
DimVehicle
FactOpportunity
```

### Deliverables

- `Rovo Start Here` dry-run page.
- Locator pages with database-level and object-level entries.
- Database context for `VendorData`.
- Object summary context for `DimVehicle`.
- Upstream/downstream context for `FactOpportunity`.
- Ambiguity groups for duplicate or normalized lookup keys.
- Canonical human page links where available.

### Acceptance Criteria

- `VendorData` resolves as a database.
- `DimVehicle` resolves to a canonical object or clear ambiguity group.
- `FactOpportunity` lineage can be answered from upstream/downstream context.
- Locator rows include `lookup_key`, `canonical_id`, `type`, `database`,
  `schema`, `object`, `aliases`, `quick_context_page`,
  `canonical_human_page`, and `confidence`.
- Context pages are split by intent and kept near the configured size targets.
- Unsupported owner, SLA, lifecycle/status, live freshness, and certification
  facts are marked `not surfaced in metadata`.
- No live Confluence write occurs.

### Stop Conditions

Stop if object identity is ambiguous and no deterministic ambiguity group can
be produced. Do not let an LLM choose the canonical object.

## WP-06: Rovo Evaluation And Retrieval Validators

Backlog items: DCAT-019, DCAT-020

Estimated tokens: 90k-140k

### Goal

Make Rovo quality measurable before broad publish and enforce the retrieval
artifact contract.

### Scope

- Add a Rovo evaluation prompt set with up to 50 prompts.
- Add or update validators for locator/context artifacts.
- Validate size limits, required fields, database locator entries, ambiguity
  handling, canonical human links, and safety rules.

### Deliverables

- Evaluation prompt file for Rovo answer checks.
- Expected answer metadata:
  - expected canonical id;
  - expected retrieval page;
  - expected ambiguity behavior;
  - forbidden invented facts.
- Validator checks for Rovo artifact structure and safety.
- Dry-run validation report.

### Acceptance Criteria

- Evaluation includes prompts for `VendorData`, `DimVehicle`, and
  `FactOpportunity`.
- Evaluation includes unsupported owner, SLA, lifecycle/status, live freshness,
  and certification prompts.
- A fixture without database locator rows fails.
- A fixture without ambiguity groups for duplicate lookup keys fails or warns.
- A fixture over the configured page-size limit produces a split
  recommendation.
- Raw rows, sample values, secrets, credentials, and connection strings are not
  published.
- No live Confluence write occurs.

### Stop Conditions

Stop before broad live publish. A successful evaluation run is evidence for a
publish request, not approval to publish.

## Recommended Run Sequence

1. WP-01: establish trust fields and tags.
2. WP-02: build the human object library pilot.
3. WP-03: add cleanup reporting and validators.
4. WP-04: prove the human pilot end to end.
5. WP-05: build Rovo retrieval artifacts using the stable human catalog links.
6. WP-06: evaluate and validate Rovo behavior.

## Recommended User Approval Gates

Ask for user review after:

1. WP-02, because this is the first visible human catalog shape.
2. WP-04, because this produces the first publish packet.
3. WP-05, because this is the first visible Rovo retrieval shape.
4. WP-06, because evaluation results decide whether broad publish is sensible.

## Credit Estimate Template

Use the user's current token-to-credit conversion rate:

```text
estimated credits = estimated tokens / tokens per credit
```

For example, if `1 credit = 10,000 tokens`, the six packets estimate as:

| Packet | Token Estimate | Credit Estimate |
| ------ | -------------: | --------------: |
| WP-01  |       80k-130k |            8-13 |
| WP-02  |      220k-340k |           22-34 |
| WP-03  |      140k-230k |           14-23 |
| WP-04  |       90k-150k |            9-15 |
| WP-05  |      230k-360k |           23-36 |
| WP-06  |       90k-140k |            9-14 |
| Total  |     850k-1.35M |          85-135 |
