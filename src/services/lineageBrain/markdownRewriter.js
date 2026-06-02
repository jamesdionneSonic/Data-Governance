import { renderLineageMarkdownTemplate } from './markdownTemplateRenderer.js';
import { writeCorrectedMarkdown } from './markdownCorrectionWriter.js';

export function rewriteMarkdownFromRecord(record, overrides = {}) {
  const markdown = renderLineageMarkdownTemplate({
    name: record.displayName || record.objectName,
    database: overrides.database || 'unknown',
    type: overrides.type || record.objectType || 'unknown',
    schema: overrides.schema || 'dbo',
    owner: overrides.owner || record.metadata?.owner || 'Data Team',
    sensitivity: overrides.sensitivity || record.metadata?.sensitivity || 'internal',
    tags: overrides.tags || record.tags || [],
    depends_on: overrides.depends_on || record.edges || [],
    reads_from: overrides.reads_from || [],
    writes_to: overrides.writes_to || [],
    calls: overrides.calls || [],
    lineage_confidence: overrides.lineage_confidence || 'unknown',
    lineage_strategy: overrides.lineage_strategy || 'local-evidence',
    lineage_pattern_class: overrides.lineage_pattern_class || record.kind || 'unknown',
    lineage_source: overrides.lineage_source || 'local',
    lineage_source_path: overrides.lineage_source_path || record.rawPath || '',
    lineage_evidence_hash: overrides.lineage_evidence_hash || '',
    extraction_warnings: overrides.extraction_warnings || [],
    edge_count: record.edgeCount,
    edge_quality_score: overrides.edge_quality_score || 0,
    extracted_at: overrides.extracted_at || '',
    last_updated: overrides.last_updated || '',
  });
  if (overrides.outputPath) {
    writeCorrectedMarkdown(overrides.outputPath, markdown);
  }
  return markdown;
}

export default rewriteMarkdownFromRecord;
