import 'dotenv/config';

import axios from 'axios';
import fs from 'node:fs';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const root = process.cwd();
const tmp = path.join(root, 'tmp');
const parentPageId = String(process.env.SSRS_CONFLUENCE_PARENT_PAGE_ID || '2267643963');
const spaceKey = process.env.CONFLUENCE_SPACE_KEY || 'TDE';
const baseUrl = String(
  process.env.CONFLUENCE_BASE_URL || 'https://sonicautomotive.atlassian.net/wiki'
).replace(/\/+$/, '');
const email = process.env.CONFLUENCE_EMAIL || '';
const apiToken = process.env.CONFLUENCE_API_TOKEN || '';
const publish = process.argv.includes('--publish');

if (!email || !apiToken) {
  throw new Error('CONFLUENCE_EMAIL and CONFLUENCE_API_TOKEN are required.');
}

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

function code(value) {
  return `<code>${esc(value)}</code>`;
}

function number(value) {
  return Number(value || 0);
}

function cleanLast(value) {
  return !value || value === 'NULL' ? 'Not used in last 6 months' : value;
}

function statusSignal(reports) {
  const totalExecs = reports.reduce((sum, report) => sum + number(report.ExecutionsLast6Months), 0);
  const lowerPath = reports.map((report) => report.Path.toLowerCase()).join(' ');
  if (lowerPath.includes('/test') || lowerPath.includes('test')) return 'Test or non-production review';
  if (totalExecs === 0) return 'Review candidate: no executions in last 6 months';
  if (totalExecs >= 1000) return 'Active, high usage';
  return 'Active';
}

function hasAny(value, words) {
  const text = String(value || '').toLowerCase();
  return words.some((word) => text.includes(word));
}

function reportText(report, datasets = []) {
  return [report.Name, report.Path, ...datasets.map((d) => d.CommandText || '')]
    .join(' ')
    .toLowerCase();
}

function inferPurpose(report, datasets) {
  const text = reportText(report, datasets);
  if (hasAny(text, ['custno to stockno'])) {
    return 'This report helps support teams find vehicle sale stock and deal information when they already know the customer number.';
  }
  if (hasAny(text, ['ronumber to custno', 'ro #'])) {
    return 'This report helps support teams find the customer number tied to a closed service repair order.';
  }
  if (hasAny(text, ['stockno to custno'])) {
    return 'This report helps support teams find the customer and deal tied to a vehicle stock number.';
  }
  if (hasAny(text, ['trade1stockno', 'trade1stock'])) {
    return 'This report helps support teams find the customer and deal connected to a trade-in stock number.';
  }
  if (hasAny(text, ['dailycashsummary', 'daily cash summary'])) {
    return 'This report summarizes daily cash activity so Cash Management and accounting users can review store cash movement, balances, and reconciliation activity.';
  }
  if (hasAny(text, ['dailyactivitysummary', 'daily activity summary'])) {
    return 'This report summarizes daily Cash Management transaction activity so users can review activity volume and trends before drilling into detail.';
  }
  if (hasAny(text, ['activity details', 'activitydetails'])) {
    return 'This report provides transaction-level Cash Management activity details for researching individual cash activity and reconciliation questions.';
  }
  if (hasAny(text, ['negativebalance'])) {
    return 'This report identifies negative cash balances or accounts that may need Cash Management or accounting follow-up.';
  }
  if (hasAny(text, ['floorplan'])) {
    return 'This report supports floorplan payoff or reconciliation work by showing vehicle, lender, or payoff information needed by Shared Services and accounting users.';
  }
  if (hasAny(text, ['payroll'])) {
    return 'This report supports payroll review by showing payroll entry or payroll activity information for the selected company, user, or reporting scope.';
  }
  if (hasAny(text, ['retail sales'])) {
    return 'This report supports FP&A and retail sales review by showing sales performance for the selected date, store, or reporting period.';
  }
  if (hasAny(text, ['inventory', 'pricing', 'playbook', 'stock'])) {
    return 'This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up.';
  }
  if (hasAny(text, ['gl ', 'open stores', 'ledger'])) {
    return 'This report supports controller and accounting review by showing store or general-ledger information needed for reconciliation and operational follow-up.';
  }
  if (hasAny(text, ['quartile', 'opportunity'])) {
    return 'This report supports CRM or retail performance review by showing opportunity, quartile, or customer activity metrics for follow-up.';
  }
  if (hasAny(text, ['lead'])) {
    return 'This report supports retail strategy and CRM follow-up by showing lead activity or lead-source performance.';
  }
  if (hasAny(text, ['weekendappt', 'appt'])) {
    return 'This report supports appointment management by showing weekend appointment activity for store or retail strategy follow-up.';
  }
  if (hasAny(text, ['truecar', 'email'])) {
    return 'This report supports legal or compliance follow-up by listing relevant TrueCar email activity or records for review.';
  }
  if (hasAny(text, ['jobstatus', 'job status'])) {
    return 'This report summarizes job status information so support teams can monitor batch or scheduled processing and identify failed or delayed work.';
  }
  if (hasAny(text, ['routeone', 'redflag', 'ssn'])) {
    return 'This report supports RouteOne finance or compliance review by showing deal, red-flag, SSN variance, or related RouteOne detail information.';
  }
  if (hasAny(text, ['checks'])) {
    return 'This report supports audit review by showing check or user-related activity that may need investigation.';
  }
  if (hasAny(text, ['score'])) {
    return 'This report supports scorecard review by presenting operational performance measures for the selected store, market, or reporting period.';
  }

  const folder = report.Path.split('/').filter(Boolean).slice(0, -1).join(' / ') || 'root';
  const procs = datasets
    .filter((d) => /storedprocedure/i.test(d.CommandType || '') && d.CommandText)
    .map((d) => d.CommandText);
  if (procs.length) {
    return `This report supports the ${folder} reporting area and retrieves its data primarily through ${procs.map((p) => p.trim()).join(', ')}.`;
  }
  return `This report supports the ${folder} reporting area. Use the parameters and data logic below to confirm the exact business question before changing it.`;
}

