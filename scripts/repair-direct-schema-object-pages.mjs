import 'dotenv/config';

import fs from 'node:fs/promises';
import path from 'node:path';
import axios from 'axios';

import {
  CONFLUENCE_GENERATED_ROOT_PAGE_IDS,
  CONFLUENCE_SPACE,
} from '../src/config/confluencePageMap.js';

const shouldArchive = process.argv.includes('--archive');
const outputRootArgIndex = process.argv.indexOf('--output-root');
const outputRoot =
  outputRootArgIndex >= 0
    ? path.resolve(process.argv[outputRootArgIndex + 1] || '')
    : path.resolve('data/confluence/human-catalog-dry-run');
const readbackJsonPath = path.join(outputRoot, 'direct-schema-object-repair-readback.json');
const readbackMarkdownPath = path.join(outputRoot, 'direct-schema-object-repair-readback.md');
const baseUrl = String(process.env.CONFLUENCE_BASE_URL || CONFLUENCE_SPACE.baseUrl).replace(/\/+$/, '');
const rootPageId = String(
  process.env.CONFLUENCE_HUMAN_LINEAGE_PARENT_PAGE_ID ||
    process.env.CONFLUENCE_PARENT_PAGE_ID ||
    CONFLUENCE_GENERATED_ROOT_PAGE_IDS.lineage
).trim();
const email = process.env.CONFLUENCE_EMAIL || '';
const apiToken = process.env.CONFLUENCE_API_TOKEN || '';
const spaceKey = process.env.CONFLUENCE_SPACE_KEY || CONFLUENCE_SPACE.spaceKey;

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

function pagePath(parts) {
  return (parts || []).filter(Boolean).join(' / ');
}

function pageHasAncestor(page, ancestorId) {
  return (page?.ancestors || []).some((ancestor) => String(ancestor.id) === String(ancestorId));
}

function titleMatches(left, right) {
  return String(left || '').trim().toLowerCase() === String(right || '').trim().toLowerCase();
}

function schemaPageTreeTitle(database, schema) {
  const databaseName = String(database || 'unknown').trim() || 'unknown';
  const schemaName = String(schema || 'unknown').trim() || 'unknown';
  if (schemaName.toLowerCase().startsWith(`${databaseName.toLowerCase()}.`)) return schemaName;
  return `${databaseName}.${schemaName}`;
}

function objectTypeBucketTitle(type) {
  const normalized = String(type || '').trim().toLowerCase();
  if (normalized === 'table') return 'Tables';
  if (normalized === 'view') return 'Views';
  if (normalized === 'procedure') return 'Stored Procedures';
  if (normalized === 'function') return 'Functions';
  if (normalized === 'synonym') return 'Synonyms';
  return 'Other Objects';
}

function inferBucketTitleFromObjectName(schemaTitle, objectName) {
  const normalized = String(objectName || '').trim().toLowerCase();
  if (/^(vw|view)[_.]/.test(normalized)) return `${schemaTitle} Views`;
  if (/^(sp|usp)[_.]/.test(normalized)) return `${schemaTitle} Stored Procedures`;
  if (/^(fn|udf)[_.]/.test(normalized)) return `${schemaTitle} Functions`;
  return `${schemaTitle} Tables`;
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

async function withRetry(label, operation, attempts = 5) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await operation();
    } catch (err) {
      lastError = err;
      const status = err.response?.status;
      const retryable =
        status === 429 ||
        status >= 500 ||
        ['ECONNRESET', 'ETIMEDOUT', 'ECONNABORTED', 'EAI_AGAIN'].includes(err.code);
      if (!retryable || attempt === attempts) break;
      const waitMs = Math.min(30000, 1000 * 2 ** (attempt - 1));
      console.warn(`${label} hit a retryable Confluence error; retrying in ${Math.round(waitMs / 1000)}s (${attempt}/${attempts}).`);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
  const responseDetail = lastError?.response?.data ? ` ${JSON.stringify(lastError.response.data).slice(0, 500)}` : '';
  throw new Error(`${label} failed after retry attempts: ${lastError?.response?.status || lastError?.code || lastError?.message}${responseDetail}`);
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function writeText(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, value, 'utf8');
}

