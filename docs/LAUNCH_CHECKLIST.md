# Phase 10 - Launch Checklist

**Date**: May 8, 2026  
**Release Target**: v1.0.0

## Checklist Status

Use this as the formal launch sign-off sheet for production go-live.

## Pre-Launch

- [ ] Confirm `main` branch is green (lint + tests passing)
- [ ] Confirm OpenAPI spec matches deployed API surface
- [ ] Confirm environment variables set for production
- [ ] Confirm backup/restore procedures tested
- [ ] Confirm monitoring and alerting channels active

## Security & Access

- [ ] Entra ID app registration validated for production tenant
- [ ] Admin users and support users provisioned
- [ ] JWT and secret management reviewed
- [ ] Branch protections and PR checks enabled

## Data & Operations

- [ ] Initial markdown corpus validated (`/api/v1/ingestion/validate`)
- [ ] Initial ingestion/index load completed (`/api/v1/ingestion/load`)
- [ ] Health endpoints verified (`/health`, `/health/performance`)
- [ ] Runbook reviewed with on-call owners

## Functional Smoke Tests

- [ ] Auth login and `/api/v1/auth/me` success
- [ ] Search and discovery responses return expected payloads
- [ ] Reporting exports (CSV/XLSX/PDF) confirmed
- [ ] Integrations endpoints verified (settings, webhooks, links, CI/CD checks)

## Launch Approval

- [ ] Product owner approval
- [ ] Engineering lead approval
- [ ] QA sign-off recorded
- [ ] Go-live communication sent

## Post-Launch (First 24 Hours)

- [ ] Monitor API error rate and p95 latency
- [ ] Monitor authentication failures and permission errors
- [ ] Confirm no ingestion/indexing regressions
- [ ] Capture and triage launch feedback/issues

## Sign-Off

- [ ] Release Lead
- [ ] QA Lead
- [ ] Product Owner
