import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const profileRoot = path.join(root, 'data', 'markdown', '_runtime', 'profile-runs');
const docsRoot = path.join(root, 'docs', 'adf-support-documentation-multi-factory');
const manifestPath = path.join(root, 'tmp', 'adf-multi-factory-support-documentation-manifest.json');

const DEFAULT_CONNECTORS = [
  'azure-data-factory-adf-admin-d1',
  'azure-data-factory-adf-dw-caroffer-prod',
  'azure-data-factory-adf-dw-lightspeed-prod',
  'azure-data-factory-adf-dw-postgres-prod',
  'azure-data-factory-adf-googlesearch-d1',
  'azure-data-factory-adf-xtime-d1',
  'azure-data-factory-adf-vehiclemart-prod',
  'azure-data-factory-adf-reputationmgmt-d1',
  'azure-data-factory-adf-facebookads-d1',
  'azure-data-factory-adf-reconpro-d1',
  'azure-data-factory-adf-mci-d1',
  'azure-data-factory-adf-ganalytics-d1',
  'azure-data-factory-adf-elead-d1',
  'azure-data-factory-adf-inbounddataetl-prod',
  'azure-data-factory-adf-pricefx-d1',
];
const INVENTORY_ONLY_CONNECTORS = new Set(['azure-data-factory-adf-dw-postgres-prod']);

function argValue(name, fallback = '') {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] || fallback : fallback;
}

const connectorIds = String(argValue('connectors', DEFAULT_CONNECTORS.join(',')))
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

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

async function resetDir(dir) {
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
}

async function latestProfileArtifact(connectorId) {
  const dir = path.join(profileRoot, connectorId);
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
      .map(async (entry) => {
        const file = path.join(dir, entry.name);
        const stat = await fs.stat(file);
        return { file, mtimeMs: stat.mtimeMs };
      })
  );
  files.sort((left, right) => right.mtimeMs - left.mtimeMs);
  if (!files.length) throw new Error(`No profile artifacts found for ${connectorId}.`);
  return files[0].file;
}

function profileFromArtifact(artifact) {
  return artifact.run?.profile?.profile || artifact.profile?.profile || artifact.profile || {};
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
  return [
    ...new Set(
      activities(pipeline)
        .filter((activity) => activity.type === 'ExecutePipeline')
        .map((activity) => activity.typeProperties?.pipeline?.referenceName)
        .filter(Boolean)
    ),
  ];
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
  return [
    ...new Set(
      activities(pipeline)
        .flatMap((activity) => [
          activity.typeProperties?.source?.sqlReaderStoredProcedureName,
          activity.typeProperties?.storedProcedureName,
        ])
        .filter(Boolean)
    ),
  ];
}

function pipelineRole(pipeline, parentMap) {
  const calls = calledPipelineNames(pipeline);
  const parents = parentMap.get(pipeline.name) || [];
  if (calls.length) return 'orchestrator';
  if (parents.length) return 'child pipeline';
  if (activities(pipeline).some((activity) => activity.type === 'Copy')) return 'data movement';
  return 'standalone or utility pipeline';
}

function supportImpact(assetName) {
  return `If ${assetName} fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path.`;
}

function isInventoryOnly(connectorId, profile) {
  return (
    INVENTORY_ONLY_CONNECTORS.has(connectorId) &&
    (profile.pipelines || []).length > 0 &&
    (profile.lineage_edges || []).length === 0
  );
}

function firstCheck(pipeline, role) {
  if (role === 'orchestrator') return `Check the latest ${pipeline.name} parent run and identify the first failed child activity.`;
  if (role === 'child pipeline') return `Check the parent pipeline that called ${pipeline.name}; do not start the child with blank operational parameters.`;
  return `Check the latest ADF run for ${pipeline.name} and confirm source and target datasets are available.`;
}

function activeTriggersForPipeline(triggers, pipelineName) {
  return triggers.filter((trigger) =>
    (prop(trigger).pipelines || []).some(
      (item) => item.pipelineReference?.referenceName === pipelineName
    )
  );
}

