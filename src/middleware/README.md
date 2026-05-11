# Middleware

This folder contains request pipeline behaviors for the backend API.

## Purpose

Middleware here handles:

- authentication and authorization
- request logging
- performance tracking
- centralized error responses

## Components

- `auth.js` - JWT validation and role checks
- `errorHandler.js` - shared error envelope and global error middleware
- `performanceMonitor.js` - request timing and performance metrics
- `requestLogger.js` - request/response logging

## Conventions

- Use `ApiError` for predictable operational failures.
- Keep middleware side-effect free except for its pipeline responsibility.
- Ensure all uncaught route failures flow into the global error handler.
