import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import yaml from 'yaml';

const root = process.cwd();
const packageRoot = path.join(root, 'data/lineage-runtime-package/sonic-data-lineage-runtime');
const registryPath = path.join(packageRoot, 'registry/canonical-objects.jsonl');
const manifestPath = path.join(packageRoot, 'manifest.json');
const ssisReadmePath = path.join(packageRoot, 'ssis/README.md');
const productsDir = path.join(root, 'data/products');
const docsDir = path.join(root, 'docs');

const now = '2026-06-17';

const products = [
  {
    slug: 'fire',
    name: 'FIRE',
    product_id: 'product-fire',
    domain: 'Retail Sales and Finance',
    purpose:
      'FIRE is the retail sales and finance reporting product. It centers on sales activity, gross, deal status, dealership/entity attributes, and FIRE summary outputs used by reports, downstream feeds, and operational dashboards.',
    businessImpact:
      'If FIRE is unavailable or stale, retail sales reporting, sales gross reporting, and some outbound sales/feed processes may show incomplete or stale results.',
    consumers: ['Retail Sales reporting', 'Finance reporting', 'Operational dashboards', 'External sales feeds'],
    tags: ['fire', 'retail-sales', 'finance', 'sales-summary'],
    terms: ['fire', 'factfire', 'factfiresummary'],
    folderNames: ['FIRE', 'FIRE-'],
    caveats: [
      'FIRE appears as both `FIRE` and `FIRE-` SSIS folders in the catalog.',
      'Some SSRS report references use `factFIRE` while package evidence also references `FactFireSummary`.',
    ],
  },
  {
    slug: 'force',
    name: 'FORCE',
    product_id: 'product-force',
    domain: 'Fixed Operations',
    purpose:
      'FORCE is the fixed-operations data product for service, repair order, WIP, and parts sales reporting. The lineage points to FORCE staging/control objects and Sonic_DW fact loads for service and parts activity.',
    businessImpact:
      'If FORCE is unavailable or stale, fixed-ops reporting can miss service, service-detail, WIP, or parts-sales activity.',
    consumers: ['Fixed Operations reporting', 'Service leadership', 'Parts reporting', 'Operational dashboards'],
    tags: ['force', 'fixed-ops', 'service', 'parts'],
    terms: ['force'],
    folderNames: ['FORCE'],
    caveats: [
      'The final warehouse facts are named for the service/parts subject area rather than only `FORCE`.',
    ],
  },
  {
    slug: 'fuel',
    name: 'FUEL',
    product_id: 'product-fuel',
    domain: 'Financial Accounting',
    purpose:
      'FUEL is the financial accounting and GL warehouse product. The strongest package evidence is the FUEL II chain that stages GL schedule/check/balance data and loads downstream Sonic_DW GL fact tables.',
    businessImpact:
      'If FUEL is unavailable or stale, GL schedule, GL check, GL balance, and related accounting reporting may be incomplete.',
    consumers: ['Accounting', 'Finance reporting', 'GL support', 'Warehouse reporting'],
    tags: ['fuel', 'fuel-ii', 'gl', 'accounting'],
    terms: ['fuel', 'glschedule', 'glbalance', 'glcheck'],
    folderNames: ['FUEL'],
    caveats: [
      'FUEL II is represented as project `II` under the `FUEL` SSIS folder.',
      'Not every final table has `FUEL` in the table name; several are GL-subject fact tables.',
    ],
  },
  {
    slug: 'doc',
    name: 'DOC',
    product_id: 'product-doc',
    domain: 'Dealership Operations and Accounting',
    purpose:
      'DOC is a smaller documented product area around DOC projection / document-related accounting outputs. Current lineage evidence is mostly SSIS package-level, with limited downstream object evidence.',
    businessImpact:
      'If DOC jobs are unavailable, projection or document-fee related downstream outputs may not refresh, but the current lineage package has limited evidence on final consumers.',
    consumers: ['Accounting support', 'Dealership operations support'],
    tags: ['doc', 'projection', 'accounting'],
    terms: ['doc'],
    folderNames: ['DOC'],
    caveats: [
      'DOC is a short token and can appear in non-product words. The generated evidence prioritizes SSIS folder/project/package evidence to avoid noisy matches.',
    ],
  },
  {
    slug: 'trac',
    name: 'TRAC',
    product_id: 'product-trac',
    domain: 'Traffic and Marketing Attribution',
    purpose:
      'TRAC is modeled as the traffic, source/subsource, campaign, and web-analytics product area. The lineage evidence is strongest around Traffic, Google Analytics/GA4, AutoTrader, TrueCar, DDC, and related lead/traffic staging objects.',
    businessImpact:
      'If TRAC-related data is unavailable or stale, traffic attribution, marketing-source reporting, and lead funnel analysis may be incomplete.',
    consumers: ['Marketing analytics', 'Traffic reporting', 'Lead attribution', 'Executive dashboards'],
    tags: ['trac', 'traffic', 'marketing', 'ga4', 'attribution'],
    terms: ['trac', 'traffic', 'googleanalytics', 'ga4', 'autotrader', 'truecar', 'cargurus', 'ddc'],
    folderNames: ['TrafficSummaryExport', 'Google', 'GA4', 'AutoTrader', 'TrueCar', 'DDC', 'CarGurus-VDP'],
    caveats: [
      'The catalog does not expose a clean SSIS folder named `TRAC`; this page groups the traffic and attribution evidence that appears to support the product.',
    ],
  },
  {
    slug: 'turbo',
    name: 'TURBO',
    product_id: 'product-turbo',
    domain: 'Sales Appointments and Operational Metrics',
    purpose:
      'TURBO is modeled around same-day appointment and Turbo consistency evidence. The current lineage package shows a small SSIS footprint and quality/consistency package evidence.',
    businessImpact:
      'If TURBO is unavailable or stale, same-day appointment or Turbo consistency metrics may be delayed.',
    consumers: ['Sales operations', 'Appointment reporting', 'Data quality monitoring'],
    tags: ['turbo', 'appointments', 'quality'],
    terms: ['turbo'],
    folderNames: ['TURBO_SameDayAppointments', 'DQMetrics'],
    caveats: [
      'Current lineage evidence is narrow; this product should be rechecked if additional Turbo databases or BI assets are added later.',
    ],
  },
  {
    slug: 'hypercards',
    name: 'HyperCards',
    product_id: 'product-hypercards',
    domain: 'Executive Analytics',
    purpose:
      'HyperCards is included as a key product, but the current lineage package does not expose strong object or SSIS naming evidence for `HyperCards`. This page intentionally documents the evidence gap so the product does not disappear from the catalog.',
    businessImpact:
      'If HyperCards depends on the warehouse during maintenance windows, users may see stale cards or failed drilldowns, but the current lineage package cannot yet prove the exact source and target chain.',
    consumers: ['Executive analytics users', 'Dashboard consumers'],
    tags: ['hypercards', 'executive-analytics', 'needs-lineage-review'],
    terms: ['hypercard', 'hypercards'],
    folderNames: [],
    caveats: [
      'No strong HyperCards object/folder/package matches were found in the current lineage package.',
      'This needs an owner-provided source list, BI workspace, report inventory, or application metadata source to complete.',
    ],
  },
  {
    slug: 'echopark-platform',
    name: 'EchoPark Platform',
    product_id: 'product-echopark-platform',
    domain: 'EchoPark Retail Platform',
    purpose:
      'EchoPark Platform groups EchoPark vehicle, inventory, pricing, web, CRM, and GEC reporting evidence. The lineage package shows EchoPark-specific databases/tables plus SSIS folders for EP vehicle, pricing, and GEC data movement.',
    businessImpact:
      'If EchoPark Platform data is unavailable or stale, EchoPark inventory, pricing, vehicle, CRM, and GEC reporting can be impacted.',
    consumers: ['EchoPark operations', 'EchoPark sales reporting', 'Inventory/pricing users', 'GEC reporting'],
    tags: ['echopark', 'ep', 'inventory', 'pricing', 'platform'],
    terms: ['echopark', 'webvep', 'echoparkwebv', 'epvehicle', 'eppricing', 'sims6200_ep', 'da_sims_ep', 'simsep', 'gec'],
    folderNames: ['EPVehicleNewDataLoad', 'EPPricingDataLoad', 'EleadEchoParkGECReportWTD', 'EPBlackBookandChrome'],
    caveats: [
      'Some EchoPark objects are identified by `EP`, `webvEP`, or EchoPark naming rather than one single product prefix.',
    ],
  },
  {
    slug: 'mci',
    name: 'MCI',
    product_id: 'product-mci',
    domain: 'External Franchise Feed',
    purpose:
      'MCI is an outbound franchise data feed. The SSIS evidence shows a master package, create-file package, and move-file step; the create-file package reads Sonic_DW sales/franchise data and creates an outbound file artifact.',
    businessImpact:
      'If MCI is unavailable, franchise outbound file delivery may fail or send stale sales/franchise data.',
    consumers: ['MCI franchise feed consumers', 'External/franchise reporting support'],
    tags: ['mci', 'franchise', 'outbound-file'],
    terms: ['mci'],
    folderNames: ['MCI'],
    caveats: [
      'The package evidence is file-feed oriented; no MCI-named final warehouse fact table was found.',
    ],
  },
  {
    slug: 'mdp',
    name: 'MDP',
    product_id: 'product-mdp',
    domain: 'Master Data and Identity Resolution',
    purpose:
      'MDP is modeled as master-data / identity-resolution support for organization, DMS, CRM, eLead, and customer identifier crosswalks. Current lineage evidence is object-level rather than a dedicated SSIS folder.',
    businessImpact:
      'If MDP-related crosswalks are stale, downstream joins between DMS, CRM, eLead, customer, and organization identifiers may become unreliable.',
    consumers: ['Master data support', 'Customer/entity matching', 'Cross-system reporting'],
    tags: ['mdp', 'mdm', 'xref', 'identity-resolution'],
    terms: ['mdp', 'mdm_', 'organizationxref', 'dmscoraacctidxref', 'dmseleadorgidxref', 'mdpcustomer'],
    folderNames: [],
    caveats: [
      'The current package does not expose a dedicated MDP SSIS folder; evidence is based on MDP/MDM object names and crosswalk tables.',
    ],
  },
];

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function parseRegistry() {
  return readFileSync(registryPath, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function strip(value) {
  return String(value || '').trim();
}

function lowerHaystack(row) {
  return [
    row.object_id,
    row.display_name,
    row.database,
    row.schema,
    row.object_name,
    row.object_type,
    row.ssis_folder,
    row.ssis_project,
    row.ssis_package,
    row.source_markdown_path,
    ...(row.lookup_keys || []),
    ...(row.alias_keys || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function termMatches(product, row) {
  const haystack = lowerHaystack(row);
  const folder = strip(row.ssis_folder).toLowerCase();
  if (product.folderNames.some((name) => folder === name.toLowerCase())) {
    return true;
  }
  if (product.slug === 'doc') {
    return folder === 'doc' || /\bdoc\b/i.test(`${row.ssis_project || ''} ${row.ssis_package || ''}`);
  }
  return product.terms.some((term) => haystack.includes(term.toLowerCase()));
}

function loadSsisFolders() {
  const text = readFileSync(ssisReadmePath, 'utf8');
  const rows = [];
  const pattern = /\| \[([^\]]+)\]\(([^)]+)\) \| (\d+) \| (\d+) \|/g;
  let match;
  while ((match = pattern.exec(text))) {
    rows.push({
      folder: match[1],
      path: `ssis/${match[2]}`,
      packages: Number(match[3]),
      supporting_context_records: Number(match[4]),
    });
  }
  return rows;
}

function topByScore(rows, limit = 15) {
  return [...rows]
    .sort((a, b) => {
      const scoreA = (a.upstream_count || 0) + (a.downstream_count || 0) + (a.column_count || 0) / 50;
      const scoreB = (b.upstream_count || 0) + (b.downstream_count || 0) + (b.column_count || 0) / 50;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return String(a.object_id).localeCompare(String(b.object_id));
    })
    .slice(0, limit);
}

function countBy(rows, field) {
  const counts = new Map();
  for (const row of rows) {
    const key = strip(row[field]) || '(blank)';
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, count }));
}

function table(rows, columns) {
  if (!rows.length) return '_No lineage evidence found in the current package._\n';
  const header = `| ${columns.map((column) => column.label).join(' | ')} |`;
  const sep = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map(
    (row) =>
      `| ${columns
        .map((column) => String(column.value(row) ?? '').replace(/\|/g, '\\|'))
        .join(' | ')} |`
  );
  return [header, sep, ...body].join('\n') + '\n';
}

function summarizeProduct(product, rows, folders) {
  const typeCounts = countBy(rows, 'object_type');
  const databaseCounts = countBy(rows.filter((row) => row.database && row.database !== 'ssisdb'), 'database');
  const folderCounts = countBy(rows.filter((row) => row.ssis_folder), 'ssis_folder');
  const packages = rows.filter((row) => row.object_type === 'package');
  const topAssets = topByScore(rows.filter((row) => row.object_type !== 'dataset'), 15);
  const topPackages = topByScore(packages, 15);
  const matchedFolders = folders.filter((folder) =>
    product.folderNames.some((name) => folder.folder.toLowerCase() === name.toLowerCase())
  );
  const evidenceStrength =
    rows.length === 0
      ? 'Needs source review'
      : rows.length < 5
        ? 'Limited catalog evidence'
        : rows.length < 25
          ? 'Moderate catalog evidence'
          : 'Strong catalog evidence';

  return {
    rows,
    packages,
    topAssets,
    topPackages,
    typeCounts,
    databaseCounts,
    folderCounts,
    matchedFolders,
    evidenceStrength,
  };
}

function frontmatter(product, summary) {
  return yaml.stringify({
    name: product.name,
    product_id: product.product_id,
    version: '1.0.0',
    status: 'published',
    domain: product.domain,
    owner: 'Data Engineering',
    steward: 'Data Engineering',
    assets: summary.topAssets.slice(0, 20).map((row) => row.object_id),
    sla: {},
    tags: product.tags,
    certified: false,
    certified_by: null,
    certification_date: null,
    trust_level: summary.rows.length > 0 ? 'lineage-documented' : 'needs-lineage-review',
    consumers: product.consumers,
    output_port: {
      type: 'lineage-documented asset bundle',
      location: summary.databaseCounts.slice(0, 5).map((item) => item.name).join(', '),
      format: 'SQL Server / SSIS metadata',
    },
    created_at: now,
    last_updated: now,
  });
}

function renderProduct(product, summary, manifest) {
  const dbList = summary.databaseCounts.slice(0, 12);
  const folderList = summary.folderCounts.slice(0, 12);
  const typeList = summary.typeCounts.slice(0, 8);

  return `---\n${frontmatter(product, summary)}---\n\n# ${product.name}\n\n## Plain-English Summary\n\n${product.purpose}\n\n${product.businessImpact}\n\n## Product Domain\n\n| Field | Value |\n| --- | --- |\n| Product | ${product.name} |\n| Domain | ${product.domain} |\n| Evidence strength | ${summary.evidenceStrength} |\n| Catalog objects matched | ${summary.rows.length} |\n| SSIS packages matched | ${summary.packages.length} |\n| Runtime package version | ${manifest.version} |\n| Runtime package generated | ${manifest.generated_at} |\n\n## What This Product Appears To Do\n\n${product.purpose}\n\nFor support and upgrade planning, treat this product as a bundle of warehouse tables/views/procedures, SSIS packages, and external-feed artifacts rather than a single table. The highest-impact assets below are prioritized by lineage connectivity and available column metadata.\n\n## Lineage Scope\n\n### Object Types\n\n${table(typeList, [
    { label: 'Type', value: (row) => row.name },
    { label: 'Count', value: (row) => row.count },
  ])}\n### Main Databases\n\n${table(dbList, [
    { label: 'Database', value: (row) => row.name },
    { label: 'Matched Objects', value: (row) => row.count },
  ])}\n### SSIS Folders\n\n${table(folderList, [
    { label: 'SSIS Folder', value: (row) => row.name },
    { label: 'Matched Objects', value: (row) => row.count },
  ])}\n### Folder Catalog Matches\n\n${table(summary.matchedFolders, [
    { label: 'Folder', value: (row) => row.folder },
    { label: 'Packages', value: (row) => row.packages },
    { label: 'Supporting Context Records', value: (row) => row.supporting_context_records },
    { label: 'Evidence Path', value: (row) => row.path },
  ])}\n## Important Assets To Start With\n\n${table(summary.topAssets, [
    { label: 'Asset', value: (row) => `\`${row.object_id}\`` },
    { label: 'Type', value: (row) => row.object_type },
    { label: 'Upstream', value: (row) => row.upstream_count ?? 0 },
    { label: 'Downstream', value: (row) => row.downstream_count ?? 0 },
    { label: 'Columns', value: (row) => row.column_count ?? 0 },
    { label: 'Confidence', value: (row) => row.confidence_label || '' },
  ])}\n## SSIS / Orchestration Evidence\n\n${table(summary.topPackages, [
    { label: 'Package', value: (row) => `\`${row.ssis_folder}.${row.ssis_project}.${row.ssis_package}\`` },
    { label: 'Upstream', value: (row) => row.upstream_count ?? 0 },
    { label: 'Downstream', value: (row) => row.downstream_count ?? 0 },
    { label: 'Evidence Path', value: (row) => row.source_markdown_path || row.context_pack_path || '' },
  ])}\n## Consumers And Support Impact\n\n${product.consumers.map((consumer) => `- ${consumer}`).join('\n')}\n\n## Known Gaps / Caveats\n\n${product.caveats.map((caveat) => `- ${caveat}`).join('\n')}\n\n## Evidence\n\n- Runtime package: \`${manifest.package_name}\` version \`${manifest.version}\`, hash \`${manifest.runtime_content_hash}\`\n- Registry: \`registry/canonical-objects.jsonl\`\n- SSIS folder index: \`ssis/README.md\`\n- Generated from local lineage package on ${now}\n`;
}

