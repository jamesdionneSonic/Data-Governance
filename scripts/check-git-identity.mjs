import { execFileSync } from 'node:child_process';

const EXPECTED_USER = 'jamesdionneSonic';
const EXPECTED_EMAIL = 'james.dionne@sonicautomotive.com';

const BLOCKED_PATTERNS = [
  /GleanChef/i,
  /jadionne@gleanchef\.com/i,
  /Your Name/i,
  /you@example\.com/i,
];

function git(args, options = {}) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  }).trim();
}

function fail(message) {
  console.error(`Git identity check failed: ${message}`);
  process.exitCode = 1;
}

function includesBlockedIdentity(value) {
  return BLOCKED_PATTERNS.some((pattern) => pattern.test(value));
}

const isCi = process.env.CI === 'true';
const currentUser = git(['config', '--get', 'user.name'], { stdio: ['ignore', 'pipe', 'ignore'] });
const currentEmail = git(['config', '--get', 'user.email'], {
  stdio: ['ignore', 'pipe', 'ignore'],
});

if (!isCi && currentUser !== EXPECTED_USER) {
  fail(`local git user.name is "${currentUser}", expected "${EXPECTED_USER}".`);
}

if (!isCi && currentEmail !== EXPECTED_EMAIL) {
  fail(`local git user.email is "${currentEmail}", expected "${EXPECTED_EMAIL}".`);
}

const history = git(['log', 'HEAD', '--format=%H%x09%an%x09%ae%x09%cn%x09%ce']);

const badHistoryLines = history
  .split('\n')
  .filter(Boolean)
  .filter((line) => includesBlockedIdentity(line));

if (badHistoryLines.length) {
  fail(
    `blocked contributor metadata found in HEAD history:\n${badHistoryLines
      .slice(0, 20)
      .join('\n')}`
  );
}

if (!process.exitCode) {
  console.log('Git identity check passed.');
}
