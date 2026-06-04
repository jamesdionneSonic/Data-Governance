import { runLineageBrain } from './index.js';

function parseArgs(argv) {
  const args = new Map();
  for (let i = 2; i < argv.length; i += 1) {
    const current = argv[i];
    if (current === '--mode' && argv[i + 1]) {
      args.set('mode', argv[i + 1]);
      i += 1;
    } else if (current === '--ssis-output' && argv[i + 1]) {
      args.set('ssisOutput', argv[i + 1]);
      i += 1;
    } else if (current === '--table-output' && argv[i + 1]) {
      args.set('tableOutput', argv[i + 1]);
      i += 1;
    } else if (current === '--draft-root' && argv[i + 1]) {
      args.set('draftRoot', argv[i + 1]);
      i += 1;
    } else if (current === '--output-dir' && argv[i + 1]) {
      args.set('outputDir', argv[i + 1]);
      i += 1;
    } else if (current === '--summary-file' && argv[i + 1]) {
      args.set('summaryFile', argv[i + 1]);
      i += 1;
    } else if (current === '--target' && argv[i + 1]) {
      args.set('target', argv[i + 1]);
      i += 1;
    } else if (current === '--report-file' && argv[i + 1]) {
      args.set('reportFile', argv[i + 1]);
      i += 1;
    } else if (current === '--rules-file' && argv[i + 1]) {
      args.set('rulesPath', argv[i + 1]);
      i += 1;
    } else if (current === '--proposed-rules-file' && argv[i + 1]) {
      args.set('proposedRulesPath', argv[i + 1]);
      i += 1;
    } else if (current === '--rejected-rules-file' && argv[i + 1]) {
      args.set('rejectedRulesPath', argv[i + 1]);
      i += 1;
    } else if (current === '--max-changes' && argv[i + 1]) {
      args.set('maxChanges', argv[i + 1]);
      i += 1;
    } else if (current === '--apply-corrections') {
      args.set('applyCorrections', true);
    } else if (current === '--confirm-live-write') {
      args.set('confirmLiveWrite', true);
    } else if (current === '--validate-stability') {
      args.set('validateStability', true);
    } else if (current === '--no-propose-rules') {
      args.set('proposeRules', false);
    }
  }
  return {
    mode: args.get('mode') || 'both',
    ssisOutput: args.get('ssisOutput') || null,
    tableOutput: args.get('tableOutput') || null,
    draftRoot: args.get('draftRoot') || null,
    outputDir: args.get('outputDir') || 'data/markdown/_drafts/reports',
    summaryFile: args.get('summaryFile') || 'generated_lineage_prompts.txt',
    target: args.get('target') || null,
    reportFile: args.get('reportFile') || undefined,
    rulesPath: args.get('rulesPath') || undefined,
    proposedRulesPath: args.get('proposedRulesPath') || undefined,
    rejectedRulesPath: args.get('rejectedRulesPath') || undefined,
    maxChanges: args.get('maxChanges') ? Number(args.get('maxChanges')) : null,
    applyCorrections: Boolean(args.get('applyCorrections')),
    confirmLiveWrite: Boolean(args.get('confirmLiveWrite')),
    validateStability: Boolean(args.get('validateStability')),
    proposeRules: args.has('proposeRules') ? args.get('proposeRules') : true,
  };
}

const {
  mode,
  ssisOutput,
  tableOutput,
  draftRoot,
  outputDir,
  summaryFile,
  target,
  reportFile,
  rulesPath,
  proposedRulesPath,
  rejectedRulesPath,
  maxChanges,
  applyCorrections,
  confirmLiveWrite,
  validateStability,
  proposeRules,
} = parseArgs(process.argv);
const results = runLineageBrain(mode, {
  ssis: ssisOutput ? { outputFile: ssisOutput, outputDir } : { outputDir },
  table: tableOutput ? { outputFile: tableOutput, outputDir } : { outputDir },
  draftRoot: draftRoot || null,
  summaryFile,
  target,
  reportFile,
  rulesPath,
  proposedRulesPath,
  rejectedRulesPath,
  maxChanges,
  applyCorrections,
  confirmLiveWrite,
  validateStability,
  proposeRules,
});

for (const result of results) {
  console.log(`Lane: ${result.lane}`);
  console.log(`Drafted correction for ${result.anomaly.markdownPath}`);
  console.log(`Anomalies found: ${result.anomalies.length}`);
}
