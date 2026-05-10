# Release Notes - v0.6.0

## Release Date

May 8, 2026

## Summary

This release completes Phase 6 (Reporting & Polish), including export/reporting APIs, backend performance tuning instrumentation, caching, documentation, and release-readiness artifacts.

## Highlights

### Reporting and Export

- Catalog export in CSV and Excel-compatible formats
- Dependency report export as PDF bytes
- Visualization export in SVG/PNG
- Shareable read-only visualization links with TTL
- Scheduled report creation, listing, and manual execution

### Performance and Optimization

- Request performance middleware added
- API performance summary endpoint (`/health/performance`)
- TTL caching for discovery/reporting heavy read routes
- Load-test utility added (`npm run perf:load`)

### Documentation and Release Artifacts

- User guide
- Admin guide
- OpenAPI specification
- Deployment guide
- Troubleshooting FAQ
- Video walkthrough script

## Validation

- Lint: passing
- Unit tests: passing (`npm test`)
- Performance test harness: available for p95 validation

## Known Limitations

- Frontend Lighthouse automation is not included in this backend-focused repository.
- Some routes still rely on mocked/in-memory behavior suitable for MVP/dev mode.

## Upgrade Notes

- No breaking API changes introduced in this release.
- New script available:
  - `npm run perf:load`