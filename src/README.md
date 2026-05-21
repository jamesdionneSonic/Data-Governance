# Source Structure

This folder contains application source code.

For product and user-facing guidance, start at [Documentation Portal](../docs/README.md).

## Top-level folders

- `components/` reusable UI elements
- `modules/` feature modules
- `services/` business logic and integrations
- `validators/` contract and input/output validation
- `utils/` shared helper functions
- `middleware/` request pipeline behaviors

## Subfolder Guides

- [API Routes](api/README.md)
- [Services](services/README.md)
- [Middleware](middleware/README.md)
- [Utilities](utils/README.md)
- [Components](components/README.md)
- [Modules](modules/README.md)
- [Validators](validators/README.md)
- [Frontend](frontend/README.md)

## Rules

- Keep features modular and testable.
- Route UI data access through BFF endpoints.
- Validate contracts at all boundaries.
