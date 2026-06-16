import 'dotenv/config';

import fs from 'node:fs/promises';
import path from 'node:path';
import axios from 'axios';

const lineageRoot = process.env.SSIS_LINEAGE_ROOT || 'C:/projects/Sonic-data-lineage';
const packageRoot = path.join(
  lineageRoot,
  'servers/V1-SSIS25-01,_11040/ssis_packages'
);
const catalogPageId = String(process.env.SSIS_CONFLUENCE_CATALOG_PAGE_ID || '2269610019');
const spaceKey = process.env.CONFLUENCE_SPACE_KEY || 'TDE';
const baseUrl = String(
  process.env.CONFLUENCE_BASE_URL || 'https://sonicautomotive.atlassian.net/wiki'
).replace(/\/+$/, '');
const email = process.env.CONFLUENCE_EMAIL || '';
const apiToken = process.env.CONFLUENCE_API_TOKEN || '';
const publish = process.argv.includes('--publish');
const folderFilter = valueAfter('--folder');
const limit = numberAfter('--limit', Infinity);
const offset = numberAfter('--offset', 0);

if (publish && (!email || !apiToken)) {
  throw new Error('CONFLUENCE_EMAIL and CONFLUENCE_API_TOKEN are required for --publish.');
}

function valueAfter(flag) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : '';
}

function numberAfter(flag, fallback) {
  if (!process.argv.includes(flag)) return fallback;
  const value = Number(valueAfter(flag));
  return Number.isFinite(value) ? value : fallback;
}