function folderPurpose(folderPath) {
  const text = folderPath.toLowerCase();
  if (text === 'acctstd') return 'Accounting support lookup reports that translate customer, stock, repair order, and trade stock identifiers.';
  if (text.includes('cma')) return 'Cash Management reports for daily cash activity, transaction detail, summary review, and negative-balance follow-up.';
  if (text.includes('new vehicles') || text.includes('inventory')) return 'Vehicle inventory and pricing reporting used for operational inventory monitoring and follow-up.';
  if (text.includes('fpna')) return 'Finance planning and analysis reports for retail sales and performance review workflows.';
  if (text.includes('retail strategy') || text.includes('scores')) return 'Retail strategy reports for leads, appointments, customer activity, and scorecard-style review.';
  if (text.includes('shared services')) return 'Shared Services reports for floorplan payoff and related accounting support workflows.';
  if (text.includes('controller')) return 'Controller and accounting reports for store and GL reconciliation support.';
  if (text.includes('payroll')) return 'Payroll support reports for payroll entry and payroll activity review.';
  if (text.includes('crm')) return 'CRM reports for opportunity, customer, traffic, and retail follow-up review.';
  if (text.includes('echo park') || text === 'csi') return 'EchoPark reports for customer, sales, service, CSI, and inventory follow-up.';
  if (text.includes('rtc')) return 'RTC operational reporting for used-vehicle sales, wholesale, inventory, appraisal, and pricing follow-up.';
  if (text.includes('routeone')) return 'RouteOne finance and compliance reporting for detail, summary, red-flag, and SSN variance review.';
  if (text.includes('test') || text.includes('archive')) return 'Non-production or historical reports that should be validated before use.';
  if (text.includes('legal')) return 'Legal and compliance support reports.';
  if (text.includes('internal audit')) return 'Internal Audit reports used for control, user, or transaction review.';
  if (text.includes('jobstatus')) return 'Operational job monitoring reports used to review scheduled processing status.';
  if (text.includes('profitanalysis')) return 'Profit and inventory pricing analysis reports used for operational follow-up.';
  if (text.includes('nvim')) return 'New vehicle inventory management reports and dashboard pages.';
  return `Reports grouped under ${folderPath || 'the SSRS root'} for support and operational review.`;
}

