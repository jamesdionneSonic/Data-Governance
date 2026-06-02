import { getLineageTemplateDefaults } from './templateFields.js';

function stringifyValue(value) {
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return `[${value.map((item) => `'${String(item)}'`).join(', ')}]`;
  }
  if (value === null || value === undefined || value === '') return "''";
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return `'${String(value).replace(/'/g, "''")}'`;
}

export function renderLineageMarkdownTemplate(values = {}) {
  const data = { ...getLineageTemplateDefaults(), ...values };
  return `---\n${Object.entries(data)
    .map(([key, value]) => `${key}: ${stringifyValue(value)}`)
    .join('\n')}\n---\n\n## Overview\n\nMetadata auto-extracted from source systems.\n\n## Lineage Summary\n\n- **Edge Count**: ${data.edge_count}\n- **Edge Quality Score**: ${data.edge_quality_score}\n- **Confidence**: ${data.lineage_confidence}\n- **Strategy**: ${data.lineage_strategy}\n- **Pattern Class**: ${data.lineage_pattern_class}\n\n## Provenance\n\n- **Source**: ${data.lineage_source}\n- **Source Path**: ${data.lineage_source_path}\n- **Evidence Hash**: ${data.lineage_evidence_hash}\n- **Extracted At**: ${data.extracted_at}\n- **Last Updated**: ${data.last_updated}\n\n## Governance\n\n- **Owner**: ${data.owner}\n- **Steward**: ${data.steward}\n- **Domain Manager**: ${data.domain_manager}\n- **Custodian**: ${data.custodian}\n- **Sensitivity**: ${data.sensitivity}\n`;
}

export default renderLineageMarkdownTemplate;