function factoryName(profile, connectorId) {
  const factory = (profile.objects || []).find((item) => item.object_type === 'adf_factory');
  return factory?.name || connectorId.replace(/^azure-data-factory-/, '');
}

function factoryMarkdown({ connectorId, profile, sourceArtifact }) {
  const name = factoryName(profile, connectorId);
  const pipelines = profile.pipelines || [];
  const triggers = profile.schedules || [];
  const datasets = profile.datasets || [];
  const connections = profile.connections || [];
  const activeTriggers = triggers.filter((trigger) => prop(trigger).runtimeState === 'Started');
  const inventoryOnly = isInventoryOnly(connectorId, profile);
  const summary = inventoryOnly
    ? `${name} is an Azure Data Factory captured by the saved connector runtime. It contains ${pipelines.length} surfaced pipeline-like object(s), ${triggers.length} trigger(s), ${datasets.length} dataset(s), ${connections.length} linked-service connection record(s), and 0 deterministic lineage edges. This factory is complete for inventory/support documentation and is not a forward lineage target unless future source metadata surfaces real tasks, datasets, connections, schedules, or lineage edges.`
    : `${name} is an Azure Data Factory captured by the saved connector runtime. It contains ${pipelines.length} pipeline(s), ${triggers.length} trigger(s), ${datasets.length} dataset(s), and ${connections.length} linked-service connection record(s). ${supportImpact(name)} Start troubleshooting by checking active triggers, then the latest root or orchestrator pipeline run.`;
  const businessUse = inventoryOnly
    ? `Use this page as the support inventory entry point for ${name}. The available metadata does not expose actionable ADF lineage, source/target datasets, linked services, activities, or schedules.`
    : `Use this page as the support entry point for ${name}. Pipeline pages below explain orchestrators, child loads, source/target datasets, linked service boundaries, and concrete first checks.`;
  const supportChecks = inventoryOnly
    ? `1. Treat this factory as inventory-only unless a future metadata refresh surfaces deterministic ADF lineage edges.
2. If operations are requested, confirm the live Azure factory state before taking action.
3. Do not infer source datasets, target datasets, linked services, or business process from the current profile.
4. Do not change triggers, schedules, retries, linked services, or credentials from documentation work.`
    : `1. Confirm whether an active trigger should have started the pipeline.
2. Check the latest parent or orchestrator pipeline run.
3. Identify the first failed activity or child pipeline.
4. Confirm source datasets, target datasets, and linked-service availability.
5. Do not change triggers, schedules, retries, linked services, or credentials from documentation work.`;
  return `# ${name}

Generated: ${new Date().toISOString()}
Saved connector: ${code(connectorId)}
Source profile artifact: ${code(path.relative(root, sourceArtifact).replaceAll('\\', '/'))}

## Plain-English Summary

${summary}

## At a Glance

| Field | Value |
| --- | --- |
| Platform | ADF |
| Asset type | Factory |
| Native path | ${code(name)} |
| Support role | Factory / support section root |
| Business process | ${md(name)} ADF data movement and orchestration |
| Primary source | ${md(datasets.slice(0, 5).map((item) => item.name).join(', '))} |
| Primary target/output | ${md(inventoryOnly ? 'not surfaced in metadata' : 'not fully surfaced in metadata; inspect pipeline pages')} |
| Schedule or trigger | ${md(activeTriggers.map((item) => item.name).join(', ') || 'no active triggers surfaced')} |
| Runtime/usage signal | Metadata profiled at ${md(profile.generated_at)} |
| Status signal | ${inventoryOnly ? 'inventory-only; no usable deterministic lineage edges' : activeTriggers.length ? 'active trigger surfaced' : 'metadata available'} |
| Evidence | ${code(path.relative(root, sourceArtifact).replaceAll('\\', '/'))} |

## Business Use

${businessUse}

## Support Checks

${supportChecks}

## Lineage And Dependencies

| Asset type | Count |
| --- | ---: |
| Pipelines | ${pipelines.length} |
| Triggers | ${triggers.length} |
| Datasets | ${datasets.length} |
| Linked services | ${connections.length} |
| Lineage edges | ${(profile.lineage_edges || []).length} |

## Runtime Or Usage Signals

The support cache uses a bounded metadata-profile lookback. It is not a live monitor. Check ADF directly before operational reruns.

## Technical Details

| Pipeline | Folder | Activities | Child pipelines |
| --- | --- | ---: | --- |
${pipelines
  .slice()
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((pipeline) => `| ${md(pipeline.name)} | ${md(pipelineFolder(pipeline))} | ${activities(pipeline).length} | ${md(calledPipelineNames(pipeline).join(', ') || 'none')} |`)
  .join('\n') || '| none surfaced |  |  |  |'}

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Raw activity output, sample rows, secrets, tokens, and connection strings are not published.
- Missing facts are marked as not surfaced in metadata.
${inventoryOnly ? '- Closed as inventory-only because no usable deterministic lineage edges were surfaced.' : ''}
`;
}

