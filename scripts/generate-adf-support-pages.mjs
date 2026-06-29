import fs from 'node:fs';
import path from 'node:path';

import { createDeltaScope } from '../engines/connectors/metadata-delta/index.js';

const root = process.cwd();
const profileRoot = path.join(root, 'data', 'markdown', '_runtime', 'profile-runs');
const connectorId = process.env.ADF_CONNECTOR_ID || 'azure-data-factory-adf-dw-marketing-prod';
const docsRoot = path.join(root, 'docs', 'adf-support-documentation');
const htmlRoot = path.join(root, 'tmp', 'adf-confluence-html');
const manifestPath = path.join(root, 'tmp', 'adf-support-documentation-manifest.json');

function argValue(name, fallback = '') {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] || fallback : fallback;
}

function loadDeltaScope() {
  const deltaManifestPath = argValue('delta-manifest');
  if (!deltaManifestPath) return createDeltaScope(null);
  const manifest = JSON.parse(fs.readFileSync(path.resolve(deltaManifestPath), 'utf8'));
  if (manifest.schema_version !== '1.0') {
    throw new Error(`Unsupported source metadata delta schema_version '${manifest.schema_version}'.`);
  }
  return createDeltaScope(manifest);
}

function adfCandidateIds(assetType, name) {
  const cleanName = String(name || '').trim();
  return [
    connectorId,
    cleanName,
    `${connectorId}:${cleanName}`,
    `${connectorId}:${assetType}:${cleanName}`,
    `adf:${connectorId}:${assetType}:${cleanName}`,
    `azure-data-factory:${connectorId}:${assetType}:${cleanName}`,
  ].filter(Boolean);
}

const deltaScope = loadDeltaScope();

function cleanGeneratedDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) cleanGeneratedDirectory(full);
    if (entry.isFile()) {
      try {
        fs.unlinkSync(full);
      } catch {
        // Best-effort cleanup only; the generated manifest controls publish scope.
      }
    }
  }
}

cleanGeneratedDirectory(docsRoot);
cleanGeneratedDirectory(htmlRoot);
fs.mkdirSync(docsRoot, { recursive: true });
fs.mkdirSync(htmlRoot, { recursive: true });
fs.mkdirSync(path.dirname(manifestPath), { recursive: true });

function latestProfileArtifact() {
  const dir = path.join(profileRoot, connectorId);
  if (!fs.existsSync(dir)) {
    throw new Error(`ADF profile artifact directory not found: ${dir}`);
  }
  const files = fs.readdirSync(dir)
    .filter((file) => file.endsWith('.json') && !file.endsWith('devops-upload-pending.json'))
    .map((file) => path.join(dir, file))
    .sort((left, right) => fs.statSync(right).mtimeMs - fs.statSync(left).mtimeMs);
  if (!files.length) throw new Error(`No ADF profile JSON artifacts found in ${dir}`);
  return files[0];
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function clean(value) {
  return String(value ?? '').replace(/\r\n/g, '\n').trim();
}

function md(value) {
  return clean(value).replace(/\|/g, '\\|') || 'not surfaced in metadata';
}

function code(value) {
  const text = clean(value);
  return text ? `\`${text.replace(/`/g, '')}\`` : '`not surfaced in metadata`';
}

function slug(value) {
  return clean(value)
    .replace(/[<>:"/\\|?*]+/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 150);
}

function htmlEsc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inline(value) {
  return htmlEsc(value).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function htmlFor(markdown) {
  const lines = markdown.split('\n');
  let html = '';
  let tableRows = [];
  let inTable = false;
  let inOl = false;
  let inUl = false;

  function closeLists() {
    if (inOl) { html += '</ol>'; inOl = false; }
    if (inUl) { html += '</ul>'; inUl = false; }
  }
  function flushTable() {
    if (!inTable) return;
    html += '<table><tbody>';
    for (const row of tableRows) {
      if (/^\s*\|?\s*-+\s*\|/.test(row)) continue;
      const cells = row.split('|').slice(1, -1);
      html += `<tr>${cells.map((cell) => `<td>${inline(cell.trim())}</td>`).join('')}</tr>`;
    }
    html += '</tbody></table>';
    tableRows = [];
    inTable = false;
  }

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith('|')) {
      closeLists();
      inTable = true;
      tableRows.push(line);
      continue;
    }
    flushTable();
    if (!line.trim()) {
      closeLists();
      continue;
    }
    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading) {
      closeLists();
      const level = heading[1].length;
      html += `<h${level}>${inline(heading[2])}</h${level}>`;
      continue;
    }
    const ol = /^\d+\.\s+(.+)$/.exec(line);
    if (ol) {
      if (!inOl) { closeLists(); html += '<ol>'; inOl = true; }
      html += `<li>${inline(ol[1])}</li>`;
      continue;
    }
    const ul = /^-\s+(.+)$/.exec(line);
    if (ul) {
      if (!inUl) { closeLists(); html += '<ul>'; inUl = true; }
      html += `<li>${inline(ul[1])}</li>`;
      continue;
    }
    closeLists();
    html += `<p>${inline(line)}</p>`;
  }
  flushTable();
  closeLists();
  return html;
}

