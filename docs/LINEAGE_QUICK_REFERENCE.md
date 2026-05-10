# Data Lineage System: Complete Reference & Quick Navigation

**Version**: 1.0  
**Date**: May 2026  
**Status**: Production-Ready Framework

---

## Overview

This document package provides a comprehensive, enterprise-grade framework for detecting, scoring, and visualizing data lineage relationships beyond traditional Foreign Key constraints. The system combines multiple detection methods, confidence scoring, and governance integration.

---

## Document Map

### 1. **LINEAGE_DETECTION_RESEARCH.md** - Theoretical Foundation
**When to Read**: Initial setup, strategy planning, architecture decisions  
**Key Sections**:
- Confidence scoring tiers (1.0 → 0.2)
- Metadata extraction requirements (SQL queries included)
- 8+ relationship detection methods with SQL queries
- Data governance framework mapping
- 10+ case studies and examples

**Use Cases**:
- Understand scoring philosophy
- Review SQL queries for metadata extraction
- Plan governance integration
- Validate against your database schema

**Output**: Decision on confidence thresholds, metadata sources, governance requirements

---

### 2. **LINEAGE_IMPLEMENTATION_GUIDE.md** - Engineering Implementation
**When to Read**: During development, API design, performance tuning  
**Key Sections**:
- Complete project structure
- Core scoring engine (JavaScript/Node.js)
- Metadata extraction layer (multi-database)
- Graph construction & traversal algorithms
- Governance mapping implementation
- Performance optimization patterns

**Use Cases**:
- Integrate scoring into your codebase
- Implement metadata extraction for SQL Server/PostgreSQL/BigQuery
- Build lineage graph engine
- Set up caching and batching

**Output**: Production-ready service implementations, deployable code patterns

---

### 3. **SCORING_CALIBRATION_MATRIX.md** - Validation & Operations
**When to Read**: After implementing, before production, periodic recalibration  
**Key Sections**:
- Complete scoring matrix (19 relationship types)
- Real-world test cases (3 datasets: E-commerce, Healthcare, Finance)
- Threshold calibration methodology
- Validation dataset construction
- Precision-recall analysis
- Common edge cases & solutions
- Production monitoring queries

**Use Cases**:
- Build calibration dataset (1k+ examples)
- Select optimal thresholds for your environment
- Test scoring engine accuracy
- Monitor in production
- Handle edge cases (circular deps, nullable FKs, M2M)

**Output**: Validated confidence thresholds, monitoring dashboards, feedback loops

---

## Quick-Reference: Scoring Tiers

### Confidence Scoring at a Glance

| Tier | Score | Relationship Type | Examples | Action |
|------|-------|-------------------|----------|--------|
| **I** | **1.0** | PK→FK Constraint | Orders.customer_id → Customers.id | Auto-accept |
| **II** | **0.95** | Named FK (Unique Key) | Orders.email → Customers.email (UNIQUE) | Auto-accept |
| **II** | **0.8** | Exact Column Name Match | Both have "customer_id" | High confidence |
| **II** | **0.75** | ETL/SCD/CDC Patterns | stg_customers → dim_customer | High confidence |
| **II** | **0.7** | Semantic Name Match | "CustomerID" ↔ "Cust_ID" | High confidence |
| **III** | **0.6** | Naming Conventions | "Order.customer_id" pattern | Medium confidence |
| **III** | **0.5** | Schema Grouping | Both in "DW" schema; dim_ prefix | Medium confidence |
| **III** | **0.5** | Cardinality Match | Row counts correlate over time | Medium confidence |
| **IV** | **0.25** | Type + Nullability | Both BIGINT, both NOT NULL | Low confidence - REVIEW |
| **IV** | **0.2** | Statistical Correlation | Weak row count relationship | Low confidence - REVIEW |

---

## Confidence Threshold Recommendations by Environment

### Development
```
Threshold: 0.35 (catch all signals for analysis)
Focus: Exploratory; false positives acceptable
Alert: None (analysis only)
```

### Staging
```
Threshold: 0.55 (balance recall/precision)
Focus: Testing; validation against known lineage
Alert: Medium confidence (0.55-0.75) → manual review
```

