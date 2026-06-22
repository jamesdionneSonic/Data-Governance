import 'dotenv/config';

import fs from 'node:fs/promises';
import path from 'node:path';
import axios from 'axios';

import {
  CONFLUENCE_GENERATED_ROOT_PAGE_IDS,
  CONFLUENCE_SPACE,
} from '../src/config/confluencePageMap.js';

const shouldArchive = process.argv.includes('--archive');
const oldPathFilter = process.argv
  .find((arg) => arg.startsWith('--old-path='))
  ?.slice('--old-path='.length);
const reportPath = path.resolve('data/confluence/human-catalog-dry-run/superseded-pages-report.json');
const outputRoot = path.resolve('docs/confluence-full-database-catalog-deployment');
const readbackJsonPath = path.join(outputRoot, 'FDP-07-live-cleanup-readback.json');
const readbackMarkdownPath = path.join(outputRoot, 'FDP-07-live-cleanup-readback.md');
const baseUrl = String(process.env.CONFLUENCE_BASE_URL || CONFLUENCE_SPACE.baseUrl).replace(/\/+$/, '');
const spaceKey = process.env.CONFLUENCE_SPACE_KEY || CONFLUENCE_SPACE.spaceKey;
const rootPageId = String(
  process.env.CONFLUENCE_HUMAN_LINEAGE_PARENT_PAGE_ID ||
    process.env.CONFLUENCE_PARENT_PAGE_ID ||
    CONFLUENCE_GENERATED_ROOT_PAGE_IDS.lineage
).trim();
const email = process.env.CONFLUENCE_EMAIL || '';
const apiToken = process.env.CONFLUENCE_API_TOKEN || '';

function encodeBasicAuth() {
  return Buffer.from(`${email}:${apiToken}`).toString('base64');
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

function pagePath(values) {
  return (values || []).filter(Boolean).join(' / ');
}

function splitPath(value) {
  return String(value || '')
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean);
}

