# Enterprise Architecture Framework

# Data Governance & Dependency Visualization Platform

**Version:** 2.0 (Markdown-First, Visualization-Centric)  
**Last Updated:** May 8, 2026  
**Architecture Pattern**: Markdown-Driven, File-Based with REST BFF API

> **Non-Negotiable Engineering Guardrails:**
>
> - **Markdown-First Source of Truth**: All data lineage, documentation, and metadata flows from markdown files in organized folder hierarchies
> - **Backend-for-Frontend (BFF)**: Single REST API boundary for frontend UI; all business logic centralized
> - **Enterprise RBAC**: Database-level and field-level permission controls via Entra ID + custom permission store
> - **Modern Visualization Layer**: Interactive graphs, impact analysis, and faceted search for discovery
> - **Infrastructure as Code**: All environments provisioned via Docker Compose with environment variables

---

## 0. Current State and Future State

### 0.1 Current State (As-Is)

At present, this repository contains strategy, governance, and data guidance documentation only.

- No running application services
- No active UI or APIs
- Documentation stored as markdown files in organized folder hierarchies
- No live scanning or integration with external systems (by design)

### 0.2 Future State (To-Be After Development)

After implementation, the platform will operate as a comprehensive data governance system:

- Web UI + REST BFF API with role-based experiences (Admin, Power User, Analyst, Viewer)
- Markdown file ingestion pipeline (upload → parse → index → serve)
- Enterprise-grade full-text search with faceted filtering (via Meilisearch)
- Interactive dependency visualization (graph, matrices, impact diagrams)
- Database-level and field-level RBAC tied to Entra ID
- Permission matrix management (who can see what databases/objects)
- User annotations, ownership tracking, and custom metadata
- Audit logging for all access and changes
- Export capabilities (reports, dependency diagrams, documentation bundles)

### 0.3 Current vs Future Mapping

| Domain          | Current State       | Future State                                     |
| --------------- | ------------------- | ------------------------------------------------ |
| Data Source     | Markdown files only | Markdown files + ingestion API                   |
| Discovery       | Manual file search  | Full-text + faceted search via Meilisearch       |
| Visualization   | None                | Interactive graphs, impact analysis, matrices    |
| Access Control  | None                | Entra ID SSO + database-level RBAC               |
| Metadata        | Inline in markdown  | Parsed + indexed for search and discovery        |
| User Experience | Read markdown files | Web UI with role-based views                     |
| Operations      | None                | Audit trails, permission matrix, user management |
| Delivery        | No deployment       | Docker containerized, multi-environment ready    |

### 0.4 Implementation Phases

The recommended implementation path is:

1. **Phase 0**: Foundation & tooling setup (ci/cd, testing framework, docker)
2. **Phase 1**: Authentication, authorization, and BFF API skeleton
3. **Phase 2**: Markdown parsing, lineage extraction, and indexing
4. **Phase 3**: Interactive visualization (dependency graphs, impact analysis, matrices)
5. **Phase 4**: Search, discovery, and faceted filtering
6. **Phase 5**: Admin dashboard, user management, permission matrix
7. **Phase 6**: Reporting, export, and audit trails

Detailed phase breakdown, story estimation, and sequencing documented in [PROJECT_BACKLOG.md](PROJECT_BACKLOG.md).

---

## 1. System Architecture Overview

```
┌────────────────────────────────────────────────────────────────┐
│                       CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Web Browser (Vue.js/React)                              │  │
│  │  - Dashboard | Visualization | Search | Admin            │  │
│  └──────────────────────┬─────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS/REST API
┌──────────────────────────────────────────────────────────────────┐
│              BACKEND-FOR-FRONTEND (BFF) LAYER                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Express.js API Gateway (Node.js)                          │  │
│  │  • Entra ID Authentication & OIDC                         │  │
│  │  • Database-Level RBAC Permission Checks                 │  │
│  │  • Markdown Parsing & Lineage Extraction                 │  │
│  │  • Search API Coordination (Meilisearch)                 │  │
│  │  • REST Endpoints:                                        │  │
│  │    - /api/v1/auth/* (login, refresh, me)                │  │
│  │    - /api/v1/objects (search, filter, detail)           │  │
│  │    - /api/v1/lineage (dependencies, impact)             │  │
│  │    - /api/v1/search (full-text + faceted)               │  │
│  │    - /api/v1/admin/* (users, permissions)               │  │
│  └────────────────────────┬────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────┴──────┐  ┌────────┴────────┐  ┌─────┴──────┐
│              │  │                 │  │            │
│   MARKDOWN   │  │  MEILISEARCH    │  │  ENTRA ID  │
│   DATA FILES │  │  (Search Index) │  │  (Auth)    │
│   /data      │  │  :7700          │  │  Tenant    │
│              │  │                 │  │            │
└──────────────┘  └─────────────────┘  └────────────┘
```