function headers(extra = {}) {
  return {
    Authorization: `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...extra,
  };
}

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function normalizePackageKey(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/^.*ssisdb\./, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function scalar(text, key) {
  const match = text.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
  return match ? match[1].replace(/^"|"$/g, '').trim() : '';
}

function list(text, key) {
  const match = text.match(new RegExp(`^${key}:\\n((?:  - .*\\n)*)`, 'm'));
  if (!match) return [];
  return [...match[1].matchAll(/^  - ?(.*)$/gm)]
    .map((row) => row[1].replace(/^"|"$/g, '').trim())
    .filter(Boolean);
}

function runtime(text, label) {
  const body = text.split('---').slice(2).join('---');
  const match = body.match(new RegExp(`- ${label}:\\s*([^\\n]+)`));
  return match ? match[1].trim() : '';
}

async function walk(dir, out = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    if (entry.isFile() && entry.name.endsWith('.dtsx.md')) out.push(full);
  }
  return out;
}

async function mappingSamples(file, max = 5) {
  const dir = path.dirname(file);
  const base = path.basename(file, '.md');
  const chunks = (await fs.readdir(dir))
    .filter((name) => name.startsWith(base) && name.includes('.column_mappings.chunk_'))
    .sort();
  const samples = [];
  for (const chunk of chunks) {
    const text = await fs.readFile(path.join(dir, chunk), 'utf8');
    const blocks = text.split(/\n  -\n/).slice(1);
    for (const block of blocks) {
      const get = (key) => {
        const match = block.match(new RegExp(`^    ${key}:\\s*(.*)$`, 'm'));
        return match ? match[1].replace(/^"|"$/g, '').trim() : '';
      };
      samples.push({
        sourceObject: get('source_object'),
        destinationObject: get('destination_object'),
        inputColumn: get('input_column'),
        outputColumn: get('output_column'),
        transformType: get('transform_type'),
        validationStatus: get('validation_status'),
      });
      if (samples.length >= max) return samples;
    }
  }
  return samples;
}

function fileLikeValues(text) {
  const matches = String(text || '').match(
    /(?:[A-Za-z]:\\[^"'\r\n]+?\.(?:csv|txt|xlsx|xls|pgp|zip|dat|xml|json)|\\\\[^"'\r\n]+?\.(?:csv|txt|xlsx|xls|pgp|zip|dat|xml|json)|[A-Za-z0-9_. -]+\.(?:csv|txt|xlsx|xls|pgp|zip|dat|xml|json))/gi
  );
  return [...new Set((matches || []).filter((value) => !/\.dtsx\b/i.test(value)))].slice(0, 10);
}

async function fileConfigEvidence(pkg, packageText) {
  const componentNames = [
    ...pkg.reads
      .filter((item) => /external_sources|flat_file|flat file|excel/i.test(item))
      .map(objectName)
      .map(displayName),
    ...pkg.writes
      .filter((item) => /external_sources|flat_file|flat file|excel/i.test(item))
      .map(objectName)
      .map(displayName),
    ...pkg.mappingSamples.flatMap((mapping) => [
      mapping.sourceObject,
      mapping.destinationObject,
    ]),
  ].filter(Boolean);
  const fileNames = new Set(fileLikeValues(packageText));
  const externalRoot = path.join(
    lineageRoot,
    'servers/V1-SSIS25-01,_11040/ssis_external_sources',
    pkg.folder,
    pkg.project.replace(/[<>:"/\\|?*]+/g, '_'),
    pkg.package
  );

  try {
    const entries = await fs.readdir(externalRoot, { withFileTypes: true });
    for (const entry of entries.filter((item) => item.isFile() && item.name.endsWith('.md'))) {
      const externalText = await fs.readFile(path.join(externalRoot, entry.name), 'utf8');
      for (const value of fileLikeValues(externalText)) fileNames.add(value);
    }
  } catch {
    // External source detail is optional; package markdown may still have useful evidence.
  }

  return {
    components: topValues(componentNames.map(displayName), 8),
    fileNames: [...fileNames].slice(0, 10),
  };
}

function codeList(items, max = 10, label = 'item') {
  if (!items.length) return '<p>None found in extracted package evidence.</p>';
  const shown = items.slice(0, max).map((item) => `<li><code>${esc(item)}</code></li>`).join('');
  const more =
    items.length > max
      ? `<p>${items.length - max} additional ${esc(label)}(s) are captured in the source artifact.</p>`
      : '';
  return `<ul>${shown}</ul>${more}`;
}

function stripPackageName(value) {
  return String(value || '')
    .replace(/\.dtsx$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b(master|package|load|data|dev|prod|daily|weekly)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function objectName(value) {
  const clean = String(value || '').replace(/^"|"$/g, '').trim();
  if (!clean) return '';
  const parts = clean.split('.');
  return parts.at(-1) || clean;
}

function displayName(value) {
  return String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function objectArea(value) {
  const clean = String(value || '').replace(/^"|"$/g, '').trim();
  const lower = clean.toLowerCase();
  if (!clean) return '';
  if (lower.includes('external_sources') || lower.includes('flat file') || lower.includes('file')) {
    return 'external / flat-file source';
  }
  const parts = clean.split('.');
  if (parts.length >= 4) return `${parts.at(-3)}.${parts.at(-2)}`;
  if (parts.length >= 3) return `${parts.at(-3)}.${parts.at(-2)}`;
  if (parts.length >= 2) return parts.at(-2);
  return clean;
}

function topValues(values, max = 3) {
  const counts = new Map();
  for (const value of values.filter(Boolean)) counts.set(value, (counts.get(value) || 0) + 1);
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, max)
    .map(([value]) => value);
}

function humanJoin(values, fallback = 'the extracted evidence') {
  const clean = [...new Set(values.filter(Boolean))];
  if (!clean.length) return fallback;
  if (clean.length === 1) return clean[0];
  if (clean.length === 2) return `${clean[0]} and ${clean[1]}`;
  return `${clean.slice(0, -1).join(', ')}, and ${clean.at(-1)}`;
}

function targetRole(targets) {
  const text = targets.join(' ').toLowerCase();
  if (/(fact|dim|datamart|cube|warehouse|sonic_dw)/i.test(text)) return 'warehouse/reporting tables';
  if (/(stg|stage|staging|etl_staging|stagingdb)/i.test(text)) return 'staging tables';
  if (/(diff|delta)/i.test(text)) return 'diff/change tracking tables';
  if (/(audit|execution|log|mail)/i.test(text)) return 'audit/control tables';
  return 'target tables';
}

function isControlObject(value) {
  return /(audit|execution|log|mail|packageloaddatesync|fileprocessedlog|ssis\.meta|ssis\.dbo|ssis\.config|ssis_configurations|msdb)/i.test(
    String(value || '')
  );
}

function mappingTargets(pkg) {
  return pkg.mappingSamples.map((mapping) => mapping.destinationObject).filter(Boolean);
}

function mappingSources(pkg) {
  return pkg.mappingSamples.map((mapping) => mapping.sourceObject).filter(Boolean);
}

function sourceAreas(pkg) {
  return topValues([
    ...pkg.reads.map(objectArea),
    ...mappingSources(pkg).map(objectArea),
  ]);
}

function targetAreas(pkg) {
  return topValues(
    [
      ...pkg.writes.filter((target) => !isControlObject(target)).map(objectArea),
      ...mappingTargets(pkg)
        .filter((target) => !isControlObject(target) && !/external|flat file/i.test(target))
        .map(objectArea),
    ].filter((area) => !/external|flat-file|ssis\.meta|ssis\.audit/i.test(area))
  );
}

function importantTargets(pkg, max = 3) {
  return topValues(
    [
      ...pkg.writes.filter((target) => !isControlObject(target)).map(objectName),
      ...mappingTargets(pkg)
        .filter((target) => !isControlObject(target) && !/external|flat file/i.test(target))
        .map(objectName),
      ...pkg.calls
        .filter(
          (call) =>
            /(load|merge|fact|dim|stg|stage|contract|claim)/i.test(call) &&
            !/\.dtsx$/i.test(call) &&
            !isControlObject(call)
        )
        .map(objectName),
    ]
      .filter((name) => name && !/\.dtsx$/i.test(name))
      .map(displayName),
    max
  );
}

function importantSources(pkg, max = 3) {
  return topValues([
    ...pkg.reads.map(objectName).map(displayName),
    ...mappingSources(pkg).map(objectName).map(displayName),
  ], max);
}

function plainSummary(pkg) {
  const subject = pkg.package.replace(/\.dtsx$/i, '');
  const low = `${pkg.project}.${subject}`.toLowerCase();
  const sources = sourceAreas(pkg);
  const targets = targetAreas(pkg);
  const sourceNames = importantSources(pkg);
  const targetNames = importantTargets(pkg);
  const childPackages = pkg.resolvedPackageCalls.filter((call) => call.sameFolder);
  const crossFolderPackages = pkg.resolvedPackageCalls.filter((call) => !call.sameFolder);
  const procedures = pkg.calls.filter(
    (call) => !pkg.resolvedPackageCalls.some((resolved) => resolved.call === call)
  );
  const targetKind = targetRole([...pkg.writes, ...mappingTargets(pkg)]);
  const subjectText = humanJoin(targetNames, stripPackageName(subject) || pkg.project);

  const hasDataMovement =
    pkg.reads.length > 0 ||
    pkg.mappingSamples.length > 0 ||
    pkg.writes.some((target) => !isControlObject(target));

  if (childPackages.length && !hasDataMovement) {
    const childNames = childPackages
      .slice(0, 4)
      .map((call) => stripPackageName(call.package));
    const crossNote = crossFolderPackages.length
      ? ` It also calls ${crossFolderPackages.length} cross-folder package(s), which stay documented under their owning SSIS folders.`
      : '';
    return `${pkg.package} is an orchestration package for ${pkg.folder} ${stripPackageName(pkg.project) || 'data'} processing. It runs child packages for ${humanJoin(childNames, 'the related load steps')} and records control/audit activity in ${humanJoin(targets, 'the SSIS control tables')}.${crossNote} If this master package fails, the downstream child loads may not run, so start by checking this package execution and then each nested child package.`;
  }

  if (sources.length || targets.length) {
    const sourceText = humanJoin(
      sources,
      sourceNames.length ? humanJoin(sourceNames) : 'the extracted source data'
    );
    const targetText = humanJoin(
      targets,
      targetNames.length ? humanJoin(targetNames) : 'the extracted target objects'
    );
    const procedureNote = procedures.some((call) => /(merge|load|fact|dim)/i.test(call))
      ? ` It also calls load/merge routines such as ${humanJoin(
          procedures
            .filter((call) => /(merge|load|fact|dim)/i.test(call))
            .slice(0, 2)
            .map(objectName)
        )}.`
      : '';
    const childNote = childPackages.length
      ? ` After the main movement, it calls child package(s) for ${humanJoin(
          childPackages.slice(0, 3).map((call) => stripPackageName(call.package))
        )}.`
      : '';
    return `${pkg.package} moves ${humanJoin(sourceNames, stripPackageName(subject) || 'source')} data from ${sourceText} into ${targetText} ${targetKind}.${procedureNote}${childNote} If it fails, ${subjectText} can be missing or stale for downstream reporting or follow-on loads; start by checking source file/table availability and target row counts.`;
  }

  if (low.includes('copy')) {
    return `${pkg.package} copies source data into staging tables. Support should treat it as a staging synchronization package: if it fails, downstream staging, diff, or warehouse jobs may not have current rows to process.`;
  }
  if (low.includes('diff')) {
    return `${pkg.package} is part of a diff process. It stages changed records so downstream jobs can compare, merge, or load only changed rows instead of reprocessing the full source every time.`;
  }
  if (low.includes('manual')) {
    return `${pkg.package} supports a manually scheduled staging workflow. Check schedule timing, package execution status, and expected staging rows before troubleshooting downstream consumers.`;
  }
  return `${pkg.package} is an SSIS package in the ${pkg.folder} folder and ${pkg.project} project. Use this page to understand its source objects, target objects, calls, and extracted column mapping evidence.`;
}

function businessLogicNotes(pkg) {
  const targets = importantTargets(pkg, 5);
  const sources = importantSources(pkg, 5);
  const childPackages = pkg.resolvedPackageCalls.filter((call) => call.sameFolder);
  if (childPackages.length) {
    return `This package is primarily a coordinator. Its business logic is the order and success of the child packages, not a single data movement. The child package pages below show the detailed source-to-target movement.`;
  }
  if (sources.length || targets.length) {
    return `This package's business logic is to take ${humanJoin(sources, 'source rows')} and prepare or load ${humanJoin(targets, 'target rows')}. The technical sections below show the exact source objects, target objects, called routines, and representative field mappings.`;
  }
  return 'The extracted artifact does not expose enough source/target detail for a strong business rule summary. Use the call detail, execution status, and source artifact when troubleshooting this package.';
}

