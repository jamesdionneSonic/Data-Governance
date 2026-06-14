/**
 * Confluence Sync Service
 * Publishes Confluence export pages and attachments through the Confluence REST API.
 */

import { readFile } from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { marked } from 'marked';
import { setTimeout as delay } from 'timers/promises';

const DEFAULT_EXPORT_ROOT = './data/confluence/export';
const DEFAULT_CONFLUENCE_BASE_URL = 'https://sonicautomotive.atlassian.net/wiki';
const DEFAULT_CONFLUENCE_SPACE_KEY = 'TDE';
const DEFAULT_CONFLUENCE_PARENT_PAGE_ID = '2221670415';
const DEFAULT_SYNC_CONCURRENCY = 3;
const DEFAULT_ATTACHMENT_SYNC_CONCURRENCY = 2;
const DEFAULT_HTTP_RETRIES = 4;
const DEFAULT_HTTP_RETRY_BASE_MS = 750;
const MANIFEST_FILE_NAME = 'confluence-export-manifest.json';

function trimTrailingSlash(value) {
  return String(value || '').replace(/\/+$/, '');
}

function truthy(value) {
  return value === true || String(value || '').toLowerCase() === 'true' || value === '1';
}

function positiveInteger(value, fallback) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
}

function encodeBasicAuth(email, apiToken) {
  return Buffer.from(`${email}:${apiToken}`).toString('base64');
}

function cleanLabel(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 255);
}

function escapeCqlString(value) {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');
}

function pageStorageFromMarkdown(markdown) {
  const generatedNotice =
    '<p><strong>Generated content.</strong> Edit source markdown or extractor logic, not this page.</p>';
  return `${generatedNotice}\n${marked.parse(markdown || '')}`;
}

function contentTypeForAttachment(fileName) {
  if (/\.json$/i.test(fileName)) return 'application/json';
  if (/\.zip$/i.test(fileName)) return 'application/zip';
  if (/\.md$/i.test(fileName)) return 'text/markdown';
  return 'application/octet-stream';
}

export function loadConfluenceSyncConfig(env = process.env, overrides = {}) {
  return {
    baseUrl: trimTrailingSlash(
      overrides.baseUrl || env.CONFLUENCE_BASE_URL || DEFAULT_CONFLUENCE_BASE_URL
    ),
    spaceKey: overrides.spaceKey || env.CONFLUENCE_SPACE_KEY || DEFAULT_CONFLUENCE_SPACE_KEY,
    parentPageId: String(
      overrides.parentPageId || env.CONFLUENCE_PARENT_PAGE_ID || DEFAULT_CONFLUENCE_PARENT_PAGE_ID
    ).trim(),
    email: overrides.email || env.CONFLUENCE_EMAIL || '',
    apiToken: overrides.apiToken || env.CONFLUENCE_API_TOKEN || '',
    dryRun: overrides.dryRun ?? truthy(env.CONFLUENCE_DRY_RUN),
    publishObjectPages:
      overrides.publishObjectPages ?? env.CONFLUENCE_PUBLISH_OBJECT_PAGES !== 'false',
    publishAttachments:
      overrides.publishAttachments ?? env.CONFLUENCE_PUBLISH_ATTACHMENTS !== 'false',
    syncConcurrency: positiveInteger(
      overrides.syncConcurrency || env.CONFLUENCE_SYNC_CONCURRENCY,
      DEFAULT_SYNC_CONCURRENCY
    ),
    attachmentSyncConcurrency: positiveInteger(
      overrides.attachmentSyncConcurrency || env.CONFLUENCE_ATTACHMENT_SYNC_CONCURRENCY,
      DEFAULT_ATTACHMENT_SYNC_CONCURRENCY
    ),
  };
}