async function findSpacePagesByTitle(title) {
  const response = await withRetry(`find page ${title}`, () =>
    http.get('/rest/api/content', {
      params: {
        title,
        type: 'page',
        status: 'current',
        expand: 'version,ancestors',
        limit: 50,
      },
    })
  );
  return (response.data?.results || []).filter((page) => titleMatches(page.title, title) && pageHasAncestor(page, rootPageId));
}

async function findChildPageByTitle(title, parentPageId) {
  let start = 0;
  const limit = 100;
  while (true) {
    const response = await withRetry(`find child ${title} under ${parentPageId}`, () =>
      http.get(`/rest/api/content/${parentPageId}/child/page`, {
        params: {
          start,
          limit,
          expand: 'version,ancestors',
        },
      })
    );
    const results = response.data?.results || [];
    const match = results.find((page) => titleMatches(page.title, title));
    if (match) return match;
    if (results.length < limit) return null;
    start += limit;
  }
}

async function childCount(pageId, childType) {
  const response = await withRetry(`count ${childType} children for ${pageId}`, () =>
    http.get(`/rest/api/content/${pageId}/child/${childType}`, {
      params: { limit: 1 },
    })
  );
  return Number(response.data?.size || 0);
}

async function pageRisk(pageId) {
  const [childPages, attachments, comments] = await Promise.all([
    childCount(pageId, 'page').catch(() => -1),
    childCount(pageId, 'attachment').catch(() => -1),
    childCount(pageId, 'comment').catch(() => -1),
  ]);
  return { childPages, attachments, comments };
}

async function archivePage(pageId) {
  const response = await withRetry(`archive page ${pageId}`, () =>
    http.post('/rest/api/content/archive', {
      pages: [{ id: String(pageId) }],
    })
  );
  return response.data || {};
}

async function createBucketPage(title, parentPageId) {
  const body = `<h1>${title}</h1>
<p>This object-type bucket was created during direct schema object repair so legacy object pages can be grouped under the correct schema/type parent.</p>
<h2>Reviewed Catalog Children</h2>
<p>Legacy object pages under this bucket should be reconciled against the next full metadata ingestion and documentation refresh.</p>`;
  const response = await withRetry(`create bucket page ${title}`, () =>
    http.post('/rest/api/content', {
      type: 'page',
      title,
      space: { key: spaceKey },
      ancestors: [{ id: String(parentPageId) }],
      body: {
        storage: {
          value: body,
          representation: 'storage',
        },
      },
    })
  );
  return response.data || {};
}

async function movePageToParent(pageId, parentPageId) {
  const response = await withRetry(`move page ${pageId} under ${parentPageId}`, () =>
    http.put(`/rest/api/content/${pageId}/move/append/${parentPageId}`)
  );
  return response.data || {};
}

async function expectedCanonicalPages() {
  const manifest = await readJson(path.join(outputRoot, 'manifest.json'));
  const canonicalByTitle = new Map();
  for (const page of manifest.pages || []) {
    const treePath = page.treePath || [];
    if (treePath.length !== 7) continue;
    const title = treePath.at(-1);
    if (!canonicalByTitle.has(title)) canonicalByTitle.set(title, []);
    canonicalByTitle.get(title).push(treePath);
  }
  return canonicalByTitle;
}

async function catalogObjectsByFullName() {
  const entries = await fs.readdir(outputRoot, { withFileTypes: true });
  const schemaEvidenceFiles = entries
    .filter((entry) => entry.isFile() && /^schema-.*\.evidence\.json$/i.test(entry.name))
    .map((entry) => path.join(outputRoot, entry.name));
  const byFullName = new Map();
  for (const file of schemaEvidenceFiles) {
    // eslint-disable-next-line no-await-in-loop
    const packet = await readJson(file);
    for (const object of packet.catalog_slice?.objects || []) {
      const fullName = object.full_name || [object.database, object.schema, object.name].filter(Boolean).join('.');
      if (fullName) byFullName.set(fullName, object);
    }
  }
  return byFullName;
}

