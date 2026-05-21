# Deployment Guide

## 1) Local Docker Deployment

### Prerequisites

- Docker Engine / Docker Desktop
- Node.js 18+
- `.env` configured from `.env.example`

### Steps

1. Build and start services:

   `docker compose up -d --build`

2. Verify service status:

   `docker compose ps`

3. Verify health:

   `curl http://localhost:3000/health`

4. Verify performance endpoint:

   `curl http://localhost:3000/health/performance`

## 2) Backend-Only Local Run

1. Install dependencies:

   `npm install`

2. Start API:

   `npm run dev`

3. Run validation:

   `npm run lint && npm test`

## 3) Cloud-Oriented Deployment Notes

Use these baseline settings when deploying to cloud VMs, container apps, or Kubernetes:

- Inject environment variables via secret store.
- Enforce HTTPS and secure ingress.
- Configure external log aggregation.
- Set resource limits and readiness probes on `/health`.
- Autoscale using p95 latency and CPU thresholds.

## 4) Recommended Environment Variables

- `NODE_ENV=production`
- `PORT=3000`
- `JWT_SECRET=<secure random value>`
- `MEILISEARCH_URL=http://<meilisearch-host>:7700`
- `MEILISEARCH_MASTER_KEY=<secure key>`
- `ENTRA_CLIENT_ID`, `ENTRA_CLIENT_SECRET`, `ENTRA_TENANT_ID`

## 5) Post-Deploy Verification

1. Health check: `/health`
2. API check: `/api/v1`
3. Performance check: `/health/performance`
4. Auth login check: `POST /api/v1/auth/login`
5. Performance smoke run: `npm run perf:load`

## 6) Rollback Strategy

1. Keep versioned container tags.
2. Roll back API service to prior image tag.
3. Re-run smoke tests and `/health` checks.
4. Investigate failure using deployment logs and perf metrics.