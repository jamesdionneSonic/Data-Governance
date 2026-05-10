# Documentation Audit Register (May 2026)

This register captures a full inventory pass of the documentation library and how each asset is currently exposed.

## Audit Summary

- Scope: all files currently present under `docs/`.
- Outcome: all discovered docs are indexed in [Documentation Portal](README.md).
- End-user exposure: selected user-centric docs are now available in-app under **Help & Docs**.
- Next cadence: review monthly or on each release cut.

## Inventory Matrix

| Document | Primary Audience | Category | In-App Surface | Status |
|---|---|---|---|---|
| ADMIN_GUIDE.md | Admin | Operations | Yes | Current |
| BRANCH_PROTECTION_SETUP.md | Engineering | DevOps | No | Current |
| CLOUD_MIGRATION_RUNBOOK.md | Operations | Runbook | No | Current |
| COMPETITIVE_UX_ANALYSIS.md | Product/Design | Research | No | Current |
| DEPLOYMENT_GUIDE.md | Operations | Deployment | No | Current |
| DOCUMENTATION_VISUAL_AUDIT_2026.md | Product/Design | Audit | No | Current |
| ENTERPRISE_ARCHITECTURE.md | Engineering | Architecture | No | Current |
| GO_LIVE_RUNBOOK.md | Operations | Runbook | No | Current |
| HELP_CENTER.md | End User | Help | Yes | Current |
| LAUNCH_CHECKLIST.md | Operations | Checklist | No | Current |
| LINEAGE_DETECTION_RESEARCH.md | Engineering | Research | No | Current |
| LINEAGE_IMPLEMENTATION_GUIDE.md | Engineering | Technical Guide | No | Current |
| LINEAGE_QUICK_REFERENCE.md | End User/Engineer | Quick Reference | Yes | Current |
| LOCAL_DEV_SETUP.md | Engineering | Setup | No | Current |
| MARKET_ANALYSIS.md | Product | Research | No | Current |
| OPENAPI.yaml | Engineering | API Reference | No | Current |
| PHASE9_TEST_MATRIX.md | QA/Engineering | Testing | No | Current |
| PRODUCT_REQUIREMENTS.md | Product | Requirements | No | Current |
| PROJECT_BACKLOG.md | Product/Engineering | Planning | No | Current |
| QA_TEST_PLAN.md | QA | Testing | No | Current |
| README.md | All | Index | Yes | Current |
| RELEASE_NOTES_v0.6.0.md | All | Release Notes | No | Current |
| RELEASE_NOTES_v1.0.0.md | All | Release Notes | No | Current |
| SCORING_CALIBRATION_MATRIX.md | Engineering | Calibration | No | Current |
| SQL_SERVER_CONNECTION_GUIDE.md | Engineer/Admin | Guide | No | Current |
| SQL_SERVER_IMPLEMENTATION_GUIDE.md | Engineering | Technical Guide | No | Current |
| SQL_SERVER_QUICK_REFERENCE.md | End User/Engineer | Quick Reference | Yes | Current |
| TROUBLESHOOTING_FAQ.md | End User | Help | Yes | Current |
| USER_GUIDE.md | End User | Help | Yes | Current |
| VIDEO_WALKTHROUGH_SCRIPT.md | Enablement | Training | No | Current |

## Notes

- In-app docs currently prioritize high-frequency user and admin guidance.
- Highly technical implementation documents remain available in the documentation portal and repository.
- To expand in-app coverage, add the doc key to `src/api/docs.js` and it appears in the UI docs navigator.
