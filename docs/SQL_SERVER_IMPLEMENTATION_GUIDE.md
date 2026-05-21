# SQL Server Connection Implementation Examples

**Companion guide to SQL_SERVER_CONNECTION_GUIDE.md**  
**Version**: 1.0 (May 2026)

---

## Quick Start Code Snippets

### 1. Basic Connection Setup

```javascript
// services/sqlConnection.js
import sql from 'mssql';

/**
 * Basic SQL Server connection configuration
 * For development environment
 */
export const basicDevConfig = {
  server: process.env.SQL_SERVER || 'localhost,1433',
  database: process.env.SQL_DATABASE || 'governance_db',
  authentication: {
    type: 'default',
    options: {
      userName: process.env.SQL_USERNAME || 'sa',
      password: process.env.SQL_PASSWORD || 'Password123!'
    }
  },
  options: {
    encrypt: false,
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

/**
 * Initialize connection pool
 */
let connectionPool = null;

export async function initializeConnectionPool(config = basicDevConfig) {
  try {
    connectionPool = new sql.ConnectionPool(config);
    
    connectionPool.on('error', (err) => {
      console.error('Connection pool error:', err);
      connectionPool = null;
    });

    await connectionPool.connect();
    console.log('Connection pool initialized successfully');
    return connectionPool;
  } catch (err) {
    console.error('Failed to initialize connection pool:', err);
    throw err;
  }
}

export function getConnectionPool() {
  if (!connectionPool || !connectionPool.connected) {
    throw new Error('Connection pool not initialized');
  }
  return connectionPool;
}

export async function closeConnectionPool() {
  if (connectionPool) {
    await connectionPool.close();
    connectionPool = null;
    console.log('Connection pool closed');
  }
}
```

---

### 2. SQL Server Authentication (Username/Password)

```javascript
// config/sqlServers.js

/**
 * SQL Server Authentication Configuration
 * Username and password stored in environment variables
 */
export const sqlServerAuthConfig = {
  server: 'sqlserver.company.com,1433',
  database: 'governance_db',
  authentication: {
    type: 'default',
    options: {
      userName: process.env.SQL_USERNAME,
      password: process.env.SQL_PASSWORD
    }
  },
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectionTimeout: 15000,
    requestTimeout: 30000,
    connectRetryCount: 2,
    connectRetryInterval: 100
  },
  pool: {
    min: 2,
    max: 10,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 5000
  }
};

/**
 * Usage example
 */
import sql from 'mssql';

async function exampleQuery() {
  try {
    const pool = new sql.ConnectionPool(sqlServerAuthConfig);
    await pool.connect();

    const result = await pool
      .request()
      .input('status', sql.NVarChar, 'active')
      .query('SELECT * FROM users WHERE status = @status');

    console.log('Query result:', result.recordset);
    await pool.close();
  } catch (err) {
    console.error('Query failed:', err);
  }
}
```

---

### 3. Azure AD Service Principal (Secret)

```javascript
// config/azureAdConfig.js

/**
 * Azure AD Service Principal Authentication
 * Using Client ID + Client Secret
 */
export const azureAdServicePrincipalConfig = {
  server: 'governance-prod.database.windows.net',
  database: 'governance_prod',
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
    connectionTimeout: 15000,
    requestTimeout: 30000,
    connectRetryCount: 3,
    connectRetryInterval: 100
  },
  pool: {
    min: 5,
    max: 20,
    idleTimeoutMillis: 60000,
    acquireTimeoutMillis: 5000,
    reapIntervalMillis: 1000
  }
};

/**
 * Recommended: Use Azure Key Vault for secret storage
 */
import { SecretClient } from '@azure/keyvault-secrets';
import { DefaultAzureCredential } from '@azure/identity';

export async function getAzureAdConfigFromKeyVault() {
  const credential = new DefaultAzureCredential();
  const secretClient = new SecretClient(
    `https://${process.env.VAULT_NAME}.vault.azure.net/`,
    credential
  );

  const [clientId, clientSecret, tenantId] = await Promise.all([
    secretClient.getSecret('sql-client-id'),
    secretClient.getSecret('sql-client-secret'),
    secretClient.getSecret('sql-tenant-id')
  ]);

  return {
    server: 'governance-prod.database.windows.net',
    database: 'governance_prod',
    authentication: {
      type: 'azure-service-principal-secret',
      options: {
        clientId: clientId.value,
        clientSecret: clientSecret.value,
        tenantId: tenantId.value
      }
    },
    options: {
      encrypt: true,
      trustServerCertificate: false,
      connectRetryCount: 3,
      connectRetryInterval: 100
    },
    pool: {
      min: 5,
      max: 20,
      idleTimeoutMillis: 60000
    }
  };
}
```

---

### 4. Azure Managed Identity

```javascript
// config/managedIdentityConfig.js
import { DefaultAzureCredential } from '@azure/identity';