function objectHints(datasets) {
  const hints = new Set();
  const pattern = /\b(?:from|join|exec(?:ute)?|update|insert\s+into)\s+([\[\]\w.\-]+)/gi;
  for (const dataset of datasets) {
    const text = dataset.CommandText || '';
    if (/storedprocedure/i.test(dataset.CommandType || '') && text.trim()) hints.add(text.trim());
    let match;
    while ((match = pattern.exec(text)) !== null) hints.add(match[1].replace(/\[|\]/g, ''));
  }
  return [...hints].slice(0, 12);
}

function summarizeCommand(row) {
  const text = String(row.CommandText || '').replace(/\s+/g, ' ').trim();
  if (!text) return 'No dataset command text was found in the report definition.';
  if (/storedprocedure/i.test(row.CommandType || '')) return `Calls stored procedure ${code(text)}.`;
  const hints = objectHints([row]);
  if (hints.length) return `Reads or references ${hints.map(code).join(', ')}.`;
  return text.length > 240 ? `${esc(text.slice(0, 240))}...` : esc(text);
}

function reportBody(title, reports, datasetsByPath, parametersByPath) {
  const primary = reports[0];
  const allDatasets = reports.flatMap((report) => datasetsByPath.get(report.Path) || []);
  const totalExecs = reports.reduce((sum, report) => sum + number(report.ExecutionsLast6Months), 0);
  const users = reports.reduce((sum, report) => sum + number(report.DistinctUsersLast6Months), 0);
  const last = reports
    .map((report) => report.LastExecution)
    .filter((value) => value && value !== 'NULL')
    .sort()
    .at(-1);
  const params = reports.flatMap((report) => parametersByPath.get(report.Path) || []);
  const uniqueParams = [...new Map(params.map((p) => [p.ParameterName, p])).values()];
  const datasetRows = reports.flatMap((report) =>
    (datasetsByPath.get(report.Path) || []).map((dataset) => ({ ...dataset, ReportPath: report.Path }))
  );
  const hints = objectHints(allDatasets);
  const purpose = inferPurpose(primary, allDatasets);
  const paths = reports.map((report) => report.Path);

  return `<h1>${esc(title)}</h1>
<p><strong>Purpose:</strong> ${esc(purpose)}</p>
<p><strong>Status signal:</strong> ${esc(statusSignal(reports))}.</p>
<h2>Business Use</h2>
<p>Use this page to understand what the report is for, who it likely supports, how recently it has been used, and what data it reads before making support, retirement, or modernization decisions.</p>
<h2>SSRS Location</h2>
<table><thead><tr><th>SSRS path</th><th>Executions last 6 months</th><th>Last used</th><th>Users</th><th>Subscriptions</th></tr></thead><tbody>${reports
    .map(
      (report) =>
        `<tr><td>${code(report.Path)}</td><td>${number(report.ExecutionsLast6Months).toLocaleString()}</td><td>${esc(cleanLast(report.LastExecution))}</td><td>${number(report.DistinctUsersLast6Months).toLocaleString()}</td><td>${number(report.SubscriptionCount).toLocaleString()}</td></tr>`
    )
    .join('')}</tbody></table>
<h2>Usage Summary</h2>
<table><thead><tr><th>Metric</th><th>Value</th></tr></thead><tbody><tr><td>Total executions last 6 months</td><td>${totalExecs.toLocaleString()}</td></tr><tr><td>Distinct user count summed by report path</td><td>${users.toLocaleString()}</td></tr><tr><td>Most recent use</td><td>${esc(last || 'Not used in last 6 months')}</td></tr><tr><td>Report paths represented</td><td>${paths.length}</td></tr></tbody></table>
<h2>User Inputs</h2>
${uniqueParams.length ? `<table><thead><tr><th>Parameter</th><th>Prompt</th><th>Type</th><th>Notes</th></tr></thead><tbody>${uniqueParams
    .map(
      (param) =>
        `<tr><td>${code(param.ParameterName)}</td><td>${esc(param.Prompt || param.ParameterName)}</td><td>${esc(param.DataType || '')}</td><td>Multi-value: ${esc(param.MultiValue || 'false')}</td></tr>`
    )
    .join('')}</tbody></table>` : '<p>No user-facing report parameters were found in the RDL definition.</p>'}
<h2>Data Logic</h2>
${datasetRows.length ? `<ol>${datasetRows
    .slice(0, 8)
    .map(
      (dataset) =>
        `<li>${code(dataset.DatasetName || 'Dataset')} (${esc(dataset.CommandType || 'Text')}) for ${code(dataset.ReportPath)}: ${summarizeCommand(dataset)}</li>`
    )
    .join('')}</ol>` : '<p>No datasets were found in the RDL definition.</p>'}
${datasetRows.length > 8 ? `<p>${datasetRows.length - 8} additional datasets are omitted from this summary page. Review the RDL for full technical detail.</p>` : ''}
<h2>Backend Dependencies</h2>
${hints.length ? `<table><thead><tr><th>Object or command hint</th><th>Support note</th></tr></thead><tbody>${hints
    .map((hint) => `<tr><td>${code(hint)}</td><td>Referenced by one or more report datasets.</td></tr>`)
    .join('')}</tbody></table>` : '<p>No backend object hints were extracted from the report datasets.</p>'}
<h2>Support Notes</h2>
<ol><li>Confirm the user is running the correct SSRS path listed above.</li><li>Confirm the selected parameters match the intended business question.</li><li>If the report returns no data, confirm the source data exists for the same account, store, date, or identifier.</li><li>${totalExecs === 0 ? 'Because this report has no recent usage, confirm business need before changing or modernizing it.' : 'Because this report has recent usage, treat changes as user-facing and validate with the owning business area.'}</li></ol>`;
}

