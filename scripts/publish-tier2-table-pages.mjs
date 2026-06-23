import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const packetRoot = path.resolve('docs/confluence-full-database-catalog-deployment');
const strategyPath = path.join(packetRoot, 'T2P-05-tier2-batch-strategy.json');
const coverageManifestPath = path.join(packetRoot, 'T2P-01-tier2-object-coverage-manifest.jsonl');
const logRoot = path.resolve('data/confluence/table-publish-logs');
const progressPath = path.join(packetRoot, 'tier2-table-publish-progress.json');
const startAfter = valueAfter('--start-after');
const startAt = valueAfter('--start-at');
const limit = Number(valueAfter('--limit') || 0);

function valueAfter(flag) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? String(process.argv[index + 1] || '').trim() : '';
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function readCoverageObjects() {
  const text = await fs.readFile(coverageManifestPath, 'utf8');
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .filter((row) => row.record_type === 'object');
}

async function appendFile(file, text) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.appendFile(file, text, 'utf8');
}

async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function tableObjectSet(objects) {
  return new Set(
    objects
      .filter((row) => row.type === 'table')
      .map((row) => `${row.platform}|${row.database}|${row.schema}|${row.name}`)
  );
}

function tableNamesForBatch(batch, tables) {
  return (batch.object_names || []).filter((name) => tables.has(`${batch.platform}|${batch.database}|${batch.schema}|${name}`));
}

async function runBatch(batch) {
  const logPath = path.join(logRoot, `${batch.batch_id}.log`);
  await fs.mkdir(logRoot, { recursive: true });
  await fs.writeFile(logPath, `# ${batch.batch_id} table publish log\n\n`, 'utf8');
  const startedAt = new Date();
  const child = spawn(
    process.execPath,
    ['scripts/run-tier2-strategy-batch-dry-run.mjs', `--batch-id=${batch.batch_id}`, '--table-only', '--publish'],
    {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
    }
  );
  child.stdout.on('data', (chunk) => {
    void appendFile(logPath, chunk.toString());
  });
  child.stderr.on('data', (chunk) => {
    void appendFile(logPath, chunk.toString());
  });
  const exitCode = await new Promise((resolve) => {
    child.on('close', resolve);
  });
  return {
    batch_id: batch.batch_id,
    platform: batch.platform,
    database: batch.database,
    schema: batch.schema,
    table_objects: batch.table_objects,
    status: exitCode === 0 ? 'published' : 'failed',
    exit_code: exitCode,
    started_at: startedAt.toISOString(),
    finished_at: new Date().toISOString(),
    log_path: path.relative(process.cwd(), logPath).replaceAll('\\', '/'),
  };
}

async function main() {
  const strategy = await readJson(strategyPath);
  const tables = tableObjectSet(await readCoverageObjects());
  let batches = (strategy.all_batches || [])
    .map((batch) => ({
      ...batch,
      table_objects: tableNamesForBatch(batch, tables).length,
    }))
    .filter((batch) => batch.table_objects > 0);

  if (startAfter) {
    const index = batches.findIndex((batch) => batch.batch_id === startAfter);
    if (index < 0) throw new Error(`--start-after batch was not found or has no table objects: ${startAfter}`);
    batches = batches.slice(index + 1);
  }
  if (startAt) {
    const index = batches.findIndex((batch) => batch.batch_id === startAt);
    if (index < 0) throw new Error(`--start-at batch was not found or has no table objects: ${startAt}`);
    batches = batches.slice(index);
  }
  if (limit > 0) batches = batches.slice(0, limit);

  const progress = {
    started_at: new Date().toISOString(),
    mode: 'live table-only publish',
    start_after: startAfter || null,
    start_at: startAt || null,
    limit: limit || null,
    total_batches_planned: batches.length,
    total_table_objects_planned: batches.reduce((total, batch) => total + batch.table_objects, 0),
    cleanup_mode: 'none',
    results: [],
  };
  await writeJson(progressPath, progress);

  for (const [index, batch] of batches.entries()) {
    console.log(
      JSON.stringify({
        status: 'publishing',
        ordinal: index + 1,
        total: batches.length,
        batch_id: batch.batch_id,
        table_objects: batch.table_objects,
      })
    );
    // eslint-disable-next-line no-await-in-loop
    const result = await runBatch(batch);
    progress.results.push(result);
    progress.finished_at = new Date().toISOString();
    progress.published_batches = progress.results.filter((item) => item.status === 'published').length;
    progress.failed_batches = progress.results.filter((item) => item.status === 'failed').length;
    progress.published_table_objects = progress.results
      .filter((item) => item.status === 'published')
      .reduce((total, item) => total + item.table_objects, 0);
    // eslint-disable-next-line no-await-in-loop
    await writeJson(progressPath, progress);
    console.log(JSON.stringify(result));
    if (result.status !== 'published') {
      process.exitCode = 1;
      return;
    }
  }

  progress.status = 'complete';
  progress.finished_at = new Date().toISOString();
  await writeJson(progressPath, progress);
  console.log(JSON.stringify({ status: 'complete', progress_path: path.relative(process.cwd(), progressPath).replaceAll('\\', '/') }));
}

await main();