**Key Architectural Components**:

- **Markdown Files**: Organized by database → table/object → lineage relationships
- **Express BFF**: Single API boundary, handles all business logic and orchestration
- **Meilisearch**: Full-text index with faceting for instant discovery
- **Entra ID**: Enterprise authentication; RBAC enforced per API request
- **Frontend**: Interactive visualizations, real-time search, permission-aware UI

---

## 2. Layered Architecture Components

### 2.1 Presentation Layer (Frontend)

**Technology Stack**: View.js/Viewdify, CSS, JavaScript

**Components**:

```
src/views/
├── layouts/
│   ├── AdminLayout.js
│   ├── AnalystLayout.js
│   └── PublicLayout.js
├── pages/
│   ├── Dashboard.js
│   ├── DependencyGraph.js
│   ├── ObjectExplorer.js
│   ├── Documentation.js
│   ├── Reports.js
│   └── Admin/
│       ├── Users.js
│       ├── Environments.js
│       ├── AuditLog.js
│       └── Settings.js
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── app.css
├── services/
│   ├── apiClient.js
│   ├── authService.js
│   └── dataService.js
└── utils/
    ├── formatters.js
    ├── validators.js
    └── helpers.js
```

**Key Features**:

- Responsive design (desktop, tablet, mobile-ready)
- Vuetify-first UI controls and layout primitives
- Graph visualization (D3.js integration)
- Advanced search and filtering
- Accessibility (WCAG 2.1 AA compliance)

### 2.2 BFF/API Gateway Layer

**Technology**: Express.js middleware stack

**Responsibilities**:

- Route requests to appropriate microservice
- Serve as the only frontend API boundary (BFF pattern)
- Aggregate and orchestrate downstream service responses for UI use-cases
- Authenticate every request
- Rate limiting and throttling
- Request validation and sanitization
- Response formatting (JSON)
- Error handling and logging
- CORS management
- Request/response logging

**Key Routes**:

```javascript
// Authentication
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me

// Objects
GET    /api/v1/objects
GET    /api/v1/objects/:id
GET    /api/v1/objects/:id/dependencies
GET    /api/v1/objects/:id/dependents
POST   /api/v1/objects/:id/document

// Dependencies
GET    /api/v1/dependencies
GET    /api/v1/dependencies/analyze/:id
POST   /api/v1/dependencies/impact

// Documentation
GET    /api/v1/documentation/:id
PUT    /api/v1/documentation/:id
GET    /api/v1/documentation/export/:format

// Admin
GET    /api/v1/admin/users
POST   /api/v1/admin/users
PUT    /api/v1/admin/users/:id
DELETE /api/v1/admin/users/:id

// Reporting
GET    /api/v1/reports/objects
GET    /api/v1/reports/dependencies
POST   /api/v1/reports/generate
```

### 2.3 Authentication & Authorization Layer

**Components**:

#### 2.3.1 Authentication Service

```
auth/
├── strategies/
│   ├── entraIdStrategy.js
│   ├── ldapStrategy.js
│   └── localStrategy.js
├── tokenManager.js
├── sessionManager.js
└── passwordManager.js
```

**Features**:

- Multi-strategy authentication (Entra ID, LDAP, Local)
- JWT token generation and validation
- Token refresh mechanism
- Session management
- Password hashing (bcrypt)
- 2FA capability (optional)

#### 2.3.2 Authorization Service

