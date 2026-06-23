import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'yaml';
import {
  SsisMetadataExtractor,
  parseSsisPackageXmlForLineage,
} from '../src/services/ssisExtractor.js';

const ROOT = process.cwd();
const OUTPUT_ROOT = path.join(ROOT, 'data', 'markdown');
const OUTPUT_SERVERS_ROOT = path.join(OUTPUT_ROOT, 'servers');
const RAW_SSIS_XML_ROOT = path.join(ROOT, 'data', 'analysis', 'raw', 'ssis', 'xml');
const SSIS_SERVER = 'V1-SSIS25-01, 11040';
const SNOWFLAKE_SERVER_ID = 'snowflake-bipslyv-tlb12786';
const WRITE = process.argv.includes('--write') || process.argv.includes('--publish');
const FORCE_FORMAT = process.argv.includes('--format');
const PACKAGE_PATTERN = readStringOption('--package-pattern', '');

function readStringOption(flagName, fallback = '') {
  const equalsPrefix = `${flagName}=`;
  const equalsArg = process.argv.find((arg) => arg.startsWith(equalsPrefix));
  const flagIndex = process.argv.indexOf(flagName);
  return (
    equalsArg?.slice(equalsPrefix.length) ||
    (flagIndex >= 0 ? process.argv[flagIndex + 1] : '') ||
    fallback
  );
}

async function listFiles(root, predicate = () => true) {
  const files = [];
  async function walk(dir) {
    let entries = [];
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (predicate(fullPath)) {
        files.push(fullPath);
      }
    }
  }
  await walk(root);
  return files.sort();
}

function splitMarkdown(content) {
  const match = String(content || '').match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) throw new Error('No YAML frontmatter found.');
  return {
    frontmatter: yaml.parse(match[1]) || {},
    body: content.slice(match[0].length),
  };
}

function renderMarkdown(frontmatter, body) {
  return `---\n${yaml.stringify(frontmatter, { lineWidth: 0 }).trim()}\n---\n\n${String(body || '').replace(/^\r?\n/, '')}`;
}

function pushUniqueText(values, value) {
  const next = Array.isArray(values) ? [...values] : [];
  if (value && !next.some((item) => String(item).toLowerCase() === String(value).toLowerCase())) {
    next.push(value);
  }
  return next.sort((left, right) => String(left).localeCompare(String(right)));
}

function appendUniqueTag(tags, tag) {
  return pushUniqueText(tags, tag);
}

function packageId(server, folder, project, packageName) {
  return `${server}.SSISDB.${folder}.${project}.${packageName}`;
}

function cleanPackageToken(value) {
  return String(value || '')
    .replace(/\.dtsx$/i, '')
    .replace(/[^a-z0-9]+/gi, '')
    .toLowerCase();
}

function extractPackageIdentityFromXml(xmlText, fallbackPackageName) {
  const match = String(xmlText || '').match(/<DTS:Executable\b[^>]*\bDTS:ObjectName="([^"]+)"/i);
  const objectName = match?.[1] || fallbackPackageName.replace(/\.dtsx$/i, '');
  return objectName.toLowerCase().endsWith('.dtsx') ? objectName : `${objectName}.dtsx`;
}

function firstNonEmptyUnderscoreSegment(value) {
  const text = String(value || '');
  let start = 0;
  for (let index = 0; index <= text.length; index += 1) {
    if (index < text.length && text[index] !== '_') continue;
    if (index > start) return text.slice(start, index);
    start = index + 1;
  }
  return '';
}

function chooseExistingPackageCatalogRow(packageName, rawBaseName, existingCatalog) {
  const candidates = existingCatalog.get(String(packageName || '').toLowerCase()) || [];
  if (candidates.length === 0) return null;
  const rawToken = cleanPackageToken(rawBaseName);
  const packageToken = cleanPackageToken(packageName);
  let bestCandidate = candidates[0];
  let bestScore = -1;

  for (const candidate of candidates) {
    const folderToken = cleanPackageToken(candidate.folder_name);
    const projectToken = cleanPackageToken(candidate.project_name);
    const pathToken = cleanPackageToken(candidate.package_path);
    let score = 0;
    if (folderToken && rawToken.includes(folderToken)) score += 2;
    if (projectToken && rawToken.includes(projectToken)) score += 3;
    if (pathToken && rawToken.includes(pathToken.replace(packageToken, ''))) score += 1;
    if (candidate.folder_name && candidate.folder_name !== 'unknown_folder') score += 1;
    if (candidate.project_name && candidate.project_name !== 'unknown_project') score += 1;
    if (candidate.package_name && candidate.package_name !== 'Package.dtsx') score += 1;
    if (score > bestScore) {
      bestCandidate = candidate;
      bestScore = score;
    }
  }

  return bestCandidate;
}