function groupBy(rows, keyFn) {
  const map = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(row);
  }
  return map;
}

function prop(item) {
  return item?.attributes?.properties || {};
}

function activities(pipeline) {
  return Array.isArray(prop(pipeline).activities) ? prop(pipeline).activities : [];
}

function pipelineFolder(pipeline) {
  return prop(pipeline).folder?.name || 'root';
}

function pipelineParameters(pipeline) {
  return Object.keys(prop(pipeline).parameters || {});
}

function calledPipelineNames(pipeline) {
  const names = [];
  for (const activity of activities(pipeline)) {
    if (activity.type !== 'ExecutePipeline') continue;
    const reference = activity.typeProperties?.pipeline?.referenceName;
    if (reference) names.push(reference);
  }
  return [...new Set(names)];
}

function datasetRefsFromActivity(activity, direction) {
  const rows = direction === 'input' ? activity.inputs : activity.outputs;
  return Array.isArray(rows) ? rows.map((row) => row.referenceName).filter(Boolean) : [];
}

function sourceDatasets(pipeline) {
  return [...new Set(activities(pipeline).flatMap((activity) => datasetRefsFromActivity(activity, 'input')))];
}

function targetDatasets(pipeline) {
  return [...new Set(activities(pipeline).flatMap((activity) => datasetRefsFromActivity(activity, 'output')))];
}

function storedProcedures(pipeline) {
  const values = [];
  for (const activity of activities(pipeline)) {
    const sourceProc = activity.typeProperties?.source?.sqlReaderStoredProcedureName;
    const proc = activity.typeProperties?.storedProcedureName;
    if (sourceProc) values.push(sourceProc);
    if (proc) values.push(proc);
  }
  return [...new Set(values)];
}

function pipelineRole(pipeline, parentMap) {
  const name = pipeline.name;
  const calls = calledPipelineNames(pipeline);
  if (name === 'pl_Marketing_AWS_Export') return 'root orchestrator';
  if (calls.length) return 'orchestrator';
  if ((parentMap.get(name) || []).length) return 'child pipeline';
  return 'standalone or utility pipeline';
}

function statusSignal(pipeline, triggerRows) {
  if (triggerRows.some((trigger) => trigger.attributes?.properties?.runtimeState === 'Started')) return 'scheduled active';
  if (pipeline.name?.toLowerCase().includes('history')) return 'history/backfill candidate';
  return 'metadata available';
}

function firstCheck(pipeline, role) {
  if (role.includes('root')) {
    return `Check the latest ${pipeline.name} parent run, then identify any failed child pipeline before rerunning individual child steps.`;
  }
  if (role.includes('child')) {
    return `Check whether the parent orchestrator passed operational IDs into ${pipeline.name}; do not start this child with blank parameters.`;
  }
  return `Check the latest ADF pipeline run for ${pipeline.name} and confirm source and target datasets are available.`;
}

function businessUse(pipeline, role, sources, targets, calls) {
  const lower = pipeline.name.toLowerCase();
  if (lower.includes('marketing_aws_export')) {
    return 'Use this workflow for the Marketing AWS export process. It creates operational process-log identifiers, coordinates child mapping and MDP export steps, and keeps the scheduled export path moving.';
  }
  if (lower.includes('org_mappings')) {
    return 'Use this pipeline to refresh organization mapping crosswalks used by downstream marketing, MDP, or DMS/eLead processing.';
  }
  if (lower.includes('individual')) {
    return 'Use this pipeline to move individual/person identity data used by downstream marketing and customer matching processes.';
  }
  if (lower.includes('vehicleinterest') || lower.includes('purchaseinfo') || lower.includes('activity')) {
    return 'Use this pipeline to refresh marketing activity, vehicle interest, or purchase detail used by downstream export and analytics processes.';
  }
  const sourceText = sources.length ? sources.slice(0, 3).join(', ') : 'source datasets not surfaced in metadata';
  const targetText = targets.length ? targets.slice(0, 3).join(', ') : calls.length ? `child pipelines ${calls.slice(0, 3).join(', ')}` : 'target outputs not surfaced in metadata';
  return `${pipeline.name} is a ${role} that connects ${sourceText} to ${targetText}.`;
}