function liveTitleForCanonicalPath(treePath) {
  const databaseCatalogIndex = treePath.indexOf('Database Catalog');
  if (databaseCatalogIndex < 0) return treePath.at(-1);
  const relative = treePath.slice(databaseCatalogIndex + 1);
  if (relative.length === 2) return `${relative[0]}.${relative[1]}`;
  if (relative.length === 3) return `${relative[0]}.${relative[1]}.${relative[2]}`;
  return treePath.at(-1);
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

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

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

async function resolveTreePath(treePath, { canonicalTitles = false } = {}) {
  let pageId = rootPageId;
  const resolved = [{ title: treePath[0], expectedTitle: treePath[0], id: rootPageId }];
  for (let index = 1; index < treePath.length; index += 1) {
    const logicalPath = treePath.slice(0, index + 1);
    const expectedTitle = canonicalTitles ? liveTitleForCanonicalPath(logicalPath) : treePath[index];
    // eslint-disable-next-line no-await-in-loop
    const page = await findChildPage(expectedTitle, pageId);
    if (!page) {
      return {
        found: false,
        page: null,
        resolved,
        missingTitle: expectedTitle,
        logicalTreePath: treePath,
      };
    }
    pageId = page.id;
    resolved.push({
      title: page.title,
      expectedTitle,
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
    logicalTreePath: treePath,
  };
}

async function childCount(pageId, childType) {
  const response = await http.get(`/rest/api/content/${pageId}/child/${childType}`, {
    params: {
      limit: 1,
    },
  });
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

function cleanupDecision(oldResolved, canonicalResolved, risk) {
  const skipReasons = [];
  if (!oldResolved.found) skipReasons.push('old page not found');
  if (!canonicalResolved.found) skipReasons.push('canonical replacement not found');
  if (oldResolved.found && risk.childPages !== 0) skipReasons.push(`child page count is ${risk.childPages}`);
  if (oldResolved.found && risk.attachments !== 0) skipReasons.push(`attachment count is ${risk.attachments}`);
  if (oldResolved.found && risk.comments !== 0) skipReasons.push(`comment count is ${risk.comments}`);
  return {
    eligible: skipReasons.length === 0,
    skipReasons,
  };
}

async function archivePage(pageId) {
  const response = await http.post('/rest/api/content/archive', {
    pages: [{ id: String(pageId) }],
  });
  return response.data || {};
}

function markdownReadback(result) {
  const archivedRows = result.candidates
    .filter((candidate) => candidate.action === 'archived')
    .map(
      (candidate) =>
        `| ${candidate.candidate_type} | \`${candidate.old_path}\` | \`${candidate.old_page_id}\` | \`${candidate.canonical_path}\` |`
    )
    .join('\n');
  const skippedRows = result.candidates
    .filter((candidate) => candidate.action !== 'archived')
    .slice(0, 40)
    .map(
      (candidate) =>
        `| ${candidate.candidate_type} | \`${candidate.old_path}\` | ${candidate.action} | ${candidate.skip_reasons.join('; ') || 'none'} |`
    )
    .join('\n');

  return `# FDP-07 Live Cleanup Readback

Generated: ${result.generated_at}

## Scope

This run processed superseded Database Catalog cleanup candidates from:

\`data/confluence/human-catalog-dry-run/superseded-pages-report.json\`

Cleanup mode: \`${result.cleanup_mode}\`

## Summary

| Signal | Value |
| --- | ---: |
| Candidates reviewed | ${result.summary.candidates_reviewed} |
| Eligible for archive | ${result.summary.eligible_for_archive} |
| Archived | ${result.summary.archived} |
| Skipped | ${result.summary.skipped} |
| Old pages not found | ${result.summary.old_pages_not_found} |
| Canonical replacements not found | ${result.summary.canonical_replacements_not_found} |
| Skipped for live risk | ${result.summary.skipped_for_live_risk} |

## Archived Pages

${archivedRows ? `| Type | Old Path | Page ID | Canonical Replacement |\n| --- | --- | --- | --- |\n${archivedRows}` : 'No pages were archived in this run.'}

## Skipped Pages

${skippedRows ? `| Type | Old Path | Action | Reason |\n| --- | --- | --- | --- |\n${skippedRows}` : 'No skipped pages.'}

Only the first 40 skipped pages are shown here. See
\`docs/confluence-full-database-catalog-deployment/FDP-07-live-cleanup-readback.json\`
for the full candidate-level readback.

## Guardrails

- Cleanup used live Confluence page resolution before acting.
- Candidates were archived only when the canonical replacement was found.
- Candidates with child pages, attachments, comments, or unresolved risk signals were skipped.
- No canonical Database Catalog or Rovo pages were archived.
- No SSIS package/catalog artifacts from \`ssisdb\` were added to Database Catalog.
`;
}

async function main() {
  const missing = requiredConfig();
  if (missing.length > 0) {
    console.log(JSON.stringify({ status: 'blocked', missing }, null, 2));
    process.exitCode = 1;
    return;
  }

  const report = await readJson(reportPath);
  const candidates = [];
  const sourceCandidates = oldPathFilter
    ? (report.candidates || []).filter((candidate) => candidate.noncanonical_path === oldPathFilter)
    : report.candidates || [];

  if (oldPathFilter && sourceCandidates.length === 0) {
    throw new Error(`No cleanup candidate found for --old-path=${oldPathFilter}`);
  }

  for (const candidate of sourceCandidates) {
    const oldTreePath = splitPath(candidate.noncanonical_path);
    const canonicalTreePath = splitPath(candidate.canonical_path);
    // eslint-disable-next-line no-await-in-loop
    const oldResolved = await resolveTreePath(oldTreePath);
    // eslint-disable-next-line no-await-in-loop
    const canonicalResolved = await resolveTreePath(canonicalTreePath, { canonicalTitles: true });
    // eslint-disable-next-line no-await-in-loop
    const risk = oldResolved.found ? await pageRisk(oldResolved.page.id) : { childPages: null, attachments: null, comments: null };
    const decision = cleanupDecision(oldResolved, canonicalResolved, risk);
    let action = decision.eligible ? 'would-archive' : 'skipped';
    let archiveResponse = null;
    if (shouldArchive && decision.eligible) {
      // eslint-disable-next-line no-await-in-loop
      archiveResponse = await archivePage(oldResolved.page.id);
      action = 'archived';
    }
    candidates.push({
      candidate_type: candidate.candidate_type,
      old_path: candidate.noncanonical_path,
      old_page_id: oldResolved.page?.id || null,
      old_page_title: oldResolved.page?.title || null,
      canonical_path: candidate.canonical_path,
      canonical_page_id: canonicalResolved.page?.id || null,
      canonical_page_title: canonicalResolved.page?.title || null,
      risk,
      eligible_for_archive: decision.eligible,
      action,
      skip_reasons: decision.skipReasons,
      archive_response: archiveResponse,
    });
  }

  const result = {
    status: shouldArchive ? 'cleanup-archive-run-complete' : 'dry-run',
    generated_at: new Date().toISOString(),
    rootPageId,
    cleanup_mode: shouldArchive ? 'archive eligible superseded pages' : 'dry-run only',
    summary: {
      candidates_reviewed: candidates.length,
      eligible_for_archive: candidates.filter((candidate) => candidate.eligible_for_archive).length,
      archived: candidates.filter((candidate) => candidate.action === 'archived').length,
      skipped: candidates.filter((candidate) => candidate.action === 'skipped').length,
      old_pages_not_found: candidates.filter((candidate) => candidate.skip_reasons.includes('old page not found')).length,
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