function inferSsisFileParts(filePath, xmlText, existingCatalog = new Map()) {
  const baseName = path.basename(filePath, '.xml').replace(/^\d+_/, '');
  const withoutExt = baseName.replace(/\.dtsx$/i, '');
  const packageName = extractPackageIdentityFromXml(xmlText, withoutExt);
  const catalogMatch = chooseExistingPackageCatalogRow(packageName, withoutExt, existingCatalog);
  if (catalogMatch) {
    return {
      folder: catalogMatch.folder_name || 'unknown_folder',
      project: catalogMatch.project_name || 'unknown_project',
      packageName: catalogMatch.package_name || packageName,
    };
  }

  const packageStem = packageName.replace(/\.dtsx$/i, '');
  const baseLower = withoutExt.toLowerCase();
  const packageStemLower = packageStem.toLowerCase();
  let project = withoutExt;
  if (baseLower.endsWith(`_${packageStemLower}`)) {
    project = withoutExt.slice(0, -packageStem.length - 1);
  } else {
    project = firstNonEmptyUnderscoreSegment(withoutExt) || 'unknown_project';
  }
  return { folder: project, project, packageName };
}

async function loadExistingSsisCatalog() {
  const existing = new Map();
  const files = await listFiles(
    OUTPUT_SERVERS_ROOT,
    (filePath) =>
      filePath.toLowerCase().endsWith('.md') &&
      filePath.toLowerCase().includes(`${path.sep}ssis_packages${path.sep}`) &&
      !filePath.toLowerCase().includes('.column_mappings.')
  );

  for (const filePath of files) {
    try {
      const { frontmatter } = splitMarkdown(await fs.readFile(filePath, 'utf8'));
      const packageName = frontmatter.package_name || frontmatter.packageName;
      if (!packageName) continue;
      const key = String(packageName).toLowerCase();
      if (!existing.has(key)) existing.set(key, []);
      existing.get(key).push({
        folder_name: frontmatter.folder_name || frontmatter.folderName || '',
        project_name: frontmatter.project_name || frontmatter.projectName || '',
        package_name: packageName,
        package_path: frontmatter.package_path || frontmatter.packagePath || '',
        id: frontmatter.id || '',
        filePath,
      });
    } catch {
      // Existing package markdown is only an identity hint.
    }
  }

  return existing;
}

function snowflakeMarkdownPath(objectId) {
  const parts = String(objectId || '').split('.');
  if (parts.length < 4 || parts[0] !== SNOWFLAKE_SERVER_ID) return '';
  const [, database, schema, ...objectParts] = parts;
  return path.join(
    OUTPUT_SERVERS_ROOT,
    SNOWFLAKE_SERVER_ID,
    'databases',
    database,
    'tables',
    `${schema}__${objectParts.join('.')}.md`
  );
}

async function updateMarkdownFrontmatter(filePath, mutator) {
  const content = await fs.readFile(filePath, 'utf8');
  const { frontmatter, body } = splitMarkdown(content);
  const before = JSON.stringify(frontmatter);
  mutator(frontmatter);
  const changed = JSON.stringify(frontmatter) !== before || FORCE_FORMAT;
  if (changed && WRITE) {
    await fs.writeFile(filePath, renderMarkdown(frontmatter, body), 'utf8');
  }
  return changed;
}