function mappingTable(samples) {
  if (!samples.length) return '<p>No sidecar column mappings found for this package.</p>';
  const rows = samples
    .map(
      (m) =>
        `<tr><td><code>${esc(m.sourceObject)}</code></td><td><code>${esc(
          m.destinationObject
        )}</code></td><td><code>${esc(m.inputColumn)}</code></td><td><code>${esc(
          m.outputColumn
        )}</code></td><td>${esc(m.transformType)}</td><td>${esc(m.validationStatus)}</td></tr>`
    )
    .join('');
  return `<table><tbody><tr><th>Source object</th><th>Destination object</th><th>Input column</th><th>Output column</th><th>Transform</th><th>Status</th></tr>${rows}</tbody></table>`;
}

function fileEvidenceBlock(pkg) {
  const files = pkg.fileEvidence?.fileNames || [];
  const components = pkg.fileEvidence?.components || [];
  const fileRows = files.length
    ? `<tr><td>Configured file/path values found</td><td>${files
        .map((file) => `<code>${esc(file)}</code>`)
        .join('<br>')}</td></tr>`
    : '<tr><td>Configured file/path values found</td><td>None captured in the extracted package/configuration metadata.</td></tr>';
  const componentRows = components.length
    ? `<tr><td>File/Excel components found</td><td>${components
        .map((component) => `<code>${esc(component)}</code>`)
        .join('<br>')}</td></tr>`
    : '<tr><td>File/Excel components found</td><td>None surfaced.</td></tr>';
  return `<table><tbody><tr><th>Signal</th><th>Value</th></tr>${fileRows}${componentRows}<tr><td>Support note</td><td>If the configured file name is not shown here, check SSIS package/project parameters, environment variables, connection-manager expressions, or <code>SSIS.Config.SSIS_Configurations</code> for this package.</td></tr></tbody></table>`;
}

