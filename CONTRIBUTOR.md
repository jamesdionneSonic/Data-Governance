# Contributor Guidelines - Data Governance

Welcome to the Data Governance project! This document outlines the best practices and standards for contributing to this project. We build scalable, maintainable applications using Vue.js and Vuetify with a focus on modular architecture, thorough testing, and comprehensive documentation.

> **Non-Negotiable Engineering Guardrails:** We build with **Backend-for-Frontend (BFF)** architecture for frontend-facing APIs and follow **Infrastructure as Code (IaC) First** for all environment and platform changes.

---

## Table of Contents

1. [Architecture & Design Principles](#architecture--design-principles)
2. [Vue.js & Vuetify Best Practices](#vuejs--vuetify-best-practices)
3. [Code Organization & Modularity](#code-organization--modularity)
4. [Backend-for-Frontend (BFF) Standards](#backend-for-frontend-bff-standards)
5. [Response Validation](#response-validation)
6. [Testing Requirements](#testing-requirements)
7. [Infrastructure as Code (IaC) First](#infrastructure-as-code-iac-first)
8. [CI/CD Integration](#cicd-integration)
9. [Documentation Standards](#documentation-standards)
10. [Submission Process](#submission-process)

---

## Architecture & Design Principles

### No Monolithic Code

We strictly prohibit monolithic code structures. All features must be:

- **Decomposed into reusable components** - Each component should have a single responsibility
- **Loosely coupled** - Components should minimize dependencies on one another
- **Highly cohesive** - Related functionality should be grouped together
- **Independent testable units** - Each component can be tested in isolation

### Modular Structure

```
src/
├── components/          # Reusable Vue.js/Vuetify components
├── modules/             # Feature modules (each with own views, logic, validation)
├── services/            # Business logic and API integration
├── validators/          # Centralized validation logic
├── utils/               # Helper functions and utilities
├── middleware/          # Request/response processing
├── tests/               # Test suites (mirroring src structure)
└── config/              # Configuration and constants
```

Each module should be self-contained and re-usable across the application.

---

## Vue.js & Vuetify Best Practices

### Component Design

1. **Single Responsibility Principle**
   - Each component should handle one specific function
   - Keep components focused and minimal
   - Example: `UserCard.js` displays user data, not fetches it

2. **Props Over Global State**
   - Pass data through props for component reusability
   - Use state management sparingly, only for UI state
   - Minimize side effects and external dependencies

3. **Reusable Components**
   - Create generic, reusable components (buttons, cards, modals, forms)
   - Accept configuration through props
   - Allow customization without modifying the core component

4. **Component Composition**
   - Build complex UIs by composing smaller components
   - Avoid nested logic; extract into separate components
   - Use composition over inheritance

### Vue.js Patterns

```javascript
// ✓ GOOD - Modular, reusable component
const Button = ({ label, onClick, variant = 'primary', disabled = false }) => ({
  render() {
    return `<button class="btn btn-${variant}" ${disabled ? 'disabled' : ''}>
      ${label}
    </button>`;
  },
  events: {
    click: onClick,
  },
});

// ✗ BAD - Monolithic, hardcoded logic
const CompleteWidget = () => ({
  render() {
    // 200+ lines of mixed concerns
  },
});
```

### Vuetify Integration

1. **Lifecycle Management**
   - Properly handle component mounting and unmounting
   - Clean up event listeners and subscriptions

- Use Vuetify component APIs for UI lifecycle/state integration

2. **State Management**
   - Keep component state minimal
   - Use reactive updates for data changes
   - Avoid manual DOM manipulation

3. **Templating**
   - Use data bindings for dynamic content
   - Bind events properly to avoid memory leaks

- Leverage Vue directives for conditional rendering

---

## Code Organization & Modularity

### Feature Modules

Each feature should be packaged as an independent module:

```
src/modules/userManagement/
├── components/
│   ├── UserList.js
│   ├── UserForm.js
│   └── UserCard.js
├── services/
│   └── userService.js
├── validators/
│   └── userValidators.js
├── tests/
│   ├── components.test.js
│   ├── services.test.js
│   └── validators.test.js
├── constants.js
└── index.js
```

### Reusable Component Libraries

Create a shared components library:

```
src/components/common/
├── Button/
│   ├── Button.js
│   ├── Button.test.js
│   └── Button.styles.css
├── Card/
├── Modal/
├── FormField/
└── index.js
```

### Dependency Imports

Always use explicit imports:

```javascript
// ✓ GOOD
import { UserService } from '../services/userService.js';
import { validateEmail } from '../validators/userValidators.js';

// ✗ BAD
import * as utils from '../utils.js';
```

---

## Backend-for-Frontend (BFF) Standards

### BFF Is Required

For all UI channels, use a **Backend-for-Frontend (BFF)** layer. Frontends must not directly orchestrate multiple domain services.

### Mandatory BFF Rules

1. **One channel, one BFF contract**

- Web UI should consume web-focused BFF endpoints
- Keep BFF response shapes optimized for UI needs
- Do not leak downstream service contracts to UI clients

2. **No direct client-to-microservice coupling**

- Browser clients must call BFF APIs only
- BFF handles orchestration, aggregation, and composition
- Avoid N+1 frontend API calls by composing responses in BFF

3. **Strict contract and validation boundaries**

- Validate all request payloads at BFF entry points
- Validate downstream responses before mapping to UI DTOs
- Never forward raw downstream payloads without mapping

4. **Security and identity propagation**

- Enforce authentication and authorization in BFF
- Propagate identity claims and correlation IDs downstream
- Never expose secrets, internal headers, or privileged fields to clients

5. **Resilience and performance controls**

- Use timeouts, retries (idempotent operations only), and circuit-breaker patterns
- Implement caching for safe read endpoints
- Apply pagination and server-side filtering for large datasets

6. **Observability by default**

- Log request IDs, user context, latency, and downstream call metrics
- Emit trace spans for orchestration steps
- Track error classes and dependency failure rates

### BFF Testing Requirements

- Contract tests for each BFF endpoint
- Integration tests for service orchestration paths
- Authorization tests per role (`Admin`, `Power User`, `Analyst`, `Viewer`)
- Failure-mode tests (timeouts, partial downstream failures, retries)

---

## Response Validation

### Mandatory Validation Rules

**All responses (API responses, user input, internal data transfers) MUST be validated before use.**

### Input Validation

```javascript
// ✓ REQUIRED - Validate all incoming data
const validateUserInput = (data) => {
  const errors = [];

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Name is required and must be a string');
  }

  if (data.age && (typeof data.age !== 'number' || data.age < 0 || data.age > 150)) {
    errors.push('Age must be a valid number between 0 and 150');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
```

### API Response Validation

```javascript
// ✓ REQUIRED - Validate API responses
const validateApiResponse = (response) => {
  if (!response || typeof response !== 'object') {
    return {
      isValid: false,
      error: 'Invalid response format',
    };
  }

  if (!response.data) {
    return {
      isValid: false,
      error: 'Missing required field: data',
    };
  }

  if (response.status && !['success', 'error'].includes(response.status)) {
    return {
      isValid: false,
      error: 'Invalid status value',
    };
  }

  return { isValid: true };
};
```

### Schema Validation

Use a validation library or custom schema validators:

```javascript
// Example validation schema
const UserSchema = {
  email: { type: 'string', required: true, pattern: 'email' },
  name: { type: 'string', required: true, minLength: 1 },
  age: { type: 'number', required: false, min: 0, max: 150 },
  role: { type: 'string', enum: ['admin', 'user', 'guest'] },
};

const validateagainst = (data, schema) => {
  // Implementation of schema validation
};
```

### Error Handling

```javascript
// ✓ Proper error handling with validation
try {
  const validation = validateUserInput(userData);
  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors,
    };
  }
  // Process valid data
} catch (error) {
  console.error('Validation error:', error);
  return {
    success: false,
    error: 'An unexpected error occurred during validation',
  };
}
```

### Runtime Error Trapping (Required)

All runtime layers must trap and route errors through standardized handlers:

1. **API route handlers**

- Use wrapped handlers that forward rejected promises to Express error middleware.
- Never allow `async` route rejections to bypass `next(error)`.

2. **Express global error middleware**

- Return a consistent error envelope with `requestId`, `timestamp`, `code`, and `status`.
- Sanitize `5xx` errors in production (`Internal Server Error`) to avoid leaking internals.

3. **Node process-level handlers**

- Register `unhandledRejection` and `uncaughtException` handlers.
- Log root cause and perform graceful shutdown with timeout.

4. **Frontend runtime handlers**

- Register `window.onerror` and `window.unhandledrejection` listeners.
- Route runtime failures to the UI error stream and user-visible toast notification.

5. **Shutdown behavior**

- Handle `SIGTERM` and `SIGINT` gracefully.
- Force exit if shutdown exceeds configured timeout to avoid zombie process states.

---

## Testing Requirements

### Mandatory Testing

**All code must have tests. Tests are not optional.**

### Test Types

1. **Unit Tests** - Test individual functions and components in isolation
2. **Integration Tests** - Test interactions between modules
3. **Component Tests** - Test View.js components with different props and states
4. **Validation Tests** - Test all validators and error handling
5. **End-to-End Tests** - Test complete user workflows

### Test Coverage Minimums

- **Overall coverage:** ≥80%
- **Critical paths:** 100% coverage
- **Validators:** 100% coverage
- **Services:** ≥85% coverage
- **Components:** ≥75% coverage

### Writing Tests

```javascript
// ✓ GOOD - Clear, focused tests
describe('validateEmail', () => {
  it('should return true for valid email', () => {
    const result = validateEmail('user@example.com');
    expect(result.isValid).toBe(true);
  });

  it('should return false for invalid email format', () => {
    const result = validateEmail('invalid-email');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Invalid email format');
  });

  it('should handle edge cases', () => {
    expect(validateEmail('').isValid).toBe(false);
    expect(validateEmail(null).isValid).toBe(false);
  });
});

describe('UserCard Component', () => {
  it('should render with provided props', () => {
    const props = { name: 'John', email: 'john@example.com' };
    const component = UserCard(props);
    expect(component.render()).toContain('John');
  });

  it('should trigger callback on button click', () => {
    const callback = jest.fn();
    const component = UserCard({ onClick: callback });
    component.events.click();
    expect(callback).toHaveBeenCalled();
  });
});
```

### Internal Testing

Every module must include:

```javascript
// In each module's index.js or dedicated test file
const runInternalTests = () => {
  const tests = {
    validators: [],
    components: [],
    services: [],
  };

  // Register tests
  // Validate module integrity on startup

  return tests;
};
```

---

## Infrastructure as Code (IaC) First

### IaC Is Mandatory

All infrastructure must be defined and versioned as code. Manual portal-only configuration is not allowed for production changes.

### Required IaC Standards

1. **Source-controlled infrastructure**

- Define infrastructure in code (Terraform/Bicep/ARM/Pulumi)
- Store IaC in repository under a dedicated `infra/` structure
- Every environment change must come from pull requests

2. **Environment parity and promotion**

- Maintain reproducible `dev`, `test`, and `prod` stacks
- Promote changes through environments using the same IaC modules
- Avoid environment drift using regular plan/diff checks

3. **Policy and security as code**

- Enforce network, encryption, and identity policies in IaC
- Use least-privilege identities and managed identities where possible
- Store secrets in Key Vault or approved secret manager (never in code)

4. **State and rollback strategy**

- Use remote state with locking and access controls
- Keep versioned change history and rollback procedures
- Require disaster recovery and backup configuration in IaC

5. **Reusable modules, no monolithic templates**

- Build reusable IaC modules by domain (network, compute, data, observability)
- Keep modules small, composable, and testable
- Do not create one massive template for all resources

### IaC Validation Gates

- IaC format/lint checks must pass
- IaC security scan must pass
- IaC plan must be reviewed in pull request
- Production apply requires approval

---

## CI/CD Integration

### Build Tests

All the following must pass before merging:

```yaml
# Pipeline stages
1. Lint - Code style and quality checks
2. Unit Tests - All unit tests must pass with coverage
3. Integration Tests - All modules must integrate correctly
4. Build - Successful production build
5. Security Scan - No vulnerabilities or security issues
6. Performance Tests - Load and performance benchmarks
7. IaC Validate/Plan - Infrastructure checks and reviewed plan output
8. IaC Apply (approved only) - Controlled environment deployment
```

### Pre-commit Hooks

Implement pre-commit hooks to run tests locally:

```bash
#!/bin/bash
npm run lint
npm run test:unit
npm run test:integration
npm run build
```

### Continuous Integration Requirements

- **Tests must pass** before any PR can merge
- **Coverage must not decrease** - Enforce minimum coverage
- **Build must succeed** - No build errors allowed
- **No security vulnerabilities** - Scan all dependencies
- **Code quality gates** - Enforce linting rules
- **IaC plan review is mandatory** - Infrastructure changes require reviewed plan output
- **No manual prod infra changes** - All production infrastructure changes must be applied through pipeline

### Build Workflow Error Handling

- `build.yml` must fail fast on lint, unit test, or build failures.
- Container image build must only publish on `push` to `main` after all quality gates pass.
- Pull requests should still run container build (without push) to catch Dockerfile/runtime packaging issues early.
- Container publish authentication should use short-lived workflow credentials where possible (for example, `GITHUB_TOKEN` to GHCR) rather than long-lived static secrets.

### IaC Guardrails (FR-PLAT-001)

All infrastructure changes must flow through the IaC process defined in [`infra/`](infra/README.md).

**Rules — no exceptions:**

- **No manual production changes.** Any direct change to cloud resources without a corresponding Terraform PR is a compliance violation.
- **Every PR touching `infra/`** triggers `.github/workflows/iac.yml`:
  - `terraform fmt -check` — HCL formatting gate.
  - `terraform validate` — schema and syntax validation (runs without cloud credentials).
  - `terraform plan` — execution preview posted to the PR as a comment.
- **No `terraform apply` in CI.** Apply is a manual, reviewer-approved operation performed outside the pipeline.
- **Secrets are never committed.** Use `TF_VAR_*` environment variables or GitHub repository/environment secrets for all sensitive values. The `*.tfvars` files must never contain real credentials.
- **State backend must be remote.** The `backend "azurerm"` block in `providers.tf` must be configured before any team member runs `apply` in a shared environment.

**Local IaC workflow:**

```bash
cd infra/terraform

# Format your HCL before committing
terraform fmt -recursive

# Validate (no credentials required)
terraform init -backend=false
terraform validate

# Plan against dev (credentials required)
terraform plan -var-file=environments/dev.tfvars
```

See [infra/README.md](infra/README.md) for full setup instructions and required environment variables.

### Automated Testing in CI/CD

```javascript
// Example CI/CD test configuration
module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: ['src/**/*.js', '!src/**/*.test.js', '!src/index.js'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

---

## Documentation Standards

### Mandatory Documentation

Every contribution must include comprehensive documentation.

### JSDoc Comments

```javascript
/**
 * Validates user email address against standard email format.
 *
 * @param {string} email - The email address to validate
 * @returns {Object} Validation result object
 * @returns {boolean} result.isValid - Whether email is valid
 * @returns {string[]} result.errors - Array of validation errors (if any)
 *
 * @example
 * const result = validateEmail('user@example.com');
 * if (result.isValid) {
 *   console.log('Email is valid');
 * }
 *
 * @throws {TypeError} If email is not a string
 */
const validateEmail = (email) => {
  // Implementation
};
```

### README Files

Each module must have a README.md:

````markdown
# Module Name

## Purpose

Clear description of what this module does.

## Usage

```javascript
import { MyComponent } from './MyComponent.js';
```
````

## API

### `functionName(param)`

- **Description:** What it does
- **Parameters:** Types and descriptions
- **Returns:** What it returns
- **Example:** Usage example

## Testing

How to run tests for this module.

## Contributing

Any specific guidelines for this module.

````

### Inline Documentation

```javascript
// ✓ Explain WHY, not WHAT
// We sort users by creation date descending to show newest first
const sortByCreatedDate = (users) => {
  return users.sort((a, b) => new Date(b.created) - new Date(a.created));
};

// ✗ Don't document obvious code
// const x = a + b; // Add a and b
````

### API Documentation

Document all API endpoints, request/response formats:

````markdown
## API Endpoints

### GET /api/users

Retrieves list of all users with pagination support.

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)

**Response:**

```json
{
  "status": "success",
  "data": [{ "id": 1, "name": "John", "email": "john@example.com" }],
  "pagination": { "total": 100, "page": 1 }
}
```
````

**Error Response:**

```json
{
  "status": "error",
  "error": "Description of error",
  "code": "ERROR_CODE"
}
```

````

### Change Logs

Document all changes:

```markdown
## CHANGELOG

### [1.0.0] - 2026-05-08
#### Added
- New user management module
- Email validation for user registration

#### Changed
- Refactored user service to improve performance

#### Fixed
- Fixed bug in date parsing utility

#### Removed
- Deprecated API endpoint `/api/old-endpoint`
````

---

## Submission Process

### Before Creating PR

- [ ] Code follows all guidelines in this document
- [ ] All tests pass locally (`npm run test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Code is linted (`npm run lint`)
- [ ] Coverage is ≥80% for new code
- [ ] All responses are validated
- [ ] Comprehensive documentation is included
- [ ] No monolithic code patterns
- [ ] Components are reusable and modular
- [ ] Feature is on a feature branch
- [ ] BFF boundaries are respected (UI calls BFF, not downstream services)
- [ ] Infrastructure changes are done through IaC (no manual portal drift)
- [ ] IaC validation and plan output are attached for infra changes

### PR Requirements

1. **Title:** Clear, concise description
2. **Description:** Explain what, why, and how
3. **Tests:** Include test results and coverage
4. **Documentation:** Link to or include updated docs
5. **Breaking Changes:** Clearly note any breaking changes
6. **Screenshots/Examples:** For UI changes

### Code Review Checklist

Reviewers will verify:

- [ ] Code follows architecture guidelines
- [ ] No monolithic patterns
- [ ] Components are reusable
- [ ] All responses validated
- [ ] Tests cover new code (≥80%)
- [ ] Build tests pass in CI/CD
- [ ] Documentation is comprehensive
- [ ] Code is well-commented
- [ ] No security vulnerabilities
- [ ] Performance is acceptable
- [ ] BFF contract boundaries and DTO mappings are enforced
- [ ] IaC standards and reviewed plan are present for infra changes

---

## Summary

As a contributor, you are responsible for:

1. **Breaking down features** into modular, reusable components
2. **Validating all responses** before use
3. **Writing comprehensive tests** (unit, integration, component)
4. **Implementing BFF patterns** for frontend-facing APIs and orchestration
5. **Treating infrastructure as code first** with reviewed plans and controlled applies
6. **Ensuring CI/CD builds pass** with all tests and checks
7. **Documenting everything** - code, components, APIs, and changes

Thank you for contributing to Data Governance! Your adherence to these guidelines ensures we maintain a high-quality, scalable, and maintainable codebase.

For questions or clarifications, please open an issue or reach out to the maintainers.
