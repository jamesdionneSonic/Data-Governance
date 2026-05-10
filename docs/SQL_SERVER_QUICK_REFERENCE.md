# SQL Server Connection Quick Reference

**At-a-glance reference guide**  
**Use alongside SQL_SERVER_CONNECTION_GUIDE.md and SQL_SERVER_IMPLEMENTATION_GUIDE.md**

---

## Authentication Method Decision Matrix

Choose your authentication method based on your deployment scenario:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Are you running on Azure (VMs, App Service, Container Instances)?      │
├─────────────────────┬───────────────────────────────────────────────────┤
│ YES                 │                                                   │
│  ├─► Use Managed ID?   YES → Managed Identity (easiest, secure)       │
│  │                                                                      │
│  └─► Use Managed ID?   NO → Service Principal + Secret or Certificate  │
│                                (store secret in Key Vault)              │
│                                                                          │
│ NO (On-Premise)                                                        │
│  ├─► Windows Domain?   YES → Windows Authentication (NTLM)            │
│  │                                                                      │
│  └─► Windows Domain?   NO → SQL Server Authentication (User/Password) │
│                                                                          │
└─────────────────────┴───────────────────────────────────────────────────┘
```

---

## Authentication Method Comparison

| Feature | SQL Auth | Windows Auth | Azure AD (SP) | Managed Identity |
|---------|----------|--------------|---------------|------------------|
| **Setup Complexity** | ⭐ Easy | ⭐⭐ Medium | ⭐⭐⭐ Hard | ⭐ Easy |
| **Credential Storage** | Password | None (domain) | Secret in vault | None (system) |
| **Token Refresh** | N/A | N/A | Manual | Automatic |
| **Suitable for** | Local dev | Corporate intranet | Prod cloud | Prod cloud |
| **Security Rating** | ⭐⭐⭐ Medium | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐ Strong | ⭐⭐⭐⭐⭐ Best |
| **Requires AD** | No | Yes | Yes | No (Azure-only) |
| **Supports Azure SQL** | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes |
| **Supports On-Premise** | ✅ Yes | ✅ Yes | ⚠️ 2016+ | ❌ No |
| **Support MFA** | ❌ No | ❌ No | ✅ Yes | ✅ Via Conditional Access |
| **Recommended for Prod** | ⚠️ If no AD | ✅ On-Premise | ✅ Azure | ✅ Azure |

---

## Connection String Quick Reference

### SQL Server Authentication
```
Server=myserver.com,1433;Database=mydb;User Id=username;Password=password;Encrypt=true;TrustServerCertificate=false;
```

**Programmatic**:
```javascript
{
  server: 'myserver.com,1433',
  database: 'mydb',
  authentication: {
    type: 'default',
    options: { userName: 'username', password: 'password' }
  },
  options: { encrypt: true, trustServerCertificate: false }
}
```

### Windows Authentication
```
Server=myserver.com;Database=mydb;Trusted_Connection=yes;Encrypt=true;
```

**Programmatic**:
```javascript
{
  server: 'myserver.com',
  database: 'mydb',
  authentication: {
    type: 'ntlm',
    options: { domain: 'COMPANY' }
  },
  options: { encrypt: true, trustServerCertificate: false }
}
```

### Azure AD Service Principal
```
Server=myserver.database.windows.net;Database=mydb;Authentication=ActiveDirectoryServicePrincipalSecret;User Id=clientid@tenant;Password=secret;Encrypt=true;
```

**Programmatic**:
```javascript
{
  server: 'myserver.database.windows.net',
  database: 'mydb',
  authentication: {
    type: 'azure-service-principal-secret',
    options: {
      clientId: 'clientid',
      clientSecret: 'secret',
      tenantId: 'tenantid'
    }
  },
  options: { encrypt: true }
}
```

### Managed Identity
**Programmatic only**:
```javascript
{
  server: 'myserver.database.windows.net',
  database: 'mydb',
  authentication: {
    type: 'azure-service-principal-secret',
    options: { token: await getToken() }
  },
  options: { encrypt: true }
}
```

---

## Connection Parameter Quick Reference

| Parameter | Value | Purpose | Default |
|-----------|-------|---------|---------|
| `server` | `hostname,port` | Database host | Required |
| `database` | `dbname` | Database to connect | `master` |
| `encrypt` | `true`/`false` | Use TLS | `false` |
| `trustServerCertificate` | `true`/`false` | Validate certs | `false` |
| `connectionTimeout` | `ms` | Connection timeout | 15000 |
| `requestTimeout` | `ms` | Query timeout | 15000 |
| `connectRetryCount` | `n` | Retry attempts | 0 |
| `connectRetryInterval` | `ms` | Retry backoff | 100 |
| `pool.min` | `n` | Min connections | 2 |
| `pool.max` | `n` | Max connections | 10 |
| `pool.idleTimeoutMillis` | `ms` | Idle timeout | 30000 |

---

## Encryption Decision Tree

```
Do you need to encrypt traffic?

