import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

const OUTPUT_DIR = path.resolve(process.cwd(), 'docs/lineage-runtime-readbacks');
const PACKET_BASENAME = 'COR-SQL-02-linked-server-alias-refresh-packet';

const alias = {
  stale_server: 'COR-SQL-02',
  canonical_server: 'L1-DWASQL-02,12010',
  databases: ['eLeadDW', 'DMS', 'Speed', 'WebV', 'Sonic_XREF', 'BI_WorkDB'],
  referencing_databases: ['ETL_Staging', 'Sonic_DW'],
};

const workflow = [
  {
    step: 1,
    name: 'Build packet',
    command: 'npm run lineage:cor-sql:packet',
    output: `docs/lineage-runtime-readbacks/${PACKET_BASENAME}.md`,
  },
  {
    step: 2,
    name: 'Targeted live SQL metadata refresh',
    command: 'npm run lineage:cor-sql:refresh',
    output: 'data/analysis/raw/live-domain-refresh-summary.json',
  },
  {
    step: 3,
    name: 'Targeted catalog rebuild from refreshed markdown',
    command: 'npm run catalog:rebuild',
    output: 'data/markdown/catalog-manifest.json',
  },
  {
    step: 4,
    name: 'Runtime package rebuild and checks',
    command:
      'npm run lineage:runtime:package && npm run lineage:runtime:check && npm run lineage:answers:check && npm run lineage:runtime:readback',
    output: 'data/lineage-runtime-package/sonic-data-lineage-runtime/manifest.json',
  },
  {
    step: 5,
    name: 'DevOps repo sync',
    command: 'npm run lineage:runtime:sync',
    output: '../Sonic-data-lineage/reports/runtime-sync-summary.json',
  },
  {
    step: 6,
    name: 'Confluence targeted review/publish',
    command:
      'npm run confluence:rovo:validate && npm run confluence:rovo:publish-packet && node scripts/publish-human-confluence-catalog-pilot.mjs --output-root data/confluence/rovo-ai-retrieval-dry-run --packet docs/confluence-full-database-catalog-deployment/FDP-06-rovo-ai-retrieval-publish-packet.json --publish',
    output: 'data/confluence/rovo-ai-retrieval-dry-run',
    approval_required: true,
  },
];

function markdownTable(rows, columns) {
  const header = `| ${columns.join(' | ')} |`;
  const separator = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${columns.map((column) => row[column] ?? '').join(' | ')} |`);
  return [header, separator, ...body].join('\n');
}

const packet = {
  schema_version: 1,
  generated_at: new Date().toISOString(),
  scope: 'COR-SQL-02 linked-server alias lineage repair only',
  alias,
  allowed_targets: [
    'local markdown',
    'runtime package',
    'DevOps generated lineage repo',
    'Confluence AI retrieval and affected human catalog pages after targeted review',
  ],
  forbidden_scope: [
    'full catalog redesign',
    'broad Confluence tree regeneration',
    'unbounded dry-run matrix',
    'parser or scoring redesign',
    'raw row extraction',
    'secrets or connection-string publication',
  ],
  workflow,
};

const md = `# COR-SQL-02 Linked-Server Alias Refresh Packet

Generated at: \`${packet.generated_at}\`

## Purpose

Refresh only lineage affected by stale \`COR-SQL-02\` references by canonicalizing
them to \`${alias.canonical_server}\`. This packet is intentionally mechanical so
it can be run at low intelligence one step at a time.

## Fixed Scope

${markdownTable(
  [
    { Field: 'Stale server token', Value: `\`${alias.stale_server}\`` },
    { Field: 'Canonical linked server', Value: `\`${alias.canonical_server}\`` },
    { Field: 'Referencing databases', Value: alias.referencing_databases.map((item) => `\`${item}\``).join(', ') },
    { Field: 'Referenced source databases', Value: alias.databases.map((item) => `\`${item}\``).join(', ') },
  ],
  ['Field', 'Value']
)}

## Allowed Outputs

- Local markdown under \`data/markdown\`
- Raw sanitized metadata under \`data/analysis/raw/sqlserver\`
- Runtime package under \`data/lineage-runtime-package/sonic-data-lineage-runtime\`
- Generated DevOps repo artifacts under \`../Sonic-data-lineage\`
- Targeted Confluence Rovo/human pages after the packet is reviewed

## Forbidden Scope

${packet.forbidden_scope.map((item) => `- ${item}`).join('\n')}

## Low-Intelligence Workflow

${markdownTable(
  workflow.map((row) => ({
    Step: row.step,
    Name: row.name,
    Command: `\`${row.command}\``,
    Output: `\`${row.output}\``,
    Approval: row.approval_required ? 'Required before live publish' : 'Not required',
  })),
  ['Step', 'Name', 'Command', 'Output', 'Approval']
)}

## Stop Triggers

- Any target refresh returns zero objects.
- \`COR-SQL-02\` remains in runtime registry, context packs, or answer cards after rebuild.
- \`L1-DWASQL-02,12010.eLeadDW.dbo.dwFullOpportunity\` cannot be resolved from the runtime package.
- Validation reports raw rows, secrets, credential values, or connection strings.
- Confluence or DevOps publish would include files outside the affected alias slice.

## Acceptance Checks

- FactOpportunity upstream answer includes the eLeadDW table family, not only two tables.
- Runtime package aliases resolve \`COR-SQL-02.eLeadDW.dbo.dwFullOpportunity\` and \`L1-DWASQL-02,12010.eLeadDW.dbo.dwFullOpportunity\` to the same canonical object where cataloged.
- DevOps repo sync summary records the new runtime content hash.
- Confluence affected pages cite the corrected runtime artifact paths.
`;

await mkdir(OUTPUT_DIR, { recursive: true });
await writeFile(path.join(OUTPUT_DIR, `${PACKET_BASENAME}.json`), `${JSON.stringify(packet, null, 2)}\n`);
await writeFile(path.join(OUTPUT_DIR, `${PACKET_BASENAME}.md`), md);

console.log(JSON.stringify({
  status: 'written',
  markdown: path.join(OUTPUT_DIR, `${PACKET_BASENAME}.md`),
  json: path.join(OUTPUT_DIR, `${PACKET_BASENAME}.json`),
}, null, 2));
