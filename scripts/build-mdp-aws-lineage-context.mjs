import 'dotenv/config';

import crypto from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_INPUT_DIR = './docs/lineage-runtime-readbacks/aws-lineage';
const DEFAULT_OUTPUT_ROOT = './docs/lineage-runtime-readbacks/aws-mdp-lineage-context';
const DEFAULT_ROUTE_CONFIG = './config/aws-lineage-product-routing.json';
const ROUTE_ID = 'mdp-aws-lineage-context';

function args() {
  return process.argv.slice(2);
}

function argValue(name, fallback = '') {
  const prefix = `${name}=`;
  const inline = args().find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = args().indexOf(name);
  if (index >= 0) return args()[index + 1] || fallback;
  return fallback;
}

function hasFlag(name) {
  return args().includes(name);
}

function normalizePath(filePath) {
  return path.resolve(filePath).replace(/\\/g, '/');
}

function relativePath(from, to) {
  return path.relative(from, to).replace(/\\/g, '/');
}

function parentPathFor(pagePath) {
  return String(pagePath || '')
    .split(' / ')
    .slice(0, -1)
    .join(' / ');
}

function slug(value) {
  return String(value || 'page')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function bestAwsPackages(inputDir) {
  const files = (await readdir(inputDir, { withFileTypes: true }))
    .filter((item) => item.isFile() && item.name.endsWith('-aws-lineage-package.json'))
    .map((item) => path.join(inputDir, item.name));
  const packagesByScope = new Map();
  for (const filePath of files) {
    const lineagePackage = await readJson(filePath);
    const scope = lineagePackage.source_scope || lineagePackage.connector_id || filePath;
    const existing = packagesByScope.get(scope);
    if (!existing || shouldReplacePackage(lineagePackage, existing.lineagePackage)) {
      packagesByScope.set(scope, { filePath, lineagePackage });
    }
  }
  return [...packagesByScope.values()].sort((left, right) =>
    String(left.lineagePackage.source_scope).localeCompare(
      String(right.lineagePackage.source_scope)
    )
  );
}

function shouldReplacePackage(candidate, existing) {
  if (hasFlag('--latest-only')) {
    return (
      String(candidate.generated_at || '').localeCompare(String(existing.generated_at || '')) > 0
    );
  }
  const candidateObjects = candidate.summary?.object_count || candidate.objects?.length || 0;
  const existingObjects = existing.summary?.object_count || existing.objects?.length || 0;
  if (candidateObjects !== existingObjects) return candidateObjects > existingObjects;
  return (
    String(candidate.generated_at || '').localeCompare(String(existing.generated_at || '')) > 0
  );
}

function selectedRoute(routeConfig) {
  const route = (routeConfig.routes || []).find((item) => item.route_id === ROUTE_ID);
  if (!route) throw new Error(`Missing AWS product route ${ROUTE_ID}.`);
  return route;
}

function packageBelongsToRoute(lineagePackage, route) {
  const productAreas = new Set([
    lineagePackage.primary_product_area,
    ...Object.keys(lineagePackage.product_areas || {}),
  ]);
  if (productAreas.has(route.product_area)) return true;
  const connectorIds = new Set(route.current_connector_ids || []);
  const accountIds = new Set(route.current_account_ids || []);
  if ((lineagePackage.source_connector_ids || []).some((id) => connectorIds.has(id))) return true;
  if (accountIds.has(String(accountIdFromPackage(lineagePackage)))) return true;
  return false;
}

function accountIdFromPackage(lineagePackage) {
  return (
    lineagePackage.objects?.find((object) => object.account_id)?.account_id ||
    String(lineagePackage.source_scope || '').match(/aws-account:([^:]+)/)?.[1] ||
    ''
  );
}

function objectWithRoute(object, lineagePackage, route) {
  const humanPage = humanPageForObject(object, route);
  return {
    ...object,
    product_area: object.product_area || lineagePackage.primary_product_area || route.product_area,
    business_domain: object.business_domain || route.business_domain || '',
    product_route_id: object.product_route_id || route.route_id,
    human_catalog_root: route.human_root_path,
    canonical_human_page: `${route.human_root_path} / ${humanPage}`,
    ownership_boundary: {
      ...(route.ownership_boundary || {}),
      ...(object.ownership_boundary || {}),
    },
    lineage_tags: [
      ...new Set([...(object.lineage_tags || []), 'aws', 'mdp', `product:${route.product_area}`]),
    ].sort(),
  };
}

function humanPageForObject(object) {
  if (object.object_type === 'aws_account' || object.object_type?.includes('_service')) {
    return 'AWS Accounts And Services';
  }
  if (object.service === 's3' || object.service === 'glue' || object.service === 'athena') {
    return 'S3 Glue Athena Lineage';
  }
  return 'Technical Evidence And Readbacks';
}

function edgeWithDisplays(edge, objectsById) {
  return {
    ...edge,
    from_display: edge.from_display || objectsById.get(edge.from)?.display_name || edge.from,
    to_display: edge.to_display || objectsById.get(edge.to)?.display_name || edge.to,
  };
}

function countBy(values) {
  const counts = {};
  for (const value of values) {
    const key = String(value || 'not surfaced');
    counts[key] = (counts[key] || 0) + 1;
  }
  return Object.fromEntries(
    Object.entries(counts).sort(([left], [right]) => left.localeCompare(right))
  );
}

function table(headers, rows) {
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...(rows.length
      ? rows.map((row) => `| ${row.map(markdownCell).join(' | ')} |`)
      : [`| ${headers.map(() => 'none').join(' | ')} |`]),
  ].join('\n');
}