function pipelineMarkdown(pipeline, parentMap, triggerMap, sourceArtifact) {
  const role = pipelineRole(pipeline, parentMap);
  const calls = calledPipelineNames(pipeline);
  const parents = parentMap.get(pipeline.name) || [];
  const sources = sourceDatasets(pipeline);
  const targets = targetDatasets(pipeline);
  const procedures = storedProcedures(pipeline);
  const triggerRows = triggerMap.get(pipeline.name) || [];
  const params = pipelineParameters(pipeline);
  const check = firstCheck(pipeline, role);
  const use = businessUse(pipeline, role, sources, targets, calls);
  const supportStart = check.replace(/^Check\s+/i, 'checking ');
  const purpose = `${pipeline.name} is an ADF ${role} in ${pipelineFolder(pipeline)}. ${use} If it fails, downstream marketing export or mapping data may be stale or incomplete. Start troubleshooting by ${supportStart}`;

  return `# ${pipeline.name}

Generated: ${new Date().toISOString()}
ADF factory: \`adf-dw-marketing-prod\`
Source profile artifact: \`${path.relative(root, sourceArtifact).replaceAll('\\', '/')}\`

## Plain-English Summary

${purpose}

## At a Glance

| Field | Value |
| --- | --- |
| Platform | ADF |
| Asset type | Pipeline |
| Native path | ${code(pipeline.external_id || pipeline.id)} |
| Support role | ${md(role)} |
| Business process | ${md(use)} |
| Primary source | ${md(sources.slice(0, 5).join(', ') || 'not surfaced in metadata')} |
| Primary target/output | ${md(targets.slice(0, 5).join(', ') || calls.slice(0, 5).join(', ') || 'not surfaced in metadata')} |
| Schedule or trigger | ${md(triggerRows.map((trigger) => trigger.name).join(', ') || 'not directly triggered')} |
| Runtime/usage signal | Metadata profiled at ${md(pipeline.evidence?.extracted_at || 'not surfaced in metadata')} |
| Status signal | ${md(statusSignal(pipeline, triggerRows))} |
| Evidence | ${code(path.relative(root, sourceArtifact).replaceAll('\\', '/'))} |

## Business Use

${use}

## Support Checks

1. ${check}
2. Confirm the pipeline parameters are supplied by the parent, trigger, or documented default path.
3. Confirm source datasets are available: ${sources.length ? sources.map(code).join(', ') : '`not surfaced in metadata`'}.
4. Confirm target datasets or child pipelines completed: ${targets.length ? targets.map(code).join(', ') : calls.length ? calls.map(code).join(', ') : '`not surfaced in metadata`'}.
5. If process-log procedures are involved, validate the process execution log before rerunning child steps.

## Lineage And Dependencies

| Dependency type | Values |
| --- | --- |
| Parent pipelines | ${md(parents.join(', ') || 'not surfaced in metadata')} |
| Child pipelines | ${md(calls.join(', ') || 'none surfaced')} |
| Source datasets | ${md(sources.join(', ') || 'not surfaced in metadata')} |
| Target datasets | ${md(targets.join(', ') || 'not surfaced in metadata')} |
| Stored procedures | ${md(procedures.join(', ') || 'none surfaced')} |

## Runtime Or Usage Signals

The current support cache is metadata-based. Use ADF run history for live status before operational decisions. For the scheduled Marketing AWS export, recent metadata showed the parent orchestrator pattern creates process execution IDs before child pipelines run.

## Technical Details

| Activity | Type | Inputs | Outputs |
| --- | --- | --- | --- |
${activities(pipeline).map((activity) => `| ${md(activity.name)} | ${md(activity.type)} | ${md(datasetRefsFromActivity(activity, 'input').join(', ') || '')} | ${md(datasetRefsFromActivity(activity, 'output').join(', ') || '')} |`).join('\n') || '| not surfaced in metadata |  |  |  |'}

## Evidence And Caveats

- This page is generated from the saved ADF connector profile, not from raw business data.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
`;
}

