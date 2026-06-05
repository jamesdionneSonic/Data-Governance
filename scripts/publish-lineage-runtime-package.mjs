import 'dotenv/config';

import { spawn } from 'child_process';
import { mkdir, readFile, stat, writeFile } from 'fs/promises';
import path from 'path';

const DEFAULT_PACKAGE_ROOT = './data/lineage-runtime-package/sonic-data-lineage-runtime';
const DEFAULT_ORGANIZATION = 'https://dev.azure.com/sonicapplicationdevelopment';
const DEFAULT_PROJECT = 'Data Warehouse';
const AZ_COMMAND = process.platform === 'win32' ? 'az.cmd' : 'az';
const AZ_WINDOWS_PYTHON =
  process.env.AZURE_CLI_PYTHON || 'C:\\Program Files (x86)\\Microsoft SDKs\\Azure\\CLI2\\python.exe';

function argValue(name) {
  const prefix = `${name}=`;
  const found = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : '';
}

function hasFlag(name) {
  return process.argv.slice(2).includes(name);
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function fileExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJsonIfExists(filePath, fallback = null) {
  if (!(await fileExists(filePath))) return fallback;
  return readJson(filePath);
}

function normalizePath(value) {
  return String(value || '').replace(/\\/g, '/');
}

function defaultBuildStatePath(packageRoot) {
  return path.join(path.dirname(packageRoot), '.build-state.json');
}

function commandLine(args) {
  return ['az', ...args].map((arg) => (/\s/.test(arg) ? `"${arg}"` : arg)).join(' ');
}

async function runAz(args) {
  return new Promise((resolve) => {
    const child =
      process.platform === 'win32'
        ? spawn(AZ_WINDOWS_PYTHON, ['-IBm', 'azure.cli', ...args], { stdio: 'inherit', shell: false })
        : spawn(AZ_COMMAND, args, { stdio: 'inherit', shell: false });
    child.on('close', (code) => resolve(code));
    child.on('error', (error) => {
      console.error(error.message);
      resolve(1);
    });
  });
}

async function main() {
  const dryRun = hasFlag('--dry-run');
  const forcePublish = hasFlag('--force-publish');
  const recordPublished = hasFlag('--record-published') || hasFlag('--mark-published');
  const packageRoot = path.resolve(
    process.cwd(),
    argValue('--package-root') || process.env.LINEAGE_RUNTIME_PACKAGE_ROOT || DEFAULT_PACKAGE_ROOT
  );
  const buildStatePath = path.resolve(
    process.cwd(),
    argValue('--state') || process.env.LINEAGE_RUNTIME_BUILD_STATE || defaultBuildStatePath(packageRoot)
  );
  const manifest = await readJson(path.join(packageRoot, 'manifest.json'));
  const buildState = await readJsonIfExists(buildStatePath, {});
  const organization =
    argValue('--organization') ||
    process.env.AZURE_ARTIFACTS_ORGANIZATION ||
    process.env.AZURE_DEVOPS_EXT_ORG ||
    DEFAULT_ORGANIZATION;
  const project = argValue('--project') || process.env.AZURE_ARTIFACTS_PROJECT || DEFAULT_PROJECT;
  const feed = argValue('--feed') || process.env.AZURE_ARTIFACTS_FEED || '';
  const name = argValue('--name') || process.env.LINEAGE_RUNTIME_PACKAGE_NAME || manifest.package_name;
  const version = argValue('--version') || process.env.LINEAGE_RUNTIME_PACKAGE_VERSION || manifest.version;
  const description = `Sonic data lineage runtime registry and context packs generated ${manifest.generated_at}`;
  const runtimeContentHash = manifest.runtime_content_hash || manifest.content_hashes?.['registry/object-registry.jsonl'] || '';
  const failures = [];

  if (!feed) failures.push('Missing AZURE_ARTIFACTS_FEED or --feed=<feed-name>.');
  if (!name) failures.push('Missing runtime package name.');
  if (!version) failures.push('Missing runtime package version.');
  if (version && version !== version.toLowerCase()) failures.push('Azure Artifacts package versions must be lowercase.');
  const alreadyPublished =
    !forcePublish &&
    runtimeContentHash &&
    buildState?.last_published_runtime_content_hash === runtimeContentHash;

  const args = [
    'artifacts',
    'universal',
    'publish',
    '--organization',
    organization,
    '--project',
    project,
    '--scope',
    'project',
    '--feed',
    feed || '<missing-feed>',
    '--name',
    name || '<missing-name>',
    '--version',
    version || '<missing-version>',
    '--path',
    packageRoot,
    '--description',
    description,
  ];

  if (failures.length > 0 || dryRun || alreadyPublished || recordPublished) {
    console.log(
      JSON.stringify(
        {
          status:
            failures.length > 0
              ? 'blocked'
              : alreadyPublished
                ? 'skipped'
                : recordPublished
                  ? dryRun
                    ? 'would-record'
                    : 'recorded'
                  : 'ready',
          dryRun,
          recordPublished,
          skippedReason: alreadyPublished ? 'Runtime content hash already published. Use --force-publish to upload again.' : '',
          packageRoot,
          packageName: name,
          version,
          runtimeContentHash,
          buildStatePath: normalizePath(buildStatePath),
          lastPublishedRuntimeContentHash: buildState?.last_published_runtime_content_hash || '',
          lastPublishedVersion: buildState?.last_published_version || '',
          organization,
          project,
          feed,
          command: commandLine(args),
          failures,
        },
        null,
        2
      )
    );
    if (failures.length > 0) process.exitCode = 1;
    if (recordPublished && !dryRun && failures.length === 0 && !alreadyPublished) {
      const nextState = {
        ...(buildState || {}),
        schema_version: buildState?.schema_version || 1,
        package_name: name,
        package_root: normalizePath(packageRoot),
        last_published_runtime_content_hash: runtimeContentHash,
        last_published_version: version,
        last_published_at: new Date().toISOString(),
      };
      await mkdir(path.dirname(buildStatePath), { recursive: true });
      await writeFile(buildStatePath, `${JSON.stringify(nextState, null, 2)}\n`, 'utf8');
    }
    return;
  }

  const exitCode = await runAz(args);
  if (exitCode !== 0) {
    process.exitCode = exitCode;
    return;
  }

  const nextState = {
    ...(buildState || {}),
    schema_version: buildState?.schema_version || 1,
    package_name: name,
    package_root: normalizePath(packageRoot),
    last_published_runtime_content_hash: runtimeContentHash,
    last_published_version: version,
    last_published_at: new Date().toISOString(),
  };
  await mkdir(path.dirname(buildStatePath), { recursive: true });
  await writeFile(buildStatePath, `${JSON.stringify(nextState, null, 2)}\n`, 'utf8');
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