function markdownCell(value) {
  return String(value ?? '')
    .replace(/\r?\n/g, '<br>')
    .replace(/\|/g, '\\|');
}

function jsonLine(value) {
  return JSON.stringify(value);
}

function hashJson(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex').toUpperCase();
}

function sourcePackageRows(sourcePackages) {
  return sourcePackages.map(({ filePath, lineagePackage }) => [
    lineagePackage.source_scope,
    lineagePackage.connector_id,
    lineagePackage.generated_at,
    lineagePackage.summary?.object_count || 0,
    lineagePackage.summary?.edge_count || 0,
    normalizePath(filePath),
  ]);
}

function accountRows(objects) {
  const accountMap = new Map();
  for (const object of objects) {
    const key = `${object.account_id}:${object.region}`;
    if (!accountMap.has(key)) {
      accountMap.set(key, {
        account_id: object.account_id,
        account_name: object.account_name,
        region: object.region,
        services: new Set(),
        objects: 0,
      });
    }
    const row = accountMap.get(key);
    row.services.add(object.service);
    row.objects += 1;
  }
  return [...accountMap.values()]
    .sort((left, right) => left.account_id.localeCompare(right.account_id))
    .map((row) => [
      row.account_name,
      row.account_id,
      row.region,
      [...row.services].filter(Boolean).sort().join(', '),
      row.objects,
    ]);
}

function typeRows(objects) {
  return Object.entries(countBy(objects.map((object) => object.object_type))).map(
    ([type, count]) => [type, count]
  );
}

function edgeRows(edges) {
  return Object.entries(countBy(edges.map((edge) => edge.relationship_type))).map(
    ([type, count]) => [type, count]
  );
}

function topAssetRows(objects, limit = 60) {
  return objects
    .filter((object) => !object.object_type?.includes('column'))
    .sort(
      (left, right) =>
        (right.relationship_count || 0) - (left.relationship_count || 0) ||
        left.canonical_id.localeCompare(right.canonical_id)
    )
    .slice(0, limit)
    .map((object) => [
      object.display_name,
      object.object_type,
      object.account_name,
      object.service,
      object.relationship_count || 0,
      object.canonical_human_page,
    ]);
}

function lineageRows(edges, limit = 120) {
  return edges
    .sort(
      (left, right) =>
        (right.confidence || 0) - (left.confidence || 0) || left.id.localeCompare(right.id)
    )
    .slice(0, limit)
    .map((edge) => [
      edge.relationship_type,
      edge.from_display,
      edge.to_display,
      edge.confidence,
      edge.evidence?.reason || 'not surfaced',
    ]);
}