function pipelineMarkdown({ connectorId, profile, pipeline, parentMap, sourceArtifact, pageTitle }) {
  const factory = factoryName(profile, connectorId);
  const triggers = activeTriggersForPipeline(profile.schedules || [], pipeline.name);
  const parents = parentMap.get(pipeline.name) || [];
  const calls = calledPipelineNames(pipeline);
  const sources = sourceDatasets(pipeline);
  const targets = targetDatasets(pipeline);
  const procedures = storedProcedures(pipeline);
  const params = pipelineParameters(pipeline);
  const inventoryOnly = isInventoryOnly(connectorId, profile);
  const role = inventoryOnly ? 'inventory-only pipeline-like object' : pipelineRole(pipeline, parentMap);
  const summary = inventoryOnly
    ? `${pipeline.name} is the only surfaced pipeline-like object in ${factory}. The available profile shows no activities, child pipeline calls, source datasets, target datasets, schedules, linked services, or deterministic lineage edges, so this page is inventory/support context only.`
    : `${pipeline.name} is an ADF ${role} in ${factory}. ${supportImpact(pipeline.name)} Start troubleshooting by ${firstCheck(pipeline, role).replace(/^Check/i, 'checking').replace(/\.$/, '')}.`;
  const supportChecks = inventoryOnly
    ? `1. Treat this object as inventory-only unless a future metadata refresh surfaces deterministic ADF lineage edges.
2. If operations are requested, confirm the live Azure factory state before taking action.
3. Do not infer parameters, source datasets, target datasets, or stored procedures from the current profile.
4. Do not change triggers, schedules, retries, linked services, or credentials from documentation work.`
    : `1. ${firstCheck(pipeline, role)}
2. Confirm parameters are supplied by the parent, trigger, or documented default path: ${md(params.join(', '))}.
3. Confirm source datasets are available: ${md(sources.join(', '))}.
4. Confirm target datasets or child pipelines completed: ${md(targets.join(', ') || calls.join(', '))}.
5. If stored procedures are involved, validate process/audit logs before rerunning.`;
  return `# ${pageTitle || pipeline.name}

Generated: ${new Date().toISOString()}
ADF factory: ${code(factory)}
Saved connector: ${code(connectorId)}
Source profile artifact: ${code(path.relative(root, sourceArtifact).replaceAll('\\', '/'))}

## Plain-English Summary

${summary}

## At a Glance

| Field | Value |
| --- | --- |
| Platform | ADF |
| Asset type | Pipeline |
| Native path | ${code(pipeline.external_id || pipeline.id)} |
| Support role | ${md(role)} |
| Business process | ${md(`${factory} pipeline execution`)} |
| Primary source | ${md(sources.slice(0, 8).join(', '))} |
| Primary target/output | ${md(targets.slice(0, 8).join(', ') || calls.slice(0, 8).join(', '))} |
| Schedule or trigger | ${md(triggers.map((item) => item.name).join(', ') || 'not directly triggered')} |
| Runtime/usage signal | Metadata profiled at ${md(profile.generated_at)} |
| Status signal | ${inventoryOnly ? 'inventory-only; no usable deterministic lineage edges' : triggers.length ? 'triggered pipeline' : 'metadata available'} |
| Evidence | ${code(path.relative(root, sourceArtifact).replaceAll('\\', '/'))} |

## Business Use

${inventoryOnly ? `This object is retained so operators can see that ${factory} was profiled. Its available metadata shows ${activities(pipeline).length} activity steps, ${calls.length} child pipeline calls, ${sources.length} source dataset references, and ${targets.length} target dataset references.` : `This pipeline supports the ${factory} ADF process. Its available metadata shows ${activities(pipeline).length} activity step(s), ${calls.length} child pipeline call(s), ${sources.length} source dataset reference(s), and ${targets.length} target dataset reference(s).`}

## Support Checks

${supportChecks}

## Lineage And Dependencies

| Dependency type | Values |
| --- | --- |
| Parent pipelines | ${md(parents.join(', '))} |
| Child pipelines | ${md(calls.join(', ') || 'none surfaced')} |
| Source datasets | ${md(sources.join(', '))} |
| Target datasets | ${md(targets.join(', '))} |
| Stored procedures | ${md(procedures.join(', ') || 'none surfaced')} |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity | Type | Inputs | Outputs |
| --- | --- | --- | --- |
${activities(pipeline)
  .map((activity) => `| ${md(activity.name)} | ${md(activity.type)} | ${md(datasetRefsFromActivity(activity, 'input').join(', '))} | ${md(datasetRefsFromActivity(activity, 'output').join(', '))} |`)
  .join('\n') || '| not surfaced in metadata |  |  |  |'}

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
${inventoryOnly ? '- Closed as inventory-only because no usable deterministic lineage edges were surfaced.' : ''}
`;
}

