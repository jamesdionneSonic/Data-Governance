# Modules

This folder is reserved for feature modules.

## Purpose

Feature modules should group UI behavior, view orchestration, and feature-specific state that is too large for a shared component.

## Notes

- Keep module boundaries narrow and feature-focused.
- Route all backend data access through the BFF API.
- Prefer reusable services for business rules and data shaping.
