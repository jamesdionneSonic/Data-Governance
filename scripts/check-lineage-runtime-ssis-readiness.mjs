import fs from 'node:fs/promises';
import path from 'node:path';

const packageRoot = path.resolve(
  process.env.LINEAGE_RUNTIME_PACKAGE_ROOT ||
    'data/lineage-runtime-package/sonic-data-lineage-runtime'
);

const ssisRoot = 'ssis';

function addFailure(failures, check, message) {
  failures.push({ check, message });
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

async function readText(relativePath) {
  return fs.readFile(path.join(packageRoot, relativePath), 'utf8');
}

async function* walk(relativeDir) {
  const absoluteDir = path.join(packageRoot, relativeDir);
  const entries = await fs.readdir(absoluteDir, { withFileTypes: true });
  for (const entry of entries) {
    const child = path.join(relativeDir, entry.name).replaceAll('\\', '/');
    if (entry.isDirectory()) {
      yield* walk(child);
    } else {
      yield child;
    }
  }
}

function isSsisObject(value) {
  return String(value || '').toLowerCase().includes('.ssisdb.');
}

function isLookupLike(value) {
  return /(lookup|xref|xrf| lu\b|dim|mapping|map)/i.test(String(value || ''));
}

function isMaintenanceTarget(value) {
  return /(stg|stage|staging|wrk|work|temp|openmonths|audit|load|tracking)/i.test(String(value || ''));
}

function firstSample(current, payload) {
  return current || payload;
}

function samplePayload(file, pkg, edge) {
  return {
    package: pkg.identity?.package_path || pkg.identity?.display_name || pkg.object_id || '',
    object_id: pkg.object_id || '',
    artifact: file,
    edge,
  };
}

async function main() {
  const failures = [];
  const manifest = await readJson('manifest.json');
  const latest = await readJson('latest.json');
  const artifactManifest = await readJson('indexes/artifact-manifest.json');

  const requiredEntrypoints = [
    'manifest.json',
    'latest.json',
    'indexes/entrypoints.json',
    'indexes/path-contract.json',
    'indexes/artifact-manifest.json',
    'registry/canonical-objects.jsonl',
    'ssis/README.md',
  ];

  for (const entrypoint of requiredEntrypoints) {
    // eslint-disable-next-line no-await-in-loop
    if (!(await exists(entrypoint))) {
      addFailure(failures, 'required-entrypoints', `Missing required package path: ${entrypoint}`);
    }
  }

  if (manifest.package_name !== latest.package_name || manifest.version !== latest.version) {
    addFailure(failures, 'package-identity', 'manifest.json and latest.json disagree on package name or version.');
  }

  if (!artifactManifest.entrypoints?.artifact_manifest?.available) {
    addFailure(failures, 'artifact-manifest', 'Artifact manifest does not advertise itself as available.');
  }

  const ssisReadme = await readText('ssis/README.md');
  if (!/\| Folder \| Packages \| (Supporting Context Records|Evidence Sidecars) \|/.test(ssisReadme)) {
    addFailure(failures, 'folder-prompt', 'SSIS README does not expose the folder navigation table.');
  }
  if (!/\[FUEL\]\(/.test(ssisReadme) || !/\[FIRE\]\(/.test(ssisReadme)) {
    addFailure(failures, 'folder-prompt', 'SSIS README is missing expected FUEL/FIRE folder routes.');
  }

  const projectReadmes = [];
  const packageMarkdown = new Set();
  const packageJsonFiles = [];

  for await (const relativePath of walk(ssisRoot)) {
    if (relativePath.endsWith('/README.md') && relativePath !== 'ssis/README.md') projectReadmes.push(relativePath);
    if (relativePath.endsWith('.md') && relativePath.includes('/pkg/')) packageMarkdown.add(relativePath);
    if (relativePath.endsWith('.json') && relativePath.includes('/pkg/')) packageJsonFiles.push(relativePath);
  }

  const folderProjectReadme = projectReadmes.find((relativePath) => /^ssis\/f\/[^/]+\/README\.md$/.test(relativePath));
  const projectPackageReadme = projectReadmes.find((relativePath) => /^ssis\/f\/[^/]+\/p\/[^/]+\/README\.md$/.test(relativePath));

  if (!folderProjectReadme) {
    addFailure(failures, 'project-prompt', 'No folder-level project README was found under ssis/f/**.');
  } else {
    const text = await readText(folderProjectReadme);
    if (!/\| Project \| Packages \| (Supporting Context Records|Evidence Sidecars) \|/.test(text)) {
      addFailure(failures, 'project-prompt', `${folderProjectReadme} does not expose a project navigation table.`);
    }
  }

  if (!projectPackageReadme) {
    addFailure(failures, 'package-prompt', 'No project-level package README was found under ssis/f/**/p/**.');
  } else {
    const text = await readText(projectPackageReadme);
    if (!/\| Package \|/.test(text) && !/pkg\//.test(text)) {
      addFailure(failures, 'package-prompt', `${projectPackageReadme} does not expose package routes.`);
    }
  }

  const samples = {
    package_detail: null,
    source_reads: null,
    lookup_reads: null,
    target_maintenance: null,
    writes: null,
    package_calls: null,
    column_mappings: null,
  };

  for (const file of packageJsonFiles) {
    // eslint-disable-next-line no-await-in-loop
    const pkg = await readJson(file);
    const mdPath = file.replace(/\.json$/i, '.md');
    if (packageMarkdown.has(mdPath)) {
      samples.package_detail = firstSample(samples.package_detail, {
        package: pkg.identity?.package_path || pkg.object_id,
        artifact: file,
        markdown: mdPath,
      });
    }

    if (Number(pkg.confidence?.raw?.evidence_counts?.ssis_column_mappings || 0) > 0) {
      samples.column_mappings = firstSample(samples.column_mappings, {
        package: pkg.identity?.package_path || pkg.object_id,
        artifact: file,
        mappings: pkg.confidence.raw.evidence_counts.ssis_column_mappings,
      });
    }

    for (const edge of pkg.lineage?.direct_edges || []) {
      const type = edge.type || '';
      if (['reads', 'extracts'].includes(type) && !isSsisObject(edge.source)) {
        samples.source_reads = firstSample(samples.source_reads, samplePayload(file, pkg, edge));
      }
      if (['reads', 'extracts', 'used_by'].includes(type) && !isSsisObject(edge.source) && isLookupLike(edge.source)) {
        samples.lookup_reads = firstSample(samples.lookup_reads, samplePayload(file, pkg, edge));
      }
      if (['created_by', 'created_via'].includes(type) && isMaintenanceTarget(edge.target)) {
        samples.target_maintenance = firstSample(samples.target_maintenance, samplePayload(file, pkg, edge));
      }
      if (type === 'loads' && !isSsisObject(edge.target)) {
        samples.writes = firstSample(samples.writes, samplePayload(file, pkg, edge));
      }
      if (type === 'calls') {
        samples.package_calls = firstSample(samples.package_calls, samplePayload(file, pkg, edge));
      }
    }
  }

  const requiredPromptChecks = {
    folder: Boolean(ssisReadme),
    project: Boolean(folderProjectReadme),
    package: Boolean(samples.package_detail),
    source_reads: Boolean(samples.source_reads),
    lookup_reads: Boolean(samples.lookup_reads),
    target_maintenance: Boolean(samples.target_maintenance),
    writes: Boolean(samples.writes),
    package_calls: Boolean(samples.package_calls),
    column_mappings: Boolean(samples.column_mappings),
  };

  for (const [check, passed] of Object.entries(requiredPromptChecks)) {
    if (!passed) addFailure(failures, check, `Missing SSIS support-doc evidence for ${check}.`);
  }

  const result = {
    status: failures.length === 0 ? 'passed' : 'failed',
    packageRoot,
    packageName: latest.package_name || manifest.package_name || '',
    packageVersion: latest.version || manifest.version || '',
    runtimeContentHash: latest.runtime_content_hash || manifest.runtime_content_hash || '',
    ssisPackageContextCount: manifest.counts?.ssis_package_context_count || 0,
    packageJsonFiles: packageJsonFiles.length,
    projectReadmes: projectReadmes.length,
    promptCoverage: requiredPromptChecks,
    samples,
    failures,
  };

  console.log(JSON.stringify(result, null, 2));

  if (failures.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
