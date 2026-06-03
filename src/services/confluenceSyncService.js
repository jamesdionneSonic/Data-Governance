/**
 * Confluence Sync Service
 * Publishes Confluence export pages and attachments through the Confluence REST API.
 */

import { readFile } from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { marked } from 'marked';

const DEFAULT_EXPORT_ROOT = './data/confluence/export';
const DEFAULT_CONFLUENCE_BASE_URL = 'https://sonicautomotive.atlassian.net/wiki';
const DEFAULT_CONFLUENCE_SPACE_KEY = 'TDE';
const DEFAULT_CONFLUENCE_PARENT_PAGE_ID = '2221670415';
const DEFAULT_SYNC_CONCURRENCY = 6;
const DEFAULT_ATTACHMENT_SYNC_CONCURRENCY = 2;
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
  return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
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
      overrides.publishObjectPages ?? truthy(env.CONFLUENCE_PUBLISH_OBJECT_PAGES),
    publishAttachments: overrides.publishAttachments ?? env.CONFLUENCE_PUBLISH_ATTACHMENTS !== 'false',
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

function createHttp(config, httpClient = axios) {
  return {
    async get(url, options = {}) {
      return httpClient.get(`${config.baseUrl}${url}`, {
        ...options,
        headers: {
          ...confluenceHeaders(config),
          ...(options.headers || {}),
        },
      });
    },
    async post(url, data, options = {}) {
      return httpClient.post(`${config.baseUrl}${url}`, data, {
        ...options,
        headers: {
          ...confluenceHeaders(config),
          ...(options.headers || {}),
        },
      });
    },
    async put(url, data, options = {}) {
      return httpClient.put(`${config.baseUrl}${url}`, data, {
        ...options,
        headers: {
          ...confluenceHeaders(config),
          ...(options.headers || {}),
        },
      });
    },
  };
}

async function loadManifest(exportRoot) {
  const manifestPath = path.join(exportRoot, MANIFEST_FILE_NAME);
  return JSON.parse(await readFile(manifestPath, 'utf8'));
}

async function findChildPage(http, config, title) {
  const cql = `parent=${config.parentPageId} and type=page and title="${escapeCqlString(title)}"`;
  const response = await http.get('/rest/api/content/search', {
    params: {
      cql,
      expand: 'version',
      limit: 1,
    },
  });
  return response.data?.results?.[0] || null;
}

async function createPage(http, config, page, markdown) {
  const response = await http.post('/rest/api/content', {
    type: 'page',
    title: page.title,
    ancestors: [{ id: config.parentPageId }],
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

async function syncPage({ http, config, exportRoot, page }) {
  const markdown = await readFile(path.join(exportRoot, page.file), 'utf8');
  const existingPage = await findChildPage(http, config, page.title);
  if (existingPage) {
    return updatePage(http, page, existingPage, markdown);
  }

  return createPage(http, config, page, markdown);
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
  const buffer = await readFile(path.join(exportRoot, attachment.file));
  const existingAttachment = await findAttachment(http, config, attachment.file_name);
  if (existingAttachment) {
    return updateAttachment(http, config, attachment, existingAttachment, buffer);
  }

  return createAttachment(http, config, attachment, buffer);
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

function syncWarnings(manifest, config) {
  const warnings = [];
  if ((manifest.object_pages || []).length > 0 && !config.publishObjectPages) {
    warnings.push('Legacy object pages are present in the manifest but are not published by default.');
  }
  if ((manifest.object_locator_pages || []).length === 0) {
    warnings.push('No object locator pages were found. Ambiguous object-name searches may be slower.');
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

function dryRunResult({ manifest, config }) {
  const pageCandidates = publishablePages(manifest, config);
  const attachmentCandidates = config.publishAttachments
    ? manifest.attachments.filter((attachment) => attachment.publish !== false)
    : [];

  return {
    mode: 'dry-run',
    status: 'ready',
    pages: pageCandidates.map((page) => ({
      title: page.title,
      file: page.file,
      hash: page.hash,
      bytes: page.bytes,
    })),
    attachments: attachmentCandidates.map((attachment) => ({
      fileName: attachment.file_name,
      file: attachment.file,
      hash: attachment.hash,
      bytes: attachment.bytes,
    })),
    warnings: syncWarnings(manifest, config),
  };
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

  if (dryRun) {
    return dryRunResult({ manifest, config });
  }

  const http = createHttp(config, options.httpClient);
  const pages = publishablePages(manifest, config);
  const attachments = config.publishAttachments
    ? manifest.attachments.filter((attachment) => attachment.publish !== false)
    : [];

  const pageResults = await mapWithConcurrency(
    pages,
    config.syncConcurrency,
    (page) => syncPage({ http, config, exportRoot, page })
  );

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
