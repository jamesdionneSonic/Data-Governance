# Lineage Detection Implementation Guide

**Version**: 1.0  
**Framework**: Node.js (Express) + SQL Server/PostgreSQL/BigQuery  
**Status**: Production-Ready Patterns

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Core Scoring Engine](#core-scoring-engine)
3. [Metadata Extraction Layer](#metadata-extraction-layer)
4. [Relationship Detection Algorithms](#relationship-detection-algorithms)
5. [Graph Construction & Traversal](#graph-construction--traversal)
6. [Governance Mapping](#governance-mapping)
7. [Performance Optimization](#performance-optimization)
8. [Testing & Validation](#testing--validation)

---

## Quick Start

### Installation

```bash
npm install
# Additional dependencies (if not already installed)
npm install pgvector pg minio aws-sdk google-cloud-bigquery
```

### Project Structure

```
src/
├── services/
│   ├── confidenceScoring/
│   │   ├── scoringEngine.js
│   │   ├── methodScorers/
│   │   │   ├── fkConstraintScorer.js
│   │   │   ├── columnMatchScorer.js
│   │   │   ├── namingConventionScorer.js
│   │   │   ├── etlPatternScorer.js
│   │   │   └── cardinalityScorer.js
│   │   └── aggregator.js
│   ├── metadata/
│   │   ├── extractionService.js
│   │   ├── extractors/
│   │   │   ├── sqlServerExtractor.js
│   │   │   ├── postgresExtractor.js
│   │   │   └── bigQueryExtractor.js
│   │   └── metadataCache.js
│   ├── lineage/
│   │   ├── graphBuilder.js
│   │   ├── graphTraversal.js
│   │   ├── cycleDetector.js
│   │   └── impactAnalyzer.js
│   ├── governance/
│   │   ├── classificationMapper.js
│   │   ├── policyEngine.js
│   │   └── auditLogger.js
│   └── relationship/
│       ├── detectionEngine.js
│       └── relationshipTypes/
│           ├── directFk.js
│           ├── reverseLookup.js
│           ├── compositeKey.js
│           ├── selfJoin.js
│           ├── manyToMany.js
│           ├── etlPipeline.js
│           ├── scdType2.js
│           └── stagingPattern.js
├── models/
│   ├── Relationship.js
│   ├── Lineage.js
│   ├── Metadata.js
│   └── ConfidenceScore.js
├── utils/
│   ├── stringDistance.js
│   ├── patternMatcher.js
│   ├── cardinalityAnalyzer.js
│   └── logger.js
├── api/
│   ├── lineage.js
│   └── governance.js
└── cache/
    └── redisCache.js
```

---

## Core Scoring Engine

### Main Scoring Service

**File**: `src/services/confidenceScoring/scoringEngine.js`

```javascript
import { FKConstraintScorer } from './methodScorers/fkConstraintScorer.js';
import { ColumnMatchScorer } from './methodScorers/columnMatchScorer.js';
import { NamingConventionScorer } from './methodScorers/namingConventionScorer.js';
import { ETLPatternScorer } from './methodScorers/etlPatternScorer.js';
import { CardinalitySco rer } from './methodScorers/cardinalityScorer.js';
import { ScoreAggregator } from './aggregator.js';

export class ConfidenceScoringEngine {
  constructor(dbService, logger) {
    this.db = dbService;
    this.logger = logger;

    // Initialize individual scorers
    this.fkScorer = new FKConstraintScorer(dbService);
    this.columnScorer = new ColumnMatchScorer();
    this.namingScorer = new NamingConventionScorer();
    this.etlScorer = new ETLPatternScorer();
    this.cardinalityScorer = new CardinalityScorer(dbService);

    this.aggregator = new ScoreAggregator();
  }

  /**
   * Score a potential relationship between two table columns
   * @param {object} params
   * @param {string} params.childTable - Parent referencing table
   * @param {string} params.childColumn - Column in parent
   * @param {string} params.parentTable - Referenced table
   * @param {string} params.parentColumn - Column in referenced table
   * @param {object} params.metadata - Table/column metadata cache
   * @returns {Promise<object>} Comprehensive scoring result
   */
  async scoreRelationship(params) {
    const {
      childTable,
      childColumn,
      parentTable,
      parentColumn,
      metadata
    } = params;

    const startTime = Date.now();
    const scores = [];

    try {
      // Tier 1: Definitive signals
      const fkScore = await this.fkScorer.score({
        childTable,
        childColumn,
        parentTable,
        parentColumn,
        metadata
      });
      if (fkScore) scores.push(fkScore);

      // Tier 2: Strong heuristics
      const columnScore = this.columnScorer.score({
        childColumn,
        parentColumn,
        childDataType: metadata.getColumnType(childTable, childColumn),
        parentDataType: metadata.getColumnType(parentTable, parentColumn),
        childNullable: metadata.isColumnNullable(childTable, childColumn),
        parentNullable: metadata.isColumnNullable(parentTable, parentColumn)
      });
      if (columnScore) scores.push(columnScore);

      const namingScore = this.namingScorer.score({
        childTable,
        parentTable,
        childColumn,
        parentColumn
      });
      if (namingScore) scores.push(namingScore);

      // Tier 3: Moderate heuristics
      const etlScore = this.etlScorer.score({
        childTable,
        parentTable,
        metadata
      });
      if (etlScore) scores.push(etlScore);

      const cardinalityScore = await this.cardinalityScorer.score({
        childTable,
        parentTable,
        metadata
      });
      if (cardinalityScore) scores.push(cardinalityScore);

      // Aggregate and validate
      const aggregatedScore = this.aggregator.aggregate(scores);

      this.logger.debug(`Scored ${childTable}.${childColumn} → ${parentTable}.${parentColumn}`, {
        confidence: aggregatedScore.confidence_score,
        methods: aggregatedScore.methods_detected.map(m => m.method),
        durationMs: Date.now() - startTime
      });

      return aggregatedScore;
    } catch (error) {
      this.logger.error(
        `Error scoring relationship ${childTable}.${childColumn} → ${parentTable}.${parentColumn}`,
        error
      );
      return null;
    }
  }

  /**
   * Batch score multiple relationships
   * @param {array} relationships - Array of {childTable, childColumn, parentTable, parentColumn}
   * @param {object} metadata - Metadata cache
   * @returns {Promise<array>} Array of scored relationships
   */
  async scoreRelationshipBatch(relationships, metadata) {
    const batchSize = 100;
    const scored = [];

    for (let i = 0; i < relationships.length; i += batchSize) {
      const batch = relationships.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(rel => this.scoreRelationship({...rel, metadata}))
      );
      scored.push(...batchResults.filter(r => r !== null));
    }

    return scored;
  }

  /**
   * Score to recommendation mapping
   */
  scoreToRecommendation(confidence) {
    if (confidence >= 0.95) return 'DEFINITIVE';
    if (confidence >= 0.75) return 'HIGH_CONFIDENCE';
    if (confidence >= 0.55) return 'MEDIUM_CONFIDENCE';
    if (confidence >= 0.35) return 'LOW_CONFIDENCE_REVIEW_REQUIRED';
    return 'INSUFFICIENT_EVIDENCE';
  }
}
```

### Score Aggregator

**File**: `src/services/confidenceScoring/aggregator.js`

```javascript
export class ScoreAggregator {
  /**
   * Aggregate multiple scoring signals into single confidence score
   * Strategy: Take MAX of all scores (conservative - require strongest evidence)
   * Alternative: Weighted average based on signal reliability
   */
  aggregate(scores) {
    if (!scores || scores.length === 0) {
      return {
        confidence_score: 0,
        methods_detected: [],
        reasoning: 'No scoring signals detected'
      };
    }

    // Filter out null scores
    const validScores = scores.filter(s => s && s.confidence_score !== null);

    if (validScores.length === 0) {
      return {
        confidence_score: 0,
        methods_detected: [],
        reasoning: 'No valid scoring signals'
      };
    }

    // Strategy 1: MAX (conservative - take strongest evidence)
    const primaryScore = Math.max(...validScores.map(s => s.confidence_score));
    const primaryMethod = validScores.find(s => s.confidence_score === primaryScore);

    // Strategy 2: Sort by strength (for reporting)
    const sortedScores = validScores.sort((a, b) => b.confidence_score - a.confidence_score);

    // Strategy 3: Flag conflicts (e.g., 0.2 + 0.9 = potential ambiguity)
    const scoreRange = validScores.map(s => s.confidence_score);
    const hasConflict = Math.max(...scoreRange) - Math.min(...scoreRange) > 0.5;

    return {
      confidence_score: primaryScore,
      recommendation: this.scoreToRecommendation(primaryScore),
      methods_detected: sortedScores,
      has_conflicting_signals: hasConflict,
      signal_count: validScores.length,
      reasoning: this.generateReasoning(sortedScores, hasConflict)
    };
  }

  /**
   * Weighted aggregation (alternative strategy)
   * Assigns higher weight to definitive methods
   */
  aggregateWeighted(scores) {
    const weights = {
      'PK-FK Constraint': 1.0,
      'Named FK Constraint': 0.95,
      'Exact Column Name Match': 0.8,
      'Semantic Name Match': 0.7,
      'Naming Convention Pattern': 0.6,
      'ETL Pattern (Staging)': 0.65,
      'SCD Type 2': 0.75,
      'Schema Grouping': 0.4,
      'Cardinality Pattern': 0.35,
      'Type + Nullability': 0.2
    };

    let weightedSum = 0;
    let weightSum = 0;

    for (const score of scores) {
      const weight = weights[score.method] || 0.5;
      weightedSum += score.confidence_score * weight;
      weightSum += weight;
    }

    const finalScore = weightSum > 0 ? weightedSum / weightSum : 0;

    return {
      confidence_score: finalScore,
      methods_detected: scores,
      aggregation_strategy: 'weighted_average'
    };
  }

  generateReasoning(sortedScores, hasConflict) {
    const topReasons = sortedScores.slice(0, 3).map(s => 
      `${s.method} (${(s.confidence_score * 100).toFixed(0)}%)`
    ).join(', ');

    let reasoning = `Based on: ${topReasons}`;
    if (hasConflict) {
      reasoning += '. WARNING: Conflicting signals detected - manual review recommended.';
    }

    return reasoning;
  }

  scoreToRecommendation(confidence) {
    if (confidence >= 0.95) return 'DEFINITIVE';
    if (confidence >= 0.75) return 'HIGH_CONFIDENCE';
    if (confidence >= 0.55) return 'MEDIUM_CONFIDENCE';
    if (confidence >= 0.35) return 'LOW_CONFIDENCE_REVIEW_REQUIRED';
    return 'INSUFFICIENT_EVIDENCE';
  }
}
```

---

## Metadata Extraction Layer

### Extraction Service

**File**: `src/services/metadata/extractionService.js`

```javascript
import { SQLServerExtractor } from './extractors/sqlServerExtractor.js';
import { PostgresExtractor } from './extractors/postgresExtractor.js';
import { BigQueryExtractor } from './extractors/bigQueryExtractor.js';
import { MetadataCache } from './metadataCache.js';

export class MetadataExtractionService {
  constructor(logger) {
    this.logger = logger;
    this.extractors = {
      'sqlserver': new SQLServerExtractor(),
      'postgres': new PostgresExtractor(),
      'bigquery': new BigQueryExtractor()
    };
    this.cache = new MetadataCache();
  }

  /**
   * Extract complete database metadata
   */
  async extractDatabaseMetadata(connectionConfig, dbType, forceRefresh = false) {
    const cacheKey = `metadata:${connectionConfig.host}:${connectionConfig.database}`;

    // Check cache first
    if (!forceRefresh) {
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }

    const extractor = this.extractors[dbType];
    if (!extractor) {
      throw new Error(`Unsupported database type: ${dbType}`);
    }

    this.logger.info(`Extracting metadata from ${dbType}...`);

    const metadata = await extractor.extract(connectionConfig);

    // Cache results (valid for 1 hour)
    this.cache.set(cacheKey, metadata, 3600000);

    return metadata;
  }

  /**
   * Incremental extraction (only DDL changes)
   */
  async incrementalExtract(connectionConfig, dbType, lastExtractTime) {
    const extractor = this.extractors[dbType];
    return extractor.extractChanges(connectionConfig, lastExtractTime);
  }

  /**
   * Extract cardinality statistics
   */
  async extractCardinalities(connectionConfig, dbType, tables = null) {
    const extractor = this.extractors[dbType];
    return extractor.extractCardinalities(connectionConfig, tables);
  }
}
```

### SQL Server Extractor

**File**: `src/services/metadata/extractors/sqlServerExtractor.js`

```javascript
import { Connection } from 'tedious';

export class SQLServerExtractor {
  async extract(config) {
    const conn = this.createConnection(config);

    return {
      tables: await this.extractTables(conn),
      columns: await this.extractColumns(conn),
      foreignKeys: await this.extractForeignKeys(conn),
      indexes: await this.extractIndexes(conn),
      constraints: await this.extractConstraints(conn),
      statistics: await this.extractStatistics(conn),
      extractedAt: new Date()
    };
  }

  async extractTables(conn) {
    const query = `
      SELECT 
        s.name AS schema_name,
        t.name AS table_name,
        t.object_id,
        t.create_date,
        t.modify_date,
        (SELECT COUNT(*) FROM sys.columns WHERE object_id = t.object_id) AS column_count
      FROM 
        sys.tables t
        INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
      WHERE 
        s.name NOT IN ('sys', 'INFORMATION_SCHEMA')
      ORDER BY 
        s.name, t.name;
    `;

    return this.executeQuery(conn, query);
  }

  async extractColumns(conn) {
    const query = `
      SELECT 
        s.name AS schema_name,
        t.name AS table_name,
        c.name AS column_name,
        c.column_id,
        TYPE_NAME(c.user_type_id) AS data_type,
        c.max_length,
        c.precision,
        c.scale,
        c.is_nullable,
        c.is_identity,
        dc.definition AS default_value
      FROM 
        sys.columns c
        INNER JOIN sys.tables t ON c.object_id = t.object_id
        INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
        LEFT JOIN sys.default_constraints dc ON c.object_id = dc.parent_object_id
          AND c.column_id = dc.parent_column_id
      WHERE 
        s.name NOT IN ('sys', 'INFORMATION_SCHEMA')
      ORDER BY 
        s.name, t.name, c.column_id;
    `;

    return this.executeQuery(conn, query);
  }

  async extractForeignKeys(conn) {
    const query = `
      SELECT 
        s_child.name AS child_schema,
        t_child.name AS child_table,
        c_child.name AS child_column,
        s_parent.name AS parent_schema,
        t_parent.name AS parent_table,
        c_parent.name AS parent_column,
        fk.name AS constraint_name,
        fk.object_id AS fk_object_id,
        fkc.constraint_column_id
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
        s_child.name NOT IN ('sys', 'INFORMATION_SCHEMA')
      ORDER BY 
        child_schema, child_table, parent_table;
    `;

    return this.executeQuery(conn, query);
  }

  async extractIndexes(conn) {
    const query = `
      SELECT 
        s.name AS schema_name,
        t.name AS table_name,
        i.name AS index_name,
        c.name AS column_name,
        i.is_unique,
        i.is_primary_key,
        ic.is_descending_key,
        ic.key_ordinal
      FROM 
        sys.indexes i
        INNER JOIN sys.index_columns ic ON i.object_id = ic.object_id
          AND i.index_id = ic.index_id
        INNER JOIN sys.columns c ON ic.object_id = c.object_id
          AND ic.column_id = c.column_id
        INNER JOIN sys.tables t ON i.object_id = t.object_id
        INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
      WHERE 
        s.name NOT IN ('sys', 'INFORMATION_SCHEMA')
        AND ic.index_column_id > 0
      ORDER BY 
        schema_name, table_name, index_name, ic.key_ordinal;
    `;

    return this.executeQuery(conn, query);
  }

  async extractStatistics(conn) {
    const query = `
      SELECT 
        s.name AS schema_name,
        t.name AS table_name,
        p.rows AS row_count,
        (
          SELECT SUM(ps.used_page_count * 8096)
          FROM sys.dm_db_partition_stats ps
          WHERE ps.object_id = t.object_id
        ) AS size_bytes,
        t.modify_date
      FROM 
        sys.tables t
        INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
        INNER JOIN sys.partitions p ON t.object_id = p.object_id
          AND p.index_id IN (0, 1)
      WHERE 
        s.name NOT IN ('sys', 'INFORMATION_SCHEMA')
      GROUP BY 
        s.name, t.name, p.rows, t.object_id, t.modify_date;
    `;

    return this.executeQuery(conn, query);
  }

  async extractConstraints(conn) {
    const query = `
      SELECT 
        s.name AS schema_name,
        t.name AS table_name,
        c.name AS constraint_name,
        c.type,
        CASE 
          WHEN c.type = 'PK' THEN 'PRIMARY KEY'
          WHEN c.type = 'UQ' THEN 'UNIQUE KEY'
          WHEN c.type = 'FK' THEN 'FOREIGN KEY'
          WHEN c.type = 'C' THEN 'CHECK'
          ELSE 'UNKNOWN'
        END AS constraint_type
      FROM 
        sys.key_constraints c
        INNER JOIN sys.tables t ON c.parent_object_id = t.object_id
        INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
      WHERE 
        s.name NOT IN ('sys', 'INFORMATION_SCHEMA')
      ORDER BY 
        schema_name, table_name, constraint_name;
    `;

    return this.executeQuery(conn, query);
  }

  createConnection(config) {
    return new Connection({
      server: config.host,
      authentication: {
        type: 'default',
        options: {
          userName: config.username,
          password: config.password
        }
      },
      options: {
        database: config.database,
        trustServerCertificate: true
      }
    });
  }

  async executeQuery(conn, query) {
    return new Promise((resolve, reject) => {
      const results = [];

      conn.connect(err => {
        if (err) reject(err);

        const request = new Request(query, (err, rowCount) => {
          if (err) reject(err);
          conn.close();
          resolve(results);
        });

        request.on('row', columns => {
          const row = {};
          columns.forEach(col => {
            row[col.metadata.colName] = col.value;
          });
          results.push(row);
        });

        conn.execSql(request);
      });
    });
  }
}
```

---

## Relationship Detection Algorithms

### Column Name Matcher

**File**: `src/services/confidenceScoring/methodScorers/columnMatchScorer.js`

```javascript
import { levenshteinDistance } from '../../../utils/stringDistance.js';

export class ColumnMatchScorer {
  /**
   * Score based on column name similarity
   * Strategy: Exact match = 0.8, Semantic ≈ 0.7
   */
  score(params) {
    const {
      childColumn,
      parentColumn,
      childDataType,
      parentDataType,
      childNullable,
      parentNullable
    } = params;

    // Exact match
    if (childColumn.toLowerCase() === parentColumn.toLowerCase()) {
      let score = 0.8;

      // Adjust based on data type match
      if (childDataType === parentDataType) {
        // Already factored
      }

      // Reduce if child is nullable (FKs usually NOT nullable)
      if (childNullable && !parentNullable) {
        score -= 0.05;
      }

      return {
        method: 'Exact Column Name Match',
        confidence_score: score,
        details: {
          childColumn,
          parentColumn,
          typeMatch: childDataType === parentDataType,
          nullableChild: childNullable,
          nullableParent: parentNullable
        }
      };
    }

    // Semantic similarity (abbreviations, casing)
    const similarity = this.calculateSemanticSimilarity(childColumn, parentColumn);

    if (similarity > 0.65) {
      return {
        method: 'Semantic Column Name Match',
        confidence_score: 0.7 * similarity,
        details: {
          childColumn,
          parentColumn,
          similarity: (similarity * 100).toFixed(0) + '%',
          typeMatch: childDataType === parentDataType
        }
      };
    }

    return null;
  }

  /**
   *Calculate semantic similarity accounting for:
   * - Abbreviations (cust → customer)
   * - Casing differences
   * - Underscores vs camelCase
   */
  calculateSemanticSimilarity(col1, col2) {
    // Normalize both columns
    const norm1 = this.normalize(col1);
    const norm2 = this.normalize(col2);

    // Exact match after normalization
    if (norm1 === norm2) return 1.0;

    // Levenshtein distance (0 = identical, higher = more different)
    const distance = levenshteinDistance(norm1, norm2);
    const maxLength = Math.max(norm1.length, norm2.length);
    const similarity = 1 - (distance / maxLength);

    return Math.max(0, similarity);
  }

  normalize(columnName) {
    return columnName
      .toLowerCase()
      .replace(/[_-]/g, '') // Remove separators
      .replace(/([a-z])([A-Z])/g, '$1$2') // Handle camelCase
      .toLowerCase();
  }

  /**
   * Known abbreviations mapping
   */
  knownAbbreviations = {
    'cust': 'customer',
    'emp': 'employee',
    'prod': 'product',
    'ord': 'order',
    'invent': 'inventory',
    'cat': 'category',
    'dept': 'department',
    'mgr': 'manager',
    'qty': 'quantity',
    'amt': 'amount',
    'num': 'number',
    'id': 'identifier',
    'pk': 'primary_key',
    'fk': 'foreign_key'
  };
}
```

### Naming Convention Pattern Matcher

**File**: `src/services/confidenceScoring/methodScorers/namingConventionScorer.js`

```javascript
export class NamingConventionScorer {
  /**
   * Score based on naming convention patterns
   */
  score(params) {
    const { childTable, parentTable, childColumn, parentColumn } = params;

    const patterns = [
      this.checkIdSuffix(childTable, parentTable, childColumn, parentColumn),
      this.checkTablePrefixPattern(childTable, parentTable, childColumn, parentColumn),
      this.checkAbbreviationMapping(childTable, parentTable, childColumn, parentColumn)
    ];

    const validPatterns = patterns.filter(p => p !== null && p.confidence_score > 0);

    if (validPatterns.length === 0) return null;

    // Return highest confidence pattern
    return validPatterns.reduce((a, b) => 
      a.confidence_score > b.confidence_score ? a : b
    );
  }

  /**
   * Pattern: {table}_id → {table}.id
   * E.g., customer_id → customers.id
   */
  checkIdSuffix(childTable, parentTable, childColumn, parentColumn) {
    const childTableBase = childTable.replace(/s$/, ''); // Remove trailing 's'
    const childColumnBase = childColumn.replace(/_id$/, '').replace(/_pk$/, '');

    if (
      childColumnBase === childTableBase &&
      (parentColumn === 'id' || parentColumn === childTableBase + '_id')
    ) {
      return {
        method: 'Naming Convention: {table}_id Pattern',
        confidence_score: 0.75,
        pattern: `${childColumn} (from ${childTable}) → ${parentTable}.${parentColumn}`
      };
    }

    return null;
  }

  /**
   * Pattern: Table prefixes indicate relationships
   * E.g., order_item → order (both start with 'order')
   */
  checkTablePrefixPattern(childTable, parentTable, childColumn, parentColumn) {
    const childPrefix = childTable.split('_')[0].toLowerCase();
    const parentPrefix = parentTable.split('_')[0].toLowerCase();

    // Check if parent table matches child column prefix
    if (
      childColumn.toLowerCase().startsWith(parentPrefix + '_') &&
      (parentColumn === 'id' || parentColumn === parentPrefix + '_id' || 
       parentColumn === parentPrefix + '_pk')
    ) {
      return {
        method: 'Naming Convention: Table Prefix Match',
        confidence_score: 0.65,
        pattern: `${childTable}.${childColumn} → ${parentTable} (prefix: ${parentPrefix})`
      };
    }

    return null;
  }

  /**
   * Pattern: Known abbreviation mappings
   */
  checkAbbreviationMapping(childTable, parentTable, childColumn, parentColumn) {
    const abbreviations = {
      'cust': 'customer',
      'emp': 'employee',
      'prod': 'product',
      'ord': 'order'
    };

    for (const [abbr, full] of Object.entries(abbreviations)) {
      if (
        childColumn.toLowerCase().includes(abbr) &&
        parentTable.toLowerCase().includes(full)
      ) {
        return {
          method: 'Naming Convention: Abbreviation Match',
          confidence_score: 0.60,
          pattern: `${abbr} → ${full}`,
          mappings: { abbr, full }
        };
      }
    }

    return null;
  }
}
```

### ETL Pattern Scorer

**File**: `src/services/confidenceScoring/methodScorers/etlPatternScorer.js`

```javascript
export class ETLPatternScorer {
  /**
   * Detect ETL pipeline patterns
   */
  score(params) {
    const { childTable, parentTable, metadata } = params;

    return (
      this.detectStagingPattern(childTable, parentTable) ||
      this.detectHistoryPattern(childTable, parentTable) ||
      this.detectAuditPattern(childTable, parentTable) ||
      this.detectCDCPattern(childTable, parentTable) ||
      this.detectSCDType2Pattern(childTable, metadata)
    );
  }

  /**
   * Pattern: stg_* staging tables
   * stg_customers (staging) → customers (production)
   */
  detectStagingPattern(sourceTable, targetTable) {
    if (sourceTable.startsWith('stg_')) {
      const baseName = sourceTable.substring(4); // Remove 'stg_' prefix

      if (
        targetTable === baseName ||
        targetTable === baseName.replace(/s$/, '') || // Remove trailing s
        targetTable.includes(baseName)
      ) {
        return {
          method: 'ETL Pattern: Staging Table',
          confidence_score: 0.65,
          pattern: 'Staging → Production',
          details: {
            stagingTable: sourceTable,
            productionTable: targetTable
          }
        };
      }
    }

    return null;
  }

  /**
   * Pattern: History/audit tables
   * customers_history, customers_audit
   */
  detectHistoryPattern(sourceTable, targetTable) {
    const historyPatterns = ['_history', '_hist', '_audit', '_archive', '_version'];

    for (const pattern of historyPatterns) {
      if (targetTable.endsWith(pattern)) {
        const baseTable = targetTable.substring(0, targetTable.length - pattern.length);
        if (sourceTable === baseTable) {
          return {
            method: 'ETL Pattern: History/Audit Table',
            confidence_score: 0.70,
            pattern: `${pattern} pattern`,
            details: {
              sourceTable,
              historyTable: targetTable
            }
          };
        }
      }
    }

    return null;
  }

  /**
   * Pattern: CDC (Change Data Capture)
   * orders_cdc, cdc_orders
   */
  detectCDCPattern(sourceTable, targetTable) {
    const cdcPatterns = ['_cdc', 'cdc_'];

    for (const pattern of cdcPatterns) {
      if (
        (targetTable.includes(pattern) && sourceTable === targetTable.replace(pattern, '')) ||
        (sourceTable.includes(pattern) && targetTable === sourceTable.replace(pattern, ''))
      ) {
        return {
          method: 'ETL Pattern: CDC',
          confidence_score: 0.75,
          pattern: 'Change Data Capture',
          details: {
            sourceTable,
            cdcTable: pattern.includes('_') && pattern.startsWith('_') ? targetTable : sourceTable
          }
        };
      }
    }

    return null;
  }

  /**
   * Pattern: SCD Type 2 (Slowly Changing Dimension)
   * dim_product_scd2, or same table with effective_date, end_date, is_current
   */
  detectSCDType2Pattern(table, metadata) {
    const columns = metadata.getTableColumns(table);

    if (!columns) return null;

    const columnNames = columns.map(c => c.name.toLowerCase());

    // Check for SCD2 markers
    const hasEffectiveDate = columnNames.some(c => 
      c === 'effective_date' || c === 'valid_from' || c === 'start_date'
    );
    const hasEndDate = columnNames.some(c => 
      c === 'end_date' || c === 'valid_to' || c === 'expiry_date'
    );
    const hasCurrentFlag = columnNames.some(c => 
      c === 'is_current' || c === 'current_flag' || c === 'active_flag'
    );

    if (hasEffectiveDate && hasEndDate && hasCurrentFlag) {
      return {
        method: 'ETL Pattern: SCD Type 2',
        confidence_score: 0.75,
        pattern: 'Slowly Changing Dimension (Type 2)',
        details: {
          table,
          markers: ['effective_date', 'end_date', 'is_current']
        }
      };
    }

    return null;
  }
}
```

---

## Graph Construction & Traversal

### Graph Builder

**File**: `src/services/lineage/graphBuilder.js`

```javascript
export class LineageGraphBuilder {
  constructor(logger) {
    this.logger = logger;
  }

  /**
   * Build lineage graph from scored relationships
   */
  buildGraph(relationships, confidenceThreshold = 0.5) {
    const nodes = new Map(); // objectId → {name, schema, type, ...}
    const edges = new Map(); // `${source}→${target}` → {score, methods, ...}

    // Extract unique nodes
    for (const rel of relationships) {
      if (rel.confidence_score >= confidenceThreshold) {
        const sourceId = `${rel.parent_schema}.${rel.parent_table}`;
        const targetId = `${rel.child_schema}.${rel.child_table}`;

        if (!nodes.has(sourceId)) {
          nodes.set(sourceId, {
            id: sourceId,
            name: rel.parent_table,
            schema: rel.parent_schema,
            type: 'table',
            inDegree: 0,
            outDegree: 0
          });
        }

        if (!nodes.has(targetId)) {
          nodes.set(targetId, {
            id: targetId,
            name: rel.child_table,
            schema: rel.child_schema,
            type: 'table',
            inDegree: 0,
            outDegree: 0
          });
        }

        // Add edge (source → target means target depends on source)
        const edgeKey = `${sourceId}→${targetId}`;
        edges.set(edgeKey, {
          source: sourceId,
          target: targetId,
          confidence: rel.confidence_score,
          methods: rel.methods_detected,
          label: rel.relationship_type || 'depends_on'
        });

        // Update degrees
        nodes.get(sourceId).outDegree++;
        nodes.get(targetId).inDegree++;
      }
    }

    return {
      nodes: Array.from(nodes.values()),
      edges: Array.from(edges.values()),
      nodeCount: nodes.size,
      edgeCount: edges.size,
      createdAt: new Date()
    };
  }

  /**
   * Detect cycles in graph (potential data quality issues)
   */
  detectCycles(graph) {
    const visited = new Set();
    const recursionStack = new Set();
    const cycles = [];

    const buildAdjacencyList = () => {
      const adj = new Map();
      for (const node of graph.nodes) {
        adj.set(node.id, []);
      }
      for (const edge of graph.edges) {
        adj.get(edge.source).push(edge.target);
      }
      return adj;
    };

    const dfs = (nodeId, path) => {
      visited.add(nodeId);
      recursionStack.add(nodeId);
      path.push(nodeId);

      for (const neighbor of adj.get(nodeId) || []) {
        if (recursionStack.has(neighbor)) {
          // Cycle detected
          const cycleStart = path.indexOf(neighbor);
          const cycle = path.slice(cycleStart).concat(neighbor);
          cycles.push(cycle);
        } else if (!visited.has(neighbor)) {
          dfs(neighbor, [...path]);
        }
      }

      recursionStack.delete(nodeId);
    };

    const adj = buildAdjacencyList();
    for (const node of graph.nodes) {
      if (!visited.has(node.id)) {
        dfs(node.id, []);
      }
    }

    return {
      hasCycles: cycles.length > 0,
      cycles,
      cycleCount: cycles.length
    };
  }
}
```

### Graph Traversal

**File**: `src/services/lineage/graphTraversal.js`

```javascript
export class GraphTraversal {
  /**
   * Get all upstream dependencies (things this table depends on)
   */
  getUpstreamDependencies(tableId, graph, maxDepth = 10) {
    const upstream = new Map(); // tableId → {distance, path, confidence}
    const visited = new Set();
    const queue = [{id: tableId, distance: 0, path: [tableId], avgConfidence: 1.0}];

    while (queue.length > 0) {
      const {id, distance, path, avgConfidence} = queue.shift();

      if (visited.has(id) || distance >= maxDepth) continue;
      visited.add(id);

      // Find all edges where this node is the target
      for (const edge of graph.edges) {
        if (edge.target === id) {
          const source = edge.source;
          const newDistance = distance + 1;
          const newConfidenceAvg = (avgConfidence + edge.confidence) / 2;

          if (!upstream.has(source)) {
            upstream.set(source, {
              distance: newDistance,
              path: [...path, source],
              avgConfidence: newConfidenceAvg,
              directConfidence: edge.confidence
            });

            if (newDistance < maxDepth) {
              queue.push({
                id: source,
                distance: newDistance,
                path: [...path, source],
                avgConfidence: newConfidenceAvg
              });
            }
          }
        }
      }
    }

    return Array.from(upstream.entries()).map(([id, data]) => ({
      tableId: id,
      ...data
    }));
  }

  /**
   * Get all downstream dependents (things that depend on this table)
   */
  getDownstreamDependents(tableId, graph, maxDepth = 10) {
    const downstream = new Map();
    const visited = new Set();
    const queue = [{id: tableId, distance: 0, path: [tableId]}];

    while (queue.length > 0) {
      const {id, distance, path} = queue.shift();

      if (visited.has(id) || distance >= maxDepth) continue;
      visited.add(id);

      // Find all edges where this node is the source
      for (const edge of graph.edges) {
        if (edge.source === id) {
          const target = edge.target;
          const newDistance = distance + 1;

          if (!downstream.has(target)) {
            downstream.set(target, {
              distance: newDistance,
              path: [...path, target],
              confidence: edge.confidence
            });

            if (newDistance < maxDepth) {
              queue.push({
                id: target,
                distance: newDistance,
                path: [...path, target]
              });
            }
          }
        }
      }
    }

    return Array.from(downstream.entries()).map(([id, data]) => ({
      tableId: id,
      ...data
    }));
  }

  /**
   * Calculate impact radius (all tables within N hops)
   */
  getImpactRadius(tableId, graph, radius = 3) {
    const impactByRadius = {};

    for (let r = 1; r <= radius; r++) {
      impactByRadius[r] = [];
    }

    const downstream = this.getDownstreamDependents(tableId, graph, radius);

    for (const dependent of downstream) {
      if (dependent.distance <= radius) {
        impactByRadius[dependent.distance].push({
          tableId: dependent.tableId,
          confidence: dependent.confidence,
          path: dependent.path
        });
      }
    }

    return impactByRadius;
  }
}
```

---

## Governance Mapping

### Classification Mapper

**File**: `src/services/governance/classificationMapper.js`

```javascript
export class ClassificationMapper {
  /**
   * Map lineage relationships based on data classification
   */
  filterByClassification(lineage, userRole, userClearance) {
    const classificationHierarchy = {
      'PUBLIC': 0,
      'INTERNAL': 1,
      'CONFIDENTIAL': 2,
      'RESTRICTED': 3,
      'SECRET': 4
    };

    const roleClearance = {
      'public_user': 0,
      'authenticated_user': 1,
      'analyst': 2,
      'data_steward': 3,
      'executive': 4,
      'compliance_officer': 4
    };

    const userLevel = roleClearance[userRole] || 0;

    return lineage.filter(relationship => {
      const sourceLevel = classificationHierarchy[relationship.source.classification] || 0;
      const targetLevel = classificationHierarchy[relationship.target.classification] || 0;

      // User can see relationship if they have clearance for BOTH tables
      return sourceLevel <= userLevel && targetLevel <= userLevel;
    });
  }

  /**
   * Map lineage to compliance frameworks
   */
  mapToComplianceFramework(lineage, framework) {
    const complianceRules = {
      'GDPR': {
        marker: 'PII',
        requirements: ['data_subject_access', 'right_to_forget', 'data_minimization'],
        auditRequired: true,
        retention: '30_days'
      },
      'HIPAA': {
        marker: 'PHI',
        requirements: ['access_control', 'encryption', 'audit_logging'],
        auditRequired: true,
        retention: '6_years'
      },
      'SOX': {
        marker: 'FINANCIAL',
        requirements: ['change_control', 'segregation_of_duties'],
        auditRequired: true,
        retention: '7_years'
      },
      'CCPA': {
        marker: 'CA_RESIDENT_DATA',
        requirements: ['opt_out_tracking', 'sale_consent'],
        auditRequired: true,
        retention: '3_years'
      }
    };

    const rules = complianceRules[framework];
    if (!rules) return null;

    const filtered = lineage.filter(rel => 
      rel.source.tags?.includes(rules.marker) ||
      rel.target.tags?.includes(rules.marker)
    );

    return {
      framework,
      relationshipCount: filtered.length,
      relationships: filtered,
      complianceRequirements: rules.requirements,
      auditRequired: rules.auditRequired,
      retentionPolicy: rules.retention
    };
  }
}
```

---

## Performance Optimization

### Metadata Caching

**File**: `src/services/metadata/metadataCache.js`

```javascript
export class MetadataCache {
  constructor(ttlMs = 3600000) { // Default 1 hour
    this.cache = new Map();
    this.ttl = ttlMs;
  }

  set(key, value, ttlMs = null) {
    const ttl = ttlMs || this.ttl;
    const expiryTime = Date.now() + ttl;

    this.cache.set(key, {
      value,
      expiryTime
    });

    // Auto-evict after TTL
    setTimeout(() => this.cache.delete(key), ttl);
  }

  get(key) {
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (Date.now() > entry.expiryTime) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Batch cache operations
   */
  mget(keys) {
    return keys.map(key => this.get(key));
  }

  mset(entries) {
    for (const [key, value] of Object.entries(entries)) {
      this.set(key, value);
    }
  }

  clear() {
    this.cache.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}
```

### Batch Scoring with Worker Pool

**File**: `src/services/confidenceScoring/batchScorer.js`

```javascript
import { Worker } from 'worker_threads';
import path from 'path';

export class BatchScoringService {
  constructor(workerCount = 4) {
    this.workerCount = workerCount;
    this.workers = [];
    this.taskQueue = [];
    this.activeWorkers = 0;

    this.initializeWorkers();
  }

  initializeWorkers() {
    for (let i = 0; i < this.workerCount; i++) {
      const worker = new Worker(path.join(__dirname, 'scoringWorker.js'));
      worker.on('message', this.handleWorkerMessage.bind(this));
      worker.on('error', this.handleWorkerError.bind(this));
      this.workers.push(worker);
    }
  }

  /**
   * Score relationships in parallel
   */
  async scoreBatch(relationships, metadata) {
    const batches = [];
    const batchSize = Math.ceil(relationships.length / this.workerCount);

    for (let i = 0; i < relationships.length; i += batchSize) {
      const batch = relationships.slice(i, i + batchSize);
      batches.push(batch);
    }

    const results = await Promise.all(
      batches.map((batch, idx) => this.processWorkerBatch(batch, metadata, idx))
    );

    return results.flat();
  }

  processWorkerBatch(batch, metadata, workerIdx) {
    return new Promise((resolve, reject) => {
      const worker = this.workers[workerIdx % this.workerCount];

      worker.once('message', message => {
        if (message.error) reject(new Error(message.error));
        else resolve(message.results);
      });

      worker.postMessage({
        relationships: batch,
        metadata
      });
    });
  }

  handleWorkerMessage(message) {
    // Handle worker messages
  }

  handleWorkerError(error) {
    console.error('Worker error:', error);
  }

  terminate() {
    this.workers.forEach(w => w.terminate());
  }
}
```

---

## Testing & Validation

### Unit Tests

**File**: `tests/unit/confidenceScoring.test.js`

```javascript
import { ConfidenceScoringEngine } from '../../src/services/confidenceScoring/scoringEngine.js';
import { ColumnMatchScorer } from '../../src/services/confidenceScoring/methodScorers/columnMatchScorer.js';

describe('ConfidenceScoringEngine', () => {
  let engine;
  let mockDb;

  beforeEach(() => {
    mockDb = {
      getTableMetadata: jest.fn(),
      getColumnMetadata: jest.fn()
    };
    engine = new ConfidenceScoringEngine(mockDb, console);
  });

  describe('PK→FK Scoring', () => {
    it('should return 1.0 for definitive FK relationships', async () => {
      mockDb.getTableMetadata.mockResolvedValue({
        orders: { pk: ['id'] },
        customers: { pk: ['id'] }
      });

      const score = await engine.scoreRelationship({
        childTable: 'orders',
        childColumn: 'customer_id',
        parentTable: 'customers',
        parentColumn: 'id',
        metadata: mockDb
      });

      expect(score.confidence_score).toBe(1.0);
    });
  });

  describe('Column Name Scoring', () => {
    it('should score exact column name matches at 0.8', () => {
      const scorer = new ColumnMatchScorer();
      const score = scorer.score({
        childColumn: 'customer_id',
        parentColumn: 'customer_id',
        childDataType: 'INT',
        parentDataType: 'INT',
        childNullable: false,
        parentNullable: false
      });

      expect(score.confidence_score).toBe(0.8);
      expect(score.method).toBe('ExactColumnNameMatch');
    });

    it('should reduce score for nullable child columns', () => {
      const scorer = new ColumnMatchScorer();
      const score = scorer.score({
        childColumn: 'customer_id',
        parentColumn: 'customer_id',
        childDataType: 'INT',
        parentDataType: 'INT',
        childNullable: true,
        parentNullable: false
      });

      expect(score.confidence_score).toBe(0.75);
    });
  });

  describe('Semantic Similarity', () => {
    it('should handle abbreviation matching', () => {
      const scorer = new ColumnMatchScorer();
      const similarity = scorer.calculateSemanticSimilarity('customer_id', 'cust_id');

      expect(similarity).toBeGreaterThan(0.65);
    });
  });
});
```

### Integration Tests

**File**: `tests/integration/lineageGraph.test.js`

```javascript
import { buildLineageGraph } from '../../src/services/lineage/graphBuilder.js';
import { GraphTraversal } from '../../src/services/lineage/graphTraversal.js';

describe('Lineage Graph Integration', () => {
  let relationships;
  let graph;
  let traversal;

  beforeEach(() => {
    // Setup: E-commerce database
    relationships = [
      {
        parent_schema: 'production', parent_table: 'customers',
        child_schema: 'production', child_table: 'orders',
        confidence_score: 1.0
      },
      {
        parent_schema: 'production', parent_table: 'orders',
        child_schema: 'production', child_table: 'order_items',
        confidence_score: 1.0
      },
      {
        parent_schema: 'production', parent_table: 'products',
        child_schema: 'production', child_table: 'order_items',
        confidence_score: 0.95
      }
    ];

    const builder = new buildLineageGraph();
    graph = builder.buildGraph(relationships, 0.5);
    traversal = new GraphTraversal();
  });

  it('should find correct upstream dependencies', () => {
    const upstream = traversal.getUpstreamDependencies(
      'production.order_items', graph
    );

    const upstreamIds = upstream.map(u => u.tableId);
    expect(upstreamIds).toContain('production.orders');
    expect(upstreamIds).toContain('production.customers');
    expect(upstreamIds).toContain('production.products');
  });

  it('should calculate correct impact radius', () => {
    const impact = traversal.getImpactRadius('production.customers', graph, 2);

    expect(impact[1].length).toBeGreaterThan(0);
    expect(impact[1][0].tableId).toBe('production.orders');
  });
});
```

---

## Deployment Checklist

- [ ] Deploy extraction service with metadata caching
- [ ] Configure thresholds per environment (dev/staging/prod)
- [ ] Import historical relationships for calibration
- [ ] Train confidence scorer on validation set (1000+ examples)
- [ ] Set up incremental extraction scheduling
- [ ] Configure audit logging for lineage changes
- [ ] Implement governance policy enforcement
- [ ] Set up monitoring/alerting for anomalies
- [ ] Document API endpoints in OpenAPI spec
- [ ] Create user documentation

---

**Document Version**: 1.0  
**Last Updated**: May 2026  
**Maintained By**: Engineering Team

