import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const tmp = path.join(root, 'tmp');
const docsRoot = path.join(root, 'docs', 'ssrs-report-documentation');
const htmlRoot = path.join(tmp, 'ssrs-confluence-html');

fs.mkdirSync(docsRoot, { recursive: true });
fs.mkdirSync(htmlRoot, { recursive: true });

function readRows(file) {
  const text = fs.readFileSync(path.join(tmp, file), 'utf8').replace(/\r\n/g, '\n');
  const lines = text.split('\n').filter((line) => line.trim().length > 0);
  if (lines.length < 3) return [];
  const header = lines[0].split('|').map((v) => v.trim());
  return lines.slice(2).map((line) => {
    const cols = line.split('|');
    const row = {};
    for (let i = 0; i < header.length; i += 1) row[header[i]] = (cols[i] ?? '').trim();
    return row;
  });
}

function by(rows, key) {
  const map = new Map();
  for (const row of rows) {
    const value = row[key];
    if (!map.has(value)) map.set(value, []);
    map.get(value).push(row);
  }
  return map;
}

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function md(value) {
  return String(value ?? '').replace(/\|/g, '\\|');
}

function slug(value) {
  return String(value)
    .replace(/[<>:"/\\|?*]+/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 150);
}

function statusSignal(report) {
  const execs = Number(report.ExecutionsLast6Months || 0);
  const pathValue = report.Path.toLowerCase();
  if (pathValue.includes('/test') || report.Name.toLowerCase().includes('test')) return 'Test or non-production review';
  if (execs === 0) return 'Review candidate: no executions in last 6 months';
  if (execs >= 1000) return 'Active, high usage';
  return 'Active';
}

function folderLabel(report) {
  return report.Path.split('/').filter(Boolean).slice(0, -1).join(' / ') || 'root';
}

function hasAny(value, words) {
  const text = String(value || '').toLowerCase();
  return words.some((word) => text.includes(word));
}

function combinedReportText(report, datasets) {
  return [
    report.Name,
    report.Path,
    ...datasets.map((d) => d.CommandText || ''),
  ].join(' ').toLowerCase();
}

function lookupPurpose(report, text) {
  if (hasAny(text, ['custno to stockno'])) {
    return `This report helps support teams find vehicle sale stock and deal information when they already know the customer number. In plain English, it answers: "For this accounting account and customer number, what vehicle stock number and deal number are tied to the sale?"`;
  }
  if (hasAny(text, ['ronumber to custno', 'ro #'])) {
    return `This report helps support teams find the customer number tied to a closed service repair order. In plain English, it answers: "For this accounting account and repair order number, which customer is associated with the RO?"`;
  }
  if (hasAny(text, ['stockno to custno'])) {
    return `This report helps support teams find the customer and deal tied to a vehicle stock number. In plain English, it answers: "For this accounting account and stock number, which customer and deal are tied to the vehicle sale?"`;
  }
  if (hasAny(text, ['trade1stockno', 'trade1stock'])) {
    return `This report helps support teams find the customer and deal connected to a trade-in stock number. In plain English, it answers: "For this accounting account and trade stock number, which customer and sale record is it tied to?"`;
  }
  return '';
}

function domainPurpose(report, datasets) {
  const text = combinedReportText(report, datasets);
  const lookup = lookupPurpose(report, text);
  if (lookup) return lookup;

  if (hasAny(text, ['dailycashsummary', 'daily cash summary'])) {
    return 'This report summarizes daily cash activity so Cash Management and accounting users can review store cash movement, spot balance issues, and reconcile activity for a selected business date or dealership scope.';
  }
  if (hasAny(text, ['dailyactivitysummary', 'daily activity summary'])) {
    return 'This report summarizes daily Cash Management activity so users can review transaction volume and activity trends without opening transaction-level detail first.';
  }
  if (hasAny(text, ['activity details', 'activitydetails'])) {
    return 'This report provides transaction-level Cash Management activity details for researching individual cash activity, reconciling questions, and supporting follow-up on specific stores or dates.';
  }
  if (hasAny(text, ['negativebalance'])) {
    return 'This report identifies negative cash balances or accounts that may need review, follow-up, or correction by Cash Management or accounting support teams.';
  }
  if (hasAny(text, ['floorplan'])) {
    return 'This report supports floorplan payoff or floorplan reconciliation work by showing vehicle, lender, or payoff information needed by Shared Services and accounting users.';
  }
  if (hasAny(text, ['payroll'])) {
    return 'This report supports payroll review by summarizing payroll entry or payroll activity information for the selected company, user, or reporting scope.';
  }
  if (hasAny(text, ['inventory', 'pricing', 'stock'])) {
    return 'This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up.';
  }
  if (hasAny(text, ['gl ', 'open stores', 'ledger'])) {
    return 'This report supports controller and accounting review by showing general ledger or store accounting information needed for period-end, reconciliation, or operational follow-up.';
  }
  if (hasAny(text, ['truecar', 'email'])) {
    return 'This report supports legal or compliance follow-up by listing relevant TrueCar email activity or records for review.';
  }
  if (hasAny(text, ['jobstatus', 'job status'])) {
    return 'This report summarizes job status information so support teams can monitor batch or scheduled processing and identify failed or delayed work.';
  }
  if (hasAny(text, ['score'])) {
    return 'This report supports retail strategy scorecard review by presenting operational performance measures for the selected store, market, or reporting period.';
  }

  return '';
}

function purposeText(report, datasets) {
  const domain = domainPurpose(report, datasets);
  if (domain) return domain;

  const name = report.Name;
  const folder = folderLabel(report);
  const procs = datasets.filter((d) => /storedprocedure/i.test(d.CommandType || '')).map((d) => d.CommandText).filter(Boolean);
  if (procs.length) {
    return `This report supports the ${folder} reporting area. It primarily retrieves data through stored procedure ${procs.map((p) => `\`${p}\``).join(', ')}. Review the procedure name and parameters when troubleshooting what business question the report answers.`;
  }
  return `This report supports the ${folder} reporting area. It retrieves data through embedded report dataset queries and presents the result as the ${name} report. Use the dataset commands and parameters below to confirm the exact business question before changing it.`;
}

function commandSummary(row) {
  const text = row.CommandText || '';
  if (!text) return 'No command text found in the RDL dataset definition.';
  if (/storedprocedure/i.test(row.CommandType || '')) return `Calls stored procedure \`${text}\`.`;
  const normalized = text.replace(/\s+/g, ' ').trim();
  return normalized.length > 320 ? `${normalized.slice(0, 320)}...` : normalized;
}

function extractObjectHints(datasets) {
  const hints = new Set();
  const objectPattern = /\b(?:from|join|exec(?:ute)?|update|insert\s+into)\s+([\[\]\w.\-]+)/gi;
  for (const dataset of datasets) {
    const text = dataset.CommandText || '';
    if (/storedprocedure/i.test(dataset.CommandType || '') && text.trim()) hints.add(text.trim());
    let match;
    while ((match = objectPattern.exec(text)) !== null) {
      hints.add(match[1].replace(/\[|\]/g, ''));
    }
  }
  return [...hints].slice(0, 30);
}

function markdownFor(report, bindings, sources, datasets, parameters) {
  const title = report.Name;
  const signal = statusSignal(report);
  const sourceRows = bindings.map((binding) => ({
    ...binding,
    source: sources.find((s) => s.Path === binding.SharedDataSourcePath),
  }));
  const objectHints = extractObjectHints(datasets);
  return `# ${title}

Generated: 2026-06-15  
SSRS path: \`${report.Path}\`  
SSRS catalog source: \`ReportServer\` on \`D1-SQL-01B\\INST1\`

## Purpose

${purposeText(report, datasets)}

## Executive Summary

| Field | Value |
| --- | --- |
| Report name | \`${md(report.Name)}\` |
| SSRS path | \`${md(report.Path)}\` |
| Status signal | ${md(signal)} |
| Created | ${md(report.Created)} |
| Modified | ${md(report.Modified)} |
| Modified by | ${md(report.ModifiedBy)} |
| Last 6 months usage | ${md(report.ExecutionsLast6Months)} executions by ${md(report.DistinctUsersLast6Months)} users |
| Last execution | ${md(report.LastExecution)} |
| Subscriptions | ${md(report.SubscriptionCount)} |

## Shared Data Sources

${sourceRows.length ? `| Report datasource | Shared datasource | Connection | Credential mode | Enabled |
| --- | --- | --- | --- | --- |
${sourceRows.map((row) => `| \`${md(row.DataSourceName)}\` | \`${md(row.SharedDataSourcePath || 'Embedded or unavailable')}\` | \`${md(row.source?.ConnectString || 'Not available from catalog')}\` | ${md(row.source?.CredentialRetrieval || '')} | ${md(row.source?.Enabled || '')} |`).join('\n')}` : 'No shared datasource binding was found in the catalog extraction.'}

## User Parameters

${parameters.length ? `| Parameter | Prompt | Type | Notes |
| --- | --- | --- | --- |
${parameters.map((p) => `| \`${md(p.ParameterName)}\` | ${md(p.Prompt || p.ParameterName)} | ${md(p.DataType)} | Nullable: ${md(p.Nullable || 'false')}; Allow blank: ${md(p.AllowBlank || 'false')}; Multi-value: ${md(p.MultiValue || 'false')} |`).join('\n')}` : 'No user-facing report parameters were found in the RDL definition.'}

## Data Logic

${datasets.length ? datasets.map((d, idx) => `${idx + 1}. Dataset \`${d.DatasetName}\` (${d.CommandType || 'Text'}): ${commandSummary(d)}`).join('\n') : 'No datasets were found in the RDL definition.'}

