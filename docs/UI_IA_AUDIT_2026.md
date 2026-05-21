# UI IA Audit 2026 (Governance Coherence Pass)

**Date:** May 2026  
**Scope:** Frontend IA and user-facing docs coherence  
**Inputs:** Existing platform UX, [COMPETITIVE_UX_ANALYSIS.md](COMPETITIVE_UX_ANALYSIS.md), [SIDEBAR_UX_RESEARCH_2026.md](SIDEBAR_UX_RESEARCH_2026.md), public competitor product pages

---

## Objective

Create a non-fractured, governance-first navigation model that matches how users actually work: discover data, validate trust/governance context, then deliver and operate.

## Key Findings

1. Existing features were strong, but IA grouping was flat and mixed operational/admin flows with analyst/governance tasks.
2. Navigation labels across UI and docs were inconsistent, causing cognitive switching costs.
3. Competitor leaders consistently use:
   - Search-first discovery
   - Trust/compliance context near discovery
   - Explicit glossary and lineage pathways
   - Persona-aware grouping

## Competitor Pattern Synthesis

- **Atlan:** Search-first control center; trust, glossary, lineage, compliance, and persona views.
- **Alation:** Linear flow of **Find → Understand → Trust → Use**.
- **Collibra:** Governance workflow depth (approval/compliance), but can become hard to navigate when IA is too policy-heavy.

## IA Remediation Implemented

### Sidebar grouped into domains

- **Workspace**
  - Command Center
  - Catalog Search
  - Lineage Explorer
- **Govern**
  - Business Glossary
  - Trust & Compliance
- **Deliver**
  - Data Products
  - Governance Insights
- **Operate**
  - Connections
  - Metadata Ingestion
  - Administration
- **Support**
  - Help Center

### UI language normalization

- Updated top bar title logic to reflect active grouped navigation labels.
- Added section headers in sidebar to make context explicit.

### Documentation parity updates

- Updated [USER_GUIDE.md](USER_GUIDE.md) workflow language to map directly to IA domains.
- Updated [HELP_CENTER.md](HELP_CENTER.md) with in-app starting path.
- Updated [README.md](README.md) and root [README.md](../README.md) with canonical navigation model.

## Validation Checklist

- [x] Existing view keys preserved (no route breakage from label changes)
- [x] Sidebar supports grouped sections while retaining collapse behavior
- [x] User-facing docs match updated navigation labels
- [x] Docs portal indexes the IA audit artifact

## Follow-Up Recommendations

1. Introduce role-aware default landing views (analyst, steward, admin).
2. Surface trust indicators consistently on all catalog result cards.
3. Add usage telemetry for sidebar click paths to monitor IA adoption.
