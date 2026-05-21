# Services

This folder contains the domain and integration logic for the platform.

## Purpose

Services provide reusable business logic for:

- user and access governance
- audit and activity logging
- metadata normalization and validation
- search and discovery
- dependency lineage
- ingestion and SQL Server extraction
- reporting, performance, and trust scoring

## Service Areas

- `adminService.js` - users, roles, and audit events
- `activityService.js` - activity tracking and analytics
- `metadataService.js` - metadata updates, validation, and queries
- `permissionService.js` - database access checks and permission rules
- `lineageService.js` - dependency graph and impact analysis
- `searchService.js` - search orchestration and filters
- `indexService.js` - Meilisearch indexing and health checks
- `markdownService.js` - markdown parsing and metadata loading
- `sqlServerExtractor.js` - SQL Server metadata discovery
- `markdownFromSqlServer.js` - markdown generation from extracted metadata
- `dashboardService.js` - dashboard aggregations and metrics
- `discoveryService.js` - discovery insights and recommendations
- `reportingService.js` - reporting and export helpers
- `trustService.js` - trust and compliance scoring
- `integrationService.js` - integration workflows and helpers
- `productService.js`, `glossaryService.js`, `classificationService.js`, `governanceContextService.js`, `dataProductContractService.js`, `accessRequestService.js`, `performanceService.js`, `userService.js`, `visualizationService.js`, `ssisExtractor.js`

## Conventions

- Keep functions deterministic where possible.
- Throw or return structured errors that can be converted to the shared API envelope.
- Prefer small composable helpers over route-specific business logic.
