# API Routes

This folder contains the Express route handlers for the backend-for-frontend API layer.

## Purpose

- Expose versioned REST endpoints under `/api/v1`
- Coordinate authentication and authorization
- Convert service-layer results into response payloads
- Route failures through the shared error-handling middleware

## Route Areas

- `admin.js` - user management, audit log, and metadata governance
- `auth.js` - login, callback, refresh, and session endpoints
- `classification.js` - data classification workflows
- `dashboard.js` - dashboard aggregation and admin views
- `dataProducts.js` - data product contract workflows
- `discovery.js` - search and discovery experiences
- `docs.js` - documentation library endpoints
- `glossary.js` - business glossary endpoints
- `governance.js` - governance and trust metrics
- `health.js` - health and readiness checks
- `ingestion.js` - markdown ingestion and SQL Server extraction
- `integrations.js` - integration settings and webhook workflows
- `lineage.js` - lineage query endpoints
- `marketplace.js` - access request workflows
- `objects.js` - object catalog endpoints
- `products.js` - product catalog endpoints
- `reporting.js` - reporting and export endpoints
- `search.js` - search endpoints
- `ssis.js` - SSIS extraction and lineage helpers

## Conventions

- Keep handlers thin and delegate logic to services.
- Use `sendErrorResponse()` for route-level validation and operational failures.
- Preserve response contracts expected by tests and clients.
