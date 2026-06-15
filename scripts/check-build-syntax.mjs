#!/usr/bin/env node
/* eslint-disable no-console */

import { readdirSync, statSync } from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const repoRoot = process.cwd();
const rootsToCheck = ['src', path.join('docker', 'frontend'), 'scripts'];
const checkedExtensions = new Set(['.cjs', '.js', '.mjs']);
const ignoredDirectories = new Set([
  '.git',
  'coverage',
  'node_modules',
  'playwright-report',
  'test-results',
  'tmp',
]);

function walk(relativeDir, files = []) {
  const absoluteDir = path.join(repoRoot, relativeDir);
  for (const entry of readdirSync(absoluteDir, { withFileTypes: true })) {
    const relativePath = path.join(relativeDir, entry.name);
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        walk(relativePath, files);
      }
      continue;
    }
    if (entry.isFile() && checkedExtensions.has(path.extname(entry.name))) {
      files.push(relativePath);
    }
  }
  return files;
}

function existingRoots() {
  return rootsToCheck.filter((relativePath) => {
    try {
      return statSync(path.join(repoRoot, relativePath)).isDirectory();
    } catch (_err) {
      return false;
    }
  });
}

const files = existingRoots()
  .flatMap((relativePath) => walk(relativePath))
  .sort((left, right) => left.localeCompare(right));

const failures = [];

for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    failures.push({
      file,
      output: [result.stdout, result.stderr].filter(Boolean).join('\n').trim(),
    });
  }
}

if (failures.length) {
  console.error(`Build syntax check failed for ${failures.length} file(s):`);
  for (const failure of failures) {
    console.error(`\n${failure.file}`);
    console.error(failure.output || 'No diagnostic output from node --check.');
  }
  process.exit(1);
}

console.log(`Build syntax check passed for ${files.length} JavaScript runtime file(s).`);