├─ YES (Production)
│  ├─ Have valid certificate?
│  │  ├─ YES → encrypt: true, trustServerCertificate: false
│  │  └─ NO → encrypt: true, trustServerCertificate: true
│  └─ Add: connectRetryCount: 2
│
└─ NO (Development only)
   └─ encrypt: false, trustServerCertificate: true
```

**Recommended**:
```javascript
// Production (Azure)
{ encrypt: true, trustServerCertificate: false }

// Production (On-Premise, self-signed)
{ encrypt: true, trustServerCertificate: true }

// Development only
{ encrypt: false }
```

---

## Pool Size Recommendations

| Environment | Min | Max | When to Scale |
|-------------|-----|-----|----------------|
| **Local Dev** | 1 | 3 | N/A |
| **Staging** | 2 | 5 | Low concurrency testing |
| **Production Light** | 2 | 10 | <10 concurrent users |
| **Production Medium** | 5 | 20 | 10-100 concurrent users |
| **Production Heavy** | 10 | 50+ | 100+ concurrent users |

**Formula**: `max = (expected_concurrent_requests × 1.2) + spare`

**Example**: 20 expected concurrent requests → max = (20 × 1.2) + 5 = 29 → use max: 30

---

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| **Timeout Expired** | Server unreachable for 15s | ✓ Check firewall ✓ Verify server/port ✓ Increase timeout |
| **Login Failed** | Bad credentials | ✓ Verify username/password ✓ Check user exists ✓ Verify permissions |
| **Connection Refused** | Port closed | ✓ Check SQL Server running ✓ Verify port ✓ telnet test |
| **Named Instance Not Found** | SQL Browser not running | ✓ Start SQL Browser service ✓ Use fixed port instead |
| **Certificate Validation Failed** | Self-signed cert | ✓ Set trustServerCertificate: true ✓ Install cert in store |
| **AADSTS Error** | Azure AD issue | ✓ Verify client ID/secret ✓ Check app registration ✓ Confirm tenant ID |
| **Max Pool Size Exceeded** | Too many requests | ✓ Increase pool.max ✓ Increase timeout ✓ Optimize queries |

---

## Environment Setup Checklists

### ✅ Local Development

```
□ Install SQL Server Express (free)
□ Edit SQL_SERVER connection string for localhost
□ Update .env with local credentials
□ Test: npm test database.test.js
□ Set encrypt: false for local dev
□ Verify connection: npm run health-check
```

### ✅ On-Premise Production

```
□ Get SQL Server hostname/IP and port from DBA
□ Get AD domain and service account
□ Test Windows authentication locally first
□ Configure firewall rules (TCP 1433 inbound)
□ Set encrypt: true with company cert
□ Create database user for service account
□ Test: telnet [server] 1433
□ Run health check script
□ Set pool: { min: 5, max: 20 }
```

### ✅ Azure Production (Service Principal)

```
□ Create app registration in Entra ID
□ Generate client secret (store in Key Vault)
□ Get tenant ID and client ID
□ Create contained database user:
  CREATE USER [app@tenant] FROM EXTERNAL PROVIDER;
□ Grant permissions to user
□ Set encrypt: true (required)
□ Configure firewall rule for app IP
□ Test connection before deploy
□ Set connectRetryCount: 3 for transient errors
□ Store secret in Key Vault (never in code)
```

### ✅ Azure Production (Managed Identity)

```
□ Enable System-Assigned or User-Assigned identity on resource
□ Create contained database user:
  CREATE USER [resource-name] FROM EXTERNAL PROVIDER;
□ Grant permissions to user
□ Install @azure/identity package
□ Test token generation
□ Set pool: { min: 5, max: 20 }
□ Verify managed identity has SQL Server access role
□ Test health check after deploy
```

---

## mssql Package Installation

```bash
# Install mssql driver
npm install mssql

# Install azure/identity for Azure AD auth
npm install @azure/identity

# Optional: For Key Vault secrets
npm install @azure/keyvault-secrets