function overviewMarkdown({ profile, pipelines, triggers, datasets, connections, sourceArtifact }) {
  const folders = groupBy(pipelines, pipelineFolder);
  const activeTriggers = triggers.filter((trigger) => trigger.attributes?.properties?.runtimeState === 'Started');
  return `# adf-dw-marketing-prod

Generated: ${new Date().toISOString()}
Saved connector: \`${connectorId}\`
Source profile artifact: \`${path.relative(root, sourceArtifact).replaceAll('\\', '/')}\`

## Plain-English Summary

\`adf-dw-marketing-prod\` supports the scheduled Marketing AWS export and related marketing/MDP data movement. The factory coordinates root pipelines, child mapping pipelines, datasets, linked services, and triggers. If this factory or its root orchestrator fails, downstream marketing export and mapping data can be stale or incomplete. Start troubleshooting with the active trigger, the parent pipeline run, and then the failed child pipeline.

## At a Glance

| Field | Value |
| --- | --- |
| Platform | ADF |
| Asset type | Data factory |
| Native path | \`adf-dw-marketing-prod\` |
| Support role | Factory / support section root |
| Business process | Marketing AWS export and marketing data movement |
| Primary source | ${md(datasets.slice(0, 5).map((d) => d.name).join(', ') || 'not surfaced in metadata')} |
| Primary target/output | Marketing AWS export and downstream mapping/MDP datasets |
| Schedule or trigger | ${md(activeTriggers.map((trigger) => trigger.name).join(', ') || 'not surfaced in metadata')} |
| Runtime/usage signal | Profiled at ${md(profile.generated_at || 'not surfaced in metadata')} |
| Status signal | ${activeTriggers.length ? 'scheduled active' : 'metadata available'} |
| Evidence | ${code(path.relative(root, sourceArtifact).replaceAll('\\', '/'))} |

## Business Use

This factory keeps marketing export workflows and cross-system mapping refreshes organized in ADF. Support should treat \`pl_Marketing_AWS_Export\` as the current operational root and use child pipeline pages to understand specific mapping or data movement steps.

## Support Checks

1. Confirm the active trigger schedule and target pipeline.
2. Check the latest \`pl_Marketing_AWS_Export\` parent run.
3. If the parent failed, identify the failed child pipeline and inspect that page.
4. Do not start child pipelines with blank operational parameters.
5. Confirm source and target datasets or linked services are available before rerunning.

## Inventory

| Asset type | Count |
| --- | ---: |
| Pipelines | ${pipelines.length} |
| Triggers | ${triggers.length} |
| Datasets | ${datasets.length} |
| Linked services | ${connections.length} |
| Folders | ${folders.size} |

## Pipeline Folders

| Folder | Pipelines |
| --- | ---: |
${[...folders.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([folder, rows]) => `| ${md(folder)} | ${rows.length} |`).join('\n')}

## Evidence And Caveats

- This overview is generated from saved connector metadata and does not publish secrets or raw activity output.
- Runtime values are support signals as of generation time, not service-level guarantees.
`;
}

function triggerMarkdown(trigger, sourceArtifact) {
  const properties = trigger.attributes?.properties || {};
  const pipelineRefs = properties.pipelines || [];
  const targets = pipelineRefs.map((item) => item.pipelineReference?.referenceName).filter(Boolean);
  const recurrence = properties.typeProperties?.recurrence;
  const schedule = recurrence
    ? `${recurrence.frequency || 'frequency not surfaced'} every ${recurrence.interval || 1}; time zone ${recurrence.timeZone || 'not surfaced'}`
    : 'not surfaced in metadata';
  return `# ${trigger.name}

## Plain-English Summary

${trigger.name} is an ADF trigger for ${targets.map(code).join(', ') || '`not surfaced in metadata`'}. It matters because it starts the scheduled marketing workflow; if it is stopped or misconfigured, downstream export and mapping data may not refresh on time. Start troubleshooting by confirming trigger state, schedule, and the latest target pipeline run.

## At a Glance

| Field | Value |
| --- | --- |
| Platform | ADF |
| Asset type | Trigger |
| Native path | ${code(trigger.external_id || trigger.id)} |
| Support role | Schedule / operational entry point |
| Business process | Marketing AWS export scheduling |
| Primary source | ADF trigger schedule |
| Primary target/output | ${md(targets.join(', ') || 'not surfaced in metadata')} |
| Schedule or trigger | ${md(schedule)} |
| Runtime/usage signal | Runtime state: ${md(properties.runtimeState || 'not surfaced in metadata')} |
| Status signal | ${md(properties.runtimeState || 'metadata available')} |
| Evidence | ${code(path.relative(root, sourceArtifact).replaceAll('\\', '/'))} |

## Business Use

Use this page to confirm when ADF is expected to start the Marketing AWS export process and which root pipeline receives the trigger.

## Support Checks

1. Confirm the trigger state is started.
2. Confirm the target pipeline is the expected root orchestrator.
3. Check the latest target pipeline run around the scheduled time.
4. If the target pipeline did not start, validate trigger configuration and ADF permissions.

## Evidence And Caveats

- Trigger parameters are documented only when surfaced by ADF metadata.
- Do not change trigger state or schedule as part of documentation refresh.
`;
}

