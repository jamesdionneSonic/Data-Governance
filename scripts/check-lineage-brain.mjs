import { classifySsisRecords, classifyTableRecords } from '../src/services/lineageBrain/anomalyClassifier.js';
import { extractSsisEvidence, extractTableEvidence, hydrateEvidenceRecord } from '../src/services/lineageBrain/evidenceExtractor.js';
import { parseFrontmatter } from '../src/services/lineageBrain/markdownHelpers.js';
import { rewriteMarkdownFromRecord } from '../src/services/lineageBrain/markdownRewriter.js';
import { loadLineageBrainRules } from '../src/services/lineageBrain/rulesStore.js';
import { sha256Text } from '../src/services/lineageBrain/provenance.js';

function fail(message, details = {}) {
  console.log(JSON.stringify({ status: 'failed', message, ...details }, null, 2));
  process.exitCode = 1;
  process.exit();
}

function requiredTemplateFields(markdown) {
  const { metadata } = parseFrontmatter(markdown);
  return [
    'lineage_confidence',
    'edge_quality_score',
    'lineage_strategy',
    'lineage_pattern_class',
    'lineage_source',
    'lineage_source_path',
    'lineage_evidence_hash',
    'extraction_warnings',
  ].filter((field) => !Object.prototype.hasOwnProperty.call(metadata, field));
}

function signature(records, classified) {
  return sha256Text(
    JSON.stringify({
      recordCount: records.length,
      baselinePath: classified.baseline?.markdownPath || null,
      anomalyCount: classified.anomalies?.length || 0,
      anomalyPaths: (classified.anomalies || [])
        .slice()
        .sort((left, right) => right.edgeCount - left.edgeCount || left.markdownPath.localeCompare(right.markdownPath))
        .slice(0, 25)
        .map((record) => record.markdownPath),
    })
  );
}

const rules = loadLineageBrainRules();

const ssisRecords = extractSsisEvidence();
const ssisClassified = classifySsisRecords(ssisRecords, rules);
if (!ssisClassified.baseline) fail('SSIS baseline was not found.');
if (!/dimvehicle/i.test(ssisClassified.baseline.markdownPath)) {
  fail('SSIS baseline is not a DimVehicle baseline.', {
    baselinePath: ssisClassified.baseline.markdownPath,
  });
}

const tableRecords = extractTableEvidence();
const tableClassified = classifyTableRecords(tableRecords, rules);
if (!tableClassified.baseline) fail('Table baseline was not found.');
if (!/bt_checklistrecord/i.test(tableClassified.baseline.markdownPath)) {
  fail('Table baseline is not BT_ChecklistRecord.', {
    baselinePath: tableClassified.baseline.markdownPath,
  });
}
if ((tableClassified.anomalies || []).length < 1) {
  fail('No table anomaly was found for validation.');
}

const hydratedSsisBaseline = hydrateEvidenceRecord(ssisClassified.baseline, 'ssis');
const hydratedTableBaseline = hydrateEvidenceRecord(tableClassified.baseline, 'table');
const ssisTemplate = rewriteMarkdownFromRecord(hydratedSsisBaseline, { lane: 'ssis' });
const tableTemplate = rewriteMarkdownFromRecord(hydratedTableBaseline, { lane: 'table' });
const missingSsisFields = requiredTemplateFields(ssisTemplate);
const missingTableFields = requiredTemplateFields(tableTemplate);
if (missingSsisFields.length || missingTableFields.length) {
  fail('Rendered lineage templates are missing required fields.', {
    missingSsisFields,
    missingTableFields,
  });
}

const secondSsisRecords = extractSsisEvidence();
const secondTableRecords = extractTableEvidence();
const secondSsisClassified = classifySsisRecords(secondSsisRecords, rules);
const secondTableClassified = classifyTableRecords(secondTableRecords, rules);
const firstSignature = {
  ssis: signature(ssisRecords, ssisClassified),
  table: signature(tableRecords, tableClassified),
};
const secondSignature = {
  ssis: signature(secondSsisRecords, secondSsisClassified),
  table: signature(secondTableRecords, secondTableClassified),
};

if (JSON.stringify(firstSignature) !== JSON.stringify(secondSignature)) {
  fail('Lineage brain extractor/classifier is not stable across two consecutive passes.', {
    firstSignature,
    secondSignature,
  });
}

console.log(
  JSON.stringify(
    {
      status: 'ok',
      ssis: {
        records: ssisRecords.length,
        baselinePath: ssisClassified.baseline.markdownPath,
        anomalies: ssisClassified.anomalies.length,
      },
      table: {
        records: tableRecords.length,
        baselinePath: tableClassified.baseline.markdownPath,
        anomalies: tableClassified.anomalies.length,
        validationAnomalyPath: tableClassified.anomaly?.markdownPath || null,
      },
      templates: {
        ssisRequiredFieldsPresent: missingSsisFields.length === 0,
        tableRequiredFieldsPresent: missingTableFields.length === 0,
      },
      stability: {
        stable: true,
        firstSignature,
        secondSignature,
      },
    },
    null,
    2
  )
);
