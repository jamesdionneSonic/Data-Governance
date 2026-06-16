import fs from 'node:fs';
import path from 'node:path';

const root = 'C:/projects/Sonic-data-lineage';
const folder = process.argv[2] || 'StagingSonicSSIS';
const limit = Number(process.argv[3] || 10);
const offset = Number(process.argv[4] || 0);

const packageRoot = path.join(root, 'servers/V1-SSIS25-01,_11040/ssis_packages', folder);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    if (entry.isFile() && entry.name.endsWith('.dtsx.md')) out.push(full);
  }
  return out;
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

function mappingSamples(file, max = 5) {
  const dir = path.dirname(file);
  const base = path.basename(file, '.md');
  const chunks = fs.readdirSync(dir)
    .filter((name) => name.startsWith(base.replace('.dtsx', '.dtsx')) && name.includes('.column_mappings.chunk_'))
    .sort();
  const samples = [];
  for (const chunk of chunks) {
    const text = fs.readFileSync(path.join(dir, chunk), 'utf8');
    const blocks = text.split(/\n  -\n/).slice(1);
    for (const block of blocks) {
      const get = (key) => {
        const m = block.match(new RegExp(`^    ${key}:\\s*(.*)$`, 'm'));
        return m ? m[1].replace(/^"|"$/g, '').trim() : '';
      };
      samples.push({
        source_object: get('source_object'),
        destination_object: get('destination_object'),
        input_column: get('input_column'),
        output_column: get('output_column'),
        transform_type: get('transform_type'),
        validation_status: get('validation_status'),
      });
      if (samples.length >= max) return samples;
    }
  }
  return samples;
}

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function codeList(items, max = 12) {
  if (!items.length) return '<p>None found in extracted package evidence.</p>';
  const shown = items.slice(0, max).map((item) => `<li><code>${esc(item)}</code></li>`).join('');
  const more = items.length > max ? `<p>${items.length - max} additional item(s) are captured in the source artifact.</p>` : '';
  return `<ul>${shown}</ul>${more}`;
}

function plainSummary(pkg) {
  const subject = pkg.package.replace(/\.dtsx$/i, '');
  if (pkg.project.toLowerCase().includes('copy') || subject.toLowerCase().includes('copy')) {
    return `${pkg.package} copies data from source eLeadDW objects into ETL_Staging objects. Support should treat it as a staging synchronization package: if it fails, downstream staging/diff jobs may not have current source rows to process.`;
  }
  if (pkg.project.toLowerCase().includes('diff') || subject.toLowerCase().includes('dwdiff')) {
    return `${pkg.package} is part of the StagingSonicSSIS diff process. It moves changed source data into staging objects so later jobs can compare, merge, or load only the changed records.`;
  }
  if (pkg.project.toLowerCase().includes('manual')) {
    return `${pkg.package} supports a manually scheduled staging workflow. Check schedule timing, package execution status, and expected staging rows before troubleshooting downstream consumers.`;
  }
  return `${pkg.package} is an SSIS package in the ${pkg.folder} folder and ${pkg.project} project. Use this page to understand its source objects, target objects, calls, and extracted column mapping evidence.`;
}

function html(pkg) {
  const maps = pkg.mapping_samples.map((m) => `<tr><td><code>${esc(m.source_object)}</code></td><td><code>${esc(m.destination_object)}</code></td><td><code>${esc(m.input_column)}</code></td><td><code>${esc(m.output_column)}</code></td><td>${esc(m.transform_type)}</td><td>${esc(m.validation_status)}</td></tr>`).join('');
  return `<h1>SSIS Package Detail - ${esc(pkg.package_path)}</h1>
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
</tbody></table>
<h2>Business Logic Notes</h2>
<p>This package appears to move data between operational/source objects and staging objects. The extracted evidence should be used to confirm source availability, target row counts, and whether this package is a simple copy, diff-stage, or scheduled support step before changing business rules.</p>
<details><summary>Source Objects</summary>${codeList(pkg.reads, 10)}</details>
<details><summary>Target Objects</summary>${codeList(pkg.writes, 10)}</details>
<details><summary>Called Packages / Procedures</summary>${codeList(pkg.calls, 10)}</details>
<details><summary>Representative Column Mappings</summary>
${pkg.mapping_samples.length ? `<table><tbody><tr><th>Source object</th><th>Destination object</th><th>Input column</th><th>Output column</th><th>Transform</th><th>Status</th></tr>${maps}</tbody></table>` : '<p>No sidecar column mappings found for this package.</p>'}
</details>
<h2>Support Checks</h2>
<ul>
<li>Confirm the package ran successfully in SSIS before troubleshooting downstream objects.</li>
<li>Check whether the listed source objects have current rows for the expected run window.</li>
<li>Compare target row counts against the source/diff objects listed on this page.</li>
<li>If a mapping-specific issue is suspected, review the source markdown and sidecar mapping chunks.</li>
</ul>
<h2>Evidence</h2>
<ul><li><code>${esc(pkg.evidence_path)}</code></li></ul>`;
}

const packages = walk(packageRoot)
  .map((file) => {
    const text = fs.readFileSync(file, 'utf8');
    const rel = file.replaceAll('\\', '/').split('/Sonic-data-lineage/')[1];
    const pkg = {
      file,
      folder: scalar(text, 'folder_name'),
      project: scalar(text, 'project_name'),
      package: scalar(text, 'package_name'),
      package_path: scalar(text, 'package_path'),
      reads: list(text, 'reads_from'),
      writes: list(text, 'writes_to'),
      calls: list(text, 'calls'),
      edges: runtime(text, 'Detected lineage edges'),
      mappings: runtime(text, 'SSIS column mappings'),
      upstream: runtime(text, 'Upstream entities'),
      targets: runtime(text, 'Target entities'),
      evidence_path: rel,
      mapping_samples: mappingSamples(file),
    };
    return {
      title: `SSIS Package Detail - ${pkg.package_path}`,
      body: html(pkg),
      project: pkg.project,
      package: pkg.package,
    };
  })
  .sort((a, b) => a.project.localeCompare(b.project) || a.package.localeCompare(b.package));

console.log(JSON.stringify(packages.slice(offset, offset + limit), null, 2));