```
auth/rbac/
├── roleDefinitions.js
├── permissionMapper.js
├── acl.js
└── accessController.js
```

**Role Structure**:

```javascript
const ROLES = {
  ADMIN: {
    permissions: ['*:*'], // All permissions
    description: 'Full platform access',
  },
  POWER_USER: {
    permissions: [
      'objects:view',
      'objects:document',
      'dependencies:view',
      'dependencies:analyze',
      'documentation:create',
      'documentation:edit',
      'reports:view',
      'reports:export',
      'teams:manage',
    ],
  },
  ANALYST: {
    permissions: [
      'objects:view',
      'dependencies:view',
      'dependencies:analyze',
      'documentation:view',
      'reports:view',
      'reports:export',
    ],
  },
  VIEWER: {
    permissions: ['objects:view', 'dependencies:view', 'documentation:view'],
  },
};
```

### 2.4 Discovery Service

**Technology**: Node.js with SQL Server driver

**Responsibilities**:

- Connect to SQL Server instances
- Discover schema metadata
- Extract SSIS package information
- Analyze dependencies
- Track changes
- Schedule recurring discovery

**Components**:

```
services/discovery/
├── connectors/
│   ├── sqlServerConnector.js
│   ├── ssisConnector.js
│   └── connectionPool.js
├── parsers/
│   ├── schemaParser.js
│   ├── ssisPackageParser.js
│   ├── dependencyParser.js
│   └── dataFlowParser.js
├── analyzers/
│   ├── dependencyAnalyzer.js
│   ├── circularDependencyDetector.js
│   └── impactAnalyzer.js
├── scheduler/
│   └── discoveryScheduler.js
└── discovery.service.js
```

**Discovery Process**:

1. Connect to SQL Server instance
2. Query system views for schema info
3. Parse SSIS catalog (if available)
4. Build dependency graph
5. Compare with previous discovery
6. Store metadata in database
7. Generate change notifications
8. Calculate statistics

### 2.5 Dependency Service

**Responsibilities**:

- Maintain dependency graph
- Calculate transitive dependencies
- Perform impact analysis
- Find circular dependencies
- Suggest dependency optimizations

**Components**:

```
services/dependencies/
├── graph/
│   ├── DependencyGraph.js
│   ├── Node.js
│   └── Edge.js
├── analyzers/
│   ├── ImpactAnalyzer.js
│   ├── CircularDependencyDetector.js
│   └── EffectivenessAnalyzer.js
├── visualizers/
│   ├── GraphLayouter.js
│   └── MatrixGenerator.js
└── dependencies.service.js
```

**Algorithms**:

- Depth-First Search (DFS) for transitive closures
- Breadth-First Search (BFS) for shortest paths
- Topological sorting for change sequence
- Cycle detection for circular dependencies

### 2.6 Documentation Service

**Responsibilities**:

- Generate markdown from metadata
- Manage custom documentation
- Version control documentation
- Generate multiple export formats
- Track documentation changes

**Components**:

```
services/documentation/
├── generators/
│   ├── MarkdownGenerator.js
│   ├── PdfGenerator.js
│   ├── HtmlGenerator.js
│   ├── ExcelGenerator.js
│   └── JsonGenerator.js
├── templates/
│   ├── tableTemplate.md
│   ├── procedureTemplate.md
│   ├── functionTemplate.md
│   └── packageTemplate.md
├── versioning/
│   └── DocumentationHistory.js
└── documentation.service.js
```

**Documentation Template Structure**:

```markdown
# [Object Name]

**Type**: [Table|View|Procedure|Function|Package]
**Owner**: [Owner Name]
**Created**: [Date]
**Last Modified**: [Date]

## Description

[Auto-generated or custom description]

## Metadata

- Schema: [Schema]
- Database: [Database]
- Status: [Active/Archived]
- Sensitive: [Yes/No]

## Columns (for tables/views)

| Column | Type | Nullable | PK  | FK  | Description |
| ------ | ---- | -------- | --- | --- | ----------- |

## Parameters (for procedures/functions)

| Parameter | Type | Default | Description |

## Dependencies

### Incoming Dependencies (Objects that use this)

- [Object 1] - [Description]
- [Object 2] - [Description]

### Outgoing Dependencies (Objects this uses)

- [Object 1] - [Description]
- [Object 2] - [Description]

## Data Lineage

[Diagram or description of data flow]

## Impact Assessment

[Business impact of changes]

## Related Documentation

- [Link 1]
- [Link 2]

## Change History

[Tracked changes over time]
```