function triggerMarkdown({ connectorId, profile, trigger, sourceArtifact }) {
  const factory = factoryName(profile, connectorId);
  const properties = prop(trigger);
  const targetPipelines = (properties.pipelines || [])
    .map((item) => item.pipelineReference?.referenceName)
    .filter(Boolean);
  const recurrence = properties.typeProperties?.recurrence;
  const schedule = recurrence
    ? `${recurrence.frequency || 'frequency not surfaced'} every ${recurrence.interval || 1}; time zone ${recurrence.timeZone || 'not surfaced'}`
    : 'not surfaced in metadata';
  return `# ${trigger.name}

## Plain-English Summary

${trigger.name} is an ADF trigger in ${factory}. It targets ${targetPipelines.map(code).join(', ') || '`not surfaced in metadata`'}. ${supportImpact(trigger.name)} Start troubleshooting by checking trigger state, schedule, and the latest target pipeline run.

## At a Glance

| Field | Value |
| --- | --- |
| Platform | ADF |
| Asset type | Trigger |
| Native path | ${code(trigger.external_id || trigger.id)} |
| Support role | Schedule / operational entry point |
| Business process | ${md(`${factory} scheduling`)} |
| Primary source | ADF trigger schedule |
| Primary target/output | ${md(targetPipelines.join(', '))} |
| Schedule or trigger | ${md(schedule)} |
| Runtime/usage signal | Runtime state: ${md(properties.runtimeState)} |
| Status signal | ${md(properties.runtimeState || 'metadata available')} |
| Evidence | ${code(path.relative(root, sourceArtifact).replaceAll('\\', '/'))} |

## Business Use

Use this page to confirm when ADF is expected to start this factory's pipeline process and which pipeline receives the trigger.

## Support Checks

1. Confirm trigger state.
2. Confirm target pipeline names.
3. Check target pipeline run history around the scheduled time.
4. Do not change trigger state or schedule as part of documentation refresh.

## Lineage And Dependencies

| Dependency type | Values |
| --- | --- |
| Target pipelines | ${md(targetPipelines.join(', '))} |

## Runtime Or Usage Signals

Runtime state surfaced in metadata: ${md(properties.runtimeState)}.

## Technical Details

Schedule: ${md(schedule)}

## Evidence And Caveats

- Trigger parameters are documented only when surfaced by ADF metadata.
- Trigger changes require a separate approved ADF operation packet.
`;
}