# Development
npm install --save-dev jest supertest
```

---

## SQL Server Version Support

| Version | Release | Support Ends | Recommended | TLS |
|---------|---------|--------------|-------------|-----|
| 2012 | 2012 | ❌ EOL | ❌ Avoid | 1.0 |
| 2014 | 2014 | ❌ EOL | ❌ Avoid | 1.0 |
| 2016 | 2015 | 2026 | ⚠️ Supported | 1.2 |
| 2017 | 2017 | 2027 | ✅ Good | 1.2 |
| 2019 | 2019 | 2030 | ✅ Good | 1.2+ |
| 2022 | 2022 | 2033 | ✅ Best | 1.2+ |

**Minimum Recommended**: SQL Server 2016+

---

## Performance Tuning Checklist

```
Connection Pool:
□ Set appropriate min/max for workload
□ Monitor pool utilization
□ Adjust idle timeout

Queries:
□ Use parameterized queries (prevent SQL injection)
□ Create indexes on frequently searched columns
□ Use EXPLAIN PLAN for slow queries
□ Add query timeouts

Retry Strategy:
□ Enable connectRetryCount for Azure
□ Use exponential backoff
□ Monitor retry metrics

Monitoring:
□ Log slow queries (>5s)
□ Track connection errors
□ Monitor pool exhaustion
□ Track transaction times
```

---

## Security Checklist

```
Credentials:
□ Never hardcode passwords
□ Use environment variables
□ Store secrets in Azure Key Vault
□ Rotate credentials every 90 days
□ Use certificates for service principals

Encryption:
□ Require encrypt: true in production
□ Validate certificates (trustServerCertificate: false)
□ Enforce TLS 1.2 minimum
□ Use HTTPS for client connections

Database Users:
□ Create least-privilege accounts
□ Disable default accounts (sa)
□ Use contained database users for Azure
□ Monitor failed login attempts

Connection Strings:
□ Never log full connection strings
□ Mask passwords in logs
□ Use secure string type in Key Vault
□ Implement connection string versioning
```

---

## Testing Database Connections

### Quick Test Script
```javascript
// test-connection.js
import sql from 'mssql';

const config = {
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  authentication: {
    type: 'default',
    options: {
      userName: process.env.SQL_USERNAME,
      password: process.env.SQL_PASSWORD
    }
  },
  options: {
    encrypt: process.env.SQL_ENCRYPT !== 'false',
    trustServerCertificate: process.env.SQL_TRUST_CERT === 'true'
  }
};

async function testConnection() {
  try {
    const pool = new sql.ConnectionPool(config);
    await pool.connect();
    console.log('✅ Connection successful');

    const result = await pool.request().query('SELECT 1 as test');
    console.log('✅ Query successful:', result.recordset);

    await pool.close();
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();
```

**Run**:
```bash
node test-connection.js
```

### Azure CLI Test (Managed Identity)
```bash
# Get token
az account get-access-token --resource https://database.windows.net

# Test connection with token
sqlcmd -S myserver.database.windows.net \
  -d mydb \
  -U token_from_above \
  -P password_is_token \
  -Q "SELECT 1"
```

---

## Deployment Checklist

### Pre-Deployment
```
□ Database backups created
□ Connection string tested in staging
□ Credentials rotated if reused
□ Firewall rules configured
□ Database users created with permissions
□ Health check endpoint tested
□ Connection pool settings optimized
□ Retry logic verified
□ Logging configured
□ Monitoring enabled
```

### Deployment
```
□ Set environment variables before app start
□ Verify DATABASE connectivity before requests accepted
□ Check /health endpoint returns healthy
□ Monitor error logs first 5 minutes
□ Run smoke tests
□ Verify performance baseline
```

### Post-Deployment
```
□ Monitor connection errors
□ Track query performance
□ Verify pool utilization
□ Check for timeout errors
□ Monitor resource usage
□ Test failover (Azure)
□ Schedule health check probes
□ Verify retention policies enabled
```

---

## Next Steps

1. **Choose authentication method** → See decision matrix above
2. **Get implementation code** → See `SQL_SERVER_IMPLEMENTATION_GUIDE.md`
3. **Review detailed docs** → See `SQL_SERVER_CONNECTION_GUIDE.md`
4. **Test locally** → Run `test-connection.js`
5. **Deploy to staging** → Verify in non-prod first
6. **Monitor in production** → Track health and performance

---

## Reference Links

- [mssql npm package docs](https://tediousjs.github.io/tedious/)
- [SQL Server 2022 docs](https://learn.microsoft.com/en-us/sql/sql-server/)
- [Azure SQL Database docs](https://learn.microsoft.com/en-us/azure/azure-sql/database/)
- [Azure AD integration](https://learn.microsoft.com/en-us/azure/azure-sql/database/authentication-aad-overview)
- [Managed identities](https://learn.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/)