### 2.7 Admin Service

**Responsibilities**:

- User management
- Environment/connection management
- Configuration management
- Permission administration
- Audit log management

**Components**:

```
services/admin/
├── users/
│   ├── UserManager.js
│   ├── RoleManager.js
│   └── PermissionManager.js
├── environments/
│   ├── EnvironmentManager.js
│   ├── ConnectionManager.js
│   └── HealthMonitor.js
├── configuration/
│   ├── SettingsManager.js
│   ├── FeatureFlags.js
│   └── Templates.js
└── admin.service.js
```

**Admin Dashboard Features**:

- User/role management table
- Environment configuration
- Discovery scheduling
- Backup/restore management
- System health status
- Performance metrics

### 2.8 Reporting Service

**Responsibilities**:

- Generate various reports
- Schedule recurring reports
- Export reports in multiple formats
- Track report usage

**Components**:

```
services/reporting/
├── reporters/
│   ├── ObjectCatalogReporter.js
│   ├── DependencyReporter.js
│   ├── ImpactAnalysisReporter.js
│   ├── ComplianceReporter.js
│   ├── UserActivityReporter.js
│   └── HealthReporter.js
├── exporters/
│   ├── CsvExporter.js
│   ├── PdfExporter.js
│   ├── ExcelExporter.js
│   └── HtmlExporter.js
└── reporting.service.js
```

### 2.9 Audit Service

**Responsibilities**:

- Log all user actions
- Track data changes
- Monitor permission usage
- Generate compliance reports
- Enforce retention policies

**Components**:

```
services/audit/
├── loggers/
│   ├── UserActionLogger.js
│   ├── DataChangeLogger.js
│   ├── PermissionLogger.js
│   └── SystemLogger.js
├── analyzers/
│   ├── AccessAnalyzer.js
│   ├── ChangeAnalyzer.js
│   └── ComplianceAnalyzer.js
└── audit.service.js
```

**Audit Trail Structure**:

```javascript
{
  id: UUID,
  timestamp: DateTime,
  userId: UUID,
  action: 'VIEW|EDIT|DELETE|EXPORT|LOGIN',
  resource: 'OBJECT|USER|PERMISSION|SETTING',
  resourceId: UUID,
  resourceName: String,
  oldValue: JSON,
  newValue: JSON,
  ipAddress: String,
  userAgent: String,
  status: 'SUCCESS|FAILURE',
  details: JSON
}
```

---

## 3. Data Persistence Layer

### 3.1 Database Schema

**Core Tables**:

#### Users & Authorization

```sql
-- Users
CREATE TABLE Users (
  id UUID PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  entraId VARCHAR(255) UNIQUE,
  adDn VARCHAR(500),
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  isActive BIT NOT NULL DEFAULT 1,
  lastLogin DATETIME,
  createdAt DATETIME DEFAULT GETDATE(),
  updatedAt DATETIME DEFAULT GETDATE()
);

-- Roles
CREATE TABLE Roles (
  id INT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(500),
  permissions JSON NOT NULL,
  isSystem BIT NOT NULL DEFAULT 1
);

-- User Roles
CREATE TABLE UserRoles (
  userId UUID NOT NULL,
  roleId INT NOT NULL,
  environmentId UUID,
  assignedAt DATETIME DEFAULT GETDATE(),
  assignedBy UUID,
  PRIMARY KEY (userId, roleId, environmentId),
  FOREIGN KEY (userId) REFERENCES Users(id),
  FOREIGN KEY (roleId) REFERENCES Roles(id)
);

-- Teams
CREATE TABLE Teams (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(500),
  leadId UUID,
  createdAt DATETIME DEFAULT GETDATE(),
  updatedAt DATETIME DEFAULT GETDATE()
);

-- Team Members
CREATE TABLE TeamMembers (
  teamId UUID NOT NULL,
  userId UUID NOT NULL,
  role VARCHAR(50),
  joinedAt DATETIME DEFAULT GETDATE(),
  PRIMARY KEY (teamId, userId),
  FOREIGN KEY (teamId) REFERENCES Teams(id),
  FOREIGN KEY (userId) REFERENCES Users(id)
);
```