function markdownReadback(result) {
  const rows = result.candidates
    .slice(0, 500)
    .map(
      (candidate) =>
        `| \`${candidate.title}\` | \`${candidate.page_id || ''}\` | ${candidate.action} | ${candidate.skip_reasons.join('; ') || 'none'} |`
    )
    .join('\n');

  return `# Direct Schema Object Repair Readback

Generated: ${result.generated_at}

Repair mode: \`${result.repair_mode}\`

## Summary

| Signal | Value |
| --- | ---: |
| Failures reviewed | ${result.summary.failures_reviewed} |
| Direct pages reviewed | ${result.summary.direct_pages_reviewed} |
| Canonical replacements found | ${result.summary.canonical_replacements_found} |
| Excluded retired tables found | ${result.summary.excluded_retired_tables_found} |
| Eligible for archive | ${result.summary.eligible_for_archive} |
| Archived | ${result.summary.archived} |
| Eligible for move | ${result.summary.eligible_for_move} |
| Moved | ${result.summary.moved} |
| Skipped | ${result.summary.skipped} |
| Skipped for live risk | ${result.summary.skipped_for_live_risk} |

## Candidate Readback

| Page | Page ID | Action | Reason |
| --- | --- | --- | --- |
${rows || '| none |  |  |  |'}

## Guardrails

- Only direct object children reported by the published hierarchy check were considered.
- Pages were archived only when a canonical bucketed page exists or the page is an excluded retired-table candidate.
- Pages were moved only when they were the only available page and a typed bucket parent exists.
- Pages with child pages, attachments, or comments were skipped.
- The machine-readable lineage runtime registry was not modified by this cleanup.
`;
}

