import 'dotenv/config';

import axios from 'axios';
import fs from 'node:fs/promises';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { marked } from 'marked';

import {
  CONFLUENCE_HUB_PAGE_IDS,
  CONFLUENCE_SPACE,
} from '../src/config/confluencePageMap.js';

const root = process.cwd();
const manifestPath = path.join(root, 'tmp', 'adf-multi-factory-support-documentation-manifest.json');
const parentPageId = String(process.env.ADF_CONFLUENCE_PARENT_PAGE_ID || CONFLUENCE_HUB_PAGE_IDS.operateSupport);
const rootTitle = process.env.ADF_MULTI_FACTORY_CONFLUENCE_ROOT_TITLE || 'ADF Multi-Factory Support Documentation';
const spaceKey = process.env.CONFLUENCE_SPACE_KEY || CONFLUENCE_SPACE.spaceKey;
const baseUrl = String(process.env.CONFLUENCE_BASE_URL || CONFLUENCE_SPACE.baseUrl).replace(/\/+$/, '');
const email = process.env.CONFLUENCE_EMAIL || '';
const apiToken = process.env.CONFLUENCE_API_TOKEN || '';
const publish = process.argv.includes('--publish');
const missingOnly = process.argv.includes('--missing-only');

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
  try {
    const response = await request(() =>
      http.post('/rest/api/content', {
        type: 'page',
        title,
        space: { key: spaceKey },
        ancestors: [{ id: parentId }],
        body: { storage: { value: body, representation: 'storage' } },
      })
    );
    return response.data;
  } catch (error) {
    error.message = `Create failed for "${title}": ${error.response?.data?.message || error.message}`;
    throw error;
  }
}

async function updatePage(page, body, title = page.title) {
  try {
    const response = await request(() =>
      http.put(`/rest/api/content/${page.id}`, {
        id: page.id,
        type: 'page',
        title,
        space: { key: spaceKey },
        version: {
          number: number(page.version?.number) + 1,
          message: `Refresh ADF multi-factory support documentation ${new Date().toISOString()}`,
        },
        body: { storage: { value: body, representation: 'storage' } },
      })
    );
    return response.data;
  } catch (error) {
    error.message = `Update failed for "${title}": ${error.response?.data?.message || error.message}`;
    throw error;
  }
}

async function upsertPage(parentId, title, body) {
  const existing = await findChildPage(parentId, title);
  if (existing) {
    if (missingOnly) return { action: 'skipped-existing', title, id: existing.id };
    if (!publish) return { action: 'update', title, id: existing.id };
    const updated = await updatePage(existing, body);
    return { action: 'updated', title, id: updated.id };
  }
  if (!publish) return { action: 'create', title, id: null };
  const created = await createPage(parentId, title, body);
  return { action: 'created', title, id: created.id };
}

async function upsertPageWithRename(parentId, desiredTitle, legacyTitles, body) {
  const existing = await findChildPage(parentId, desiredTitle);
  if (existing) {
    if (missingOnly) return { action: 'skipped-existing', title: desiredTitle, id: existing.id };
    if (!publish) return { action: 'update', title: desiredTitle, id: existing.id };
    const updated = await updatePage(existing, body, desiredTitle);
    return { action: 'updated', title: desiredTitle, id: updated.id };
  }

  for (const legacyTitle of legacyTitles.filter((title) => title && title !== desiredTitle)) {
    const legacy = await findChildPage(parentId, legacyTitle);
    if (legacy) {
      if (!publish) return { action: 'rename-update', title: desiredTitle, id: legacy.id };
      const updated = await updatePage(legacy, body, desiredTitle);
      return { action: 'renamed-updated', title: desiredTitle, id: updated.id };
    }
  }

  if (!publish) return { action: 'create', title: desiredTitle, id: null };
  const created = await createPage(parentId, desiredTitle, body);
  return { action: 'created', title: desiredTitle, id: created.id };
}

function markdownToStorage(markdown) {
  marked.setOptions({ gfm: true, headerIds: false, mangle: false });
  return marked.parse(markdown);
}

function rootBody(manifest) {
  return `<h1>${esc(rootTitle)}</h1>
<p><strong>Business purpose:</strong> This section documents Azure Data Factory factories, triggers, and pipelines in plain English for support and data engineering users.</p>
<p><strong>Generated:</strong> ${esc(manifest.generated_at || '')}</p>
<p><strong>Connector count:</strong> ${number(manifest.connector_count)}</p>
<p><strong>Page count:</strong> ${number(manifest.page_count)}</p>
<div data-type="panel-info"><p><strong>Navigation:</strong> Open a factory page first, then review trigger and pipeline child pages under that factory.</p></div>
<div data-type="panel-warning"><p><strong>Operational boundary:</strong> These pages are documentation only. Do not start child pipelines with blank operational parameters and do not change triggers, schedules, linked services, retries, or credentials from documentation work.</p></div>
<h2>Factories</h2>
<table><thead><tr><th>Factory</th><th>Connector</th><th>Triggers</th><th>Pipelines</th><th>Pages</th></tr></thead><tbody>
${(manifest.connectors || [])
  .map(
    (connector) =>
      `<tr><td>${esc(connector.factory)}</td><td><code>${esc(connector.connector_id)}</code></td><td>${number(connector.trigger_pages)}</td><td>${number(connector.pipeline_pages)}</td><td>${number(connector.total_pages)}</td></tr>`
  )
  .join('')}
</tbody></table>`;
}