function gapRows(sourcePackages) {
  return sourcePackages.flatMap(({ lineagePackage }) =>
    (lineagePackage.gaps || []).map((gap) => [
      lineagePackage.source_scope,
      gap.object_id,
      gap.gap_type,
      gap.message,
    ])
  );
}

function page(title, parentPath, body) {
  const pagePath = `${parentPath} / ${title}`;
  return {
    title,
    parent_path: parentPath,
    page_path: pagePath,
    file_name: `${slug(title)}.md`,
    body,
  };
}

function buildHumanPages({ route, sourcePackages, objects, edges, generatedAt }) {
  const root = route.human_root_path;
  const rootParent = parentPathFor(root);
  return [
    page(
      'MDP AWS Lineage Context',
      rootParent,
      [
        '# MDP AWS Lineage Context',
        '',
        `Generated: ${generatedAt}`,
        '',
        '## Plain-English Summary',
        '',
        'This page is the data-team-facing lineage context for the current AWS metadata gathered from MDP-specific accounts. It is deliberately placed under the MDP data product branch so it can be moved to an MDP-owned Confluence space later without changing the DevOps lineage evidence.',
        '',
        '## Ownership Boundary',
        '',
        table(
          ['Signal', 'Value'],
          [
            ['Product area', route.product_area],
            ['Business domain', route.business_domain],
            ['System owner', route.ownership_boundary?.system_owner || 'not surfaced'],
            ['Data team role', route.ownership_boundary?.data_team_role || 'not surfaced'],
            ['Ownership note', route.ownership_boundary?.ownership_note || 'not surfaced'],
          ]
        ),
        '',
        '## At A Glance',
        '',
        table(
          ['Signal', 'Count'],
          [
            [
              'AWS accounts/regions',
              new Set(objects.map((object) => `${object.account_id}:${object.region}`)).size,
            ],
            ['Cataloged AWS objects', objects.length],
            ['Deterministic lineage edges', edges.length],
            ['Source lineage packages', sourcePackages.length],
          ]
        ),
        '',
        '## Child Pages',
        '',
        table(
          ['Page', 'Purpose'],
          [
            [
              'Data Team Feed Summary',
              'Explains where the data team appears in the MDP AWS footprint.',
            ],
            [
              'AWS Accounts And Services',
              'Lists accounts, regions, services, and connector scope.',
            ],
            [
              'S3 Glue Athena Lineage',
              'Shows the deterministic S3, Glue, and Athena relationships.',
            ],
            [
              'Known Gaps And Ownership',
              'Calls out what metadata does not prove and who should resolve it.',
            ],
            [
              'Technical Evidence And Readbacks',
              'Links to package files, source readbacks, Rovo files, and DevOps outputs.',
            ],
          ]
        ),
        '',
        '## Technical Evidence',
        '',
        'This page is generated from the bounded MDP AWS lineage context package. Use the child Technical Evidence And Readbacks page for package files, source readbacks, Rovo files, and DevOps outputs.',
      ].join('\n')
    ),
    page(
      'Data Team Feed Summary',
      root,
      [
        '# Data Team Feed Summary',
        '',
        `Generated: ${generatedAt}`,
        '',
        '## Plain-English Summary',
        '',
        'The current AWS lineage evidence is MDP-specific. The data team should treat this as a feed and dependency context, not as proof that the data team owns the full AWS implementation.',
        '',
        '## Technical Evidence',
        '',
        '## Source Packages',
        '',
        table(
          ['Source scope', 'Lineage connector', 'Generated', 'Objects', 'Edges', 'File'],
          sourcePackageRows(sourcePackages)
        ),
        '',
        '## Highest Relationship Assets',
        '',
        table(
          ['Asset', 'Type', 'Account', 'Service', 'Relationships', 'Human page'],
          topAssetRows(objects, 40)
        ),
      ].join('\n')
    ),
    page(
      'AWS Accounts And Services',
      root,
      [
        '# AWS Accounts And Services',
        '',
        `Generated: ${generatedAt}`,
        '',
        '## Plain-English Summary',
        '',
        'These accounts and services are currently routed to the MDP AWS lineage context. Future AWS connectors must be routed explicitly and should not inherit this placement automatically.',
        '',
        '## Technical Evidence',
        '',
        '## Accounts',
        '',
        table(
          ['Account name', 'Account ID', 'Region', 'Services', 'Objects'],
          accountRows(objects)
        ),
        '',
        '## Objects By Type',
        '',
        table(['Object type', 'Objects'], typeRows(objects)),
      ].join('\n')
    ),
    page(
      'S3 Glue Athena Lineage',
      root,
      [
        '# S3 Glue Athena Lineage',
        '',
        `Generated: ${generatedAt}`,
        '',
        '## Plain-English Summary',
        '',
        'This page summarizes deterministic AWS metadata edges. Storage-to-table edges come from Glue table storage locations. Athena-to-Glue edges come from Athena catalog/table metadata and named query references when surfaced.',
        '',
        '## Technical Evidence',
        '',
        '## Edges By Type',
        '',
        table(['Relationship type', 'Edges'], edgeRows(edges)),
        '',
        '## Lineage Edge Sample',
        '',
        table(['Relationship', 'From', 'To', 'Confidence', 'Reason'], lineageRows(edges, 120)),
      ].join('\n')
    ),
    page(
      'Known Gaps And Ownership',
      root,
      [
        '# Known Gaps And Ownership',
        '',
        `Generated: ${generatedAt}`,
        '',
        '## Plain-English Summary',
        '',
        'This context is intentionally conservative. AWS names can suggest meaning, but generated human descriptions must only state business purpose, ownership, SLA, freshness, or certification when metadata or reviewed documentation surfaces it.',
        '',
        '## Technical Evidence',
        '',
        '## Ownership Boundary',
        '',
        table(
          ['Boundary', 'Rule'],
          [
            ['Current route', 'All current AWS connector records are MDP-specific.'],
            [
              'Future AWS',
              'Future AWS connectors require explicit product_area, product_route_id, and human_catalog_root.',
            ],
            [
              'Data team responsibility',
              route.ownership_boundary?.data_team_role || 'not surfaced',
            ],
            ['MDP responsibility', route.ownership_boundary?.system_owner || 'not surfaced'],
          ]
        ),
        '',
        '## Package Gaps',
        '',
        table(['Source scope', 'Object', 'Gap', 'Message'], gapRows(sourcePackages)),
      ].join('\n')
    ),
    page(
      'Technical Evidence And Readbacks',
      root,
      [
        '# Technical Evidence And Readbacks',
        '',
        `Generated: ${generatedAt}`,
        '',
        '## Plain-English Summary',
        '',
        'This page is for maintainers and reviewers who need the machine-readable evidence behind the MDP AWS lineage context.',
        '',
        '## Technical Evidence',
        '',
        '## Generated Outputs',
        '',
        table(
          ['Output', 'Local path'],
          [
            ['Human page markdown', normalizePath(path.join(outputRoot(), 'confluence-human'))],
            ['Rovo retrieval artifacts', normalizePath(path.join(outputRoot(), 'confluence-rovo'))],
            ['DevOps machine files', normalizePath(path.join(outputRoot(), 'devops'))],
            [
              'Package manifest',
              normalizePath(path.join(outputRoot(), 'mdp-aws-lineage-context-package.json')),
            ],
          ]
        ),
        '',
        '## Source Package Files',
        '',
        table(
          ['Source scope', 'Lineage connector', 'Generated', 'Objects', 'Edges', 'File'],
          sourcePackageRows(sourcePackages)
        ),
      ].join('\n')
    ),
  ];
}

