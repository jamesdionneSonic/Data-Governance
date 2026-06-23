import 'dotenv/config';

import fs from 'node:fs/promises';
import path from 'node:path';
import axios from 'axios';

import {
  CONFLUENCE_GENERATED_ROOT_PAGE_IDS,
  CONFLUENCE_SPACE,
} from '../src/config/confluencePageMap.js';

const shouldArchive = process.argv.includes('--archive');
const includeSsisdbSubtree = process.argv.includes('--include-ssisdb-subtree');
const outputRoot = path.resolve('docs/confluence-full-database-catalog-deployment');
const readbackJsonPath = path.join(outputRoot, 'FDP-08-legacy-database-catalog-cleanup-readback.json');
const readbackMarkdownPath = path.join(outputRoot, 'FDP-08-legacy-database-catalog-cleanup-readback.md');
const baseUrl = String(process.env.CONFLUENCE_BASE_URL || CONFLUENCE_SPACE.baseUrl).replace(/\/+$/, '');
const rootPageId = String(
  process.env.CONFLUENCE_HUMAN_LINEAGE_PARENT_PAGE_ID ||
    process.env.CONFLUENCE_PARENT_PAGE_ID ||
    CONFLUENCE_GENERATED_ROOT_PAGE_IDS.lineage
).trim();
const email = process.env.CONFLUENCE_EMAIL || '';
const apiToken = process.env.CONFLUENCE_API_TOKEN || '';

const canonicalOverrides = new Map([
  ['ssisdb', ['Database Catalog', 'SQL Server', 'SSIS']],
  ['eLeadDW_SF', ['Database Catalog', 'SQL Server', 'eLeadDW_SF']],
  ['CDK_ROADSTER_ELEAD_SONIC', ['Database Catalog', 'Snowflake', 'CDK_ROADSTER_ELEAD_SONIC']],
  ['HYPERNOVA_SONIC_CUSTACCESS', ['Database Catalog', 'Snowflake', 'HYPERNOVA_SONIC_CUSTACCESS']],
]);

function requiredConfig() {
  return [
    !baseUrl && 'CONFLUENCE_BASE_URL',
    !rootPageId && 'CONFLUENCE_HUMAN_LINEAGE_PARENT_PAGE_ID or CONFLUENCE_PARENT_PAGE_ID',
    !email && 'CONFLUENCE_EMAIL',
    !apiToken && 'CONFLUENCE_API_TOKEN',
  ].filter(Boolean);
}

function encodeBasicAuth() {
  return Buffer.from(`${email}:${apiToken}`).toString('base64');
}

function escapeCqlString(value) {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');
}

function pagePath(parts) {
  return ['Sonic Data Lineage', ...parts].join(' / ');
}

