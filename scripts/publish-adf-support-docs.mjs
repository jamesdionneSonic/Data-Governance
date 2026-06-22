import 'dotenv/config';

import axios from 'axios';
import fs from 'node:fs/promises';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

import {
  CONFLUENCE_HUB_PAGE_IDS,
  CONFLUENCE_SPACE,
} from '../src/config/confluencePageMap.js';

const root = process.cwd();
const manifestPath = path.join(root, 'tmp', 'adf-support-documentation-manifest.json');
const parentPageId = String(process.env.ADF_CONFLUENCE_PARENT_PAGE_ID || CONFLUENCE_HUB_PAGE_IDS.operateSupport);
const rootTitle = process.env.ADF_CONFLUENCE_ROOT_TITLE || 'ADF Support Documentation';
const spaceKey = process.env.CONFLUENCE_SPACE_KEY || CONFLUENCE_SPACE.spaceKey;
const baseUrl = String(process.env.CONFLUENCE_BASE_URL || CONFLUENCE_SPACE.baseUrl).replace(/\/+$/, '');
const email = process.env.CONFLUENCE_EMAIL || '';
const apiToken = process.env.CONFLUENCE_API_TOKEN || '';
const publish = process.argv.includes('--publish');

if (!email || !apiToken) {
  throw new Error('CONFLUENCE_EMAIL and CONFLUENCE_API_TOKEN are required.');
}

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function number(value) {
  return Number(value || 0);
}

function headers() {
  return {
    Authorization: `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}

const http = axios.create({
  baseURL: baseUrl,
  headers: headers(),
});

async function request(operation) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await operation();
    } catch (err) {
      const status = err.response?.status;
      if (![429, 500, 502, 503, 504].includes(status) || attempt === 4) throw err;
      // eslint-disable-next-line no-await-in-loop
      await delay(1000 * 2 ** attempt);
    }
  }
  throw new Error('unreachable retry state');
}

async function getPage(pageId) {
  const response = await request(() =>
    http.get(`/rest/api/content/${pageId}`, { params: { expand: 'version' } })
  );
  return response.data;
}

async function findChildPage(parentId, title) {
  const cql = `parent=${parentId} and type=page and title="${title.replaceAll('"', '\\"')}"`;
  const response = await request(() =>
    http.get('/rest/api/content/search', { params: { cql, limit: 1, expand: 'version' } })
  );
  return response.data?.results?.[0] || null;
}

async function listChildren(parentId) {
  const pages = [];
  let start = 0;
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const response = await request(() =>
      http.get(`/rest/api/content/${parentId}/child/page`, {
        params: { start, limit: 100, expand: 'version' },
      })
    );
    const rows = response.data?.results || [];
    pages.push(...rows);
    if (rows.length < 100) break;
    start += 100;
  }
  return pages;
}

async function createPage(parentId, title, body) {
  const response = await request(() =>
    http.post('/rest/api/content', {
      type: 'page',
      title,
      space: { key: spaceKey },
      ancestors: [{ id: parentId }],
      body: {
        storage: {
          value: body,
          representation: 'storage',
        },
      },
    })
  );
  return response.data;
}

async function updatePage(page, body) {
  const response = await request(() =>
    http.put(`/rest/api/content/${page.id}`, {
      id: page.id,
      type: 'page',
      title: page.title,
      space: { key: spaceKey },
      version: {
        number: number(page.version?.number) + 1,
        message: `Refresh ADF support documentation ${new Date().toISOString()}`,
      },
      body: {
        storage: {
          value: body,
          representation: 'storage',
        },
      },
    })
  );
  return response.data;
}

async function upsertPage(parentId, title, body) {
  const existing = await findChildPage(parentId, title);
  if (existing) {
    if (!publish) return { action: 'update', title, id: existing.id };
    const updated = await updatePage(existing, body);
    return { action: 'updated', title, id: updated.id };
  }
  if (!publish) return { action: 'create', title, id: null };
  const created = await createPage(parentId, title, body);
  return { action: 'created', title, id: created.id };
}

function parentBody(manifest) {
  return `<h1>${esc(rootTitle)}</h1>
<p><strong>Business purpose:</strong> This section documents Azure Data Factory support assets in plain English so Data Engineering and support teams can understand what each trigger, pipeline, and dataset is for before opening ADF.</p>
<p><strong>Factory:</strong> <code>adf-dw-marketing-prod</code></p>
<p><strong>Generated:</strong> ${esc(manifest.generatedAt || '')}</p>
<p><strong>Source artifact:</strong> <code>${esc(manifest.sourceArtifact || '')}</code></p>
<p><strong>Page count:</strong> ${number(manifest.pageCount)}</p>
<div data-type="panel-info"><p><strong>How to read these pages:</strong> Start with the factory page, then active triggers, then root orchestrator pipelines such as <code>pl_Marketing_AWS_Export</code>. Child pipeline pages explain source/target datasets, parent dependencies, and support checks.</p></div>
<div data-type="panel-warning"><p><strong>Operational boundary:</strong> These pages are documentation only. Do not start child pipelines with blank operational parameters; use the parent orchestrator when a manual run is approved.</p></div>`;
}

try {
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  await getPage(parentPageId);
  let adfRoot = await findChildPage(parentPageId, rootTitle);
  const rootPlan = adfRoot
    ? { action: publish ? 'update' : 'update', title: rootTitle, id: adfRoot.id }
    : { action: publish ? 'create' : 'create', title: rootTitle, id: null };

  if (publish) {
    adfRoot = adfRoot
      ? await updatePage(adfRoot, parentBody(manifest))
      : await createPage(parentPageId, rootTitle, parentBody(manifest));
  } else if (adfRoot) {
    await listChildren(adfRoot.id);
  }

  const rootId = adfRoot?.id || null;
  const pagePlans = [];
  if (rootId) {
    const existingChildren = await listChildren(rootId);
    const existingTitles = new Set(existingChildren.map((page) => page.title));
    for (const page of manifest.pages || []) {
      const html = await fs.readFile(path.join(root, page.htmlFile), 'utf8');
      // eslint-disable-next-line no-await-in-loop
      const result = publish
        ? await upsertPage(rootId, page.title, html)
        : { action: existingTitles.has(page.title) ? 'update' : 'create', title: page.title };
      pagePlans.push(result);
      if (publish) {
        // eslint-disable-next-line no-await-in-loop
        await delay(150);
      }
    }
  } else {
    for (const page of manifest.pages || []) pagePlans.push({ action: 'create-after-root', title: page.title });
  }

  console.log(JSON.stringify({
    mode: publish ? 'publish' : 'dry-run',
    parentPageId,
    root: rootPlan,
    pageCount: pagePlans.length,
    creates: pagePlans.filter((page) => String(page.action).includes('create')).length,
    updates: pagePlans.filter((page) => String(page.action).includes('update')).length,
    sample: pagePlans.slice(0, 10),
  }, null, 2));
} catch (err) {
  console.error(JSON.stringify({
    mode: publish ? 'publish' : 'dry-run',
    status: 'failed',
    message: err.response?.data?.message || err.message || 'ADF Confluence sync failed',
    httpStatus: err.response?.status || null,
    code: err.code || null,
  }, null, 2));
  process.exitCode = 1;
}