#### Connections & Environments

```sql
-- SQL Server Connections
CREATE TABLE SqlServerConnections (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(500),
  serverName VARCHAR(255) NOT NULL,
  databaseName VARCHAR(255),
  connectionString NVARCHAR(MAX) NOT NULL, -- Encrypted
  environment VARCHAR(50) NOT NULL, -- Dev, Test, Prod
  isActive BIT NOT NULL DEFAULT 1,
  lastDiscovery DATETIME,
  nextDiscovery DATETIME,
  discoveryStatus VARCHAR(50), -- Idle, In Progress, Error
  discoveryError VARCHAR(MAX),
  createdAt DATETIME DEFAULT GETDATE(),
  updatedAt DATETIME DEFAULT GETDATE(),
  createdBy UUID,
  updatedBy UUID
);

-- Discovery History
CREATE TABLE DiscoveryHistory (
  id UUID PRIMARY KEY,
  connectionId UUID NOT NULL,
  startTime DATETIME NOT NULL,
  endTime DATETIME,
  status VARCHAR(50), -- Success, Failure, Partial
  objectsFound INT,
  dependenciesFound INT,
  errorsEncountered INT,
  notes VARCHAR(MAX),
  logs VARCHAR(MAX),
  FOREIGN KEY (connectionId) REFERENCES SqlServerConnections(id)
);
```

#### Objects & Metadata

```sql
-- Database Objects
CREATE TABLE DatabaseObjects (
  id UUID PRIMARY KEY,
  connectionId UUID NOT NULL,
  databaseName VARCHAR(255) NOT NULL,
  schemaName VARCHAR(255) NOT NULL,
  objectName VARCHAR(255) NOT NULL,
  objectType VARCHAR(50) NOT NULL, -- Table, View, Procedure, Function, Trigger
  created DATETIME,
  modified DATETIME,
  rowCount BIGINT,
  sizeKB INT,
  metadata JSON, -- Column definitions, parameters, etc.
  description VARCHAR(MAX),
  businessOwner VARCHAR(255),
  technicalOwner VARCHAR(255),
  isDocumented BIT DEFAULT 0,
  documentation VARCHAR(MAX),
  isActive BIT DEFAULT 1,
  lastDiscovery DATETIME,
  createdAt DATETIME DEFAULT GETDATE(),
  updatedAt DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (connectionId) REFERENCES SqlServerConnections(id),
  UNIQUE (connectionId, databaseName, schemaName, objectName)
);

-- SSIS Packages
CREATE TABLE SsisPackages (
  id UUID PRIMARY KEY,
  connectionId UUID NOT NULL,
  catalogName VARCHAR(255),
  folderName VARCHAR(255),
  projectName VARCHAR(255),
  packageName VARCHAR(255) NOT NULL,
  packageId VARCHAR(100),
  packageContent XML, -- Full package XML
  parameters JSON,
  metadata JSON,
  description VARCHAR(MAX),
  isActive BIT DEFAULT 1,
  lastRun DATETIME,
  lastStatus VARCHAR(50),
  createdAt DATETIME DEFAULT GETDATE(),
  updatedAt DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (connectionId) REFERENCES SqlServerConnections(id),
  UNIQUE (connectionId, folderName, projectName, packageName)
);
```

#### Dependencies