async function main() {
  const missing = requiredConfig();
  if (missing.length > 0) {
    console.log(JSON.stringify({ status: 'blocked', missing }, null, 2));
    process.exitCode = 1;
    return;
  }

  const [publishedCheck, supersededReport, canonicalByTitle, objectByFullName] = await Promise.all([
    readJson(path.join(outputRoot, 'published-check-readback.json')),
    readJson(path.join(outputRoot, 'superseded-pages-report.json')),
    expectedCanonicalPages(),
    catalogObjectsByFullName(),
  ]);
  const pageIdsByPath = new Map(
    (publishedCheck.checks || []).map((check) => [pagePath(check.treePath), String(check.id)])
  );
  const excludedRetiredTitles = new Set(
    (supersededReport.candidates || [])
      .filter((candidate) => candidate.candidate_type === 'excluded-obvious-retired-table')
      .map((candidate) => candidate.noncanonical_title)
  );
  const directFailures = (publishedCheck.failures || []).filter((failure) =>
    String(failure.message || '').includes('direct child of the schema page')
  );
  const candidates = [];

  for (const failure of directFailures) {
    const title = failure.treePath?.at?.(-1) || '';
    const canonicalPaths = canonicalByTitle.get(title) || [];
    const isExcludedRetiredTable = excludedRetiredTitles.has(title);
    const catalogObject = objectByFullName.get(title);
    const reportedSchemaPath = (failure.treePath || []).slice(0, 5);
    const reportedSchemaTitle = reportedSchemaPath.at(-1) || '';
    const reportedObjectName = title.startsWith(`${reportedSchemaTitle}.`) ? title.slice(`${reportedSchemaTitle}.`.length) : title;
    const schemaTitle = catalogObject ? schemaPageTreeTitle(catalogObject.database, catalogObject.schema) : reportedSchemaTitle;
    const bucketTitle = catalogObject
      ? `${schemaTitle} ${objectTypeBucketTitle(catalogObject.type)}`
      : inferBucketTitleFromObjectName(schemaTitle, reportedObjectName);
    let bucketPath = catalogObject
      ? pagePath(['Sonic Data Lineage', 'Database Catalog', catalogObject.platform, catalogObject.database, schemaTitle, bucketTitle])
      : pagePath([...reportedSchemaPath, bucketTitle]);
    let bucketPageId = bucketPath ? pageIdsByPath.get(bucketPath) : '';
    const schemaPageId = pageIdsByPath.get(pagePath(reportedSchemaPath)) || '';
    const pages = String(failure.id || '')
      ? [{ id: String(failure.id), title, ancestors: [] }]
      : await findSpacePagesByTitle(title);

    for (const page of pages) {
      const skipReasons = [];
      const risk = await pageRisk(page.id);
      const shouldArchiveCandidate = canonicalPaths.length > 0 || isExcludedRetiredTable;
      const canCreateBucket = !bucketPageId && Boolean(schemaPageId) && Boolean(bucketTitle);
      const shouldMoveCandidate = !shouldArchiveCandidate && (Boolean(bucketPageId) || canCreateBucket);
      if (shouldArchiveCandidate) {
        if (risk.childPages !== 0) skipReasons.push(`child page count is ${risk.childPages}`);
        if (risk.attachments !== 0) skipReasons.push(`attachment count is ${risk.attachments}`);
        if (risk.comments !== 0) skipReasons.push(`comment count is ${risk.comments}`);
      }
      if (!shouldArchiveCandidate && !shouldMoveCandidate) {
        skipReasons.push('canonical bucketed replacement and typed bucket target were not found');
      }
      const eligible = skipReasons.length === 0;
      let action = eligible ? (shouldMoveCandidate ? (bucketPageId ? 'would-move' : 'would-create-bucket-and-move') : 'would-archive') : 'skipped';
      let archiveResponse = null;
      let moveResponse = null;
      let bucketCreateResponse = null;
      if (shouldArchive && eligible && shouldArchiveCandidate) {
        archiveResponse = await archivePage(page.id);
        action = 'archived';
      }
      if (shouldArchive && eligible && shouldMoveCandidate) {
        if (!bucketPageId) {
          const existingBucket = await findChildPageByTitle(bucketTitle, schemaPageId);
          if (existingBucket) {
            bucketPageId = String(existingBucket.id || '');
          } else {
            bucketCreateResponse = await createBucketPage(bucketTitle, schemaPageId);
            bucketPageId = String(bucketCreateResponse.id || '');
          }
          bucketPath = pagePath([...reportedSchemaPath, bucketTitle]);
        }
        moveResponse = await movePageToParent(page.id, bucketPageId);
        action = bucketCreateResponse ? 'created-bucket-and-moved' : 'moved';
      }
      candidates.push({
        title,
        page_id: page.id,
        reported_path: pagePath(failure.treePath),
        canonical_paths: canonicalPaths.map((treePath) => pagePath(treePath)),
        excluded_retired_table: isExcludedRetiredTable,
        bucket_path: bucketPath,
        bucket_page_id: bucketPageId || null,
        risk,
        eligible_for_archive: eligible,
        action,
        skip_reasons: skipReasons,
        archive_response: archiveResponse,
        move_response: moveResponse,
        bucket_create_response: bucketCreateResponse,
      });
    }
  }

  const result = {
    status: shouldArchive ? 'direct-schema-object-repair-archive-run-complete' : 'dry-run',
    generated_at: new Date().toISOString(),
    rootPageId,
    repair_mode: shouldArchive ? 'archive stale direct schema object children' : 'dry-run only',
    summary: {
      failures_reviewed: directFailures.length,
      direct_pages_reviewed: candidates.length,
      canonical_replacements_found: candidates.filter((candidate) => candidate.canonical_paths.length > 0).length,
      excluded_retired_tables_found: candidates.filter((candidate) => candidate.excluded_retired_table).length,
      eligible_for_archive: candidates.filter((candidate) => candidate.action === 'would-archive' || candidate.action === 'archived').length,
      archived: candidates.filter((candidate) => candidate.action === 'archived').length,
      eligible_for_move: candidates.filter((candidate) =>
        ['would-move', 'would-create-bucket-and-move', 'moved', 'created-bucket-and-moved'].includes(candidate.action)
      ).length,
      moved: candidates.filter((candidate) => ['moved', 'created-bucket-and-moved'].includes(candidate.action)).length,
      skipped: candidates.filter((candidate) => candidate.action === 'skipped').length,
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

try {
  await main();
} catch (err) {
  console.error(JSON.stringify({ status: 'failed', message: err.message }, null, 2));
  process.exitCode = 1;
}