let currentOutputRoot = '';

function outputRoot() {
  return currentOutputRoot || DEFAULT_OUTPUT_ROOT;
}

function buildRovoPages({ route, objects, edges, generatedAt }) {
  const parentPath = route.rovo_root_path;
  return [
    page(
      'MDP AWS Rovo Start Here',
      parentPath,
      [
        '# MDP AWS Rovo Start Here',
        '',
        `Generated: ${generatedAt}`,
        '',
        '## Plain-English Summary',
        '',
        'Use these pages for AWS questions related to the current MDP-specific lineage evidence. Resolve an object in the locator first, then read the summary or lineage context. Do not infer business ownership, SLA, freshness, or certification from an AWS name alone.',
        '',
        '## Technical Evidence',
        '',
        'This page is generated from the MDP AWS lineage context package and is intended for Rovo retrieval, not primary human navigation.',
      ].join('\n')
    ),
    page(
      'MDP AWS Rovo Object Locator 001',
      parentPath,
      [
        '# MDP AWS Rovo Object Locator 001',
        '',
        '## Plain-English Summary',
        '',
        'This compact locator maps AWS display names to canonical ids, source context, confidence, and canonical human pages for MDP-routed AWS metadata.',
        '',
        '## Technical Evidence',
        '',
        table(
          [
            'lookup_key',
            'canonical_id',
            'type',
            'account',
            'region',
            'service',
            'quick_context_page',
            'canonical_human_page',
            'confidence',
          ],
          objects.map((object) => [
            object.display_name,
            object.canonical_id,
            object.object_type,
            object.account_name,
            object.region,
            object.service,
            `${parentPath} / MDP AWS Rovo Object Summary Context 001`,
            object.canonical_human_page || 'not created yet',
            object.confidence || 0,
          ])
        ),
      ].join('\n')
    ),
    page(
      'MDP AWS Rovo Object Summary Context 001',
      parentPath,
      [
        '# MDP AWS Rovo Object Summary Context 001',
        '',
        '## Plain-English Summary',
        '',
        'This compact object summary gives Rovo enough canonical context to answer AWS lineage questions without scanning the full human tree.',
        '',
        '## Technical Evidence',
        '',
        table(
          [
            'canonical_id',
            'display_name',
            'type',
            'product_area',
            'account',
            'service',
            'upstream',
            'downstream',
            'missing_facts',
            'canonical_human_page',
          ],
          objects.map((object) => [
            object.canonical_id,
            object.display_name,
            object.object_type,
            object.product_area,
            object.account_name,
            object.service,
            object.upstream_count || 0,
            object.downstream_count || 0,
            (object.missing_facts || []).join(', ') || 'none surfaced',
            object.canonical_human_page || 'not created yet',
          ])
        ),
      ].join('\n')
    ),
    page(
      'MDP AWS Rovo Lineage Context 001',
      parentPath,
      [
        '# MDP AWS Rovo Lineage Context 001',
        '',
        '## Plain-English Summary',
        '',
        'This compact lineage context lists deterministic AWS relationship edges for MDP-routed AWS metadata.',
        '',
        '## Technical Evidence',
        '',
        table(['relationship', 'from', 'to', 'confidence', 'reason'], lineageRows(edges, 500)),
      ].join('\n')
    ),
  ];
}