async function writePage({ connectorId, title, body, fileTitle = title }) {
  const connectorDir = path.join(docsRoot, connectorId);
  await fs.mkdir(connectorDir, { recursive: true });
  const file = path.join(connectorDir, `${slug(fileTitle)}.md`);
  await fs.writeFile(file, `${body.trimEnd()}\n`, 'utf8');
  return path.relative(root, file).replaceAll('\\', '/');
}

await resetDir(docsRoot);
await fs.mkdir(path.dirname(manifestPath), { recursive: true });

const manifest = {
  generated_at: new Date().toISOString(),
  connector_count: connectorIds.length,
  page_count: 0,
  connectors: [],
  pages: [],
};

for (const connectorId of connectorIds) {
  const sourceArtifact = await latestProfileArtifact(connectorId);
  const artifact = JSON.parse(await fs.readFile(sourceArtifact, 'utf8'));
  const profile = profileFromArtifact(artifact);
  const pipelines = Array.isArray(profile.pipelines) ? profile.pipelines : [];
  const triggers = Array.isArray(profile.schedules) ? profile.schedules : [];
  const pipelineTitleCounts = pipelines.reduce((counts, pipeline) => {
    counts.set(pipeline.name, (counts.get(pipeline.name) || 0) + 1);
    return counts;
  }, new Map());
  const duplicateTitleSeen = new Map();
  const parentMap = new Map();
  for (const pipeline of pipelines) {
    for (const child of calledPipelineNames(pipeline)) {
      if (!parentMap.has(child)) parentMap.set(child, []);
      parentMap.get(child).push(pipeline.name);
    }
  }
  const factoryTitle = factoryName(profile, connectorId);
  const factoryFile = await writePage({
    connectorId,
    title: factoryTitle,
    body: factoryMarkdown({ connectorId, profile, sourceArtifact }),
  });
  manifest.pages.push({ connector_id: connectorId, title: factoryTitle, asset_type: 'factory', markdown_file: factoryFile });
  for (const trigger of triggers) {
    const file = await writePage({
      connectorId,
      title: trigger.name,
      body: triggerMarkdown({ connectorId, profile, trigger, sourceArtifact }),
    });
    manifest.pages.push({ connector_id: connectorId, title: trigger.name, asset_type: 'trigger', markdown_file: file });
  }
  for (const pipeline of pipelines.slice().sort((a, b) => a.name.localeCompare(b.name))) {
    const duplicatePipelineName = (pipelineTitleCounts.get(pipeline.name) || 0) > 1;
    const duplicateIndex = (duplicateTitleSeen.get(pipeline.name) || 0) + 1;
    duplicateTitleSeen.set(pipeline.name, duplicateIndex);
    const pipelineTitle = duplicatePipelineName
      ? `${pipeline.name} (${duplicateIndex})`
      : pipeline.name;
    const file = await writePage({
      connectorId,
      title: pipelineTitle,
      fileTitle: pipelineTitle,
      body: pipelineMarkdown({
        connectorId,
        profile,
        pipeline,
        parentMap,
        sourceArtifact,
        pageTitle: pipelineTitle,
      }),
    });
    manifest.pages.push({ connector_id: connectorId, title: pipelineTitle, asset_type: 'pipeline', markdown_file: file });
  }
  manifest.connectors.push({
    connector_id: connectorId,
    factory: factoryTitle,
    source_artifact: path.relative(root, sourceArtifact).replaceAll('\\', '/'),
    factory_pages: 1,
    trigger_pages: triggers.length,
    pipeline_pages: pipelines.length,
    total_pages: 1 + triggers.length + pipelines.length,
  });
}

manifest.page_count = manifest.pages.length;
await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

console.log(
  JSON.stringify(
    {
      status: 'generated',
      connector_count: manifest.connector_count,
      page_count: manifest.page_count,
      manifest: path.relative(root, manifestPath).replaceAll('\\', '/'),
      docs_root: path.relative(root, docsRoot).replaceAll('\\', '/'),
    },
    null,
    2
  )
);
