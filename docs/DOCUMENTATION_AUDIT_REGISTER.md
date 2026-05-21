# Documentation Audit Register (May 2026)

This register captures a full inventory pass of the documentation library and how each asset is currently exposed.

## Audit Summary

- Scope: all files currently present under `docs/`.
- Outcome: all discovered docs are indexed in [Documentation Portal](README.md).
- End-user exposure: selected user-centric docs are now available in-app under **Help Center**.
- Next cadence: review monthly or on each release cut.

## 2026 Vuetify + Docs Parity Closure

### Findings

- UI migration to Vuetify required a terminology parity check across user-facing and admin-facing docs.
- A small set of legacy references still used `Help & Docs` and `Admin Center` labels.
- Canonical IA labels in docs remained aligned to: **Workspace**, **Govern**, **Deliver**, **Operate**, **Support**.

### Remediation Applied

- Normalized all user-facing references from **Help & Docs** to **Help Center**.
- Normalized admin troubleshooting wording from **Admin Center** to **Administration**.
- Confirmed current Operate labels in index and user docs remain: `Connections`, `Metadata Ingestion`, `Administration`.
- Recorded UI conversion status as complete for core application controls; visualization engines (`cytoscape`, `d3`, `mermaid`) remain intentionally external and wrapped in Vuetify UI.

### Verification

- [x] Docs naming matches in-app sidebar labels.
- [x] Help routing points to [HELP_CENTER.md](HELP_CENTER.md).
- [x] Admin routing points to [ADMIN_GUIDE.md](ADMIN_GUIDE.md).
- [x] Documentation index remains complete in [README.md](README.md).

## 2026 Final Vuetify + CSS Codebase Audit (May 10)

### Findings

- Final codebase scan found obsolete legacy UI component files in `src/components/` that were no longer used by active runtime paths.
- Final stylesheet pass found legacy selectors for raw HTML controls/buttons that were no longer used after Vuetify migration.
- Visualization engines remain external and intentionally not converted to Vuetify internals.

### Remediation Applied

- Removed legacy unused files: `src/components/UserManagement.js`, `src/components/PermissionMatrix.js`, `src/components/AuditLogViewer.js`.
- Removed obsolete CSS blocks in `docker/frontend/app.css` tied to raw `input/select/textarea/button` control styling and old `.btn*` class families.
- Kept domain-specific layout/presentation CSS used by current Vuetify-wrapped screens.
- Published final audit artifact: [VUETIFY_FINAL_AUDIT_2026-05-10.md](VUETIFY_FINAL_AUDIT_2026-05-10.md).

### Verification

- [x] No remaining raw interactive control tags in active frontend template (`docker/frontend/app.js`).
- [x] Lint and syntax checks pass for final frontend updates.
- [x] Documentation indexes include final audit record.

## 2026 IA Coherence Update

### Findings

- Navigation language had drifted between UI labels and user-facing documentation.
- Governance workflows were present, but grouped inconsistently across guidance and interface text.
- Competitor patterns (Atlan, Alation, Collibra) reinforce a search-first path plus explicit governance domains.

### Remediation Applied

- Standardized product IA into five domains: **Workspace**, **Govern**, **Deliver**, **Operate**, **Support**.
- Updated in-app navigation labels to match governance workflow intent.
- Updated [USER_GUIDE.md](USER_GUIDE.md), [HELP_CENTER.md](HELP_CENTER.md), [docs/README.md](README.md), and root [README.md](../README.md) to use the same IA language.
- Added [UI_IA_AUDIT_2026.md](UI_IA_AUDIT_2026.md) for explicit UX audit evidence and implementation notes.

### Next Audit Checks

- Confirm every release note references the same canonical navigation labels.
- Add quarterly IA regression checks for sidebar grouping and help copy parity.
- Verify in-app docs navigator content remains aligned with user workflows.

## Inventory Matrix

| Document                           | Primary Audience    | Category        | In-App Surface | Status  |
| ---------------------------------- | ------------------- | --------------- | -------------- | ------- |
| ADMIN_GUIDE.md                     | Admin               | Operations      | Yes            | Current |
| BRANCH_PROTECTION_SETUP.md         | Engineering         | DevOps          | No             | Current |
| CLOUD_MIGRATION_RUNBOOK.md         | Operations          | Runbook         | No             | Current |
| COMPETITIVE_UX_ANALYSIS.md         | Product/Design      | Research        | No             | Current |
| DEPLOYMENT_GUIDE.md                | Operations          | Deployment      | No             | Current |
| DOCUMENTATION_VISUAL_AUDIT_2026.md | Product/Design      | Audit           | No             | Current |
| ENTERPRISE_ARCHITECTURE.md         | Engineering         | Architecture    | No             | Current |
| GO_LIVE_RUNBOOK.md                 | Operations          | Runbook         | No             | Current |
| HELP_CENTER.md                     | End User            | Help            | Yes            | Current |
| LAUNCH_CHECKLIST.md                | Operations          | Checklist       | No             | Current |
| LINEAGE_DETECTION_RESEARCH.md      | Engineering         | Research        | No             | Current |
| LINEAGE_IMPLEMENTATION_GUIDE.md    | Engineering         | Technical Guide | No             | Current |
| LINEAGE_QUICK_REFERENCE.md         | End User/Engineer   | Quick Reference | Yes            | Current |
| LOCAL_DEV_SETUP.md                 | Engineering         | Setup           | No             | Current |
| MARKET_ANALYSIS.md                 | Product             | Research        | No             | Current |
| OPENAPI.yaml                       | Engineering         | API Reference   | No             | Current |
| PHASE9_TEST_MATRIX.md              | QA/Engineering      | Testing         | No             | Current |
| PRODUCT_REQUIREMENTS.md            | Product             | Requirements    | No             | Current |
| PROJECT_BACKLOG.md                 | Product/Engineering | Planning        | No             | Current |
| QA_TEST_PLAN.md                    | QA                  | Testing         | No             | Current |
| README.md                          | All                 | Index           | Yes            | Current |
| RELEASE_NOTES_v0.6.0.md            | All                 | Release Notes   | No             | Current |
| RELEASE_NOTES_v1.0.0.md            | All                 | Release Notes   | No             | Current |
| SCORING_CALIBRATION_MATRIX.md      | Engineering         | Calibration     | No             | Current |
| SQL_SERVER_CONNECTION_GUIDE.md     | Engineer/Admin      | Guide           | No             | Current |
| SQL_SERVER_IMPLEMENTATION_GUIDE.md | Engineering         | Technical Guide | No             | Current |
| SQL_SERVER_QUICK_REFERENCE.md      | End User/Engineer   | Quick Reference | Yes            | Current |
| TROUBLESHOOTING_FAQ.md             | End User            | Help            | Yes            | Current |
| USER_GUIDE.md                      | End User            | Help            | Yes            | Current |
| VUETIFY_FINAL_AUDIT_2026-05-10.md  | Engineering/Product | Audit           | No             | Current |
| VIDEO_WALKTHROUGH_SCRIPT.md        | Enablement          | Training        | No             | Current |

## Notes

- In-app docs currently prioritize high-frequency user and admin guidance.
- Highly technical implementation documents remain available in the documentation portal and repository.
- To expand in-app coverage, add the doc key to `src/api/docs.js` and it appears in the UI docs navigator.