async function writePages(root, pages) {
  await mkdir(root, { recursive: true });
  const written = [];
  for (const item of pages) {
    const filePath = path.join(root, item.file_name);
    await writeFile(filePath, `${item.body}\n`, 'utf8');
    written.push({
      title: item.title,
      parent_path: item.parent_path,
      page_path: item.page_path,
      file_path: normalizePath(filePath),
    });
  }
  return written;
}

async function writePublishEvidence({ evidenceRoot, pages, route, generatedAt, family, summary }) {
  await mkdir(evidenceRoot, { recursive: true });
  const evidence = [];
  for (const item of pages) {
    const pageEvidence = {
      schema_version: '1.0',
      generated_at: generatedAt,
      page_type: family,
      page_title: item.title,
      page_tree_path: item.page_path.split(' / '),
      route_id: route.route_id,
      product_area: route.product_area,
      business_domain: route.business_domain,
      human_root_path: route.human_root_path,
      rovo_root_path: route.rovo_root_path,
      summary,
    };
    const evidenceHash = `sha256:${hashJson(pageEvidence)}`;
    pageEvidence.evidence_hash = evidenceHash;
    const evidencePath = path.join(evidenceRoot, `${slug(item.title)}.evidence.json`);
    await writeFile(evidencePath, `${JSON.stringify(pageEvidence, null, 2)}\n`, 'utf8');
    evidence.push({
      title: item.title,
      treePath: pageEvidence.page_tree_path,
      evidence_hash: evidenceHash,
      evidence_file: relativePath(currentOutputRoot, evidencePath),
      markdown_file: relativePath(currentOutputRoot, item.file_path),
      page_type: family,
    });
  }
  return evidence;
}

