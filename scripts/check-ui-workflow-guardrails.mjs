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
  'Lineage Assistant',
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
      'Profiling must keep a queue-health answer, live queue list, and Advanced / Operator Tools lane. ' +
        'Restore the clean default before adding operator controls.'
    );
    return;
  }

  if (queueAnswerIndex > advancedIndex || queueListIndex > advancedIndex) {
    failures.push(
      'Profiling queue-health default must appear before Advanced / Operator Tools. ' +
        'Keep operator controls below the queue-health answer and live queue list.'
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
    !source.includes('${lineageAssistantPageTemplate}') ||
    !source.includes('${lineageExplorerPageTemplate}') ||
    !source.includes('${businessGlossaryPageTemplate}') ||
    !source.includes('${advancedGovernancePageTemplate}') ||
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

checkPrimaryLabels();
checkNestedWorkflowTabs();
checkDuplicatedActions();
checkRetiredDefaultNoise();
checkRequiredSupportLanes();
checkProfilingQueueHealthDefault();
checkWorkflowRegistryExtraction();

if (failures.length) {
  console.error('UI workflow guardrails failed:\n');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('UI workflow guardrails passed.');
