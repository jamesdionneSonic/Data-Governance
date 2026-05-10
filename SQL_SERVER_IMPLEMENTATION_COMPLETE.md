# SQL Server Connector Implementation - Complete

## Overview

Successfully implemented a comprehensive SQL Server metadata extraction and data governance connector with:
- Support for all SQL Server versions (2012-2022)
- Multiple authentication methods (SQL Server, Windows, Azure AD)
- Deep lineage detection with confidence-scored relationships (1.0 to 0.2 scale)
- Automatic governance markdown generation with YAML frontmatter
- Full frontend integration with connection form and extraction UI

---

## Architecture

### Backend Components

#### 1. **SQL Server Metadata Extractor** (`src/services/sqlServerExtractor.js`)
- **Class**: `SqlServerMetadataExtractor`
- **Capabilities**:
  - Extracts complete database metadata from sys tables
  - Detects relationships using multiple methods
  - Calculates confidence scores for each relationship
  - Generates governance-enriched metadata

**Key Methods**:
- `connect()` - Establish connection pool
- `disconnect()` - Close connection gracefully
- `extractTables(database)` - Get table metadata with row counts and sizes
- `extractColumns(schema, table)` - Get column details (type, nullable, defaults)
- `extractPrimaryKeys(schema, table)` - Identify primary key columns
- `extractForeignKeys()` - Extract explicit FK relationships (confidence 1.0)
- `detectColumnMatches(tables)` - Find exact column name matches across tables (confidence 0.80)
- `detectEtlPatterns(tables)` - Identify staging/transformation patterns (confidence 0.75)
- `detectNamingConventions(tables, relationships)` - Apply naming patterns (confidence 0.70)
- `extractAllMetadata(database)` - Orchestrate all extractions and return combined metadata

**Confidence Scores** (ConfidenceScores enum):
```javascript
{
  PRIMARY_TO_FOREIGN_KEY: 1.0,      // Explicit PK→FK constraint
  FOREIGN_KEY_UNIQUE: 0.95,         // FK on UNIQUE key
  EXACT_COLUMN_MATCH: 0.80,         // "customer_id" in both tables
  NAMING_CONVENTION: 0.70,          // {table}_id pattern
  SEMANTIC_MATCH: 0.65,             // Semantic equivalence
  ETL_PATTERN: 0.75,                // Staging/SCD/CDC detected
  SCHEMA_GROUPING: 0.40,            // Same schema prefix
  CARDINALITY_MATCH: 0.50,          // Row counts suggest relationship
  COMPOSITE_KEY: 0.75,              // Multi-column match
  SELF_JOIN: 0.85,                  // Hierarchy detected
  SOFT_DELETE_PATTERN: 0.60,        // is_deleted, status='inactive'
  MANY_TO_MANY_BRIDGE: 0.75         // Composite PK + 2 FKs
}
```

#### 2. **Markdown Generator** (`src/services/markdownFromSqlServer.js`)
- **Class**: `MarkdownGenerator`
- **Capabilities**:
  - Converts metadata to governance markdown files
  - Organizes relationships by confidence tier
  - Auto-infers tags based on table characteristics
  - Generates YAML frontmatter with governance metadata

**Key Methods**:
- `generateTableMarkdown(table)` - Create markdown for single table with relationships and tags
- `generateRelationshipMarkdown(rel)` - Format relationship with confidence percentage and evidence
- `inferTags(table)` - Auto-tag based on naming (fact, dim, stg, tmp, large-table, core-schema)
- `generateAllMarkdowns()` - Generate markdown for all tables

**Output Structure**:
- YAML frontmatter with: name, database, type, schema, owner, sensitivity, tags, depends_on, row_count, size_kb, extracted_at
- Relationship sections grouped by confidence:
  - High Confidence (≥0.8): Trusted relationships requiring action
  - Medium Confidence (0.6-0.8): Recommended for review
  - Low Confidence (<0.6): Reject by default - review before use
- Governance sections (classification, stewardship, compliance) with placeholders

#### 3. **API Endpoint** (`src/api/ingestion.js`)
- **Route**: `POST /api/v1/ingestion/connect-sql-server`
- **Authentication**: Requires authentication + admin role
- **Parameters**:
  ```javascript
  {
    server: string,                    // localhost or server.database.windows.net
    port: number,                      // Default 1433
    database: string,                  // Target database
    authentication: 'sql-server'|'windows'|'azure-ad',
    username: string,                  // SQL Server auth
    password: string,                  // SQL Server auth
    domain: string,                    // Windows auth
    clientId: string,                  // Azure AD
    clientSecret: string,              // Azure AD
    tenantId: string,                  // Azure AD
    encrypt: boolean,                  // Default true
    trustServerCertificate: boolean    // Default false
  }
  ```

**Response**:
```javascript
{
  status: 'success',
  message: 'Description of extraction',
  data: {
    tablesExtracted: number,
    relationshipsDetected: number,
    confidentRelationships: number,     // ≥0.75 confidence
    markdownFiles: number,
    markdownPreview: [
      {
        fileName: string,
        directory: string,
        contentPreview: string          // First 300 chars
      }
    ],
    ready: string                       // Next steps message
  }
}
```