const sourceArtifact = latestProfileArtifact();
const artifact = readJson(sourceArtifact);
const run = artifact.run || artifact;
const profile = run.profile?.profile || {};
const pipelines = (Array.isArray(profile.pipelines) ? profile.pipelines : [])
  .filter((item) => item.object_type === 'adf_pipeline');
const triggers = Array.isArray(profile.schedules) ? profile.schedules : [];
const datasets = Array.isArray(profile.datasets) ? profile.datasets : [];
const connections = Array.isArray(profile.connections) ? profile.connections : [];
const scopedPipelines = deltaScope.active
  ? pipelines.filter((pipeline) => deltaScope.includesAny(adfCandidateIds('pipeline', pipeline.name)))
  : pipelines;
const scopedTriggers = deltaScope.active
  ? triggers.filter((trigger) => deltaScope.includesAny(adfCandidateIds('trigger', trigger.name)))
  : triggers;

const parentMap = new Map();
for (const pipeline of pipelines) {
  for (const child of calledPipelineNames(pipeline)) {
    if (!parentMap.has(child)) parentMap.set(child, []);
    parentMap.get(child).push(pipeline.name);
  }
}

const triggerMap = new Map();
for (const trigger of triggers) {
  const refs = trigger.attributes?.properties?.pipelines || [];
  for (const ref of refs) {
    const name = ref.pipelineReference?.referenceName;
    if (!name) continue;
    if (!triggerMap.has(name)) triggerMap.set(name, []);
    triggerMap.get(name).push(trigger);
  }
}

const manifest = [];
function writePage(title, markdown) {
  const fileBase = slug(title);
  const markdownPath = path.join(docsRoot, `${fileBase}.md`);
  const htmlPath = path.join(htmlRoot, `${fileBase}.html`);
  fs.writeFileSync(markdownPath, `${markdown.trimEnd()}\n`);
  fs.writeFileSync(htmlPath, `${htmlFor(markdown).trimEnd()}\n`);
  manifest.push({
    title,
    markdownFile: path.relative(root, markdownPath).replaceAll('\\', '/'),
    htmlFile: path.relative(root, htmlPath).replaceAll('\\', '/'),
  });
}

const factoryChanged = deltaScope.includesAny(adfCandidateIds('factory', 'adf-dw-marketing-prod'));
const shouldWriteOverview = !deltaScope.active || factoryChanged || scopedTriggers.length > 0 || scopedPipelines.length > 0;
if (shouldWriteOverview) {
  writePage('adf-dw-marketing-prod', overviewMarkdown({ profile, pipelines, triggers, datasets, connections, sourceArtifact }));
  for (const changedId of deltaScope.changed_object_ids) {
    if (deltaScope.active) {
      deltaScope.recordTargetArtifact(changedId, 'support-docs', 'docs/adf-support-documentation/adf-dw-marketing-prod.md');
    }
  }
  for (const trigger of scopedTriggers) {
    writePage(trigger.name, triggerMarkdown(trigger, sourceArtifact));
    for (const candidateId of adfCandidateIds('trigger', trigger.name)) {
      if (deltaScope.changed_object_ids.has(candidateId)) {
        deltaScope.recordTargetArtifact(candidateId, 'support-docs', `docs/adf-support-documentation/${slug(trigger.name)}.md`);
      }
    }
  }
  for (const pipeline of scopedPipelines.sort((a, b) => a.name.localeCompare(b.name))) {
    writePage(pipeline.name, pipelineMarkdown(pipeline, parentMap, triggerMap, sourceArtifact));
    for (const candidateId of adfCandidateIds('pipeline', pipeline.name)) {
      if (deltaScope.changed_object_ids.has(candidateId)) {
        deltaScope.recordTargetArtifact(candidateId, 'support-docs', `docs/adf-support-documentation/${slug(pipeline.name)}.md`);
      }
    }
  }
}

fs.writeFileSync(manifestPath, JSON.stringify({
  generatedAt: new Date().toISOString(),
  connectorId,
  sourceArtifact: path.relative(root, sourceArtifact).replaceAll('\\', '/'),
  deltaScope: deltaScope.summary(),
  deltaTargetArtifacts: deltaScope.manifest?.target_artifacts || [],
  pageCount: manifest.length,
  pages: manifest,
}, null, 2));

console.log(`Generated ${manifest.length} ADF support documentation files.`);
