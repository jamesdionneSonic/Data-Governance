# Components

This folder is reserved for reusable UI components.

## Purpose

- Shared presentation pieces used by the frontend shell
- Reusable visual building blocks for dashboards and views

## Notes

- Keep components small and composable.
- Place business logic in services or modules, not in shared UI components.
- If a component depends on backend data, access it through the BFF API layer.
