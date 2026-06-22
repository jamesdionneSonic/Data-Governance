import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'yaml';
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool';

const repoRoot = 'C:/projects/Sonic-data-lineage';
const packageRoot = path.join(repoRoot, 'servers/V1-SSIS25-01,_11040/ssis_packages');
const outputDir = path.resolve('../../outputs/ssis-runtime-baselines');
const outputPath = path.join(outputDir, 'ssis_master_runtime_baselines.xlsx');

function clean(value) {
  return String(value ?? '').trim();
}

function secondsToMinutes(value) {
  const seconds = Number(value);
  return Number.isFinite(seconds) ? Math.round((seconds / 60) * 10) / 10 : null;
}

function excelDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseFrontmatter(text, filePath) {
  const match = String(text || '').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  try {
    return yaml.parse(match[1]) || {};
  } catch (err) {
    throw new Error(`Invalid YAML in ${filePath}: ${err.message}`);
  }
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

function packagePath(row) {
  return `${clean(row.folder_name)}.${clean(row.project_name)}.${clean(row.package_name)}`;
}

function latestMessage(baseline) {
  const message = (baseline?.recent_messages || [])[0];
  return message ? clean(message.message) : '';
}

function likelyMaster(row) {
  return /master|mstr|main|control|orchestr/i.test(clean(row.package_name));
}

function sortRows(rows) {
  return rows.sort((a, b) =>
    `${a.folder_name}.${a.project_name}.${a.package_name}`.localeCompare(
      `${b.folder_name}.${b.project_name}.${b.package_name}`
    )
  );
}

function a1(row, col) {
  let n = col + 1;
  let letters = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    letters = String.fromCharCode(65 + rem) + letters;
    n = Math.floor((n - 1) / 26);
  }
  return `${letters}${row + 1}`;
}

function writeMatrix(sheet, startRow, startCol, rows) {
  if (!rows.length || !rows[0].length) return;
  sheet.getRangeByIndexes(startRow, startCol, rows.length, rows[0].length).values = rows;
}

function styleTable(sheet, rowCount, colCount) {
  const used = sheet.getRangeByIndexes(0, 0, Math.max(rowCount, 1), colCount);
  used.format.font.name = 'Aptos';
  used.format.font.size = 10;
  used.format.wrapText = true;
  const header = sheet.getRangeByIndexes(0, 0, 1, colCount);
  header.format.fill = '#1F4E79';
  header.format.font = { bold: true, color: '#FFFFFF' };
  header.format.borders = { preset: 'all', style: 'thin', color: '#BFBFBF' };
  if (rowCount > 1) {
    const body = sheet.getRangeByIndexes(1, 0, rowCount - 1, colCount);
    body.format.borders = { preset: 'all', style: 'thin', color: '#D9E2F3' };
  }
  sheet.freezePanes.freezeRows(1);
}

function setWidths(sheet, widths) {
  widths.forEach((width, index) => {
    sheet.getRangeByIndexes(0, index, 1, 1).format.columnWidthPx = width;
  });
}

const files = await walk(packageRoot);
const records = [];
const messages = [];
const rowCounts = [];

for (const file of files) {
  const text = await fs.readFile(file, 'utf8');
  const fm = parseFrontmatter(text, file);
  const baseline = fm.ssis_runtime_baseline && typeof fm.ssis_runtime_baseline === 'object'
    ? fm.ssis_runtime_baseline
    : null;
  const isTop = fm.ssis_top_most_workflow === true;
  if (!isTop) continue;

  const record = {
    folder_name: clean(fm.folder_name),
    project_name: clean(fm.project_name),
    package_name: clean(fm.package_name),
    package_path: clean(fm.package_path) || packagePath(fm),
    likely_master: likelyMaster(fm),
    has_baseline: Boolean(baseline),
    lookback_days: baseline?.lookback_days ?? null,
    as_of: baseline?.as_of || '',
    execution_count: baseline?.execution_count ?? null,
    success_count: baseline?.success_count ?? null,
    failure_count: baseline?.failure_count ?? null,
    last_success_time: baseline?.last_success_time || '',
    last_failure_time: baseline?.last_failure_time || '',
    typical_minutes: secondsToMinutes(baseline?.typical_success_runtime_seconds),
    p90_minutes: secondsToMinutes(baseline?.p90_success_runtime_seconds),
    min_minutes: secondsToMinutes(baseline?.min_success_runtime_seconds),
    max_minutes: secondsToMinutes(baseline?.max_success_runtime_seconds),
    latest_message: latestMessage(baseline),
    evidence_path: path.relative(repoRoot, file).replace(/\\/g, '/'),
  };
  records.push(record);

  for (const msg of baseline?.recent_messages || []) {
    messages.push({
      package_path: record.package_path,
      message_time: msg.message_time || '',
      message_package: msg.package_name || '',
      event_name: msg.event_name || '',
      source_name: msg.source_name || '',
      message: msg.message || '',
    });
  }

  for (const sample of baseline?.row_count_samples || []) {
    rowCounts.push({
      package_path: record.package_path,
      created_time: sample.created_time || '',
      sample_package: sample.package_name || '',
      task_name: sample.task_name || '',
      source_component_name: sample.source_component_name || '',
      destination_component_name: sample.destination_component_name || '',
      rows_sent: sample.rows_sent ?? null,
    });
  }
}