## Backend Dependencies

${objectHints.length ? `| Object or command hint | Notes |
| --- | --- |
${objectHints.map((h) => `| \`${md(h)}\` | Referenced by one or more report datasets |`).join('\n')}` : 'No backend object hints were extracted from the report datasets.'}

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: \`${report.Path}\`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

${Number(report.ExecutionsLast6Months || 0) === 0 ? '- This report had no executions in the last 6 months and should be reviewed with the owning business area.' : '- No immediate review flag based on recent execution history.'}
${report.Path.toLowerCase().includes('/archive/') ? '\n- This report is under an archive path and may be historical.' : ''}
${report.Path.toLowerCase().includes('/test') || report.Name.toLowerCase().includes('test') ? '\n- This report appears to be test or non-production based on its path or name.' : ''}

## Technical Appendix

### Dataset Commands

${datasets.length ? datasets.map((d) => `#### ${d.DatasetName}

Type: \`${d.CommandType || 'Text'}\`

\`\`\`sql
${d.CommandText || '-- No command text found'}
\`\`\`
`).join('\n') : 'No dataset command text was available.'}
`;
}

function htmlFor(markdown) {
  const lines = markdown.split('\n');
  let html = '';
  let inTable = false;
  let tableRows = [];
  let inCode = false;
  let code = [];
  let inOl = false;
  let inUl = false;

  function closeLists() {
    if (inOl) { html += '</ol>'; inOl = false; }
    if (inUl) { html += '</ul>'; inUl = false; }
  }
  function flushTable() {
    if (!inTable) return;
    html += '<table><tbody>';
    for (const row of tableRows) {
      if (/^\s*\|?\s*-+\s*\|/.test(row)) continue;
      const cells = row.split('|').slice(1, -1);
      html += '<tr>' + cells.map((cell) => `<td>${inline(cell.trim())}</td>`).join('') + '</tr>';
    }
    html += '</tbody></table>';
    tableRows = [];
    inTable = false;
  }
  function inline(value) {
    return esc(value).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith('```')) {
      flushTable();
      closeLists();
      if (inCode) {
        html += `<pre><code class="language-sql">${esc(code.join('\n'))}</code></pre>`;
        code = [];
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      code.push(raw);
      continue;
    }
    if (line.startsWith('|')) {
      closeLists();
      inTable = true;
      tableRows.push(line);
      continue;
    }
    flushTable();
    if (!line.trim()) {
      closeLists();
      continue;
    }
    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading) {
      closeLists();
      const level = heading[1].length;
      html += `<h${level}>${inline(heading[2])}</h${level}>`;
      continue;
    }
    const ol = /^\d+\.\s+(.+)$/.exec(line);
    if (ol) {
      if (!inOl) { closeLists(); html += '<ol>'; inOl = true; }
      html += `<li>${inline(ol[1])}</li>`;
      continue;
    }
    const ul = /^-\s+(.+)$/.exec(line);
    if (ul) {
      if (!inUl) { closeLists(); html += '<ul>'; inUl = true; }
      html += `<li>${inline(ul[1])}</li>`;
      continue;
    }
    closeLists();
    html += `<p>${inline(line)}</p>`;
  }
  flushTable();
  closeLists();
  return html;
}

