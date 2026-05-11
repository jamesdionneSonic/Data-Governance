# Utilities

This folder contains shared helpers and configuration utilities used across the backend.

## Purpose

Utilities here support:

- routing wrappers
- auth token handling
- environment and app configuration
- caching and TTL helpers

## Modules

- `apiRouter.js` - async-safe router wrapper
- `config.js` - environment and runtime configuration
- `entraConfig.js` - Entra ID configuration helpers
- `tokenManager.js` - token extraction and verification helpers
- `ttlCache.js` - lightweight TTL cache implementation

## Conventions

- Keep helpers framework-neutral where possible.
- Do not duplicate middleware or service logic here.
- Prefer explicit, testable inputs and outputs.
