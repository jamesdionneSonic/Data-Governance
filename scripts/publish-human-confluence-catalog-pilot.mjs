import 'dotenv/config';

import fs from 'node:fs/promises';
import path from 'node:path';
import axios from 'axios';
import { marked } from 'marked';

import {
  CONFLUENCE_GENERATED_ROOT_PAGE_IDS,
  CONFLUENCE_SPACE,
} from '../src/config/confluencePageMap.js';

const outputRoot = path.resolve('data/confluence/human-catalog-dry-run');
const publish = process.argv.includes('--publish');
const packetArgIndex = process.argv.indexOf('--packet');
const packetPath = packetArgIndex >= 0 ? path.resolve(process.argv[packetArgIndex + 1] || '') : '';
const outputRootArgIndex = process.argv.indexOf('--output-root');
const publishOutputRoot =
  outputRootArgIndex >= 0
    ? path.resolve(process.argv[outputRootArgIndex + 1] || '')
    : outputRoot;
const resumeAtIndex = process.argv.indexOf('--resume-at');
const resumeAtPath = resumeAtIndex >= 0 ? String(process.argv[resumeAtIndex + 1] || '').trim() : '';
const baseUrl = trimTrailingSlash(process.env.CONFLUENCE_BASE_URL || CONFLUENCE_SPACE.baseUrl);
const spaceKey = process.env.CONFLUENCE_SPACE_KEY || CONFLUENCE_SPACE.spaceKey;
const rootPageId = String(
  process.env.CONFLUENCE_HUMAN_LINEAGE_PARENT_PAGE_ID ||
    process.env.CONFLUENCE_PARENT_PAGE_ID ||
    CONFLUENCE_GENERATED_ROOT_PAGE_IDS.lineage
).trim();
const email = process.env.CONFLUENCE_EMAIL || '';
const apiToken = process.env.CONFLUENCE_API_TOKEN || '';
const defaultLabels = ['human-lineage-catalog', 'lineage-product-catalog', 'reviewed-slice'];

function trimTrailingSlash(value) {
  return String(value || '').replace(/\/+$/, '');
}

function encodeBasicAuth() {
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
  return marked.parse(markdown || '');
}