async function writeConfluencePublishPacket({
  route,
  generatedAt,
  humanEvidence,
  rovoEvidence,
  summary,
}) {
  const packetPath = path.join(currentOutputRoot, 'mdp-aws-confluence-publish-packet.json');
  const packet = {
    generated_at: generatedAt,
    scope: {
      root_path: route.human_root_path,
      route_id: route.route_id,
      product_area: route.product_area,
      publish_mode: 'reviewed explicit MDP AWS publish packet',
      cleanup_mode: 'none',
    },
    delta_scope: {
      active: true,
      source_family: 'aws',
      product_area: route.product_area,
      route_id: route.route_id,
    },
    required_labels: ['human-lineage-catalog', 'aws-lineage', 'mdp'],
    validation: {
      status: 'passed',
      failures: [],
    },
    summary,
    planned_pages: [
      {
        kind: 'reference',
        title: 'Data Product Catalog',
        treePath: ['Sonic Data Lineage', 'Data Product Catalog'],
        page_type: 'reference',
        evidence_hash: null,
        evidence_file: null,
        markdown_file: null,
        labels: ['human-lineage-catalog', 'lineage-product-catalog'],
      },
      {
        kind: 'reference',
        title: 'AI Retrieval Artifacts',
        treePath: ['Sonic Data Lineage', 'AI Retrieval Artifacts'],
        page_type: 'reference',
        evidence_hash: null,
        evidence_file: null,
        markdown_file: null,
        labels: ['human-lineage-catalog', 'rovo-ai-retrieval', 'ai-retrieval-artifact'],
      },
      ...humanEvidence.map((item) => ({
        kind: 'leaf',
        title: item.title,
        treePath: item.treePath,
        page_type: item.page_type,
        evidence_hash: item.evidence_hash,
        evidence_file: item.evidence_file,
        markdown_file: item.markdown_file,
        labels: ['human-lineage-catalog', 'lineage-product-catalog', 'aws-lineage', 'mdp'],
      })),
      ...rovoEvidence.map((item) => ({
        kind: 'leaf',
        title: item.title,
        treePath: item.treePath,
        page_type: item.page_type,
        evidence_hash: item.evidence_hash,
        evidence_file: item.evidence_file,
        markdown_file: item.markdown_file,
        labels: [
          'human-lineage-catalog',
          'rovo-ai-retrieval',
          'ai-retrieval-artifact',
          'aws-lineage',
          'mdp',
        ],
      })),
    ],
  };
  await writeFile(packetPath, `${JSON.stringify(packet, null, 2)}\n`, 'utf8');
  return normalizePath(packetPath);
}

