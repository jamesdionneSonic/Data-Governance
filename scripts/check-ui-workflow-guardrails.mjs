#!/usr/bin/env node
/* eslint-disable no-console */

import { readdirSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const frontendPath = path.join(repoRoot, 'docker', 'frontend', 'app.js');
const workflowsPath = path.join(repoRoot, 'docker', 'frontend', 'workflows');
const source = readFileSync(frontendPath, 'utf8');

function readWorkflowSources() {
  try {
    return readdirSync(workflowsPath)
      .filter((fileName) => fileName.endsWith('.js'))
      .map((fileName) => [fileName, readFileSync(path.join(workflowsPath, fileName), 'utf8')]);
  } catch (err) {
    failures.push(`Could not read workflow-owned template modules: ${err.message}`);
    return [];
  }
}

const allowedPrimaryLabels = new Set([
  'Home / Find Data',
  'Asset Detail',
  'Search',
  'Search / Catalog',
  'Lineage Explorer',
  'Glossary & Metrics',
  'Review Work',
  'Review Work / Governance Ops',
  'Profiling',
  'Connections',
  'Lineage Acquisition',
  'Platform Admin',
]);

const transitionalPrimaryLabels = new Set([
  'Find & Understand',
  'Govern & Improve',
  'Package & Report',
  'Connect & Operate',
  'Support',
  'Business Glossary',
  'Governance Ops',
  'Metric Intelligence',
  'Data Products',
  'Governance Insights',
  'Help Center',
]);

const allowedToggleModels = new Set([
  'browseMode',
  'integrations.schedulerOpsTab',
]);

const duplicatedActionBaselines = [
  {
    name: 'managed connector test action',
    pattern: /testManagedConnector\(/g,
    max: 2,
  },
  {
    name: 'one-time profile run action',
    pattern: /runOneTimeProfile/g,
    max: 3,
  },
  {
    name: 'profile schedule save action',
    pattern: /saveProfileSchedule/g,
    max: 3,
  },
  {
    name: 'profile publish action',
    pattern: /publishConnectorProfiles/g,
    max: 4,
  },
];

const failures = [];
const workflowSources = readWorkflowSources();
const workflowSource = workflowSources.map(([, content]) => content).join('\n');
const combinedSource = `${source}\n${workflowSource}`;

function countMatches(pattern, haystack = combinedSource) {
  return [...haystack.matchAll(pattern)].length;
}

function extractPrimaryLabels() {
  return [...workflowSource.matchAll(/label:\s*'([^']+)'/g)].map((match) => match[1]);
}

function extractTemplate(exportName, fileName) {
  const fileSource = workflowSources.find(([name]) => name === fileName)?.[1] || '';
  const match = fileSource.match(new RegExp(`export\\s+const\\s+${exportName}\\s*=\\s*\`([\\s\\S]*?)\`;`));
  return match?.[1] || '';
}

function checkPrimaryLabels() {
  const labels = extractPrimaryLabels();
  const unknownLabels = labels.filter(
    (label) => !allowedPrimaryLabels.has(label) && !transitionalPrimaryLabels.has(label)
  );

  if (unknownLabels.length) {
    failures.push(
      `Primary navigation has labels outside the workflow spec: ${unknownLabels.join(', ')}. ` +
        'Update docs/UI_WORKFLOW_SPEC.md first or map the label to a workflow owner.'
    );
  }
}

function checkNestedWorkflowTabs() {
  const vTabsCount = countMatches(/<v-tabs\b/g);
  if (vTabsCount > 0) {
    failures.push('Do not introduce v-tabs for primary workflow navigation; use one workflow owner per page.');
  }

  const toggleModels = [...source.matchAll(/<v-btn-toggle\b[^>]*\bv-model="([^"]+)"/g)].map(
    (match) => match[1]
  );
  const unknownToggleModels = toggleModels.filter((model) => !allowedToggleModels.has(model));

  if (unknownToggleModels.length) {
    failures.push(
      `Unexpected workflow toggle model(s): ${unknownToggleModels.join(', ')}. ` +
        'Nested or new workflow tabs need ADR/spec review before implementation.'
    );
  }
}

function checkDuplicatedActions() {
  for (const action of duplicatedActionBaselines) {
    const count = countMatches(action.pattern);
    if (count > action.max) {
      failures.push(
        `${action.name} appears ${count} times; current migration baseline allows ${action.max}. ` +
          'Reuse or move existing action wiring instead of adding another implementation.'
      );
    }
  }
}

function checkRetiredDefaultNoise() {
  const homeTemplate = extractTemplate('homeFindDataPageTemplate', 'findAndUnderstandTemplates.js');
  const retiredHomeLabels = [
    'Common starts',
    'Recent Catalog Objects',
    'Pipeline Progress',
    'Role Shortcuts',
    'Quality Radar',
    'Persona Insights',
    'Platform Health',
    'Run Next Step',
    'Demo Data',
    'Refresh All',
  ];
  const returnedLabels = retiredHomeLabels.filter((label) => homeTemplate.includes(label));
  if (returnedLabels.length) {
    failures.push(
      `Home / Find Data retired clutter returned: ${returnedLabels.join(', ')}. ` +
        'Keep Home search-first and move those controls to their owning workflow.'
    );
  }
}

function checkGovernanceInsightsInternalOnly() {
  const packageSource = workflowSources.find(([name]) => name === 'packageAndReport.js')?.[1] || '';
  if (
    !packageSource.includes("key: 'reports'") ||
    !packageSource.includes("label: 'Governance Insights'") ||
    !packageSource.includes('hidden: true')
  ) {
    failures.push(
      'Governance Insights must stay hidden from primary navigation until access, impact, export, and KPI functions are decomposed into owning workflows.'
    );
  }

  if (source.includes('Open Governance Insights')) {
    failures.push(
      'Quick actions must not route users to Governance Insights as a mixed reporting bucket. Link to the owning workflow instead.'
    );
  }
}

function checkDataProductsInternalOnly() {
  const packageSource = workflowSources.find(([name]) => name === 'packageAndReport.js')?.[1] || '';
  if (
    !packageSource.includes("key: 'products'") ||
    !packageSource.includes("label: 'Data Products'") ||
    !packageSource.includes('hidden: true')
  ) {
    failures.push(
      'Data Products must stay hidden from primary navigation until product owner, consumer promise, lifecycle, access posture, and success metrics are defined.'
    );
  }

  if (source.includes('Open Data Products')) {
    failures.push(
      'Quick actions must not route users to Data Products while the workflow is parked. Link to Search, Metrics, or lineage instead.'
    );
  }
}

function checkRequiredSupportLanes() {
  const requiredSupportLanes = [
    'metric-support-lane',
    'glossary-support-lane',
    'governance-support-lane',
    'connections-support-lane',
    'profile-support-lane',
    'lineage-acquisition-support-lane',
    'admin-support-lane',
  ];
  const missing = requiredSupportLanes.filter((className) => !workflowSource.includes(className));
  if (missing.length) {
    failures.push(
      `Redesigned workflow support lane(s) missing: ${missing.join(', ')}. ` +
        'Advanced or secondary controls must stay behind support lanes by default.'
    );
  }
}

function checkProfilingQueueHealthDefault() {
  const profilingTemplate = extractTemplate('profilingSchedulerPageTemplate', 'connectAndOperateTemplates.js');
  if (!profilingTemplate) {
    failures.push('Could not find Profiling template for queue-health guardrail checks.');
    return;
  }

  const queueAnswerIndex = profilingTemplate.indexOf('profile-queue-answer');
  const queueListIndex = profilingTemplate.indexOf('profile-default-schedules');
  const advancedIndex = profilingTemplate.indexOf('Advanced / Operator Tools');
  if (queueAnswerIndex < 0 || queueListIndex < 0 || advancedIndex < 0) {
    failures.push(
      'Profiling must keep a queue-health answer and live queue list, with operator tools available only for deep operational states. ' +
        'Restore the clean default before adding operator controls.'
    );
    return;
  }

  if (!source.includes("'scheduler'") || !source.includes('isSimpleWorkflowView')) {
    failures.push(
      'Profiling must opt out of the global page-intro and telemetry-banner chrome through isSimpleWorkflowView. ' +
        'Keep the Profiling default as a clean queue-health surface.'
    );
  }

  if (!source.includes("['overview', 'discovery', 'scheduler'].includes(activeView)")) {
    failures.push(
      'Profiling must stay out of the global topbar title block so the page has one visible Profiling header.'
    );
  }

  if (!profilingTemplate.includes('profile-clean-hero') || !profilingTemplate.includes('New Schedule')) {
    failures.push(
      'Profiling must keep a single clean hero with one primary New Schedule action before queue details.'
    );
  }

  if (
    !profilingTemplate.includes('v-model="integrations.profileScheduleEditorOpen"') ||
    !profilingTemplate.includes('class="profile-schedule-dialog"') ||
    !profilingTemplate.includes('@click="openProfileScheduleEditor(true)"') ||
    !source.includes('profileScheduleEditorOpen: false') ||
    !source.includes('openProfileScheduleEditor(reset = false)') ||
    !source.includes('closeProfileScheduleEditor()')
  ) {
    failures.push(
      'Profiling New Schedule must open a dedicated schedule editor surface, not inline editor content on the queue-health page.'
    );
  }

  const beforeQueueAnswer = profilingTemplate.slice(0, queueAnswerIndex);
  if (beforeQueueAnswer.includes('section-header') || beforeQueueAnswer.includes('section-title')) {
    failures.push(
      'Profiling must not reintroduce a duplicate section header above the queue-health hero.'
    );
  }

  if (queueAnswerIndex > advancedIndex || queueListIndex > advancedIndex) {
    failures.push(
      'Profiling queue-health default must appear before Advanced / Operator Tools. ' +
        'Keep operator controls below the queue-health answer and live queue list.'
    );
  }

  if (
    !profilingTemplate.includes(':open="profileOperatorToolsOpen"') ||
    !profilingTemplate.includes('v-if="profileOperatorToolsOpen"') ||
    !profilingTemplate.includes('@click.prevent="openProfileOperatorTools"')
  ) {
    failures.push(
      'Profiling Advanced / Operator Tools must lazy-render its operator body only after opening. ' +
        'Keep closed worker controls out of default text, accessibility, and diagnostics traces.'
    );
  }

  if (
    !source.includes('profileOperatorToolsOpen()') ||
    !source.includes('openProfileOperatorTools()') ||
    !source.includes("['runNow', 'runs', 'publishing'].includes(this.integrations.schedulerOpsTab)")
  ) {
    failures.push(
      'Profiling Advanced / Operator Tools needs explicit open-state helpers limited to runNow, runs, and publishing so native details markup does not leak closed operator controls.'
    );
  }

  const defaultSlice = profilingTemplate.slice(0, advancedIndex);
  const forbiddenDefaultLabels = [
    'Start Worker',
    'Stop Worker',
    'Run Due',
    'Run History',
    'Publish Readiness',
    'Schedule Settings',
    'Publish Pending Profiles',
    'Edit Queue Settings',
    'New Queue Schedule',
  ];
  const returnedLabels = forbiddenDefaultLabels.filter((label) => defaultSlice.includes(label));
  if (returnedLabels.length) {
    failures.push(
      `Profiling operator control(s) returned above queue health: ${returnedLabels.join(', ')}. ` +
        'Move them into Advanced / Operator Tools or a collapsed queue internals lane.'
    );
  }

  if (!profilingTemplate.includes('profile-queue-internals-lane')) {
    failures.push(
      'Selected Profiling queue details must keep object-level queue internals behind profile-queue-internals-lane.'
    );
  }
}

function checkWorkflowRegistryExtraction() {
  if (/const\s+navSections\s*=/.test(source) || /const\s+pageWorkflowMeta\s*=/.test(source)) {
    failures.push(
      'Workflow navigation and page metadata must live in docker/frontend/workflowRegistry.js and workflow-owned modules, not in app.js.'
    );
  }

  if (!source.includes("from './workflowRegistry.js'")) {
    failures.push('docker/frontend/app.js must import workflow navigation from workflowRegistry.js.');
  }

  if (
    !source.includes('${homeFindDataPageTemplate}') ||
    !source.includes('${catalogSearchPageTemplate}') ||
    !source.includes('${lineageExplorerPageTemplate}') ||
    !source.includes('${businessGlossaryPageTemplate}') ||
    !source.includes('${governanceOpsPageTemplate}') ||
    !source.includes('${metricIntelligencePageTemplate}') ||
    !source.includes('${dataProductsPageTemplate}') ||
    !source.includes('${governanceInsightsPageTemplate}') ||
    !source.includes('${connectionsPageTemplate}') ||
    !source.includes('${profilingSchedulerPageTemplate}') ||
    !source.includes('${connectorWorkflowPageTemplate}') ||
    !source.includes('${lineageAcquisitionPageTemplate}') ||
    !source.includes('${platformAdminPageTemplate}') ||
    !source.includes('${helpCenterPageTemplate}')
  ) {
    failures.push('Extracted workflow page templates must stay composed into app.js from workflow-owned template modules.');
  }

  if (/<div\s+v-if="activeView\s*===/.test(source)) {
    failures.push(
      'Primary activeView page markup must stay in workflow-owned template modules; app.js should only compose page template seams.'
    );
  }
}

function checkLineageAssistantRetired() {
  if (/lineageAsk/.test(combinedSource) || /Lineage Assistant/.test(combinedSource)) {
    failures.push(
      'Lineage Assistant/lineageAsk must stay retired as a separate surface; lineage answers belong in Lineage Explorer and selected asset lineage.'
    );
  }
}

function checkAdvancedTrustControlsRetired() {
  const governSource = workflowSources.find(([name]) => name === 'governAndImprove.js')?.[1] || '';
  const governTemplateSource =
    workflowSources.find(([name]) => name === 'governAndImproveTemplates.js')?.[1] || '';
  const quickActionsSource = readFileSync(
    path.join(repoRoot, 'docker', 'frontend', 'workflowQuickActions.js'),
    'utf8'
  );

  if (
    /Advanced Trust Controls/.test(combinedSource) ||
    /advancedGovernancePageTemplate/.test(combinedSource) ||
    /activeView\s*===\s*'governance'/.test(governTemplateSource) ||
    /view:\s*'governance'/.test(quickActionsSource) ||
    /governance:\s*\{/.test(governSource)
  ) {
    failures.push(
      'Advanced Trust Controls must stay retired as a standalone route; policy, quality, and classification controls belong inside Governance Ops support lanes or Platform Admin configuration.'
    );
  }
}

function checkMetricProfilingExecutionRetired() {
  const metricTemplate = extractTemplate(
    'metricIntelligencePageTemplate',
    'governAndImproveTemplates.js'
  );
  const forbiddenMetricExecution = [
    'Advanced Profile Run',
    'Technical Profile Run',
    'planMetricTableProfile',
    'runMetricTableProfile',
    'metrics.profiling',
    '/api/v1/profiling/plan',
    '/api/v1/profiling/run',
  ];
  const returnedItems = forbiddenMetricExecution.filter(
    (item) => metricTemplate.includes(item) || source.includes(item)
  );

  if (returnedItems.length) {
    failures.push(
      `Metric Intelligence must not own technical profile execution (${returnedItems.join(', ')}). ` +
        'Keep profile evidence read-only there and route live plan/run/schedule work to Profiling.'
    );
  }

  if (
    !metricTemplate.includes('Profile Evidence') ||
    !metricTemplate.includes('Profiling Handoff') ||
    !source.includes('openMetricProfilingHandoff()')
  ) {
    failures.push(
      'Metric Intelligence must keep read-only profile evidence and a Profiling handoff instead of embedded profile execution controls.'
    );
  }
}

function checkConnectionsProfilingOperatorLinksRetired() {
  const connectionsTemplate = extractTemplate(
    'connectionsPageTemplate',
    'connectAndOperateTemplates.js'
  );
  const forbiddenConnectionsLinks = [
    'Open Run Now in Profiling',
    'Open Runs in Profiling',
    'Open Publishing in Profiling',
    "integrations.schedulerOpsTab = 'runNow'",
    "integrations.schedulerOpsTab = 'runs'",
    "integrations.schedulerOpsTab = 'publishing'",
    'Related Workflow Links',
  ];
  const returnedItems = forbiddenConnectionsLinks.filter((item) =>
    connectionsTemplate.includes(item)
  );

  if (returnedItems.length) {
    failures.push(
      `Connections must not choose Profiling operator modes (${returnedItems.join(', ')}). ` +
        'Use schedule/queue relationship links such as Used by schedules and Open Related Profiling Queue.'
    );
  }

  if (
    !connectionsTemplate.includes('Schedule Relationships') ||
    !connectionsTemplate.includes('Used by schedules') ||
    !connectionsTemplate.includes('Open Related Profiling Queue') ||
    !source.includes('openRelatedProfilingQueueFromConnection()')
  ) {
    failures.push(
      'Connections must expose profile work as schedule/queue relationships, with a helper that opens the related Profiling queue rather than operator tabs.'
    );
  }
}

function checkPackageAndReportSectionRetired() {
  const registrySource = readFileSync(
    path.join(repoRoot, 'docker', 'frontend', 'workflowRegistry.js'),
    'utf8'
  );

  const navSectionsMatch = registrySource.match(
    /export\s+const\s+navSections\s*=\s*\[([\s\S]*?)\];/
  );
  if (!navSectionsMatch || /packageAndReportSection/.test(navSectionsMatch[1])) {
    failures.push(
      'Package & Report must not be composed into normal navSections; keep products/reports internal until a real workflow owner exists.'
    );
  }

  if (!registrySource.includes('internalSections') || !registrySource.includes('packageAndReportSection')) {
    failures.push(
      'Package & Report internal routes should stay explicit through internalSections so existing deep links remain intentional and reviewable.'
    );
  }
}

function checkUiRuntimeErrorHandling() {
  const handlerIndex = source.indexOf('registerGlobalUiErrorHandlers();');
  const mountIndex = source.indexOf(".mount('#app-root')");

  if (handlerIndex < 0 || mountIndex < 0 || handlerIndex > mountIndex) {
    failures.push(
      'Frontend runtime error handlers must be registered before Vue mount so render failures do not blank the app.'
    );
  }

  if (!source.includes('vueApp.config.errorHandler')) {
    failures.push('Vue app config must route render/setup errors into the UI error stream.');
  }

  if (!source.includes('renderFatalUiFallback') || !source.includes('UI_MOUNT_FAILED')) {
    failures.push('UI mount failures must render the fatal fallback instead of leaving app-root blank.');
  }
}

checkPrimaryLabels();
checkNestedWorkflowTabs();
checkDuplicatedActions();
checkRetiredDefaultNoise();
checkGovernanceInsightsInternalOnly();
checkDataProductsInternalOnly();
checkRequiredSupportLanes();
checkProfilingQueueHealthDefault();
checkWorkflowRegistryExtraction();
checkLineageAssistantRetired();
checkAdvancedTrustControlsRetired();
checkMetricProfilingExecutionRetired();
checkConnectionsProfilingOperatorLinksRetired();
checkPackageAndReportSectionRetired();
checkUiRuntimeErrorHandling();

if (failures.length) {
  console.error('UI workflow guardrails failed:\n');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('UI workflow guardrails passed.');
