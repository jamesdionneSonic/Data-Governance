# Troubleshooting FAQ

## Start Here

- End users: [Help Center](HELP_CENTER.md)
- Day-to-day workflows: [User Guide](USER_GUIDE.md)
- Admin operations and incidents: [Admin Guide](ADMIN_GUIDE.md)

## Authentication and Access

### Q: Why am I getting `401 Unauthorized`?

- Your token is missing, expired, or malformed.
- Re-authenticate and retry with `Authorization: Bearer <token>`.

### Q: Why am I getting `403 Forbidden`?

- Your account role does not allow this endpoint.
- Request role update from an admin.

## Discovery and Reporting

### Q: Why does discovery return `503 Data not yet loaded`?

- Markdown metadata has not been ingested yet.
- Run ingestion validation and load endpoints first.

### Q: Why is a dependency report returning `404`?

- The object ID does not exist in the cached object map.
- Confirm object IDs with search/discovery before report generation.

## Performance

### Q: How do I verify current latency?

- Check `/health/performance` for p50/p95/p99 metrics.

### Q: How do I run a load test?

- Run `npm run perf:load`.
- Tune with env vars: `PERF_BASE_URL`, `PERF_REQUESTS`, `PERF_CONCURRENCY`, `PERF_LOGIN_EMAIL`.

### Q: p95 is over 200ms. What should I do?

1. Confirm infrastructure is not resource constrained.
2. Increase cache hit rate for repeated read workloads.
3. Validate Meilisearch host/network latency.
4. Re-run load test after warm-up.

## Deployment

### Q: Service starts but endpoints fail.

- Verify environment variables and secret values.
- Confirm dependent services (Meilisearch) are reachable.
- Check backend logs and `/health` output.

### Q: How do I trace a specific API failure end-to-end?

- Capture the `requestId` from the API error response body.
- Search backend logs for the same `requestId`.
- Re-run the failing request with `x-request-id` header to correlate retries.

### Q: What happens on unhandled server exceptions?

- The service traps `unhandledRejection` and `uncaughtException`.
- It logs root cause and performs graceful shutdown.
- If shutdown exceeds timeout, process exits forcefully to avoid hung state.

### Q: How do I inspect frontend runtime errors?

- Open the Admin Center `API Error Stream` table.
- Runtime UI exceptions and unhandled promise rejections are recorded there.
- Use browser DevTools stack traces for deep debugging.

### Q: Shared visualization link says expired.

- Shared links are TTL-based.
- Generate a new link with a longer `ttlMinutes` value.