function factorySummaryBody(manifest, connector) {
  return `<h1>${esc(connector.factory)}</h1>
<p><strong>Saved connector:</strong> <code>${esc(connector.connector_id)}</code></p>
<p><strong>Source artifact:</strong> <code>${esc(connector.source_artifact)}</code></p>
<p><strong>Generated:</strong> ${esc(manifest.generated_at || '')}</p>
<table><thead><tr><th>Page type</th><th>Count</th></tr></thead><tbody>
<tr><td>Factory overview</td><td>${number(connector.factory_pages)}</td></tr>
<tr><td>Triggers</td><td>${number(connector.trigger_pages)}</td></tr>
<tr><td>Pipelines</td><td>${number(connector.pipeline_pages)}</td></tr>
</tbody></table>
<p>Use the child pages under this factory for support checks, lineage and dependency context, runtime caveats, and technical details.</p>`;
}

function uniqueChildTitles(pages) {
  const counts = new Map();
  return pages.map((page) => {
    const baseTitle = page.title;
    const count = (counts.get(baseTitle) || 0) + 1;
    counts.set(baseTitle, count);
    if (count === 1) return { ...page, confluence_title: baseTitle };
    return { ...page, confluence_title: `${baseTitle} (${page.asset_type} ${count})` };
  });
}

function publishedChildTitle(connector, page) {
  return `${connector.connector_id} / ${page.confluence_title}`;
}

try {
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  await getPage(parentPageId);

  let supportRoot = await findChildPage(parentPageId, rootTitle);
  const rootPlan = supportRoot
    ? { action: publish ? 'update' : 'update', title: rootTitle, id: supportRoot.id }
    : { action: publish ? 'create' : 'create', title: rootTitle, id: null };

  if (publish) {
    if (!supportRoot) {
      supportRoot = await createPage(parentPageId, rootTitle, rootBody(manifest));
    } else if (!missingOnly) {
      supportRoot = await updatePage(supportRoot, rootBody(manifest));
    }
  } else if (supportRoot) {
    await listChildren(supportRoot.id);
  }

  const rootId = supportRoot?.id || null;
  const pagePlans = [];
  const factoryPlans = [];

  for (const connector of manifest.connectors || []) {
    const factoryPages = (manifest.pages || []).filter((page) => page.connector_id === connector.connector_id);
    const overviewPage = factoryPages.find((page) => page.asset_type === 'factory');
    const childPages = uniqueChildTitles(factoryPages.filter((page) => page.asset_type !== 'factory'));
    const factoryTitle = connector.factory;

    let factoryRoot = null;
    if (rootId) {
      // eslint-disable-next-line no-await-in-loop
      factoryRoot = await findChildPage(rootId, factoryTitle);
    }

    if (rootId) {
      const overviewMarkdown = overviewPage
        ? await fs.readFile(path.join(root, overviewPage.markdown_file), 'utf8')
        : '';
      const body = `${factorySummaryBody(manifest, connector)}${overviewMarkdown ? markdownToStorage(overviewMarkdown) : ''}`;
      // eslint-disable-next-line no-await-in-loop
      const factoryResult = publish
        ? await upsertPage(rootId, factoryTitle, body)
        : { action: factoryRoot ? 'update' : 'create', title: factoryTitle, id: factoryRoot?.id || null };
      factoryPlans.push(factoryResult);
      factoryRoot = publish ? { id: factoryResult.id } : factoryRoot;
    } else {
      factoryPlans.push({ action: 'create-after-root', title: factoryTitle });
    }

    if (factoryRoot?.id) {
      // eslint-disable-next-line no-await-in-loop
      const existingChildren = await listChildren(factoryRoot.id);
      const existingTitles = new Set(existingChildren.map((page) => page.title));
      for (const page of childPages) {
        const desiredTitle = publishedChildTitle(connector, page);
        const legacyTitles = [`${connector.factory} / ${page.confluence_title}`, page.confluence_title];
        // eslint-disable-next-line no-await-in-loop
        const markdown = await fs.readFile(path.join(root, page.markdown_file), 'utf8');
        const body = markdownToStorage(markdown);
        // eslint-disable-next-line no-await-in-loop
        const result = publish
          ? await upsertPageWithRename(factoryRoot.id, desiredTitle, legacyTitles, body)
          : {
              action: existingTitles.has(desiredTitle)
                ? 'update'
                : existingTitles.has(page.confluence_title)
                  ? 'rename-update'
                  : 'create',
              title: desiredTitle,
              id: null,
            };
        pagePlans.push({ ...result, connector_id: connector.connector_id, asset_type: page.asset_type });
        if (publish) {
          // eslint-disable-next-line no-await-in-loop
          await delay(150);
        }
      }
    } else {
      for (const page of childPages) {
        pagePlans.push({
          action: 'create-after-factory',
          title: publishedChildTitle(connector, page),
          connector_id: connector.connector_id,
          asset_type: page.asset_type,
        });
      }
    }
  }

  const allPlans = [...factoryPlans, ...pagePlans];
  console.log(
    JSON.stringify(
      {
        mode: publish ? 'publish' : 'dry-run',
        parentPageId,
        root: rootPlan,
        connectorCount: number(manifest.connector_count),
        factoryPageCount: factoryPlans.length,
        childPageCount: pagePlans.length,
        totalConfluencePages: allPlans.length + 1,
        creates: allPlans.filter((page) => String(page.action).includes('create')).length + (rootPlan.action === 'create' ? 1 : 0),
        updates: allPlans.filter((page) => String(page.action).includes('update')).length + (rootPlan.action === 'update' ? 1 : 0),
        sample: allPlans.slice(0, 10),
      },
      null,
      2
    )
  );
} catch (err) {
  console.error(
    JSON.stringify(
      {
        mode: publish ? 'publish' : 'dry-run',
        status: 'failed',
        message: err.message || err.response?.data?.message || 'ADF multi-factory Confluence sync failed',
        httpStatus: err.response?.status || null,
        code: err.code || null,
      },
      null,
      2
    )
  );
  process.exitCode = 1;
}
