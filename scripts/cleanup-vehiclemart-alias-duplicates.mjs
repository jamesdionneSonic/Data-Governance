import fs from 'node:fs/promises';
import path from 'node:path';

const DUPLICATE_SERVER = 'VEHICLEMART,11014';
const DATABASE = 'VehicleMart';
const CATALOG_REPO = path.resolve('../Sonic-data-lineage');
const LOCAL_DUPLICATE_RAW = path.resolve('data/analysis/raw/sqlserver/servers', DUPLICATE_SERVER);
const REGISTRY_FILES = [
  'registry/canonical-objects.jsonl',
  'registry/object-registry.jsonl',
  'registry/object-registry.csv',
];
const VEHICLEMART_CONTEXT_DIR = path.join(CATALOG_REPO, 'context-packs/databases/VehicleMart--010a11ad');

async function exists(target) {
  try {
    await fs.stat(target);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  const out = [];
  if (!(await exists(dir))) return out;
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

async function removeEmptyDirs(dir) {
  if (!(await exists(dir))) return;
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) await removeEmptyDirs(path.join(dir, entry.name));
  }
  if (dir === VEHICLEMART_CONTEXT_DIR) return;
  const remaining = await fs.readdir(dir);
  if (!remaining.length) await fs.rm(dir, { recursive: true, force: true });
}

function isDuplicateRegistryRow(row) {
  return row?.database === DATABASE && row?.source_system === DUPLICATE_SERVER;
}

async function cleanJsonl(file) {
  if (!(await exists(file))) return { file, removed: 0 };
  const lines = (await fs.readFile(file, 'utf8')).split(/\r?\n/).filter(Boolean);
  const kept = [];
  let removed = 0;
  for (const line of lines) {
    const row = JSON.parse(line);
    if (isDuplicateRegistryRow(row)) {
      removed += 1;
      continue;
    }
    kept.push(line);
  }
  await fs.writeFile(file, `${kept.join('\n')}\n`, 'utf8');
  return { file, removed };
}

async function cleanCsv(file) {
  if (!(await exists(file))) return { file, removed: 0 };
  const lines = (await fs.readFile(file, 'utf8')).split(/\r?\n/);
  const header = lines.shift() || '';
  const kept = [];
  let removed = 0;
  for (const line of lines.filter(Boolean)) {
    if (line.includes(`,${DATABASE},`) && line.includes(`,${DUPLICATE_SERVER},`)) {
      removed += 1;
      continue;
    }
    kept.push(line);
  }
  await fs.writeFile(file, `${[header, ...kept].filter(Boolean).join('\n')}\n`, 'utf8');
  return { file, removed };
}

async function cleanRegistryFiles() {
  const results = [];
  for (const relative of REGISTRY_FILES) {
    const file = path.join(CATALOG_REPO, relative);
    results.push(relative.endsWith('.csv') ? await cleanCsv(file) : await cleanJsonl(file));
  }
  return results;
}

async function cleanContextFiles() {
  const files = await walk(VEHICLEMART_CONTEXT_DIR);
  let removedJson = 0;
  let removedMarkdown = 0;
  for (const file of files.filter((item) => item.endsWith('.json'))) {
    let payload = null;
    try {
      payload = JSON.parse(await fs.readFile(file, 'utf8'));
    } catch {
      continue;
    }
    if (payload?.identity?.server !== DUPLICATE_SERVER && payload?.server !== DUPLICATE_SERVER) continue;
    await fs.rm(file, { force: true });
    removedJson += 1;
    const mdFile = file.replace(/\.json$/i, '.md');
    if (await exists(mdFile)) {
      await fs.rm(mdFile, { force: true });
      removedMarkdown += 1;
    }
  }
  await removeEmptyDirs(VEHICLEMART_CONTEXT_DIR);
  return { removedJson, removedMarkdown };
}

async function main() {
  const registry = await cleanRegistryFiles();
  const context = await cleanContextFiles();
  let removedLocalRaw = false;
  if (await exists(LOCAL_DUPLICATE_RAW)) {
    await fs.rm(LOCAL_DUPLICATE_RAW, { recursive: true, force: true });
    removedLocalRaw = true;
  }
  console.log(JSON.stringify({ registry, context, removedLocalRaw }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