### Production
```
Threshold: 0.75 (high precision; minimize false positives)
Focus: Trusted lineage visualization, SLA calculations
Compliance contexts: 0.85-0.95 (GDPR/HIPAA)
Alert: High confidence only (0.75+) for SLA escalation
```

### Compliance (GDPR/HIPAA/SOX)
```
Threshold: 0.85-0.95 (definitive + high confidence only)
Focus: Data subject access requests, audit trails, evidence
Exceptions: 0.75 minimum for related tables (with review)
Alert: Always audit trail required
```

---

## Quick Decision Tree: Which Scoring Method to Use?

```
START: Analyzing relationship between Table A → Table B

│
├─ Step 1: Check for FK constraint
│  ├─ YES → Score = 1.0 (DEFINITIVE)
│  └─ NO → Continue to Step 2
│
├─ Step 2: Do column names match exactly?
│  ├─ YES (exact) → Score = 0.8 (HIGH)
│  ├─ YES (semantic) → Score = 0.7 (HIGH)
│  └─ NO → Continue to Step 3
│
├─ Step 3: Check naming convention patterns
│  ├─ Table.column_id → Table.id pattern?  → Score = 0.75
│  ├─ Prefix matching (order→order_items)?  → Score = 0.65
│  └─ NO → Continue to Step 4
│
├─ Step 4: Check ETL/special patterns
│  ├─ Staging table (stg_*)?               → Score = 0.65
│  ├─ History/Audit table?                 → Score = 0.70
│  ├─ SCD Type 2 (dim_*, effective_date+end_date)?  → Score = 0.75
│  ├─ CDC pattern (*_cdc, sys_change_operation)?    → Score = 0.75
│  └─ NO → Continue to Step 5
│
├─ Step 5: Check weak signals
│  ├─ Same schema + both are dim_*?        → Score = 0.50
│  ├─ Row count correlation > 0.85?        → Score = 0.35
│  ├─ Only data type match (INT→INT)?      → Score = 0.20
│  └─ NO → Score = 0.0 (NO RELATIONSHIP)
│
├─ Step 6: Aggregate multiple signals
│  ├─ MAX(all scores) = primary score
│  ├─ Flag if range > 0.5 (conflicting signals)
│  └─ Apply modifiers (nullable, composite, etc.)
│
└─ DECISION: Classify by final score
    ├─ 0.95-1.0  → DEFINITIVE (auto-accept)
    ├─ 0.75-0.95 → HIGH_CONFIDENCE (trusted)
    ├─ 0.55-0.75 → MEDIUM_CONFIDENCE (review recommended)
    ├─ 0.35-0.55 → LOW_CONFIDENCE (manual validation)
    └─ <0.35     → INSUFFICIENT_EVIDENCE (reject)
```

---

## Implementation Roadmap (12 Weeks)

### Phase 1: Foundation (Weeks 1-3)
**Goal**: Extract metadata from all data sources  
**Deliverables**:
- [ ] Metadata extraction scripts (SQL Server, PostgreSQL, BigQuery)
- [ ] Metadata cache layer
- [ ] Integration with existing lineage service

**Documents**: LINEAGE_DETECTION_RESEARCH.md (Metadata Extraction section)  
**Code**: LINEAGE_IMPLEMENTATION_GUIDE.md (Metadata Extraction Layer section)

---

### Phase 2: Scoring Engine (Weeks 4-6)
**Goal**: Implement all confidence scoring methods  
**Deliverables**:
- [ ] FK constraint scorer (1.0)
- [ ] Column name matcher (0.6-0.9)
- [ ] Naming convention patterns (0.6-0.75)
- [ ] ETL pattern detector (0.5-0.75)
- [ ] Cardinality analyzer (0.25-0.5)
- [ ] Score aggregator

**Documents**: LINEAGE_IMPLEMENTATION_GUIDE.md (Core Scoring Engine)  
**Testing**: SCORING_CALIBRATION_MATRIX.md (Real-World Test Cases)

---

