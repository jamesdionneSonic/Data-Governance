import { renderLineageMarkdownTemplate } from './markdownTemplateRenderer.js';
import { writeCorrectedMarkdown } from './markdownCorrectionWriter.js';
import { templateValuesFromRecord } from './provenance.js';

export function rewriteMarkdownFromRecord(record, overrides = {}) {
  const lane = overrides.lane || record.kind || 'table';
  const markdown = renderLineageMarkdownTemplate(templateValuesFromRecord(record, lane, overrides));
  if (overrides.outputPath) {
    writeCorrectedMarkdown(overrides.outputPath, markdown);
  }
  return markdown;
}

export default rewriteMarkdownFromRecord;