/**
 * Azure Managed Identity Configuration
 * For App Services, Container Instances, VMs in Azure
 */
let cachedTokenConfig = null;
let tokenExpiryTime = null;

export async function getManagedIdentityConfig() {
  // Reuse token if still valid (tokens expire in 1 hour)
  if (
    cachedTokenConfig &&
    tokenExpiryTime &&
    Date.now() < tokenExpiryTime - 5 * 60 * 1000  // 5 min buffer
  ) {
    return cachedTokenConfig;
  }

  try {
    // Get token using default credentials (system-assigned or user-assigned)
    const credential = new DefaultAzureCredential({
      managedIdentityClientId: process.env.AZURE_CLIENT_ID  // For user-assigned identity
    });

    const token = await credential.getToken('https://database.windows.net/.default');

    cachedTokenConfig = {
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
        trustServerCertificate: false,
        connectRetryCount: 3,
        connectRetryInterval: 100,
        connectionTimeout: 15000,
        requestTimeout: 30000
      },
      pool: {
        min: 5,
        max: 20,
        idleTimeoutMillis: 60000
      }
    };

    // Token expires in ~1 hour; refresh 5 min before expiry
    tokenExpiryTime = Date.now() + (token.expiresOnTimestamp - Date.now()) - 5 * 60 * 1000;

    return cachedTokenConfig;
  } catch (err) {
    console.error('Failed to acquire managed identity token:', err);
    throw err;
  }
}

/**
 * Usage in connection factory
 */
import sql from 'mssql';

export async function getPoolWithManagedIdentity() {
  const config = await getManagedIdentityConfig();
  const pool = new sql.ConnectionPool(config);
  await pool.connect();
  return pool;
}
```

---

### 5. Windows Authentication (NTLM)

```javascript
// config/windowsAuthConfig.js

/**
 * Windows Authentication (NTLM)
 * For on-premise SQL Server in domain environment
 */
export const windowsAuthConfig = {
  server: 'sqlserver.company.internal,1433',
  database: 'governance_db',
  authentication: {
    type: 'ntlm',
    options: {
      domain: process.env.AD_DOMAIN || 'COMPANY'
      // Username and password are optional; uses current Windows security context
    }
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,  // Company internal self-signed cert
    connectionTimeout: 15000,
    requestTimeout: 30000
  },
  pool: {
    min: 3,
    max: 15,
    idleTimeoutMillis: 60000
  }
};

/**
 * For explicit username/password with domain
 */