function callRows(pkg) {
  if (!pkg.calls.length) return '<p>None found in extracted package evidence.</p>';
  const rows = pkg.calls
    .slice(0, 15)
    .map((call) => {
      const child = pkg.resolvedPackageCalls.find((candidate) => candidate.call === call);
      const role = child
        ? child.sameFolder
          ? 'Child SSIS package'
          : 'Cross-folder SSIS package'
        : 'Procedure / utility call';
      const note = child
        ? child.sameFolder
          ? 'Nested under this page in the Confluence tree.'
          : `Documented under SSIS Folder - ${esc(child.folder)}.`
        : 'Kept as technical evidence; not modeled as a package page.';
      return `<tr><td><code>${esc(call)}</code></td><td>${role}</td><td>${note}</td></tr>`;
    })
    .join('');
  const more =
    pkg.calls.length > 15
      ? `<p>${pkg.calls.length - 15} additional call(s) are captured in the source artifact.</p>`
      : '';
  return `<table><tbody><tr><th>Called object</th><th>Resolved role</th><th>Documentation note</th></tr>${rows}</tbody></table>${more}`;
}

function packageBody(pkg) {
  const sourceText = pkg.reads.length
    ? codeList(pkg.reads, 10, 'source object')
    : '<p>No package-level source objects were extracted. Use mappings and the source artifact for deeper source query review.</p>';
  const targetText = pkg.writes.length
    ? codeList(pkg.writes, 10, 'target object')
    : '<p>No package-level target objects were extracted. Use mappings and the source artifact for deeper destination review.</p>';

  return `<h1>SSIS Package Detail - ${esc(pkg.packagePath)}</h1>
<h2>Plain-English Summary</h2>
<p>${esc(plainSummary(pkg))}</p>
<h2>At a Glance</h2>
<table><tbody>
<tr><th>Field</th><th>Value</th></tr>
<tr><td>Folder</td><td><code>${esc(pkg.folder)}</code></td></tr>
<tr><td>Project</td><td><code>${esc(pkg.project)}</code></td></tr>
<tr><td>Package</td><td><code>${esc(pkg.package)}</code></td></tr>
<tr><td>Lineage edges</td><td>${esc(pkg.edges || '0')}</td></tr>
<tr><td>Source objects</td><td>${pkg.reads.length}</td></tr>
<tr><td>Target objects</td><td>${pkg.writes.length}</td></tr>
<tr><td>Stored procedure/package calls</td><td>${pkg.calls.length}</td></tr>
<tr><td>Column mapping summary</td><td>${esc(pkg.mappings || '0')}</td></tr>
<tr><td>File/config values found</td><td>${pkg.fileEvidence?.fileNames?.length || 0}</td></tr>
</tbody></table>
<h2>Business Logic Notes</h2>
<p>${esc(businessLogicNotes(pkg))}</p>
<details><summary>Source Objects</summary>${sourceText}</details>
<details><summary>Target Objects</summary>${targetText}</details>
<details><summary>Called Packages / Procedures</summary>${callRows(pkg)}</details>
<details><summary>File / Configuration Evidence</summary>${fileEvidenceBlock(pkg)}</details>
<details><summary>Representative Column Mappings</summary>${mappingTable(pkg.mappingSamples)}</details>
<h2>Support Checks</h2>
<ul>
<li>Confirm this package completed successfully before troubleshooting downstream jobs.</li>
<li>Check whether the listed source objects have current rows for the expected run window.</li>
<li>Compare target row counts against the source or diff objects listed on this page.</li>
<li>If a mapping-specific issue is suspected, review the source markdown and sidecar mapping chunks.</li>
</ul>
<h2>Evidence</h2>
<ul><li><code>${esc(pkg.evidencePath)}</code></li></ul>`;
}