export function validateConfluenceSyncConfig(config, { requireCredentials = false } = {}) {
  const missing = [];
  if (!config.baseUrl) missing.push('CONFLUENCE_BASE_URL');
  if (!config.spaceKey) missing.push('CONFLUENCE_SPACE_KEY');
  if (!config.parentPageId) missing.push('CONFLUENCE_PARENT_PAGE_ID');
  if (requireCredentials && !config.email) missing.push('CONFLUENCE_EMAIL');
  if (requireCredentials && !config.apiToken) missing.push('CONFLUENCE_API_TOKEN');

  return {
    ok: missing.length === 0,
    missing,
  };
}

function confluenceHeaders(config, extra = {}) {
  return {
    Authorization: `Basic ${encodeBasicAuth(config.email, config.apiToken)}`,
    Accept: 'application/json',
    ...extra,
  };
}

function httpRetryCount(config) {
  return positiveInteger(
    config.httpRetries || process.env.CONFLUENCE_HTTP_RETRIES,
    DEFAULT_HTTP_RETRIES
  );
}

function httpRetryBaseMs(config) {
  return positiveInteger(
    config.httpRetryBaseMs || process.env.CONFLUENCE_HTTP_RETRY_BASE_MS,
    DEFAULT_HTTP_RETRY_BASE_MS
  );
}

function retryAfterMs(err, fallbackMs) {
  const retryAfter = Number(err.response?.headers?.['retry-after']);
  if (Number.isFinite(retryAfter) && retryAfter > 0) {
    return retryAfter * 1000;
  }
  return fallbackMs;
}

function isRetryableHttpError(err) {
  const status = err.response?.status;
  if ([429, 500, 502, 503, 504].includes(status)) return true;
  return ['ECONNRESET', 'ETIMEDOUT', 'ECONNABORTED', 'EAI_AGAIN'].includes(err.code);
}

function isDuplicateTitleError(err) {
  const message = String(err.response?.data?.message || err.message || '').toLowerCase();
  return err.response?.status === 400 && message.includes('page with this title already exists');
}

export function summarizeConfluenceError(err) {
  return {
    status: 'failed',
    code: err.code || err.response?.status || 'CONFLUENCE_SYNC_ERROR',
    message: err.message,
    httpStatus: err.response?.status || null,
    responseMessage:
      typeof err.response?.data?.message === 'string'
        ? err.response.data.message.slice(0, 500)
        : null,
    responseReason:
      typeof err.response?.data?.reason === 'string'
        ? err.response.data.reason.slice(0, 500)
        : null,
    target: err.syncTarget || null,
    method: err.config?.method || null,
    url: err.config?.url || err.request?._currentUrl || null,
  };
}

async function requestWithRetry(config, operation) {
  const retries = httpRetryCount(config);
  const baseMs = httpRetryBaseMs(config);
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await operation();
    } catch (err) {
      lastError = err;
      if (attempt >= retries || !isRetryableHttpError(err)) throw err;
      const waitMs = retryAfterMs(err, baseMs * 2 ** attempt);
      console.warn(
        `Confluence request retry ${attempt + 1}/${retries} after ${err.code || err.response?.status || err.message}; waiting ${waitMs}ms`
      );
      // eslint-disable-next-line no-await-in-loop
      await delay(waitMs);
    }
  }

  throw lastError;
}

function createHttp(config, httpClient = axios) {
  return {
    async get(url, options = {}) {
      return requestWithRetry(config, () =>
        httpClient.get(`${config.baseUrl}${url}`, {
          ...options,
          headers: {
            ...confluenceHeaders(config),
            ...(options.headers || {}),
          },
        })
      );
    },
    async post(url, data, options = {}) {
      return requestWithRetry(config, () =>
        httpClient.post(`${config.baseUrl}${url}`, data, {
          ...options,
          headers: {
            ...confluenceHeaders(config),
            ...(options.headers || {}),
          },
        })
      );
    },
    async put(url, data, options = {}) {
      return requestWithRetry(config, () =>
        httpClient.put(`${config.baseUrl}${url}`, data, {
          ...options,
          headers: {
            ...confluenceHeaders(config),
            ...(options.headers || {}),
          },
        })
      );
    },
    async delete(url, options = {}) {
      return requestWithRetry(config, () =>
        httpClient.delete(`${config.baseUrl}${url}`, {
          ...options,
          headers: {
            ...confluenceHeaders(config),
            ...(options.headers || {}),
          },
        })
      );
    },
  };
}