function folderBody(title, folderPaths, reports) {
  const total = reports.length;
  const active = reports.filter((report) => number(report.ExecutionsLast6Months) > 0).length;
  const stale = total - active;
  const execs = reports.reduce((sum, report) => sum + number(report.ExecutionsLast6Months), 0);
  const last = reports
    .map((report) => report.LastExecution)
    .filter((value) => value && value !== 'NULL')
    .sort()
    .at(-1);
  const folderLabel = folderPaths.join(', ');
  const activeRows = [...reports]
    .sort((left, right) => number(right.ExecutionsLast6Months) - number(left.ExecutionsLast6Months))
    .slice(0, 12);
  return `<h1>${esc(title)}</h1>
<p><strong>Business purpose:</strong> ${esc(folderPurpose(folderPaths[0] || title))}</p>
<p><strong>Folder scope:</strong> ${folderPaths.map(code).join(', ')}</p>
<p><strong>Report count:</strong> ${total} report${total === 1 ? '' : 's'}.</p>
<p><strong>Usage signal:</strong> ${active} used in the last 6 months, ${stale} with no recent executions. Total executions in the lookback window: ${execs.toLocaleString()}. Most recent use: ${esc(last || 'Not used in last 6 months')}.</p>
${stale === total ? '<div data-type="panel-warning"><p><strong>Review note:</strong> No reports in this folder were used in the last 6 months. Confirm ownership and business need before investing in changes.</p></div>' : '<div data-type="panel-info"><p><strong>Support note:</strong> This folder has at least one active report. Review high-use reports carefully before changing shared data sources, datasets, or parameters.</p></div>'}
<h2>Reports in this folder</h2>
${activeRows.length ? `<table><thead><tr><th>Report</th><th>Plain-English purpose</th><th>Executions last 6 months</th><th>Last used</th></tr></thead><tbody>${activeRows
    .map((report) => `<tr><td>${esc(report.Name)}</td><td>${esc(inferPurpose(report, []))}</td><td>${number(report.ExecutionsLast6Months).toLocaleString()}</td><td>${esc(cleanLast(report.LastExecution))}</td></tr>`)
    .join('')}</tbody></table>` : '<p>No report records were found for this folder scope.</p>'}
${reports.length > activeRows.length ? `<p>${reports.length - activeRows.length} additional reports are included under ${esc(folderLabel)}. Open the child report pages for details.</p>` : ''}
<h2>Cleanup Guidance</h2>
<ol><li>Start with reports that show no executions in the last 6 months.</li><li>Confirm whether the business still uses the output outside SSRS before retiring anything.</li><li>For active reports, identify the owner and validate expected output before making changes.</li></ol>`;
}