function folderBody(folder, folderPages) {
  const projects = [...new Set(folderPages.map((page) => page.project).filter(Boolean))];
  const reads = folderPages.flatMap((page) => page.pkg.reads);
  const writes = folderPages.flatMap((page) => page.pkg.writes);
  const mappingDests = folderPages.flatMap((page) => mappingTargets(page.pkg));
  const mappingSrcs = folderPages.flatMap((page) => mappingSources(page.pkg));
  const sources = topValues([...reads.map(objectArea), ...mappingSrcs.map(objectArea)], 5);
  const targets = topValues(
    [
      ...writes.filter((target) => !isControlObject(target)).map(objectArea),
      ...mappingDests
        .filter((target) => !isControlObject(target) && !/external|flat file/i.test(target))
        .map(objectArea),
    ].filter((area) => !/external|flat-file|ssis\.meta|ssis\.audit/i.test(area)),
    5
  );
  const targetNames = topValues(
    [
      ...writes.filter((target) => !isControlObject(target)).map(objectName),
      ...mappingDests
        .filter((target) => !isControlObject(target) && !/external|flat file/i.test(target))
        .map(objectName),
      ...folderPages.flatMap((page) =>
        page.pkg.calls
          .filter(
            (call) =>
              /(load|merge|fact|dim|stg|stage|contract|claim)/i.test(call) &&
              !/\.dtsx$/i.test(call) &&
              !isControlObject(call)
          )
          .map(objectName)
      ),
    ]
      .filter((name) => name && !/\.dtsx$/i.test(name))
      .map(displayName),
    6
  );
  const sourceNames = topValues([...reads.map(objectName), ...mappingSrcs.map(objectName)], 6);
  const masterPages = folderPages.filter((page) =>
    page.pkg.resolvedPackageCalls.some((call) => call.sameFolder)
  );
  const mappingPackages = folderPages.filter((page) => page.pkg.mappingSamples.length);
  const summary =
    sources.length || targets.length
      ? `The ${esc(folder)} SSIS folder moves ${esc(
          humanJoin(sourceNames, folder)
        )} data from ${esc(humanJoin(sources, 'its source files/tables'))} into ${esc(
          humanJoin(targets, 'its target tables')
        )}. The main visible targets include ${esc(
          humanJoin(targetNames, 'the listed staging/warehouse objects')
        )}; if these jobs fail, those downstream DOWC/JMA loads or reports may be missing current rows.`
      : `The ${esc(folder)} SSIS folder contains package execution evidence, but the extracted source/target detail is limited. Use the package pages below to review calls, mappings, and execution checks.`;

  const packageRows = folderPages
    .slice(0, 25)
    .map(
      (page) =>
        `<tr><td><code>${esc(page.package)}</code></td><td>${esc(
          page.pkg.resolvedPackageCalls.some((call) => call.sameFolder)
            ? 'Master/orchestration package'
            : targetRole([...page.pkg.writes, ...mappingTargets(page.pkg)])
        )}</td><td>${esc(humanJoin(importantTargets(page.pkg, 3), 'No target surfaced'))}</td></tr>`
    )
    .join('');
  const packageMore =
    folderPages.length > 25
      ? `<p>${folderPages.length - 25} additional package(s) are documented as child pages.</p>`
      : '';

  return `<h1>SSIS Folder - ${esc(folder)}</h1>
<h2>Plain-English Summary</h2>
<p>${summary}</p>
<h2>At a Glance</h2>
<table><tbody>
<tr><th>Signal</th><th>Value</th></tr>
<tr><td>Packages</td><td>${folderPages.length}</td></tr>
<tr><td>Projects</td><td>${projects.length}</td></tr>
<tr><td>Master/orchestration packages</td><td>${masterPages.length}</td></tr>
<tr><td>Packages with column mappings</td><td>${mappingPackages.length}</td></tr>
<tr><td>Main source areas</td><td>${esc(humanJoin(sources, 'Not surfaced'))}</td></tr>
<tr><td>Main target areas</td><td>${esc(humanJoin(targets, 'Not surfaced'))}</td></tr>
<tr><td>Visible final / important targets</td><td>${esc(humanJoin(targetNames, 'Not surfaced'))}</td></tr>
</tbody></table>
<h2>Support Pattern</h2>
<p>Start with the master/orchestration packages when present, then follow the nested child package pages. Use the package summary to understand impact first, then expand technical sections for source objects, targets, calls, and mappings.</p>
<details><summary>Package Roles And Targets</summary>
<table><tbody><tr><th>Package</th><th>Role</th><th>Visible target / impact area</th></tr>${packageRows}</tbody></table>
${packageMore}
</details>
<details><summary>Source Areas</summary>${codeList(sources, 10, 'source area')}</details>
<details><summary>Target Areas</summary>${codeList(targets, 10, 'target area')}</details>
<h2>Evidence</h2>
<ul><li><code>servers/V1-SSIS25-01,_11040/ssis_packages/${esc(folder)}</code></li></ul>`;
}