async function loadManifest(exportRoot) {
  const manifestPath = path.join(exportRoot, MANIFEST_FILE_NAME);
  return JSON.parse(await readFile(manifestPath, 'utf8'));
}

async function findChildPage(http, config, title, parentPageId = config.parentPageId) {
  const cql = `parent=${parentPageId} and type=page and title="${escapeCqlString(title)}"`;
  const response = await http.get('/rest/api/content/search', {
    params: {
      cql,
      expand: 'version,metadata.labels',
      limit: 25,
    },
  });
  const childPage = (response.data?.results || []).find((page) => page.title === title) || null;
  if (childPage) return childPage;

  const titleResponse = await http.get('/rest/api/content', {
    params: {
      title,
      spaceKey: config.spaceKey,
      type: 'page',
      expand: 'version,metadata.labels',
      limit: 1,
    },
  });
  const titledPage =
    (titleResponse.data?.results || []).find((page) => page.title === title) || null;
  if (titledPage) return titledPage;

  const spaceCql = `space="${escapeCqlString(config.spaceKey)}" and type=page and title="${escapeCqlString(title)}"`;
  const spaceResponse = await http.get('/rest/api/content/search', {
    params: {
      cql: spaceCql,
      expand: 'version,metadata.labels',
      limit: 25,
    },
  });
  return (spaceResponse.data?.results || []).find((page) => page.title === title) || null;
}

async function createPage(http, config, page, markdown, parentPageId = config.parentPageId) {
  const response = await http.post('/rest/api/content', {
    type: 'page',
    title: page.title,
    ancestors: [{ id: parentPageId }],
    space: { key: config.spaceKey },
    metadata: {
      labels: page.labels.map((label) => ({ prefix: 'global', name: cleanLabel(label) })),
    },
    body: {
      storage: {
        value: pageStorageFromMarkdown(markdown),
        representation: 'storage',
      },
    },
  });

  return {
    action: 'created',
    title: page.title,
    id: response.data?.id || null,
  };
}

async function updatePage(http, page, existingPage, markdown) {
  const nextVersion = Number(existingPage.version?.number || 1) + 1;
  const response = await http.put(`/rest/api/content/${existingPage.id}`, {
    id: existingPage.id,
    type: 'page',
    title: page.title,
    version: {
      number: nextVersion,
      message: `Automated lineage catalog sync ${new Date().toISOString()}`,
    },
    body: {
      storage: {
        value: pageStorageFromMarkdown(markdown),
        representation: 'storage',
      },
    },
  });

  return {
    action: 'updated',
    title: page.title,
    id: response.data?.id || existingPage.id,
    version: nextVersion,
  };
}

async function syncPage({ http, config, exportRoot, page, parentPageId = config.parentPageId }) {
  try {
    const markdown = await readFile(path.join(exportRoot, page.file), 'utf8');
    const existingPage = await findChildPage(http, config, page.title, parentPageId);
    if (existingPage) {
      return await updatePage(http, page, existingPage, markdown);
    }

    try {
      return await createPage(http, config, page, markdown, parentPageId);
    } catch (err) {
      if (!isDuplicateTitleError(err)) throw err;
      const duplicatePage = await findChildPage(http, config, page.title, parentPageId);
      if (!duplicatePage) throw err;
      return await updatePage(http, page, duplicatePage, markdown);
    }
  } catch (err) {
    err.syncTarget = {
      type: 'page',
      title: page.title,
      file: page.file,
      parentTitle: page.parent_title || null,
    };
    throw err;
  }
}

async function findAttachment(http, config, fileName) {
  const response = await http.get(`/rest/api/content/${config.parentPageId}/child/attachment`, {
    params: {
      filename: fileName,
      expand: 'version',
      limit: 1,
    },
  });
  return response.data?.results?.[0] || null;
}