const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
const http = axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization: `Basic ${auth}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

async function request(operation) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await operation();
    } catch (err) {
      const status = err.response?.status;
      if (![429, 500, 502, 503, 504].includes(status) || attempt === 4) throw err;
      // eslint-disable-next-line no-await-in-loop
      await delay(1000 * 2 ** attempt);
    }
  }
  throw new Error('unreachable retry state');
}

async function getPage(pageId) {
  const response = await request(() =>
    http.get(`/rest/api/content/${pageId}`, { params: { expand: 'version,ancestors' } })
  );
  return response.data;
}

async function listChildren(pageId, depth = 0, ancestors = []) {
  const pages = [];
  let start = 0;
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const response = await request(() =>
      http.get(`/rest/api/content/${pageId}/child/page`, {
        params: { start, limit: 100, expand: 'version' },
      })
    );
    const results = response.data?.results || [];
    for (const child of results) {
      const record = { ...child, parentId: pageId, depth, ancestorTitles: ancestors };
      pages.push(record);
      // eslint-disable-next-line no-await-in-loop
      pages.push(...(await listChildren(child.id, depth + 1, [...ancestors, child.title])));
    }
    if (results.length < 100) break;
    start += 100;
  }
  return pages;
}

async function updatePage(page, body) {
  const nextVersion = number(page.version?.number) + 1;
  const response = await request(() =>
    http.put(`/rest/api/content/${page.id}`, {
      id: page.id,
      type: 'page',
      title: page.title,
      space: { key: spaceKey },
      version: {
        number: nextVersion,
        message: `Refresh SSRS support documentation ${new Date().toISOString()}`,
      },
      body: {
        storage: {
          value: body,
          representation: 'storage',
        },
      },
    })
  );
  return response.data;
}

function folderPathFromPage(page) {
  const titles = [...page.ancestorTitles, page.title];
  const afterRoot = titles;
  if (afterRoot[0] === 'CSI') return 'Echo Park/CSI';
  if (afterRoot[0] === 'Inventory') return 'Echo Park/Inventory';
  return afterRoot.join('/');
}

function folderReports(folderPath, reports) {
  const prefix = `/${folderPath}/`;
  return reports.filter((report) => report.Path === `/${folderPath}` || report.Path.startsWith(prefix));
}

function parentBody(reports) {
  const active = reports.filter((report) => number(report.ExecutionsLast6Months) > 0).length;
  const stale = reports.length - active;
  const execs = reports.reduce((sum, report) => sum + number(report.ExecutionsLast6Months), 0);
  const last = reports
    .map((report) => report.LastExecution)
    .filter((value) => value && value !== 'NULL')
    .sort()
    .at(-1);
  const topFolders = new Map();
  for (const report of reports) {
    const folder = report.Path.split('/').filter(Boolean)[0] || report.Name;
    if (!topFolders.has(folder)) topFolders.set(folder, []);
    topFolders.get(folder).push(report);
  }
  const rows = [...topFolders.entries()]
    .map(([folder, folderRows]) => ({
      folder,
      reports: folderRows.length,
      active: folderRows.filter((report) => number(report.ExecutionsLast6Months) > 0).length,
      execs: folderRows.reduce((sum, report) => sum + number(report.ExecutionsLast6Months), 0),
      last: folderRows
        .map((report) => report.LastExecution)
        .filter((value) => value && value !== 'NULL')
        .sort()
        .at(-1),
    }))
    .sort((left, right) => right.execs - left.execs);

  return `<h1>SSRS Report Documentation</h1>
