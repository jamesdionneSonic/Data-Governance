# Data Lineage Detection & Relationship Discovery: Advanced Research

**Version**: 1.0  
**Date**: May 2026  
**Scope**: Comprehensive methodology for detecting implicit and explicit data relationships beyond foreign key constraints

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Confidence Scoring Framework](#confidence-scoring-framework)
3. [Metadata Extraction Requirements](#metadata-extraction-requirements)
4. [Advanced Lineage Building Methods](#advanced-lineage-building-methods)
5. [Relationship Type Detection](#relationship-type-detection)
6. [SQL Detection Queries by Database](#sql-detection-queries-by-database)
7. [Data Governance Framework Integration](#data-governance-framework-integration)
8. [Implementation Roadmap](#implementation-roadmap)
9. [Case Studies & Examples](#case-studies--examples)
10. [Calibration & Testing Guidelines](#calibration--testing-guidelines)

---

## Executive Summary

### Problem Statement
Traditional lineage detection relies primarily on Foreign Key (FK) constraints, which capture only 20-30% of actual data dependencies in enterprise systems. The remaining dependencies are implicit, encoded in naming conventions, ETL patterns, data warehouse schemas, and application logic.

### Proposed Solution
A multi-layered confidence scoring system (0.0-1.0) that combines:
- **Definitive relationships** (FK constraints, pk-unique key joins) → 0.95-1.0
- **Strong heuristics** (exact name matching, semantic similarity) → 0.6-0.8
- **Moderate heuristics** (prefix/schema grouping, cardinality patterns) → 0.35-0.5
- **Weak signals** (data type alignment, statistical correlation) → 0.2-0.35

### Expected Outcomes
- **Detection coverage**: 70-85% of actual relationships vs. 20-30% with FK alone
- **False positive rate**: <5% with confidence thresholding (>0.6)
- **Performance**: Sub-second querying for graphs of 10k+ objects

---

## Confidence Scoring Framework

### Tier 1: Definitive Relationships (0.95-1.0)

#### 1.1 Primary Key → Foreign Key (PK→FK) | **Confidence: 1.0**

**Definition**: Explicit Foreign Key constraint linking PK or Unique key of parent to non-unique column in child.

**Scoring Logic**:
```
Score = 1.0 (definitive by SQL standard)
```

**Detection Query (SQL Server)**:
```sql
SELECT 
    OBJECT_NAME(fk.parent_object_id) AS child_table,
    COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS child_column,
    OBJECT_NAME(fk.referenced_object_id) AS parent_table,
    COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS parent_column,
    1.0 AS confidence_score,
    'PK-FK Constraint' AS relationship_type,
    fk.name AS constraint_name
FROM 
    sys.foreign_keys fk
    INNER JOIN sys.foreign_key_columns fkc
        ON fk.object_id = fkc.constraint_object_id
WHERE 
    OBJECT_NAME(fk.parent_object_id) NOT LIKE 'tmp%'
    AND OBJECT_NAME(fk.referenced_object_id) NOT LIKE 'tmp%'
ORDER BY 
    child_table, parent_table;
```

**Detection Query (PostgreSQL)**:
```sql
SELECT 
    tc.table_name AS child_table,
    kcu.column_name AS child_column,
    ccu.table_name AS parent_table,
    ccu.column_name AS parent_column,
    1.0 AS confidence_score,
    'PK-FK Constraint' AS relationship_type,
    tc.constraint_name
FROM 
    information_schema.table_constraints tc
    INNER JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
    INNER JOIN information_schema.constraint_column_usage ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
WHERE 
    tc.constraint_type = 'FOREIGN KEY'
ORDER BY 
    child_table, parent_table;
```

**Detection Query (BigQuery)**:
```sql
-- BigQuery doesn't enforce FK constraints, but metadata is stored in schema
SELECT 
    table_name,
    column_name,
    field_description
FROM 
    `project.dataset.INFORMATION_SCHEMA.COLUMNS`
WHERE 
    field_description LIKE '%Foreign Key%'
    OR field_description LIKE '%FK:%'
ORDER BY 
    table_name;
```

---

#### 1.2 Named FK Constraint (Non-PK Parent) | **Confidence: 0.95**

**Definition**: Foreign Key constraint where parent column is a UNIQUE key but not the PK. Slightly lower confidence as UNIQUE keys *could* allow NULLs (though rarely used in real FKs).

**Scoring Logic**:
```
Base Score = 1.0
IF parent_column_is_nullable = TRUE THEN Score *= 0.95
ELSE Score = 0.95 (slightly less definitive than PK-FK)
```

**Detection Query (SQL Server)**:
```sql
SELECT 
    OBJECT_NAME(fk.parent_object_id) AS child_table,
    COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS child_column,
    OBJECT_NAME(fk.referenced_object_id) AS parent_table,
    COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS parent_column,
    0.95 AS confidence_score,
    'Named FK Constraint' AS relationship_type,
    fk.name AS constraint_name,
    -- Check if parent column is nullable
    CAST(c.is_nullable AS INT) AS parent_is_nullable
FROM 
    sys.foreign_keys fk
    INNER JOIN sys.foreign_key_columns fkc
        ON fk.object_id = fkc.constraint_object_id
    INNER JOIN sys.columns c
        ON c.object_id = fk.referenced_object_id
        AND c.column_id = fkc.referenced_column_id
    INNER JOIN sys.key_constraints uk
        ON uk.parent_object_id = fk.referenced_object_id
        AND uk.type = 'UQ'
WHERE 
    OBJECT_NAME(fk.parent_object_id) NOT LIKE 'tmp%'
ORDER BY 
    child_table;
```

---

### Tier 2: Strong Heuristics (0.6-0.8)

#### 2.1 Exact Column Name Match | **Confidence: 0.8**

**Definition**: Child table has a column with exact name match to parent table's PK, but no FK constraint exists (e.g., both tables have `customer_id`).

**Scoring Adjustments**:
```
Base = 0.8
IF column_data_type_matches = TRUE: THEN +0.0 (already factored)
IF column_is_nullable = TRUE: THEN -0.05 → 0.75
IF parent_is_PK = TRUE: THEN +0.10 → 0.90
IF child_has_many_id_columns = TRUE (>5): THEN -0.10 → 0.70
```

**Detection Query (SQL Server)**:
```sql
SELECT 
    pk_table,
    pk_col,
    fk_table,
    fk_col,
    0.8 AS base_confidence_score,
    CASE 
        WHEN pk_col_type = fk_col_type THEN 1
        WHEN (pk_col_type IN ('bigint', 'int') AND fk_col_type IN ('bigint', 'int')) THEN 1
        ELSE 0 
    END AS type_match,
    CASE WHEN fk_col_is_nullable = 1 THEN 0.75 ELSE 0.8 END AS adjusted_confidence
FROM (
    SELECT DISTINCT
        pk_t.name AS pk_table,
        pk_c.name AS pk_col,
        fk_t.name AS fk_table,
        fk_c.name AS fk_col,
        TYPE_NAME(pk_c.user_type_id) AS pk_col_type,
        TYPE_NAME(fk_c.user_type_id) AS fk_col_type,
        pk_c.is_identity AS pk_is_identity,
        fk_c.is_nullable AS fk_col_is_nullable
    FROM 
        sys.tables pk_t
        INNER JOIN sys.columns pk_c ON pk_t.object_id = pk_c.object_id
        INNER JOIN sys.index_columns ic ON pk_c.object_id = ic.object_id 
            AND pk_c.column_id = ic.column_id
        INNER JOIN sys.indexes i ON ic.object_id = i.object_id 
            AND ic.index_id = i.index_id
        CROSS JOIN sys.tables fk_t
        INNER JOIN sys.columns fk_c ON fk_t.object_id = fk_c.object_id
    WHERE 
        i.is_primary_key = 1
        AND pk_c.name = fk_c.name
        AND pk_t.object_id != fk_t.object_id
        AND NOT EXISTS (
            SELECT 1 FROM sys.foreign_keys fk
            WHERE fk.parent_object_id = fk_t.object_id
            AND fk.referenced_object_id = pk_t.object_id
        )
        AND pk_t.name NOT LIKE 'tmp%'
        AND fk_t.name NOT LIKE 'tmp%'
) AS matches
ORDER BY 
    pk_table, fk_table;
```

**Detection Query (PostgreSQL)**:
```sql
SELECT 
    t1.table_name AS pk_table,
    t1.column_name AS pk_col,
    t2.table_name AS fk_table,
    t2.column_name AS fk_col,
    0.8 AS base_confidence_score,
    t1.udt_name AS pk_col_type,
    t2.udt_name AS fk_col_type,
    CASE WHEN t2.is_nullable = 'NO' THEN 0.8 ELSE 0.75 END AS adjusted_confidence
FROM 
    (SELECT table_name, column_name, ordinal_position, udt_name, is_nullable
     FROM information_schema.columns 
     WHERE column_name IN (
         SELECT a.column_name 
         FROM information_schema.table_constraints t 
         INNER JOIN information_schema.key_column_usage a 
             ON t.constraint_name = a.constraint_name
         WHERE t.constraint_type = 'PRIMARY KEY'
     )) t1
    CROSS JOIN (SELECT DISTINCT table_name, column_name, udt_name, is_nullable
                FROM information_schema.columns) t2
WHERE 
    t1.column_name = t2.column_name
    AND t1.table_name != t2.table_name
    AND NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints tc
        INNER JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND kcu.table_name = t2.table_name
        AND kcu.column_name = t2.column_name
    )
ORDER BY 
    pk_table, fk_table;
```

---

#### 2.2 Semantic Column Name Match | **Confidence: 0.7**

**Definition**: Column names match semantically but with different casing/abbreviations:
- `CustomerID` ↔ `Cust_ID`
- `employee_number` ↔ `emp_no`
- `order_id` ↔ `ord_pk`

**Scoring Logic**:
```
Base = 0.7
Semantic_Distance = LevenshteinDistance(col1, col2) / max(len(col1), len(col2))
IF semantic_distance < 0.3 AND data_types_match: Score = 0.7
IF semantic_distance < 0.2 AND data_types_match: Score = 0.75
IF is_known_abbreviation_pair: Score += 0.05 → max 0.75
```

**Detection Query (SQL Server using Levenshtein)**:
```sql
-- Requires CLR or external function; approximate with string matching
SELECT 
    pk_t.name AS pk_table,
    pk_c.name AS pk_col,
    fk_t.name AS fk_table,
    fk_c.name AS fk_col,
    CAST(
        ROUND(
            1.0 - (CAST(
                ABS(LEN(pk_c.name) - LEN(fk_c.name)) +
                (LEN(pk_c.name) - LEN(pk_c.name) - LEN(fk_c.name))
            AS FLOAT) / CAST(GREATEST(LEN(pk_c.name), LEN(fk_c.name)) AS FLOAT)),
            2
        )
    , FLOAT) AS semantic_similarity,
    CASE 
        WHEN CAST(
            ROUND(
                1.0 - (CAST(
                    ABS(LEN(pk_c.name) - LEN(fk_c.name))
                AS FLOAT) / CAST(GREATEST(LEN(pk_c.name), LEN(fk_c.name)) AS FLOAT)),
                2
            )
        , FLOAT) > 0.7 THEN 0.7
        WHEN CAST(
            ROUND(
                1.0 - (CAST(
                    ABS(LEN(pk_c.name) - LEN(fk_c.name))
                AS FLOAT) / CAST(GREATEST(LEN(pk_c.name), LEN(fk_c.name)) AS FLOAT)),
                2
            )
        , FLOAT) > 0.8 THEN 0.75
        ELSE 0.5
    END AS confidence_score
FROM 
    sys.tables pk_t
    INNER JOIN sys.columns pk_c ON pk_t.object_id = pk_c.object_id
    INNER JOIN sys.index_columns ic ON pk_c.object_id = ic.object_id
    CROSS JOIN sys.tables fk_t
    INNER JOIN sys.columns fk_c ON fk_t.object_id = fk_c.object_id
WHERE 
    pk_t.object_id != fk_t.object_id
    AND UPPER(pk_c.name) LIKE '%ID%'
    AND UPPER(fk_c.name) LIKE '%ID%'
    AND pk_c.name != fk_c.name
    AND NOT EXISTS (
        SELECT 1 FROM sys.foreign_keys fk
        WHERE fk.parent_object_id = fk_t.object_id
        AND fk.referenced_object_id = pk_t.object_id
    )
    AND TYPE_NAME(pk_c.user_type_id) = TYPE_NAME(fk_c.user_type_id)
ORDER BY 
    semantic_similarity DESC;
```

---

#### 2.3 Naming Convention Pattern Matching | **Confidence: 0.6-0.75**

**Definition**: Column names follow predictable patterns:
- `Order.customer_id` ↔ `Customer.id` (remove `*_` prefix)
- `OrderItem.order_id` ↔ `Order.id` (transformation: `ItemOrder_ID` → `Order.ID`)
- `Order.CustomerNumber` ↔ `Customer.CustNumber` (known abbreviations)

**Common Patterns**:

| Pattern | Examples | Score |
|---------|----------|-------|
| `{prefix}_id` → `id` | `customer_id` → `id` | 0.75 |
| `{prefix}_id` → `{prefix}_pk` | `customer_id` → `customer_pk` | 0.7 |
| `{prefix}_number` → `{prefix}_no` | `employee_number` → `emp_no` | 0.7 |
| `{prefix}_code` → `code` | `product_code` → `code` | 0.6 |
| `{prefixAbbr}_id` → `{prefix}_id` | `cust_id` → `customer_id` | 0.6 |

**Detection Query Pattern Framework**:
```sql
-- Generic pattern matching for multiple databases
-- Customize CASE statements per database/stack

SELECT 
    parent_table,
    parent_column,
    child_table,
    child_column,
    CASE 
        WHEN parent_column = 'id' AND child_column LIKE parent_table_abbr + '_id'
            THEN 0.75
        WHEN child_column LIKE parent_table_abbr + '_pk' AND parent_column = 'id'
            THEN 0.70
        WHEN child_column LIKE parent_table_abbr + '_code'
            THEN 0.60
        WHEN is_known_abbreviation AND type_match
            THEN 0.65
        ELSE 0.55
    END AS confidence_score,
    'Naming Convention Match' AS relationship_type
FROM (
    SELECT 
        pt.name AS parent_table,
        LEFT(pt.name, 4) AS parent_table_abbr,
        pc.name AS parent_column,
        ft.name AS child_table,
        fc.name AS child_column,
        CASE WHEN TYPE_NAME(pc.user_type_id) = TYPE_NAME(fc.user_type_id) THEN 1 ELSE 0 END AS type_match,
        -- Known abbreviation mapping
        CASE 
            WHEN LEFT(pt.name, 4) = 'Cust' AND LEFT(fc.name, 4) = 'cust' THEN 1
            WHEN LEFT(pt.name, 4) = 'Prod' AND LEFT(fc.name, 4) = 'prod' THEN 1
            WHEN LEFT(pt.name, 4) = 'Empl' AND LEFT(fc.name, 3) = 'emp' THEN 1
            ELSE 0
        END AS is_known_abbreviation
    FROM 
        sys.tables pt
        INNER JOIN sys.columns pc ON pt.object_id = pc.object_id
        CROSS JOIN sys.tables ft
        INNER JOIN sys.columns fc ON ft.object_id = fc.object_id
    WHERE 
        pt.object_id != ft.object_id
        AND NOT EXISTS (
            SELECT 1 FROM sys.foreign_keys fk
            WHERE fk.parent_object_id = ft.object_id
            AND fk.referenced_object_id = pt.object_id
        )
) patterns
WHERE 
    parent_column IN ('id', 'pk', 'primary_key')
    AND (
        child_column LIKE parent_table_abbr + '_%'
        OR is_known_abbreviation = 1
    );
```

---

### Tier 3: Moderate Heuristics (0.35-0.5)

#### 3.1 Schema/Prefix Grouping | **Confidence: 0.4-0.5**

**Definition**: Tables in same schema or with common prefix indicate conceptual relationship (data warehouse dimension/fact patterns).

**Scoring Logic**:
```
Base = 0.4
IF schema_matches AND both_are_dimensions: Score = 0.5
IF schema_matches AND one_is_fact: Score = 0.45
IF prefix_matches (e.g., both 'dim_', 'fact_'): Score = 0.42
```

**Detection Query (SQL Server)**:
```sql
SELECT 
    s1.name AS schema1,
    t1.name AS table1,
    s2.name AS schema2,
    t2.name AS table2,
    CASE 
        WHEN s1.schema_id = s2.schema_id 
            AND t1.name LIKE 'dim_%' AND t2.name LIKE 'dim_%'
            THEN 0.5
        WHEN s1.schema_id = s2.schema_id 
            AND (t1.name LIKE 'fact_%' OR t2.name LIKE 'fact_%')
            THEN 0.45
        WHEN s1.schema_id = s2.schema_id
            THEN 0.4
        ELSE 0.2
    END AS confidence_score,
    'Schema/Prefix Grouping' AS relationship_type,
    (SELECT COUNT(*) FROM sys.columns WHERE object_id = t1.object_id) AS t1_column_count,
    (SELECT COUNT(*) FROM sys.columns WHERE object_id = t2.object_id) AS t2_column_count
FROM 
    sys.schemas s1
    INNER JOIN sys.tables t1 ON s1.schema_id = t1.schema_id
    CROSS JOIN sys.schemas s2
    INNER JOIN sys.tables t2 ON s2.schema_id = t2.schema_id
WHERE 
    t1.object_id < t2.object_id
    AND (s1.schema_id = s2.schema_id 
         OR (t1.name LIKE LEFT(t2.name, 4) + '%' OR t2.name LIKE LEFT(t1.name, 4) + '%'))
ORDER BY 
    confidence_score DESC;
```

---

#### 3.2 Cardinality Pattern Matching | **Confidence: 0.35-0.5**

**Definition**: Row count relationships indicate lineage. If `Orders.row_count ≈ OrderItems.row_count / N` or `Customers.row_count * 100 ≈ Orders.row_count`, strong lineage signal.

**Scoring Logic**:
```
ratio = table2_rows / table1_rows
IF ratio is stable (deviation < 5% over time): Score += 0.1
IF ratio is 1:1: Score = 0.4
IF ratio is 1:N where N > 10: Score = 0.35
IF ratio is close to known ETL ratio (e.g., 1:30): Score = 0.45
```

**Detection Query (SQL Server)**:
```sql
SELECT 
    t1.name AS parent_table,
    p1.rows AS parent_row_count,
    t2.name AS child_table,
    p2.rows AS child_row_count,
    CAST(CAST(p2.rows AS FLOAT) / CAST(NULLIF(p1.rows, 0) AS FLOAT) AS DECIMAL(10,2)) AS cardinality_ratio,
    CASE 
        WHEN ABS(CAST(p2.rows AS FLOAT) / CAST(NULLIF(p1.rows, 0) AS FLOAT) - 1.0) < 0.05 THEN 0.40
        WHEN CAST(p2.rows AS FLOAT) / CAST(NULLIF(p1.rows, 0) AS FLOAT) BETWEEN 10 AND 50 THEN 0.35
        WHEN CAST(p2.rows AS FLOAT) / CAST(NULLIF(p1.rows, 0) AS FLOAT) > 50 THEN 0.30
        ELSE 0.25
    END AS confidence_score,
    'Cardinality Pattern' AS relationship_type
FROM 
    sys.tables t1
    INNER JOIN sys.partitions p1 ON t1.object_id = p1.object_id AND p1.index_id IN (0, 1)
    CROSS JOIN sys.tables t2
    INNER JOIN sys.partitions p2 ON t2.object_id = p2.object_id AND p2.index_id IN (0, 1)
WHERE 
    t1.object_id < t2.object_id
    AND p1.rows > 10
    AND p2.rows > 10
    AND NOT EXISTS (
        SELECT 1 FROM sys.foreign_keys fk
        WHERE (fk.parent_object_id = t1.object_id AND fk.referenced_object_id = t2.object_id)
           OR (fk.parent_object_id = t2.object_id AND fk.referenced_object_id = t1.object_id)
    )
ORDER BY 
    cardinality_ratio DESC;
```

---

#### 3.3 ETL/Staging Table Pattern Recognition | **Confidence: 0.5-0.7**

**Definition**: Identify source→staging→target pipelines. Staging tables have predictable patterns.

**ETL Patterns**:

| Name | Pattern | Confidence | Justification |
|------|---------|-----------|---|
| Staging→Table (truncate-load) | `stg_` prefix + same columns | 0.65 | Strong naming convention |
| History/Audit table | `{table}_history`, `{table}_audit`, `{table}_archive` | 0.7 | Standard practice |
| Change Data Capture (CDC) | `{table}_cdc`, has `sys_change_id`, `sys_change_operation` | 0.75 | SQL CDC or Kafka pattern |
| Incremental load marker | `{table}_incremental`, has `load_date`, `batch_id` | 0.6 | Common ETL pattern |
| Type-2 SCD (Slowly Changing Dimension) | `{table}_scd2`, has `effective_date`, `end_date`, `is_current` | 0.75 | DW standard |

**Detection Query (SQL Server)**:
```sql
SELECT 
    OBJECT_NAME(t1.object_id) AS source_table,
    OBJECT_NAME(t2.object_id) AS target_table,
    CASE 
        WHEN OBJECT_NAME(t2.object_id) LIKE 'stg_%' 
            AND (SELECT COUNT(*) FROM sys.columns WHERE object_id = t2.object_id)
                >= (SELECT COUNT(*) FROM sys.columns WHERE object_id = t1.object_id) * 0.8
            THEN 0.65
        WHEN OBJECT_NAME(t2.object_id) LIKE '%_history'
            THEN 0.70
        WHEN OBJECT_NAME(t2.object_id) LIKE '%_audit'
            AND EXISTS (SELECT 1 FROM sys.columns WHERE object_id = t2.object_id AND name IN ('audit_date', 'audit_user'))
            THEN 0.70
        WHEN OBJECT_NAME(t2.object_id) LIKE '%_cdc'
            AND EXISTS (SELECT 1 FROM sys.columns WHERE object_id = t2.object_id AND name = 'sys_change_operation')
            THEN 0.75
        WHEN EXISTS (SELECT 1 FROM sys.columns c WHERE c.object_id = t2.object_id 
                 AND c.name IN ('effective_date', 'end_date', 'is_current'))
            THEN 0.75
        ELSE 0.35
    END AS confidence_score,
    CASE 
        WHEN OBJECT_NAME(t2.object_id) LIKE 'stg_%' THEN 'Staging'
        WHEN OBJECT_NAME(t2.object_id) LIKE '%_history' THEN 'History'
        WHEN OBJECT_NAME(t2.object_id) LIKE '%_audit' THEN 'Audit'
        WHEN OBJECT_NAME(t2.object_id) LIKE '%_cdc' THEN 'CDC'
        WHEN EXISTS (SELECT 1 FROM sys.columns c WHERE c.object_id = t2.object_id 
                   AND c.name IN ('effective_date', 'end_date')) THEN 'SCD-2'
        ELSE 'Unknown ETL Pattern'
    END AS etl_pattern_type,
    (SELECT COUNT(*) FROM sys.columns WHERE object_id = t1.object_id) AS source_columns,
    (SELECT COUNT(*) FROM sys.columns WHERE object_id = t2.object_id) AS target_columns
FROM 
    sys.tables t1
    CROSS JOIN sys.tables t2
WHERE 
    t1.object_id != t2.object_id
    AND (
        OBJECT_NAME(t2.object_id) LIKE 'stg_' + SUBSTRING(OBJECT_NAME(t1.object_id), 1, 10) + '%'
        OR OBJECT_NAME(t2.object_id) LIKE OBJECT_NAME(t1.object_id) + '%history'
        OR OBJECT_NAME(t2.object_id) LIKE OBJECT_NAME(t1.object_id) + '%audit'
        OR OBJECT_NAME(t2.object_id) LIKE OBJECT_NAME(t1.object_id) + '%cdc'
        OR OBJECT_NAME(t2.object_id) LIKE OBJECT_NAME(t1.object_id) + '%scd2'
    )
    AND NOT EXISTS (
        SELECT 1 FROM sys.foreign_keys fk
        WHERE fk.parent_object_id = t2.object_id
        AND fk.referenced_object_id = t1.object_id
    )
ORDER BY 
    confidence_score DESC;
```

---

### Tier 4: Weak Signals (0.2-0.35)

#### 4.1 Data Type + Nullability Alignment | **Confidence: 0.25-0.35**

**Definition**: Column pairs with matching data types and similar nullability patterns (highly susceptible to false positives).

**Scoring Logic**:
```
IF type_matches AND nullability_matches: Score = 0.30
IF type_matches AND one_is_nullable: Score = 0.25
IF type_matches AND both_nullable: Score = 0.20
```

**Use Cases**: Emergency detection when no other signals present; requires human verification.

**Detection Query (SQL Server)**:
```sql
SELECT 
    pt.name AS parent_table,
    pc.name AS parent_column,
    TYPE_NAME(pc.user_type_id) AS parent_type,
    ft.name AS child_table,
    fc.name AS child_column,
    TYPE_NAME(fc.user_type_id) AS child_type,
    CASE 
        WHEN pc.is_nullable = fc.is_nullable THEN 0.30
        WHEN (pc.is_nullable = 0 AND fc.is_nullable = 1) THEN 0.25
        WHEN (pc.is_nullable = 1 AND fc.is_nullable = 1) THEN 0.20
        ELSE 0.15
    END AS confidence_score,
    'Type & Nullability Match' AS relationship_type
FROM 
    sys.tables pt
    INNER JOIN sys.columns pc ON pt.object_id = pc.object_id
    CROSS JOIN sys.tables ft
    INNER JOIN sys.columns fc ON ft.object_id = fc.object_id
WHERE 
    pt.object_id != ft.object_id
    AND TYPE_NAME(pc.user_type_id) = TYPE_NAME(fc.user_type_id)
    AND TYPE_NAME(pc.user_type_id) IN ('int', 'bigint', 'uniqueidentifier')
    AND NOT EXISTS (
        SELECT 1 FROM sys.foreign_keys fk
        WHERE fk.parent_object_id = ft.object_id
        AND fk.referenced_object_id = pt.object_id
    )
    AND NOT EXISTS (
        SELECT 1 FROM sys.foreign_keys fk
        WHERE fk.parent_object_id = pt.object_id
        AND fk.referenced_object_id = ft.object_id
    )
ORDER BY 
    confidence_score DESC;
```

---

#### 4.2 Statistical Correlation | **Confidence: 0.2-0.35**

**Definition**: Row count progression alignment; timestamp correlation (created_date in T1 before modified_date in T2).

**Scoring Logic**:
```
row_correlation = correlation(T1_rows_over_time, T2_rows_over_time)
IF row_correlation > 0.9: Score = 0.35
IF row_correlation > 0.7: Score = 0.30
IF row_correlation > 0.5: Score = 0.25
IF row_correlation > 0.3: Score = 0.20
ELSE: Score = 0.10
```

---

## Metadata Extraction Requirements

### Essential Metadata Catalog

#### Table-Level Metadata

| Metadata | SQL Server Query | PostgreSQL Query | BigQuery Query | Priority |
|----------|-----------------|------------------|-----------------|----------|
| **Table Name** | `OBJECT_NAME(object_id)` | `table_name` (information_schema) | `table_name` (INFORMATION_SCHEMA) | CRITICAL |
| **Row Count** | `sys.partitions` | `SELECT n_live_tup FROM pg_stat_user_tables` | `size_bytes / avg_row_size` | CRITICAL |
| **Column Count** | `sys.columns` count | `information_schema.columns` count | `INFORMATION_SCHEMA.COLUMNS` count | HIGH |
| **Primary Key Columns** | `sys.key_constraints, sys.index_columns` | `information_schema.table_constraints` (PRIMARY KEY) | `INFORMATION_SCHEMA.KEY_COLUMN_USAGE` | CRITICAL |
| **Unique Keys** | `sys.key_constraints` (type='UQ') | `information_schema.table_constraints` (UNIQUE) | `INFORMATION_SCHEMA.KEY_COLUMN_USAGE` | CRITICAL |
| **Creation Date** | `sys.objects.create_date` | `pg_stat_user_tables.schemaname` (inferred) | `creation_time` (stored procedure) | MEDIUM |
| **Last Modified** | `sys.objects.modify_date` | `pg_stat_user_tables.last_vacuum` | `TIMESTAMP_MILLIS(last_modified_time)` | MEDIUM |
| **Storage Size** | `sys.allocation_units.total_pages` | `pg_total_relation_size()` | `size_bytes` | LOW |
| **Schema** | `sys.schemas.name` | `table_schema` (information_schema) | `table_schema` (INFORMATION_SCHEMA) | HIGH |
| **Object Type** | `sys.objects.type` | `table_type` (information_schema) | `table_type` (INFORMATION_SCHEMA) | HIGH |

#### Column-Level Metadata

| Metadata | SQL Server Query | PostgreSQL Query | BigQuery Query | Priority |
|----------|-----------------|------------------|-----------------|----------|
| **Column Name** | `sys.columns.name` | `column_name` (information_schema) | `column_name` (INFORMATION_SCHEMA) | CRITICAL |
| **Data Type** | `TYPE_NAME(user_type_id)` | `data_type, udt_name` | `data_type` | CRITICAL |
| **Nullability** | `sys.columns.is_nullable` | `is_nullable` (information_schema) | `is_nullable` (INFORMATION_SCHEMA) | CRITICAL |
| **Max Length** | `sys.columns.max_length` | `character_maximum_length` | `field_mode` | MEDIUM |
| **Numeric Precision** | `sys.columns.precision, scale` | `numeric_precision, numeric_scale` | `precision, scale` | MEDIUM |
| **Is Identity/Autoincrement** | `sys.columns.is_identity` | `is_identity` (pg_attribute) | `auto_increment` (field_options) | HIGH |
| **Default Value** | `sys.default_constraints` | `column_default` (information_schema) | `default_value_expression` | MEDIUM |
| **Is Computed** | `sys.computed_columns.definition` | `pg_attribute.attgenerated` | `generation_expression` (INFORMATION_SCHEMA) | LOW |
| **Comment/Description** | `sys.extended_properties` | `pg_description` | `description` (INFORMATION_SCHEMA.COLUMNS) | MEDIUM |
| **Collation** | `sys.columns.collation_name` | `collcollate` (pg_collation) | `collation_name` | LOW |

#### Constraint-Level Metadata

| Constraint Type | SQL Server Query | PostgreSQL Query | BigQuery Query | Priority |
|-----------------|-----------------|------------------|-----------------|----------|
| **Foreign Keys** | `sys.foreign_keys, sys.foreign_key_columns` | `information_schema.table_constraints` (FK) | Foreign keys not enforced; metadata in schema | CRITICAL |
| **Check Constraints** | `sys.check_constraints` | `information_schema.table_constraints` (CHECK) | `NO` | MEDIUM |
| **Unique Constraints** | `sys.key_constraints` (UQ) | `information_schema.table_constraints` (UNIQUE) | `INFORMATION_SCHEMA.KEY_COLUMN_USAGE` | HIGH |
| **Indexes** | `sys.indexes, sys.index_columns` | `pg_indexes` | `INFORMATION_SCHEMA.STATISTICS` | MEDIUM |
| **Triggers** | `sys.triggers` | `information_schema.triggers` | `NO` | LOW |

### Extraction SQL Scripts

#### Comprehensive Metadata Dump (SQL Server)

```sql
-- Execute as: EXEC sp_CatalogMetadataExtract NULL, 0.95
CREATE PROCEDURE sp_CatalogMetadataExtract
    @DatabaseName NVARCHAR(MAX) = NULL,
    @ConfidenceThreshold FLOAT = 0.5
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @SQL NVARCHAR(MAX);
    
    -- Build dynamic SQL if specific database requested
    IF @DatabaseName IS NOT NULL
        SET @SQL = 'USE ' + QUOTENAME(@DatabaseName);
    
    -- Extract all metadata into staging tables
    SELECT 
        'TABLES' AS metadata_category,
        s.name AS schema_name,
        t.name AS table_name,
        (SELECT COUNT(*) FROM sys.columns WHERE object_id = t.object_id) AS column_count,
        p.rows AS row_count,
        t.create_date,
        t.modify_date,
        ps.name AS primary_schema,
        (SELECT COUNT(DISTINCT ic.index_id) FROM sys.index_columns ic 
         WHERE ic.object_id = t.object_id AND ic.index_id > 0) AS index_count
    INTO #TableMetadata
    FROM 
        sys.tables t
        INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
        LEFT JOIN sys.partitions p ON t.object_id = p.object_id AND p.index_id IN (0,1)
        LEFT JOIN sys.stats ps ON t.object_id = ps.object_id
    WHERE 
        s.name NOT IN ('sys', 'INFORMATION_SCHEMA')
    GROUP BY 
        s.name, t.name, t.object_id, t.create_date, t.modify_date, ps.name;

    -- Extract columns
    SELECT DISTINCT
        s.name AS schema_name,
        t.name AS table_name,
        c.name AS column_name,
        TYPE_NAME(c.user_type_id) AS data_type,
        c.max_length,
        c.precision,
        c.scale,
        c.is_nullable,
        c.is_identity,
        c.collation_name
    INTO #ColumnMetadata
    FROM 
        sys.columns c
        INNER JOIN sys.tables t ON c.object_id = t.object_id
        INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
    WHERE 
        s.name NOT IN ('sys', 'INFORMATION_SCHEMA');

    -- Extract primary keys
    SELECT DISTINCT
        s.name AS schema_name,
        t.name AS table_name,
        c.name AS column_name,
        ik.key_ordinal
    INTO #PrimaryKeys
    FROM 
        sys.key_constraints kc
        INNER JOIN sys.index_columns ik ON kc.unique_index_id = ik.index_id
        INNER JOIN sys.columns c ON ik.object_id = c.object_id AND ik.column_id = c.column_id
        INNER JOIN sys.tables t ON kc.parent_object_id = t.object_id
        INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
    WHERE 
        kc.type = 'PK'
        AND s.name NOT IN ('sys', 'INFORMATION_SCHEMA');

    -- Extract foreign keys
    SELECT DISTINCT
        s_child.name AS child_schema,
        t_child.name AS child_table,
        c_child.name AS child_column,
        s_parent.name AS parent_schema,
        t_parent.name AS parent_table,
        c_parent.name AS parent_column,
        fk.name AS constraint_name,
        fkc.constraint_column_id
    INTO #ForeignKeys
    FROM 
        sys.foreign_keys fk
        INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
        INNER JOIN sys.columns c_child ON fkc.parent_object_id = c_child.object_id 
            AND fkc.parent_column_id = c_child.column_id
        INNER JOIN sys.columns c_parent ON fkc.referenced_object_id = c_parent.object_id 
            AND fkc.referenced_column_id = c_parent.column_id
        INNER JOIN sys.tables t_child ON fk.parent_object_id = t_child.object_id
        INNER JOIN sys.tables t_parent ON fk.referenced_object_id = t_parent.object_id
        INNER JOIN sys.schemas s_child ON t_child.schema_id = s_child.schema_id
        INNER JOIN sys.schemas s_parent ON t_parent.schema_id = s_parent.schema_id
    WHERE 
        s_child.name NOT IN ('sys', 'INFORMATION_SCHEMA');

    -- Extract indexes
    SELECT DISTINCT
        s.name AS schema_name,
        t.name AS table_name,
        i.name AS index_name,
        c.name AS column_name,
        i.is_unique,
        i.is_primary_key,
        ic.is_descending_key,
        ic.key_ordinal
    INTO #Indexes
    FROM 
        sys.indexes i
        INNER JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
        INNER JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
        INNER JOIN sys.tables t ON i.object_id = t.object_id
        INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
    WHERE 
        s.name NOT IN ('sys', 'INFORMATION_SCHEMA')
        AND ic.index_column_id > 0;

    -- Return aggregated results
    SELECT 
        'Table' AS object_type,
        tm.schema_name,
        tm.table_name,
        tm.column_count,
        tm.row_count,
        tm.index_count,
        tm.create_date,
        tm.modify_date,
        (SELECT STRING_AGG(column_name, ', ') FROM #PrimaryKeys 
         WHERE schema_name = tm.schema_name AND table_name = tm.table_name) AS primary_key_columns,
        (SELECT COUNT(*) FROM #ForeignKeys 
         WHERE child_schema = tm.schema_name AND child_table = tm.table_name) AS fk_count
    FROM 
        #TableMetadata tm
    UNION ALL
    SELECT 
        'Column' AS object_type,
        schema_name,
        table_name + '.' + column_name,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    FROM 
        #ColumnMetadata;

    -- Cleanup
    DROP TABLE #TableMetadata;
    DROP TABLE #ColumnMetadata;
    DROP TABLE #PrimaryKeys;
    DROP TABLE #ForeignKeys;
    DROP TABLE #Indexes;
END;
```

#### PostgreSQL Metadata Extraction

```sql
-- CTE-based comprehensive metadata extraction
WITH table_stats AS (
    SELECT 
        schemaname,
        tablename,
        n_live_tup::BIGINT AS row_count,
        pg_total_relation_size(schemaname||'.'||tablename)::BIGINT AS size_bytes
    FROM 
        pg_stat_user_tables
),
primary_keys AS (
    SELECT 
        t.table_schema,
        t.table_name,
        STRING_AGG(a.attname, ', ' ORDER BY a.attnum) AS pk_columns,
        COUNT(*) AS pk_column_count
    FROM 
        pg_class c
        INNER JOIN pg_index i ON i.indrelid = c.oid AND i.indisprimary
        INNER JOIN pg_attribute a ON a.attrelid = c.oid AND a.attnum = ANY(i.indkey)
        INNER JOIN information_schema.tables t ON t.table_name = c.relname
    WHERE 
        c.relkind = 'r'
    GROUP BY 
        t.table_schema, t.table_name
),
column_details AS (
    SELECT 
        table_schema,
        table_name,
        column_name,
        data_type,
        is_nullable,
        column_default,
        ordinal_position
    FROM 
        information_schema.columns
    WHERE 
        table_schema NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
)
SELECT 
    'Table' AS object_type,
    ts.schemaname AS schema_name,
    ts.tablename AS table_name,
    (SELECT COUNT(*) FROM column_details cd WHERE cd.table_schema = ts.schemaname 
     AND cd.table_name = ts.tablename) AS column_count,
    ts.row_count,
    ts.size_bytes,
    pk.pk_columns,
    pk.pk_column_count,
    current_timestamp AS extracted_at
FROM 
    table_stats ts
    LEFT JOIN primary_keys pk ON pk.table_schema = ts.schemaname AND pk.table_name = ts.tablename
ORDER BY 
    ts.schemaname, ts.tablename;
```

#### BigQuery Metadata Extraction

```sql
-- BigQuery INFORMATION_SCHEMA queries
WITH table_metadata AS (
    SELECT 
        table_schema,
        table_name,
        ROW_COUNT,
        CREATION_TIME,
        DATE(TIMESTAMP_MILLIS(last_modified_time)) AS last_modified_date
    FROM 
        `project.dataset.INFORMATION_SCHEMA.TABLES`
    WHERE 
        table_schema NOT IN ('pg_catalog', 'information_schema')
),
column_metadata AS (
    SELECT 
        table_schema,
        table_name,
        STRING_AGG(column_name ORDER BY ordinal_position) AS column_list,
        SUM(CASE WHEN is_nullable = 'NO' THEN 1 ELSE 0 END) AS non_nullable_count
    FROM 
        `project.dataset.INFORMATION_SCHEMA.COLUMNS`
    GROUP BY 
        table_schema, table_name
),
key_columns AS (
    SELECT 
        table_schema,
        table_name,
        STRING_AGG(column_name ORDER BY ordinal_position) AS key_columns
    FROM 
        `project.dataset.INFORMATION_SCHEMA.KEY_COLUMN_USAGE`
    WHERE 
        constraint_type IN ('PRIMARY KEY', 'UNIQUE')
    GROUP BY 
        table_schema, table_name, constraint_type
)
SELECT 
    'Table' AS object_type,
    tm.table_schema,
    tm.table_name,
    (SELECT COUNT(*) FROM column_metadata cm 
     WHERE cm.table_schema = tm.table_schema AND cm.table_name = tm.table_name) AS column_count,
    tm.ROW_COUNT,
    cm.column_list,
    kc.key_columns,
    tm.CREATION_TIME,
    tm.last_modified_date
FROM 
    table_metadata tm
    LEFT JOIN column_metadata cm ON tm.table_schema = cm.table_schema 
        AND tm.table_name = cm.table_name
    LEFT JOIN key_columns kc ON tm.table_schema = kc.table_schema 
        AND tm.table_name = kc.table_name;
```

---

## Advanced Lineage Building Methods

### Method 1: Multi-Signal Aggregation Pipeline

**Process**:

```
1. Extract Metadata (15-30 seconds for 10k objects)
   ├─ Query all FK constraints (explicit)
   ├─ Query table/column metadata
   ├─ Sample row counts & cardinality
   └─ Cache schema signatures

2. Confidence Score Calculation (parallel, per object pair)
   ├─ FK Detector → 1.0
   ├─ Column Name Matcher → 0.6-0.9
   ├─ Naming Convention Patterns → 0.6-0.75
   ├─ Schema/Prefix Grouping → 0.4-0.5
   ├─ Cardinality Patterns → 0.25-0.5
   ├─ ETL Pattern Detection → 0.5-0.75
   └─ Type + Nullability → 0.2-0.35

3. Confidence Thresholding & Deduplication
   ├─ Remove scores < 0.35 (noise floor)
   ├─ For pairs with multiple signals: MAX(scores) as primary, others as secondary
   └─ Flag conflicts (e.g., 0.2 + 0.8 score pair = potential ambiguity)

4. Graph Construction
   ├─ Populate primary edges (confidence > 0.6)
   ├─ Add secondary edges (confidence 0.35-0.6) as tentative
   └─ Mark relationship metadata (score, method, timestamp)

5. Impact Analysis & Validation
   ├─ Identify circular dependencies (flag for review)
   ├─ Detect orphan objects
   └─ Calculate centrality metrics
```

### Method 2: ETL Pattern Recognition

**Patterns to detect** (in order of priority):

1. **Incremental Load Pattern**
   - Source table name: `raw_events`
   - Staging table name: `stg_events` (prefix)
   - Target table name: `events` (base)
   - Confidence: FK detection → 0.65; Pattern match → 0.70

   ```sql
   SELECT 
       'raw_events' AS source,
       'stg_events' AS staging,
       'events' AS target,
       0.70 AS confidence,
       'Incremental Load (raw → stg → final)' AS pattern_description
   ```

2. **Snapshot/Archive Pattern**
   - Current table: `customer_details`
   - Archive table: `customer_details_archive`
   - History table: `customer_details_h` or `customer_details_history`
   - Confidence: 0.70

3. **Slowly Changing Dimension (SCD) Type 2**
   - Dimension table: `dim_product`
   - SCD table: `dim_product_scd2` or same table with `effective_date`, `end_date`
   - Contains: `is_current`, `effective_date`, `end_date`, `dw_insert_time`, `dw_update_time`
   - Confidence: 0.75

4. **Change Data Capture (CDC)**
   - Source: `orders` (base table)
   - CDC table: `orders_cdc` or `cdc_orders`
   - Contains: System transaction IDs, `sys_change_operation` ('I', 'U', 'D'), timestamps
   - Confidence: 0.75

5. **Junk Dimension**
   - Naming: `junk_dim_*`, typically low cardinality
   - Example: `junk_dim_flags` (combines Y/N flags from multiple fact columns)
   - Columns: Concatenated boolean/small domain values
   - Confidence: 0.50

### Method 3: Temporal/Audit Pattern Recognition

**Patterns**:

| Pattern | Columns | Confidence | Example |
|---------|---------|-----------|---------|
| Audit Trail | `created_by`, `created_date`, `modified_by`, `modified_date` | 0.65 | Standard audit columns |
| Validity Dates | `effective_from`, `effective_to`, `valid_from`, `valid_to` | 0.60 | Temporal tables |
| Source Tracking | `source_system`, `source_file`, `source_batch_id` | 0.55 | Lineage metadata |
| Load Timing | `load_date`, `batch_id`, `extract_time`, `transform_time` | 0.50 | ETL instrumentation |

**Detection Query (SQL Server)**:

```sql
SELECT 
    s.name AS schema_name,
    t.name AS table_name,
    CASE 
        WHEN EXISTS (SELECT 1 FROM sys.columns WHERE object_id = t.object_id 
                 AND name IN ('created_by', 'created_date', 'modified_by', 'modified_date'))
            THEN 0.65
        WHEN EXISTS (SELECT 1 FROM sys.columns WHERE object_id = t.object_id 
                 AND name IN ('effective_from', 'effective_to', 'valid_from', 'valid_to'))
            THEN 0.60
        WHEN EXISTS (SELECT 1 FROM sys.columns WHERE object_id = t.object_id 
                 AND name IN ('source_system', 'source_file', 'source_batch_id'))
            THEN 0.55
        ELSE NULL
    END AS audit_pattern_confidence,
    CASE 
        WHEN EXISTS (SELECT 1 FROM sys.columns WHERE object_id = t.object_id 
                 AND name IN ('created_by', 'created_date', 'modified_by', 'modified_date'))
            THEN 'Audit Trail'
        WHEN EXISTS (SELECT 1 FROM sys.columns WHERE object_id = t.object_id 
                 AND name IN ('effective_from', 'effective_to'))
            THEN 'Temporal (Validity Dates)'
        WHEN EXISTS (SELECT 1 FROM sys.columns WHERE object_id = t.object_id 
                 AND name IN ('master_record_id', 'parent_record_id'))
            THEN 'Hierarchy'
        ELSE NULL
    END AS pattern_type
FROM 
    sys.tables t
    INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
WHERE 
    s.name NOT IN ('sys', 'INFORMATION_SCHEMA')
    AND (
        EXISTS (SELECT 1 FROM sys.columns c WHERE c.object_id = t.object_id 
             AND c.name LIKE '%created%' OR c.name LIKE '%modified%')
        OR EXISTS (SELECT 1 FROM sys.columns c WHERE c.object_id = t.object_id 
             AND c.name LIKE '%effective%' OR c.name LIKE '%valid%')
        OR EXISTS (SELECT 1 FROM sys.columns c WHERE c.object_id = t.object_id 
             AND c.name = 'source_system')
    );
```

---

## Relationship Type Detection

### 1. Direct FK Relationships

**Query**:
```sql
-- See Tier 1.1 above (PK→FK detection)
-- Confidence: 1.0
```

---

### 2. Reverse Lookups (Non-PK Unique Key Joins)

**Description**: Joining on UNIQUE key that's not the PK.

**Example**:
```
Orders.customer_email = Customer.email (email is UNIQUE, not PK)
```

**Detection Query (SQL Server)**:
```sql
SELECT 
    t_child.name AS child_table,
    c_child.name AS child_column,
    t_parent.name AS parent_table,
    c_parent.name AS parent_column,
    0.80 AS confidence_score,
    'Reverse Lookup (UNIQUE Key)' AS relationship_type
FROM 
    sys.tables t_parent
    INNER JOIN sys.columns c_parent ON t_parent.object_id = c_parent.object_id
    INNER JOIN sys.indexes i ON t_parent.object_id = i.object_id
    INNER JOIN sys.index_columns ic ON i.object_id = ic.object_id 
        AND i.index_id = ic.index_id
        AND c_parent.column_id = ic.column_id
    CROSS JOIN sys.tables t_child
    INNER JOIN sys.columns c_child ON t_child.object_id = c_child.object_id
WHERE 
    i.is_unique = 1
    AND i.is_primary_key = 0
    AND c_child.name = c_parent.name
    AND t_parent.object_id != t_child.object_id
    AND NOT EXISTS (
        SELECT 1 FROM sys.foreign_keys fk
        WHERE fk.parent_object_id = t_child.object_id
        AND fk.referenced_object_id = t_parent.object_id
    )
ORDER BY 
    child_table, parent_table;
```

---

### 3. Composite Key Relationships

**Description**: Foreign key using multiple columns.

**Example**:
```
OrderItem (order_id, item_sequence) FK → Order (order_id, sequence_marker)
```

**Detection Query (SQL Server)**:
```sql
SELECT 
    OBJECT_NAME(fk.parent_object_id) AS child_table,
    STRING_AGG(COL_NAME(fkc.parent_object_id, fkc.parent_column_id), ', ') 
        WITHIN GROUP (ORDER BY fkc.constraint_column_id) AS child_columns,
    OBJECT_NAME(fk.referenced_object_id) AS parent_table,
    STRING_AGG(COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id), ', ') 
        WITHIN GROUP (ORDER BY fkc.constraint_column_id) AS parent_columns,
    COUNT(*) AS composite_cardinality,
    CASE 
        WHEN COUNT(*) = 2 THEN 0.95
        WHEN COUNT(*) = 3 THEN 0.93
        WHEN COUNT(*) > 3 THEN 0.90
        ELSE 1.0
    END AS confidence_score,
    'Composite Key FK' AS relationship_type
FROM 
    sys.foreign_keys fk
    INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
GROUP BY 
    fk.object_id, fk.parent_object_id, fk.referenced_object_id
HAVING 
    COUNT(*) > 1
ORDER BY 
    composite_cardinality DESC;
```

---

### 4. Self-Joins (Hierarchy Tables)

**Description**: Table with FK to itself (employee → manager, category → parent_category).

**Detection Query (SQL Server)**:
```sql
SELECT 
    t.name AS table_name,
    COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS child_column,
    COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS parent_column,
    1.0 AS confidence_score,
    'Self-Join (Hierarchy)' AS relationship_type,
    fk.name AS constraint_name
FROM 
    sys.foreign_keys fk
    INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
    INNER JOIN sys.tables t ON fk.parent_object_id = t.object_id
WHERE 
    fk.parent_object_id = fk.referenced_object_id
ORDER BY 
    table_name;
```

---

### 5. Many-to-Many Relationships (Junction Tables)

**Description**: Bridge/pivot table linking two entities.

**Characteristics**:
- Two or more FK constraints
- Only columns are FKs + possibly ID
- No business data columns
- Row count ≈ outer product of parent tables

**Detection Query (SQL Server)**:
```sql
WITH fk_counts AS (
    SELECT 
        fk.parent_object_id,
        COUNT(DISTINCT fk.referenced_object_id) AS referenced_table_count,
        COUNT(DISTINCT fkc.parent_column_id) AS total_fk_columns
    FROM 
        sys.foreign_keys fk
        INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
    GROUP BY 
        fk.parent_object_id
    HAVING 
        COUNT(DISTINCT fk.referenced_object_id) >= 2
)
SELECT 
    t.name AS junction_table,
    (SELECT STRING_AGG(OBJECT_NAME(fk.referenced_object_id), ', ')
     FROM sys.foreign_keys fk
     WHERE fk.parent_object_id = t.object_id) AS referenced_tables,
    fc.referenced_table_count,
    fc.total_fk_columns,
    (SELECT COUNT(*) FROM sys.columns WHERE object_id = t.object_id) AS total_columns,
    0.85 AS confidence_score,
    'Many-to-Many (Junction)' AS relationship_type
FROM 
    sys.tables t
    INNER JOIN fk_counts fc ON t.object_id = fc.parent_object_id
WHERE 
    (SELECT COUNT(*) FROM sys.columns WHERE object_id = t.object_id) - fc.total_fk_columns <= 2
    AND (SELECT COUNT(*) FROM sys.columns WHERE object_id = t.object_id) >= fc.referenced_table_count
ORDER BY 
    junction_table;
```

---

### 6. ETL Staging Pipeline (Multi-Hop)

**Description**: Source → Staging → Target lineage.

**Example Flow**:
```
raw_orders (source)
    ↓
stg_orders (staging - validate, enrich)
    ↓
dim_order (target - business entity)
    ↓
fact_orders (analytical - denormalized)
```

**Detection Query (SQL Server)**:
```sql
SELECT 
    t1.name AS stage_0_source,
    t2.name AS stage_1_staging,
    t3.name AS stage_2_target,
    t4.name AS stage_3_analytical,
    CASE 
        WHEN t2.name LIKE 'stg_%' THEN 0.70
        WHEN t2.name LIKE 'staging_%' THEN 0.65
        WHEN t3.name LIKE 'dim_%' THEN 0.60
        ELSE 0.50
    END AS confidence_score,
    'ETL Pipeline (Multi-Hop)' AS relationship_type
FROM 
    sys.tables t1
    CROSS JOIN sys.tables t2
    CROSS JOIN sys.tables t3
    LEFT JOIN sys.tables t4 ON t4.name LIKE 'fact_%' 
        OR t4.name LIKE t3.name + '%agg%'
WHERE 
    (t2.name = 'stg_' + SUBSTRING(t1.name, 1, 10)
     OR t2.name = 'staging_' + SUBSTRING(t1.name, 1, 10))
    AND (
        t3.name = SUBSTRING(t2.name, 5, LEN(t2.name))
        OR t3.name = SUBSTRING(t2.name, 9, LEN(t2.name))
    )
ORDER BY 
    confidence_score DESC;
```

---

### 7. SCD Type 2 Relationships

**Description**: Dimension table with effective dating and current flag.

**Identifying Columns**:
- `effective_date` / `valid_from`: Start of dimension member validity
- `end_date` / `valid_to`: End of dimension member validity
- `is_current` / `current_flag`: Boolean indicating current record

**Detection Query (SQL Server)**:
```sql
SELECT 
    t.name AS scd2_table,
    CASE 
        WHEN EXISTS (SELECT 1 FROM sys.columns WHERE object_id = t.object_id 
                 AND name IN ('effective_date', 'valid_from'))
         AND EXISTS (SELECT 1 FROM sys.columns WHERE object_id = t.object_id 
                 AND name IN ('end_date', 'valid_to', 'expiry_date'))
         AND EXISTS (SELECT 1 FROM sys.columns WHERE object_id = t.object_id 
                 AND name IN ('is_current', 'current_flag', 'active_flag'))
            THEN 0.80
        WHEN (SELECT COUNT(*) FROM sys.columns WHERE object_id = t.object_id 
              AND name LIKE '%date%') > 2
         AND (SELECT COUNT(*) FROM sys.columns WHERE object_id = t.object_id 
              AND (name LIKE '%current%' OR name LIKE '%active%' OR name LIKE '%flag%')) > 0
            THEN 0.70
        ELSE 0.50
    END AS confidence_score,
    (SELECT STRING_AGG(name, ', ') FROM sys.columns 
     WHERE object_id = t.object_id AND name LIKE '%date%') AS date_columns,
    (SELECT STRING_AGG(name, ', ') FROM sys.columns 
     WHERE object_id = t.object_id AND name LIKE '%current%') AS flag_columns,
    'SCD Type 2' AS relationship_type
FROM 
    sys.tables t
    INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
WHERE 
    s.name NOT IN ('sys', 'INFORMATION_SCHEMA')
    AND t.name LIKE '%dim_%'
    AND EXISTS (SELECT 1 FROM sys.columns WHERE object_id = t.object_id 
            AND (name LIKE '%date%' OR name LIKE '%current%'))
ORDER BY 
    confidence_score DESC;
```

---

## Data Governance Framework Integration

### Classification Framework

#### 1. Data Sensitivity Classification

| Level | Definition | Examples | Handling | Lineage Visibility |
|-------|-----------|----------|----------|-------------------|
| **PUBLIC** | No confidentiality requirements; can be disclosed | Product catalog, public prices | Full disclosure | All users |
| **INTERNAL** | Internal use only; would be embarrassing if leaked | Non-sensitive HR data, internal projects | Restricted to employees | Authenticated users |
| **CONFIDENTIAL** | Highly sensitive business data | Customer PII, financial data, trade secrets | Encrypted, access-controlled | Authorized data stewards |
| **RESTRICTED** | Regulatory/compliance sensitive | GDPR PII, HIPAA PHI, PCI credit cards | Encrypted, audited, purpose-limited | Data owners + compliance |
| **SECRET** | Highest security level | Trade secrets, encryption keys, backdoors | NSA-grade encryption | Minimal, executives only |

**Mapping to Lineage Visibility**:
```
                User Role
                   │
                ┌──┴──┬──────┬──────────┬──────┐
                │     │      │          │      │
            Public Internal Conf. Restricted Secret
               100%   85%    50%     10%      <1%
                
If User = "Public Viewer" → Hide Confidential+ tables
If User = "Analyst" → Show Internal+ tables
If User = "Data Owner" → Show all in purview
If User = "Compliance" → Show Restricted+Secret for audit
```

**Implementation**:

```javascript
// Example: Node.js authorization check
function filterLineageByClassification(lineage, userRole, userDepartment) {
  const classificationHierarchy = {
    'PUBLIC': 0,
    'INTERNAL': 1,
    'CONFIDENTIAL': 2,
    'RESTRICTED': 3,
    'SECRET': 4
  };

  const roleThresholds = {
    'public_user': 0,      // PUBLIC only
    'authenticated': 1,    // PUBLIC + INTERNAL
    'analyst': 2,          // + CONFIDENTIAL
    'data_steward': 3,     // + RESTRICTED
    'executive': 4         // + SECRET
  };

  const threshold = roleThresholds[userRole] || 0;

  return lineage.filter(relationship => {
    const sourceClassification = classificationHierarchy[relationship.source.classification];
    const targetClassification = classificationHierarchy[relationship.target.classification];

    return (
      sourceClassification <= threshold &&
      targetClassification <= threshold
    );
  });
}
```

#### 2. Ownership & Stewardship

**Model**:
```json
{
  "object_id": "production_hr.employees",
  "ownership": {
    "primary_owner": "alice@company.com",
    "backup_owner": "bob@company.com",
    "stewards": ["data_team@company.com"],
    "stakeholders": ["hr_team@company.com", "analytics@company.com"]
  },
  "certification": {
    "certified": true,
    "certification_date": "2024-06-15",
    "expires": "2025-06-15",
    "certified_by": "data_governance_lead@company.com"
  },
  "sla": {
    "availability": "99.9%",
    "rto_hours": 2,
    "rpo_hours": 1,
    "support_hours": "24/7"
  }
}
```

#### 3. Retention & Lifecycle Policies

| Policy | Retention | Archival | Purge | Governance |
|--------|-----------|----------|-------|-----------|
| **TRANSIENT** | 7 days | N/A | Automatic | No audit |
| **SHORT_TERM** | 90 days | Upon expiry | Automatic | Limited audit |
| **STANDARD** | 7 years | Year 3-7 | Manual review | Full audit |
| **LONG_TERM** | Indefinite | N/A | Never | Full compliance |
| **EXTERNAL_SHARING** | Per contract | Separate archive | Per agreement | Contractual |

**Mapping to Lineage**:
```
If lineage includes object with TRANSIENT retention:
  → Flag downstream objects as higher priority for revalidation
  → Alert data stewards if retention expires before dependent updates completed

If SLA.RTO = 2 hours:
  → Calculate downstream impact scope (all objects within 2-hop radius)
  → Prioritize recovery sequence during incident
```

#### 4. Compliance & Regulatory Mappings

| Framework | Objects | Lineage Role | Implementation |
|-----------|---------|--------------|-----------------|
| **GDPR** | PII tables (customers, employees) | Data subject right requests; trace processing | Tag PII=true; track processors in lineage |
| **HIPAA** | PHI tables (patients, medical records) | Minimum necessary access; audit trail | Encrypt; audit all access/lineage views |
| **SOX** | Financial tables (GL, AP, AR) | Change control; non-repudiation | Immutable audit logs; signed lineage versions |
| **CCPA** | CA resident personal info | Sale opt-out tracking; deletion requests | Lineage tag for "sale" vs "service" purposes |
| **PCI DSS** | Credit card data (if stored) | Encryption; isolation; access logging | Never store; if necessary, tag + isolate |

**Query Example (GDPR Subject Access Request)**:

```sql
-- Find all tables containing Peter Smith's data
SELECT DISTINCT
    t.name AS table_containing_pii,
    GETDATE() AS extraction_date,
    (
        SELECT STRING_AGG(
            OBJECT_NAME(fk.referenced_object_id), ', '
        )
        FROM sys.foreign_keys fk
        WHERE fk.parent_object_id = t.object_id
    ) AS upstream_dependencies,
    (
        SELECT STRING_AGG(
            OBJECT_NAME(fk.parent_object_id), ', '
        )
        FROM sys.foreign_keys fk
        WHERE fk.referenced_object_id = t.object_id
    ) AS downstream_dependents
FROM 
    sys.tables t
    INNER JOIN sys.columns c ON t.object_id = c.object_id
WHERE 
    -- Mark columns with PII through extended properties
    EXISTS (
        SELECT 1
        FROM sys.extended_properties ep
        WHERE ep.major_id = c.object_id
        AND ep.minor_id = c.column_id
        AND ep.name = 'PII_CLASSIFICATION'
        AND ep.value = 'GDPR_PERSONAL_DATA'
    )
ORDER BY 
    table_containing_pii;
```

---

## Implementation Roadmap

### Phase 1: Metadata Foundation (Weeks 1-3)

**Deliverables**:
1. Metadata extraction scripts for all supported databases
2. Centralized metadata repository structure
3. Extraction scheduling (daily for volatile tables, weekly for DDL)

**Tasks**:
- [ ] Write extraction scripts per DB type (SQL Server, PostgreSQL, BigQuery, Snowflake)
- [ ] Create metadata schema (60+ tables/views)
- [ ] Set up scheduled jobs for incremental extraction
- [ ] Implement change tracking for DDL changes
- [ ] Add data quality checks (e.g., "row_count changed by >500%")

**Code Example** (Node.js service stub):

```javascript
// services/metadataExtractionService.js
export class MetadataExtractionService {
  async extractDatabaseMetadata(connectionConfig, dbType) {
    const extractor = this.getExtractorForDbType(dbType);
    const metadata = {
      tables: await extractor.extractTableMetadata(),
      columns: await extractor.extractColumnMetadata(),
      constraints: await extractor.extractConstraintMetadata(),
      indexes: await extractor.extractIndexMetadata(),
      extractedAt: new Date(),
      dbType: dbType
    };
    return metadata;
  }

  async storeMetadata(metadata) {
    // Store in Meilisearch for fast indexing + PostgreSQL for structured queries
    await this.indexService.indexMetadata(metadata);
    await this.dbService.storeMetadata(metadata);
  }
}
```

---

### Phase 2: Confidence Scoring Engine (Weeks 4-6)

**Deliverables**:
1. Scoring algorithm implementation for all 8+ relationship types
2. Confidence score calibration dataset (1000+ manual annotations)
3. Scoring performance benchmarks

**Tasks**:
- [ ] Implement PK→FK scorer (1.0 confidence)
- [ ] Implement column name matcher (0.6-0.9 confidence)
- [ ] Implement naming convention pattern matcher (0.6-0.75 confidence)
- [ ] Implement ETL pattern detector (0.5-0.75 confidence)
- [ ] Implement cardinality analyzer (0.25-0.5 confidence)
- [ ] Aggregate scores via MAX or custom weighting
- [ ] Calibrate thresholds against validation set

**Scoring Architecture**:

```javascript
// services/confidenceScoringService.js
export class ConfidenceScoringService {
  /**
   * Calculate relationship confidence across all methods
   */
  async scoreRelationship(childTable, childColumn, parentTable, parentColumn) {
    const scores = [];

    // Tier 1: Definitive
    scores.push(await this.scoreFKConstraint(childTable, childColumn, parentTable, parentColumn));

    // Tier 2: Strong heuristics
    scores.push(await this.scoreExactColumnMatch(childColumn, parentColumn));
    scores.push(await this.scoreSemanticMatch(childColumn, parentColumn));
    scores.push(await this.scoreNamingConvention(childTable, parentTable, childColumn, parentColumn));

    // Tier 3: Moderate
    scores.push(await this.scoreSchemaGrouping(childTable, parentTable));
    scores.push(await this.scoreCardinalityPattern(childTable, parentTable));

    // Tier 4: Weak signals
    scores.push(await this.scoreTypeAlignment(childColumn, parentColumn));

    // Aggregate
    const primaryScore = Math.max(...scores.filter(s => s.confidence > 0));
    const methods = scores.filter(s => s.confidence > 0);

    return {
      confidence_score: primaryScore,
      methods_detected: methods,
      recommendation: this.scoreToRecommendation(primaryScore)
    };
  }

  scoreToRecommendation(confidence) {
    if (confidence >= 0.95) return 'DEFINITIVE';
    if (confidence >= 0.75) return 'HIGH_CONFIDENCE';
    if (confidence >= 0.55) return 'MEDIUM_CONFIDENCE';
    if (confidence >= 0.35) return 'LOW_CONFIDENCE - HUMAN_REVIEW_RECOMMENDED';
    return 'INSUFFICIENT_EVIDENCE';
  }
}
```

---

### Phase 3: Lineage Graph Construction (Weeks 7-8)

**Deliverables**:
1. Lineage graph data structure (nodes + weighted edges)
2. Graph traversal APIs (upstream/downstream impact)
3. Cycle detection + visualization

**Tasks**:
- [ ] Build graph from scored relationships
- [ ] Implement BFS/DFS for traversal
- [ ] Detect and flag cycles (data quality issues)
- [ ] Calculate node metrics (degree, betweenness, closure)
- [ ] Optimize for 10k+ nodes performance

---

### Phase 4: UI & API Integration (Weeks 9-10)

**Deliverables**:
1. REST API endpoints for lineage queries
2. Frontend visualization (DAG, matrix, sankey)
3. Filtering by confidence level

**Endpoints**:
```
GET /api/lineage/{objectId}/upstream?confidence_threshold=0.5
GET /api/lineage/{objectId}/downstream?max_depth=5
GET /api/lineage/{objectId}/impact_analysis
GET /api/lineage/relationships?confidence_range=[0.7,1.0]
GET /api/lineage/statistics?database=production_crm
```

---

### Phase 5: Governance Mappings (Weeks 11-12)

**Deliverables**:
1. Classification framework linked to lineage
2. Ownership/stewardship model
3. Compliance compliance mapping (GDPR, HIPAA, SOX)

---

## Case Studies & Examples

### Case Study 1: E-Commerce Database

**Database**: Production OLTP (`production_ecommerce`)

**Tables**:
- `Customers` (100k rows)
- `Orders` (2M rows)
- `OrderItems` (8M rows)
- `Products` (50k rows)
- `Inventory` (50k rows)

**ETL Warehouse**:
- `stg_Customers` (100k rows, staging)
- `stg_Orders` (2M rows, staging)
- `dim_Customer` (100k rows, dimension)
- `dim_Product` (50k rows, dimension)
- `dim_Date` (10k rows, date dimension)
- `fact_Sales` (8M rows, fact table)

**Lineage Detection Analysis**:

| Relationship | Detection Method | Confidence | Evidence |
|--------------|-----------------|-----------|----------|
| `Orders.customer_id` → `Customers.id` | FK Constraint | 1.0 | Explicit FK |
| `stg_Customers` → `dim_Customer` | ETL Pattern + Column Match | 0.75 | Naming convention (`stg_`), columns match |
| `stg_Orders` → `fact_Sales` | Cardinality + Naming | 0.65 | `stg_` prefix; `fact_Sales.rows ≈ Orders.rows * 4` |
| `OrderItems.product_id` → `Products.id` | FK Constraint | 1.0 | Explicit FK |
| `OrderItems.order_id` → `Orders.id` | FK Constraint | 1.0 | Explicit FK |
| `Inventory.product_id` → `Products.id` | FK Constraint | 1.0 | Explicit FK |
| `Orders.order_date` → `dim_Date.date` | Semantic Match | 0.70 | Both are `DATETIME`; `dim_Date` is typical fact table dimension |

**Impact Analysis**:
```
If Customers table is down:
  Direct impact: 
    - Orders (1 hop)
    - OrderItems (2 hops)
  Downstream (ETL):
    - stg_Customers → dim_Customer → fact_Sales (3 hops)
  
Estimated users affected: 10,000+ (all e-commerce app users)
RTO: Critical (e-commerce sales blocked)
```

---

### Case Study 2: Healthcare Data Warehouse

**Tables**:
- `Patients` (PHI, PII)
- `PatientVisits` (HIPAA sensitive)
- `PatientMedications` (HIPAA sensitive)
- `PatientDiagnoses` (HIPAA sensitive)

**Staging**:
- `stg_PatientVisits_raw` (raw EDI feed)
- `stg_PatientVisits_transformed` (standardized)

**Dimensions**:
- `dim_Patient` (SCD Type 2 with `effective_date`, `end_date`, `is_current`)
- `dim_Diagnosis_Code` (ICD-10 lookup)
- `dim_Medication_Code` (NDC lookup)

**Facts**:
- `fact_ClaimActivity` (aggregation of visits, diagnoses, medications)

**Lineage with Governance**:

```json
{
  "source_table": "stg_PatientVisits_raw",
  "target_table": "stg_PatientVisits_transformed",
  "relationship_type": "ETL:Transformation",
  "confidence_score": 0.75,
  "governance": {
    "classification_source": "RESTRICTED",
    "classification_target": "RESTRICTED",
    "compliance_frameworks": ["HIPAA"],
    "data_owner": "healthcare_privacy@health.org",
    "access_policy": "RBAC_with_minimum_necessary",
    "audit_required": true,
    "retention_policy": "7_years",
    "encryption_status": "AES-256_at_rest_and_transit"
  }
}
```

---

## Calibration & Testing Guidelines

### Calibration Methodology

**Step 1: Build Validation Set**

Manually review and annotate 1,000 table pairs as:
- `TRUE` (genuine relationship)
- `FALSE` (no relationship)
- `UNCERTAIN` (unclear)

**Step 2: Run Scoring Algorithm**

Score all 1,000 pairs and collect confidence distributions:

```
Precision by Confidence Threshold:

Confidence > 0.95:  Precision = 99.5% (15/15 True)
Confidence > 0.75:  Precision = 95.0% (950/1000 True)
Confidence > 0.55:  Precision = 85.0% (850/1000 True)
Confidence > 0.35:  Precision = 70.0% (700/1000 True)
Confidence > 0.20:  Precision = 60.0% (600/1000 True)
```

**Step 3: Calibrate Thresholds**

Select threshold to meet business requirements:

| Use Case | Recommended Threshold | Rationale |
|----------|---------------------|-----------|
| Auto-discovery (high recall) | 0.35 | Catch relationships; require audit before prod use |
| Impact analysis (auto-escalation) | 0.60 | Minimize false SLO breaches |
| Compliance reporting (GDPR SAR) | 0.75 | High precision; manual review fallback |
| Data catalog (auto-documentation) | 0.50 | Requires periodic audit; false negatives more tolerable |

**Step 4: Implement Feedback Loop**

- User marks relationships as correct/incorrect
- Retrain confidence scorer quarterly
- Monitor false positive rate in production

### Testing Framework

#### Unit Tests

```javascript
describe('ConfidenceScoringService', () => {
  it('should return 1.0 for PK→FK relationship', () => {
    const score = scorer.scoreFKConstraint(
      'Orders', 'customer_id',
      'Customers', 'id'
    );
    expect(score.confidence_score).toBe(1.0);
  });

  it('should return 0.8 for exact column name match', () => {
    const score = scorer.scoreExactColumnMatch(
      'customer_id', 'customer_id'
    );
    expect(score.confidence_score).toBeCloseTo(0.8, 2);
  });

  it('should flag SCD Type 2 with 0.75 confidence', () => {
    const result = scorer.scoreSCDType2({
      effective_date: true,
      end_date: true,
      is_current: true
    });
    expect(result.confidence_score).toBeCloseTo(0.75, 2);
  });
});
```

#### Integration Tests

```javascript
describe('Lineage Graph Integration', () => {
  it('should build complete upstream lineage', () => {
    const upstream = lineageService.getUpstreamDependencies('fact_Sales');
    expect(upstream).toContain('dim_Customer');
    expect(upstream).toContain('dim_Product');
    expect(upstream).toContain('dim_Date');
  });

  it('should detect circular dependencies', () => {
    // Create circular ref: A→B→C→A
    const cycles = graphService.findCycles();
    expect(cycles.length).toBeGreaterThan(0);
  });
});
```

---

## Appendix: Quick Reference Tables

### Confidence Score Lookup

| Relationship Type | Minimum Confidence | Typical Range | Notes |
|-------------------|----------------|------------------|-------|
| PK→FK Constraint | 1.0 | 1.0 | Definitive |
| Named FK (Unique Key) | 0.95 | 0.95 | Slight uncertainty if nullable |
| Exact Column Name Match | 0.80 | 0.75-0.90 | Reduced if many ID columns in child |
| Semantic Name Match | 0.70 | 0.65-0.75 | Abbrev. matching improves score |
| Naming Convention | 0.60 | 0.55-0.75 | Pattern complexity affects score |
| Schema Grouping | 0.40 | 0.40-0.50 | Weak heuristic alone |
| Cardinality Pattern | 0.25 | 0.25-0.50 | Time-series correlation helps |
| Type + Nullability | 0.20 | 0.20-0.35 | High false positive risk |
| ETL Pattern (Staging) | 0.65 | 0.60-0.75 | Based on naming convention |
| SCD Type 2 | 0.75 | 0.70-0.80 | Date + current_flag confirms |
| Self-Join (Hierarchy) | 1.0 | 1.0 | If constraint; 0.85 if semantic |

---

## References & Further Reading

1. **Data Lineage Standards**:
   - OpenMetadata Lineage Model
   - Apache Atlas Lineage Architecture
   - [DAMA-DMBOK] Chapter 3 (Data Governance)
   - [ISO 8601] Temporal/Date-time formats

2. **Data Warehouse Design**:
   - Kimball, Ralph. "The Data Warehouse Toolkit" (2nd ed.)
   - Inmon, Bill. "Building the Data Warehouse" (4th ed.)
   - SCD Type 1-5 patterns

3. **Relationship Detection Research**:
   - Schema Matching surveys (Rahm & Bernstein, 2001)
   - Column name similarity metrics (Levenshtein, Jaro-Winkler)
   - Cardinality estimation techniques

4. **Compliance & Governance**:
   - GDPR Art. 25 (Data Protection by Design)
   - HIPAA Privacy Rule (45 CFR Part 164)
   - SOX Internal Control Framework

---

**Document Version**: 1.0  
**Last Updated**: May 2026  
**Maintained By**: Data Governance Team  
**Next Review**: November 2026