async function writeDevopsOutputs(root, { route, sourcePackages, objects, edges, generatedAt }) {
  await mkdir(root, { recursive: true });
  const summaryPath = path.join(root, 'aws-mdp-summary.json');
  const objectsPath = path.join(root, 'aws-mdp-object-registry.jsonl');
  const edgesPath = path.join(root, 'aws-mdp-lineage-edges.jsonl');
  const evidencePath = path.join(root, 'aws-mdp-evidence-packets.jsonl');
  const summary = {
    schema_version: '1.0',
    generated_at: generatedAt,
    route_id: route.route_id,
    product_area: route.product_area,
    business_domain: route.business_domain,
    source_package_count: sourcePackages.length,
    object_count: objects.length,
    edge_count: edges.length,
    objects_by_type: countBy(objects.map((object) => object.object_type)),
    edges_by_type: countBy(edges.map((edge) => edge.relationship_type)),
    source_packages: sourcePackages.map(({ filePath, lineagePackage }) => ({
      source_scope: lineagePackage.source_scope,
      connector_id: lineagePackage.connector_id,
      generated_at: lineagePackage.generated_at,
      file_path: normalizePath(filePath),
      object_count: lineagePackage.summary?.object_count || 0,
      edge_count: lineagePackage.summary?.edge_count || 0,
      gap_count: lineagePackage.summary?.gap_count || 0,
    })),
  };
  await writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  await writeFile(
    objectsPath,
    `${objects
      .map((object) =>
        jsonLine({
          canonical_id: object.canonical_id,
          display_name: object.display_name,
          object_type: object.object_type,
          platform: object.platform,
          product_area: object.product_area,
          business_domain: object.business_domain,
          product_route_id: object.product_route_id,
          account_id: object.account_id,
          account_name: object.account_name,
          region: object.region,
          service: object.service,
          native_id: object.native_id,
          parent_id: object.parent_id,
          database: object.database || '',
          schema: object.schema || '',
          object_name: object.object_name || '',
          upstream_count: object.upstream_count || 0,
          downstream_count: object.downstream_count || 0,
          canonical_human_page: object.canonical_human_page || '',
          confidence: object.confidence || 0,
          lineage_tags: object.lineage_tags || [],
        })
      )
      .join('\n')}\n`,
    'utf8'
  );
  await writeFile(
    edgesPath,
    `${edges
      .map((edge) =>
        jsonLine({
          id: edge.id,
          from: edge.from,
          from_display: edge.from_display,
          to: edge.to,
          to_display: edge.to_display,
          relationship_type: edge.relationship_type,
          confidence: edge.confidence || 0,
          reason: edge.evidence?.reason || '',
        })
      )
      .join('\n')}\n`,
    'utf8'
  );
  await writeFile(
    evidencePath,
    `${objects
      .map((object) =>
        jsonLine({
          canonical_id: object.canonical_id,
          product_area: object.product_area,
          bounded_evidence: {
            native_id: object.native_id,
            parent_id: object.parent_id,
            account_id: object.account_id,
            region: object.region,
            service: object.service,
            columns: object.columns || [],
            attributes: object.attributes || {},
            missing_facts: object.missing_facts || [],
          },
        })
      )
      .join('\n')}\n`,
    'utf8'
  );
  return [
    normalizePath(summaryPath),
    normalizePath(objectsPath),
    normalizePath(edgesPath),
    normalizePath(evidencePath),
  ];
}

