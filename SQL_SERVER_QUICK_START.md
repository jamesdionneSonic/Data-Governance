# SQL Server Connector - Quick Start Guide

## Getting Started in 5 Minutes

### Prerequisites
1. Active governance platform instance running
2. Access to a SQL Server database (2012 or later)
3. Appropriate credentials for the database

### Step 1: Open Importer
1. Click **"Import"** tab in the left sidebar
2. You'll see the **"SQL Server Connector"** card at the top

### Step 2: Configure Connection

#### For SQL Server Authentication (username/password):
1. Select **"SQL Server Auth"** from dropdown
2. Enter server address (e.g., `localhost` or `myserver.database.windows.net`)
3. Enter port (default: 1433)
4. Enter database name
5. Enter username and password
6. Leave encryption enabled (recommended)

#### For Windows Authentication:
1. Select **"Windows Auth"** from dropdown
2. Enter server address
3. Port and database as above
4. (Domain is optional if on same domain)
5. Password field disappears automatically

#### For Azure AD/Azure SQL:
1. Select **"Azure AD"** from dropdown
2. Enter server address (usually `servername.database.windows.net`)
3. Enter database name
4. Enter Azure AD credentials (from Service Principal):
   - Client ID (Application ID)
   - Client Secret (Password)
   - Tenant ID (Directory ID)
5. Leave encryption enabled

### Step 3: Click "Connect & Extract"
- Button shows "Connecting..." while processing
- Wait for results (typically 10-60 seconds depending on database size)

### Step 4: Review Results
You'll see a blue box with extraction statistics:
- **Tables**: Number of tables/views extracted
- **Relationships**: Total relationships detected
- **High Confidence**: Relationships scoring ≥0.75 (most trustworthy)
- **Markdown Files**: Ready to process with existing importer

### Step 5: Import Markdown
1. Scroll down to **"Markdown Upload & Parse"** section
2. The generated markdown files are ready to load
3. Files contain all governance metadata from SQL Server
4. Click existing "Load Metadata" button to ingest them

---

## Common Connection Examples

### Local SQL Server (Windows Machine)
```
Server: localhost
Port: 1433
Database: master
Authentication: SQL Server Auth
Username: sa
Password: [your_password]
```

### Azure SQL Database
```
Server: myserver.database.windows.net
Port: 1433
Database: mydb
Authentication: Azure AD
Client ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Client Secret: xxxxxxxxxxxxxxxxxxxxxxxxx
Tenant ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Encrypt: ✓ (checked)
Trust Server Cert: (unchecked)
```

### On-Premise (Windows Domain)
```
Server: sqlserver.company.local
Port: 1433
Database: analytics
Authentication: Windows Auth
Domain: COMPANY
(Uses your current Windows login)
```

---

## Understanding Confidence Scores

### How relationships are ranked:

**Highest Confidence (1.0)** 🟢
- `customer` → `orders` (has explicit Foreign Key)
- Definitive table relationships from database schema

**High Confidence (0.8-0.95)** 🟢
- `customer_id` column appears in multiple tables
- Pattern-based relationships with strong signals

**Medium Confidence (0.6-0.8)** 🟡
- Staging tables detected (`stg_customer`)
- ETL pipeline patterns recognized
- Naming conventions match

**Low Confidence (<0.6)** 🔴
- Generic column matches (`id`, `name`)
- Weak patterns - needs manual review
- Often rejected in production environments

---

## Troubleshooting

### "Connection Failed" Error
1. **Check server address**: Ping `your_server` from command line
   ```powershell
   Test-NetConnection your_server -Port 1433
   ```
2. **Check credentials**: Verify username/password in SQL Server
3. **Check network**: Firewall might block port 1433
4. **Check SQL Server version**: Must be 2012 or later

### "Authentication Failed" Error
1. **SQL Server Auth**: Verify user exists and password is correct
2. **Windows Auth**: Verify you're on the same domain
3. **Azure AD**: Check Client ID/Secret in Azure Portal

### "Permission Denied" Error
1. User needs SELECT permission on system views
2. Grant permission:
   ```sql
   GRANT VIEW DEFINITION ON DATABASE::DatabaseName TO [your_login]
   GRANT CONNECT TO [your_login]
   ```

### "Timeout" (Takes >5 minutes)
1. Network might be slow - increase timeout
2. Database might be very large (>1000 tables)
3. System load might be high - try later

### Markdown not appearing
1. Check browser console for errors (F12)
2. Verify extraction completed successfully
3. Check that at least 1 table was extracted

---

## Confidence Calibration (Advanced)

