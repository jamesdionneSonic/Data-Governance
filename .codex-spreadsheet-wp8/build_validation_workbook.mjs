import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const cwd = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const datasetDir = path.join(cwd, "data-validation/datasets/snowflake-dms-shared-consumption");
const workbookPath = process.env.DATA_VALIDATION_WORKBOOK_PATH ||
  path.join(datasetDir, "excel/Snowflake_DMS_Shared_Consumption_Validation.xlsx");
const previewDir = path.join(datasetDir, "excel/previews");

const files = {
  vehicleSummary: "current/summaries/vehicle_sales_daily_compare.csv",
  repairSummary: "current/summaries/repair_order_daily_compare.csv",
  vehicleMissingSf: "current/exceptions/vehicle_sales_missing_from_snowflake.csv",
  vehicleMissingDms: "current/exceptions/vehicle_sales_missing_from_dms.csv",
  repairMissingSf: "current/exceptions/repair_orders_missing_from_snowflake.csv",
  repairMissingDms: "current/exceptions/repair_orders_missing_from_dms.csv",
  changedRecords: "current/exceptions/changed_records.csv",
  openExceptions: "current/exceptions/open_exceptions.csv",
  resolved: "current/exceptions/resolved_since_last_run.csv",
  runStatus: "current/audit/run_status.csv",
  taxonomy: "config/review-classification-taxonomy.yml",
};

function parseCsv(text) {
  const rows = [];
  let field = "";
  let row = [];
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (quoted && char === "\"" && next === "\"") {
      field += "\"";
      i += 1;
    } else if (char === "\"") {
      quoted = !quoted;
    } else if (!quoted && char === ",") {
      row.push(field);
      field = "";
    } else if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(field);
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    if (row.some((value) => value !== "")) rows.push(row);
  }
  return rows;
}

async function readCsv(relativePath) {
  return parseCsv(await fs.readFile(path.join(datasetDir, relativePath), "utf8"));
}

async function readText(relativePath) {
  return fs.readFile(path.join(datasetDir, relativePath), "utf8");
}

