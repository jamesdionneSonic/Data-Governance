import 'dotenv/config';

import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';

const ROOT = process.cwd();
const DEFAULT_REPORT_PATH = path.join(
  ROOT,
  'data',
  'markdown',
  'semantic-lineage-refresh-report.json'
);

function hasFlag(name) {
  return process.argv.slice(2).includes(name);
}

function argValue(name) {
  const prefix = `${name}=`;
  const found = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  if (found) return found.slice(prefix.length);
  const index = process.argv.indexOf(name);
  if (index < 0) return '';
  return process.argv[index + 1] || '';
}

function normalizePath(value) {
  return String(value || '').replace(/\\/g, '/');
}

function nowIso() {
  return new Date().toISOString();
}

function stepDefinition(name, scriptFile, args = []) {
  return {
    name,
    scriptFile,
    args,
  };
}

function buildRefreshPlan() {
  const dryRunRebuild = hasFlag('--dry-run-rebuild');
  const planOnly = hasFlag('--plan-only');
  const skipPackage = hasFlag('--skip-package');
  const publishPackage = hasFlag('--publish-package');
  const forcePublish = hasFlag('--force-publish');
  const recordPublished = hasFlag('--record-published');
  const reportPath = path.resolve(
    ROOT,
    argValue('--report') || process.env.SEMANTIC_LINEAGE_REFRESH_REPORT || DEFAULT_REPORT_PATH
  );
  const dataPath = argValue('--data-path') || process.env.MARKDOWN_DATA_PATH || './data/markdown';
  const concurrency = argValue('--concurrency');
  const ssisLimit = argValue('--ssis-limit');

  const rebuildArgs = [];
  if (dryRunRebuild) rebuildArgs.push('--dry-run');
  if (ssisLimit) rebuildArgs.push(`--ssis-limit=${ssisLimit}`);
  rebuildArgs.push('--enforce-gates');

  const runtimeIndexArgs = [];
  if (concurrency) runtimeIndexArgs.push('--concurrency', concurrency);

  const steps = [
    stepDefinition('rebuild_raw_markdown', 'rebuild-catalog-from-raw.mjs', rebuildArgs),
    stepDefinition('rebuild_runtime_indexes', 'build-runtime-catalog-indexes.mjs', runtimeIndexArgs),
    stepDefinition('check_runtime_indexes', 'check-runtime-catalog.mjs', [dataPath]),
    stepDefinition('export_devops_catalog_repo', 'export-catalog-repo.mjs', []),
    stepDefinition('validate_devops_catalog_repo', 'check-catalog-repo.mjs', []),
  ];

  if (!skipPackage) {
    steps.push(stepDefinition('build_runtime_package', 'build-lineage-runtime-package.mjs', []));
    steps.push(stepDefinition('check_runtime_package', 'check-lineage-runtime-package.mjs', []));
  }

  if (publishPackage) {
    const publishArgs = [];
    if (forcePublish) publishArgs.push('--force-publish');
    if (recordPublished) publishArgs.push('--record-published');
    steps.push(stepDefinition('publish_runtime_package', 'publish-lineage-runtime-package.mjs', publishArgs));
  }

  return {
    started_at: nowIso(),
    report_path: reportPath,
    options: {
      data_path: dataPath,
      plan_only: planOnly,
      dry_run_rebuild: dryRunRebuild,
      skip_package: skipPackage,
      publish_package: publishPackage,
      force_publish: forcePublish,
      record_published: recordPublished,
      concurrency: concurrency || null,
      ssis_limit: ssisLimit || null,
    },
    steps,
  };
}

async function runNodeScript(scriptFile, args = []) {
  const startedAt = Date.now();
  const fullPath = path.join(ROOT, 'scripts', scriptFile);

  return new Promise((resolve) => {
    const child = spawn(process.execPath, [fullPath, ...args], {
      cwd: ROOT,
      stdio: 'inherit',
      shell: false,
    });

    child.on('close', (code) => {
      resolve({
        status: code === 0 ? 'ok' : 'failed',
        exit_code: code ?? 1,
        elapsed_ms: Date.now() - startedAt,
        script: normalizePath(fullPath),
        args,
      });
    });

    child.on('error', (error) => {
      resolve({
        status: 'failed',
        exit_code: 1,
        elapsed_ms: Date.now() - startedAt,
        script: normalizePath(fullPath),
        args,
        error: error.message,
      });
    });
  });
}

async function writeReport(reportPath, report) {
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
}

async function main() {
  const plan = buildRefreshPlan();
  if (plan.options.plan_only) {
    console.log(JSON.stringify({ status: 'planned', ...plan }, null, 2));
    return;
  }

  const report = {
    ...plan,
    completed_at: null,
    status: 'running',
    results: [],
  };
  await writeReport(plan.report_path, report);

  for (const step of plan.steps) {
    report.current_step = step.name;
    await writeReport(plan.report_path, report);
    // eslint-disable-next-line no-await-in-loop
    const result = await runNodeScript(step.scriptFile, step.args);
    report.results.push({
      step: step.name,
      ...result,
    });
    await writeReport(plan.report_path, report);

    if (result.status !== 'ok') {
      report.status = 'failed';
      report.completed_at = nowIso();
      delete report.current_step;
      await writeReport(plan.report_path, report);
      console.error(
        `Semantic lineage refresh stopped at ${step.name}. See ${normalizePath(plan.report_path)}.`
      );
      process.exitCode = result.exit_code || 1;
      return;
    }
  }

  report.status = 'ok';
  report.completed_at = nowIso();
  delete report.current_step;
  await writeReport(plan.report_path, report);
  console.log(
    JSON.stringify(
      {
        status: report.status,
        report_path: normalizePath(plan.report_path),
        completed_at: report.completed_at,
        steps: report.results.length,
      },
      null,
      2
    )
  );
}

main().catch(async (error) => {
  const reportPath = path.resolve(
    ROOT,
    argValue('--report') || process.env.SEMANTIC_LINEAGE_REFRESH_REPORT || DEFAULT_REPORT_PATH
  );
  const fallbackReport = {
    started_at: nowIso(),
    completed_at: nowIso(),
    status: 'failed',
    fatal_error: error.stack || error.message,
    results: [],
  };
  await writeReport(reportPath, fallbackReport).catch(() => {});
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