```sql
-- Dependencies
CREATE TABLE Dependencies (
  id UUID PRIMARY KEY,
  sourceObjectId UUID NOT NULL,
  targetObjectId UUID NOT NULL,
  dependencyType VARCHAR(50), -- Direct, Indirect, DataFlow, etc.
  discoveredAt DATETIME DEFAULT GETDATE(),
  isManual BIT DEFAULT 0,
  manualAddedBy UUID,
  metadata JSON,
  FOREIGN KEY (sourceObjectId) REFERENCES DatabaseObjects(id),
  FOREIGN KEY (targetObjectId) REFERENCES DatabaseObjects(id),
  UNIQUE (sourceObjectId, targetObjectId, dependencyType)
);

-- SSIS Object Dependencies
CREATE TABLE SsisDependencies (
  id UUID PRIMARY KEY,
  ssisPackageId UUID NOT NULL,
  targetObjectId UUID NOT NULL,
  taskName VARCHAR(255),
  connectionName VARCHAR(255),
  dependencyType VARCHAR(50), -- Source, Destination, Connection
  metadata JSON,
  FOREIGN KEY (ssisPackageId) REFERENCES SsisPackages(id),
  FOREIGN KEY (targetObjectId) REFERENCES DatabaseObjects(id)
);
```

#### Documentation

```sql
-- Documentation
CREATE TABLE Documentation (
  id UUID PRIMARY KEY,
  objectId UUID NOT NULL,
  title VARCHAR(500) NOT NULL,
  content VARCHAR(MAX) NOT NULL, -- Markdown
  format VARCHAR(50) DEFAULT 'markdown',
  version INT DEFAULT 1,
  isPublished BIT DEFAULT 1,
  createdBy UUID NOT NULL,
  createdAt DATETIME DEFAULT GETDATE(),
  updatedBy UUID,
  updatedAt DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (objectId) REFERENCES DatabaseObjects(id),
  FOREIGN KEY (createdBy) REFERENCES Users(id)
);

-- Documentation History
CREATE TABLE DocumentationHistory (
  id UUID PRIMARY KEY,
  documentationId UUID NOT NULL,
  version INT NOT NULL,
  content VARCHAR(MAX) NOT NULL,
  changedBy UUID NOT NULL,
  changedAt DATETIME DEFAULT GETDATE(),
  changeType VARCHAR(50), -- Created, Updated, Deleted, Restored
  notes VARCHAR(500),
  FOREIGN KEY (documentationId) REFERENCES Documentation(id),
  FOREIGN KEY (changedBy) REFERENCES Users(id)
);
```

#### Audit & Compliance

```sql
-- Audit Log
CREATE TABLE AuditLog (
  id UUID PRIMARY KEY,
  timestamp DATETIME NOT NULL DEFAULT GETDATE(),
  userId UUID,
  action VARCHAR(50) NOT NULL, -- VIEW, EDIT, DELETE, EXPORT, LOGIN
  resource VARCHAR(50) NOT NULL, -- OBJECT, USER, PERMISSION, SETTING
  resourceId UUID,
  resourceName VARCHAR(500),
  oldValue VARCHAR(MAX), -- JSON
  newValue VARCHAR(MAX), -- JSON
  ipAddress VARCHAR(50),
  userAgent VARCHAR(500),
  status VARCHAR(50), -- SUCCESS, FAILURE
  errorMessage VARCHAR(MAX),
  details VARCHAR(MAX), -- JSON
  FOREIGN KEY (userId) REFERENCES Users(id),
  INDEX idx_timestamp (timestamp),
  INDEX idx_userId (userId),
  INDEX idx_action (action)
);
```

### 3.2 Caching Strategy

**Redis Cache Layer**:

```javascript
// Session Cache
CACHE_KEYS = {
  SESSION: 'session:{userId}',
  USER: 'user:{userId}',
  PERMISSIONS: 'permissions:{userId}:{environmentId}',
  OBJECT: 'object:{objectId}',
  DEPENDENCIES: 'dependencies:{objectId}',
  GRAPH: 'graph:{connectionId}',
  SEARCH: 'search:{query}:{offset}:{limit}',
};

// TTLs
TTL = {
  SESSION: 12 * 60 * 60, // 12 hours
  USER: 60 * 60, // 1 hour
  PERMISSIONS: 30 * 60, // 30 minutes
  OBJECT: 24 * 60 * 60, // 24 hours (invalidated on discovery)
  DEPENDENCIES: 24 * 60 * 60, // 24 hours (invalidated on discovery)
  GRAPH: 24 * 60 * 60, // 24 hours
  SEARCH: 60 * 60, // 1 hour
};
```