---

### Frontend Components

#### SQL Server Connector Form (`docker/frontend/app.js`)

**Data Structure** (in Vue data):
```javascript
importer: {
  sqlServer: {
    server: 'localhost',
    port: 1433,
    database: 'master',
    username: '',
    password: '',
    authentication: 'sql-server',
    domain: '',
    clientId: '',
    clientSecret: '',
    tenantId: '',
    encrypt: true,
    trustServerCertificate: false,
    connecting: false,
    result: null
  }
}
```

**UI Elements**:
1. **Authentication Method Selector**: Conditionally shows relevant input fields
   - SQL Server Auth: Shows username/password fields
   - Windows Auth: Shows domain field
   - Azure AD: Shows clientId/clientSecret/tenantId fields

2. **Connection Parameters**:
   - Server (text input)
   - Port (number input, default 1433)
   - Database (text input)
   - Encrypt checkbox (default true)
   - Trust Server Certificate checkbox (default false)

3. **Action Button**: "Connect & Extract" with loading state

4. **Results Display**: Shows statistics when extraction completes
   - Tables extracted
   - Relationships detected
   - High confidence relationships (≥0.75)
   - Markdown files ready for import

**Method**:
- `connectSqlServer()` - Makes POST request to `/api/v1/ingestion/connect-sql-server`
  - Displays toast notification on success/failure
  - Stores result for display
  - Disables button during connection attempt

---

## Usage Workflow

### Step 1: Navigate to Import Tab
User clicks "Import" in the main application sidebar

### Step 2: Configure SQL Server Connection
1. Select authentication method from dropdown
2. Enter connection parameters (server, database)
3. Enter credentials appropriate for auth method
4. Adjust encryption/cert trust settings if needed

### Step 3: Connect & Extract
1. Click "Connect & Extract" button
2. Form disables during connection attempt
3. Backend connects to SQL Server and extracts metadata
4. Relationships detected and confidence scored
5. Markdown files generated

### Step 4: Review Results
- View extraction statistics: tables, relationships, high-confidence relationships
- See count of markdown files ready for import
- Toast notification shows completion status

### Step 5: Load Markdown Files
- Use existing "Markdown Upload & Parse" section below
- Generated markdown files are passed through standard ingestion pipeline
- Files are loaded into governance platform with all lineage relationships

---

## Authentication Methods

### SQL Server Authentication
- **Use Case**: SQL Server with mixed-mode authentication enabled
- **Credentials**: Username and password
- **Connection**: Direct with mssql package default auth
- **Best For**: Development, on-premise SQL Server instances

### Windows Authentication (NTLM)
- **Use Case**: Domain-joined SQL Server instances
- **Credentials**: Domain name (optional), uses current Windows user credentials
- **Connection**: NTLM authentication
- **Best For**: Enterprise on-premise deployments with Active Directory

### Azure AD (Service Principal)
- **Use Case**: Azure SQL Database with Entra ID
- **Credentials**: Client ID, Client Secret, Tenant ID
- **Connection**: Service principal secret authentication
- **Best For**: Azure cloud deployments, managed services

---

## Confidence Scoring Details

### Scoring Tiers

**High Confidence (≥0.75)**: Trust primary actions
- 1.0: Primary Key → Foreign Key (explicit constraint)
- 0.95: FK on UNIQUE key (strong constraint)
- 0.85: Self-join/hierarchy patterns
- 0.75: ETL patterns, composite keys

**Medium Confidence (0.60-0.75)**:  Recommend review
- 0.80: Exact column name matches
- 0.70: Naming conventions ({table}_id)
- 0.65: Semantic equivalence ("ID" ↔ "Identifier")
- 0.60: Soft delete patterns

**Low Confidence (<0.60)**: Reject by default
- 0.50: Cardinality matching
- 0.40: Schema grouping prefix
- 0.35-0.20: Weak signals, metadata hints

### Environment-Specific Thresholds

Configure ingestion thresholds per environment:
- **Development** (0.35): Catch all signals, validate carefully
- **Staging** (0.55): Balance between coverage and precision
- **Production** (0.75): High precision, minimize false positives
- **Compliance** (0.85+): Only definitive relationships

---

## Relationship Detection Methods

### 1. **Foreign Key Constraints** (Confidence 1.0)
- Explicit PRIMARY KEY → FOREIGN KEY relationships from sys.foreign_keys
- Most reliable, extracted directly from database schema

### 2. **Column Matching** (Confidence 0.80)
- Tables with identical column names in common patterns:
  - "customer_id", "order_id", "product_id"
- Detects semantic relationships not captured by constraints

### 3. **ETL Patterns** (Confidence 0.75)
- Identifies transformation pipelines:
  - Staging tables: `stg_*` → target tables
  - Dimensions: `dim_*` (star schema)
  - Temporary: `tmp_*` tables
  - SCD patterns: Temporal columns (effective_date, is_current)

