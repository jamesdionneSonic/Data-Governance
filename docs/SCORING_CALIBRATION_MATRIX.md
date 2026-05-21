# Confidence Scoring Calibration Matrix & Test Cases

**Version**: 1.0  
**Date**: May 2026  
**Purpose**: Practical guidance for scoring validation, threshold selection, and production calibration

---

## Table of Contents

1. [Comprehensive Scoring Matrix](#comprehensive-scoring-matrix)
2. [Real-World Test Cases](#real-world-test-cases)
3. [Threshold Calibration Guide](#threshold-calibration-guide)
4. [Validation Methodology](#validation-methodology)
5. [Common Patterns & Edge Cases](#common-patterns--edge-cases)
6. [Production Monitoring](#production-monitoring)

---

## Comprehensive Scoring Matrix

### Master Reference: All Relationship Types

| # | Relationship Type | Example | Base Score | Modifiers | Final Range | Notes |
|---|-------------------|---------|-----------|-----------|------------|-------|
| 1 | **PK→FK Explicit** | `Orders.customer_id` FK→ `Customers.id` | 1.0 | None | **1.0** | Definitive; constraint exists in schema |
| 2 | **FK on UNIQUE (Non-PK)** | `Orders.email` FK→ `Customers.email` (UNIQUE) | 0.95 | -0.05 if nullable | **0.90-0.95** | Slightly lower; nullable UQ is rare |
| 3 | **Composite PK→FK** | `OrderItems(order_id, line_no)` FK→ `Orders` | 0.95 | -0.02 per key beyond 2 | **0.90-0.95** | Multi-column complexity slight discount |
| 4 | **Exact Column Name** | Both `customer_id`; data type matches | 0.80 | ±0.05 based on context | **0.75-0.85** | Strong signal; moderate false positive risk |
| 5 | **Semantic Name Match** | `CustomerID` ↔ `Cust_ID`; ~70% string similarity | 0.70 | ±0.05; +0.05 if abbr known | **0.65-0.75** | Depends on Levenshtein/Jaro-Winkler |
| 6 | **Naming Convention** | `Order.customer_id` pattern → `Customer.id` | 0.75 | -0.05 if many `_id` cols | **0.65-0.75** | Highly database-specific |
| 7 | **Table Prefix Match** | `OrderItem` col `order_id` → `Order.id` | 0.65 | +0.05 if stg_ pattern | **0.60-0.70** | Moderate; requires validation |
| 8 | **Schema Grouping** | Both in `dw_` schema; `dim_` prefix | 0.50 | +0.05 if same dept | **0.45-0.55** | Weak; requires manual review |
| 9 | **Cardinality Match** | `Orders.rows` ≈ `OrderItems.rows / 4` (1:4 ratio) | 0.50 | +0.10 if stable; -0.15 if volatale | **0.25-0.60** | Time-series correlation strength |
| 10 | **ETL Staging** | `raw_orders` → `stg_orders` (stg_ prefix) | 0.65 | +0.05 if col count matches | **0.60-0.70** | Pipeline pattern well-established |
| 11 | **History/Audit** | `customers` → `customers_history` | 0.70 | +0.05 if has created_date | **0.65-0.75** | Standard pattern |
| 12 | **CDC Pattern** | `orders` → `orders_cdc` + `sys_change_operation` | 0.75 | None | **0.75** | Strongly indicative |
| 13 | **SCD Type 2** | `dim_product` with `effective_date`, `end_date`, `is_current` | 0.75 | -0.05 if missing marker | **0.70-0.75** | Data warehouse standard |
| 14 | **Self-Join (Hierarchy)** | `Employee.manager_id` FK→ `Employee.id` | 1.0 | None | **1.0** | Definitive if constraint |
| 15 | **Reverse Lookup** | `Orders.email` → `Customers.email` (UNIQUE index) | 0.80 | -0.10 if plural match | **0.65-0.80** | Non-PK join; moderate uncertainty |
| 16 | **Many-to-Many Bridge** | `OrderProduct` with 2 FKs; min columns | 0.85 | -0.05 per extra biz column | **0.80-0.85** | Junction table pattern |
| 17 | **Junk Dimension** | `Junk_Flags` (low cardinality; boolean cols) | 0.50 | None | **0.50** | Weak; data warehouse pattern |
| 18 | **Type-Only Match** | Both `BIGINT`; no name match; no context | 0.20 | +0.10 if truly ID-like | **0.20-0.30** | High false positive risk |
| 19 | **Statistical Correlation** | Row count ratio corr coeff > 0.85 over time | 0.35 | +0.10 if corr > 0.95 | **0.25-0.45** | Weak signal; time-series dependent |

---

## Real-World Test Cases

### Dataset 1: E-Commerce Database (Production OLTP)

**Tables**:
- `Customers` (100k rows, PK: `customer_id`)
- `Orders` (2M rows, FK: `customer_id` → `Customers`)
- `OrderItems` (8M rows, FK: `order_id` → `Orders`, `product_id` → `Products`)
- `Products` (50k rows, PK: `product_id`)
- `Inventory` (unique(`warehouse_id`, `product_id`))

**Staging**:
- `stg_customers` (100k rows; nullable `customer_id`)
- `stg_orders` (2M rows; nullable `order_id`)

**DW Dimensions**:
- `dim_customer` (100k rows; SCD2 columns)
- `dim_product` (50k rows; SCD2 columns)
- `dim_date` (10K rows; all dimension tables reference)

**DW Facts**:
- `fact_sales` (8M rows; references all dim_* tables)

#### Test Case 1.1: Explicit FK (Baseline)

**Input**:
```
Relationship: Orders.customer_id → Customers.customer_id
Detection Method: FK Constraint (exists in sys.foreign_keys)
```

**Expected Score**: **1.0**

**Scorer Output**:
```json
{
  "confidence_score": 1.0,
  "method": "PK-FK Constraint",
  "recommendation": "DEFINITIVE",
  "signals": [
    {
      "type": "constraint",
      "evidence": "FK constraint 'FK_Orders_Customers' exists",
      "strength": 1.0
    }
  ]
}
```

**Validation**: ✓ Pass (FK enforced in schema)

---

#### Test Case 1.2: ETL Staging Pattern

**Input**:
```
Relationship: stg_customers → dim_customer
- stg_customers: 100k rows, columns: [customer_id, name, email, ...]
- dim_customer: 100k rows, columns: [customer_key, customer_id, name, email, effective_date, end_date, is_current]
```

**Expected Score**: **0.70-0.75**

**Scorer Output**:
```json
{
  "confidence_score": 0.72,
  "recommendation": "HIGH_CONFIDENCE",
  "methods_detected": [
    {
      "method": "Naming Convention",
      "confidence": 0.65,
      "reason": "stg_ prefix indicates staging"
    },
    {
      "method": "Column Count Match",
      "confidence": 0.80,
      "reason": "dim_customer has all stg_customers columns + 3 audit columns"
    },
    {
      "method": "SCD Type 2 Pattern",
      "confidence": 0.75,
      "reason": "Target has effective_date, end_date, is_current"
    }
  ],
  "aggregation": "MAX(0.65, 0.80, 0.75) = 0.80; adjusted to 0.72 for staging uncertainty"
}
```

**Validation**: ✓ Pass (Staging pattern confirmed; domain knowledge validates)

---

#### Test Case 1.3: Column Name Match Without FK

**Input**:
```
Relationship: Inventory.product_id → Products.product_id
- No explicit FK constraint
- Exact column name match
- Data type match: both BIGINT
- Inventory.product_id: NOT NULL
- Products.product_id: NOT NULL (PK)
```

**Expected Score**: **0.80**

**Scorer Output**:
```json
{
  "confidence_score": 0.80,
  "recommendation": "HIGH_CONFIDENCE",
  "methods_detected": [
    {
      "method": "Exact Column Name Match",
      "confidence": 0.80,
      "details": {
        "childColumn": "product_id",
        "parentColumn": "product_id",
        "typeMatch": true,
        "nullableChild": false,
        "nullableParent": false
      }
    }
  ],
  "warning": "No FK constraint found; verify in application logic or ETL code"
}
```

**Validation**: ✓ Pass (Column match + data types confirm; likely missing FK)

**Action**: Flag for DBA review to add FK constraint.

---

#### Test Case 1.4: Many-to-Many Bridge Table (Low False Positive Risk)

**Input**:
```
Relationship: OrderProduct (bridge table)
- Columns: [order_product_id (PK), order_id (FK), product_id (FK)]
- Row count: 8M (≈ Orders * Products / k)
- 2 FK constraints
- Minimal business data
```

**Expected Score**: **0.85**

**Scorer Output**:
```json
{
  "confidence_score": 0.85,
  "recommendation": "HIGH_CONFIDENCE",
  "methods_detected": [
    {
      "method": "Many-to-Many Bridge Pattern",
      "confidence": 0.85,
      "details": {
        "fk_count": 2,
        "total_columns": 3,
        "business_data_columns": 0,
        "cardinality_alignment": true
      }
    }
  ]
}
```

**Validation**: ✓ Pass (Bridge table pattern definitive)

---

### Dataset 2: Healthcare Data Warehouse

**Tables**:
- `dim_patient` (1M rows; HIPAA restricted)
- `dim_provider` (50k rows)
- `dim_diagnosis_code` (lookup; ~14k ICD-10 codes)
- `dim_medication_code` (lookup; ~10k NDC codes)
- `fact_encounter` (50M rows; references all dims)
- `fact_claim` (500M rows; sparse sparse matrix)

**Staging**:
- `stg_patients_raw` (EDI feed; incoming)
- `stg_patients_transformed` (standardized; ready for dim load)
- `stg_encounters_hl7` (HL7 messages; incomplete)

#### Test Case 2.1: Semantic Abbreviation Matching

**Input**:
```
Relationship: stg_patients_raw.pt_id → stg_patients_transformed.patient_id
- No FK constraint
- String similarity: "pt_id" vs "patient_id" ≈ 78%
- Know mapping: pt = patient
- Data type: Both INTEGER
- Cardinality: 1:1 (same 1M rows)
```

**Expected Score**: **0.70-0.75**

**Scorer Output**:
```json
{
  "confidence_score": 0.73,
  "recommendation": "HIGH_CONFIDENCE",
  "methods_detected": [
    {
      "method": "Semantic Name Match",
      "confidence": 0.70,
      "details": {
        "stringDistance": 0.22,
        "similarity": 0.78,
        "knownAbbreviation": "pt → patient"
      }
    },
    {
      "method": "Cardinality Match",
      "confidence": 0.50,
      "reason": "1:1 row count ratio"
    },
    {
      "method": "Type Match",
      "confidence": 0.25,
      "reason": "Both INTEGER"
    }
  ],
  "aggregation": "MAX(0.70, 0.50, 0.25) = 0.73"
}
```

**Validation**: ✓ Pass (Abbreviation matching + cardinality confirm transformation step)

---

#### Test Case 2.2: Weak Signal (Data Type Only)

**Input**:
```
Relationship: fact_claim.unknown_int_col1 → dim_diagnosis_code.diagnosis_code_id
- No FK constraint
- Column names completely unrelated
- Data type: Both BIGINT
- No cardinality data available
- Classification: Both RESTRICTD/PHI
```

**Expected Score**: **0.20-0.25 → REJECT**

**Scorer Output**:
```json
{
  "confidence_score": 0.22,
  "recommendation": "INSUFFICIENT_EVIDENCE",
  "methods_detected": [
    {
      "method": "Type + Nullability Match",
      "confidence": 0.22,
      "warning": "Extremely high false positive risk"
    }
  ],
  "action": "REJECT - Insufficient evidence; requires manual investigation or schema review"
}
```

**Validation**: ✓ Pass → Reject (Correct low score for weak signal)

**Action**: Require manual lineage annotation or SME review.

---

### Dataset 3: Financial (SOX-regulated)

**Tables**:
- `gl_transactions` (500M rows; audit-tracked)
- `ap_invoices` (10M rows; approval workflow)
- `ar_receipts` (5M rows)
- `cash_reconciliation` (1M rows daily)

**Audit/History**:
- `gl_transactions_history` (archive; immutable)
- `gl_transactions_audit` (change log)
- `ap_invoices_archive` (archived invoices)

#### Test Case 3.1: History Table Pattern (SOX Compliance)

**Input**:
```
Relationship: gl_transactions → gl_transactions_history
- gl_transactions: 500M rows; PK: transaction_id
- gl_transactions_history: 5B rows (10-year archive)
- Columns: [transaction_id, amount, gl_account, created_date, modified_date, modified_by, archived_date]
- Contains: created_by, created_date, modified_by, modified_date, archived_date
- Retention: LONG_TERM (7 years)
```

**Expected Score**: **0.70-0.75**

**Scorer Output**:
```json
{
  "confidence_score": 0.72,
  "recommendation": "HIGH_CONFIDENCE",
  "methods_detected": [
    {
      "method": "Naming Convention: History Table",
      "confidence": 0.70,
      "pattern": "_history suffix"
    },
    {
      "method": "Audit Column Pattern",
      "confidence": 0.65,
      "columns": ["created_by", "created_date", "modified_by", "modified_date"],
      "framework": "SOX"
    }
  ],
  "aggregation": "MAX(0.70, 0.65) = 0.70; retention classified LONG_TERM",
  "governance": {
    "classification": "RESTRICTED",
    "compliance": "SOX",
    "audit_required": true,
    "immutable": true
  }
}
```

**Validation**: ✓ Pass (History pattern + audit trail + compliance context)

---

## Threshold Calibration Guide

### Tier-Based Threshold Recommendations

| Confidence Range | Recommendation | Use Cases | False Positive Rate | Manual Review Required |
|-----------------|----------------|-----------|-------------------|----------------------|
| **0.95-1.0** | **ACCEPT** | Auto-populate catalog; SLA escalation; SAR responses | <0.5% | No; definitive |
| **0.75-0.95** | **HIGH_CONFIDENCE** | Data lineage visualizations; impact analysis; audit trails | 1-3% | Optional periodic audit |
| **0.55-0.75** | **MEDIUM_CONFIDENCE** | Recommendations; weak alerts; exploratory queries | 5-10% | Recommended for critical paths |
| **0.35-0.55** | **LOW_CONFIDENCE** | Requires review; human validation loop; feedback training | 20-40% | **Required before action** |
| **<0.35** | **REJECT** | Data quality issues; unsupported; requires manual annotation | >40% | Required; likely incorrect |

### Environment-Specific Thresholds

**Development Environment**:
```
- Auto-discovery threshold: 0.35 (catch all signals for analysis)
- Visualization threshold: 0.50 (exploratory mode)
- Alert threshold: 0.60 (errors/warnings)
```

**Staging Environment**:
```
- Auto-discovery threshold: 0.55 (balance recall/precision)
- Visualization threshold: 0.60 (exploratory mode)
- Alert threshold: 0.75 (SLA escalation)
```

**Production Environment**:
```
- Auto-discovery threshold: 0.75 (high precision; minimize false positives)
- Visualization threshold: 0.75 (trusted lineage only)
- Alert threshold: 0.85 (critical SLAs)
```

**Compliance Context (GDPR/HIPAA)**:
```
- Minimum threshold: 0.75 (high confidence required)
- SAR (Subject Access Request) threshold: 0.85 (very high confidence)
- Purge/RTBF (Right to be Forgotten) threshold: 0.95 (definitive only)
```

### Selecting Your Threshold

**Decision Tree**:

```
START: Select threshold for your use case
  │
  ├─ Purpose: GDPR/HIPAA compliance?
  │  ├─ YES → Use 0.85-0.95 (high precision critical)
  │  └─ NO → Continue
  │
  ├─ Impact of False Positive?
  │  ├─ HIGH (SLA breach, regulatory violation) → 0.75-0.85
  │  ├─ MEDIUM (extra manual review) → 0.55-0.75
  │  └─ LOW (exploratory only) → 0.35-0.55
  │
  ├─ Required Precision:
  │  ├─ >95% → Use 0.85+
  │  ├─ >90% → Use 0.75+
  │  ├─ >80% → Use 0.60+
  │  └─ >70% → Use 0.50+
  │
  └─ DECISION: {threshold}
```

---

## Validation Methodology

### Step 1: Build Calibration Dataset

**Sample Size**: Minimum 1,000 relationship pairs  
**Composition**:
- 60% definitive (FK constraints) = 600
- 30% strong signals (column match, naming) = 300
- 10% weak signals (type only, statistical) = 100

**Sample Code (SQL)**:

```sql
-- Extract stratified sample from production
SELECT TOP 1000
    fk.parent_object_id,
    OBJECT_NAME(fk.parent_object_id) AS parent_table,
    fk.referenced_object_id,
    OBJECT_NAME(fk.referenced_object_id) AS referenced_table,
    1.0 AS ground_truth_label  -- FK = definitive
FROM sys.foreign_keys fk
UNION ALL
SELECT TOP 300
    t1.object_id,
    t1.name,
    t2.object_id,
    t2.name,
    0.8 AS ground_truth_label  -- Column name match
FROM sys.tables t1, sys.tables t2
CROSS APPLY (
    SELECT c1.name, c2.name
    FROM sys.columns c1
    INNER JOIN sys.columns c2 ON c1.name = c2.name
    WHERE c1.object_id = t1.object_id AND c2.object_id = t2.object_id
) matched
ORDER BY NEWID();
```

### Step 2: Manual Labeling

**For each relationship pair**, human expert annotates:

| Field | Options | Notes |
|-------|---------|-------|
| **Ground Truth** | TRUE / FALSE / UNCERTAIN | Is this actually a relationship? |
| **Relationship Type** | PK-FK, Reverse Lookup, M2M, ETL, etc. | Classification |
| **Confidence** | 0.0-1.0 | Domain expert's subjective confidence |
| **Notes** | Free text | Context/exceptions |

**Example Annotation**:
```json
{
  "parent_table": "Customers",
  "child_table": "Orders",
  "child_column": "customer_id",
  "ground_truth": true,
  "relationship_type": "PK-FK",
  "confidence": 1.0,
  "reasoning": "FK constraint explicitly defined",
  "exception": null
}
```

### Step 3: Run Scorer on Calibration Set

```javascript
import { ConfidenceScoringEngine } from './services/confidenceScoring/scoringEngine.js';

const engine = new ConfidenceScoringEngine(dbService, logger);
const calibrationSet = await loadCalibrationDataset();
const metadata = await metadataService.extractDatabaseMetadata(config);

const predictions = await Promise.all(
  calibrationSet.map(item => 
    engine.scoreRelationship({
      childTable: item.child_table,
      childColumn: item.child_column,
      parentTable: item.parent_table,
      parentColumn: item.parent_column,
      metadata
    })
  )
);

// Save predictions for analysis
await saveCalibrationResults(predictions);
```

### Step 4: Calculate Metrics by Threshold

**Precision-Recall Analysis**:

```python
import numpy as np
from sklearn.metrics import precision_recall_curve, confusion_matrix

# Load predictions and ground truth
predictions = load_predictions()
ground_truth = load_ground_truth()

# Extract scores
pred_scores = [p['confidence_score'] for p in predictions]
true_labels = [gt['ground_truth'] for gt in ground_truth]

# Calculate metrics at each threshold
thresholds = np.arange(0.0, 1.05, 0.05)

results = []
for threshold in thresholds:
    pred_labels = [1 if score >= threshold else 0 for score in pred_scores]
    
    tn, fp, fn, tp = confusion_matrix(true_labels, pred_labels).ravel()
    
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
    
    results.append({
        'threshold': threshold,
        'precision': precision,
        'recall': recall,
        'f1': f1,
        'accuracy': (tp + tn) / len(true_labels),
        'true_positives': tp,
        'false_positives': fp,
        'false_negatives': fn
    })

# Print calibration table
for r in results:
    print(f"Threshold: {r['threshold']:.2f} | "
          f"Precision: {r['precision']:.2%} | "
          f"Recall: {r['recall']:.2%} | "
          f"F1: {r['f1']:.2%}")
```

**Example Output**:

```
Threshold: 0.35 | Precision: 75.3% | Recall: 98.5% | F1: 85.2%
Threshold: 0.45 | Precision: 82.1% | Recall: 95.2% | F1: 88.2%
Threshold: 0.55 | Precision: 87.5% | Recall: 89.3% | F1: 88.4%
Threshold: 0.65 | Precision: 91.2% | Recall: 82.1% | F1: 86.4%
Threshold: 0.75 | Precision: 95.1% | Recall: 74.3% | F1: 83.2%
Threshold: 0.85 | Precision: 98.2% | Recall: 62.5% | F1: 76.3%
Threshold: 0.95 | Precision: 99.8% | Recall: 48.2% | F1: 64.8%
```

### Step 5: Select Optimal Threshold

**Framework**:

| Business Goal | Metric | Target | Recommended Threshold |
|---------------|--------|--------|----------------------|
| Minimize false SLA escalations | Precision | >90% | **0.75** |
| Catch all real relationships | Recall | >90% | **0.50** |
| Balanced accuracy | F1 Score | Max | **0.55-0.60** |
| Compliance (GDPR/HIPAA) | Precision | >95% | **0.85** |
| Exploratory analysis | Tolerance | High | **0.35** |

---

## Common Patterns & Edge Cases

### Edge Case 1: Nullable Foreign Keys

**Pattern**:
```
Orders.manager_id (nullable) → Managers.id
```

**Challenges**:
- FK allows NULL (not all orders have manager)
- Score confidence: Should be 1.0 (constraint exists) but field optionality adds semantic ambiguity

**Solution**:
```javascript
// Adjust FK score if child is nullable
let fkScore = 1.0;
if (childColumnIsNullable && !parentColumnIsNullable) {
  fkScore = 0.95; // Slight reduction for optional FK
}
```

---

### Edge Case 2: Temporal/Bitemporal Relationships

**Pattern**:
```
Orders (as_of_date, created_date) vs  OrderHistory (effective_date, end_date)
```

**Challenges**:
- Rows don't match 1:1 (history has multiple versions)
- Cardinality-based scoring fails

**Solution**:
```javascript
// Detect SCD Type 2 and apply special cardinality logic
if (hasEffectiveDate && hasEndDate && hasCurrentFlag) {
  cardinalityScore = calculateTemporalCardinality(table1, table2);
  // Expected ratio: history.rows > source.rows (multiple versions)
}
```

---

### Edge Case 3: Many-to-Many Resolution

**Pattern**:
```
Orders →(M:M)→ Products via OrderProducts
```

**Challenges**:
- Direct name match suggests 1:1, but actually M:M
- Cardinality analysis: OrderProducts.rows >> Orders.rows * Products.rows (violates assumptions)

**Solution**:
```javascript
// Detect M:M bridges
if (columnCount === 3 && fkCount === 2 && noBusColumn) {
  relationshipType = 'Many-to-Many Bridge';
  confidence = 0.85; // Bridge tables highly reliable
}
```

---

### Edge Case 4: Circular Dependencies

**Pattern**:
```
A → B → C → A
```

**Challenges**:
- Indicates either:
  1. Data quality issue (shouldn't exist)
  2. Bidirectional relationship (application-handled)
  3. Slowly Changing Dimension with parent reference

**Solution**:
```javascript
// Detect cycles and flag for review
const cycles = graphBuilder.detectCycles(graph);
if (cycles.length > 0) {
  cycles.forEach(cycle => {
    logger.warn(`Circular dependency detected: ${cycle.join(' → ')}`);
    flagForManualReview(cycle);
  });
}
```

---

### Edge Case 5: Abbreviation Ambiguity

**Pattern**:
```
Could "cust_id" mean customer or custom?  
Could "ord_id" mean order or ordinal?
```

**Challenges**:
- String similarity alone insufficient
- Requires domain knowledge

**Solution**:
```javascript
// Use known abbreviations mapping + context
const abbreviations = {
  'cust': 'customer',    // 95% probability in retail
  'ord': 'order',        // 90% probability
  'emp': 'employee'      // 99% probability
};

// Apply context-specific thresholds
if (tableNameIncludes('order') && colNameIncludes('ord')) {
  confidence += 0.10;  // Context reinforces abbreviation
}
```

---

## Production Monitoring

### Scorecard Metrics

**Track Monthly**:

```sql
-- Lineage Scorecard
SELECT
    DATE_TRUNC('month', created_at) AS month,
    COUNT(*) AS total_relationships,
    SUM(CASE WHEN confidence_score >= 0.95 THEN 1 ELSE 0 END) AS definitive_count,
    SUM(CASE WHEN confidence_score BETWEEN 0.75 AND 0.95 THEN 1 ELSE 0 END) AS high_confidence_count,
    SUM(CASE WHEN confidence_score BETWEEN 0.55 AND 0.75 THEN 1 ELSE 0 END) AS medium_confidence_count,
    SUM(CASE WHEN confidence_score < 0.55 THEN 1 ELSE 0 END) AS low_confidence_count,
    AVG(confidence_score) AS avg_confidence,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY confidence_score) AS median_confidence
FROM lineage_relationships
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;
```

### Anomaly Detection

```javascript
// Alert if confidence distribution changes unexpectedly
const currentDistribution = calculateConfidenceDistribution();
const previousDistribution = loadPreviousDistribution();

const kolmogorovSmirnov = calculateKSStatistic(currentDistribution, previousDistribution);

if (kolmogorovSmirnov > THRESHOLD) {
  slack.alert(`
    Confidence distribution shifted unexpectedly!
    Previous median: ${previousDistribution.median.toFixed(2)}
    Current median: ${currentDistribution.median.toFixed(2)}
    KS Statistic: ${kolmogorovSmirnov.toFixed(3)}
  `);
}
```

### User Feedback Loop

```javascript
// Capture user corrections; retrain scoring model
app.post('/api/lineage/feedback', async (req, res) => {
  const { relationshipId, userCorrection, feedback } = req.body;

  // Log feedback
  await logFeedback({
    relationshipId,
    originalScore: req.body.originalScore,
    userCorrection,   // true/false
    feedback,
    timestamp: new Date(),
    userId: req.user.id
  });

  // Trigger retraining if feedback diverges significantly
  const divergence = calculateDivergence(req.body.originalScore, userCorrection);
  if (divergence > THRESHOLD) {
    triggerScorerRetraining();
  }

  res.json({ success: true });
});
```

---

## Appendix: Reference Scoring Checklist

### Pre-Scoring Checklist

- [ ] Metadata extracted and cached (tables, columns, constraints)
- [ ] FK constraints loaded from system catalog
- [ ] Row counts/cardinality available (or can be sampled)
- [ ] Table & column names normalized (casing, whitespace)
- [ ] Data types standardized across databases
- [ ] Known abbreviations dictionary loaded
- [ ] Schema information available
- [ ] Extended properties/comments available

### Post-Scoring Checklist

- [ ] Score distribution analyzed (median, percentiles, outliers)
- [ ] Conflicting signals flagged (e.g., 0.2 + 0.85)
- [ ] Cycles detected and reported
- [ ] Orphan tables identified
- [ ] Threshold selected based on use case
- [ ] Results validated against sample
- [ ] Edge cases documented
- [ ] Performance metrics recorded (scoring time, memory)

---

**Document Version**: 1.0  
**Last Updated**: May 2026  
**Maintained By**: Data Governance Team  
**Next Review**: August 2026

