import { readFile } from 'fs/promises';
import path from 'path';
import { renderDatabaseCatalogAnswer } from '../src/services/lineageCatalogAnswerService.js';

const DEFAULT_PACKAGE_ROOT = './data/lineage-runtime-package/sonic-data-lineage-runtime';

function argValue(name) {
  const prefix = `${name}=`;
  const found = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : '';
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

function requireCondition(condition, message, failures) {
  if (!condition) failures.push(message);
}

function validateDatabaseCatalogAnswer(catalogAnswer, failures) {
  const rendered = renderDatabaseCatalogAnswer(catalogAnswer);
  const anomalousEntries = catalogAnswer.anomalous_entries || [];
  const databaseNames = [
    ...(catalogAnswer.databases || []),
    ...anomalousEntries,
  ].map((row) => row.database);
  requireCondition(rendered.includes('| Database | Objects | Main types | Schemas | Notes |'), 'Database catalog answer must render as a table.', failures);
  if (anomalousEntries.length > 0) {
    requireCondition(rendered.includes('**Catalog Quality Notes**'), 'Database catalog answer must include a catalog-quality section when numeric entries exist.', failures);
  }
  requireCondition(!/entries:\s+`?\d+`?\s*,\s*`?[\w-]+`?/.test(rendered), 'Database catalog answer must not render as a comma-separated blob.', failures);
  requireCondition(!databaseNames.includes('22'), 'Database catalog answer must not contain the stale parsed-IP database entry 22.', failures);
  requireCondition(!databaseNames.includes('224'), 'Database catalog answer must not contain the stale parsed-IP database entry 224.', failures);
  return rendered;
}

function validateDimVehicleContext(dimVehicleContext, failures) {
  const semantic = dimVehicleContext.semantic_lineage || {};
  requireCondition((semantic.business_consumers || []).length > 0, 'DimVehicle context must expose business consumers.', failures);
  requireCondition((semantic.maintenance_reads || []).length > 0, 'DimVehicle context must expose maintenance/load-path reads separately.', failures);
  requireCondition((semantic.orchestrators || []).length > 0, 'DimVehicle context must expose SSIS orchestrators.', failures);
}

function validateProcedureLogic(procContext, failures) {
  requireCondition(Boolean(procContext.source?.markdown_available), 'usp_DimVehicle procedure context must include raw source markdown availability.', failures);
  requireCondition(Boolean(procContext.logic_summary), 'usp_DimVehicle procedure context must include packaged logic_summary.', failures);
  requireCondition((procContext.evidence_snippets || []).length > 0, 'usp_DimVehicle procedure context must include evidence snippets.', failures);
}

async function main() {
  const packageRoot = path.resolve(process.cwd(), argValue('--package-root') || DEFAULT_PACKAGE_ROOT);
  const failures = [];

  const catalogAnswer = await readJson(path.join(packageRoot, 'answers/catalog/databases.json'));
  const renderedDatabaseAnswer = validateDatabaseCatalogAnswer(catalogAnswer, failures);

  const dimVehicleContext = await readJson(path.join(packageRoot, 'context-packs/objects/by-id/919a08f0f18d2abe.json'));
  validateDimVehicleContext(dimVehicleContext, failures);

  const procContext = await readJson(path.join(packageRoot, 'context-packs/objects/by-id/48414dd6d4e1deb9.json'));
  validateProcedureLogic(procContext, failures);

  if (failures.length > 0) {
    console.error('Lineage answer quality check failed:');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }

  console.log(JSON.stringify({
    status: 'passed',
    checked: [
      'catalog database list format',
      'numeric/anomalous database notes',
      'DimVehicle semantic groups',
      'usp_DimVehicle packaged business logic',
    ],
    sample_database_answer: renderedDatabaseAnswer.split(/\r?\n/).slice(0, 12),
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