### Phase 3: Graph Construction (Weeks 7-8)
**Goal**: Build lineage graph from scored relationships  
**Deliverables**:
- [ ] Graph builder (nodes + weighted edges)
- [ ] BFS/DFS traversal algorithms
- [ ] Cycle detection
- [ ] Impact radius calculation

**Documents**: LINEAGE_IMPLEMENTATION_GUIDE.md (Graph Construction & Traversal)

---

### Phase 4: Calibration & Testing (Weeks 9-10)
**Goal**: Validate scoring accuracy, select thresholds  
**Deliverables**:
- [ ] Build calibration dataset (1,000+ examples)
- [ ] Manual annotation of ground truth
- [ ] Precision-recall analysis
- [ ] Production threshold selection

**Documents**: SCORING_CALIBRATION_MATRIX.md (Validation Methodology)

---

### Phase 5: Governance & APIs (Weeks 11-12)
**Goal**: Integrate governance, expose APIs  
**Deliverables**:
- [ ] Classification/compliance mapping
- [ ] REST API endpoints
- [ ] Frontend visualization
- [ ] Audit logging

**Documents**: LINEAGE_DETECTION_RESEARCH.md (Data Governance Framework)

---

## Common Patterns: Quick Reference

| Pattern | Example | Base Confidence | How to Detect |
|---------|---------|-----------------|--------------|
| **FK Constraint** | `Orders.cust_id FK→ Customers.id` | 1.0 | Check `sys.foreign_keys` |
| **Staging Table** | `stg_customers → dim_customer` | 0.65 | Name starts with `stg_` |
| **History/Archive** | `customers → customers_history` | 0.70 | Name ends with `_history`, `_archive` |
| **SCD Type 2** | `dim_product` with effective_date/end_date | 0.75 | Check for date columns + `is_current` |
| **CDC Pattern** | `orders → orders_cdc` | 0.75 | Name pattern `*_cdc` + `sys_change_operation` column |
| **Self-Join** | `Employee.manager_id → Employee.id` | 1.0 | If FK constraint; 0.85 if semantic |
| **Many-to-Many** | `OrderProduct` (only 2 FKs + ID) | 0.85 | 2+ FK constraints; minimal business columns |
| **Column Name Match** | Both have `customer_id` | 0.80 | Exact string match (case-insensitive) |
| **Semantic Match** | `CustomerID` ↔ `Cust_ID` | 0.70 | Levenshtein distance; known abbreviations |
| **Naming Convention** | `Order.customer_id` pattern | 0.75 | `{prefix}_id → {prefix}.id` pattern |
| **Schema Grouping** | Both in `dw_` schema | 0.50 | Same schema + similar prefixes |
| **Cardinality** | `Orders.rows ≈ OrderItems.rows / 4` | 0.50 | Row count ratios stable over time |

---

## SQL Query Reference: Common Metadata Extractions

### Extract All FK Constraints
```sql
-- SQL Server
SELECT * FROM sys.foreign_keys fk
INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id;

-- PostgreSQL
SELECT * FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY';

-- BigQuery
SELECT * FROM `project.dataset.INFORMATION_SCHEMA.KEY_COLUMN_USAGE`
WHERE constraint_type = 'FOREIGN KEY';
```

### Extract Primary Key Columns
```sql
-- SQL Server
SELECT t.name, c.name, ic.key_ordinal
FROM sys.tables t
INNER JOIN sys.index_columns ic ON t.object_id = ic.object_id
INNER JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
INNER JOIN sys.indexes i ON i.object_id = ic.object_id AND i.index_id = ic.index_id
WHERE i.is_primary_key = 1;
```

### Row Counts & Cardinality
```sql
-- SQL Server
SELECT t.name, p.rows
FROM sys.tables t
INNER JOIN sys.partitions p ON t.object_id = p.object_id
WHERE p.index_id IN (0, 1);

-- PostgreSQL
SELECT tablename, n_live_tup FROM pg_stat_user_tables;

-- BigQuery
SELECT table_name, row_count
FROM `project.dataset.INFORMATION_SCHEMA.TABLES`;
```