async function main() {
  const existingCatalog = await loadExistingSsisCatalog();
  const packageById = new Map();
  for (const candidates of existingCatalog.values()) {
    for (const candidate of candidates) {
      if (candidate.id) packageById.set(candidate.id, candidate);
    }
  }
  const xmlFiles = await listFiles(
    RAW_SSIS_XML_ROOT,
    (filePath) =>
      filePath.toLowerCase().endsWith('.dtsx.xml') &&
      (!PACKAGE_PATTERN || path.basename(filePath).toLowerCase().includes(PACKAGE_PATTERN.toLowerCase()))
  );
  const extractor = new SsisMetadataExtractor({ server: SSIS_SERVER });
  const packageReads = new Map();
  const objectUsedBy = new Map();

  for (const filePath of xmlFiles) {
    const xmlText = await fs.readFile(filePath, 'utf8');
    if (!/HYPERNOVA_SONIC_CUSTACCESS|CDK_ROADSTER_ELEAD_SONIC|dbSnowflakeSource/i.test(xmlText)) {
      continue;
    }
    const { folder, project, packageName } = inferSsisFileParts(filePath, xmlText, existingCatalog);
    const id = packageId(SSIS_SERVER, folder, project, packageName);
    const parsed = parseSsisPackageXmlForLineage(xmlText, {
      objectName: packageName,
      packageName,
      projectName: project,
      folderName: folder,
      serverName: SSIS_SERVER,
      packageId: id,
    });
    const edges = extractor
      .buildLineageEdges(
        [{ folder_name: folder, project_name: project, package_name: packageName }],
        [parsed],
        { jobs: [], ssisSteps: [] },
        [],
        {}
      )
      .filter((edge) => edge.edgeType === 'READS_FROM' && String(edge.to).startsWith(SNOWFLAKE_SERVER_ID));
    if (edges.length === 0) continue;
    packageReads.set(id, new Set(edges.map((edge) => edge.to)));
    for (const edge of edges) {
      if (!objectUsedBy.has(edge.to)) objectUsedBy.set(edge.to, new Set());
      objectUsedBy.get(edge.to).add(id);
    }
  }

  let packageFilesChanged = 0;
  let snowflakeFilesChanged = 0;
  const missingSnowflakeMarkdown = [];

  for (const [packageIdValue, reads] of packageReads.entries()) {
    const packagePath = packageById.get(packageIdValue)?.filePath;
    if (!packagePath) continue;
    const changed = await updateMarkdownFrontmatter(packagePath, (frontmatter) => {
      for (const read of reads) {
        frontmatter.reads_from = pushUniqueText(frontmatter.reads_from, read);
        frontmatter.depends_on = pushUniqueText(frontmatter.depends_on, read);
      }
      frontmatter.tags = appendUniqueTag(frontmatter.tags, 'lineage-stitch:snowflake-ssis-read');
    });
    if (changed) packageFilesChanged += 1;
  }

  for (const [objectId, packages] of objectUsedBy.entries()) {
    const filePath = snowflakeMarkdownPath(objectId);
    try {
      await fs.access(filePath);
    } catch {
      missingSnowflakeMarkdown.push(objectId);
      continue;
    }
    const changed = await updateMarkdownFrontmatter(filePath, (frontmatter) => {
      for (const packageIdValue of packages) {
        frontmatter.used_by = pushUniqueText(frontmatter.used_by, packageIdValue);
      }
      frontmatter.tags = appendUniqueTag(frontmatter.tags, 'ssis-consumed');
      frontmatter.lineage_quality = {
        ...(frontmatter.lineage_quality || {}),
        confidence_label: 'validated_downstream_reads',
        caveat:
          'Downstream SSIS package reads were promoted from raw SSIS XML. Upstream Snowflake dependency lineage is not surfaced in this metadata harvest.',
      };
      const evidenceCounts = frontmatter.catalog_confidence?.evidence_counts || {};
      frontmatter.catalog_confidence = {
        ...(frontmatter.catalog_confidence || {}),
        edge_correctness_score: Math.max(Number(frontmatter.catalog_confidence?.edge_correctness_score || 0), 0.9),
        evidence_counts: {
          ...evidenceCounts,
          direct_edge_count: Math.max(Number(evidenceCounts.direct_edge_count || 0), frontmatter.used_by.length),
        },
      };
    });
    if (changed) snowflakeFilesChanged += 1;
  }

  const report = {
    mode: WRITE ? 'write' : 'dry_run',
    raw_xml_root: RAW_SSIS_XML_ROOT,
    processed_xml_files: xmlFiles.length,
    snowflake_package_count: packageReads.size,
    snowflake_object_count: objectUsedBy.size,
    package_files_changed: packageFilesChanged,
    snowflake_files_changed: snowflakeFilesChanged,
    missing_snowflake_markdown: missingSnowflakeMarkdown,
    sample_packages: Array.from(packageReads.entries())
      .slice(0, 10)
      .map(([id, reads]) => ({ id, reads: Array.from(reads).slice(0, 10) })),
    note:
      'Promotes only explicit Snowflake READS_FROM edges proven by raw SSIS XML. It does not connect to Snowflake and does not harvest sample data.',
  };
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