async function packageRecord(file) {
  const text = await fs.readFile(file, 'utf8');
  const evidencePath = file.replaceAll('\\', '/').split('/Sonic-data-lineage/')[1];
  const pkg = {
    file,
    folder: scalar(text, 'folder_name'),
    project: scalar(text, 'project_name'),
    package: scalar(text, 'package_name'),
    packagePath: scalar(text, 'package_path'),
    reads: list(text, 'reads_from'),
    writes: list(text, 'writes_to'),
    calls: list(text, 'calls'),
    edges: runtime(text, 'Detected lineage edges'),
    mappings: runtime(text, 'SSIS column mappings'),
    evidencePath,
    mappingSamples: await mappingSamples(file),
    resolvedPackageCalls: [],
  };
  pkg.fileEvidence = await fileConfigEvidence(pkg, text);
  return {
    title: `SSIS Package Detail - ${pkg.packagePath}`,
    folderTitle: `SSIS Folder - ${pkg.folder}`,
    folder: pkg.folder,
    project: pkg.project,
    package: pkg.package,
    packagePath: pkg.packagePath,
    calls: pkg.calls,
    body: packageBody(pkg),
    pkg,
    summary: plainSummary(pkg),
  };
}

function resolvePackageCalls(pages) {
  const byPath = new Map();
  for (const page of pages) {
    byPath.set(normalizePackageKey(page.packagePath), page);
  }

  for (const page of pages) {
    const resolved = [];
    for (const call of page.calls) {
      const normalizedCall = normalizePackageKey(call);
      const child = byPath.get(normalizedCall);
      if (!child || child.title === page.title) continue;
      resolved.push({
        call,
        title: child.title,
        package: child.package,
        folder: child.folder,
        sameFolder: child.folder === page.folder,
      });
    }
    page.pkg.resolvedPackageCalls = resolved;
    page.body = packageBody(page.pkg);
    page.summary = plainSummary(page.pkg);
  }
}