<p><strong>Business purpose:</strong> This space documents the SSRS report catalog in plain English so Data Engineering, BI, Support, Accounting, and Operations can understand what each report is for, where it lives, how often it is used, and whether it should be kept, modernized, or retired.</p>
<p><strong>Catalog summary:</strong> The current SSRS catalog contains <strong>${reports.length} report paths</strong>. In the last 6 months, <strong>${active} reports were used</strong> and <strong>${stale} reports had no executions</strong>. The catalog had <strong>${execs.toLocaleString()} total report executions</strong> in the lookback window, with the most recent execution on <strong>${esc(last || 'not used')}</strong>.</p>
<div data-type="panel-info"><p><strong>How to read these pages:</strong> Folder pages summarize the business area, report count, usage, and cleanup signal. Report pages explain the report purpose in plain English first, then show SSRS path, parameters, usage, data logic, and support notes.</p></div>
<div data-type="panel-warning"><p><strong>Backlog cleanup signal:</strong> Reports with no executions in the last 6 months should be reviewed with the owning business area before any enhancement work. No recent usage does not automatically mean delete, but it is a strong candidate for business validation.</p></div>
<h2>Top-level report groups</h2>
<table><thead><tr><th>Folder or report group</th><th>Business purpose</th><th>Reports</th><th>Used reports</th><th>No recent usage</th><th>Executions last 6 months</th><th>Most recent use</th></tr></thead><tbody>${rows
    .map((row) => `<tr><td>${esc(row.folder)}</td><td>${esc(folderPurpose(row.folder))}</td><td>${row.reports}</td><td>${row.active}</td><td>${row.reports - row.active}</td><td>${row.execs.toLocaleString()}</td><td>${esc(row.last || 'Not used in last 6 months')}</td></tr>`)
    .join('')}</tbody></table>
<h2>Cleanup guidance</h2>
<ol><li>Start with folders where every report has zero recent executions.</li><li>For active folders, preserve heavily used reports first and review low-use or duplicate pages second.</li><li>Use each report page to confirm SSRS path, user parameters, source query, and known support notes before making retirement or modernization decisions.</li></ol>
<h2>Publishing note</h2>
<p>Page titles intentionally use the report or folder name without generated prefixes. Where SSRS has duplicate report names in different folders, one exact-title page may list multiple SSRS paths because page titles must be unique in the Confluence space.</p>`;
}

const reports = readRows('ssrs-all-report-discovery.out');
const datasetsByPath = by(readRows('ssrs-all-datasets.out'), 'ReportPath');
const parametersByPath = by(readRows('ssrs-all-parameters.out'), 'ReportPath');
const reportsByName = by(reports, 'Name');
const parentPage = await getPage(parentPageId);
const pages = await listChildren(parentPageId);
const results = [];

const targets = [{ page: parentPage, body: parentBody(reports), kind: 'parent' }];

for (const page of pages) {
  const matchingReports = reportsByName.get(page.title) || [];
  if (matchingReports.length) {
    targets.push({
      page,
      body: reportBody(page.title, matchingReports, datasetsByPath, parametersByPath),
      kind: 'report',
    });
    continue;
  }

  const folderPath = folderPathFromPage(page);
  const scopedReports = folderReports(folderPath, reports);
  targets.push({
    page,
    body: folderBody(page.title, [folderPath], scopedReports),
    kind: 'folder',
  });
}

if (!publish) {
  console.log(
    JSON.stringify(
      {
        mode: 'dry-run',
        parentPageId,
        targetCount: targets.length,
        reportPages: targets.filter((target) => target.kind === 'report').length,
        folderPages: targets.filter((target) => target.kind === 'folder').length,
        missingReportTitles: [...reportsByName.keys()].filter(
          (title) => !pages.some((page) => page.title === title)
        ),
      },
      null,
      2
    )
  );
  process.exit(0);
}

for (const target of targets) {
  // eslint-disable-next-line no-await-in-loop
  const updated = await updatePage(target.page, target.body);
  results.push({
    id: updated.id,
    title: updated.title,
    kind: target.kind,
    version: updated.version?.number,
  });
  console.log(`updated ${target.kind}: ${target.page.title}`);
  // eslint-disable-next-line no-await-in-loop
  await delay(150);
}

console.log(
  JSON.stringify(
    {
      mode: 'publish',
      updated: results.length,
      reportPages: results.filter((target) => target.kind === 'report').length,
      folderPages: results.filter((target) => target.kind === 'folder').length,
    },
    null,
    2
  )
);