### Detect SCD Type 2 Tables
```sql
-- Find dimension tables with temporal markers
SELECT t.name,
       EXISTS (SELECT 1 FROM sys.columns c WHERE object_id = t.object_id 
               AND name LIKE '%effective%date%') AS has_effective_date,
       EXISTS (SELECT 1 FROM sys.columns c WHERE object_id = t.object_id 
               AND name LIKE '%end%date%') AS has_end_date,
       EXISTS (SELECT 1 FROM sys.columns c WHERE object_id = t.object_id 
               AND (name LIKE '%is_current%' OR name LIKE '%current_flag%')) AS has_current_flag
FROM sys.tables t
WHERE t.name LIKE 'dim_%'
AND (
  EXISTS (SELECT 1 FROM sys.columns c WHERE object_id = t.object_id AND name LIKE '%date%')
  OR EXISTS (SELECT 1 FROM sys.columns c WHERE object_id = t.object_id AND name LIKE '%current%')
);
```

---

## Monitoring & Health Checks

### Daily Check: Lineage Quality
```sql
-- Run these queries daily to catch scoring anomalies
SELECT
    COUNT(*) AS total_relationships,
    SUM(CASE WHEN confidence_score >= 0.95 THEN 1 ELSE 0 END) AS definitive_pct,
    SUM(CASE WHEN confidence_score BETWEEN 0.75 AND 0.95 THEN 1 ELSE 0 END) AS high_pct,
    SUM(CASE WHEN confidence_score BETWEEN 0.55 AND 0.75 THEN 1 ELSE 0 END) AS medium_pct,
    SUM(CASE WHEN confidence_score < 0.55 THEN 1 ELSE 0 END) AS low_pct,
    AVG(confidence_score) AS avg_confidence
FROM lineage_relationships
WHERE created_at >= CAST(CURRENT_DATE AS DATETIME);
```

### Weekly Check: Metadata Freshness
```sql
-- Verify metadata extraction is current
SELECT
    database_name,
    MAX(extracted_at) AS last_extraction,
    DATEDIFF(HOUR, MAX(extracted_at), GETDATE()) AS hours_since_extraction
FROM metadata_extraction_log
GROUP BY database_name
HAVING DATEDIFF(HOUR, MAX(extracted_at), GETDATE()) > 25  -- Alert if >1 day old
ORDER BY database_name;
```

### Monthly Check: Calibration Drift
```sql
-- Compare this month's confidence distribution to last month
WITH current_month AS (
  SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY confidence_score) AS median_score
  FROM lineage_relationships
  WHERE created_at >= CURRENT_DATE - INTERVAL 30 DAY
),
previous_month AS (
  SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY confidence_score) AS median_score
  FROM lineage_relationships
  WHERE created_at >= CURRENT_DATE - INTERVAL 60 DAY
  AND created_at < CURRENT_DATE - INTERVAL 30 DAY
)
SELECT
    curr.median_score AS current_median,
    prev.median_score AS previous_median,
    ABS(curr.median_score - prev.median_score) AS drift,
    CASE WHEN ABS(curr.median_score - prev.median_score) > 0.05 THEN 'ALERT: Significant drift'
         ELSE 'OK'
    END AS status
FROM current_month curr, previous_month prev;
```

---

## API Endpoints (Quick Reference)

### Scoring & Analysis
```
POST /api/lineage/score
  Input: {childTable, childColumn, parentTable, parentColumn}
  Output: {confidence_score, methods_detected, recommendation}

GET /api/lineage/{tableId}/upstream?confidence_threshold=0.5&max_depth=5
  Output: Array of upstream dependencies with distances

GET /api/lineage/{tableId}/downstream?confidence_threshold=0.5&max_depth=5
  Output: Array of downstream dependents with distances

GET /api/lineage/{tableId}/impact
  Output: {directImpact, twoHopsImpact, threeOrMoreImpact}
```

### Governance & Compliance
```
GET /api/governance/classifications
  Output: Sensitivity levels, frameworks, access policies

GET /api/governance/lineage/{tableId}/gdpr
  Output: PII lineage, data subject access paths

GET /api/governance/lineage/{tableId}/compliance?framework=HIPAA
  Output: Compliance-filtered lineage
```