function renderDomainCatalog(productSummaries, manifest) {
  const rows = productSummaries.map(({ product, summary }) => ({
    product: product.name,
    domain: product.domain,
    strength: summary.evidenceStrength,
    objects: summary.rows.length,
    packages: summary.packages.length,
    databases: summary.databaseCounts.slice(0, 4).map((item) => item.name).join(', '),
    file: `data/products/${product.slug}.md`,
  }));

  return `# Products And Domains Lineage Catalog\n\nThis catalog rebuilds the business product/domain layer around the key applications named by the team: FIRE, FORCE, FUEL, DOC, TRAC, TURBO, HyperCards, EchoPark Platform, MCI, and MDP. It uses the lineage runtime package to connect each product to the database objects, SSIS folders, SSIS packages, source systems, and evidence paths currently available.\n\n## Product Summary\n\n${table(rows, [
    { label: 'Product', value: (row) => row.product },
    { label: 'Domain', value: (row) => row.domain },
    { label: 'Evidence Strength', value: (row) => row.strength },
    { label: 'Matched Objects', value: (row) => row.objects },
    { label: 'Matched Packages', value: (row) => row.packages },
    { label: 'Main Databases', value: (row) => row.databases },
    { label: 'Product File', value: (row) => `\`${row.file}\`` },
  ])}\n## Domain View\n\n${table([...new Map(rows.map((row) => [row.domain, row])).keys()].map((domain) => {
    const domainRows = rows.filter((row) => row.domain === domain);
    return {
      domain,
      products: domainRows.map((row) => row.product).join(', '),
      objects: domainRows.reduce((sum, row) => sum + row.objects, 0),
      packages: domainRows.reduce((sum, row) => sum + row.packages, 0),
    };
  }), [
    { label: 'Domain', value: (row) => row.domain },
    { label: 'Products', value: (row) => row.products },
    { label: 'Matched Objects', value: (row) => row.objects },
    { label: 'Matched Packages', value: (row) => row.packages },
  ])}\n## Evidence Notes\n\n- Product pages are generated from \`registry/canonical-objects.jsonl\` and \`ssis/README.md\`.\n- The runtime package has ${manifest.counts.object_count} objects, ${manifest.counts.ssis_package_context_count} SSIS package contexts, and was generated at \`${manifest.generated_at}\`.\n- HyperCards is intentionally retained even though the current lineage package has no strong HyperCards naming evidence. That gap should be closed by adding the BI/app/source metadata that owns HyperCards.\n- TRAC is modeled from traffic and attribution evidence because the package does not currently expose a dedicated \`TRAC\` SSIS folder or database.\n`;
}

const manifest = readJson(manifestPath);
const rows = parseRegistry();
const ssisFolders = loadSsisFolders();
const summaries = products.map((product) => ({
  product,
  summary: summarizeProduct(product, rows.filter((row) => termMatches(product, row)), ssisFolders),
}));

mkdirSync(productsDir, { recursive: true });
for (const { product, summary } of summaries) {
  writeFileSync(path.join(productsDir, `${product.slug}.md`), renderProduct(product, summary, manifest), 'utf8');
}

writeFileSync(
  path.join(docsDir, 'PRODUCTS_AND_DOMAINS_LINEAGE_CATALOG.md'),
  renderDomainCatalog(summaries, manifest),
  'utf8'
);

console.log(
  JSON.stringify(
    {
      products: summaries.map(({ product, summary }) => ({
        product: product.name,
        objects: summary.rows.length,
        packages: summary.packages.length,
        strength: summary.evidenceStrength,
      })),
      output: {
        productsDir,
        domainCatalog: path.join(docsDir, 'PRODUCTS_AND_DOMAINS_LINEAGE_CATALOG.md'),
      },
    },
    null,
    2
  )
);