function parentTitleMap(pages) {
  const parents = new Map();
  const pageByTitle = new Map(pages.map((page) => [page.title, page]));

  for (const page of pages) {
    for (const child of page.pkg.resolvedPackageCalls.filter((call) => call.sameFolder)) {
      if (!pageByTitle.has(child.title)) continue;
      if (!parents.has(child.title)) parents.set(child.title, page.title);
    }
  }

  for (const [childTitle, parentTitle] of [...parents.entries()]) {
    const seen = new Set([childTitle]);
    let current = parentTitle;
    while (parents.has(current)) {
      if (seen.has(current)) {
        parents.delete(childTitle);
        break;
      }
      seen.add(current);
      current = parents.get(current);
    }
  }

  return parents;
}

function sortPagesByHierarchy(pages, parents) {
  const byTitle = new Map(pages.map((page) => [page.title, page]));

  function depth(page) {
    let current = page.title;
    let value = 0;
    const seen = new Set();
    while (parents.has(current)) {
      if (seen.has(current)) return 0;
      seen.add(current);
      current = parents.get(current);
      if (!byTitle.has(current)) return value;
      value += 1;
    }
    return value;
  }

  return [...pages].sort((left, right) => {
    const byDepth = depth(left) - depth(right);
    if (byDepth !== 0) return byDepth;
    return left.title.localeCompare(right.title);
  });
}

async function getJson(url, params = {}) {
  const response = await axios.get(`${baseUrl}${url}`, { params, headers: headers() });
  return response.data;
}

async function postJson(url, data) {
  const response = await axios.post(`${baseUrl}${url}`, data, { headers: headers() });
  return response.data;
}

async function putJson(url, data) {
  const response = await axios.put(`${baseUrl}${url}`, data, { headers: headers() });
  return response.data;
}

async function listFolderPages() {
  const byTitle = new Map();
  let start = 0;
  const pageSize = 100;
  while (true) {
    const data = await getJson(`/rest/api/content/${catalogPageId}/child/page`, {
      start,
      limit: pageSize,
      expand: 'version',
    });
    for (const page of data.results || []) byTitle.set(page.title, page);
    if ((data.results || []).length < pageSize) break;
    start += pageSize;
  }
  return byTitle;
}

async function findChildPage(parentId, title) {
  const cql = `parent=${parentId} and type=page and title="${title.replaceAll('"', '\\"')}"`;
  const data = await getJson('/rest/api/content/search', {
    cql,
    expand: 'version',
    limit: 10,
  });
  return (data.results || []).find((page) => page.title === title) || null;
}

async function findPageByTitle(title) {
  const cql = `space="${spaceKey.replaceAll('"', '\\"')}" and type=page and title="${title.replaceAll('"', '\\"')}"`;
  const data = await getJson('/rest/api/content/search', {
    cql,
    expand: 'version',
    limit: 10,
  });
  return (data.results || []).find((page) => page.title === title) || null;
}

