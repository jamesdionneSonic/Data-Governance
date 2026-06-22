import 'dotenv/config';

import axios from 'axios';

import {
  CONFLUENCE_GENERATED_ROOT_PAGE_IDS,
  CONFLUENCE_SPACE,
} from '../src/config/confluencePageMap.js';

const shouldDelete = process.argv.includes('--delete');
const baseUrl = String(process.env.CONFLUENCE_BASE_URL || CONFLUENCE_SPACE.baseUrl).replace(/\/+$/, '');
const spaceKey = process.env.CONFLUENCE_SPACE_KEY || CONFLUENCE_SPACE.spaceKey;
const rootPageId = String(
  process.env.CONFLUENCE_HUMAN_LINEAGE_PARENT_PAGE_ID ||
    process.env.CONFLUENCE_PARENT_PAGE_ID ||
    CONFLUENCE_GENERATED_ROOT_PAGE_IDS.lineage
).trim();
const email = process.env.CONFLUENCE_EMAIL || '';
const apiToken = process.env.CONFLUENCE_API_TOKEN || '';

const blockedTreePaths = [
  ['Sonic Data Lineage', 'Database Catalog', 'Sonic_DW', 'Schema - Sonic_DW.SONIC\\bheemappa'],
  ['Sonic Data Lineage', 'Database Catalog', 'Sonic_DW', 'Schema - Sonic_DW.SONIC\\Murali'],
  ['Sonic Data Lineage', 'Database Catalog', 'Sonic_DW', 'Schema - Sonic_DW.SONIC\\rajakumar'],
  ['Sonic Data Lineage', 'Database Catalog', 'StagingDB', 'Schema - StagingDB.SONIC\\bheemappa'],
];

function encodeBasicAuth() {
  return Buffer.from(`${email}:${apiToken}`).toString('base64');
}

function headers() {
  return {
    Authorization: `Basic ${encodeBasicAuth()}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}

function escapeCqlString(value) {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');
}

function requiredConfig() {
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
  headers: headers(),
  proxy: false,
});

async function findChildPage(title, parentPageId) {
  const cql = `parent=${parentPageId} and type=page and title="${escapeCqlString(title)}"`;
  const response = await http.get('/rest/api/content/search', {
    params: {
      cql,
      expand: 'version,metadata.labels',
      limit: 25,
    },
  });
  return (response.data?.results || []).find((page) => page.title === title) || null;
}

async function resolveTreePath(treePath) {
  let pageId = rootPageId;
  const resolved = [{ title: treePath[0], id: rootPageId }];
  for (const title of treePath.slice(1)) {
    // eslint-disable-next-line no-await-in-loop
    const page = await findChildPage(title, pageId);
    if (!page) return { resolved, missingTitle: title, page: null };
    pageId = page.id;
    resolved.push({ title, id: page.id, version: page.version?.number || null });
  }
  return { resolved, missingTitle: '', page: resolved.at(-1) };
}

async function main() {
  const missing = requiredConfig();
  if (missing.length > 0) {
    console.log(JSON.stringify({ status: 'blocked', missing }, null, 2));
    process.exitCode = 1;
    return;
  }

  const results = [];
  for (const treePath of blockedTreePaths) {
    // eslint-disable-next-line no-await-in-loop
    const resolved = await resolveTreePath(treePath);
    const leaf = resolved.resolved.at(-1);
    if (resolved.missingTitle || !leaf || leaf.title !== treePath.at(-1)) {
      results.push({
        action: 'not-found',
        treePath,
        missingTitle: resolved.missingTitle || treePath.at(-1),
      });
      continue;
    }

    if (shouldDelete) {
      // eslint-disable-next-line no-await-in-loop
      await http.delete(`/rest/api/content/${leaf.id}`);
    }

    results.push({
      action: shouldDelete ? 'deleted' : 'would-delete',
      id: leaf.id,
      title: leaf.title,
      treePath,
      version: leaf.version,
    });
  }

  console.log(
    JSON.stringify(
      {
        status: shouldDelete ? 'deleted-blocked-human-catalog-pages' : 'dry-run',
        rootPageId,
        pages: results,
        rollback: shouldDelete
          ? 'Deleted pages can be restored from Confluence trash/page history if needed.'
          : 'No live changes. Rerun with --delete to remove only the listed pages.',
      },
      null,
      2
    )
  );
}

await main();
