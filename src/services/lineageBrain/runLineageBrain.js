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
  };
}

const { mode, ssisOutput, tableOutput, draftRoot, outputDir, summaryFile, target } = parseArgs(process.argv);
const results = runLineageBrain(mode, {
  ssis: ssisOutput ? { outputFile: ssisOutput, outputDir } : { outputDir },
  table: tableOutput ? { outputFile: tableOutput, outputDir } : { outputDir },
  draftRoot: draftRoot || null,
  summaryFile,
  target,
});

for (const result of results) {
  console.log(`Lane: ${result.lane}`);
  console.log(`Drafted correction for ${result.anomaly.markdownPath}`);
  console.log(`Anomalies found: ${result.anomalies.length}`);
}