async function upsertPage(page, parentId) {
  const existing = (await findChildPage(parentId, page.title)) || (await findPageByTitle(page.title));
  if (existing) {
    await putJson(`/rest/api/content/${existing.id}`, {
      id: existing.id,
      type: 'page',
      title: page.title,
      ancestors: [{ id: parentId }],
      version: {
        number: Number(existing.version?.number || 1) + 1,
        message: `Automated SSIS documentation sync ${new Date().toISOString()}`,
      },
      body: {
        storage: {
          value: page.body,
          representation: 'storage',
        },
      },
    });
    return { action: 'updated', id: existing.id, title: page.title, parentId };
  }

  const created = await postJson('/rest/api/content', {
    type: 'page',
    title: page.title,
    ancestors: [{ id: parentId }],
    space: { key: spaceKey },
    metadata: {
      labels: [
        { prefix: 'global', name: 'generated' },
        { prefix: 'global', name: 'ssis-documentation' },
      ],
    },
    body: {
      storage: {
        value: page.body,
        representation: 'storage',
      },
    },
  });
  return { action: 'created', id: created.id, title: page.title, parentId };
}

async function updateFolderPage(folderPage, body) {
  const fresh = await findPageByTitle(folderPage.title);
  const existing = fresh || folderPage;
  await putJson(`/rest/api/content/${existing.id}`, {
    id: existing.id,
    type: 'page',
    title: existing.title,
    version: {
      number: Number(existing.version?.number || 1) + 1,
      message: `Automated SSIS folder documentation sync ${new Date().toISOString()}`,
    },
    body: {
      storage: {
        value: body,
        representation: 'storage',
      },
    },
  });
  return { action: 'updated-folder', id: existing.id, title: existing.title };
}

const allFiles = await walk(packageRoot);
const selectedFiles = allFiles
  .filter((file) => !folderFilter || file.replaceAll('\\', '/').includes(`/ssis_packages/${folderFilter}/`))
  .sort()
  .slice(offset, offset + limit);
const pages = [];
for (const file of selectedFiles) {
  pages.push(await packageRecord(file));
}
resolvePackageCalls(pages);
const packageParents = parentTitleMap(pages);
const publishPages = sortPagesByHierarchy(pages, packageParents);

if (!publish) {
  const folders = new Set(pages.map((page) => page.folder));
  console.log(
    JSON.stringify(
      {
        mode: 'dry-run',
        packageRoot,
        selectedPackages: pages.length,
        folders: folders.size,
        nestedPackagePages: packageParents.size,
        sampleTitles: publishPages.slice(0, 10).map((page) => page.title),
        sampleSummaries: publishPages.slice(0, 5).map((page) => ({
          title: page.title,
          summary: page.summary,
        })),
        sampleFileEvidence: publishPages.slice(0, 5).map((page) => ({
          title: page.title,
          fileNames: page.pkg.fileEvidence?.fileNames || [],
          components: page.pkg.fileEvidence?.components || [],
        })),
      },
      null,
      2
    )
  );
  process.exit(0);
}

const folderPages = await listFolderPages();
const missingFolderPages = Array.from(new Set(pages.map((page) => page.folderTitle))).filter(
  (title) => !folderPages.has(title)
);
if (missingFolderPages.length) {
  throw new Error(`Missing SSIS folder page(s): ${missingFolderPages.slice(0, 10).join(', ')}`);
}

const results = [];
const pageIds = new Map();
const pagesByFolder = new Map();
for (const page of publishPages) {
  if (!pagesByFolder.has(page.folder)) pagesByFolder.set(page.folder, []);
  pagesByFolder.get(page.folder).push(page);
}
for (const [folder, folderPackagePages] of pagesByFolder.entries()) {
  const folderPage = folderPages.get(`SSIS Folder - ${folder}`);
  // eslint-disable-next-line no-await-in-loop
  results.push(await updateFolderPage(folderPage, folderBody(folder, folderPackagePages)));
}
for (const page of publishPages) {
  const parentPackageTitle = packageParents.get(page.title);
  const parent =
    parentPackageTitle && pageIds.has(parentPackageTitle)
      ? { id: pageIds.get(parentPackageTitle) }
      : folderPages.get(page.folderTitle);
  // eslint-disable-next-line no-await-in-loop
  const result = await upsertPage(page, parent.id);
  pageIds.set(page.title, result.id);
  results.push(result);
}

console.log(
  JSON.stringify(
    {
      mode: 'publish',
      status: 'published',
      created: results.filter((result) => result.action === 'created').length,
      updated: results.filter((result) => result.action === 'updated').length,
      updatedFolders: results.filter((result) => result.action === 'updated-folder').length,
      pages: results.length,
      folders: new Set(pages.map((page) => page.folder)).size,
      nestedPackagePages: packageParents.size,
    },
    null,
    2
  )
);