### 4. **Naming Conventions** (Confidence 0.70)
- Pattern-matching on column names:
  - {SourceTable}_ID in target table
  - Semantic name mapping (Cust_ID ↔ customer_id)

### 5. **Cardinality Analysis** (Confidence 0.50)
- Row counts suggest 1:N relationships
- Used with other signals for relationship validation

---

## Error Handling

### Connection Errors
- Invalid server/port: Network timeout
- Authentication failure: Invalid credentials
- Database unreachable: Connectivity issues

### Extraction Errors
- Permission denied: User lacks SELECT on sys tables
- Syntax errors: Unsupported SQL Server version

### Response Format
All errors return structured JSON with:
```javascript
{
  error: 'SQL Server Connection Error',
  message: 'Detailed error description',
  status: error_code
}
```

---

## Dependencies

### NPM Packages
- `mssql` (^9.1.1) - SQL Server connection and query execution
- `express` - API routing
- `marked` - Markdown generation
- `yaml` - YAML frontmatter parsing

### System Requirements
- SQL Server 2012 or later (or compatible cloud service)
- Network connectivity to SQL Server instance
- USER LOGIN with SELECT permissions on system views

---

## Testing Checklist

- [ ] Frontend form loads with all input fields
- [ ] Authentication method selector shows/hides correct fields
- [ ] Connect button disables during connection attempt
- [ ] Success toast shows correct counts
- [ ] Results display updates with extraction stats
- [ ] Failed connection shows error message
- [ ] Azure AD auth handles all parameters
- [ ] Windows auth accepts domain input
- [ ] Generated markdown files appear in existing importer
- [ ] Relationships appear in markdown with correct confidence tiers

---

## Performance Considerations

### Extraction Optimization
- Uses connection pooling for efficient resource usage
- Parallel extraction of tables, columns, and relationships
- Indexes and sys.dm_* views for fast metadata retrieval

### Large Database Handling
- Batch processing for tables with 100K+ rows
- Pagination for relationship extraction
- Memory-efficient streaming for markdown generation

### Timeout Settings
- Default connection timeout: 15 seconds
- Query timeout: 30 seconds (configurable)
- Connection pool: 10 connections (configurable)

---

## Integration with Governance Platform

### Markdown Generation
- Creates separate .md file per table
- Includes metadata, relationships, governance sections
- Ready for existing ingestion pipeline

### Lineage Integration
- Relationships with confidence scores flow into lineage graph
- Used by existing `buildLineageGraph()` function
- Governance classifications from frontmatter

### Index Integration
- Markdown files indexed via existing indexObjects() function
- Queryable by table name, schema, object type
- Relationship counts indexed for dashboard

---

## Future Enhancements

### Phase 2 Potential Features
1. **Incremental Extraction**: Only fetch changed objects since last run
2. **Data Classification**: Auto-detect PII, sensitive columns
3. **Quality Scoring**: Nullability, data type consistency validation
4. **Comparison**: Diff between database state and governance platform
5. **Profiling**: Data distributions, uniqueness analysis
6. **Row-level Lineage**: Track individual record transformations (via query analysis)

---

## Support & Documentation

### Research Documents (in docs/)
- `SQL_SERVER_CONNECTION_GUIDE.md` - Comprehensive connection details
- `SQL_SERVER_IMPLEMENTATION_GUIDE.md` - Implementation patterns
- `SQL_SERVER_QUICK_REFERENCE.md` - Quick lookup reference
- `LINEAGE_DETECTION_RESEARCH.md` - Relationship detection theory
- `LINEAGE_IMPLEMENTATION_GUIDE.md` - Confidence scoring details
- `SCORING_CALIBRATION_MATRIX.md` - Production threshold calibration

### API Testing
```bash
# Example curl request
curl -X POST http://localhost:3000/api/v1/ingestion/connect-sql-server \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "server": "localhost",
    "database": "master",
    "authentication": "sql-server",
    "username": "sa",
    "password": "YourPassword!",
    "encrypt": true,
    "trustServerCertificate": false
  }'
```

---

## Code Files Summary

### New Services
- **`src/services/sqlServerExtractor.js`**: 393 lines
  - SqlServerMetadataExtractor class
  - ConfidenceScores enum
  - Metadata extraction and relationship detection

- **`src/services/markdownFromSqlServer.js`**: 159 lines
  - MarkdownGenerator class
  - YAML frontmatter generation
  - Governance markdown formatting

### Modified Files
- **`src/api/ingestion.js`**: Added POST /api/v1/ingestion/connect-sql-server endpoint
- **`docker/frontend/app.js`**: 
  - Added importer.sqlServer data structure
  - Added connectSqlServer() method
  - Added SQL Server Connector form UI
- **`package.json`**: Added mssql ^9.1.1 dependency

---

## Contact & Support

For questions, issues, or enhancement requests related to:
- **SQL Server Connector**: See SQL_SERVER_IMPLEMENTATION_GUIDE.md
- **Confidence Scoring**: See SCORING_CALIBRATION_MATRIX.md
- **Data Governance**: See ENTERPRISE_ARCHITECTURE.md