By default, relationships ≥0.75 are marked "High Confidence". Adjust based on environment:

**Development Environment**: Use 0.35 threshold
- Catches all potential relationships
- Requires manual validation
- Good for exploration

**Staging Environment**: Use 0.55 threshold
- Balanced approach
- Some false positives expected
- Review before production

**Production Environment**: Use 0.75 threshold
- Conservative, high precision
- Minimizes false lineage
- Require explicit relationships

**Compliance Environment**: Use 0.85 threshold
- Only definitive relationships
- FK constraints and exact patterns only
- No estimation-based relationships

---

## What Gets Extracted?

### Metadata Captured per Table:
- **Name & Schema**: Table/view identification
- **Row Count**: Data volume indicator
- **Size**: Storage footprint
- **Type**: Table vs View distinction
- **Owner**: Schema ownership info

### Relationships Detected:
1. Explicit Foreign Keys (confidence 1.0)
2. Column name matches (confidence 0.80+)
3. ETL/staging patterns (confidence 0.75+)
4. Naming conventions (confidence 0.70+)
5. Soft deletes (confidence 0.60+)

### Governance Metadata Generated:
- Classification placeholders (PII, Sensitive, Public)
- Stewardship ownership fields
- Compliance framework tags
- Data retention policies
- Access control hints

---

## Integration Workflow

```
┌─────────────────────────────┐
│ SQL Server Configuration    │
│ (Connect & Extract Button)  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Metadata Extraction         │
│ (Tables, Columns, FK, etc)  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Relationship Detection      │
│ (Confidence Scoring)        │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Markdown Generation         │
│ (YAML + Governance)         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Markdown Importer           │
│ (Existing Pipeline)         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Governance Database         │
│ (Lineage, Classifications)  │
└─────────────────────────────┘
```

---

## Performance Tips

### For Large Databases (>5000 tables):
1. Extract by schema: Run multiple connections, one schema at a time
2. Extract off-peak: Run during low usage periods
3. Monitor SQL Server: Check system load during extraction

### For Slow Networks:
1. Increase timeout values (contact admin)
2. Extract during low-latency hours
3. Consider exporting to intermediate server first

### For Stable Extractions:
1. Run test extraction on small database first
2. Verify results before production databases
3. Save successful configurations for repeat use

---

## Generating Sample Data

### Create Test Database (SQL Server):
```sql
-- Create test database with relationships
CREATE DATABASE TestGov;
USE TestGov;

-- Create dimension table
CREATE TABLE dim_customer (
    customer_id INT PRIMARY KEY,
    name NVARCHAR(100),
    city NVARCHAR(50)
);

-- Create fact table
CREATE TABLE fact_orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    amount DECIMAL(10,2),
    order_date DATE,
    FOREIGN KEY(customer_id) REFERENCES dim_customer(customer_id)
);

-- Create staging table
CREATE TABLE stg_customer_raw (
    customer_id INT,
    name NVARCHAR(100),
    source_date DATE
);

-- Insert test data
INSERT INTO dim_customer VALUES (1, 'Alice', 'New York');
INSERT INTO dim_customer VALUES (2, 'Bob', 'Boston');
INSERT INTO fact_orders VALUES (101, 1, 500.00, '2024-01-01');
INSERT INTO fact_orders VALUES (102, 2, 750.00, '2024-01-02');
```

Then connect and extract - you should see:
- 2 tables, 1 staging table
- 1 relationship (customer → orders)
- High confidence FK relationship

---

## Next Steps

After importing SQL Server metadata:

1. **Review Generated Markdown**
   - Check classifications match your business
   - Update ownership and contact info
   - Add business descriptions

2. **Validate Relationships**
   - Verify confidence scores make sense
   - Reject false positives in governance UI
   - Document manual relationships

3. **Configure Dashboard**
   - Pin important tables
   - Create views for key lineages
   - Set up data quality checks

4. **Archive Results**
   - Export markdown for git/version control
   - Create baseline for comparison
   - Schedule regular re-extractions

---

## Support & Documentation

- **Technical Issues**: See SQL_SERVER_IMPLEMENTATION_COMPLETE.md
- **Confidence Tuning**: See SCORING_CALIBRATION_MATRIX.md
- **Architecture**: See ENTERPRISE_ARCHITECTURE.md
- **Research**: See LINEAGE_DETECTION_RESEARCH.md

---

## Feedback & Improvements

This connector extracts metadata and relationships with configurable confidence scoring.
Suggestions for enhancement:
- Incremental extraction (only changed objects)
- Data quality profiling
- Row-level lineage from queries
- Column-level sensitivity classification
- Automated compliance checking