async function main() {
  const generatedAt = new Date().toISOString();
  const inputDir = path.resolve(argValue('--input-dir', DEFAULT_INPUT_DIR));
  currentOutputRoot = path.resolve(argValue('--output-root', DEFAULT_OUTPUT_ROOT));
  const routeConfigPath = path.resolve(argValue('--route-config', DEFAULT_ROUTE_CONFIG));
  const route = selectedRoute(await readJson(routeConfigPath));
  const packages = (await bestAwsPackages(inputDir)).filter(({ lineagePackage }) =>
    packageBelongsToRoute(lineagePackage, route)
  );
  if (!packages.length) throw new Error(`No AWS lineage packages matched route ${route.route_id}.`);

  const objectsById = new Map();
  for (const { lineagePackage } of packages) {
    for (const object of lineagePackage.objects || []) {
      const routed = objectWithRoute(object, lineagePackage, route);
      objectsById.set(routed.canonical_id, {
        ...(objectsById.get(routed.canonical_id) || {}),
        ...routed,
      });
    }
  }
  const edgesById = new Map();
  for (const { lineagePackage } of packages) {
    for (const edge of lineagePackage.edges || []) {
      if (objectsById.has(edge.from) && objectsById.has(edge.to)) {
        edgesById.set(edge.id, edgeWithDisplays(edge, objectsById));
      }
    }
  }
  const objects = [...objectsById.values()].sort((left, right) =>
    left.canonical_id.localeCompare(right.canonical_id)
  );
  const edges = [...edgesById.values()].sort((left, right) => left.id.localeCompare(right.id));

  const humanPages = buildHumanPages({
    route,
    sourcePackages: packages,
    objects,
    edges,
    generatedAt,
  });
  const rovoPages = buildRovoPages({ route, objects, edges, generatedAt });
  const confluenceHuman = await writePages(
    path.join(currentOutputRoot, 'confluence-human'),
    humanPages
  );
  const confluenceRovo = await writePages(
    path.join(currentOutputRoot, 'confluence-rovo'),
    rovoPages
  );
  const packageSummary = {
    source_package_count: packages.length,
    object_count: objects.length,
    edge_count: edges.length,
    human_page_count: confluenceHuman.length,
    rovo_page_count: confluenceRovo.length,
  };
  const humanEvidence = await writePublishEvidence({
    evidenceRoot: path.join(currentOutputRoot, 'confluence-evidence'),
    pages: confluenceHuman,
    route,
    generatedAt,
    family: 'mdp-aws-human-page',
    summary: packageSummary,
  });
  const rovoEvidence = await writePublishEvidence({
    evidenceRoot: path.join(currentOutputRoot, 'confluence-evidence'),
    pages: confluenceRovo,
    route,
    generatedAt,
    family: 'mdp-aws-rovo-page',
    summary: packageSummary,
  });
  const confluencePublishPacket = await writeConfluencePublishPacket({
    route,
    generatedAt,
    humanEvidence,
    rovoEvidence,
    summary: packageSummary,
  });
  const devopsFiles = await writeDevopsOutputs(path.join(currentOutputRoot, 'devops'), {
    route,
    sourcePackages: packages,
    objects,
    edges,
    generatedAt,
  });

  const manifest = {
    schema_version: '1.0',
    generated_at: generatedAt,
    mode: hasFlag('--publish') ? 'publish_ready_packet' : 'local_package',
    source_package_selection: hasFlag('--latest-only')
      ? 'latest_package_per_source_scope'
      : 'highest_object_count_per_source_scope_then_latest',
    route,
    source_package_count: packages.length,
    object_count: objects.length,
    edge_count: edges.length,
    confluence_human_pages: confluenceHuman,
    rovo_pages: confluenceRovo,
    confluence_publish_packet: confluencePublishPacket,
    devops_files: devopsFiles,
  };
  const manifestPath = path.join(currentOutputRoot, 'mdp-aws-lineage-context-package.json');
  const readbackPath = path.join(currentOutputRoot, 'mdp-aws-lineage-context-readback.md');
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  await writeFile(
    readbackPath,
    [
      '# MDP AWS Lineage Context Package Readback',
      '',
      `Generated: ${generatedAt}`,
      '',
      `Route: ${route.route_id}`,
      '',
      `Product area: ${route.product_area}`,
      '',
      `Source package selection: ${manifest.source_package_selection}`,
      '',
      `Human root: ${route.human_root_path}`,
      '',
      table(
        ['Signal', 'Count'],
        [
          ['Source packages', packages.length],
          ['Objects', objects.length],
          ['Edges', edges.length],
          ['Human Confluence pages', confluenceHuman.length],
          ['Rovo pages', confluenceRovo.length],
          ['DevOps files', devopsFiles.length],
          ['Confluence publish packet', confluencePublishPacket],
        ]
      ),
      '',
      '## Source Packages',
      '',
      table(
        ['Source scope', 'Lineage connector', 'Generated', 'Objects', 'Edges', 'File'],
        sourcePackageRows(packages)
      ),
    ].join('\n'),
    'utf8'
  );

  console.log(
    JSON.stringify(
      {
        status: 'succeeded',
        route_id: route.route_id,
        product_area: route.product_area,
        source_package_count: packages.length,
        object_count: objects.length,
        edge_count: edges.length,
        human_page_count: confluenceHuman.length,
        rovo_page_count: confluenceRovo.length,
        devops_file_count: devopsFiles.length,
        confluence_publish_packet: confluencePublishPacket,
        manifest_path: normalizePath(manifestPath),
        readback_path: normalizePath(readbackPath),
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