function headers(extra = {}) {
  return {
    Authorization: `Basic ${encodeBasicAuth()}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...extra,
  };
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function confluenceRequest(label, fn) {
  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await fn();
    } catch (error) {
      const status = error.response?.status;
      if (status !== 429 || attempt === maxAttempts) throw error;
      const retryAfter = Number(error.response?.headers?.['retry-after'] || 0);
      const delayMs = Math.max(retryAfter * 1000, attempt * 30000);
      console.warn(`${label} hit Confluence rate limit; retrying in ${Math.round(delayMs / 1000)}s (${attempt}/${maxAttempts}).`);
      // eslint-disable-next-line no-await-in-loop
      await sleep(delayMs);
    }
  }
  throw new Error(`${label} failed after retry attempts.`);
}

function requirePublishConfig() {
  const missing = [];
  if (!baseUrl) missing.push('CONFLUENCE_BASE_URL');
  if (!spaceKey) missing.push('CONFLUENCE_SPACE_KEY');
  if (!rootPageId) missing.push('CONFLUENCE_HUMAN_LINEAGE_PARENT_PAGE_ID or CONFLUENCE_PARENT_PAGE_ID');
  if (publish && !email) missing.push('CONFLUENCE_EMAIL');
  if (publish && !apiToken) missing.push('CONFLUENCE_API_TOKEN');
  if (missing.length > 0) {
    return { ok: false, missing };
  }
  return { ok: true, missing: [] };
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function loadPilotPages() {
  if (packetPath) return loadPacketPlan(packetPath);
  const manifest = await readJson(path.join(publishOutputRoot, 'manifest.json'));
  if (!Array.isArray(manifest.pages)) throw new Error('Dry-run manifest does not include a pages array.');
  const pages = [];
  for (const entry of manifest.pages) {
    const packet = await readJson(path.join(publishOutputRoot, entry.evidenceFile));
    const markdownFile = entry.markdownFile;
    const markdown = await fs.readFile(path.join(publishOutputRoot, markdownFile), 'utf8');
    pages.push({
      title: packet.page_title,
      treePath: packet.page_tree_path,
      markdownFile,
      markdown,
      evidenceHash: packet.evidence_hash,
      labels: defaultLabels,
    });
  }
  return pages.sort((left, right) => left.treePath.length - right.treePath.length);
}

async function loadPacketPlan(file) {
  const packet = await readJson(file);
  if (!Array.isArray(packet.planned_pages)) throw new Error(`Publish packet does not include planned_pages: ${file}`);
  const packetLabels = Array.isArray(packet.required_labels) && packet.required_labels.length > 0 ? packet.required_labels : defaultLabels;
  const pages = [];
  for (const page of packet.planned_pages) {
    if (page.kind === 'reference') {
      pages.push({
        kind: 'reference',
        title: page.title,
        treePath: page.treePath,
        markdown: '',
        evidenceHash: page.evidence_hash || '',
        labels: page.labels || packetLabels,
      });
      continue;
    }
    if (page.kind === 'leaf') {
      if (!page.evidence_file || !page.markdown_file) throw new Error(`Leaf page in publish packet is missing files: ${page.title}`);
      // eslint-disable-next-line no-await-in-loop
      const evidence = await readJson(path.join(publishOutputRoot, page.evidence_file));
      // eslint-disable-next-line no-await-in-loop
      const markdown = await fs.readFile(path.join(publishOutputRoot, page.markdown_file), 'utf8');
      pages.push({
        kind: 'leaf',
        title: page.title,
        treePath: evidence.page_tree_path,
        markdownFile: page.markdown_file,
        markdown,
        evidenceHash: evidence.evidence_hash,
        labels: page.labels || packetLabels,
      });
      continue;
    }
    if (page.kind === 'navigation') {
      pages.push({
        kind: 'navigation',
        title: page.title,
        treePath: page.treePath,
        markdown: '',
        evidenceHash: page.evidence_hash || '',
        labels: page.labels || packetLabels,
      });
    }
  }
  return pages.sort(
    (left, right) => left.treePath.length - right.treePath.length || left.treePath.join('/').localeCompare(right.treePath.join('/'))
  );
}

function parentMarkdown(title, children) {
  const childList = children.map((child) => `- ${child}`).join('\n') || '- No reviewed child pages in this pilot slice.';
  return `# ${title}

This is a reviewed human lineage catalog navigation page for the current generated slice.

## Reviewed Catalog Children

${childList}

## Publishing Boundary

This page is part of the human Confluence lineage catalog. It does not replace the DevOps/Azure lineage runtime package and does not move AI retrieval artifacts.
`;
}

function plannedPages(leafPages) {
  if (packetPath) {
    const pages = leafPages.map((page) => ({ ...page }));
    for (const page of pages.filter((item) => item.kind === 'navigation')) {
      const children = pages
        .filter((child) => child.treePath.length === page.treePath.length + 1)
        .filter((child) => child.treePath.slice(0, page.treePath.length).join(' / ') === page.treePath.join(' / '))
        .map((child) => child.title);
      page.markdown = parentMarkdown(page.title, children);
    }
    return pages;
  }
  const byPath = new Map();
  const addPage = (treePath, markdown, kind, evidenceHash = '', pageLabels = defaultLabels) => {
    const key = treePath.join(' / ');
    if (!byPath.has(key)) {
      byPath.set(key, {
        kind,
        title: treePath.at(-1),
        treePath,
        markdown,
        labels: pageLabels,
        evidenceHash,
      });
    }
  };

  for (const page of leafPages) {
    for (let index = 1; index < page.treePath.length; index += 1) {
      const treePath = page.treePath.slice(0, index + 1);
      if (index < page.treePath.length - 1) addPage(treePath, '', 'navigation', '', page.labels);
    }
    addPage(page.treePath, page.markdown, 'leaf', page.evidenceHash, page.labels);
  }

  const pages = [...byPath.values()].sort(
    (left, right) => left.treePath.length - right.treePath.length || left.treePath.join('/').localeCompare(right.treePath.join('/'))
  );

  for (const page of pages.filter((item) => item.kind === 'navigation')) {
    const children = pages
      .filter((child) => child.treePath.length === page.treePath.length + 1)
      .filter((child) => child.treePath.slice(0, page.treePath.length).join(' / ') === page.treePath.join(' / '))
      .map((child) => child.title);
    page.markdown = parentMarkdown(page.title, children);
  }

  return pages;
}

const http = axios.create({
  baseURL: baseUrl,
  headers: publish ? headers() : {},
  proxy: false,
});

async function findChildPage(title, parentPageId) {
  const childResponse = await confluenceRequest(`list child pages under ${parentPageId}`, () =>
    http.get(`/rest/api/content/${parentPageId}/child/page`, {
      params: {
        expand: 'version,metadata.labels',
        limit: 200,
      },
    })
  );
  const directChild = (childResponse.data?.results || []).find((page) => page.title === title && page.status !== 'archived');
  if (directChild) return directChild;

  const cql = `parent=${parentPageId} and type=page and title="${escapeCqlString(title)}"`;
  const response = await confluenceRequest(`find child page "${title}"`, () =>
    http.get('/rest/api/content/search', {
      params: {
        cql,
        expand: 'version,metadata.labels',
        limit: 25,
      },
    })
  );
  return (response.data?.results || []).find((page) => page.title === title && page.status !== 'archived') || null;
}

async function findSpacePageByTitle(title) {
  const response = await confluenceRequest(`find space page "${title}"`, () =>
    http.get('/rest/api/content', {
      params: {
        spaceKey,
        title,
        type: 'page',
        status: 'current',
        expand: 'version,metadata.labels,ancestors',
        limit: 25,
      },
    })
  );
  const matches = (response.data?.results || []).filter((page) => page.title === title);
  return matches[0] || null;
}

async function addLabels(pageId, pageLabels) {
  await confluenceRequest(`add labels to page ${pageId}`, () =>
    http.post(
      `/rest/api/content/${pageId}/label`,
      pageLabels.map((label) => ({ prefix: 'global', name: cleanLabel(label) }))
    )
  );
}

async function createPage(page, parentPageId) {
  let response;
  try {
    response = await confluenceRequest(`create page "${page.title}"`, () =>
      http.post('/rest/api/content', {
        type: 'page',
        title: page.title,
        ancestors: [{ id: parentPageId }],
        space: { key: spaceKey },
        metadata: {
          labels: page.labels.map((label) => ({ prefix: 'global', name: cleanLabel(label) })),
        },
        body: {
          storage: {
            value: pageStorageFromMarkdown(page.markdown),
            representation: 'storage',
          },
        },
      })
    );
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    if (/page already exists|same TITLE/i.test(message)) {
      const existingPage = await findSpacePageByTitle(page.title);
      if (existingPage) {
        return updatePage(page, existingPage, parentPageId);
      }
    }
    throw new Error(`Failed to create Confluence page "${page.title}" at "${page.treePath.join(' / ')}": ${message}`);
  }
  return {
    action: 'created',
    id: response.data?.id || null,
    title: page.title,
  };
}

async function updatePage(page, existingPage, parentPageId) {
  const nextVersion = Number(existingPage.version?.number || 1) + 1;
  const response = await confluenceRequest(`update page "${page.title}"`, () =>
    http.put(`/rest/api/content/${existingPage.id}`, {
      id: existingPage.id,
      type: 'page',
      title: page.title,
      ancestors: [{ id: parentPageId }],
      version: {
        number: nextVersion,
        message: `Human lineage catalog sync ${new Date().toISOString()}`,
      },
      body: {
        storage: {
          value: pageStorageFromMarkdown(page.markdown),
          representation: 'storage',
        },
      },
    })
  );
  await addLabels(existingPage.id, page.labels);
  return {
    action: 'updated',
    id: response.data?.id || existingPage.id,
    title: page.title,
    version: nextVersion,
  };
}

async function publishPlan(pages) {
  const pageIdsByPath = new Map([['Sonic Data Lineage', rootPageId]]);
  const results = [];
  let resumeReached = !resumeAtPath;

  for (const page of pages) {
    const fullPath = page.treePath.join(' / ');
    const parentPath = page.treePath.slice(0, -1).join(' / ');
    const parentPageId = pageIdsByPath.get(parentPath);
    if (!parentPageId) {
      throw new Error(`Missing parent page id for ${fullPath}`);
    }

    const existingPage = (await findChildPage(page.title, parentPageId)) || (await findSpacePageByTitle(page.title));
    if (!resumeReached && fullPath !== resumeAtPath) {
      if (!existingPage) throw new Error(`Resume could not resolve existing page before resume point: ${fullPath}`);
      pageIdsByPath.set(fullPath, existingPage.id);
      results.push({
        action: 'resume-skipped',
        id: existingPage.id,
        title: page.title,
        kind: page.kind,
        treePath: page.treePath,
        evidenceHash: page.evidenceHash || null,
      });
      continue;
    }
    if (!resumeReached && fullPath === resumeAtPath) resumeReached = true;
    if (page.kind === 'reference') {
      if (!existingPage) {
        throw new Error(`Required reference page was not found under expected parent: ${fullPath}`);
      }
      pageIdsByPath.set(fullPath, existingPage.id);
      results.push({
        action: 'referenced',
        id: existingPage.id,
        title: page.title,
        kind: page.kind,
        treePath: page.treePath,
        evidenceHash: page.evidenceHash || null,
      });
      continue;
    }

    const result = existingPage ? await updatePage(page, existingPage, parentPageId) : await createPage(page, parentPageId);
    pageIdsByPath.set(fullPath, result.id);
    results.push({
      ...result,
      kind: page.kind,
      treePath: page.treePath,
      evidenceHash: page.evidenceHash || null,
    });
  }
  if (resumeAtPath && !resumeReached) throw new Error(`Resume path was not found in publish plan: ${resumeAtPath}`);

  return results;
}

async function main() {
  const config = requirePublishConfig();
  if (!config.ok) {
    console.log(JSON.stringify({ status: 'blocked', missing: config.missing }, null, 2));
    process.exitCode = 1;
    return;
  }

  const leafPages = await loadPilotPages();
  const pages = plannedPages(leafPages);
  if (!publish) {
    console.log(
      JSON.stringify(
        {
          status: 'dry-run',
          rootPageId,
          publish: false,
          resumeAtPath: resumeAtPath || null,
          pages: pages.map((page) => ({
            kind: page.kind,
            title: page.title,
            treePath: page.treePath,
            labels: page.labels,
            evidenceHash: page.evidenceHash || null,
          })),
          rollback:
            'No live changes in dry-run. If published, use Confluence page history to restore previous versions or rerun this script after removing the catalog page from dry-run output.',
        },
        null,
        2
      )
    );
    return;
  }

  const results = await publishPlan(pages);
  console.log(
    JSON.stringify(
      {
        status: 'published',
        rootPageId,
        resumeAtPath: resumeAtPath || null,
        pages: results,
        spotCheckPaths: leafPages.map((page) => page.treePath.join(' / ')),
        rollback:
          'Use Confluence page history to restore prior versions for updated pages. Created catalog pages are labeled human-lineage-catalog and lineage-product-catalog for targeted cleanup if rollback is approved.',
      },
      null,
      2
    )
  );
}

await main();