const reports = readRows('ssrs-all-report-discovery.out');
const bindingsByPath = by(readRows('ssrs-all-datasource-bindings.out'), 'ReportPath');
const datasetsByPath = by(readRows('ssrs-all-datasets.out'), 'ReportPath');
const paramsByPath = by(readRows('ssrs-all-parameters.out'), 'ReportPath');
const sources = readRows('ssrs-all-shared-datasources.out');

const manifest = [];
for (const report of reports) {
  const bindings = bindingsByPath.get(report.Path) || [];
  const datasets = datasetsByPath.get(report.Path) || [];
  const parameters = paramsByPath.get(report.Path) || [];
  const markdown = markdownFor(report, bindings, sources, datasets, parameters);
  const html = htmlFor(markdown);
  const fileBase = slug(report.Name);
  fs.writeFileSync(path.join(docsRoot, `${fileBase}.md`), markdown);
  fs.writeFileSync(path.join(htmlRoot, `${fileBase}.html`), html);
  manifest.push({
    title: report.Name,
    path: report.Path,
    markdownFile: path.relative(root, path.join(docsRoot, `${fileBase}.md`)),
    htmlFile: path.relative(root, path.join(htmlRoot, `${fileBase}.html`)),
    executionsLast6Months: Number(report.ExecutionsLast6Months || 0),
  });
}

fs.writeFileSync(path.join(tmp, 'ssrs-report-documentation-manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Generated ${manifest.length} SSRS report documentation files.`);
