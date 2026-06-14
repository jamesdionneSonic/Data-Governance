import 'dotenv/config';

import axios from 'axios';
import { readFile } from 'fs/promises';
import path from 'path';

function trimTrailingSlash(value) {
  return String(value || '').replace(/\/+$/, '');
}

function encodeBasicAuth(email, apiToken) {
  return Buffer.from(`${email}:${apiToken}`).toString('base64');
}

const baseUrl = trimTrailingSlash(
  process.env.CONFLUENCE_BASE_URL || 'https://sonicautomotive.atlassian.net/wiki'
);
const parentPageId = String(process.env.CONFLUENCE_PARENT_PAGE_ID || '2221670415').trim();
const email = process.env.CONFLUENCE_EMAIL || '';
const apiToken = process.env.CONFLUENCE_API_TOKEN || '';

if (!baseUrl || !parentPageId || !email || !apiToken) {
  console.log(
    JSON.stringify(
      {
        status: 'blocked',
        missing: [
          !baseUrl && 'CONFLUENCE_BASE_URL',
          !parentPageId && 'CONFLUENCE_PARENT_PAGE_ID',
          !email && 'CONFLUENCE_EMAIL',
          !apiToken && 'CONFLUENCE_API_TOKEN',
        ].filter(Boolean),
      },
      null,
      2
    )
  );
  process.exitCode = 1;
  process.exit();
}

const http = axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization: `Basic ${encodeBasicAuth(email, apiToken)}`,
    Accept: 'application/json',
  },
});

async function listChildPages(pageId) {
  const pages = [];
  let start = 0;
  const limit = 100;

  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const response = await http.get(`/rest/api/content/${pageId}/child/page`, {
      params: {
        start,
        limit,
        expand: 'metadata.labels',
      },
    });
    const results = response.data?.results || [];
    pages.push(...results);
    if (results.length < limit) break;
    start += limit;
  }

  return pages;
}

function isGeneratedPage(page) {
  const title = String(page?.title || '');
  if (title.startsWith('[AUTO]')) return true;
  const labels = page?.metadata?.labels?.results || [];
  return labels.some((label) => ['generated', 'lineage-catalog'].includes(label.name));
}

const directChildren = await listChildPages(parentPageId);
const generatedChildren = directChildren.filter(isGeneratedPage);
const databasesPage = directChildren.find((page) => page.title === 'Databases') || null;
const databaseChildren = databasesPage ? (await listChildPages(databasesPage.id)).filter(isGeneratedPage) : [];
let expectedDatabaseTitles = [];

try {
  const manifestPath = path.resolve(
    process.cwd(),
    process.env.CONFLUENCE_EXPORT_PATH || 'data/confluence/export',
    'confluence-export-manifest.json'
  );
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  expectedDatabaseTitles = (manifest.pages || [])
    .filter((page) => page.parent_title === 'Databases')
    .map((page) => page.title)
    .sort();
} catch {
  expectedDatabaseTitles = [];
}

const actualDatabaseTitles = databaseChildren.map((page) => page.title).sort();
const missingDatabaseTitles = expectedDatabaseTitles.filter(
  (title) => !actualDatabaseTitles.includes(title)
);
const extraDatabaseTitles = actualDatabaseTitles.filter(
  (title) => !expectedDatabaseTitles.includes(title)
);

console.log(
  JSON.stringify(
    {
      status: 'ok',
      parentPageId,
      directChildren: directChildren.length,
      directGeneratedChildren: generatedChildren.length,
      databasesPageId: databasesPage?.id || null,
      databaseGeneratedChildren: databaseChildren.length,
      expectedDatabaseChildren: expectedDatabaseTitles.length,
      missingDatabaseTitles,
      extraDatabaseTitles,
      databaseGeneratedTitles: databaseChildren.slice(0, 100).map((page) => page.title),
      directGeneratedTitles: generatedChildren.slice(0, 100).map((page) => page.title),
    },
    null,
    2
  )
);
