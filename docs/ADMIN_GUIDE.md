# Admin Guide

## Overview

This guide covers platform administration: users, permissions, ingestion, reporting operations, and health monitoring.

You can open this guide directly from the application via **Help Center**.

## Quick Admin Tasks

Use this list when you need to act fast:

1. Check [Troubleshooting FAQ](TROUBLESHOOTING_FAQ.md) if a user reports access errors.
2. Review `/health` if the app feels slow or unavailable.
3. Use `/api/v1/admin/users` to verify roles.
4. Validate ingestion before loading new markdown.
5. Review audit and activity logs before making permission changes.

## 1) User and Role Management

Use admin endpoints under `/api/v1/admin`:

- `GET /users`: list users
- `POST /users`: create or upsert user
- `PUT /users/:userId`: update user profile or role
- `POST /users/:userId/deactivate` and `/reactivate`

Recommended controls:

- Keep `Admin` assignments minimal.
- Grant least privilege by default (`Viewer` / `Analyst`).
- Audit role changes regularly.
- When in doubt, check the audit log before changing permissions again.

## 2) Data Ingestion and Indexing

Use `/api/v1/ingestion`:

- `POST /validate` before production loads
- `POST /load` to parse markdown and index objects
- `GET /status` for service readiness

Operational pattern:

1. Validate markdown structure.
2. Load/index data.
3. Refresh API caches (automatic through app cache initialization path).

## 3) Reporting Administration

Use `/api/v1/reporting`:

- Export endpoints for catalog, dependency reports, and visualizations.
- Scheduling endpoints for recurring reports.
- Shared-link endpoints for controlled visualization sharing.

Guidance:

- Use short TTL values for shared links.
- Restrict schedule recipient lists to approved domains.

## 4) Performance and Reliability

Monitoring endpoints:

- `GET /health`
- `GET /health/performance`

Load-test command:

- `npm run perf:load`

Target:

- Maintain API p95 below `200ms` under representative load.

## 5) Security Practices

- Rotate JWT and Entra secrets regularly.
- Use HTTPS in all non-local environments.
- Keep audit logs and permission changes reviewed.
- Pin dependency updates through CI validation.

## 6) Incident Response Quick Steps

1. Check `/health` and `/health/performance`.
2. Review backend logs and latest deployment changes.
3. Validate auth token and role claims.
4. Re-run ingestion if metadata/index drift is suspected.
5. Roll back to the last known good deployment if needed.

## Friendly Reminders

- Use the fewest permissions that still let the user do their job.
- Make one change at a time when you are troubleshooting.
- Capture the `requestId` before escalating an issue.

## Documentation Routing

- End users should start with [Help Center](HELP_CENTER.md).
- Technical and engineering references are indexed in [Documentation Portal](README.md).