### Management
```
GET /api/lineage/statistics
  Output: Graph metrics, confidence distribution, orphan tables

POST /api/lineage/feedback
  Input: {relationshipId, userCorrection, notes}
  Effect: Updates training data for future calibration

GET /api/health
  Output: Metadata freshness, API health, error rates
```

---

## Troubleshooting Guide

### Low Confidence Scores Across Board (<0.5 average)

**Possible Causes**:
1. Naming conventions very different from expected
2. Metadata extraction incomplete
3. Scoring thresholds too conservative

**Solution**:
- Review actual table/column names in your database
- Compare against patterns in LINEAGE_DETECTION_RESEARCH.md
- Adjust abbreviation mappings in columnMatchScorer.js
- Re-run calibration on your dataset

---

### High False Positive Rate (>10% of scores incorrect)

**Possible Causes**:
1. Threshold too low (0.35 catches too many coincidences)
2. Scoring method not calibrated for your data patterns
3. Edge cases not handled

**Solution**:
- Raise threshold to 0.55-0.60 and reduce false positives
- Build larger calibration set; retrain
- Review edge cases in SCORING_CALIBRATION_MATRIX.md (Edge Cases section)

---

### Many Circular Dependencies Detected

**Possible Causes**:
1. Bad data relationships (real issue)
2. Self-referential dimensions (SCD Type 2 with parent)
3. Application-handled bidirectional references

**Solution**:
- Review cycles in graph output
- Check if SCD Type 2 pattern (legitimate)
- Flag application-logic cycles for code review
- If true data issue, escalate to DBA

---

### Scoring Engine Too Slow (>5 sec per 1k relationships)

**Possible Causes**:
1. Metadata queries not cached
2. N+1 queries to database
3. Large string similarity calculations

**Solution**:
- Enable MetadataCache with 1-hour TTL
- Use batch scoring with Worker threads (LINEAGE_IMPLEMENTATION_GUIDE.md)
- Pre-compute semantic similarity matrices
- Monitor with `perf-load-test.js`

---

## Next Steps

1. **Review**: Start with [LINEAGE_DETECTION_RESEARCH.md](LINEAGE_DETECTION_RESEARCH.md) (1-2 hours)
2. **Plan**: Use flowchart above to design your implementation (30 min)
3. **Implement**: Follow [LINEAGE_IMPLEMENTATION_GUIDE.md](LINEAGE_IMPLEMENTATION_GUIDE.md) (2-3 weeks)
4. **Calibrate**: Build validation set using [SCORING_CALIBRATION_MATRIX.md](SCORING_CALIBRATION_MATRIX.md) (1-2 weeks)
5. **Deploy**: Roll out in dev/staging/prod with threshold progression
6. **Monitor**: Use queries above for daily/weekly health checks
7. **Iterate**: Collect user feedback; retrain quarterly

---

## Support & Resources

| Question | Document | Section |
|----------|----------|---------|
| "What confidence score should I use?" | SCORING_CALIBRATION_MATRIX.md | Threshold Calibration Guide |
| "How do I detect ETL patterns?" | LINEAGE_DETECTION_RESEARCH.md | Advanced Lineage Building Methods (Method 2) |
| "Show me SQL queries" | LINEAGE_DETECTION_RESEARCH.md | SQL Detection Queries by Database |
| "How do I implement the scorer?" | LINEAGE_IMPLEMENTATION_GUIDE.md | Core Scoring Engine |
| "How do I validate my implementation?" | SCORING_CALIBRATION_MATRIX.md | Real-World Test Cases |
| "What about compliance/GDPR?" | LINEAGE_DETECTION_RESEARCH.md | Data Governance Framework Integration (section 7) |
| "What's the project structure?" | LINEAGE_IMPLEMENTATION_GUIDE.md | Quick Start (Project Structure) |

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | May 2026 | Initial publication; 3-document framework |
| — | — | (Future updates will be documented here) |

---

**Package Complete**: 3 comprehensive documents covering theory, implementation, and validation.  
**Ready for**: Production deployment with enterprise-grade lineage detection.

