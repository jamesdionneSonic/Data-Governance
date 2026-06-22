import fs from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const packageRoot = path.resolve(
  process.env.LINEAGE_RUNTIME_PACKAGE_ROOT ||
    'data/lineage-runtime-package/sonic-data-lineage-runtime'
);
const focusObjectId = process.env.LINEAGE_RUNTIME_SKILL_OBJECT_ID || 'L1-5FSQL-01.Sonic_DW.dbo.factFIRE';
const focusDatabase = process.env.LINEAGE_RUNTIME_SKILL_DATABASE || 'Sonic_DW';

function fail(failures, prompt, message) {
  failures.push({ prompt, message });
}

async function exists(relativePath) {
  try {
    await fs.access(path.join(packageRoot, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(packageRoot, relativePath), 'utf8'));
}

async function findCanonicalObject(objectId) {
  const file = path.join(packageRoot, 'registry/canonical-objects.jsonl');
  const rl = readline.createInterface({
    input: createReadStream(file, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    if (!line.trim()) continue;
    const row = JSON.parse(line);
    if (row.object_id === objectId) return row;
  }
  return null;
}

async function findTopUsedIndex(database) {
  const dir = path.join(packageRoot, 'indexes/top-used');
  const files = await fs.readdir(dir);
  const match = files.find((file) => file.toLowerCase().startsWith(`${database.toLowerCase()}--`));
  return match ? `indexes/top-used/${match}` : '';
}

function artifactLine(latest, artifacts) {
  return `Evidence: package ${latest.version}, hash ${latest.runtime_content_hash}; artifacts: ${artifacts.join(', ')}.`;
}

function assertArtifactPaths(failures, prompt, paths) {
  for (const artifactPath of paths.filter(Boolean)) {
    if (/confluence/i.test(artifactPath)) {
      fail(failures, prompt, `Artifact path should not route through Confluence: ${artifactPath}`);
    }
    if (/^data\/markdown/i.test(artifactPath) || /^servers\//i.test(artifactPath)) {
      fail(failures, prompt, `Skill smoke should not use local source markdown path: ${artifactPath}`);
    }
  }
}

async function main() {
  const failures = [];
  const manifest = await readJson('manifest.json');
  const latest = await readJson('latest.json');
  const entrypoints = await readJson('indexes/entrypoints.json');
  const pathContract = await readJson('indexes/path-contract.json');
  const artifactManifest = await readJson('indexes/artifact-manifest.json');

  const requiredIntentCards = [
    'catalog.databases',
    'database.most_used_tables',
    'table.tell_me_about',
    'table.profile_summary',
    'object.where_used',
    'object.what_feeds',
    'object.impact',
    'package.what_runs',
    'procedure.business_logic',
  ];

  for (const intent of requiredIntentCards) {
    const intentPath = entrypoints.common_intents?.[intent];
    if (!intentPath) {
      fail(failures, 'intent-routing', `Missing intent route for ${intent}.`);
      continue;
    }
    // eslint-disable-next-line no-await-in-loop
    if (!(await exists(intentPath))) fail(failures, 'intent-routing', `Intent route does not exist: ${intentPath}`);
  }

  if (!pathContract.supported_patterns?.profile_index_object) {
    fail(failures, 'profile-routing', 'Path contract does not advertise profile-index object route.');
  }
  if (
    !artifactManifest.capabilities?.profile_index?.available ||
    !artifactManifest.entrypoints?.profile_manifest?.available ||
    !artifactManifest.entrypoints?.profile_latest_summary?.available
  ) {
    fail(failures, 'profile-routing', 'Artifact manifest does not mark profile-index manifest available.');
  }

  const row = await findCanonicalObject(focusObjectId);
  if (!row) {
    fail(failures, 'object-resolution', `Could not resolve ${focusObjectId} from canonical registry.`);
  }

  const cards = row?.answer_cards || {};
  const summary = cards.summary ? await readJson(cards.summary) : null;
  const usage = cards.usage_count ? await readJson(cards.usage_count) : null;
  const upstream = cards.upstream ? await readJson(cards.upstream) : null;
  const downstream = cards.downstream ? await readJson(cards.downstream) : null;
  const profileTeaser = cards.profile_teaser ? await readJson(cards.profile_teaser) : null;
  const compact = row?.compact_context_pack_path ? await readJson(row.compact_context_pack_path) : null;
  const catalog = await readJson('answers/catalog/databases.json');
  const topUsedPath = await findTopUsedIndex(focusDatabase);
  const topUsed = topUsedPath ? await readJson(topUsedPath) : null;
  const profileManifest = await readJson('profile-index/manifest.json');
  const profileLatest = await readJson('profile-index/latest-summary.json');

  if (!summary?.answer?.summary?.includes(row?.object_name || 'factFIRE')) {
    fail(failures, 'table.tell_me_about', 'Summary answer does not identify the focus object in plain English.');
  }
  if (!summary?.object?.confidence_label) {
    fail(failures, 'explain confidence', 'Summary answer does not expose confidence label.');
  }
  for (const flag of ['canonical', 'duplicate', 'unresolved_server']) {
    if (!Object.hasOwn(summary?.object || {}, flag)) {
      fail(failures, 'ambiguity and unresolved warnings', `Summary answer does not expose ${flag} flag.`);
    }
  }
  if (!summary?.answer?.semantic_downstream_counts || !Object.hasOwn(summary.answer.semantic_downstream_counts, 'loaders')) {
    fail(failures, 'semantic grouping', 'Summary answer does not expose semantic downstream loader grouping.');
  }
  if (Number(usage?.answer?.total_direct_usage_count || 0) <= 0) {
    fail(failures, 'how many times is this used?', 'Usage-count answer does not expose direct usage count.');
  }
  if (Number(upstream?.answer?.count || 0) <= 0 || !upstream.answer.object_ids?.some((id) => id.includes('.dtsx'))) {
    fail(failures, 'what feeds this?', 'Upstream answer does not expose SSIS package feeders.');
  }
  if (Number(downstream?.answer?.count || 0) <= 0) {
    fail(failures, 'what uses this?', 'Downstream answer does not expose downstream consumers.');
  }
  const groupedCounts = downstream?.answer?.grouped_counts || {};
  for (const group of ['business_consumers', 'maintenance_reads', 'orchestrators']) {
    if (!Object.hasOwn(groupedCounts, group)) {
      fail(failures, 'semantic grouping', `Downstream answer missing grouped count for ${group}.`);
    }
  }
  if (downstream?.answer?.truncated !== true) {
    fail(failures, 'truncation warning', 'Downstream answer should expose truncation status for long consumer lists.');
  }
  if (!compact?.confidence?.label || compact.confidence.label !== row?.confidence_label) {
    fail(failures, 'compact context confidence', 'Compact context pack does not expose matching confidence label.');
  }
  if (Number(compact?.columns?.count || 0) <= 0) {
    fail(failures, 'column impact', 'Compact context pack does not expose table column count for column-impact framing.');
  }
  if (!upstream?.answer?.object_ids?.some((id) => id.includes('ssis_column_mappings'))) {
    fail(failures, 'column impact', 'Upstream answer does not expose SSIS column mapping artifacts for column-impact follow-up.');
  }
  if (!catalog.databases?.some((item) => item.database === focusDatabase)) {
    fail(failures, 'database summary', `${focusDatabase} is missing from catalog database answer.`);
  }
  if (!topUsedPath || !Array.isArray(topUsed?.objects) || topUsed.objects.length === 0) {
    fail(failures, 'top-used objects', `Top-used index for ${focusDatabase} is missing or empty.`);
  }
  if (profileTeaser?.answer?.profile_available === true) {
    const profilePath = profileTeaser.paths?.by_object_id;
    if (!profilePath || !(await exists(profilePath))) {
      fail(failures, 'profile summary', 'Profile teaser says profile is available but profile-index object path is missing.');
    }
    if (!String(profilePath).startsWith('profile-index/')) {
      fail(failures, 'profile routing', 'Profile teaser does not route to profile-index first.');
    }
  } else if (profileLatest.profile_index_safe !== true) {
    fail(failures, 'profile summary', 'Profile teaser unavailable and profile latest summary is not safety-marked.');
  }
  const profileSafety = profileManifest.safety || profileManifest;
  if (profileSafety.profile_index_safe !== true || profileLatest.profile_index_safe !== true) {
    fail(failures, 'profile-index safety', 'Profile-index manifests are not safety-marked.');
  }

  const prompts = [
    {
      prompt: 'what uses factFIRE?',
      artifacts: [cards.downstream, row.compact_context_pack_path],
      answer: `factFIRE has ${downstream?.answer?.count ?? 0} downstream uses, including ${groupedCounts.business_consumers ?? 0} business consumers and ${groupedCounts.orchestrators ?? 0} orchestrators.`,
    },
    {
      prompt: 'what feeds factFIRE?',
      artifacts: [cards.upstream],
      answer: `factFIRE is fed by ${upstream?.answer?.count ?? 0} upstream package or mapping artifacts.`,
    },
    {
      prompt: 'what breaks if factFIRE changes?',
      artifacts: [cards.downstream, row.compact_context_pack_path],
      answer: `Changes can affect downstream FIRE procedures, views, and business consumers; the downstream answer is truncated=${downstream?.answer?.truncated === true}.`,
    },
    {
      prompt: 'how many times is factFIRE used?',
      artifacts: [cards.usage_count],
      answer: `The package reports ${usage?.answer?.total_direct_usage_count ?? 0} direct upstream/downstream references.`,
    },
    {
      prompt: 'profile summary for factFIRE',
      artifacts: [cards.profile_teaser, profileTeaser?.paths?.by_object_id || 'profile-index/latest-summary.json'],
      answer:
        profileTeaser?.answer?.profile_available === true
          ? `Profile evidence is available via profile-index with row_count=${profileTeaser.answer.profile_summary?.row_count ?? 'unknown'}.`
          : 'Profile detail is not available for this object; profile-index latest summary is safety-marked.',
    },
    {
      prompt: 'show column impact for factFIRE',
      artifacts: [cards.upstream, cards.downstream, row.compact_context_pack_path],
      answer: `Column-level names are not exposed in the compact card, so answer with table-level impact, ${compact?.columns?.count ?? 0} column count, column confidence ${compact?.confidence?.column ?? 'unknown'}, and SSIS mapping artifacts for deeper review.`,
    },
    {
      prompt: 'database summary for Sonic_DW',
      artifacts: ['answers/catalog/databases.json'],
      answer: `${focusDatabase} is listed in the catalog database answer.`,
    },
    {
      prompt: 'top-used Sonic_DW objects',
      artifacts: [topUsedPath],
      answer: `${focusDatabase} top-used index has ${topUsed?.objects?.length ?? 0} ranked objects.`,
    },
    {
      prompt: 'explain confidence for factFIRE',
      artifacts: [cards.summary, row.compact_context_pack_path],
      answer: `factFIRE has confidence label ${summary?.object?.confidence_label}; compact context label ${compact?.confidence?.label}.`,
    },
    {
      prompt: 'explain ambiguity, stale source, and unresolved facts for factFIRE',
      artifacts: [cards.summary, 'latest.json'],
      answer: `factFIRE canonical=${summary?.object?.canonical === true}, duplicate=${summary?.object?.duplicate === true}, unresolved_server=${summary?.object?.unresolved_server === true}; package generated_at=${latest.generated_at || manifest.generated_at}.`,
    },
  ];

  for (const item of prompts) {
    const artifacts = item.artifacts.filter(Boolean);
    assertArtifactPaths(failures, item.prompt, artifacts);
    for (const artifactPath of artifacts) {
      // eslint-disable-next-line no-await-in-loop
      if (!(await exists(artifactPath))) fail(failures, item.prompt, `Artifact does not exist: ${artifactPath}`);
    }
    item.evidence = artifactLine(latest, artifacts);
  }

  const result = {
    status: failures.length > 0 ? 'failed' : 'passed',
    packageRoot,
    packageName: manifest.package_name || latest.package_name,
    packageVersion: latest.version || manifest.version,
    runtimeContentHash: latest.runtime_content_hash || null,
    focusObjectId,
    focusDatabase,
    prompts,
    checks: {
      commonIntentCards: requiredIntentCards.length,
      profileIndexSafe: profileSafety.profile_index_safe === true && profileLatest.profile_index_safe === true,
      confluenceUsed: false,
      localSourceMarkdownUsed: false,
      pathGuessingUsed: false,
    },
    failures,
  };

  console.log(JSON.stringify(result, null, 2));
  if (failures.length > 0) process.exitCode = 1;
}

await main();
