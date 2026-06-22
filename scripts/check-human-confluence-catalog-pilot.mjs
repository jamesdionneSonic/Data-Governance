import 'dotenv/config';

import axios from 'axios';
import fs from 'node:fs/promises';
import path from 'node:path';

import {
  CONFLUENCE_GENERATED_ROOT_PAGE_IDS,
  CONFLUENCE_SPACE,
} from '../src/config/confluencePageMap.js';

const baseUrl = String(process.env.CONFLUENCE_BASE_URL || CONFLUENCE_SPACE.baseUrl).replace(/\/+$/, '');
const spaceKey = process.env.CONFLUENCE_SPACE_KEY || CONFLUENCE_SPACE.spaceKey;
const rootPageId = String(
  process.env.CONFLUENCE_HUMAN_LINEAGE_PARENT_PAGE_ID ||
    process.env.CONFLUENCE_PARENT_PAGE_ID ||
    CONFLUENCE_GENERATED_ROOT_PAGE_IDS.lineage
).trim();
const email = process.env.CONFLUENCE_EMAIL || '';
const apiToken = process.env.CONFLUENCE_API_TOKEN || '';
const outputRoot = path.resolve('data/confluence/human-catalog-dry-run');
const defaultRequiredLabels = ['human-lineage-catalog', 'lineage-product-catalog', 'reviewed-slice'];
const packetArgIndex = process.argv.indexOf('--packet');
const packetPath = packetArgIndex >= 0 ? path.resolve(process.argv[packetArgIndex + 1] || '') : '';
const outputRootArgIndex = process.argv.indexOf('--output-root');
const publishOutputRoot =
  outputRootArgIndex >= 0
    ? path.resolve(process.argv[outputRootArgIndex + 1] || '')
    : outputRoot;
let expectedRequiredLabels = defaultRequiredLabels;

function encodeBasicAuth() {
  return Buffer.from(`${email}:${apiToken}`).toString('base64');
}

function configFailures() {
  return [
    !baseUrl && 'CONFLUENCE_BASE_URL',
    !spaceKey && 'CONFLUENCE_SPACE_KEY',
    !rootPageId && 'CONFLUENCE_HUMAN_LINEAGE_PARENT_PAGE_ID or CONFLUENCE_PARENT_PAGE_ID',
    !email && 'CONFLUENCE_EMAIL',
    !apiToken && 'CONFLUENCE_API_TOKEN',
  ].filter(Boolean);
}

const http = axios.create({
  baseURL: baseUrl,
  proxy: false,
  headers: {
    Authorization: `Basic ${encodeBasicAuth()}`,
    Accept: 'application/json',
  },
});

async function findChildPage(title, parentPageId) {
  let start = 0;
  const limit = 100;
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const response = await http.get(`/rest/api/content/${parentPageId}/child/page`, {
      params: {
        start,
        limit,
        expand: 'version,metadata.labels,body.storage',
      },
    });
    const results = response.data?.results || [];
    const match = results.find((page) => page.title === title);
    if (match) return match;
    if (results.length < limit) return null;
    start += limit;
  }
}

function pageLabels(page) {
  return (page?.metadata?.labels?.results || []).map((label) => label.name);
}

