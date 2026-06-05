import 'dotenv/config';

import { spawn } from 'child_process';
import { readFile } from 'fs/promises';
import path from 'path';

const DEFAULT_PACKAGE_ROOT = './data/lineage-runtime-package/sonic-data-lineage-runtime';
const DEFAULT_ORGANIZATION = 'https://dev.azure.com/sonicapplicationdevelopment';
const DEFAULT_PROJECT = 'Data Warehouse';

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

function commandLine(args) {
  return ['az', ...args].map((arg) => (/\s/.test(arg) ? `"${arg}"` : arg)).join(' ');
}

async function runAz(args) {
  return new Promise((resolve) => {
    const child = spawn('az', args, { stdio: 'inherit', shell: false });
    child.on('close', (code) => resolve(code));
    child.on('error', (error) => {
      console.error(error.message);
      resolve(1);
    });
  });
}

async function main() {
  const dryRun = hasFlag('--dry-run');
  const packageRoot = path.resolve(
    process.cwd(),
    argValue('--package-root') || process.env.LINEAGE_RUNTIME_PACKAGE_ROOT || DEFAULT_PACKAGE_ROOT
  );
  const manifest = await readJson(path.join(packageRoot, 'manifest.json'));
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
  const failures = [];

  if (!feed) failures.push('Missing AZURE_ARTIFACTS_FEED or --feed=<feed-name>.');
  if (!name) failures.push('Missing runtime package name.');
  if (!version) failures.push('Missing runtime package version.');
  if (version && version !== version.toLowerCase()) failures.push('Azure Artifacts package versions must be lowercase.');

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

  if (failures.length > 0 || dryRun) {
    console.log(
      JSON.stringify(
        {
          status: failures.length > 0 ? 'blocked' : 'ready',
          dryRun,
          packageRoot,
          packageName: name,
          version,
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
    return;
  }

  const exitCode = await runAz(args);
  if (exitCode !== 0) {
    process.exitCode = exitCode;
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