---

## 4. Security Architecture

### 4.1 Authentication Flow

```
User Request
    ↓
┌─────────────────────────────────┐
│ Determine Authentication Method │
└──────────┬──────────────────────┘
           │
    ┌──────┴──────┬──────────┐
    │             │          │
  Entra ID      LDAP/AD    Local
    │             │          │
    ↓             ↓          ↓
┌────────┐ ┌──────────┐ ┌───────────┐
│ OAuth  │ │ LDAP     │ │ Username/ │
│ 2.0    │ │ Query    │ │ Password  │
└────────┘ └──────────┘ └───────────┘
    │             │          │
    └──────┬──────┴──────────┘
           ↓
┌─────────────────────────────────┐
│ Create JWT Token                │
│ - User ID                       │
│ - Roles                         │
│ - Permissions                   │
│ - Expiration (1 hour)           │
└──────────┬──────────────────────┘
           ↓
┌─────────────────────────────────┐
│ Return Token to Client          │
│ Set as HTTP-Only Cookie         │
└──────────┬──────────────────────┘
           ↓
┌─────────────────────────────────┐
│ Client Includes Token in        │
│ Authorization Header            │
└─────────────────────────────────┘
```

### 4.2 Authorization Matrix

**Resource-Based Access Control**:

```
┌─────────────────────────────────────────────────────────────┐
│ REQUEST ARRIVES                                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ EXTRACT USER & ROLES FROM JWT                              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ DETERMINE REQUIRED PERMISSION                              │
│ (resource:action)                                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ CHECK USER PERMISSIONS                                      │
│ 1. Direct role permissions                                  │
│ 2. Environment-specific permissions                         │
│ 3. Object-level ACL                                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
                    ┌─────┴─────┐
                    │           │
                  ALLOW       DENY
                    │           │
            ┌───────┘           └──────┐
            ↓                          ↓
      Continue Request          Return 403 Forbidden
```

### 4.3 Data Encryption

**In Transit**:

- HTTPS/TLS 1.3 for all communications
- WebSocket Secure (WSS) for real-time updates

**At Rest**:

- SQL Server encryption (TDE)
- Connection strings encrypted with master key
- Sensitive metadata encrypted in database

**API Keys & Tokens**:

- JWT tokens (RS256 algorithm)
- API keys hashed before storage
- Webhook signatures (HMAC-SHA256)

---

## 5. Deployment Architecture

### 5.1 Development Environment

```
Local Machine
├── Docker Desktop
├── SQL Server (Docker container)
├── Redis (Docker container)
├── Backend (npm run dev)
├── Frontend (npm run dev)
└── Database migrations
```

### 5.2 Production Environment

**On-Premises Deployment**:

```
┌─────────────────────────────────────────────────────────────┐
│ Load Balancer (HAProxy/Nginx)                              │
└─────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────┐
│ Docker Swarm / Kubernetes Cluster                          │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Pod 1: Backend API                                     │ │
│ ├────────────────────────────────────────────────────────┤ │
│ │ Pod 2: Frontend (Static)                               │ │
│ ├────────────────────────────────────────────────────────┤ │
│ │ Pod 3: Backend API (Replica)                          │ │
│ └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────┐
│ Persistent Storage                                          │
│ ├── SQL Server (High Availability)                         │
│ │   ├── Primary Instance                                   │
│ │   ├── Secondary Instance (Failover)                      │
│ │   └── Log Shipping                                       │
│ ├── Redis Cluster                                          │
│ └── File Storage (for exports)                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 Deployment Pipeline

```yaml
stages:
  - Build:
      - Lint (ESLint)
      - Unit Tests
      - Build Docker image
      - Security scan (Trivy)

  - Test:
      - Integration tests
      - API tests
      - E2E tests

  - Staging:
      - Deploy to staging
      - Smoke tests
      - Performance tests

  - Production:
      - Approvals
      - Blue-green deployment
      - Health checks
      - Rollback capability