const http = axios.create({
  baseURL: baseUrl,
  proxy: false,
  headers: {
    Authorization: `Basic ${encodeBasicAuth()}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

async function writeText(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, value, 'utf8');
}

async function findChildPage(title, parentPageId) {
  const cql = `parent=${parentPageId} and type=page and title="${escapeCqlString(title)}"`;
  const response = await http.get('/rest/api/content/search', {
    params: {
      cql,
      expand: 'version,metadata.labels',
      limit: 25,
    },
  });
  const cqlMatch = (response.data?.results || []).find((page) => page.title === title);
  if (cqlMatch) return cqlMatch;

  const childResponse = await http.get(`/rest/api/content/${parentPageId}/child/page`, {
    params: {
      expand: 'version,metadata.labels',
      limit: 200,
    },
  });
  return (childResponse.data?.results || []).find((page) => page.title === title) || null;
}

async function listChildPages(parentPageId) {
  const pages = [];
  let start = 0;
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const response = await http.get(`/rest/api/content/${parentPageId}/child/page`, {
      params: {
        expand: 'version,metadata.labels',
        limit: 200,
        start,
      },
    });
    pages.push(...(response.data?.results || []));
    if (!response.data?._links?.next) break;
    start += 200;
  }
  return pages;
}

async function resolveTreePath(relativePath) {
  let pageId = rootPageId;
  const resolved = [{ title: 'Sonic Data Lineage', id: rootPageId }];
  for (const title of relativePath) {
    // eslint-disable-next-line no-await-in-loop
    const page = await findChildPage(title, pageId);
    if (!page) {
      return {
        found: false,
        page: null,
        resolved,
        missingTitle: title,
      };
    }
    pageId = page.id;
    resolved.push({
      title: page.title,
      id: page.id,
      version: page.version?.number || null,
      labels: (page.metadata?.labels?.results || []).map((label) => label.name),
    });
  }
  return {
    found: true,
    page: resolved.at(-1),
    resolved,
    missingTitle: '',
  };
}

async function childCount(pageId, childType) {
  const response = await http.get(`/rest/api/content/${pageId}/child/${childType}`, {
    params: { limit: 1 },
  });
  return Number(response.data?.size || 0);
}

async function pageRisk(pageId) {
  const directChildPages = await listChildPages(pageId).catch(() => []);
  const [childPages, attachments, comments] = await Promise.all([
    Promise.resolve(directChildPages.length),
    childCount(pageId, 'attachment').catch(() => -1),
    childCount(pageId, 'comment').catch(() => -1),
  ]);
  return {
    childPages,
    childPageTitles: directChildPages.map((page) => page.title),
    attachments,
    comments,
  };
}

async function archivePage(pageId) {
  const response = await http.post('/rest/api/content/archive', {
    pages: [{ id: String(pageId) }],
  });
  return response.data || {};
}

function canonicalPathForLegacyTitle(title) {
  if (canonicalOverrides.has(title)) return canonicalOverrides.get(title);
  const match = title.match(/^Database Catalog - (.+)$/);
  if (!match) return null;
  const database = match[1].trim();
  if (canonicalOverrides.has(database)) return canonicalOverrides.get(database);
  return ['Database Catalog', 'SQL Server', database];
}

function legacyDatabaseName(title) {
  return title.replace(/^Database Catalog - /, '').trim();
}

function markdownReadback(result) {
  const rows = result.candidates
    .map(
      (candidate) =>
        `| \`${candidate.title}\` | \`${candidate.page_id || ''}\` | \`${candidate.canonical_path || ''}\` | ${candidate.action} | ${candidate.skip_reasons.join('; ') || 'none'} |`
    )
    .join('\n');

  return `# FDP-08 Legacy Database Catalog Cleanup Readback

Generated: ${result.generated_at}

Cleanup mode: \`${result.cleanup_mode}\`

## Summary

| Signal | Value |
| --- | ---: |
| Direct children reviewed | ${result.summary.direct_children_reviewed} |
| Legacy candidates | ${result.summary.legacy_candidates} |
| Eligible for archive | ${result.summary.eligible_for_archive} |
| Archived | ${result.summary.archived} |
| Skipped | ${result.summary.skipped} |
| Canonical replacements not found | ${result.summary.canonical_replacements_not_found} |
| Skipped for live risk | ${result.summary.skipped_for_live_risk} |

## Candidates

| Legacy Page | Page ID | Canonical Replacement | Action | Reason |
| --- | --- | --- | --- | --- |
${rows || '| none |  |  |  |  |'}

## Guardrails

- Only direct children under \`Sonic Data Lineage / Database Catalog\` were considered.
- Only \`Database Catalog - <database>\` pages and the legacy \`ssisdb\` page were eligible.
- The legacy \`ssisdb\` page subtree is archived only when \`--include-ssisdb-subtree\` is passed and the child pages have no deeper children, attachments, or comments.
- Canonical platform/database replacement pages had to exist before archive.
- Pages with child pages, attachments, or comments were skipped.
`;
}

async function main() {
  const missing = requiredConfig();
  if (missing.length > 0) {
    console.log(JSON.stringify({ status: 'blocked', missing }, null, 2));
    process.exitCode = 1;
    return;
  }

  const databaseCatalog = await resolveTreePath(['Database Catalog']);
  if (!databaseCatalog.found) throw new Error('Could not resolve Sonic Data Lineage / Database Catalog.');

  const directChildren = await listChildPages(databaseCatalog.page.id);
  const legacyChildren = directChildren
    .filter((page) => page.title === 'ssisdb' || /^Database Catalog - /.test(page.title))
    .sort((left, right) => left.title.localeCompare(right.title));
  const candidates = [];

  for (const page of legacyChildren) {
    const canonicalPath = canonicalPathForLegacyTitle(page.title);
    // eslint-disable-next-line no-await-in-loop
    const canonicalResolved = canonicalPath ? await resolveTreePath(canonicalPath) : { found: false };
    // eslint-disable-next-line no-await-in-loop
    const risk = await pageRisk(page.id);
    const childArchiveCandidates = [];
    if (page.title === 'ssisdb' && includeSsisdbSubtree) {
      const children = await listChildPages(page.id);
      for (const child of children) {
        // eslint-disable-next-line no-await-in-loop
        const childRisk = await pageRisk(child.id);
        childArchiveCandidates.push({
          title: child.title,
          page_id: child.id,
          version: child.version?.number || null,
          risk: childRisk,
          eligible_for_archive:
            childRisk.childPages === 0 && childRisk.attachments === 0 && childRisk.comments === 0,
        });
      }
    }
    const skipReasons = [];
    if (!canonicalPath) skipReasons.push('no canonical path mapping');
    if (!canonicalResolved.found) skipReasons.push('canonical replacement not found');
    if (risk.childPages !== 0 && !(page.title === 'ssisdb' && includeSsisdbSubtree)) {
      skipReasons.push(`child page count is ${risk.childPages}`);
    }
    if (
      page.title === 'ssisdb' &&
      includeSsisdbSubtree &&
      childArchiveCandidates.some((child) => !child.eligible_for_archive)
    ) {
      skipReasons.push('ssisdb child page risk prevents subtree archive');
    }
    if (risk.attachments !== 0) skipReasons.push(`attachment count is ${risk.attachments}`);
    if (risk.comments !== 0) skipReasons.push(`comment count is ${risk.comments}`);
    const eligible = skipReasons.length === 0;
    let action = eligible ? 'would-archive' : 'skipped';
    let archiveResponse = null;
    if (shouldArchive && eligible) {
      for (const child of childArchiveCandidates) {
        // eslint-disable-next-line no-await-in-loop
        child.archive_response = await archivePage(child.page_id);
        child.action = 'archived';
      }
      // eslint-disable-next-line no-await-in-loop
      archiveResponse = await archivePage(page.id);
      action = 'archived';
    }

    candidates.push({
      title: page.title,
      database: legacyDatabaseName(page.title),
      page_id: page.id,
      version: page.version?.number || null,
      old_path: pagePath(['Database Catalog', page.title]),
      canonical_path: canonicalPath ? pagePath(canonicalPath) : '',
      canonical_page_id: canonicalResolved.page?.id || null,
      canonical_title: canonicalResolved.page?.title || null,
      risk,
      child_archive_candidates: childArchiveCandidates,
      eligible_for_archive: eligible,
      action,
      skip_reasons: skipReasons,
      archive_response: archiveResponse,
    });
  }

  const result = {
    status: shouldArchive ? 'legacy-cleanup-archive-run-complete' : 'dry-run',
    generated_at: new Date().toISOString(),
    rootPageId,
    databaseCatalogPageId: databaseCatalog.page.id,
    cleanup_mode: shouldArchive
      ? 'archive eligible legacy direct Database Catalog children'
      : 'dry-run only',
    summary: {
      direct_children_reviewed: directChildren.length,
      legacy_candidates: candidates.length,
      eligible_for_archive: candidates.filter((candidate) => candidate.eligible_for_archive).length,
      archived: candidates.filter((candidate) => candidate.action === 'archived').length,
      skipped: candidates.filter((candidate) => candidate.action === 'skipped').length,
      canonical_replacements_not_found: candidates.filter((candidate) =>
        candidate.skip_reasons.includes('canonical replacement not found')
      ).length,
      skipped_for_live_risk: candidates.filter((candidate) =>
        candidate.skip_reasons.some((reason) => /child page|attachment|comment/.test(reason))
      ).length,
    },
    candidates,
  };

  await writeText(readbackJsonPath, `${JSON.stringify(result, null, 2)}\n`);
  await writeText(readbackMarkdownPath, markdownReadback(result));
  console.log(JSON.stringify({ status: result.status, summary: result.summary, readback: readbackMarkdownPath }, null, 2));
}

await main();