sortRows(records);
sortRows(messages);
sortRows(rowCounts);

const workbook = Workbook.create();
const summary = workbook.worksheets.add('Summary');
const detail = workbook.worksheets.add('Master Baselines');
const noBaseline = workbook.worksheets.add('No Baseline');
const msgSheet = workbook.worksheets.add('Recent Messages');
const rowSheet = workbook.worksheets.add('Row Count Samples');

summary.showGridLines = false;
detail.showGridLines = false;
noBaseline.showGridLines = false;
msgSheet.showGridLines = false;
rowSheet.showGridLines = false;

const baselineRows = records.filter((row) => row.has_baseline);
const noBaselineRows = records.filter((row) => !row.has_baseline);
const masterRows = records.filter((row) => row.likely_master);
const generatedAt = new Date();
const folders = new Set(records.map((row) => row.folder_name));
const foldersWithBaseline = new Set(baselineRows.map((row) => row.folder_name));

const summaryRows = [
  ['SSIS Master Runtime Baseline Workbook', '', '', ''],
  ['Generated at', generatedAt, '', ''],
  ['Source repository', repoRoot, '', ''],
  ['Source package root', packageRoot, '', ''],
  ['', '', '', ''],
  ['Metric', 'Value', 'Support note', ''],
  ['Top-most workflows scanned', records.length, 'Packages marked ssis_top_most_workflow=true', ''],
  ['Likely master/orchestration workflows', masterRows.length, 'Name-based signal only: master/mstr/main/control/orchestr', ''],
  ['Workflows with runtime baseline', baselineRows.length, 'Captured from SSISDB runtime history', ''],
  ['Workflows without runtime baseline', noBaselineRows.length, 'Usually no execution history in the lookback window', ''],
  ['Folders represented', folders.size, 'Native SSIS folders under the exported repo', ''],
  ['Folders with runtime baseline', foldersWithBaseline.size, 'Folders with at least one top workflow baseline', ''],
  ['', '', '', ''],
  ['Top folders by baseline count', 'Count', '', ''],
];

const folderCounts = [...baselineRows.reduce((map, row) => {
  map.set(row.folder_name, (map.get(row.folder_name) || 0) + 1);
  return map;
}, new Map()).entries()]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .slice(0, 12);

writeMatrix(summary, 0, 0, summaryRows);
writeMatrix(summary, summaryRows.length, 0, folderCounts);
summary.getRange('A1:D1').merge();
summary.getRange('A1').format = {
  fill: '#1F4E79',
  font: { bold: true, color: '#FFFFFF', size: 16 },
};
summary.getRange('A2:B12').format.borders = { preset: 'all', style: 'thin', color: '#D9E2F3' };
summary.getRange('A6:C6').format = {
  fill: '#D9EAF7',
  font: { bold: true },
};
summary.getRange('A14:B14').format = {
  fill: '#D9EAF7',
  font: { bold: true },
};
summary.getRange('B2').setNumberFormat('yyyy-mm-dd hh:mm');
summary.getRange('B7:B12').setNumberFormat('0');
summary.getRange('A:D').format.autofitColumns();
summary.getRange('B:B').format.columnWidthPx = 120;
summary.getRange('C:C').format.columnWidthPx = 360;

try {
  const chartEnd = summaryRows.length + folderCounts.length;
  if (folderCounts.length) {
    const chart = summary.charts.add('bar', summary.getRange(`A14:B${chartEnd}`));
    chart.title = 'Top Folders by Baseline Count';
    chart.hasLegend = false;
    chart.setPosition('E2', 'L18');
  }
} catch {
  // Chart rendering is helpful, but the workbook table is the source of truth.
}