```

---

## 6. Monitoring & Observability

### 6.1 Logging

**Application Logging** (ELK Stack / App Insights):

- INFO: General application events
- WARN: Warning conditions
- ERROR: Error conditions
- DEBUG: Debug information

**Log Aggregation**:

```
Application Logs → Logstash → Elasticsearch → Kibana
```

### 6.2 Metrics & Performance

**Prometheus Metrics**:

- Request duration (histogram)
- Request count (counter)
- Active connections (gauge)
- Database query time
- Cache hit rate
- API error rate

**Grafana Dashboards**:

- System health (CPU, memory, disk)
- Application performance
- User activity
- API usage
- Dependency discovery status

### 6.3 Health Checks

```javascript
GET /api/v1/health
{
  status: 'healthy',
  timestamp: '2026-05-08T10:00:00Z',
  components: {
    database: { status: 'up', responseTime: 45 },
    cache: { status: 'up', responseTime: 12 },
    sqlConnections: { status: 'up', lastCheck: '2026-05-08T09:55:00Z' },
    api: { status: 'up', requestsPerSecond: 125 }
  }
}
```

---

## 7. API Architecture

### 7.1 REST API Design

**Versioning**: `/api/v1/`, `/api/v2/`, etc.

**Response Format**:

```javascript
// Success Response
{
  success: true,
  data: { /* actual data */ },
  meta: {
    timestamp: '2026-05-08T10:00:00Z',
    version: 'v1',
    requestId: 'req_123456'
  }
}

// Error Response
{
  success: false,
  error: {
    code: 'RESOURCE_NOT_FOUND',
    message: 'Object with ID xxx not found',
    details: { /* additional info */ }
  },
  meta: {
    timestamp: '2026-05-08T10:00:00Z',
    version: 'v1',
    requestId: 'req_123456'
  }
}
```

### 7.2 API Documentation

- **OpenAPI/Swagger**: Auto-generated from code
- **Interactive Docs**: Swagger UI at `/api/docs`
- **Rate Limits**: 1000 req/hour per user, 10000 req/hour per IP
- **Pagination**: cursor-based and offset-based
- **Filtering**: Support query parameters
- **Sorting**: Multi-column sorting support

---

## 8. Scalability Patterns

### 8.1 Horizontal Scaling

- Stateless API design
- Load balancer distribution
- Database connection pooling
- Distributed caching (Redis Cluster)
- Queue-based async jobs

### 8.2 Vertical Scaling

- Database optimization (indexes, partitioning)
- Query caching strategies
- Memory-efficient algorithms
- Resource limits and autoscaling

### 8.3 Database Scaling

- Read replicas for reporting
- Partitioning large tables
- Archive old audit logs
- Materialized views for common queries

---

## 9. Integration Points

### 9.1 External Integrations

```
Platform → Entra ID (Auth)
        ↓
        → LDAP/AD (Auth fallback)
        ↓
        → SQL Server Instances (Discovery)
        ↓
        → Slack/Teams (Notifications)
        ↓
        → Jira/Azure DevOps (Tracking)
        ↓
        → Email (Alerts)
        ↓
        → Webhooks (Events)
```

### 9.2 Event Driven Architecture

**Event Bus**:

- Message queue (RabbitMQ/Azure Service Bus)
- Event topics by category
- Dead-letter queue for failures
- Event retention policies

**Events**:

- `object.discovered`
- `dependency.created`
- `dependency.deleted`
- `documentation.updated`
- `user.created`
- `permission.changed`
- `discovery.completed`

### 9.3 API Consumption Scenarios

```
1. CI/CD Pipeline → API → Impact Analysis
2. Power BI → API → Report Data
3. Excel → API → Data Export
4. Mobile App → API → Object Search
5. External Tool → API → Dependency Data
```

---

## Conclusion

This enterprise architecture provides:

- **Scalability**: Handle 10,000+ objects and 1,000+ concurrent users
- **Security**: Multi-layer authentication and authorization
- **Reliability**: Failover, backup, and disaster recovery
- **Maintainability**: Modular, well-documented components
- **Extensibility**: API-first design for integrations
- **Compliance**: Audit trails and regulatory support

The framework supports both on-premises and cloud deployments while maintaining consistency and high availability across all environments.