function pageBody(page) {
  return String(page?.body?.storage?.value || '');
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

function leafSnippets(packet) {
  if (packet.page_type === 'product') {
    return ['Plain-English Summary', 'Key Data And Final Targets', 'Technical Evidence'];
  }
  if (packet.page_type === 'database') {
    return ['Plain-English Summary', 'Schema Summary', 'High-Use Objects'];
  }
  if (packet.page_type === 'schema') {
    return ['Plain-English Summary', 'Most Used Objects', 'Tables', 'Technical Evidence'];
  }
  if (packet.page_type === 'object-pilot') {
    return ['Plain-English Summary', 'Object Candidates', 'factFIRE'];
  }
  if (packet.page_type === 'object') {
    return ['Plain-English Summary', 'Business Meaning And Impact', 'Technical Evidence'];
  }
  return ['Plain-English Summary', 'Technical Evidence'];
}

async function expectedPagesFromDryRun() {
  let manifest;
  if (packetPath) {
    const packet = await readJson(packetPath);
    expectedRequiredLabels =
      Array.isArray(packet.required_labels) && packet.required_labels.length > 0 ? packet.required_labels : defaultRequiredLabels;
    const byPath = new Map();
    for (const page of packet.planned_pages) {
      if (page.kind === 'reference') {
        byPath.set(page.treePath.join(' / '), { treePath: page.treePath, title: page.title, kind: 'reference', snippets: [] });
        continue;
      }
      if (page.kind === 'navigation') {
        const childTitles = packet.planned_pages
          .filter((child) => child.treePath.length === page.treePath.length + 1)
          .filter((child) => child.treePath.slice(0, page.treePath.length).join(' / ') === page.treePath.join(' / '))
          .map((child) => child.title);
        byPath.set(page.treePath.join(' / '), {
          treePath: page.treePath,
          title: page.title,
          kind: 'navigation',
          snippets: page.snippets || ['Reviewed Catalog Children', ...childTitles.slice(0, 1)],
        });
        continue;
      }
      if (page.kind === 'leaf') {
        // eslint-disable-next-line no-await-in-loop
        const leafPacket = await readJson(path.join(publishOutputRoot, page.evidence_file));
        byPath.set(leafPacket.page_tree_path.join(' / '), {
          treePath: leafPacket.page_tree_path,
          title: page.title,
          kind: 'leaf',
          snippets: page.snippets || leafSnippets(leafPacket),
        });
      }
    }
    return [...byPath.values()].sort(
      (left, right) =>
        left.treePath.length - right.treePath.length ||
        left.treePath.join('/').localeCompare(right.treePath.join('/'))
    );
  } else {
    manifest = await readJson(path.join(publishOutputRoot, 'manifest.json'));
  }
  const leafPackets = [];
  if (!Array.isArray(manifest.pages)) throw new Error('Dry-run manifest does not include a pages array.');
  for (const page of manifest.pages) {
    // eslint-disable-next-line no-await-in-loop
    leafPackets.push(await readJson(path.join(publishOutputRoot, page.evidenceFile)));
  }

  const byPath = new Map();
  const addExpected = (treePath, snippets) => {
    const key = treePath.join(' / ');
    if (!byPath.has(key)) byPath.set(key, { treePath, snippets });
  };

  for (const packet of leafPackets) {
    for (let index = 1; index < packet.page_tree_path.length; index += 1) {
      const treePath = packet.page_tree_path.slice(0, index + 1);
      if (index < packet.page_tree_path.length - 1) {
        const childTitle = packet.page_tree_path[index + 1];
        addExpected(treePath, ['Reviewed Catalog Children', childTitle]);
      }
    }
    addExpected(packet.page_tree_path, leafSnippets(packet));
  }

  return [...byPath.values()].sort(
    (left, right) =>
      left.treePath.length - right.treePath.length ||
      left.treePath.join('/').localeCompare(right.treePath.join('/'))
  );
}

async function main() {
  const missing = configFailures();
  if (missing.length > 0) {
    console.log(JSON.stringify({ status: 'blocked', missing }, null, 2));
    process.exitCode = 1;
    return;
  }

  const idsByPath = new Map([['Sonic Data Lineage', rootPageId]]);
  const checks = [];
  const failures = [];
  let expectedPages = [];

  try {
    expectedPages = await expectedPagesFromDryRun();
  } catch (err) {
    failures.push({
      treePath: ['Sonic Data Lineage'],
      message: `Could not load expected pages from dry-run output: ${err.message}`,
    });
  }

  for (const expected of expectedPages) {
    const parentPath = expected.treePath.slice(0, -1).join(' / ');
    const parentPageId = idsByPath.get(parentPath);
    const title = expected.title || expected.treePath.at(-1);
    if (!parentPageId) {
      failures.push({ treePath: expected.treePath, message: `Missing parent page id for ${parentPath}` });
      continue;
    }
    // eslint-disable-next-line no-await-in-loop
    const page = await findChildPage(title, parentPageId);
    if (!page) {
      failures.push({ treePath: expected.treePath, message: 'Page not found under expected parent.' });
      continue;
    }
    idsByPath.set(expected.treePath.join(' / '), page.id);
    const labels = pageLabels(page);
    const body = pageBody(page);
    const missingLabels = expected.kind === 'reference' ? [] : expectedRequiredLabels.filter((label) => !labels.includes(label));
    const missingSnippets = expected.kind === 'reference' ? [] : expected.snippets.filter((snippet) => !body.includes(snippet));
    if (missingLabels.length > 0) {
      failures.push({ treePath: expected.treePath, id: page.id, message: `Missing labels: ${missingLabels.join(', ')}` });
    }
    if (missingSnippets.length > 0) {
      failures.push({ treePath: expected.treePath, id: page.id, message: `Missing content snippets: ${missingSnippets.join(', ')}` });
    }
    checks.push({
      treePath: expected.treePath,
      id: page.id,
      version: page.version?.number || null,
      labels,
      snippetsChecked: expected.snippets,
    });
  }

  console.log(
    JSON.stringify(
      {
        status: failures.length > 0 ? 'failed' : 'passed',
        rootPageId,
        checkedPages: checks.length,
        checks,
        failures,
      },
      null,
      2
    )
  );

  if (failures.length > 0) process.exitCode = 1;
}

await main();