function countBy(rows, columnName) {
  if (!rows.length) return new Map();
  const header = rows[0];
  const index = header.indexOf(columnName);
  const counts = new Map();
  for (const row of rows.slice(1)) {
    const key = row[index] || "(blank)";
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

function countByPair(rows, leftColumnName, rightColumnName) {
  if (!rows.length) return new Map();
  const header = rows[0];
  const leftIndex = header.indexOf(leftColumnName);
  const rightIndex = header.indexOf(rightColumnName);
  const counts = new Map();
  for (const row of rows.slice(1)) {
    const left = row[leftIndex] || "(blank)";
    const right = row[rightIndex] || "(blank)";
    const key = `${left}|${right}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

function cellValue(rows, columnName) {
  if (rows.length < 2) return "";
  const index = rows[0].indexOf(columnName);
  return index >= 0 ? rows[1][index] : "";
}

function numberValue(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function sheetName(name) {
  return name.replace(/[^A-Za-z0-9 _-]/g, "").slice(0, 31);
}

function writeMatrix(sheet, startCell, values) {
  if (!values.length || !values[0]?.length) return;
  const range = sheet.getRange(startCell).resize(values.length, values[0].length);
  range.values = values;
}

function formatTable(sheet, rows, tableName) {
  if (!rows.length || !rows[0]?.length) return;
  const used = sheet.getRangeByIndexes(0, 0, rows.length, rows[0].length);
  used.format.font = { name: "Aptos", size: 10, color: "#172033" };
  const header = sheet.getRangeByIndexes(0, 0, 1, rows[0].length);
  header.format.fill = "#1F4E78";
  header.format.font = { bold: true, color: "#FFFFFF" };
  header.format.wrapText = true;
  used.format.borders = { preset: "outside", style: "thin", color: "#B8C7D9" };
  if (rows.length > 1) {
    sheet.getRangeByIndexes(1, 0, rows.length - 1, rows[0].length).format.borders = {
      preset: "insideHorizontal",
      style: "thin",
      color: "#E5EAF0",
    };
  }
  used.format.autofitColumns();
  used.format.autofitRows();
  try {
    const table = sheet.tables.add(used.address, true, tableName);
    table.style = "TableStyleMedium2";
    table.showFilterButton = true;
  } catch {
    // Table creation is nice-to-have; values remain usable if the workbook API rejects an overlap.
  }
  sheet.freezePanes.freezeRows(1);
  sheet.showGridLines = false;
}

function setWidths(sheet, widths) {
  widths.forEach((width, col) => {
    sheet.getRangeByIndexes(0, col, 1, 1).format.columnWidth = width;
  });
}

function cleanYamlValue(value) {
  return String(value || "").trim().replace(/^["']|["']$/g, "");
}

function displayBucket(value) {
  return !value || value === "(blank)" ? "unclassified" : value;
}

function parseClassificationDefinitions(text) {
  const definitions = [];
  let current = null;
  for (const line of text.split(/\r?\n/)) {
    const nameMatch = line.match(/^  - name:\s*(.+)$/);
    if (nameMatch) {
      if (current) definitions.push(current);
      current = {
        name: cleanYamlValue(nameMatch[1]),
        group: "",
        meaning: "",
        first_check: "",
        vendor_handoff: "",
      };
      continue;
    }
    const fieldMatch = line.match(/^    (group|meaning|first_check|vendor_handoff):\s*(.+)$/);
    if (current && fieldMatch) {
      current[fieldMatch[1]] = cleanYamlValue(fieldMatch[2]);
    }
  }
  if (current) definitions.push(current);
  return definitions;
}

function addDefinitionsSheet(workbook, definitions) {
  const sheet = workbook.worksheets.add("Classification Definitions");
  sheet.showGridLines = false;

  const rows = [
    ["Classification Definitions", "", "", "", ""],
    ["Use this tab to interpret dashboard buckets and exception rows. Raw exception types are the mechanical compare result; review classifications explain what the evidence likely means.", "", "", "", ""],
    ["", "", "", "", ""],
    ["Classification Group", "Review Classification", "Plain-English Meaning", "First Check", "Vendor Handoff Guidance"],
    ...definitions.map((definition) => [
      definition.group,
      definition.name,
      definition.meaning,
      definition.first_check,
      definition.vendor_handoff,
    ]),
  ];

  writeMatrix(sheet, "A1", rows);
  sheet.getRange("A1:E1").merge();
  sheet.getRange("A2:E2").merge();
  sheet.getRange("A1").format = {
    fill: "#17324D",
    font: { bold: true, color: "#FFFFFF", size: 16 },
  };
  sheet.getRange("A2").format = {
    fill: "#EAF2F8",
    font: { color: "#172033" },
    wrapText: true,
  };
  sheet.getRange("A4:E4").format = {
    fill: "#1F4E78",
    font: { bold: true, color: "#FFFFFF" },
    wrapText: true,
  };
  const used = sheet.getRangeByIndexes(3, 0, Math.max(1, rows.length - 3), 5);
  used.format.borders = { preset: "all", style: "thin", color: "#D8E1EC" };
  sheet.getRangeByIndexes(4, 2, Math.max(1, definitions.length), 3).format.wrapText = true;
  setWidths(sheet, [20, 38, 62, 58, 62]);
  sheet.getRange("A1:E2").format.rowHeight = 30;
  sheet.freezePanes.freezeRows(4);
  try {
    const table = sheet.tables.add(`A4:E${rows.length}`, true, "ClassificationDefinitions");
    table.style = "TableStyleMedium2";
    table.showFilterButton = true;
  } catch {
    // Definitions remain usable without an Excel table wrapper.
  }
}

function addDashboard(workbook, data) {
  const sheet = workbook.worksheets.add("Dashboard");
  sheet.showGridLines = false;

  const runId = cellValue(data.runStatus, "run_id");
  const runStatus = cellValue(data.runStatus, "status");
  const mode = cellValue(data.runStatus, "mode");
  const notes = cellValue(data.runStatus, "notes");

  const vehicleClasses = countBy(data.vehicleSummary, "classification");
  const repairClasses = countBy(data.repairSummary, "classification");
  const openBySubject = countBy(data.openExceptions, "subject_area");
  const openByType = countBy(data.openExceptions, "exception_type");
  const openByGroup = countBy(data.openExceptions, "classification_group");
  const openByClassification = countByPair(data.openExceptions, "classification_group", "review_classification");

  const values = [
    ["Snowflake / DMS Shared Consumption Validation", "", "", "", "", "", ""],
    ["Run ID", runId, "Status", runStatus, "Mode", mode, ""],
    ["Run Notes", notes, "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["Daily Summary", "Rows", "Matched", "Review Needed", "Snowflake Only", "Missing From Snowflake", ""],
    [
      "Vehicle Sales",
      Math.max(0, data.vehicleSummary.length - 1),
      vehicleClasses.get("matched_summary") || 0,
      vehicleClasses.get("difference_review_needed") || 0,
      vehicleClasses.get("snowflake_only") || 0,
      vehicleClasses.get("missing_from_snowflake") || 0,
      "",
    ],
    [
      "Repair Orders",
      Math.max(0, data.repairSummary.length - 1),
      repairClasses.get("matched_summary") || 0,
      repairClasses.get("difference_review_needed") || 0,
      repairClasses.get("snowflake_only") || 0,
      repairClasses.get("missing_from_snowflake") || 0,
      "",
    ],
    ["", "", "", "", "", "", ""],
    ["Exception Queue", "Rows", "", "", "", "", ""],
    ["Open", Math.max(0, data.openExceptions.length - 1), "", "", "", "", ""],
    ["Resolved", Math.max(0, data.resolved.length - 1), "", "", "", "", ""],
    ["Changed", Math.max(0, data.changedRecords.length - 1), "", "", "", "", ""],
    ["Veh only Snowflake", Math.max(0, data.vehicleMissingDms.length - 1), "", "", "", "", ""],
    ["Veh missing Snowflake", Math.max(0, data.vehicleMissingSf.length - 1), "", "", "", "", ""],
    ["RO only Snowflake", Math.max(0, data.repairMissingDms.length - 1), "", "", "", "", ""],
    ["RO missing Snowflake", Math.max(0, data.repairMissingSf.length - 1), "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["Open Exceptions By Subject", "Rows", "", "Open Exceptions By Type", "Rows", "", ""],
  ];

  const subjects = [...openBySubject.entries()].sort();
  const types = [...openByType.entries()].sort();
  const maxRows = Math.max(subjects.length, types.length, 1);
  for (let i = 0; i < maxRows; i += 1) {
    values.push([
      subjects[i]?.[0] || "",
      subjects[i]?.[1] || "",
      "",
      types[i]?.[0] || "",
      types[i]?.[1] || "",
      "",
      "",
    ]);
  }

  values.push(["", "", "", "", "", "", ""]);
  const groupHeaderRow = values.length + 1;
  values.push(["Open Exceptions By Classification Group", "Rows", "", "Open Exceptions By Review Classification", "Rows", "", ""]);
  const groups = [...openByGroup.entries()].sort((left, right) => right[1] - left[1]);
  const classes = [...openByClassification.entries()].sort((left, right) => right[1] - left[1]);
  const maxClassificationRows = Math.max(groups.length, classes.length, 1);
  for (let i = 0; i < maxClassificationRows; i += 1) {
    const [groupName, groupCount] = groups[i] || ["", ""];
    const [classKey, classCount] = classes[i] || ["", ""];
    const [classGroup, className] = String(classKey || "").split("|");
    values.push([
      groupCount === "" ? "" : displayBucket(groupName),
      groupCount || "",
      "",
      className ? `${displayBucket(classGroup)}: ${displayBucket(className)}` : "",
      classCount || "",
      "",
      "",
    ]);
  }

  writeMatrix(sheet, "A1", values);
  sheet.getRange("A1:G1").merge();
  sheet.getRange("A1").format = {
    fill: "#17324D",
    font: { bold: true, color: "#FFFFFF", size: 16 },
  };
  sheet.getRange("A2:G3").format.fill = "#EAF2F8";
  sheet.getRange("A5:F5").format = {
    fill: "#1F4E78",
    font: { bold: true, color: "#FFFFFF" },
  };
  sheet.getRange("A9:B9").format = {
    fill: "#1F4E78",
    font: { bold: true, color: "#FFFFFF" },
  };
  sheet.getRange("A18:B18").format = {
    fill: "#1F4E78",
    font: { bold: true, color: "#FFFFFF" },
  };
  sheet.getRange("D18:E18").format = {
    fill: "#1F4E78",
    font: { bold: true, color: "#FFFFFF" },
  };
  sheet.getRange(`A${groupHeaderRow}:B${groupHeaderRow}`).format = {
    fill: "#1F4E78",
    font: { bold: true, color: "#FFFFFF" },
  };
  sheet.getRange(`D${groupHeaderRow}:E${groupHeaderRow}`).format = {
    fill: "#1F4E78",
    font: { bold: true, color: "#FFFFFF" },
  };
  sheet.getRange(`B6:F${values.length}`).format.numberFormat = "#,##0";
  sheet.getRange(`A1:G${values.length}`).format.borders = { preset: "outside", style: "thin", color: "#B8C7D9" };
  setWidths(sheet, [42, 18, 18, 62, 18, 26, 4]);
  sheet.freezePanes.freezeRows(4);

  const summaryRange = sheet.getRange("A5:F7");
  const chart = sheet.charts.add("bar", summaryRange);
  chart.title = "Daily Summary Classification";
  chart.hasLegend = true;
  chart.setPosition("H2", "W16");

  const exceptionChartRange = sheet.getRange("A9:B16");
  const exceptionChart = sheet.charts.add("bar", exceptionChartRange);
  exceptionChart.title = "Exception Output Rows";
  exceptionChart.hasLegend = false;
  exceptionChart.setPosition("H18", "W32");

  const groupChartRange = sheet.getRange(`A${groupHeaderRow}:B${groupHeaderRow + groups.length}`);
  const groupChart = sheet.charts.add("bar", groupChartRange);
  groupChart.title = "Open Exceptions By Classification Group";
  groupChart.hasLegend = false;
  groupChart.setPosition(`H34`, `W48`);
}

function addSourcesSheet(workbook) {
  const sheet = workbook.worksheets.add("Sources");
  const rows = [
    ["Purpose", "Stable local CSV paths and refresh commands"],
    ["Workbook refresh model", "This workbook is rebuilt from local CSV outputs; native Power Query connections are not embedded."],
    ["Daily data command", "data-validation\\datasets\\snowflake-dms-shared-consumption\\scripts\\run_daily_validation.ps1"],
    ["Workbook rebuild command", "C:\\Users\\james.dionne\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\bin\\node.exe .codex-spreadsheet-wp8\\build_validation_workbook.mjs"],
    ["Repair order basis", "DMS closed-preferred cora_acct_code/RO grain; customer-pay core vs Snowflake PAYCPTOTAL"],
    ["", ""],
    ["Output", "Relative CSV path"],
    ["Vehicle daily summary", files.vehicleSummary],
    ["Repair daily summary", files.repairSummary],
    ["Open exceptions", files.openExceptions],
    ["Resolved since last run", files.resolved],
    ["Changed records", files.changedRecords],
    ["Vehicle missing from Snowflake", files.vehicleMissingSf],
    ["Vehicle missing from DMS", files.vehicleMissingDms],
    ["Repair orders missing from Snowflake", files.repairMissingSf],
    ["Repair orders missing from DMS", files.repairMissingDms],
    ["Run status", files.runStatus],
  ];
  writeMatrix(sheet, "A1", rows);
  sheet.getRange("A1:B1").format = {
    fill: "#17324D",
    font: { bold: true, color: "#FFFFFF" },
  };
  sheet.getRange("A6:B6").format = {
    fill: "#1F4E78",
    font: { bold: true, color: "#FFFFFF" },
  };
  sheet.getRange("A1:B16").format.borders = { preset: "outside", style: "thin", color: "#B8C7D9" };
  setWidths(sheet, [30, 120]);
  sheet.showGridLines = false;
}

async function build() {
  const data = {};
  for (const [key, relativePath] of Object.entries(files)) {
    data[key] = key === "taxonomy" ? await readText(relativePath) : await readCsv(relativePath);
  }
  data.classificationDefinitions = parseClassificationDefinitions(data.taxonomy);

  const workbook = Workbook.create();
  addDashboard(workbook, data);
  addDefinitionsSheet(workbook, data.classificationDefinitions);
  addSourcesSheet(workbook);

  const sheetDefs = [
    ["Vehicle Daily", data.vehicleSummary, "VehicleDaily"],
    ["Repair Daily", data.repairSummary, "RepairDaily"],
    ["Open Exceptions", data.openExceptions, "OpenExceptions"],
    ["Resolved", data.resolved, "ResolvedExceptions"],
    ["Changed Records", data.changedRecords, "ChangedRecords"],
    ["Veh Missing SF", data.vehicleMissingSf, "VehicleMissingSF"],
    ["Veh Missing DMS", data.vehicleMissingDms, "VehicleMissingDMS"],
    ["RO Missing SF", data.repairMissingSf, "RepairMissingSF"],
    ["RO Missing DMS", data.repairMissingDms, "RepairMissingDMS"],
    ["Run Status", data.runStatus, "RunStatus"],
  ];

  for (const [name, rows, tableName] of sheetDefs) {
    const sheet = workbook.worksheets.add(sheetName(name));
    writeMatrix(sheet, "A1", rows);
    formatTable(sheet, rows, tableName);
  }

  await fs.mkdir(previewDir, { recursive: true });
  const sheetsToRender = [
    { name: "Dashboard", range: "A1:W48" },
    { name: "Classification Definitions", range: "A1:E28" },
    { name: "Vehicle Daily", range: "A1:K30" },
    { name: "Open Exceptions", range: "A1:N30" },
  ];
  for (const sheetToRender of sheetsToRender) {
    const preview = await workbook.render({
      sheetName: sheetToRender.name,
      range: sheetToRender.range,
      scale: 1,
      format: "png",
    });
    await fs.writeFile(
      path.join(previewDir, `${sheetToRender.name.replace(/\s+/g, "_").toLowerCase()}.png`),
      new Uint8Array(await preview.arrayBuffer()),
    );
  }

  const errors = await workbook.inspect({
    kind: "match",
    searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
    options: { useRegex: true, maxResults: 300 },
    summary: "final formula error scan",
  });
  console.log(errors.ndjson);

  const overview = await workbook.inspect({
    kind: "workbook,sheet,table",
    maxChars: 5000,
    tableMaxRows: 3,
    tableMaxCols: 8,
  });
  console.log(overview.ndjson);

  const output = await SpreadsheetFile.exportXlsx(workbook);
  await output.save(workbookPath);
  console.log(JSON.stringify({ workbookPath, previewDir }, null, 2));
}

await build();