export const windowsAuthExplicitConfig = {
  server: 'sqlserver.company.internal,1433',
  database: 'governance_db',
  authentication: {
    type: 'ntlm',
    options: {
      domain: 'COMPANY',
      userName: process.env.AD_USERNAME,
      password: process.env.AD_PASSWORD
    }
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
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

---

### 6. Connection Pool Factory Pattern

```javascript
// services/database.js
import sql from 'mssql';
import { basicDevConfig } from '../config/sqlServers.js';
import { azureAdServicePrincipalConfig, getAzureAdConfigFromKeyVault } from '../config/azureAdConfig.js';
import { getManagedIdentityConfig } from '../config/managedIdentityConfig.js';

class DatabasePoolManager {
  constructor() {
    this.pool = null;
    this.isConnected = false;
  }

  /**
   * Initialize connection pool based on environment
   */
  async initialize() {
    let config;

    if (process.env.NODE_ENV === 'production') {
      if (process.env.USE_MANAGED_IDENTITY === 'true') {
        config = await getManagedIdentityConfig();
      } else if (process.env.USE_KEY_VAULT === 'true') {
        config = await getAzureAdConfigFromKeyVault();
      } else {
        config = azureAdServicePrincipalConfig;
      }
    } else {
      config = basicDevConfig;
    }

    return this.connect(config);
  }

  /**
   * Establish connection pool
   */
  async connect(config) {
    try {
      this.pool = new sql.ConnectionPool(config);

      this.pool.on('error', (err) => {
        console.error('Pool error:', err.message);
        this.isConnected = false;
      });

      await this.pool.connect();
      this.isConnected = true;
      console.log('Database pool connected successfully');
      return this.pool;
    } catch (err) {
      console.error('Failed to connect to database:', err);
      this.isConnected = false;
      throw err;
    }
  }

  /**
   * Get active pool
   */
  getPool() {
    if (!this.pool || !this.isConnected) {
      throw new Error('Database pool not connected');
    }
    return this.pool;
  }

  /**
   * Close pool gracefully
   */
  async close() {
    if (this.pool) {
      try {
        await this.pool.close();
        this.isConnected = false;
        console.log('Database pool closed');
      } catch (err) {
        console.error('Error closing pool:', err);
      }
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const result = await this.getPool().request().query('SELECT 1');
      return { status: 'healthy', timestamp: new Date().toISOString() };
    } catch (err) {
      return {
        status: 'unhealthy',
        error: err.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

export const dbPool = new DatabasePoolManager();

/**
 * Convenience method for queries
 */
export async function executeQuery(query, parameters = {}) {
  const pool = dbPool.getPool();
  const request = pool.request();

  // Add input parameters
  Object.entries(parameters).forEach(([key, { type, value }]) => {
    request.input(key, type, value);
  });

  return request.query(query);
}
```

---

### 7. Parameterized Queries & SQL Injection Prevention

```javascript
// services/userService.js
import sql from 'mssql';
import { dbPool } from './database.js';

/**
 * ✅ SAFE: Parameterized query prevents SQL injection
 */
export async function getUserById(userId) {
  try {
    const result = await dbPool.getPool()
      .request()
      .input('userId', sql.Int, userId)
      .query('SELECT user_id, name, email FROM users WHERE user_id = @userId');

    return result.recordset[0] || null;
  } catch (err) {
    console.error('Failed to get user:', err);
    throw err;
  }
}

/**
 * ✅ SAFE: Multiple parameters
 */
export async function searchUsers(firstName, lastName) {
  try {
    const result = await dbPool.getPool()
      .request()
      .input('firstName', sql.NVarChar(100), firstName)
      .input('lastName', sql.NVarChar(100), lastName)
      .query(`
        SELECT user_id, name, email 
        FROM users 
        WHERE name LIKE '%' + @firstName + '%'
          OR name LIKE '%' + @lastName + '%'
      `);

    return result.recordset;
  } catch (err) {
    console.error('Search failed:', err);
    throw err;
  }
}

/**
 * ✅ SAFE: Using stored procedure (built-in parameters)
 */
export async function createUser(firstName, lastName, email) {
  try {
    const result = await dbPool.getPool()
      .request()
      .input('firstName', sql.NVarChar(100), firstName)
      .input('lastName', sql.NVarChar(100), lastName)
      .input('email', sql.NVarChar(255), email)
      .execute('sp_CreateUser');

    return result.returnValue;
  } catch (err) {
    console.error('Failed to create user:', err);
    throw err;
  }
}

/**
 * ⚠️ DANGEROUS: String concatenation (SQL Injection Risk)
 * DO NOT USE THIS
 */
export async function unsafeGetUser(userId) {
  // ❌ UNSAFE: userId not escaped; vulnerable to injection
  const query = `SELECT * FROM users WHERE user_id = ${userId}`;
  
  // Attacker could pass: userId = "1; DROP TABLE users; --"
  // Resulting query: SELECT * FROM users WHERE user_id = 1; DROP TABLE users; --
  
  return dbPool.getPool().request().query(query);
}

/**
 * Data type mapping for common types
 */
const sqlTypeMap = {
  int: sql.Int,
  string: sql.NVarChar(sql.MAX),
  varchar: (length = 255) => sql.VarChar(length),
  nvarchar: (length = 255) => sql.NVarChar(length),
  date: sql.Date,
  datetime: sql.DateTime,
  decimal: (precision = 18, scale = 2) => sql.Decimal(precision, scale),
  bit: sql.Bit,
  bigint: sql.BigInt,
  uniqueidentifier: sql.UniqueIdentifier
};

/**
 * Helper for dynamic parameterized queries
 */
export async function executeParamQuery(query, params) {
  const request = dbPool.getPool().request();

  Object.entries(params).forEach(([name, value]) => {
    request.input(name, value.type || sql.NVarChar, value.value || value);
  });

  return request.query(query);
}
```

---

### 8. Connection Retry & Transient Error Handling

```javascript
// services/resilientDatabase.js
import { dbPool } from './database.js';

/**
 * Transient error codes in Azure SQL
 */
const TRANSIENT_ERRORS = new Set([
  -2,      // Timeout
  40197,   // Connection lost
  40501,   // Service busy
  40613,   // Database unavailable
  49918,   // Unable to process request
  49919,   // Cannot process create or update request
  49920    // Cannot process delete request
]);

/**
 * Execute query with exponential backoff retry
 */
export async function executeWithRetry(query, parameters = {}, maxRetries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await dbPool.getPool()
        .request();

      // Add parameters
      Object.entries(parameters).forEach(([key, value]) => {
        result.input(key, value.type, value.value);
      });

      return await result.query(query);
    } catch (err) {
      lastError = err;

      // Check if retryable
      const isTransient = TRANSIENT_ERRORS.has(err.code);

      console.warn(
        `Query failed (attempt ${attempt}/${maxRetries}, transient: ${isTransient}):`,
        err.message
      );

      if (!isTransient || attempt === maxRetries) {
        throw err;
      }

      // Exponential backoff: 100ms, 200ms, 400ms
      const backoffMs = Math.pow(2, attempt - 1) * 100;
      await new Promise(resolve => setTimeout(resolve, backoffMs));
    }
  }

  throw lastError;
}

/**
 * Execute with circuit breaker pattern
 */
class CircuitBreaker {
  constructor(failureThreshold = 5, resetTimeoutMs = 60000) {
    this.failureCount = 0;
    this.failureThreshold = failureThreshold;
    this.resetTimeoutMs = resetTimeoutMs;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttemptTime = null;
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttemptTime) {
        throw new Error('Circuit breaker is OPEN; requests blocked');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttemptTime = Date.now() + this.resetTimeoutMs;
      console.error(
        `Circuit breaker opened; will retry in ${this.resetTimeoutMs}ms`
      );
    }
  }
}

export const dbCircuitBreaker = new CircuitBreaker();

/**
 * Usage of circuit breaker
 */
export async function executeWithCircuitBreaker(query, parameters = {}) {
  return dbCircuitBreaker.execute(() =>
    executeWithRetry(query, parameters)
  );
}
```

---

### 9. Health Check Middleware

```javascript
// middleware/healthCheck.js
import { dbPool } from '../services/database.js';

/**
 * Database health check
 */
export async function checkDatabaseHealth() {
  try {
    const start = Date.now();
    const result = await dbPool.getPool().request().query('SELECT 1');
    const responseTime = Date.now() - start;

    return {
      status: 'healthy',
      responseTime,
      timestamp: new Date().toISOString(),
      message: 'Database connection healthy'
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

/**
 * Express middleware for /health endpoint
 */
export async function healthCheckHandler(req, res) {
  const health = await checkDatabaseHealth();

  if (health.status !== 'healthy') {
    return res.status(503).json(health);
  }

  res.status(200).json(health);
}

/**
 * Continuous health monitoring (background task)
 */
export function startHealthMonitoring(intervalMs = 30000) {
  setInterval(async () => {
    const health = await checkDatabaseHealth();

    if (health.status !== 'healthy') {
      console.error('Health check failed:', health);
      // Alert ops; consider graceful degradation
    } else if (health.responseTime > 5000) {
      console.warn('Slow database response:', health.responseTime, 'ms');
    }
  }, intervalMs);
}
```

---

### 10. Graceful Shutdown

```javascript
// middleware/gracefulShutdown.js
import { dbPool } from '../services/database.js';

const SHUTDOWN_TIMEOUT = 30000; // 30 seconds

export function setupGracefulShutdown(server) {
  let isShuttingDown = false;

  const handleShutdown = async (signal) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`Received ${signal}. Shutting down gracefully...`);

    // Stop accepting new requests
    server.close(async () => {
      console.log('HTTP server closed');

      try {
        // Close database pool
        await dbPool.close();
        console.log('Database pool closed');
      } catch (err) {
        console.error('Error closing database pool:', err);
      }

      // Force exit if timeout exceeded
      setTimeout(() => {
        console.error('Shutdown timeout exceeded. Forcing exit.');
        process.exit(1);
      }, SHUTDOWN_TIMEOUT);

      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}
```

---

### 11. Connection Pool Configuration by Environment

```javascript
// config/environmentConfigs.js

export function getConfigByEnvironment() {
  const env = process.env.NODE_ENV || 'development';

  const configs = {
    development: {
      server: 'localhost,1433',
      database: 'governance_dev',
      authentication: {
        type: 'default',
        options: {
          userName: 'sa',
          password: process.env.SQL_PASSWORD || 'Password123!'
        }
      },
      options: {
        encrypt: false,
        trustServerCertificate: true,
        connectionTimeout: 15000,
        requestTimeout: 30000
      },
      pool: {
        min: 1,
        max: 3,
        idleTimeoutMillis: 10000
      }
    },

    staging: {
      server: process.env.SQL_SERVER,
      database: process.env.SQL_DATABASE,
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
        connectionTimeout: 15000,
        requestTimeout: 30000,
        connectRetryCount: 2,
        connectRetryInterval: 100
      },
      pool: {
        min: 3,
        max: 10,
        idleTimeoutMillis: 30000
      }
    },

    production: {
      server: process.env.AZURE_SQL_SERVER,
      database: process.env.AZURE_SQL_DATABASE,
      authentication: process.env.USE_MANAGED_IDENTITY === 'true'
        ? { type: 'azure-service-principal-secret' }  // Token will be injected
        : {
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
    }
  };

  return configs[env] || configs.development;
}
```

---

### 12. Express.js Integration Example

```javascript
// app.js
import express from 'express';
import { dbPool } from './services/database.js';
import { healthCheckHandler, startHealthMonitoring } from './middleware/healthCheck.js';
import { setupGracefulShutdown } from './middleware/gracefulShutdown.js';

const app = express();

/**
 * Initialize on startup
 */
app.use(express.json());

let server;

async function startServer() {
  try {
    // Initialize database
    await dbPool.initialize();
    console.log('Database initialized');

    // Start health monitoring
    startHealthMonitoring(30000);

    // Health check endpoint
    app.get('/api/v1/health', healthCheckHandler);

    // Example route using database
    app.get('/api/v1/users/:id', async (req, res) => {
      try {
        const result = await dbPool.getPool()
          .request()
          .input('userId', req.params.id)
          .query('SELECT * FROM users WHERE user_id = @userId');

        res.json(result.recordset[0] || {});
      } catch (err) {
        console.error('Query error:', err);
        res.status(500).json({ error: err.message });
      }
    });

    // Start server
    const PORT = process.env.PORT || 3000;
    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Setup graceful shutdown
    setupGracefulShutdown(server);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();

export default app;
```

---

## Environment Variable Templates

### Development (.env.example)

```env
# Development Database
NODE_ENV=development
SQL_SERVER=localhost,1433
SQL_DATABASE=governance_dev
SQL_USERNAME=sa
SQL_PASSWORD=YourPassword123!

# Connection Options
SQL_ENCRYPT=false
SQL_TRUST_CERT=true
SQL_TIMEOUT=15000
SQL_POOL_MIN=1
SQL_POOL_MAX=3
```

### Production (.env.example)

```env
# Production Database
NODE_ENV=production
AZURE_SQL_SERVER=governance-prod.database.windows.net
AZURE_SQL_DATABASE=governance_prod

# Authentication (Service Principal)
AZURE_TENANT_ID=00000000-1111-2222-3333-444444444444
AZURE_CLIENT_ID=12345678-abcd-efgh-ijkl-mnopqrstuvwx
AZURE_CLIENT_SECRET=<stored_in_key_vault>

# Or use Managed Identity
USE_MANAGED_IDENTITY=false
USE_KEY_VAULT=false
VAULT_NAME=governance-keyvault

# Connection Options
SQL_ENCRYPT=true
SQL_TIMEOUT=15000
SQL_POOL_MIN=5
SQL_POOL_MAX=20
```

---

## Testing Database Connections

```javascript
// tests/database.test.js
import { dbPool } from '../services/database.js';
import { basicDevConfig } from '../config/sqlServers.js';

describe('Database Connection', () => {
  beforeAll(async () => {
    await dbPool.connect(basicDevConfig);
  });

  afterAll(async () => {
    await dbPool.close();
  });

  test('should connect to database', async () => {
    const result = await dbPool.getPool().request().query('SELECT 1');
    expect(result).toBeDefined();
  });

  test('should execute parameterized query', async () => {
    const result = await dbPool.getPool()
      .request()
      .input('testId', 1)
      .query('SELECT @testId as id');

    expect(result.recordset[0].id).toBe(1);
  });

  test('should handle health check', async () => {
    const health = await dbPool.healthCheck();
    expect(health.status).toBe('healthy');
  });

  test('should throw on invalid query', async () => {
    expect(async () => {
      await dbPool.getPool().request().query('SELECT * FROM nonexistent_table');
    }).rejects.toThrow();
  });
});
```

---

## Summary

This guide provides production-ready code examples for:
- ✅ Basic connection setup
- ✅ All authentication methods
- ✅ Connection pooling patterns
- ✅ SQL injection prevention
- ✅ Retry and resilience logic
- ✅ Health monitoring
- ✅ Graceful shutdown
- ✅ Environment-based configuration

**Next Steps**:
1. Choose authentication method
2. Use provided configurations
3. Implement connection pool factory
4. Add health check middleware
5. Enable graceful shutdown
