# Phase 10 - Go-Live Runbook

**Date**: May 8, 2026

## Purpose

Provide an operational sequence for launching the platform to production with clear rollback and verification steps.

## Quick Reference

- Primary checklist: `docs/LAUNCH_CHECKLIST.md`
- Release notes: `docs/RELEASE_NOTES_v1.0.0.md`
- Final handoff: `FINAL_RELEASE_HANDOFF.md`

## Roles

- **Release Lead**: coordinates timeline and approvals
- **Ops Engineer**: deployment execution and infra checks
- **QA Lead**: smoke validation and sign-off
- **Product Owner**: final go/no-go

## Go-Live Sequence

1. **Freeze window opens**
   - Pause non-critical merges.
   - Confirm release branch/tag.

2. **Deploy services**
   - Deploy backend and frontend containers.
   - Confirm dependencies healthy (Meilisearch, reverse proxy).

3. **Initialize data services**
   - Validate markdown corpus.
   - Trigger ingestion/load in production data path.

4. **Run smoke checks**
   - Health checks and API root.
   - Auth login and protected route check.
   - Search/discovery/reporting baseline calls.
   - Integrations baseline calls.

5. **Observe stability window (30-60 min)**
   - Error rate, latency, auth failures.
   - Resource saturation and restart loops.

6. **Announce launch**
   - Send stakeholder and support notification.
   - Publish release notes and support links.

## Rollback Criteria

Rollback immediately if any of these hold beyond 10 minutes:

- Sustained 5xx errors above agreed threshold
- Authentication failures due to deployment/config issue
- Ingestion/indexing unavailable for primary workflows
- Data integrity or critical access control regression

## Rollback Procedure

1. Restore previous stable container images.
2. Re-apply prior environment configuration.
3. Validate health and critical user paths.
4. Notify stakeholders and open incident follow-up.

## Evidence to Capture

- Deployment timestamp and version/tag
- Smoke test outputs
- Monitoring snapshots (latency/error)
- Final go-live sign-off record

## Completion Condition

The go-live is considered complete when smoke tests pass, stability-window monitoring is acceptable, and sign-off is recorded.
