---
name: {{name}}
database: {{database}}
type: {{type}}
schema: {{schema}}
owner: {{owner}}
steward: {{steward}}
domain_manager: {{domain_manager}}
custodian: {{custodian}}
sensitivity: {{sensitivity}}
tags:
  - {{tag_1}}
  - {{tag_2}}
depends_on: {{depends_on}}
reads_from: {{reads_from}}
writes_to: {{writes_to}}
calls: {{calls}}
called_by: {{called_by}}
row_count: {{row_count}}
size_kb: {{size_kb}}
column_count: {{column_count}}
index_count: {{index_count}}
check_constraint_count: {{check_constraint_count}}
edge_count: {{edge_count}}
edge_quality_score: {{edge_quality_score}}
lineage_confidence: {{lineage_confidence}}
lineage_strategy: {{lineage_strategy}}
lineage_pattern_class: {{lineage_pattern_class}}
lineage_source: {{lineage_source}}
lineage_source_path: {{lineage_source_path}}
lineage_evidence_hash: {{lineage_evidence_hash}}
extraction_warnings:
  - {{extraction_warning_1}}
  - {{extraction_warning_2}}
  - {{extraction_warning_3}}
extracted_at: {{extracted_at}}
last_updated: {{last_updated}}
---

## Overview

Metadata auto-extracted from source systems.

## Lineage Summary

- **Edge Count**: {{edge_count}}
- **Edge Quality Score**: {{edge_quality_score}}
- **Confidence**: {{lineage_confidence}}
- **Strategy**: {{lineage_strategy}}
- **Pattern Class**: {{lineage_pattern_class}}

## Provenance

- **Source**: {{lineage_source}}
- **Source Path**: {{lineage_source_path}}
- **Evidence Hash**: {{lineage_evidence_hash}}
- **Extracted At**: {{extracted_at}}
- **Last Updated**: {{last_updated}}

## Governance

- **Owner**: {{owner}}
- **Steward**: {{steward}}
- **Domain Manager**: {{domain_manager}}
- **Custodian**: {{custodian}}
- **Sensitivity**: {{sensitivity}}