async function attachmentForm(fileName, buffer, contentType) {
  const form = new FormData();
  form.append('file', new Blob([buffer], { type: contentType }), fileName);
  form.append('comment', `Automated lineage catalog sync ${new Date().toISOString()}`);
  return form;
}

async function createAttachment(http, config, attachment, buffer) {
  const contentType = attachment.content_type || contentTypeForAttachment(attachment.file_name);
  const form = await attachmentForm(attachment.file_name, buffer, contentType);
  const response = await http.post(
    `/rest/api/content/${config.parentPageId}/child/attachment`,
    form,
    {
      headers: {
        'X-Atlassian-Token': 'no-check',
      },
    }
  );

  return {
    action: 'created',
    fileName: attachment.file_name,
    id: response.data?.results?.[0]?.id || null,
  };
}

async function updateAttachment(http, config, attachment, existingAttachment, buffer) {
  const contentType = attachment.content_type || contentTypeForAttachment(attachment.file_name);
  const form = await attachmentForm(attachment.file_name, buffer, contentType);
  const response = await http.post(
    `/rest/api/content/${config.parentPageId}/child/attachment/${existingAttachment.id}/data`,
    form,
    {
      headers: {
        'X-Atlassian-Token': 'no-check',
      },
    }
  );

  return {
    action: 'updated',
    fileName: attachment.file_name,
    id: response.data?.id || existingAttachment.id,
  };
}

async function syncAttachment({ http, config, exportRoot, attachment }) {
  try {
    const buffer = await readFile(path.join(exportRoot, attachment.file));
    const existingAttachment = await findAttachment(http, config, attachment.file_name);
    if (existingAttachment) {
      return await updateAttachment(http, config, attachment, existingAttachment, buffer);
    }

    return await createAttachment(http, config, attachment, buffer);
  } catch (err) {
    err.syncTarget = {
      type: 'attachment',
      fileName: attachment.file_name,
      file: attachment.file,
    };
    throw err;
  }
}

function publishablePages(manifest, config) {
  return [
    ...(manifest.pages || []),
    ...(manifest.object_locator_pages || []),
    ...(manifest.quick_context_pages || []),
    ...(manifest.shard_pages || []),
    ...(config.publishObjectPages ? manifest.object_pages || [] : []),
  ].filter((page) => page.publish !== false);
}

function isGeneratedPage(page) {
  const title = String(page?.title || '');
  if (title.startsWith('[AUTO]')) return true;
  const labels = page?.metadata?.labels?.results || [];
  return labels.some((label) => ['generated', 'lineage-catalog'].includes(label.name));
}

