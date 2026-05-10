# SQL Server Connection Guide

**Last Updated**: May 2026  
**Scope**: SQL Server 2012 and later, Azure SQL Database, Managed SQL Server

---

## Table of Contents

1. [Supported SQL Server Versions](#supported-sql-server-versions)
2. [Authentication Methods](#authentication-methods)
3. [Connection Parameters (mssql npm Package)](#connection-parameters-mssql-npm-package)
4. [Connection String Formats](#connection-string-formats)
5. [Configuration Examples](#configuration-examples)
6. [Best Practices for Production](#best-practices-for-production)
7. [Azure SQL Database Considerations](#azure-sql-database-considerations)
8. [Troubleshooting](#troubleshooting)

---

## Supported SQL Server Versions

### Overview

The `mssql` npm package supports SQL Server 2012 and later.

| Version | Release Year | Mainstream Support End | Extended Support End | Recommended | EOL Status |
|---------|--------------|----------------------|----------------------|-------------|-----------|
| SQL Server 2012 | 2012 | 07/2017 | 07/2022 | ⚠️ Legacy | **EOL** |
| SQL Server 2014 | 2014 | 07/2019 | 07/2024 | ⚠️ Legacy | **EOL** |
| SQL Server 2016 | 2015 | 07/2021 | 07/2026 | ⚠️ Supported | Ending soon |
| SQL Server 2017 | 2017 | 10/2022 | 10/2027 | ✅ Supported | Active |
| SQL Server 2019 | 2019 | 01/2025 | 01/2030 | ✅ Recommended | Active |
| SQL Server 2022 | 2022 | 01/2028 | 01/2033 | ✅ Recommended | Active |

### Version-Specific Considerations

**SQL Server 2012-2014**:
- Older TLS/SSL implementations (TLS 1.0 may be required)
- Limited Entra ID integration
- Basic connection pooling support
- Recommendation: **Plan migration** if still in use

**SQL Server 2016-2017**:
- TLS 1.2 support
- Foundation for Entra ID support
- Full TCP/IP support with named instances
- Good compatibility with modern Node.js drivers

**SQL Server 2019-2022** (Recommended):
- Full TLS 1.2+ support
- Native Entra ID/Azure AD integration
- Advanced security features (Transparent Data Encryption, Always Encrypted)
- Managed identity support (Azure SQL instances)
- Best support for Node.js `mssql` package

---

## Authentication Methods

### 1. SQL Server Authentication (Native)

**Use Case**: Legacy systems, non-Azure deployments, local development

#### Overview
- Username and password stored in SQL Server
- Database-level credentials
- No Active Directory required
- Supported on all versions

#### Security Considerations
```
⚠️ Risk Level: Medium
- Always use strong passwords (20+ characters)
- Change default passwords immediately
- Enable password policies
- Rotate credentials every 90 days minimum
- Never embed credentials in code/config
- Use environment variables or secret managers
```

#### Minimal Example
```javascript
const config = {
  server: 'sqlserver.company.com',
  database: 'governance_db',
  authentication: {
    type: 'default',
    options: {
      userName: process.env.SQL_USERNAME,
      password: process.env.SQL_PASSWORD
    }
  },
  options: {
    trustServerCertificate: false,
    encrypt: true,
    connectionTimeout: 15000
  }
};
```

---

### 2. Windows Authentication (Active Directory)

**Use Case**: On-premise enterprise environments, internal networks

#### Overview
- Uses Windows domain credentials
- Integrated with Active Directory (AD)
- No separate password management
- Only works on Windows clients or domain-connected systems

#### Authentication Flow
```
User System Password → Windows SSPI → AD → SQL Server
                                       (Kerberos or NTLM)
```

#### Minimal Example
```javascript
const config = {
  server: 'sqlserver.company.com',
  database: 'governance_db',
  authentication: {
    type: 'ntlm',
    options: {
      domain: 'COMPANY_DOMAIN'
    }
  },
  options: {
    trustServerCertificate: false,
    encrypt: true,
    connectionTimeout: 15000
  }
};
```

#### System Requirements
- Windows OS (or domain-connected Linux via SSSD)
- Active Directory connectivity
- Kerberos or NTLM configured
- Service account with appropriate AD permissions

#### Key Parameters
| Parameter | Description | Required |
|-----------|-------------|----------|
| `domain` | AD domain name | Required if using NTLM |
| `userName` | Optional explicit username override | Optional |
| `password` | Optional explicit password override | Optional |

---

### 3. Azure AD / Entra ID (Service Principal)

**Use Case**: Cloud deployments, CI/CD pipelines, service accounts

#### Overview
- OAuth 2.0 token-based authentication
- Service Principal credentials
- Managed at Entra ID level
- Supports Azure SQL Database and SQL Server 2016+

#### Authentication Types

##### 3a. Service Principal (Client ID + Client Secret)
```javascript
const config = {
  server: 'sqlserver.company.database.windows.net',
  database: 'governance_db',
  authentication: {
    type: 'azure-service-principal-secret',
    options: {
      clientId: process.env.AZURE_CLIENT_ID,
      clientSecret: process.env.AZURE_CLIENT_SECRET,
      tenantId: process.env.AZURE_TENANT_ID
    }
  },
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectionTimeout: 15000
  }
};
```

**Security**:
```
⚠️ Credentials Management:
- Store in Azure Key Vault or equivalent
- Never commit to version control
- Rotate every 180 days
- Audit usage via Azure Activity Log
- Use certificate-based auth when possible
```

##### 3b. Service Principal (Certificate)
```javascript
const fs = require('fs');

const config = {
  server: 'sqlserver.company.database.windows.net',
  database: 'governance_db',
  authentication: {
    type: 'azure-service-principal-certificate',
    options: {
      clientId: process.env.AZURE_CLIENT_ID,
      tenantId: process.env.AZURE_TENANT_ID,
      certificate: fs.readFileSync('./client-cert.pem', 'utf8'),
      key: fs.readFileSync('./client-key.pem', 'utf8')
    }
  },
  options: {
    encrypt: true
  }
};
```

**Advantages**:
- ✅ More secure than client secrets
- ✅ Longer rotation cycles possible
- ✅ Better suited for production workloads

---

### 4. Managed Identity (Azure Resources Only)

**Use Case**: Azure VMs, App Services, Container Instances, Azure Functions

#### Overview
- No credential storage required
- Automatic token refresh
- Azure-managed lifecycle
- Zero-touch authentication

#### System-Assigned Identity Example
```javascript
const { DefaultAzureCredential } = require('@azure/identity');

const credential = new DefaultAzureCredential();

const config = {
  server: 'sqlserver.company.database.windows.net',
  database: 'governance_db',
  authentication: {
    type: 'azure-msi-vm',
    options: {
      token: await credential.getToken('https://database.windows.net/.default')
    }
  },
  options: {
    encrypt: true
  }
};
```

#### User-Assigned Identity Example
```javascript
const { ManagedIdentityCredential } = require('@azure/identity');

const credential = new ManagedIdentityCredential(
  process.env.AZURE_MANAGED_IDENTITY_CLIENT_ID
);

const config = {
  server: 'sqlserver.company.database.windows.net',
  database: 'governance_db',
  authentication: {
    type: 'azure-msi-app-service',
    options: {
      token: await credential.getToken('https://database.windows.net/.default')
    }
  },
  options: {
    encrypt: true
  }
};
```

**Prerequisites**:
- ✅ Running on Azure compute resource
- ✅ Identity enabled on resource
- ✅ SQL Server database user exists for identity
- ✅ @azure/identity package installed

---

### 5. Multi-Factor Authentication (MFA)

**Use Case**: High-security environments, compliance requirements

#### Overview
- Azure AD conditional access enforcement
- Requires Entra ID authentication
- Additional factor required beyond password
- Supported with Azure AD credentials

#### Setup Requirements

1. **Entra ID Configuration**:
   ```
   - Enable MFA requiring policy
   - Configure conditional access rules
   - Set device compliance requirements
   - Define trusted networks (optional)
   ```

2. **User Requirements**:
   ```
   - MFA enrolled (authenticator app, phone, email)
   - Federated credentials if using federation
   - Token refresh capability
   ```

3. **Application Code**:
   ```javascript
   const { InteractiveBrowserCredential } = require('@azure/identity');

   // Interactive login triggering MFA
   const credential = new InteractiveBrowserCredential({
     clientId: process.env.AZURE_CLIENT_ID,
     tenantId: process.env.AZURE_TENANT_ID
   });

   const token = await credential.getToken('https://database.windows.net/.default');

   const config = {
     server: 'sqlserver.company.database.windows.net',
     database: 'governance_db',
     authentication: {
       type: 'azure-service-principal-secret',
       options: {
         token: token.token
       }
     },
     options: {
       encrypt: true,
       trustServerCertificate: false
     }
   };
   ```

#### Token Refresh Strategy
```
Initial Token (1 hour TTL) → MFA Prompt → Refresh Token → New Access Token
                                                          (via refresh token)
```

#### Limitations
- ⚠️ Requires interactive authentication scenarios
- ⚠️ Not suitable for headless/batch operations
- ⚠️ Service principals can use MFA via conditional access

---

## Connection Parameters (mssql npm Package)

### Core Parameters

| Parameter | Type | Default | Required | Notes |
|-----------|------|---------|----------|-------|
| `server` | string | - | ✅ Yes | Host/IP, FQDN, or Azure instance hostname |
| `database` | string | 'master' | Optional | Target database name |
| `authentication` | object | - | ✅ Yes | Auth method configuration |
| `options` | object | {} | Optional | Connection/behavior options |
| `connectionTimeout` | number | 15000 | Optional | Milliseconds before timeout |
| `requestTimeout` | number | 15000 | Optional | Query execution timeout |

### Server / Host Specification

#### Format 1: Simple Server Name (Default Instance)
```javascript
server: 'sqlserver.company.com'
// Connects to: tcp:sqlserver.company.com:1433
```

#### Format 2: With Port Specification
```javascript
server: 'sqlserver.company.com,1434'
// Connects to: tcp:sqlserver.company.com:1434
```

#### Format 3: Named Instance (Windows)
```javascript
server: 'sqlserver.company.com\\SQLEXPRESS'
// Requires SQL Browser service on target
// Uses dynamic port discovery
```

#### Format 4: IP Address
```javascript
server: '192.168.1.100'
// Connects to: tcp:192.168.1.100:1433

// With port:
server: '192.168.1.100,1433'
```

#### Format 5: Azure SQL Database
```javascript
server: 'serverinstance.database.windows.net'
// Format: <server>.database.windows.net
// Always requires encryption
```

#### Format 6: Azure SQL Managed Instance
```javascript
server: 'managedsqlinstance.company.database.windows.net,3342'
// Format: <instance>.database.windows.net,3342
// Port 3342 is standard for managed instances
```

### Encryption Options

| Setting | Impact | Security | Performance | Use Case |
|---------|--------|----------|-------------|----------|
| `encrypt: false` | No TLS | ❌ Weak | ✅ Fastest | Development only |
| `encrypt: true, trustServerCertificate: false` | Required TLS + Cert validation | ✅ Strong | ⚠️ Slight overhead | ✅ Production (Azure) |
| `encrypt: true, trustServerCertificate: true` | TLS but no cert validation | ⚠️ Medium | Minimal | Self-signed certs |

```javascript
// Production (Azure SQL)
{
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
}

// On-Premise with Self-Signed Cert
{
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
}

// Legacy/Development Only (NOT FOR PRODUCTION)
{
  options: {
    encrypt: false
  }
}
```

### Connection Pooling

```javascript
const config = {
  server: 'sqlserver.company.com',
  database: 'governance_db',
  authentication: { /* ... */ },
  pool: {
    min: 2,           // Minimum connections kept open
    max: 10,          // Maximum connections ever created
    idleTimeoutMillis: 30000,  // Idle connection timeout
    acquireTimeoutMillis: 5000, // Time to acquire connection
    reapIntervalMillis: 1000    // Check idle connections frequency
  },
  options: {
    encrypt: true,
    connectionTimeout: 15000,
    requestTimeout: 30000
  }
};
```

#### Pooling Recommendations

| Environment | Min | Max | Idle Timeout | Notes |
|-------------|-----|-----|--------------|-------|
| Development | 1 | 3 | 10 seconds | Minimal resource usage |
| Light Production | 2 | 5 | 30 seconds | Low concurrency, small team |
| Medium Production | 5 | 20 | 60 seconds | Moderate traffic |
| High Traffic | 10 | 50+ | 120+ seconds | Scale with app instances |

### Retry Configuration

```javascript
const config = {
  server: 'sqlserver.company.com',
  database: 'governance_db',
  authentication: { /* ... */ },
  options: {
    encrypt: true,
    connectionTimeout: 15000,
    requestTimeout: 30000,
    // Transient error retry (Azure SQL)
    connectRetryCount: 3,          // Attempts for connection
    connectRetryInterval: 100      // Milliseconds between attempts
  }
};
```

#### Retry Strategy for Transient Errors

```javascript
async function executeWithRetry(connectionPool, query, maxRetries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await connectionPool.request().query(query);
      return result;
    } catch (err) {
      lastError = err;

      // Transient errors (can retry)
      const transientErrors = [
        -2,     // Timeout
        40197,  // Connection lost
        40501,  // Service busy
        40613,  // Database unavailable
        49918,  // Unable to process request
        49919,  // Cannot process create or update request
        49920   // Cannot process delete request
      ];

      if (!transientErrors.includes(err.code) || attempt === maxRetries) {
        throw err;
      }

      // Exponential backoff
      const backoffMs = Math.pow(2, attempt) * 100;
      await new Promise(resolve => setTimeout(resolve, backoffMs));
    }
  }

  throw lastError;
}
```

---

## Connection String Formats

### Format 1: SQL Server Authentication

```
Server=serveraddress;Database=databasename;User Id=username;Password=password;
```

#### Example
```
Server=sqlserver.company.com,1433;Database=governance_db;User Id=sa;Password=P@ssw0rd123!;Encrypt=true;TrustServerCertificate=false;
```

#### Programmatic
```javascript
const config = {
  server: 'sqlserver.company.com,1433',
  database: 'governance_db',
  authentication: {
    type: 'default',
    options: {
      userName: 'sa',
      password: 'P@ssw0rd123!'
    }
  },
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};
```

---

### Format 2: Windows Authentication

```
Server=serveraddress;Database=databasename;Trusted_Connection=yes;Encrypt=true;
```

#### Example
```
Server=sqlserver.company.com;Database=governance_db;Trusted_Connection=yes;Encrypt=true;TrustServerCertificate=false;
```

#### Programmatic
```javascript
const config = {
  server: 'sqlserver.company.com',
  database: 'governance_db',
  authentication: {
    type: 'ntlm',
    options: {
      domain: 'COMPANY'
    }
  },
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};
```

---

### Format 3: Azure AD / Service Principal

```
Server=servername.database.windows.net;Database=databasename;User Id=clientid@tenantid;Password=clientsecret;Authentication=ActiveDirectoryServicePrincipalSecret;Encrypt=true;
```

#### Example
```
Server=sqlserver.database.windows.net;Database=governance_db;User Id=12345678-abcd-efgh-ijkl-mnopqrstuvwx@00000000-1111-2222-3333-444444444444;Password=supersecretvalue123!@#;Authentication=ActiveDirectoryServicePrincipalSecret;Encrypt=true;
```

#### Programmatic
```javascript
const config = {
  server: 'sqlserver.database.windows.net',
  database: 'governance_db',
  authentication: {
    type: 'azure-service-principal-secret',
    options: {
      clientId: '12345678-abcd-efgh-ijkl-mnopqrstuvwx',
      clientSecret: 'supersecretvalue123!@#',
      tenantId: '00000000-1111-2222-3333-444444444444'
    }
  },
  options: {
    encrypt: true
  }
};
```

---

### Format 4: Azure Managed Identity

```
Server=servername.database.windows.net;Database=databasename;Authentication=ActiveDirectoryMsi;Encrypt=true;
```

#### Programmatic
```javascript
const { DefaultAzureCredential } = require('@azure/identity');

const credential = new DefaultAzureCredential();
const token = await credential.getToken('https://database.windows.net/.default');

const config = {
  server: 'sqlserver.database.windows.net',
  database: 'governance_db',
  authentication: {
    type: 'azure-service-principal-secret',
    options: {
      token: token.token
    }
  },
  options: {
    encrypt: true
  }
};
```

---

### Format 5: Named Instance

```
Server=serveraddress\instancename;Database=databasename;User Id=username;Password=password;Encrypt=true;
```

#### Example
```
Server=sqlserver.company.com\SQLEXPRESS;Database=governance_db;User Id=sa;Password=P@ssw0rd123!;Encrypt=true;
```

#### Programmatic
```javascript
const config = {
  server: 'sqlserver.company.com\\SQLEXPRESS',
  database: 'governance_db',
  authentication: {
    type: 'default',
    options: {
      userName: 'sa',
      password: 'P@ssw0rd123!'
    }
  },
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};
```

---

### Format 6: Always Encrypted (Column Master Keys)

```javascript
// Requires sqlcmd driver compilation
const config = {
  server: 'sqlserver.company.com',
  database: 'governance_db',
  authentication: {
    type: 'default',
    options: {
      userName: 'sa',
      password: 'password'
    }
  },
  options: {
    encrypt: true,
    trustServerCertificate: false,
    columnEncryptionSetting: 'Enabled',
    columnEncryptionKeyCacheTtl: 600000 // 10 minutes
  }
};
```

---

## Configuration Examples

### Example 1: Development Local Instance

```javascript
// .env
SQL_SERVER=localhost,1433
SQL_DATABASE=governance_dev
SQL_USERNAME=sa
SQL_PASSWORD=YourPassword123!

// config/database.js
export const devConfig = {
  server: process.env.SQL_SERVER || 'localhost,1433',
  database: process.env.SQL_DATABASE || 'governance_dev',
  authentication: {
    type: 'default',
    options: {
      userName: process.env.SQL_USERNAME || 'sa',
      password: process.env.SQL_PASSWORD
    }
  },
  options: {
    encrypt: false, // OK for local development
    trustServerCertificate: true,
    connectionTimeout: 15000,
    requestTimeout: 30000
  },
  pool: {
    min: 1,
    max: 3,
    idleTimeoutMillis: 10000
  }
};
```

### Example 2: Production Azure SQL (Service Principal)

```javascript
// .env
AZURE_SQL_SERVER=company-prod.database.windows.net
AZURE_SQL_DATABASE=governance_prod
AZURE_TENANT_ID=00000000-1111-2222-3333-444444444444
AZURE_CLIENT_ID=12345678-abcd-efgh-ijkl-mnopqrstuvwx
AZURE_CLIENT_SECRET=<stored_in_key_vault>

// config/database.js
export const prodConfig = {
  server: process.env.AZURE_SQL_SERVER,
  database: process.env.AZURE_SQL_DATABASE,
  authentication: {
    type: 'azure-service-principal-secret',
    options: {
      clientId: process.env.AZURE_CLIENT_ID,
      clientSecret: process.env.AZURE_CLIENT_SECRET,
      tenantId: process.env.AZURE_TENANT_ID
    }
  },
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectRetryCount: 3,
    connectRetryInterval: 100,
    connectionTimeout: 15000,
    requestTimeout: 45000
  },
  pool: {
    min: 5,
    max: 20,
    idleTimeoutMillis: 60000,
    acquireTimeoutMillis: 5000,
    reapIntervalMillis: 1000
  }
};
```

### Example 3: Production Azure SQL (Managed Identity)

```javascript
// deployment/app-service-config
Identity: System-Assigned
environment VARIABLES:
  - AZURE_SQL_SERVER=company-prod.database.windows.net
  - AZURE_SQL_DATABASE=governance_prod

// config/database.js
import { DefaultAzureCredential } from '@azure/identity';

const credential = new DefaultAzureCredential();

export async function getProdManagedIdentityConfig() {
  const token = await credential.getToken('https://database.windows.net/.default');

  return {
    server: process.env.AZURE_SQL_SERVER,
    database: process.env.AZURE_SQL_DATABASE,
    authentication: {
      type: 'azure-service-principal-secret',
      options: {
        token: token.token
      }
    },
    options: {
      encrypt: true,
      connectRetryCount: 3,
      connectRetryInterval: 100,
      connectionTimeout: 15000,
      requestTimeout: 45000
    },
    pool: {
      min: 5,
      max: 20,
      idleTimeoutMillis: 60000
    }
  };
}
```

### Example 4: On-Premise with Windows Auth

```javascript
// config/database.js
export const onPremiseConfig = {
  server: 'sqlprod.company.internal,1433',
  database: 'governance_prod',
  authentication: {
    type: 'ntlm',
    options: {
      domain: 'COMPANY'
      // User context handled by Windows SSPI
    }
  },
  options: {
    encrypt: true,
    trustServerCertificate: true, // Self-signed cert acceptable internal
    connectionTimeout: 15000,
    requestTimeout: 30000,
    // SQL Agent connection retry for internal latency
    connectRetryCount: 2,
    connectRetryInterval: 50
  },
  pool: {
    min: 3,
    max: 15,
    idleTimeoutMillis: 60000
  }
};
```

### Example 5: Connection Factory Pattern

```javascript
// services/database.js
import sql from 'mssql';
import { devConfig } from '../config/database.js';
import { prodConfig, getProdManagedIdentityConfig } from '../config/database.js';

let cachedPool = null;

export async function getConnectionPool() {
  if (cachedPool && cachedPool.connected) {
    return cachedPool;
  }

  const config = process.env.NODE_ENV === 'production'
    ? process.env.USE_MANAGED_IDENTITY
      ? await getProdManagedIdentityConfig()
      : prodConfig
    : devConfig;

  try {
    cachedPool = new sql.ConnectionPool(config);
    await cachedPool.connect();

    cachedPool.on('error', (err) => {
      console.error('Connection pool error:', err);
      cachedPool = null; // Reset on error
    });

    return cachedPool;
  } catch (err) {
    console.error('Failed to create connection pool:', err);
    throw err;
  }
}

export async function executeQuery(query, withRetry = true) {
  const pool = await getConnectionPool();
  
  if (!withRetry) {
    return pool.request().query(query);
  }

  return executeWithRetry(pool, query);
}

export async function closePool() {
  if (cachedPool) {
    await cachedPool.close();
    cachedPool = null;
  }
}
```

---

## Best Practices for Production

### 1. Connection Pooling

**Why**: Avoid connection exhaustion; reuse connections across requests

```javascript
// ✅ RECOMMENDED
const pool = new sql.ConnectionPool({
  // ... config ...
  pool: {
    min: 5,      // Always maintain 5 connections
    max: 20,     // Never exceed 20
    idleTimeoutMillis: 60000
  }
});

// ❌ AVOID
// Creating new connection per request
for (let i = 0; i < 1000; i++) {
  new sql.ConnectionPool(config).connect().then(...);
}
```

### 2. Timeout Configuration

**Why**: Prevent hanging queries; detect dead connections

```javascript
// ✅ RECOMMENDED
const config = {
  options: {
    connectionTimeout: 15000,  // Connection acquisition
    requestTimeout: 30000      // Query execution
  },
  pool: {
    acquireTimeoutMillis: 5000, // Pool timeout for request
    idleTimeoutMillis: 60000     // Reap idle connections
  }
};

// ❌ AVOID
{
  options: {
    requestTimeout: 0  // Infinite—query could hang forever
  }
}
```

### 3. Error Handling

```javascript
// ✅ RECOMMENDED
async function queryWithErrorHandling(pool, query) {
  try {
    const result = await pool.request().query(query);
    return result;
  } catch (err) {
    if (err.code === 'ELOGIN') {
      console.error('Authentication failed:', err.message);
      // Alert ops; check credentials/permissions
    } else if (err.code === 'ETIMEOUT') {
      console.error('Query timeout:', err.message);
      // Could be network issue or slow query
    } else if ([40197, 40501].includes(err.code)) {
      console.error('Transient Azure error:', err.code);
      // Retry eligible
    } else {
      console.error('Unexpected error:', err);
    }
    throw err;
  }
}

// ❌ AVOID
pool.request().query(query).then(result => {
  // No error handling
  console.log(result);
});
```

### 4. Connection String Security

```javascript
// ✅ RECOMMENDED
// Environment variables
process.env.SQL_PASSWORD  // Never logged, never in git

// Azure Key Vault
import { SecretClient } from '@azure/keyvault-secrets';
const secretClient = new SecretClient(
  `https://${process.env.VAULT_NAME}.vault.azure.net/`,
  new DefaultAzureCredential()
);
const secret = await secretClient.getSecret('sql-password');

// ❌ AVOID
const config = {
  authentication: {
    options: {
      password: 'MyPassword123!' // Hardcoded
    }
  }
};

// ❌ AVOID
const sqlConnString = 'Server=...;Password=MyPassword123!;'; // In logs
console.log(sqlConnString);
```

### 5. Encryption & TLS

```javascript
// ✅ RECOMMENDED
{
  options: {
    encrypt: true,
    trustServerCertificate: false  // Validate certificates in production
  }
}

// ⚠️ CONDITIONAL (Self-Signed Internal Cert)
{
  options: {
    encrypt: true,
    trustServerCertificate: true  // Accept self-signed if no CA
  }
}

// ❌ NEVER IN PRODUCTION
{
  options: {
    encrypt: false  // Data sent in clear text
  }
}
```

### 6. Prepared Statements (SQL Injection Prevention)

```javascript
// ✅ RECOMMENDED - Parameterized Query
const result = await pool
  .request()
  .input('userId', sql.Int, userId)
  .query('SELECT * FROM users WHERE user_id = @userId');

// ✅ RECOMMENDED - Stored Procedure
const result = await pool
  .request()
  .input('firstName', sql.NVarChar, 'John')
  .input('lastName', sql.NVarChar, 'Doe')
  .execute('sp_InsertEmployee');

// ❌ AVOID - String Concatenation (SQL Injection Risk)
const query = `SELECT * FROM users WHERE user_id = ${userId}`;
```

### 7. Monitoring & Health Checks

```javascript
// services/health.js
export async function checkDatabaseHealth(pool) {
  try {
    const start = Date.now();
    await pool.request().query('SELECT 1');
    const duration = Date.now() - start;

    return {
      status: 'healthy',
      responseTime: duration,
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    return {
      status: 'unhealthy',
      error: err.message,
      code: err.code,
      timestamp: new Date().toISOString()
    };
  }
}

// Middleware or scheduled task
async function monitorConnectivityEvery30Seconds(pool) {
  setInterval(async () => {
    const health = await checkDatabaseHealth(pool);
    if (health.status !== 'healthy') {
      console.error('Database health check failed:', health);
      // Alert ops; consider circuit breaker
    }
  }, 30000);
}
```

### 8. Graceful Shutdown

```javascript
// gracefulShutdown.js
async function gracefulShutdown(signal) {
  console.log(`Received ${signal}. Shutting down gracefully...`);

  // Stop accepting new requests
  server.close(async () => {
    console.log('HTTP server closed');
    
    // Close database connections
    try {
      await connectionPool.close();
      console.log('Connection pool closed');
    } catch (err) {
      console.error('Error closing pool:', err);
    }

    process.exit(0);
  });

  // Force exit after timeout
  setTimeout(() => {
    console.error('Forced shutdown timeout');
    process.exit(1);
  }, 30000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
```

---

## Azure SQL Database Considerations

### Differences from On-Premise SQL Server

| Aspect | On-Premise | Azure SQL Database |
|--------|-----------|-------------------|
| **Connection** | TCP to private IP/hostname | TCP over public internet (required) |
| **Encryption** | Optional, often self-signed | **Required** (TLS 1.2+) |
| **Authentication** | SQL, Windows, Kerberos | SQL, Azure AD, Managed Identity |
| **Scaling** | Vertical (add CPU/RAM) | Elastic (DTU or vCore) |
| **Maintenance** | DBA responsible | Microsoft automatic |
| **Backup** | Manual or SQL Agent | Automatic (7-35 days) |
| **Availability** | HA/AG add-on | 99.99% built-in |
| **Networking** | Firewall rules (Windows) | Azure Firewall + Virtual Network rules |

### Connection Requirements

```javascript
// ✅ REQUIRED for Azure SQL Database
const azureSqlConfig = {
  server: 'myserver.database.windows.net',  // Must use FQDN
  database: 'mydatabase',
  authentication: {
    type: 'azure-service-principal-secret',  // or managed identity
    options: {
      clientId: process.env.AZURE_CLIENT_ID,
      clientSecret: process.env.AZURE_CLIENT_SECRET,
      tenantId: process.env.AZURE_TENANT_ID
    }
  },
  options: {
    encrypt: true,                    // REQUIRED
    trustServerCertificate: false,    // Validate certs
    connectRetryCount: 3,             // Transient failures common
    connectionTimeout: 15000,
    requestTimeout: 30000
  },
  pool: {
    min: 2,
    max: 10,
    idleTimeoutMillis: 30000
  }
};
```

### Firewall Configuration

**Azure Portal**:
1. Navigate to SQL Server → Firewalls and virtual networks
2. Add rule for client IP: `0.0.0.0 - 255.255.255.255` (or specific range)
3. Allow Azure services: Enabled for same-region Azure resources

```powershell
# PowerShell Script
$sqlServer = "myserver"
$resourceGroup = "myresource-group"

# Add firewall rule for specific IP
New-AzSqlServerFirewallRule `
  -ResourceGroupName $resourceGroup `
  -ServerName $sqlServer `
  -FirewallRuleName "ClientApp" `
  -StartIpAddress "203.0.113.1" `
  -EndIpAddress "203.0.113.1"

# Allow Azure services
New-AzSqlServerFirewallRule `
  -ResourceGroupName $resourceGroup `
  -ServerName $sqlServer `
  -FirewallRuleName "AllowAzureServices" `
  -StartIpAddress "0.0.0.0" `
  -EndIpAddress "0.0.0.0"
```

### Performance Tiers (DTU vs vCore)

```
DTU (Database Transaction Units):
  Basic      → 5 DTU (dev/test only)
  Standard   → 100-3000 DTU (production light-medium)
  Premium    → 4000-4000 DTU (high-performance)

vCore (Virtual Cores) - Newer:
  General Purpose  → 2-80 vCore (flexible, cost-effective)
  Business Critical → 2-80 vCore (high throughput, low latency)
  Hyperscale → unlimited scale (very large databases)
```

**Recommendation**: Use vCore for new workloads; DTU deprecated.

### Connection Pooling & Elastic Pools

```powershell
# Create elastic pool (connects multiple databases)
New-AzSqlElasticPool `
  -ResourceGroupName "myresource-group" `
  -ServerName "myserver" `
  -ElasticPoolName "poolgov" `
  -Edition "Standard" `
  -Dtu 100 `
  -DatabaseDtuMin 10 `
  -DatabaseDtuMax 50

# Add database to pool
Set-AzSqlDatabase `
  -ResourceGroupName "myresource-group" `
  -ServerName "myserver" `
  -DatabaseName "governance_db" `
  -ElasticPoolName "poolgov"
```

### Geo-Replication & Failover

```javascript
// Detection of failover
const config = {
  server: 'myserver.database.windows.net',
  database: 'governance_db',
  options: {
    connectRetryCount: 3,        // Built-in retry for failover
    connectRetryInterval: 100,
    connectionTimeout: 15000,
    requestTimeout: 30000
  }
};

// Automatic failover handling
async function queryWithFailoverRetry(pool, query, maxRetries = 5) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await pool.request().query(query);
    } catch (err) {
      if (attempt < maxRetries && [40197, 40501, 40613].includes(err.code)) {
        // Transient error—likely failover in progress
        const backoffMs = Math.min(10000, Math.pow(2, attempt) * 500);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
        continue;
      }
      throw err;
    }
  }
}
```

---

## Troubleshooting

### Connection Issues

#### Error: "Connect Timeout Expired"

**Causes**:
- Server unreachable (firewall, network)
- Server overloaded
- Long connection acquisition queue

**Solutions**:
```javascript
// 1. Increase timeout
options: {
  connectionTimeout: 30000  // 30 seconds
}

// 2. Reduce pool size to avoid queueing
pool: { max: 5 }

// 3. Verify firewall (Azure)
// - Check server firewall rules
// - Verify client IP is whitelisted
// - "Allow Azure services" enabled if same-region

// 4. Check network
// - ping serveraddress
// - Test port: telnet serveraddress 1433
```

#### Error: "Login Failed for User"

**Causes**:
- Wrong username/password
- Windows auth domain mismatch
- Service principal expired

**Solutions**:
```javascript
// 1. Verify credentials
process.env.SQL_USERNAME
process.env.SQL_PASSWORD

// 2. Check user exists in database
-- SQL Server Management Studio
SELECT name FROM sys.server_principals 
WHERE name LIKE '%username%';

// 3. For Azure AD, verify:
// - User/SP registered in Entra ID
// - SQL database user created:
CREATE USER [service-principal@tenant.onmicrosoft.com] 
  FROM EXTERNAL PROVIDER;

// 4. For service principal, check expiry:
// - Azure Portal → App registrations → Certificates & secrets
// - Rotate if expired
```

#### Error: "Named Instance Not Found" (Windows)

**Causes**:
- SQL Browser service not running
- Named instance doesn't exist
- Firewall blocking UDP 1434

**Solutions**:
```powershell
# 1. Start SQL Browser (on SQL Server)
net start "SQL Server Browser"

# 2. Verify instance exists
Get-Service MSSQL$SQLEXPRESS

# 3. Firewall rule for SQL Browser (UDP 1434)
netsh advfirewall firewall add rule name="SQL Browser" `
  dir=in action=allow protocol=udp localport=1434

# 4. Use direct port instead (if known)
server: 'sqlserver.company.com,1433'  // TCP instead of named instance
```

#### Error: "The certificate chain was issued by an authority that is not trusted"

**Causes**:
- Server certificate self-signed
- Certificate not in trusted store

**Solutions**:
```javascript
// 1. Trust self-signed (if internal)
options: {
  encrypt: true,
  trustServerCertificate: true
}

// 2. Add certificate to trusted store (better)
// Windows: double-click cert → Install certificate → Trusted Root
// Linux: cp cert.pem /usr/local/share/ca-certificates/ && update-ca-certificates

// 3. Import via Node.js
import https from 'https';
import fs from 'fs';

const ca = [fs.readFileSync('./server-ca.pem', 'utf8')];
// Pass ca array to connection options
```

### Performance Issues

#### Problem: Queries Running Slowly

**Diagnosis**:
```javascript
async function diagnosticQuery(pool) {
  const result = await pool.request().query(`
    SELECT TOP 10
      [statement],
      [total_elapsed_time] / 1000000 as elapsed_seconds,
      [total_logical_reads],
      [execution_count]
    FROM sys.dm_exec_query_stats
    ORDER BY [total_elapsed_time] DESC;
  `);
  console.log(result.recordset);
}
```

**Solutions**:
```javascript
// 1. Implement query timeout
const result = await pool
  .request()
  .query('SELECT ... FROM large_table');  // Add timeout
  
.timeout(5000);  // Fail if exceeds 5 seconds

// 2. Use parameterized query (potentially cached plan)
const result = await pool
  .request()
  .input('status', sql.NVarChar, 'active')
  .query('SELECT * FROM users WHERE status = @status');

// 3. Add indexes (if applicable)
// Create Index in SQL Management Studio or script

// 4. For Azure SQL, scale up DTU/vCore
// Azure Portal → SQL Database → Compute + Storage
```

#### Problem: Connection Pool Exhaustion

**Symptoms**:
- "Unable to acquire connection" errors
- Requests queuing indefinitely

**Solutions**:
```javascript
// 1. Monitor pool
pool.on('error', err => console.error('Pool error:', err));

// 2. Reduce max connections or increase timeout
pool: {
  max: 10,  // Lower max
  acquireTimeoutMillis: 10000  // Allow more wait
}

// 3. Ensure connections are being released
// ❌ DON'T: Keep connection open indefinitely
// ✅ DO: Use 'using' or try-finally
try {
  const result = await pool.request().query(query);
} finally {
  // Connection auto-released
}
```

### Entra ID / Azure AD Issues

#### Problem: "AADSTS700016: Application not found in the directory"

**Cause**: Service Principal doesn't exist or wrong tenant

**Solution**:
```javascript
// 1. Verify app registration exists
// Azure Portal → App registrations → search by Client ID

// 2. Check correct tenant
// Azure Portal → Manage tenants → verify tenant ID

// 3. Create if missing
// Azure Portal → Create new app registration

// 4. Test token generation
import { AzureCliCredential } from '@azure/identity';
const cred = new AzureCliCredential({ tenantId: process.env.TENANT_ID });
const token = await cred.getToken('https://database.windows.net/.default');
```

#### Problem: "No password is set for the user 'dbo' registered from external provider"

**Cause**: Entra ID user exists but not mapped to SQL user

**Solution**:
```sql
-- SQL: Create database user for service principal
CREATE USER [governance-service@contoso.onmicrosoft.com] 
  FROM EXTERNAL PROVIDER;

-- Grant permissions
ALTER ROLE db_datareader ADD MEMBER [governance-service@contoso.onmicrosoft.com];
ALTER ROLE db_datawriter ADD MEMBER [governance-service@contoso.onmicrosoft.com];
```

---

## Environment Variables Reference

### Development (.env)

```env
# SQL Connection
SQL_SERVER=localhost,1433
SQL_DATABASE=governance_dev
SQL_USERNAME=sa
SQL_PASSWORD=YourPassword123!
SQL_ENCRYPT=false
SQL_TRUST_CERT=true
SQL_TIMEOUT=15000
SQL_POOL_MIN=1
SQL_POOL_MAX=3
```

### Production (.env or Key Vault)

```env
AZURE_SQL_SERVER=governance-prod.database.windows.net
AZURE_SQL_DATABASE=governance_prod
AZURE_TENANT_ID=<from Azure Portal>
AZURE_CLIENT_ID=<from App Registration>
AZURE_CLIENT_SECRET=<stored in Key Vault>
SQL_ENCRYPT=true
SQL_TRUST_CERT=false
SQL_TIMEOUT=15000
SQL_POOL_MIN=5
SQL_POOL_MAX=20
```

---

## Summary Table: Quick Reference

| Scenario | Auth Type | Encrypt | TrustCert | Pooling | TLS Requirement |
|----------|-----------|---------|-----------|---------|-----------------|
| Local Dev | SQL | false | true | min:1, max:3 | No |
| On-Premise Prod | Windows | true | true | min:3, max:15 | TLS 1.2 |
| Azure SQL (SP) | Azure AD | true | false | min:5, max:20 | TLS 1.2+ |
| Azure SQL (MSI) | Managed ID | true | false | min:5, max:20 | TLS 1.2+ |
| SQL Server 2016+ | SQL or Windows | true | false | min:2, max:10 | TLS 1.2 |

---

**Version History**
- v1.0 (May 2026): Initial comprehensive guide covering SQL Server 2012-2022, all auth methods, Azure SQL, mssql npm package