const detailHeaders = [
  'Folder',
  'Project',
  'Master / Top Package',
  'Likely Master',
  'Has Baseline',
  'Lookback Days',
  'As Of',
  'Last Success',
  'Last Failure',
  'Execution Count',
  'Success Count',
  'Failure Count',
  'Typical Runtime Min',
  'P90 Runtime Min',
  'Min Runtime Min',
  'Max Runtime Min',
  'Latest Meaningful Message',
  'Evidence Path',
];
const detailRows = baselineRows.map((row) => [
  row.folder_name,
  row.project_name,
  row.package_name,
  row.likely_master ? 'Yes' : 'No',
  row.has_baseline ? 'Yes' : 'No',
  row.lookback_days,
  excelDate(row.as_of),
  excelDate(row.last_success_time),
  excelDate(row.last_failure_time),
  row.execution_count,
  row.success_count,
  row.failure_count,
  row.typical_minutes,
  row.p90_minutes,
  row.min_minutes,
  row.max_minutes,
  row.latest_message,
  row.evidence_path,
]);
writeMatrix(detail, 0, 0, [detailHeaders, ...detailRows]);
styleTable(detail, detailRows.length + 1, detailHeaders.length);
setWidths(detail, [130, 160, 230, 90, 90, 90, 150, 150, 150, 100, 100, 100, 115, 115, 105, 105, 440, 520]);
detail.getRange(`G2:I${detailRows.length + 1}`).setNumberFormat('yyyy-mm-dd hh:mm');
detail.getRange(`J2:P${detailRows.length + 1}`).setNumberFormat('0.0');
if (detailRows.length) detail.tables.add(`A1:${a1(detailRows.length, detailHeaders.length - 1)}`, true, 'MasterBaselineTable');

const noBaselineHeaders = ['Folder', 'Project', 'Top Package', 'Likely Master', 'Evidence Path'];
const noBaselineData = noBaselineRows.map((row) => [
  row.folder_name,
  row.project_name,
  row.package_name,
  row.likely_master ? 'Yes' : 'No',
  row.evidence_path,
]);
writeMatrix(noBaseline, 0, 0, [noBaselineHeaders, ...noBaselineData]);
styleTable(noBaseline, noBaselineData.length + 1, noBaselineHeaders.length);
setWidths(noBaseline, [130, 170, 260, 100, 560]);
if (noBaselineData.length) noBaseline.tables.add(`A1:${a1(noBaselineData.length, noBaselineHeaders.length - 1)}`, true, 'NoBaselineTable');

const messageHeaders = ['Workflow Package Path', 'Message Time', 'Message Package', 'Event', 'Source', 'Message'];
const messageData = messages.map((row) => [
  row.package_path,
  excelDate(row.message_time),
  row.message_package,
  row.event_name,
  row.source_name,
  row.message,
]);
writeMatrix(msgSheet, 0, 0, [messageHeaders, ...messageData]);
styleTable(msgSheet, messageData.length + 1, messageHeaders.length);
setWidths(msgSheet, [320, 150, 220, 120, 200, 620]);
if (messageData.length) msgSheet.getRange(`B2:B${messageData.length + 1}`).setNumberFormat('yyyy-mm-dd hh:mm');
if (messageData.length) msgSheet.tables.add(`A1:${a1(messageData.length, messageHeaders.length - 1)}`, true, 'RecentMessagesTable');

const rowHeaders = [
  'Workflow Package Path',
  'Created Time',
  'Sample Package',
  'Task',
  'Source Component',
  'Destination Component',
  'Rows Sent',
];
const rowData = rowCounts.map((row) => [
  row.package_path,
  excelDate(row.created_time),
  row.sample_package,
  row.task_name,
  row.source_component_name,
  row.destination_component_name,
  row.rows_sent,
]);
writeMatrix(rowSheet, 0, 0, [rowHeaders, ...rowData]);
styleTable(rowSheet, rowData.length + 1, rowHeaders.length);
setWidths(rowSheet, [320, 150, 220, 180, 220, 220, 100]);
if (rowData.length) rowSheet.getRange(`B2:B${rowData.length + 1}`).setNumberFormat('yyyy-mm-dd hh:mm');
if (rowData.length) rowSheet.getRange(`G2:G${rowData.length + 1}`).setNumberFormat('#,##0');
if (rowData.length) rowSheet.tables.add(`A1:${a1(rowData.length, rowHeaders.length - 1)}`, true, 'RowCountSamplesTable');

await fs.mkdir(outputDir, { recursive: true });

await workbook.inspect({
  kind: 'table',
  range: 'Summary!A1:D20',
  include: 'values,formulas',
  tableMaxRows: 20,
  tableMaxCols: 6,
});
await workbook.inspect({
  kind: 'match',
  searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A',
  options: { useRegex: true, maxResults: 50 },
  summary: 'final formula error scan',
});

for (const sheetName of [
  'Summary',
  'Master Baselines',
  'No Baseline',
  'Recent Messages',
  'Row Count Samples',
]) {
  try {
    const preview = await workbook.render({ sheetName, autoCrop: 'all', scale: 1, format: 'png' });
    const safeName = sheetName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    await fs.writeFile(
      path.join(outputDir, `${safeName}-preview.png`),
      new Uint8Array(await preview.arrayBuffer())
    );
  } catch {
    // Rendering can fail if chart support is limited; export still validates workbook content.
  }
}

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputPath);

console.log(
  JSON.stringify(
    {
      outputPath,
      packageFiles: files.length,
      topWorkflows: records.length,
      workflowsWithBaseline: baselineRows.length,
      workflowsWithoutBaseline: noBaselineRows.length,
      messageRows: messages.length,
      rowCountRows: rowCounts.length,
    },
    null,
    2
  )
);