async function listChildPages(http, parentPageId) {
  const pages = [];
  let start = 0;
  const limit = 100;

  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const response = await http.get(`/rest/api/content/${parentPageId}/child/page`, {
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

async function collectGeneratedPageTree(http, parentPageId) {
  const directChildren = await listChildPages(http, parentPageId);
  const generatedRoots = directChildren.filter(isGeneratedPage);
  return collectPageTree(http, generatedRoots);
}

async function collectLegacyAutoPageTree(http, parentPageId) {
  const directChildren = await listChildPages(http, parentPageId);
  const legacyRoots = directChildren.filter((page) =>
    String(page?.title || '').startsWith('[AUTO]')
  );
  return collectPageTree(http, legacyRoots);
}

async function collectPageTree(http, roots) {
  const collected = [];

  async function visit(page, depth) {
    const children = await listChildPages(http, page.id);
    for (const child of children) {
      // eslint-disable-next-line no-await-in-loop
      await visit(child, depth + 1);
    }
    collected.push({
      id: page.id,
      title: page.title,
      depth,
    });
  }

  for (const page of roots) {
    // eslint-disable-next-line no-await-in-loop
    await visit(page, 0);
  }

  return collected.sort((left, right) => right.depth - left.depth);
}

async function deleteGeneratedPages({ http, config }) {
  const pages = await collectGeneratedPageTree(http, config.parentPageId);
  return deletePageRecords({ http, pages });
}

async function deleteLegacyAutoPages({ http, config }) {
  const pages = await collectLegacyAutoPageTree(http, config.parentPageId);
  return deletePageRecords({ http, pages });
}

async function deletePageRecords({ http, pages }) {
  const results = [];

  for (const page of pages) {
    // eslint-disable-next-line no-await-in-loop
    await http.delete(`/rest/api/content/${page.id}`);
    results.push({
      action: 'deleted',
      id: page.id,
      title: page.title,
      depth: page.depth,
    });
  }

  return results;
}

async function deletePagesByTitle({ http, config, titles = [], parentTitle = null }) {
  const cleanTitles = titles.map((title) => String(title || '').trim()).filter(Boolean);
  if (cleanTitles.length === 0) return [];

  let { parentPageId } = config;
  if (parentTitle) {
    const parentPage = await findChildPage(http, config, parentTitle);
    if (!parentPage?.id) {
      throw new Error(`Cannot delete targeted Confluence pages; parent not found: ${parentTitle}`);
    }
    parentPageId = parentPage.id;
  }

  const results = [];
  for (const title of cleanTitles) {
    // eslint-disable-next-line no-await-in-loop
    const page = await findChildPage(http, config, title, parentPageId);
    if (!page?.id) {
      results.push({
        action: 'missing',
        title,
        parentTitle,
      });
      continue;
    }
    if (!isGeneratedPage(page)) {
      throw new Error(`Refusing to delete non-generated Confluence page title: ${title}`);
    }
    // eslint-disable-next-line no-await-in-loop
    await http.delete(`/rest/api/content/${page.id}`);
    results.push({
      action: 'deleted',
      id: page.id,
      title,
      parentTitle,
    });
  }

  return results;
}

function syncWarnings(manifest, config) {
  const warnings = [];
  if ((manifest.object_pages || []).length > 0 && !config.publishObjectPages) {
    warnings.push(
      'Governed asset detail pages are present but object page publishing is disabled.'
    );
  }
  if ((manifest.object_locator_pages || []).length === 0) {
    warnings.push(
      'No object locator pages were found. Ambiguous object-name searches may be slower.'
    );
  }
  if ((manifest.quick_context_pages || []).length === 0) {
    warnings.push('No lineage quick context pages were found. Object lookup may be slower.');
  }
  if ((manifest.shard_pages || []).length === 0) {
    warnings.push('No catalog shard pages were found. Rovo/Codex may only see summary pages.');
  }
  return warnings;
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = [];
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      // eslint-disable-next-line no-await-in-loop
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  });

  await Promise.all(workers);
  return results;
}

function dryRunResult({
  pages,
  attachments,
  manifest,
  config,
  deleteTitles = [],
  deleteParentTitle = null,
}) {
  return {
    mode: 'dry-run',
    status: 'ready',
    pages: pages.map((page) => ({
      title: page.title,
      file: page.file,
      parentTitle: page.parent_title || null,
      hash: page.hash,
      bytes: page.bytes,
    })),
    attachments: attachments.map((attachment) => ({
      fileName: attachment.file_name,
      file: attachment.file,
      hash: attachment.hash,
      bytes: attachment.bytes,
    })),
    deletePages: deleteTitles.map((title) => ({
      title,
      parentTitle: deleteParentTitle,
    })),
    warnings: syncWarnings(manifest, config),
  };
}

async function syncPagesInHierarchy({ http, config, exportRoot, pages }) {
  const results = [];
  const pageIdsByTitle = new Map();
  const rootPages = pages.filter((page) => !page.parent_title);
  const childPages = pages.filter((page) => page.parent_title);

  const rootResults = await mapWithConcurrency(rootPages, config.syncConcurrency, (page) =>
    syncPage({ http, config, exportRoot, page })
  );
  results.push(...rootResults);
  for (const result of rootResults) {
    if (result?.title && result?.id) pageIdsByTitle.set(result.title, result.id);
  }

  const missingParentTitles = Array.from(
    new Set(childPages.map((page) => page.parent_title))
  ).filter((title) => !pageIdsByTitle.has(title));
  for (const title of missingParentTitles) {
    // eslint-disable-next-line no-await-in-loop
    const existingParent = await findChildPage(http, config, title);
    if (existingParent?.id) pageIdsByTitle.set(title, existingParent.id);
  }

  let pending = childPages;
  while (pending.length > 0) {
    const ready = pending.filter((page) => pageIdsByTitle.has(page.parent_title));
    if (ready.length === 0) {
      const missingParents = Array.from(new Set(pending.map((page) => page.parent_title))).join(
        ', '
      );
      throw new Error(
        `Cannot publish child Confluence pages; missing parent page ids for: ${missingParents}`
      );
    }

    // eslint-disable-next-line no-await-in-loop
    const readyResults = await mapWithConcurrency(ready, config.syncConcurrency, (page) =>
      syncPage({
        http,
        config,
        exportRoot,
        page,
        parentPageId: pageIdsByTitle.get(page.parent_title),
      })
    );
    results.push(...readyResults);
    for (const result of readyResults) {
      if (result?.title && result?.id) pageIdsByTitle.set(result.title, result.id);
    }

    pending = pending.filter((page) => !ready.includes(page));
  }

  return results;
}

export async function syncConfluenceExport(options = {}) {
  const exportRoot = path.resolve(
    process.cwd(),
    options.exportRoot || process.env.CONFLUENCE_EXPORT_PATH || DEFAULT_EXPORT_ROOT
  );
  const manifest = await loadManifest(exportRoot);
  const config = loadConfluenceSyncConfig(process.env, options.config || {});
  const dryRun = options.dryRun ?? config.dryRun ?? true;
  const validation = validateConfluenceSyncConfig(config, { requireCredentials: !dryRun });

  if (!validation.ok) {
    return {
      mode: dryRun ? 'dry-run' : 'publish',
      status: 'blocked',
      missing: validation.missing,
      pages: [],
      attachments: [],
      warnings: ['Confluence configuration is incomplete.'],
    };
  }

  const onlyTitleSet = new Set(
    (options.onlyTitles || []).map((title) => String(title).trim()).filter(Boolean)
  );
  const pages = publishablePages(manifest, config).filter(
    (page) => onlyTitleSet.size === 0 || onlyTitleSet.has(page.title)
  );
  const skipAttachments = options.skipAttachments ?? onlyTitleSet.size > 0;
  const attachments =
    !skipAttachments && config.publishAttachments
      ? manifest.attachments.filter((attachment) => attachment.publish !== false)
      : [];
  const deleteTitles = (options.deleteTitles || [])
    .map((title) => String(title).trim())
    .filter(Boolean);
  const deleteParentTitle = options.deleteParentTitle || null;

  if (dryRun) {
    return dryRunResult({ pages, attachments, manifest, config, deleteTitles, deleteParentTitle });
  }

  const http = createHttp(config, options.httpClient);
  const replaceGenerated =
    options.replaceGenerated ?? truthy(process.env.CONFLUENCE_REPLACE_GENERATED);
  const deletedPages = replaceGenerated
    ? await deleteGeneratedPages({ http, config })
    : [
        ...(await deleteLegacyAutoPages({ http, config })),
        ...(await deletePagesByTitle({
          http,
          config,
          titles: deleteTitles,
          parentTitle: deleteParentTitle,
        })),
      ];

  const pageResults = await syncPagesInHierarchy({ http, config, exportRoot, pages });

  const attachmentResults = await mapWithConcurrency(
    attachments,
    config.attachmentSyncConcurrency,
    (attachment) => syncAttachment({ http, config, exportRoot, attachment })
  );

  return {
    mode: 'publish',
    status: 'published',
    pages: pageResults,
    attachments: attachmentResults,
    deletedPages,
    warnings: [],
  };
}

export { pageStorageFromMarkdown };

export default {
  loadConfluenceSyncConfig,
  pageStorageFromMarkdown,
  syncConfluenceExport,
  validateConfluenceSyncConfig,
};
