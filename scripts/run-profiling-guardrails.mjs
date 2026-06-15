#!/usr/bin/env node
/* eslint-disable no-console */

import { spawnSync } from 'child_process';
import path from 'path';

const runId = `${new Date().toISOString().replace(/[:.]/g, '-')}-${process.pid}`;
const outputDir = path.join('tmp', 'profiling-guardrails-results', runId);
const playwrightCli = path.join('node_modules', '@playwright', 'test', 'cli.js');
const defaultPort = String(3200 + (process.pid % 1000));
const result = spawnSync(
  process.execPath,
  [
    playwrightCli,
    'test',
    'tests/e2e/profiling-guardrails.spec.js',
    '--workers=1',
    `--output=${outputDir}`,
  ],
  {
    env: {
      ...process.env,
      PLAYWRIGHT_PORT: process.env.PLAYWRIGHT_PORT || defaultPort,
    },
    stdio: 'inherit',
  }
);

if (result.error) {
  console.error(`Profiling guardrail runner failed: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
