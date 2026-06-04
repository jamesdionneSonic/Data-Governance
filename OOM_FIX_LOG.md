# OOM Fix Log

This file is the durable handoff point for fixing the Node.js heap out-of-memory failure in small, restartable pieces.

## Current Status

- Status: Operational hardening in place for raw rebuild, runtime catalog, DevOps catalog export, and Confluence publish paths; DevOps is pushed through commit `10b05247`, and the live Confluence database hierarchy audit is green.
- Created: 2026-06-04
- Repo root: `C:\projects\Data Governence`
- Do not run the full crashing command repeatedly until a smaller verification ladder exists.
- Treat `NODE_OPTIONS=--max-old-space-size=...` as a diagnostic aid, not the primary fix.

## Known Failure Signature

Observed failure:

```text
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

Screenshot details:

- Heap near 4 GB at failure.
- Recent GC included `Scavenge (interleaved)` and `Mark-Compact (reduce)`.
- The process died inside V8 / Node fatal OOM handling.

Unknowns to fill during audit:

- Exact command that triggers the OOM:
- Whether the failure happens during build, dev server startup, test run, catalog generation, ingestion, visualization, or lineage processing: not confirmed yet
- Whether the failure is deterministic:
- Approximate time to failure:
- Last successful commit or known-good behavior:

## Operating Rules

- Work in small slices.
- Update this log after each investigation or fix.
- Prefer read-only audit steps before editing code.
- Do not make broad refactors while fixing the OOM.
- Do not repeatedly run the full OOM command unless it is the current explicit verification step.
- Verify each change with the narrowest command possible.
- If a chat/session locks up, the next session should read this file first and continue from the next unchecked item.
- Current operational entry points: `npm run catalog:refresh` for the full staged catalog rebuild/index/check ladder, `npm run catalog:refresh:fast` for the shorter gated rebuild/index/check, and `npm run confluence:publish` for export/check/dry-run/live publish.

## Suspected Risk Areas To Audit

- Full-repo or full-dataset loading into memory.
- Large `data/analysis/raw` or `data/markdown` scans.
- Lineage graph traversal retaining too much state.
- Visualization payload generation expanding graph/object relationships.
- Catalog/cache hydration loading all entities eagerly.
- SSIS or SQL extraction parsing many large files at once.
- Test/build tooling accidentally including generated data, coverage, reports, or raw analysis files.
- Unbounded recursion, repeated traversal without a visited set, or duplicate graph expansion.
- In-memory caches retaining full source documents instead of compact indexes.

## Audit Checklist

- [ ] Identify the exact OOM command.
- [x] Record the exact OOM output and timestamp.
- [~] Identify which script or endpoint starts the high-memory work.
- [~] Map the execution path from command to service/module.
- [x] List large directories/files read by likely paths.
- [~] Check for eager `readFile`, `readdir`, JSON parse, XML parse, or glob operations over large trees.
- [~] Check for array accumulation of all records before processing.
- [ ] Check for graph expansion without depth, size, or visited guards.
- [ ] Check for caches that retain raw source content.
- [~] Check whether build/test tooling is including generated artifacts.
- [ ] Design a verification ladder from narrow checks to the full failing command.

Legend: `[~]` means partially audited with evidence below.

## Evidence Collected

### 2026-06-04 Static Audit Pass 1

Commands intentionally not run:

- Did not rerun the full OOM command because the exact command is not yet known.
- Did not run full `npm test`, full export, full rebuild, or catalog rebuild.

Package scripts from `package.json`:

- `npm run dev` -> `node src/index.js`
- `npm run start` -> `NODE_ENV=production node src/index.js`
- `npm run test` -> `node --experimental-vm-modules node_modules/jest/bin/jest.js --coverage --passWithNoTests`
- `npm run catalog:index` -> `node scripts/build-runtime-catalog-indexes.mjs`
- `npm run confluence:export` -> `node scripts/build-confluence-export.mjs`
- `npm run lineage:brain` -> `node src/services/lineageBrain/runLineageBrain.js`
- `npm run perf:load` -> `node scripts/perf-load-test.js`

Current local data scale:

- `data/analysis/raw`: 15,521 files, 1,027.65 MB.
- `data/analysis/raw/ssis/xml`: 1,803 files, 756.45 MB.
- `data/analysis/raw/sqlserver`: 13,718 files, 271.2 MB.
- `data/markdown`: 11,651 files, 980.01 MB total.
- `data/markdown` markdown files only: 10,731 `.md` files, 440.8 MB.
- `data/markdown/servers`: 10,730 files, 440.8 MB.
- `data/markdown/_runtime`: 5 files, 138.74 MB.
- `data/markdown/catalog-manifest.json`: 9,856 manifest entries, 0.86 MB.

Largest observed markdown files:

- Largest `.md` files are under 1 MB each, so the risk is corpus-level accumulation rather than a single huge markdown file.
- Example largest files: `dbo__uspScoresFactOpportunityLoad_withTemp.md` at 0.72 MB, backup variant at 0.71 MB, `JMA__LOAD_FACT_JMA_CONTRACT_TBL.md` at 0.69 MB.

Largest observed raw files:

- Largest raw files are SSIS XML packages in `data/analysis/raw/ssis/xml`.
- Top files are about 7.8 MB each, including `0766_AuctionDW_AdesaAuction_DataLoad.dtsx.xml`, `0769_AuctionDW_AdesaAuction_DataLoad.dtsx.xml`, `0641_AuctionDW_AdesaAuction_DataLoad.dtsx.xml`, and `0643_AuctionDW_AdesaAuction_DataLoad.dtsx.xml`.

Existing runtime index files:

- `data/markdown/_runtime/catalog-summary.json`: 51,416,815 bytes.
- `data/markdown/_runtime/column-index.json`: 87,940,368 bytes.
- `data/markdown/_runtime/edge-index.json`: 4,625,967 bytes.
- `data/markdown/_runtime/object-file-index.json`: 1,500,384 bytes.
- Last observed write time: 2026-06-03 17:41 local.

Current dev startup evidence:

- `logs/dev-server.out.log` shows `npm run dev` started and initialized `9856 summary object(s)` in `206ms`.
- Older dev logs show 5,431 objects initialized in about 3.7-4.3s.
- This suggests current `npm run dev` with current runtime indexes is not the OOM command, unless runtime indexes are missing/stale, env flags differ, or another request triggers heavier work.

Runtime startup/index path:

- `src/index.js` uses `MARKDOWN_DATA_PATH || data/markdown`, then calls `loadRuntimeCatalog(markdownDataPath)` and `initializeCache(...)`.
- `src/index.js` only runs `resolveLineageCorpus(markdownDataPath)` when `RUN_STARTUP_LINEAGE_RESOLUTION === 'true'`.
- `src/services/catalogRuntimeService.js` `loadRuntimeCatalog` reads summary, edges, object-file index, and manifest with one `Promise.all`.
- `src/services/catalogRuntimeService.js` `buildRuntimeCatalogIndexes` collects `objects = []`, `columns = []`, builds `objectMap`, builds all `typedEdges`, then writes large JSON files.
- Evidence lines: `catalogRuntimeService.js:307`, `:315`, `:316`, `:333`, `:345`, `:351`, `:362`, `:374`, `:404`, `:411-415`.

Catalog runtime detailed memory audit:

- Fresh startup with current runtime indexes is probably okay: local log shows 9,856 summary objects loaded in 206 ms.
- Runtime rebuild is higher risk than runtime load.
- `buildRuntimeCatalogIndexes` parses frontmatter only, which is good, but still retains `objects = []`, `columns = []`, `compactObjects`, `objectMap`, `typedEdges`, and large JSON serialization payloads before/during writes. Evidence: `catalogRuntimeService.js:307`, `:315`, `:316`, `:333`, `:342`, `:343`, `:345`, `:351-380`.
- Current runtime manifest reports 9,856 objects, 215,690 columns, and 23,332 typed edges.
- Current runtime JSON files total about 138.74 MB, with `column-index.json` about 87.94 MB and `catalog-summary.json` about 51.42 MB.
- `loadRuntimeCatalog` reads summary, edge index, object-file index, and manifest concurrently, then builds `objects = new Map(...)`, `typedEdgeIndex`, and `lineageGraph`. Evidence: `catalogRuntimeService.js:404`, `:411-436`.
- `catalogRuntimeStore` retains both the raw `typedLineageEdges` array and the indexed edge maps. Evidence: `catalogRuntimeStore.js`.
- `initializeCache` passes the same object map into several route/service caches rather than making obvious deep copies, which lowers concern there. Evidence: `cacheInitializer.js`.
- `loadObjectDetail` uses a bounded LRU-like detail cache with default size 200, but those details are full parsed markdown objects. Evidence: `catalogRuntimeService.js:24`, `:129`, `:142-146`, `:452-472`.
- API routes can force runtime rebuilds after writes/ingestion/SSIS extraction. Evidence from caller scan: `objects.js:153`, `ingestion.js:343`, `ingestion.js:511`, `ssis.js:597`.

Catalog runtime lowest-risk fix candidates if this is the OOM command:

1. Lower index build concurrency to 1 for diagnosis, then measure whether peak drops.
2. Partially done 2026-06-04: Stream writes for large runtime JSON arrays, including `column-index.json`; sharding remains a future larger option.
3. Done 2026-06-04: Avoid `Promise.all` loading all runtime JSON indexes together; runtime load now stages file index, summary, then edges.
4. Avoid retaining both raw typed edge array and full indexed edge maps if memory is tight.
5. Add a small fixture/index mode before retesting full `npm run catalog:index`.
6. Avoid forced full runtime rebuild after small object edits if an incremental update can be made later.

Markdown service path:

- `parseMarkdownFile` reads a whole markdown file.
- `parseMarkdownMetadataFile` reads frontmatter only.
- `getMarkdownFiles` uses manifest when available; otherwise recursively walks directories and collects all `.md` paths into `files = []`.
- `loadAllMarkdown` loads every markdown file into a Map with default concurrency 64.
- `validateMarkdownCatalog` parses frontmatter only, but still stores all validation errors in memory.
- Evidence lines: `markdownService.js:17`, `:26`, `:293`, `:299`, `:304`, `:403`, `:404`, `:408`, `:425`, `:433`, `:441`, `:472`.

Lineage resolver path:

- `src/services/lineageResolver.js` has its own recursive markdown walk.
- `resolveLineageCorpus` parses every markdown file with full `parseMarkdownFile`, stores `records = []`, builds alias and edge maps, accumulates `traceLines = []`, then writes metadata updates.
- Startup only calls this when `RUN_STARTUP_LINEAGE_RESOLUTION=true`, but ingestion can call it directly.
- This is a high-risk path for OOM if enabled against the full corpus.

Confluence export path:

- `npm run confluence:export` calls `buildConfluenceExport`.
- `buildConfluenceExport` calls `loadAllMarkdown(markdownRoot)`, then `buildLineageGraph(objects)`, then builds shard/quick-context/object-locator definitions.
- This path loads the full markdown corpus, including body content, not only frontmatter summaries.
- Evidence lines: `confluenceExportService.js:1037`, `:1090`, `:1091`.

Confluence export detailed memory audit:

- `buildConfluenceExport` loads all markdown through `loadAllMarkdown(markdownRoot)`. That means whole-file markdown bodies are retained in object metadata, unlike runtime summaries. Evidence: `confluenceExportService.js:1090`; `markdownService.js:403-425`.
- It immediately builds a full lineage graph from those full objects. Evidence: `confluenceExportService.js:1091`.
- It creates `objectEntries = sortedObjectEntries(objects)`, which copies all object entries into a sorted array. Evidence: `:1092`; helper starts at `:692`.
- It then creates `shardDefinitions`, `quickContextDefinitions`, and `objectLocatorDefinitions`, each retaining grouped/page entries. Evidence: `:1093`, `:1101`, `:1110`.
- It creates `objectRows = objectEntries.map(...)`, another full object index array, then writes it as pretty JSON. Evidence: `:1117`, `:1276`.
- Page/shard writing uses bounded concurrency, which is good for file handles, but `mapWithConcurrency` still stores all results in `results = []`. Evidence: `:1021`, `:1023`, `:1033`.
- `createCatalogZip` calls `getMarkdownFiles(markdownRoot)`, adds all markdown files to an in-memory `AdmZip`, adds pretty JSON `objectIndex`, writes the zip, then reads the full zip back to hash it. This is a major heap candidate for a 440.8 MB markdown corpus. Evidence: `:993`, `:1001`, `:1012`.
- Because the ZIP path adds every markdown file and also materializes object-index JSON, the export can spike well above the raw markdown size.

Confluence export lowest-risk fix candidates if this is the OOM command:

1. Done 2026-06-04: Replace `loadAllMarkdown` with runtime catalog summaries/graph where full markdown body is not needed.
2. Done 2026-06-04: Avoid in-memory `AdmZip`; use a streaming archive writer.
3. Done 2026-06-04: Avoid reading the completed ZIP back into memory just to hash it; hash by streaming the file in chunks.
4. Done 2026-06-04: Object index JSON is streamed item-by-item for both the standalone attachment and ZIP copy instead of materializing one large pretty JSON string.
5. Use manifest/runtime indexes for markdown file discovery instead of recursive full lists where possible.
6. Add a small fixture/export mode before testing full `npm run confluence:export`.

Raw rebuild path:

- `scripts/rebuild-catalog-from-raw.mjs` is not currently in `package.json`, but docs/backlog mention it as the full raw-to-markdown rebuild script.
- It reads all raw SSIS XML files, keeps `catalog = []`, `xmlMetadata = []`, creates a full `result`, builds all SSIS lineage edges, then maps all generated package markdowns before writing.
- It later validates output by calling `getMarkdownFiles(OUTPUT_ROOT)` and `parseMarkdownFile(filePath)` for each generated file.
- Current rebuild report says the last rebuild generated/loaded 9,856 objects with 1,803 SSIS packages, 22,533 SSIS edges, 23,750 direct edge refs, and 15,880 column lineage records.
- Evidence lines: `rebuild-catalog-from-raw.mjs:1526`, `:1538`, `:1582`, `:1584`, `:2607`, `:2612`.

Raw rebuild detailed memory audit:

- `listFiles` recursively walks and returns a full `results = []` file list before processing. Evidence: `rebuild-catalog-from-raw.mjs:204`.
- `loadExistingSsisCatalog` reads existing generated SSIS package markdown files with full `fs.readFile` and stores identity hints in a Map. Evidence: `:625`, `:636`.
- `loadSqlRawObjects` lists all raw SQL markdown files, reads each full file with `fs.readFile`, parses frontmatter/body, stores `metadata`, `body`, and extracted SQL `definition` in `candidates = new Map()`. Evidence: `:1337`, `:1342`, `:1355`.
- `rewriteSqlLineage` builds a full reference index, normalizes columns on every record, then builds column usage metadata for all SQL records. Evidence: `:1390`, `:438`.
- `rebuildSsis` lists all raw SSIS XML files, reads each full XML file, parses lineage, stores `catalog = []` and `xmlMetadata = []`, builds `result.lineageEdges`, then creates `markdowns = catalog.map(...)`. Evidence: `:1526`, `:1538`, `:1552`, `:1582`, `:1584`.
- `buildSsisMarkdown` filters `result.lineageEdges` per package. This duplicates scan work across all packages and can create many temporary package edge arrays. Evidence: `:776`, `:791`.
- `buildSsisSqlEndpointRecords` starts with `Array.from(records.values()).filter(...)`, adding another full-record pass/copy. Evidence: `:1221`, `:1223`.
- `applySsisBridgeInferences` creates `tables = Array.from(records.values()).filter(...)`, then filters/maps/sorts table candidates inside nested package/call/stage loops. This is more CPU-risk than heap-risk, but it also creates many temporary arrays. Evidence: `:1652`, `:1653`, `:1681-1700`.
- `applyColumnLineageResolution` builds `objects = new Map()` and `recordsById = new Map()` over all records, then calls `resolveColumnLineage`. Evidence: `:1767-1776`.
- `resolveColumnLineage` builds a full column resolution index and returns four full arrays: `validated`, `probable`, `unresolved`, `rejected`. Evidence: `columnLineageResolver.js:106-141`, `:703-724`.
- `writeRecords` writes one file at a time, but stores all manifest paths in `generatedFiles = []`. This is probably acceptable at current scale. Evidence: `rebuild-catalog-from-raw.mjs:2547`, `:2550`, `:2601`.
- `validateOutput` calls `getMarkdownFiles(OUTPUT_ROOT)` and parses every generated markdown file with full `parseMarkdownFile`, including body text. This is an obvious small fix candidate because validation only needs metadata. Evidence: `:2606`, `:2607`, `:2612`.
- `main` creates `recordList = Array.from(records.values())`, then creates many filtered arrays for summary counts. This duplicates references, not full objects, but is still avoidable in one summary pass. Evidence: `:2648-2717`.
- Runtime manifest reports 9,856 objects, 215,690 columns, and 23,332 runtime typed edges. This confirms column indexing and graph indexing are non-trivial memory consumers even after compaction.

Raw rebuild lowest-risk fix candidates if this is the OOM command:

1. Done 2026-06-04: Change `validateOutput` to parse metadata/frontmatter only instead of full markdown bodies.
2. Done 2026-06-04: Replace final `recordList` plus many `.filter()` arrays with a single summary accumulator pass.
3. Add a narrow CLI mode for raw rebuild, such as one package/file filter, so verification can run on a tiny subset.
4. Done 2026-06-04: Index tables by database/schema before `applySsisBridgeInferences` to avoid repeated full-table filtering; also cache table lineage tokens.
5. Done 2026-06-04: Avoid `markdowns = catalog.map(...)` retaining all package markdowns at once; package markdowns, sidecars, and target updates are now processed incrementally.
6. Partially done 2026-06-04: Added SSIS edge/XML metadata lookup indexes so package markdown generation does not scan all SSIS edges and XML metadata for every package. Further `xmlMetadata` compaction remains open.
7. Consider grouped/streamed column lineage resolution or per-process aggregation if column lineage arrays are the heap peak.

Visualization/API path:

- Discovery routes call `buildCenteredLineageGraph`, `buildD3Graph`, `buildMermaidDiagram`, `buildCytoscapeGraph`, `buildImpactVisualization`, and `buildDependencyMatrix`.
- The centered graph has visited/dedupe sets and a bridge depth limit.
- `buildDependencyMatrix(database, objects, lineageGraph)` is still potentially high memory because it builds an N x N matrix for every object in a database.
- Evidence lines: `discovery.js:302`, `:308`, `:310`, `:315`, `:354`, `:431`, `:515`; `visualizationService.js:849`.

Lineage service detailed memory audit:

- `buildLineageGraph(objects)` builds multiple full-corpus indexes: name index, reference index, lower-object index, and graph Map. It is high risk only when called on full markdown objects, such as Confluence export. Evidence: `lineageService.js:13-17`, `:110`, `:137`.
- `buildTypedLineageEdges(objects)` similarly builds full indexes plus an `edges = []` array and optional dedupe Set. Runtime indexing calls it with per-object edge limits, which helps bound edge count. Evidence: `lineageService.js:302-307`.
- `indexTypedLineageEdges(edges)` retains the raw edge array and creates incoming/outgoing/byNode maps of arrays. Evidence: `lineageService.js:358-362`.
- Traversal helpers use visited/frontier sets, so basic upstream/downstream traversal is bounded by graph size and depth. Evidence: `lineageService.js:415-419`, `:461`, `:497`.
- `getReverseLineageGraph` caches reverse graphs in a WeakMap keyed by the original graph. This is useful but doubles graph structures while the original graph is alive. Evidence: `lineageService.js:6`, `:528-548`.

Visualization detailed memory audit:

- Discovery graph routes pass `getTypedLineageEdgeIndex()` into centered, mermaid, and cytoscape builders, avoiding repeated full typed-edge rebuilds in normal API flow. Evidence: `discovery.js:294`, `:302-317`, `:431`.
- `buildCenteredLineageGraph` has `maxBridgeDepth` and `bridgeVisited`, limiting bridge recursion. Evidence: `visualizationService.js:139`, `:148`, `:301-305`.
- `buildMermaidDiagram` caps rendering at 40 nodes and 60 edges once typed neighborhood is built. Evidence: `visualizationService.js:739-741`, `:766`, `:773`.
- `buildD3Graph` uses upstream/downstream traversal with the requested depth. Evidence: `visualizationService.js:647`.
- `buildImpactVisualization` can include all downstream impacted objects from `analyzeImpact`; not first priority unless a large impact endpoint is the crash trigger. Evidence: `visualizationService.js:829`.
- `buildDependencyMatrix(database, objects, lineageGraph)` builds rows, columns, and an N x N `data` matrix for every object in a database, then discovery caches it for 30 seconds. This is the clearest visualization OOM candidate. Evidence: `visualizationService.js:849-865`, `discovery.js:515`, `ttlCache.js`.

Lineage/visualization lowest-risk fix candidates if an API request is the OOM trigger:

1. Done 2026-06-04: Add a hard object-count cap to `/api/v1/discovery/matrix/:database` through `buildDependencyMatrix`; default cap is 500 objects via `DEPENDENCY_MATRIX_MAX_OBJECTS`.
2. Return sparse dependency-matrix edges instead of a dense N x N array for large databases.
3. Done 2026-06-04: Add max per-level rendered object caps to `buildImpactVisualization`; default cap is 250 objects per level via `IMPACT_VISUALIZATION_MAX_PER_LEVEL`.
4. Ensure all visualization callers pass the prebuilt typed edge index.
5. Avoid building fallback typed edges from full `lineageGraph` unless no runtime edge index is available.

Test/build artifact inclusion:

- `npm run build` is only `echo 'Build process for frontend would go here'`, so it is not a real build/OOM path today.
- Jest config ignores `/node_modules/` and `/tests/e2e/`; `testMatch` targets tests/spec files; coverage is scoped to `src/app.js`, `src/middleware/**/*.js`, and `src/utils/**/*.js`.
- ESLint script is scoped to `eslint src tests --fix`.
- Playwright config starts `node src/index.js` as a web server, so Playwright inherits app startup/runtime-index risk, but does not itself scan `data`.
- `.gitignore` ignores `/data/`, `coverage/`, `playwright-report/`, and `test-results/`; these generated directories still exist locally but are not direct build/test inputs from config.
- Conclusion: test/build tooling is lower priority than raw rebuild/export/runtime indexing unless the exact OOM command is `npm test` or `npm run test:e2e`.

Likely OOM entrypoint ranking based on current evidence:

1. Unknown exact command from screenshot. Must be confirmed before final fix.
2. Full raw rebuild: `node scripts/rebuild-catalog-from-raw.mjs`, because it touches ~1 GB raw inputs, accumulates records/XML metadata/edges/markdowns, and validates full generated markdown.
3. Confluence export: `npm run confluence:export`, because it calls `loadAllMarkdown` and builds a full lineage graph from full markdown objects.
4. Runtime index rebuild: `npm run catalog:index`, because it accumulates all summaries, columns, typed edges, and writes 138 MB of runtime JSON.
5. Startup with stale/missing runtime indexes: `npm run dev` or `npm run start` can invoke runtime index rebuild before loading.
6. Startup or ingestion with `RUN_STARTUP_LINEAGE_RESOLUTION=true` / explicit lineage resolution, because `resolveLineageCorpus` parses full markdown and stores all records.
7. Dependency matrix endpoint on a large database, because it creates an N x N matrix.
8. Test/build tooling, currently lower priority because build is a no-op and Jest/lint are scoped away from generated data.

## Small Work Items

Each item should be small enough for a single chat/session.

- [x] Create audit notes for package scripts and likely OOM entrypoints.
- [x] Audit lineage service memory behavior.
- [x] Audit visualization service memory behavior.
- [x] Audit catalog/cache hydration memory behavior.
- [ ] Audit SSIS extraction/parsing memory behavior.
- [x] Audit generated data/report directories included by tests or build.
- [ ] Confirm exact OOM command from user, terminal history, logs, or reproduction plan.
- [x] Audit `scripts/rebuild-catalog-from-raw.mjs` memory behavior in detail.
- [x] Audit `src/services/confluenceExportService.js` memory behavior in detail.
- [x] Audit `src/services/catalogRuntimeService.js` rebuild/load memory behavior in detail.
- [x] Add one targeted guard or streaming/chunking improvement, then verify narrowly.
- [ ] Repeat one small fix at a time until the full OOM command is safe to retry.

## Verification Ladder

Fill this in during audit. Prefer moving from lowest-cost to highest-cost checks.

1. Static scan of suspected module:
2. Targeted unit or script check:
3. Narrow command with small fixture/subset:
4. Medium command over one package/database/domain:
5. Full command with memory observation:

Current proposed ladder:

1. Static scan and size measurement only. Completed first pass on 2026-06-04.
2. Confirm exact OOM command before selecting the first code fix.
3. If OOM is raw rebuild: create a small-fixture rebuild or single-SSIS-package path before full rebuild.
4. If OOM is Confluence export: test against a tiny copied markdown fixture before full export.
5. If OOM is runtime indexing: run `npm run catalog:index -- --concurrency 1` only after deciding the expected memory ceiling and whether rebuilding is safe.
6. Full command with memory observation only after one or more targeted fixes.

## Change History

### 2026-06-04

- Created root handoff log.
- Captured OOM signature from screenshot.
- Established small-slice repair strategy and audit checklist.
- Completed first static audit pass covering package scripts, data sizes, runtime index files, startup logs, and likely high-memory entrypoints.
- Optimization pass 1: updated `scripts/rebuild-catalog-from-raw.mjs` so `validateOutput` uses `parseMarkdownMetadataFile` instead of full `parseMarkdownFile`; replaced multiple final summary `.filter()` / `.reduce()` passes with one `summarizeRecordMetrics` accumulator.
- Verification for optimization pass 1: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed.
- Optimization pass 2: updated `applySsisBridgeInferences` to pre-index table candidates by database/schema and cache table tokenization, avoiding repeated all-table scans inside package/call/stage loops.
- Verification for optimization pass 2: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed.
- Optimization pass 3: removed the raw rebuild `markdowns = catalog.map(...)` retention point; each SSIS package markdown is now built, stored, and used to update target metadata inside the catalog loop.
- Verification for optimization pass 3: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed.
- Optimization pass 4: replaced Confluence export `AdmZip` creation with streaming `archiver`, and changed ZIP hashing to stream the completed ZIP file instead of `readFile(fullPath)` into memory.
- Verification for optimization pass 4: `node --check .\src\services\confluenceExportService.js` passed; import smoke `node -e "import('./src/services/confluenceExportService.js')..."` passed after switching to the installed `ZipArchive` named export.
- Optimization pass 5: changed Confluence export startup from `loadAllMarkdown` + `buildLineageGraph` to `loadRuntimeCatalog`, so export pages use compact runtime summaries and the prebuilt runtime lineage graph instead of retaining every markdown body.
- Verification for optimization pass 5: `node --check .\src\services\confluenceExportService.js` passed. Full export was intentionally not run yet.
- Optimization pass 6: changed `loadRuntimeCatalog` to load runtime JSON indexes in stages instead of one `Promise.all`, and clears temporary JSON arrays after building Maps before reading edge indexes.
- Verification for optimization pass 6: `node --check .\src\services\catalogRuntimeService.js` passed.
- Optimization pass 7: capped `buildDependencyMatrix` to a default maximum of 500 database objects, includes `truncated`, `objectCount`, `renderedObjectCount`, and `omittedObjects` metadata, and moved dependency lookup outside the inner matrix loop.
- Verification for optimization pass 7: `node --check .\src\services\visualizationService.js` passed; `node --experimental-vm-modules .\node_modules\jest\bin\jest.js --runInBand tests/unit/discovery.test.js --coverage=false` passed with 61 tests. `npm test -- --runInBand tests/unit/discovery.test.js` also had all tests pass but exited 1 because the global coverage threshold is still enforced for a single-file run.
- Optimization pass 8: capped `buildImpactVisualization` rendered objects per impact level while preserving full impact counts and adding truncation metadata.
- Verification for optimization pass 8: `node --check .\src\services\visualizationService.js` passed; `node --experimental-vm-modules .\node_modules\jest\bin\jest.js --runInBand tests/unit/discovery.test.js --coverage=false` passed with 61 tests.
- Optimization pass 9: changed runtime index generation to stream large JSON array files for summary, edges, and columns instead of building one large `JSON.stringify` payload per file; also clears temporary object/edge/column arrays after each staged write.
- Verification for optimization pass 9: `node --check .\src\services\catalogRuntimeService.js` passed; existing runtime load smoke returned `{"objects":9856,"edges":23332,"graph":9856,"mode":"summary"}` without rebuilding.
- Optimization pass 10: added SSIS markdown lookup indexes for package edges and package XML metadata, then reused those indexes during incremental package markdown generation.
- Verification for optimization pass 10: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed.
- Final import smoke for this batch: `catalogRuntimeService.js`, `confluenceExportService.js`, `visualizationService.js`, and `scripts/rebuild-catalog-from-raw.mjs` all imported successfully with `node -e "import(...)"`.
- Reliability follow-up: audited whether optimization pass 10 could reduce edge detection confidence. Tightened `indexedSsisEdges` so a lookup miss falls back to the original full edge scan, and moved package target updates back after external/endpoint records are added while retaining only small pending update records. Verification: `node --check .\scripts\rebuild-catalog-from-raw.mjs` and import smoke passed.
- Optimization pass 11: changed Confluence export object-index JSON writing to stream array chunks for both `attachments/catalog-object-index.json` and the copy embedded in `lineage-catalog.zip`; this removes the remaining full `JSON.stringify(objectRows/objectIndex)` allocation in that path.
- Verification for optimization pass 11: `node --check .\src\services\confluenceExportService.js` passed; import smoke `node -e "import('./src/services/confluenceExportService.js')..."` passed.
- Optimization pass 12: changed Confluence shard definition building so shard contexts are used for byte estimates but not retained on every shard entry; contexts are rebuilt at page render time through the existing fallback.
- Verification for optimization pass 12: `node --check .\src\services\confluenceExportService.js` passed; import smoke passed.
- Optimization pass 13: changed SSIS package markdown generation to summarize reads/writes/calls and lineage-quality counts in one pass over package edges instead of multiple `.filter()`/`.map()` passes.
- Verification for optimization pass 13: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke passed.
- Optimization pass 14: changed `buildSsisSummary` to compute SSIS lineage-quality counts in one pass over `lineageEdges` instead of three full-array filters.
- Verification for optimization pass 14: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke passed.
- Optimization pass 15: changed `buildSsisSqlEndpointRecords` to iterate `records.values()` directly instead of first materializing a filtered `packageRecords` array.
- Verification for optimization pass 15: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke passed.
- Optimization pass 16: changed `resolveLineageCorpus` in `src/services/lineageResolver.js` to use manifest-aware `getMarkdownFiles` and frontmatter-only `parseMarkdownMetadataFile` instead of its own recursive walker plus full markdown-body parsing.
- Reliability evidence for optimization pass 16: edge confidence should not go down because resolver matching uses frontmatter metadata fields (`id`, aliases, dependencies, `reads_from`, `writes_to`, `calls`, `created_by`, `used_by`, and lineage status fields), not markdown body text. `getMarkdownFiles` preserves recursive discovery when no catalog manifest exists and aligns resolver scans with manifest-backed catalog selection when one does exist.
- Verification for optimization pass 16: `node --check .\src\services\lineageResolver.js` passed; import smoke `node -e "import('./src/services/lineageResolver.js')..."` printed `lineage resolver import ok`.
- Optimization pass 17: changed `resolveLineageCorpus` trace logging to flush batches of 1,000 trace lines during processing instead of retaining every trace string and building one large joined string at the end.
- Reliability evidence for optimization pass 17: this only changes when trace lines are written to `data/logs/edge_resolution_trace.log`; it does not alter reference resolution, edge matching, metadata updates, or lineage status logic.
- Verification for optimization pass 17: `node --check .\src\services\lineageResolver.js` passed; import smoke `node -e "import('./src/services/lineageResolver.js')..."` printed `lineage resolver import ok`.
- Optimization pass 18: changed `loadExistingSsisCatalog` in `scripts/rebuild-catalog-from-raw.mjs` to read only YAML frontmatter from existing SSIS package markdown identity hints instead of reading full markdown bodies.
- Reliability evidence for optimization pass 18: this keeps the script's existing loose local `parseMarkdownFileContent` behavior instead of switching to stricter catalog validation, so malformed-but-useful historical package hints are still treated the same while reducing body-read memory.
- Verification for optimization pass 18: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke `node -e "import('./scripts/rebuild-catalog-from-raw.mjs')..."` printed `raw rebuild import ok`.
- Optimization pass 19: lowered the default shared markdown loader/validator concurrency in `src/services/markdownService.js` from 64 to 16 concurrent reads while preserving the `MARKDOWN_LOAD_CONCURRENCY` environment override.
- Reliability evidence for optimization pass 19: this only changes read parallelism; parsing, validation, catalog manifest handling, and returned metadata are unchanged. It reduces in-flight markdown body/frontmatter reads if any path still uses `loadAllMarkdown` or `validateMarkdownCatalog` over a large corpus.
- Verification for optimization pass 19: `node --check .\src\services\markdownService.js` passed; import smoke printed `markdown service import ok`; focused test `node --experimental-vm-modules .\node_modules\jest\bin\jest.js --runInBand tests/unit/markdown.test.js --coverage=false` passed 25/25 tests.
- Optimization pass 20: changed runtime catalog index generation in `src/services/catalogRuntimeService.js` to compact parsed summary objects in place and build the object map without `objects.filter(Boolean)` plus `compactObjects.map(...)` temporary arrays.
- Reliability evidence for optimization pass 20: this preserves the same object ordering and summary content while reducing temporary allocations before typed edge generation.
- Verification for optimization pass 20: `node --check .\src\services\catalogRuntimeService.js` passed; import smoke printed `catalog runtime import ok`; runtime load smoke returned `{"objects":9856,"edges":23332,"graph":9856,"mode":"summary"}`.
- Optimization pass 21: changed runtime column index generation in `src/services/catalogRuntimeService.js` to append column records directly instead of creating a per-object `buildColumnRecords(metadata)` array and spreading it into the global column list.
- Reliability evidence for optimization pass 21: column record fields and ordering remain the same; the change removes temporary per-object column arrays only.
- Verification for optimization pass 21: `node --check .\src\services\catalogRuntimeService.js` passed; import smoke printed `catalog runtime import ok`; runtime load smoke returned `{"objects":9856,"edges":23332,"graph":9856,"mode":"summary"}`.
- Optimization pass 22: changed `applySsisBridgeInferences` in `scripts/rebuild-catalog-from-raw.mjs` to select staging writes and the best bridge target in loops instead of creating map/filter/sort temporary arrays for each package/procedure/stage combination.
- Reliability evidence for optimization pass 22: staging detection uses the same database predicate, bridge target scoring uses the same base score, role penalty, `baseScore >= 4` threshold, and table-name tie break as the previous sorted candidate array.
- Verification for optimization pass 22: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke `node -e "import('./scripts/rebuild-catalog-from-raw.mjs')..."` printed `raw rebuild import ok`.
- Optimization pass 23: changed `buildColumnUsageMetadata` in `scripts/rebuild-catalog-from-raw.mjs` to collect table and view column-usage records in one pass instead of materializing all SQL objects and then filtering into separate arrays.
- Reliability evidence for optimization pass 23: the resulting `tables` and `views` arrays use the same `sqlRecordForColumnUsage` projection and include the same record types as before.
- Verification for optimization pass 23: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Optimization pass 24: changed rebuild report metric aggregation in `scripts/rebuild-catalog-from-raw.mjs` to compute unresolved facts, direct edge refs, and column-lineage record totals in one loop instead of three separate `recordList.reduce(...)` passes.
- Reliability evidence for optimization pass 24: the same helper functions (`unresolvedFactCount`, `uniqueEdgeCount`, and `countArray`) are used for each total, only the iteration count changed.
- Verification for optimization pass 24: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Optimization pass 25: changed `summarizeConfidence` in `scripts/rebuild-catalog-from-raw.mjs` to keep sum/count accumulators for five confidence averages instead of retaining five score arrays.
- Reliability evidence for optimization pass 25: finite-number handling and `score(...)` rounding are preserved, so average confidence values should remain equivalent.
- Verification for optimization pass 25: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Optimization pass 26: changed `uniqueEdgeCount` in `scripts/rebuild-catalog-from-raw.mjs` to add edge references directly into a `Set` instead of building a combined edge-ref array, mapping, filtering, and then constructing the `Set`.
- Reliability evidence for optimization pass 26: the same edge fields are counted and the same `String(...).trim()` normalization is used before dedupe.
- Verification for optimization pass 26: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Optimization pass 27: changed `averageConfidence` in `scripts/rebuild-catalog-from-raw.mjs` to compute sum/count directly instead of mapping/filtering a temporary numeric array before reducing.
- Reliability evidence for optimization pass 27: the helper still treats missing confidence as `1`, skips non-finite numeric values, and returns `1` when no finite confidence values exist.
- Verification for optimization pass 27: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Optimization pass 28: changed the generic `average` helper in `scripts/rebuild-catalog-from-raw.mjs` to compute sum/count directly instead of creating a filtered numeric array and then reducing it.
- Reliability evidence for optimization pass 28: non-finite values are still skipped, empty inputs still return `0`, and non-empty averages still use the same `score(...)` rounding.
- Verification for optimization pass 28: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Optimization pass 29: changed `uniqueStructuredRecords` in `scripts/rebuild-catalog-from-raw.mjs` to build its dedupe key directly instead of creating a key-part array, mapping to lowercase, and joining for every structured record.
- Reliability evidence for optimization pass 29: the dedupe key still uses the same fields in the same order with the same lowercase string normalization.
- Verification for optimization pass 29: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Optimization pass 30: changed SSIS markdown index construction in `scripts/rebuild-catalog-from-raw.mjs` to push lowercased lookup keys directly instead of calling `lowerSsisLookupKeys([...])` for every lineage edge and XML metadata row.
- Reliability evidence for optimization pass 30: edge index values remain arrays of matching edges, while XML metadata index values still preserve first-match object semantics; the same raw key fields are indexed with the same lowercase normalization.
- Verification for optimization pass 30: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Optimization pass 31: changed `buildSsisMarkdown` fallback lookup checks in `scripts/rebuild-catalog-from-raw.mjs` to use direct lowercase key/set comparisons instead of `lowerSsisLookupKeys([...])` array creation inside XML metadata and lineage edge fallback scans.
- Reliability evidence for optimization pass 31: package lookup keys, XML metadata fallback fields, and lineage edge fallback fields are unchanged; the same lowercase normalization and non-empty key filtering are preserved.
- Verification for optimization pass 31: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Optimization pass 32: changed `chooseIndexedReference` in `scripts/rebuild-catalog-from-raw.mjs` to select the best candidate in one pass instead of creating an array, mapping scored objects, sorting, and taking the first candidate.
- Reliability evidence for optimization pass 32: server/database scoring and the lexicographic ID tie-break are unchanged, so selected references should remain equivalent.
- Verification for optimization pass 32: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Optimization pass 33: changed `normalizeReferenceList` in `scripts/rebuild-catalog-from-raw.mjs` to qualify references in a direct loop instead of `filter(...).map(...).filter(...)` before final dedupe.
- Reliability evidence for optimization pass 33: the same pre-qualification direct-reference filter, post-qualification direct-reference filter, and final `unique(...)` dedupe are preserved.
- Verification for optimization pass 33: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Optimization pass 34: changed `comparePackageConfidence` in `scripts/rebuild-catalog-from-raw.mjs` to collect only package confidence regressions in one loop instead of `Object.values(...).map(...).filter(...).filter(...)`.
- Reliability evidence for optimization pass 34: previous-score validation, delta calculation, negative-delta filtering, sort order, and top-25 limit are unchanged.
- Verification for optimization pass 34: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Optimization pass 35: changed `summarizeSources` in `scripts/rebuild-catalog-from-raw.mjs` to build source summary rows directly from grouped values instead of `Array.from(...).map(...)`.
- Reliability evidence for optimization pass 35: per-source counts, confidence averaging, unresolved fact totals, and final source-key sort are unchanged.
- Verification for optimization pass 35: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Optimization pass 36: changed `objectConfidenceRows` in `scripts/rebuild-catalog-from-raw.mjs` to collect report rows in a direct loop instead of `recordList.map(...)` before sorting.
- Reliability evidence for optimization pass 36: row fields, missing-confidence handling, unresolved-fact counts, and the existing score/unresolved-fact sort comparator are unchanged.
- Verification for optimization pass 36: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Optimization pass 37: changed rebuild gate validation in `scripts/rebuild-catalog-from-raw.mjs` to split failed checks and warning checks in one loop instead of filtering the checks array twice.
- Reliability evidence for optimization pass 37: passed checks are still excluded, `severity === 'fail'` still drives failures, non-fail failed checks still become warnings, and status precedence is unchanged.
- Verification for optimization pass 37: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Optimization pass 38: changed rebuild report assembly in `scripts/rebuild-catalog-from-raw.mjs` to build `low_or_needs_review_top`, `top_unresolved_objects`, previous source keys, and `new_data_sources` with direct loops instead of several `map`/`filter` chains.
- Reliability evidence for optimization pass 38: low/needs-review rows still follow the pre-sorted confidence row order and top unresolved rows still sort by descending unresolved facts with the same 50-row cap; new data source detection still compares source keys against the previous report baseline.
- Verification for optimization pass 38: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Optimization pass 39: changed `buildSsisSqlEndpointRecords` in `scripts/rebuild-catalog-from-raw.mjs` to yield inferred endpoint records directly instead of returning `Array.from(endpoints.values()).map(...)`.
- Reliability evidence for optimization pass 39: endpoint detection, dedupe map contents, frontmatter fields, body text, and caller iteration order over `endpoints.values()` are unchanged.
- Verification for optimization pass 39: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Optimization pass 40: changed `chooseExistingPackageCatalogRow` in `scripts/rebuild-catalog-from-raw.mjs` to select the best existing SSIS package hint in one loop instead of mapping scored candidates and sorting.
- Reliability evidence for optimization pass 40: package hint scoring is unchanged and tied scores still keep the earliest candidate, matching the old stable-sort behavior.
- Verification for optimization pass 40: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Optimization pass 41: changed `buildSsisSummary` in `scripts/rebuild-catalog-from-raw.mjs` to build the 500-edge markdown preview with a bounded loop instead of `lineageEdges.slice(0, 500).map(...)`.
- Reliability evidence for optimization pass 41: the preview still includes the same first 500 lineage edges with the same text formatting; only the temporary slice/map allocation was removed.
- Verification for optimization pass 41: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Optimization pass 42: changed `lineageTokens` in `scripts/rebuild-catalog-from-raw.mjs` to reuse a module-level stop-word `Set` and populate the token `Set` directly instead of building map/filter arrays for each tokenization call.
- Reliability evidence for optimization pass 42: camel-case splitting, lowercasing, plural trimming, minimum token length, stop-word filtering, and final `Set` dedupe semantics are unchanged.
- Verification for optimization pass 42: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Optimization pass 43: changed `renderRebuildReportMarkdown` in `scripts/rebuild-catalog-from-raw.mjs` to render top package regressions, gate issues, and new data sources with bounded/direct loops instead of `slice(...)` copies and a spread-merged gate issue array.
- Reliability evidence for optimization pass 43: markdown report content ordering and caps are preserved: package regressions still render the first 10, gate failures still render before warnings, and new data sources still render the first 25.
- Verification for optimization pass 43: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Optimization pass 44: changed `columnsFromSsisComponent` in `scripts/rebuild-catalog-from-raw.mjs` to append SSIS external component columns from source arrays in priority order instead of first spreading them into a temporary `candidates` array.
- Reliability evidence for optimization pass 44: destination components still prefer external metadata, then input, then output columns; source components still prefer output, then external metadata, then input columns; column dedupe, ordinal assignment, and metadata fields are unchanged.
- Verification for optimization pass 44: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Optimization pass 45: changed `resolveUniqueCandidateReference` in `scripts/rebuild-catalog-from-raw.mjs` to dedupe and detect the exactly-one matching candidate in one pass instead of calling `unique(...)` and then filtering matches.
- Reliability evidence for optimization pass 45: candidate trimming, case-insensitive dedupe, `referenceMatchesCandidate(...)` matching, and the "return blank when zero or multiple candidates match" rule are preserved.
- Verification for optimization pass 45: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Optimization pass 46: changed the schema-filtered branch of `createBridgeTableCandidateResolver` in `scripts/rebuild-catalog-from-raw.mjs` to collect candidates with a direct loop instead of `dbTables.filter(...)`.
- Reliability evidence for optimization pass 46: the cached candidate set still includes tables whose schema is blank or exactly matches the requested schema, and the no-schema path still reuses the full database table list.
- Verification for optimization pass 46: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Confidence checkpoint: read the current generated `data/markdown/rebuild-report.json` without running a rebuild. Report generated `2026-06-03T15:39:26.827Z`; gate status `passed`; loaded objects `9856`; invalid objects `0`; scored objects `9855`; missing confidence objects `0`; average overall confidence `0.879`; average edge correctness `0.996`; average coverage `0.839`; low/needs-review objects `210` (`0.021` ratio); package confidence regressions `0`.
- Edge-count checkpoint: current report metrics show `22533` SSIS edges, `23750` direct edge refs, and `15880` column lineage records. Current runtime manifest generated `2026-06-03T21:40:19.246Z` reports `9856` objects, `23332` runtime edges, and `215690` columns.
- Confidence checkpoint caveat: these metrics describe the current generated catalog before a post-optimization full rebuild. They support that current edge confidence is high, but the final no-regression proof still requires a controlled rebuild and metric comparison.
- Verification pass 47: added a bounded no-write raw rebuild path to `scripts/rebuild-catalog-from-raw.mjs`: `--dry-run` skips backup, markdown writes, catalog manifest writes, and rebuild report writes; `--ssis-limit=N` or `REBUILD_SSIS_LIMIT=N` limits the number of SSIS XML files read; dry-run validation checks in-memory records and summary output includes `memoryUsageMb`.
- Verification for pass 47: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Bounded smoke result for pass 47: `node .\scripts\rebuild-catalog-from-raw.mjs --dry-run --ssis-limit=2` exited 0 and wrote no files (`filesWritten: 0`, `manifestFiles: 0`, rebuild report `written: false`). It discovered `1803` SSIS XML files and processed `2`; produced `7717` in-memory records, `25` SSIS edges, `0` invalid objects, `137` validated column lineage records, `45` unresolved/rejected non-promoted column lineage records, and `2` inferred SSIS SQL endpoint records. Final memory summary: RSS `1604` MB, heap total `1511` MB, heap used `1394` MB.
- Bounded smoke caveat for pass 47: gate status was `warning`, expected for a partial dry-run. One existing malformed raw SQL markdown file was skipped due invalid YAML: `data/analysis/raw/sqlserver/servers/unknown/databases/StagingDB/tables/dbo__[etl].zzzzz[entity_other_active_lkUp.md`.
- Verification pass 48: added phase-level `memoryCheckpointsMb` to dry-run/debug summary output in `scripts/rebuild-catalog-from-raw.mjs`.
- Verification for pass 48: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Bounded smoke result for pass 48: reran `node .\scripts\rebuild-catalog-from-raw.mjs --dry-run --ssis-limit=2`; exit `0`; wrote no files; produced `25` SSIS edges and `0` invalid objects. Key heap checkpoints: start `21` MB; existing SSIS catalog loaded `141` MB; SQL raw loaded `812` MB; SQL lineage rewritten `1299` MB; SSIS rebuilt `1301` MB; column lineage resolved `853` MB; final heap used `877` MB. This indicates the current dry-run memory peak is dominated by raw SQL loading and SQL lineage rewrite, not the two-file SSIS sample.
- Optimization pass 49: after SQL record frontmatter is built in `rewriteSqlLineage`, delete temporary `record.metadata` and `record.definition` fields so later phases do not need to keep duplicated YAML metadata and extracted SQL definition strings alive.
- Reliability evidence for optimization pass 49: later phases use `record.frontmatter`, identity fields, and `record.body` for output; `record.metadata` and `record.definition` are only used while rewriting SQL lineage and extracting column usage.
- Verification for pass 49: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Bounded smoke result for pass 49: reran `node .\scripts\rebuild-catalog-from-raw.mjs --dry-run --ssis-limit=2`; exit `0`; wrote no files; produced `25` SSIS edges and `0` invalid objects. Key heap checkpoints: SQL raw loaded `787` MB; SQL lineage rewritten `1285` MB; SSIS rebuilt `1287` MB; column lineage resolved `1419` MB; final heap used `1405` MB. This did not reduce the observed dry-run peak; next structural target is retaining raw SQL markdown bodies through later phases.
- Optimization pass 50: release SQL `record.body` after SQL lineage rewrite, while preserving full rebuild output by lazily re-reading the original markdown body from `record.sourcePath` inside `writeRecords`.
- Reliability evidence for optimization pass 50: SQL output still renders new frontmatter plus the original markdown body; dry-run does not write files; package/sidecar/generated records keep their in-memory bodies because they have no raw source file body to re-read.
- Verification for pass 50: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Bounded smoke result for pass 50: reran `node .\scripts\rebuild-catalog-from-raw.mjs --dry-run --ssis-limit=2`; exit `0`; wrote no files; produced `25` SSIS edges and `0` invalid objects. Key heap checkpoints: SQL raw loaded `750` MB; SQL lineage rewritten `1215` MB; SSIS rebuilt `1231` MB; column lineage resolved `1310` MB; final heap used `1334` MB. Compared with pass 49, the same bounded run dropped roughly `70` MB at SQL rewrite and roughly `71` MB final heap.
- Optimization pass 51: stop storing full SQL markdown bodies in `loadSqlRawObjects`; instead, extract `definition` and fallback markdown columns during load, store only those derived fields plus `sourcePath`, and continue lazy body re-read during full writes.
- Reliability evidence for optimization pass 51: SQL lineage still uses the same extracted SQL definition, fallback column inventory still comes from the same `## Columns` body table when frontmatter columns are absent, and full writes still re-read the original markdown body from `sourcePath`.
- Verification for pass 51: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Bounded smoke result for pass 51: reran `node .\scripts\rebuild-catalog-from-raw.mjs --dry-run --ssis-limit=2`; exit `0`; wrote no files; produced `25` SSIS edges and `0` invalid objects. Key heap checkpoints: SQL raw loaded `727` MB; SQL lineage rewritten `1205` MB; SSIS rebuilt `1220` MB; column lineage resolved `1299` MB; final heap used `1324` MB. Compared with pass 50, final heap dropped another `10` MB and SQL raw load dropped `23` MB.
- Optimization pass 52: after SQL lineage rewrite, also release temporary `record.markdownColumns` and `record.columns`, and clear the temporary `columnUsageMetadata.tables` / `columnUsageMetadata.views` arrays after they have been consumed.
- Reliability evidence for optimization pass 52: later phases use `record.frontmatter.columns` for persisted column inventory and column lineage resolution; `record.columns`, `record.markdownColumns`, and the `columnUsageMetadata` wrapper arrays are only temporary inputs for SQL rewrite and column usage extraction.
- Verification for pass 52: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Bounded smoke result for pass 52: reran `node .\scripts\rebuild-catalog-from-raw.mjs --dry-run --ssis-limit=2`; exit `0`; wrote no files; produced `25` SSIS edges and `0` invalid objects. Key heap checkpoints: SQL raw loaded `872` MB; SQL lineage rewritten `1004` MB; SSIS rebuilt `1010` MB; column lineage resolved `1089` MB; final heap used `1113` MB. Compared with pass 51, the raw-load checkpoint was higher by `145` MB, but retained heap after SQL rewrite dropped by about `201` MB and final heap dropped by about `211` MB in this bounded run.
- Optimization pass 53: changed SQL column-usage merge/dedupe to stream existing and generated records through the same structured-record key instead of building three spread-combined temporary arrays for `column_usage`, `unresolved_column_usage`, and `column_risk_flags`.
- Reliability evidence for optimization pass 53: dedupe key fields and ordering are preserved; existing records are still considered before generated records, matching the old spread-array order.
- Verification for pass 53: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Bounded smoke result for pass 53: reran `node .\scripts\rebuild-catalog-from-raw.mjs --dry-run --ssis-limit=2`; exit `0`; wrote no files; produced the same `25` SSIS edges, `55085` column usage records, `25288` unresolved column usage records, `1537` column risk flags, `137` validated column lineage records, and `0` invalid objects. Key heap checkpoints: SQL raw loaded `872` MB; SQL lineage rewritten `1097` MB; SSIS rebuilt `1105` MB; column lineage resolved `1228` MB; final heap used `1214` MB. This pass removes avoidable transient merge arrays, but did not prove a checkpoint memory reduction in this single bounded run; RSS ended lower than pass 52 (`1454` MB vs `1504` MB), while final heap was higher (`1214` MB vs `1113` MB), so treat the memory delta as run-to-run variance until repeated.
- Optimization pass 54: changed `applyForwardSqlEdges` to append SQL forward-edge references with a case-insensitive in-place helper instead of rebuilding `created_by`, `depends_on`, and `used_by` arrays with `unique([...(existing || []), record.id])` for every edge.
- Reliability evidence for optimization pass 54: these arrays are initialized during SQL rewrite before forward edges are applied; the helper preserves the same trim/lowercase duplicate check and appends the same `record.id` values without changing write/read edge discovery.
- Verification for pass 54: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Bounded smoke result for pass 54: reran `node .\scripts\rebuild-catalog-from-raw.mjs --dry-run --ssis-limit=2`; exit `0`; wrote no files; produced the same `25` SSIS edges, `55085` column usage records, `25288` unresolved column usage records, `1537` column risk flags, `137` validated column lineage records, and `0` invalid objects. Key heap checkpoints: SQL raw loaded `871` MB; SQL lineage rewritten `1067` MB; SSIS rebuilt `1132` MB; column lineage resolved `1210` MB; final heap used `1234` MB. Compared with pass 53, the SQL rewrite checkpoint dropped by about `30` MB and RSS was effectively flat (`1453` MB vs `1454` MB), but final heap was `20` MB higher, so keep treating final-memory movement as noisy until repeated or measured on a larger slice.
- Optimization pass 55: changed `ensureSsisSqlEndpoint` to append endpoint `packages`, `usedBy`, and `createdVia` references with the same case-insensitive in-place helper instead of rebuilding those arrays with `unique([...existing, packageIdValue])` for each observed mapping.
- Reliability evidence for optimization pass 55: endpoint package/source/destination references keep the same trim/lowercase duplicate rule and the same first-seen order; this does not change SSIS edge discovery, mapping validation, or endpoint inference rules.
- Verification for pass 55: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Bounded smoke result for pass 55: reran `node .\scripts\rebuild-catalog-from-raw.mjs --dry-run --ssis-limit=2`; exit `0`; wrote no files; produced the same `25` SSIS edges, `55085` column usage records, `25288` unresolved column usage records, `1537` column risk flags, `137` validated column lineage records, `2` inferred SSIS SQL endpoint records, and `0` invalid objects. Key heap checkpoints: SQL raw loaded `868` MB; SQL lineage rewritten `1128` MB; SSIS rebuilt `1137` MB; SSIS bridge inferences applied `741` MB; column lineage resolved `887` MB; final heap used `912` MB. Compared with pass 54, final heap dropped by about `322` MB and RSS dropped by about `81` MB in this bounded run, though the SQL rewrite checkpoint itself was higher, so record this as a good late-phase memory result with normal checkpoint variance.
- Optimization pass 56: changed `applySsisBridgeInferences` to append inferred bridge `created_by`, `created_via`, `depends_on`, and staging `used_by` references with the case-insensitive in-place helper instead of rebuilding arrays with `unique([...existing, ref])` for each inferred bridge.
- Reliability evidence for optimization pass 56: bridge target selection, scoring, thresholds, and inference count logic are unchanged; only the duplicate-safe append path changed after an inference is already accepted. The bounded sample produced `0` inferred bridges both before and after this pass.
- Verification for pass 56: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Bounded smoke result for pass 56: reran `node .\scripts\rebuild-catalog-from-raw.mjs --dry-run --ssis-limit=2`; exit `0`; wrote no files; produced the same `25` SSIS edges, `55085` column usage records, `25288` unresolved column usage records, `1537` column risk flags, `137` validated column lineage records, `2` inferred SSIS SQL endpoint records, `0` inferred SSIS bridges, and `0` invalid objects. Key heap checkpoints: SQL raw loaded `956` MB; SQL lineage rewritten `1241` MB; SSIS rebuilt `743` MB; SSIS bridge inferences applied `744` MB; column lineage resolved `889` MB; final heap used `913` MB. Compared with pass 55, final heap was effectively flat (`913` MB vs `912` MB) while raw SQL/rewrite checkpoints were higher, so this is mainly a future full-run allocation cleanup rather than a measured bounded-sample memory win.
- Optimization pass 57: added a small `mergeUniqueTextGroups` helper and used it for two remaining spread-combined reference merges: SQL `depends_on` from `reads_from + calls`, and SSIS endpoint source candidates from `reads_from + depends_on`.
- Reliability evidence for optimization pass 57: both replacements preserve the existing trim/lowercase dedupe rule and first-seen order; the inputs were already normalized reference arrays before this merge step.
- Verification for pass 57: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Bounded smoke result for pass 57: reran `node .\scripts\rebuild-catalog-from-raw.mjs --dry-run --ssis-limit=2`; exit `0`; wrote no files; produced the same `25` SSIS edges, `55085` column usage records, `25288` unresolved column usage records, `1537` column risk flags, `137` validated column lineage records, `2` inferred SSIS SQL endpoint records, `0` inferred SSIS bridges, and `0` invalid objects. Key heap checkpoints: SQL raw loaded `868` MB; SQL lineage rewritten `1350` MB; SSIS rebuilt `742` MB; SSIS bridge inferences applied `743` MB; column lineage resolved `889` MB; final heap used `913` MB. Compared with pass 56, final heap was flat (`913` MB), while SQL rewrite and RSS were higher in this single run; treat this as transient allocation cleanup rather than a proven memory reduction.
- Optimization pass 58: changed the pending SSIS package target update path to append `created_via` with the case-insensitive in-place helper instead of rebuilding the array with `unique([...existing, packageId])`.
- Reliability evidence for optimization pass 58: the package target update still runs only after an SSIS package already writes to a known table; the duplicate rule and first-seen order are preserved. A follow-up search found no remaining `unique([...` spread-array merge patterns in `scripts/rebuild-catalog-from-raw.mjs`.
- Verification for pass 58: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Bounded smoke result for pass 58: reran `node .\scripts\rebuild-catalog-from-raw.mjs --dry-run --ssis-limit=2`; exit `0`; wrote no files; produced the same `25` SSIS edges, `55085` column usage records, `25288` unresolved column usage records, `1537` column risk flags, `137` validated column lineage records, `2` inferred SSIS SQL endpoint records, `0` inferred SSIS bridges, and `0` invalid objects. Key heap checkpoints: SQL raw loaded `729` MB; SQL lineage rewritten `1257` MB; SSIS rebuilt `1260` MB; SSIS bridge inferences applied `1261` MB; column lineage resolved `1339` MB; final heap used `1363` MB. Compared with pass 57, counts stayed stable but final heap and RSS were worse in this run; treat this as completing a small allocation-cleanup pattern, not as a measured bounded-sample memory win.
- Optimization pass 59: stopped pre-deduping SSIS endpoint `targetCandidates` with `unique(...)`; `buildSsisSqlEndpointRecords` now passes the existing `writes_to` array directly to `resolveUniqueCandidateReference`.
- Reliability evidence for optimization pass 59: `resolveUniqueCandidateReference` already trims, lowercases, dedupes, and enforces the "exactly one matching candidate" rule internally, so pre-deduping `writes_to` was redundant.
- Verification for pass 59: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Bounded smoke result for pass 59: reran `node .\scripts\rebuild-catalog-from-raw.mjs --dry-run --ssis-limit=2`; exit `0`; wrote no files; produced the same `25` SSIS edges, `55085` column usage records, `25288` unresolved column usage records, `1537` column risk flags, `137` validated column lineage records, `2` inferred SSIS SQL endpoint records, `0` inferred SSIS bridges, and `0` invalid objects. Key heap checkpoints: SQL raw loaded `789` MB; SQL lineage rewritten `1275` MB; SSIS rebuilt `1287` MB; SSIS bridge inferences applied `1288` MB; column lineage resolved `1409` MB; final heap used `1396` MB. Compared with pass 58, counts stayed stable but final heap and RSS were again worse in this single run; treat this as a redundant allocation cleanup, not a measured memory reduction.
- Optimization pass 60: changed `normalizeColumnInventory` to build normalized column records in one direct loop instead of `sourceColumns.filter(...).map(...)`, avoiding a temporary filtered array across the large SQL column inventory.
- Reliability evidence for optimization pass 60: invalid/nameless source columns are still skipped, output order is unchanged, and the fallback ordinal still uses the post-filter normalized position (`normalized.length + 1`), matching the old filtered-array map index behavior.
- Verification for pass 60: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Bounded smoke result for pass 60: reran `node .\scripts\rebuild-catalog-from-raw.mjs --dry-run --ssis-limit=2`; exit `0`; wrote no files; produced the same `199314` column inventory records, `25` SSIS edges, `55085` column usage records, `25288` unresolved column usage records, `1537` column risk flags, `137` validated column lineage records, `2` inferred SSIS SQL endpoint records, `0` inferred SSIS bridges, and `0` invalid objects. Key heap checkpoints: SQL raw loaded `770` MB; SQL lineage rewritten `1227` MB; SSIS rebuilt `1291` MB; SSIS bridge inferences applied `1292` MB; column lineage resolved `1369` MB; final heap used `1394` MB. Compared with pass 59, final heap was nearly flat (`1394` MB vs `1396` MB), while SQL raw, SQL rewrite, and column lineage checkpoints were modestly lower in this bounded run.
- Optimization pass 61 small batch: added `splitDotSegments` and replaced five `split('.').filter(Boolean)` reference parsing call sites in SQL reference splitting, SQL ID parsing, SSIS reference normalization, and candidate-reference matching.
- Reliability evidence for optimization pass 61: the helper preserves the old behavior of skipping empty dot segments while leaving non-empty segment text unchanged. A follow-up search found no remaining `split('.').filter(Boolean)` patterns in `scripts/rebuild-catalog-from-raw.mjs`.
- Verification for pass 61: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Bounded smoke result for pass 61: reran `node .\scripts\rebuild-catalog-from-raw.mjs --dry-run --ssis-limit=2`; exit `0`; wrote no files; produced the same `199314` column inventory records, `25` SSIS edges, `55085` column usage records, `25288` unresolved column usage records, `1537` column risk flags, `137` validated column lineage records, `2` inferred SSIS SQL endpoint records, `0` inferred SSIS bridges, and `0` invalid objects. Key heap checkpoints: SQL raw loaded `914` MB; SQL lineage rewritten `1249` MB; SSIS rebuilt `1255` MB; SSIS bridge inferences applied `743` MB; column lineage resolved `888` MB; final heap used `912` MB. Compared with pass 60, final heap dropped by about `482` MB and RSS dropped by about `204` MB in this bounded run, while SQL raw/rewrite checkpoints were higher; treat this as a useful measured batch result with normal checkpoint variance.
- Rejected small-batch candidate after pass 61: converted markdown `## Columns` table parsing and `splitMarkdownTableRow` from `map/filter/slice` chains to direct loops, but reverted it after measurement. Verification passed and counts stayed stable, but two repeated bounded dry-runs had worse memory (`1907` MB final heap, then `1433` MB final heap), so the batch did not earn its place.
- Optimization pass 62 small batch: added direct dot-segment assembly helpers (`appendDotSegment`, `joinDotSegments`, `tailDotSegmentsMatch`) and replaced remaining SQL/reference `slice(...).join('.')` and array-filter join patterns in `makeSqlId`, `qualifyReference`, `parseSqlId`, `normalizeSsisReference`, and candidate-reference matching.
- Reliability evidence for optimization pass 62: SQL and SSIS reference strings are assembled from the same non-empty segments as before, and candidate suffix checks still compare the same final two or three dot segments without changing target selection rules. A follow-up search found no remaining dot `slice().join('.')`, `candidateParts.slice`, or `[server, canonicalDatabase(...)]` patterns in `scripts/rebuild-catalog-from-raw.mjs`.
- Verification for pass 62: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Bounded smoke result for pass 62: reran `node .\scripts\rebuild-catalog-from-raw.mjs --dry-run --ssis-limit=2`; exit `0`; wrote no files; produced the same `199314` column inventory records, `25` SSIS edges, `55085` column usage records, `25288` unresolved column usage records, `1537` column risk flags, `137` validated column lineage records, `2` inferred SSIS SQL endpoint records, `0` inferred SSIS bridges, and `0` invalid objects. Key heap checkpoints: SQL raw loaded `847` MB; SQL lineage rewritten `1294` MB; SSIS rebuilt `743` MB; SSIS bridge inferences applied `744` MB; column lineage resolved `890` MB; final heap used `914` MB. Compared with pass 61, final heap was effectively flat (`914` MB vs `912` MB), while counts stayed stable and the rejected parser batch was not retained.
- Optimization pass 63 small batch: replaced the remaining fixed/reference string allocation patterns in the raw rebuild script: `memoryUsageMb` now builds its result object directly; `chooseIndexedReference` scores the first two dot segments without `id.split('.')`; `packageId` no longer allocates an array for fixed dot joins; SSIS filename inference now gets the first non-empty underscore segment without `split('_').filter(Boolean)`.
- Reliability evidence for optimization pass 63: reference scoring still compares the same first two dot segments against context server/database; `packageId` preserves fixed five-segment SSIS package ID shape; SSIS project fallback still selects the first non-empty underscore-delimited token. A follow-up search found no targeted old patterns: `id.split('.')`, `Object.entries(usage)`, `withoutExt.split('_').filter(Boolean)`, or `[server, 'SSISDB']`.
- Verification for pass 63: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`.
- Bounded smoke result for pass 63: reran `node .\scripts\rebuild-catalog-from-raw.mjs --dry-run --ssis-limit=2` twice because the first run had a high final heap. Both runs exited `0`, wrote no files, and produced the same `199314` column inventory records, `25` SSIS edges, `55085` column usage records, `25288` unresolved column usage records, `1537` column risk flags, `137` validated column lineage records, `2` inferred SSIS SQL endpoint records, `0` inferred SSIS bridges, and `0` invalid objects. First run final heap was `1366` MB; repeat final heap was `996` MB. Repeat key heap checkpoints: SQL raw loaded `870` MB; SQL lineage rewritten `829` MB; SSIS rebuilt `828` MB; SSIS bridge inferences applied `829` MB; column lineage resolved `972` MB; final heap used `996` MB. Treat this as kept, with observed GC/checkpoint variance explicitly recorded.
- Optimization pass 64 small batch: changed SSIS column-mapping sidecar generation to build sidecars in one loop, removing the intermediate `sidecarChunks` array and the final `sidecars.map(...)` reference-list pass. The obsolete `chunkArray` helper was removed.
- Reliability evidence for optimization pass 64: each sidecar still receives the same sorted mapping slice, same chunk number, same chunk count, and the package frontmatter still records the same sidecar IDs/record counts; only the extra retained chunk array and second sidecar-reference map were removed.
- Verification for pass 64: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`. A follow-up search found no `chunkArray`, `sidecarChunks`, or `sidecars.map(...)` patterns in `scripts/rebuild-catalog-from-raw.mjs`.
- Bounded smoke result for pass 64: reran `node .\scripts\rebuild-catalog-from-raw.mjs --dry-run --ssis-limit=2`; exit `0`; wrote no files; produced the same `199314` column inventory records, `25` SSIS edges, `4` SSIS column mapping objects, `235` SSIS column mappings, `137` validated column lineage records, `2` inferred SSIS SQL endpoint records, `0` inferred SSIS bridges, and `0` invalid objects. Key heap checkpoints: SQL raw loaded `972` MB; SQL lineage rewritten `1107` MB; SSIS rebuilt `1173` MB; SSIS bridge inferences applied `743` MB; column lineage resolved `888` MB; final heap used `913` MB. Compared with the pass 63 repeat run, final heap dropped by about `83` MB while SSIS sidecar/mapping counts stayed stable.
- Optimization pass 65 small batch: changed SSIS package edge summarization to dedupe `reads_from`, `writes_to`, and `calls` while appending instead of collecting duplicate refs and running three final `unique(...)` passes; also stopped copying `unresolvedSsisColumnMappings` when it is only passed through into package frontmatter.
- Reliability evidence for optimization pass 65: `pushUniqueText` uses the same trim/lowercase duplicate rule as `unique(...)`, preserving first-seen order for package refs; unresolved SSIS mappings are not mutated after assignment, so sharing the existing array preserves content.
- Verification for pass 65: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`. A follow-up search found no `readsFromRefs`, `writesToRefs`, `callRefs`, or copied `unresolvedSsisColumnMappings = [` patterns in `scripts/rebuild-catalog-from-raw.mjs`.
- Bounded smoke result for pass 65: reran `node .\scripts\rebuild-catalog-from-raw.mjs --dry-run --ssis-limit=2` twice because the first run had a high final heap. Both runs exited `0`, wrote no files, and produced the same `199314` column inventory records, `25` SSIS edges, `4` SSIS column mapping objects, `235` SSIS column mappings, `0` unresolved SSIS column mappings, `137` validated column lineage records, `2` inferred SSIS SQL endpoint records, `0` inferred SSIS bridges, and `0` invalid objects. First run final heap was `1374` MB; repeat final heap was `705` MB. Repeat key heap checkpoints: SQL raw loaded `858` MB; SQL lineage rewritten `1022` MB; SSIS rebuilt `1033` MB; SSIS bridge inferences applied `1034` MB; column lineage resolved `1111` MB; final heap used `705` MB. Treat this as kept, with observed GC/checkpoint variance explicitly recorded.
- Rejected small-batch candidate after pass 65: attempted to remove the `lookupKeys` array, per-lookup context object, and final `unique(normalized)` pass from SQL reference normalization. Verification passed and counts stayed stable, but two repeated bounded dry-runs both had high final heap (`1417` MB, then `1433` MB), so the batch was reverted.
- Rejected small-batch candidate after pass 65: attempted to sort SSIS column mappings in place and build the embedded mapping preview with a bounded loop instead of `[...ssisColumnMappings].sort(...)` plus `slice(...)`. Verification passed and counts stayed stable, but two repeated bounded dry-runs had high final heap (`1217` MB, then `1362` MB), so the batch was reverted.
- Verification/fix pass 66: increased dry-run scale beyond the 2-package sample. Initial `node .\scripts\rebuild-catalog-from-raw.mjs --dry-run --ssis-limit=100` exposed a latent SSIS markdown fallback bug: `hasLowerSsisLookupKey(...).some is not a function`. The 2-package sample never hit this fallback because indexed package lookups succeeded.
- Optimization/fix pass 66: fixed the SSIS markdown fallback paths to use the existing boolean `hasLowerSsisLookupKey(...)` helper directly for XML metadata and lineage edge matching, and removed the now-unused `matchesLowerSsisLookupKey` helper / `packageKey` variable.
- Reliability evidence for pass 66: the fallback now applies the same package-key set used by the indexed lookup path. It only changes behavior when the index misses and previously crashed; successful indexed package matching remains unchanged.
- Verification for pass 66: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed; import smoke printed `raw rebuild import ok`. A follow-up search found no stale fallback patterns: `packageKey`, `matchesLowerSsisLookupKey`, `.some((key) => keys.has(key))`, or `.includes(String(pkg`.
- Larger bounded result for pass 66: `node .\scripts\rebuild-catalog-from-raw.mjs --dry-run --ssis-limit=100` exited `0`, wrote no files, discovered `1803` SSIS XML files, processed `100`, produced `738` SSIS edges, `3927` SSIS column mappings, `16` inferred SSIS SQL endpoint records, `12` inferred SSIS bridges, `1689` column lineage records, `0` invalid objects, final heap `1003` MB, RSS `1448` MB.
- Larger bounded result for pass 66: `node .\scripts\rebuild-catalog-from-raw.mjs --dry-run --ssis-limit=500` exited `0`, wrote no files, processed `500` SSIS XML files, produced `6468` SSIS edges, `26219` SSIS column mappings, `203` inferred SSIS SQL endpoint records, `89` inferred SSIS bridges, `7116` embedded column lineage records, `0` invalid objects, final heap `1355` MB, RSS `1804` MB.
- Full dry-run result for pass 66: `node .\scripts\rebuild-catalog-from-raw.mjs --dry-run` exited `0`, wrote no files, processed all `1803` discovered SSIS XML files, gate status `passed`, loaded `9855` objects, `0` invalid objects, `22533` SSIS edges, `52161` SSIS column mappings, `500` inferred SSIS SQL endpoint records, `92` inferred SSIS bridges, `15880` embedded column lineage records, `215690` columns, final heap `2208` MB, RSS `2387` MB. This is below the previous ~4 GB OOM failure range and matches the known current SSIS edge/column-lineage scale.
- Full write pass 67: ran `node .\scripts\rebuild-catalog-from-raw.mjs` without `--dry-run`; exit `0`; no OOM; processed all `1803` discovered SSIS XML files; wrote `9856` markdown files and `9856` manifest entries; report gate status `passed`; `0` invalid objects; `22533` SSIS edges; `52161` SSIS column mappings; `500` inferred SSIS SQL endpoint records; `92` inferred SSIS bridges; `15880` embedded column lineage records; `215690` columns; final heap `1780` MB; RSS `2329` MB.
- Full write pass 67 caveat: backup path was `null`; the script logged `could not move existing servers folder for backup (EPERM); rebuilding in place`. The rebuild still completed and validated successfully.
- Full write pass 67 edge-confidence evidence: generated report `data/markdown/rebuild-report.json` has `generated_at` `2026-06-04T12:57:32.226Z`, gate status `passed`, loaded objects `9856`, invalid objects `0`, average overall confidence `0.879`, average edge correctness `0.996`, SSIS edge delta `0`, direct edge ref delta `0`, and column lineage record delta `0`.
- Runtime index pass 68: ran `npm run catalog:index`; exit `0`; generated runtime indexes under `data/markdown/_runtime` with `9856` objects, `215690` columns, and `23790` runtime edges. This updates the application-facing runtime catalog after the full markdown rebuild.
- Configuration audit pass 69: checked the application/runtime wiring after the full rebuild and runtime index generation. `src/index.js` imports `loadRuntimeCatalog(...)` and initializes the app cache from runtime summary objects; `src/utils/catalogCacheHydrator.js` also hydrates from `loadRuntimeCatalog(...)`; object detail reads use `loadObjectDetail(...)` so heavy markdown details are loaded on demand instead of being kept in the global startup cache.
- Configuration evidence for pass 69: `package.json` currently has `catalog:index`, but does not yet have a one-command rebuild/dry-run/refresh script. Runtime indexes are therefore generated by an explicit command rather than a named full refresh pipeline.
- Runtime load evidence for pass 69: running the same runtime loader the app uses with `node --input-type=module -e "import { loadRuntimeCatalog } from './src/services/catalogRuntimeService.js'; ..."` loaded `9856` objects, `23790` typed edges, and `9856` object-file index entries from summary mode in `312` ms with heap `245` MB and RSS `339` MB. Runtime manifest timestamp was `2026-06-04T12:59:33.978Z`.
- Operationalization pass 70: added explicit catalog workflow scripts to `package.json`: `catalog:rebuild:sample`, `catalog:rebuild:dry`, `catalog:rebuild`, `catalog:index`, `catalog:runtime:check`, and `catalog:refresh`. The full rebuild script uses `--enforce-gates`, and `catalog:refresh` runs gated rebuild, runtime index generation, then runtime verification.
- OOM guard evidence for pass 70: changed `loadRuntimeCatalog(...)` so normal app/runtime loads do not auto-build missing or stale runtime indexes unless callers pass `{ rebuild: true }`, `{ autoRebuild: true }`, or set `CATALOG_RUNTIME_AUTO_REBUILD=true`. This prevents app startup/cache hydration from unexpectedly doing the heavy runtime-index build. Explicit ingestion/update endpoints that already pass `{ rebuild: true }` still rebuild indexes after controlled catalog mutations.
- Operational config pass 70: added `CATALOG_RUNTIME_AUTO_REBUILD=false` to `.env.example` and lowered the default runtime index build concurrency from `4` to `2` in both `.env.example` and `src/services/catalogRuntimeService.js`.
- Runtime verification pass 70: added `scripts/check-runtime-catalog.mjs`, which loads runtime indexes with `{ autoRebuild: false }` and reports object/edge counts plus memory without rebuilding anything.
- Verification for pass 70: `node --check .\src\services\catalogRuntimeService.js` passed; `node --check .\scripts\check-runtime-catalog.mjs` passed; package JSON parse check passed; `npm run catalog:runtime:check` exited `0` and loaded `9856` objects, `23790` typed edges, and `9856` object-file index entries in `232` ms with heap `245` MB / RSS `340` MB.
- Guard verification for pass 70: calling `loadRuntimeCatalog('data/markdown-does-not-exist', { autoRebuild: false })` returned code `CATALOG_RUNTIME_INDEX_STALE`, included the `npm run catalog:index` guidance, and did not attempt an index build.
- Backup hardening pass 71: changed `backupExistingServers()` in `scripts/rebuild-catalog-from-raw.mjs` to return structured backup status instead of only a path. Rebuild summaries now include `backupPath`, `backupMode`, and `backupWarning`.
- Backup fallback evidence for pass 71: if moving `data/markdown/servers` to `_rebuild_backups` fails, the script now attempts a recursive copy backup. Without `--clean`, a successful copy fallback records mode `copied_then_in_place` and continues in place without deleting the live catalog. With `--clean`, it attempts removal only after the copy fallback; if copy fails, the summary records `removed_for_clean_without_backup` or `in_place_without_backup` so the risk is visible. Failed partial copy directories are cleaned up at the timestamped backup path.
- Reliability evidence for pass 71: this batch does not touch SQL/SSIS matching, edge inference, column lineage resolution, confidence scoring, or markdown frontmatter content. It only changes pre-write backup handling and summary metadata.
- Verification for pass 71: `node --check .\scripts\rebuild-catalog-from-raw.mjs` passed.
- Bounded dry-run result for pass 71: `node .\scripts\rebuild-catalog-from-raw.mjs --dry-run --ssis-limit=2` exited `0`; wrote `0` files; summary reported `backupMode: dry_run`, `backupPath: null`, `backupWarning: null`; counts stayed at `25` SSIS edges, `235` SSIS column mappings, `137` validated column lineage records, `0` invalid objects, and `2` inferred SSIS SQL endpoint records. Final memory for this run was heap `1350` MB and RSS `1538` MB.
- Live catalog refresh pass 72: ran `npm run catalog:rebuild`; exit `0`; full gated rebuild completed without OOM. It processed all `1803` SSIS XML files, wrote `9856` markdown files and `9856` manifest entries, reported `0` invalid objects, gate status `passed`, `22533` SSIS edges, `52161` SSIS column mappings, `500` SSIS SQL endpoint records, `92` inferred SSIS bridges, and `15880` embedded column lineage records. Final memory was heap `1853` MB and RSS `2261` MB.
- Backup fallback evidence for pass 72: during the live rebuild, backup move failed with `EPERM`, the new copy fallback succeeded, and summary recorded `backupMode: copied_then_in_place`, `backupPath: C:\projects\Data Governence\data\markdown\_rebuild_backups\servers_2026-06-04T13-50-31-304Z`, and warning `Backup move failed; copied backup exists but rebuild continued in place.`
- Runtime refresh pass 73: ran `npm run catalog:index`; exit `0`; generated runtime indexes for `9856` objects, `215690` columns, and `23790` runtime edges.
- Runtime check pass 73: ran `npm run catalog:runtime:check`; exit `0`; loaded runtime summary mode with `9856` objects, `23790` typed edges, and `9856` object-file index entries in `225` ms with heap `245` MB and RSS `345` MB.
- Confluence repository redesign pass 74: updated `src/services/confluenceExportService.js` to implement the layered repository design: authoritative object registry JSON/CSV attachments, a human Governance Portal page, compact object locator / quick-context / shard pages, and capped governed-asset detail pages only for selected high-value assets. Added `CONFLUENCE_GOVERNED_OBJECT_PAGE_LIMIT=100` and default object-page publishing for governed assets.
- Confluence export pass 74: ran `npm run confluence:export`; exit `0`; generated export under `data/confluence/export` with `7` summary/portal pages, `79` object locator pages, `73` lineage quick-context pages, `175` catalog shard pages, `100` governed asset pages, `5` attachments, and `9856` objects. New machine-readable attachments were `catalog-object-registry.json` and `catalog-object-registry.csv`; existing object index, export summary, and lineage catalog zip were also generated.
- Confluence dry-run pass 74: ran `npm run confluence:dry-run`; exit `0`; status `ready`; warnings `[]`; publish candidates included the new Governance Portal, governed asset pages, object registry attachments, and lineage catalog zip.
- Live Confluence publish pass 75: ran `npm run confluence:sync -- --publish` with approved network access; exit `0`; Confluence returned `status: published` and warnings `[]`. It published the generated repository: `434` pages total (`7` summary/portal + `79` locator + `73` quick context + `175` shard + `100` governed asset pages) and `5` attachments. The new `[AUTO] Governance Portal` page was created with id `2225831938`; `catalog-object-registry.json` and `catalog-object-registry.csv` attachments were created, while existing catalog attachments were updated.
- Cleanup pass 76: fixed malformed raw SQL markdown frontmatter at `data/analysis/raw/sqlserver/servers/unknown/databases/StagingDB/tables/dbo__[etl].zzzzz[entity_other_active_lkUp.md` by quoting the `name` scalar. Targeted parse check with `parseMarkdownMetadataFile(...)` succeeded and returned name `[etl].zzzzz[entity_other_active_lkUp`.
- Operational hardening pass 77: changed `catalog:refresh` to run the staged safety sequence (`catalog:rebuild:sample`, `catalog:rebuild:dry`, `catalog:rebuild`, `catalog:index`, `catalog:runtime:check`) and added `catalog:refresh:fast` for the shorter gated rebuild/index/check path. Added `confluence:check`, `confluence:publish`, and `lineage:publish` scripts.
- Confluence export hardening pass 78: added `scripts/check-confluence-export.mjs` to validate generated export files, required registry attachments, and page size caps before publish. Tightened Confluence page splitting estimates so object locator, quick-context, and shard pages stay under configured byte caps.
- Confluence sync hardening pass 79: added retry handling for Confluence network/429/5xx failures, lowered default sync concurrency from `6` to `3`, added compact failure reporting, annotated sync failures with page/attachment targets, and made duplicate-title reruns idempotent with exact title lookup fallback.
- Cleanup refresh pass 80: ran `npm run catalog:refresh:fast`; exit `0`; gated full rebuild passed with `0` skipped SQL files, `0` invalid objects, `9857` loaded objects, `9857` files written, `22533` SSIS edges, SSIS edge delta `0`, `52161` SSIS column mappings, `500` SSIS SQL endpoint records, `92` inferred SSIS bridges, and `15880` embedded column lineage records. Runtime index/check then loaded `9857` objects and `23790` typed edges in `228` ms with heap `245` MB.
- Cleanup Confluence export pass 81: ran `npm run confluence:publish`; export and check succeeded before live sync. Export generated `7` summary/portal pages, `95` object locator pages, `83` quick-context pages, `180` shard pages, `100` governed asset pages, `5` attachments, and `9857` objects. `npm run confluence:check` reported status `ok`, warnings `[]`, failures `[]`, and max observed page sizes under caps: locator `113915`/`120000`, quick context `173670`/`180000`, shard `243270`/`250000`.
- Cleanup Confluence sync pass 81: initial live sync attempts exposed a transient `ECONNRESET` and then Confluence duplicate-title HTTP `400`; these were used to harden retry/error/idempotency behavior. Final rerun of `npm run confluence:sync -- --publish` exited `0`; Confluence returned `status: published`, warnings `[]`; all generated pages were created or updated, and all five attachments (`catalog-object-index.json`, `catalog-object-registry.json`, `catalog-object-registry.csv`, `confluence-export-summary.json`, `lineage-catalog.zip`) were updated.
- Cleanup test hardening pass 82: added focused unit coverage for `initializeCache`, runtime catalog hydration, and error response fallback paths after the full `npm test` suite was behaviorally green but failed the global branch coverage gate. No coverage threshold was lowered.
- Verification for pass 82: targeted command `node --experimental-vm-modules node_modules/jest/bin/jest.js tests/unit/cache-initializer.test.js tests/unit/error-handler.test.js --runInBand` exited `0` with `2` suites and `10` tests passing.
- Full verification for pass 82: `npm test` exited `0`; all `40` test suites and `452` tests passed, and the existing coverage threshold passed.
- Final operational check pass 83: reran `npm run catalog:runtime:check`; exit `0`; loaded `9857` objects, `23790` typed edges, and `9857` object-file index entries in `238` ms with heap `245` MB and RSS `345` MB.
- Final Confluence guard pass 83: reran `npm run confluence:check`; exit `0`; status `ok`, warnings `[]`, failures `[]`, `5` attachments present, and all page groups remained under configured byte caps.
- DevOps catalog repo pass 84: cloned the new Azure DevOps repo to `C:\projects\Sonic-data-lineage`; the repo was empty. Added app-side `catalog:repo:export`, `catalog:repo:check`, and `catalog:refresh:repo` scripts, plus `CATALOG_REPO_PATH` / `CATALOG_REPO_REMOTE` configuration.
- DevOps catalog repo pass 84: generated the local AI-readable catalog repository from runtime summary indexes. Export wrote `9857` registry rows, `9857` targeted context packs, `34` database indexes, schemas, README files, AI usage guide, reports, and SSIS folder/project/package navigation. Output size was about `93` MB across `20586` files.
- DevOps catalog validation pass 84: `npm run catalog:repo:check` exited `0`; status `ok`, object count `9857`, manifest object count `9857`, failures `[]`, warnings `[]`.
- Confluence redesign pass 85: updated generated Confluence pages with explicit AI/automation routing to the DevOps catalog repo. Added database-first human navigation pages and parent metadata so `[AUTO] Database - ...` pages publish under `[AUTO] Databases`.
- Confluence hierarchy verification pass 85: `npm run confluence:export` exited `0`; export generated `42` human/navigation pages, `95` object locator pages, `83` quick-context pages, `180` shard pages, `100` governed asset pages, and `5` attachments for `9857` objects. `npm run confluence:check` exited `0` with warnings `[]` and failures `[]`; max observed sizes remained under caps.
- Confluence dry-run hierarchy pass 85: compact dry-run of `syncConfluenceExport({ dryRun: true })` returned status `ready`, `500` pages, `34` child database pages with `parentTitle: [AUTO] Databases`, `5` attachments, and warnings `[]`. No live Confluence delete or publish was run in this pass.
- Verification pass 86: targeted tests for Confluence export, Confluence sync, and cache initialization exited `0` with `3` suites and `8` tests passing.
- Verification pass 86: full `npm test` exited `0`; all `40` test suites and `452` tests passed with the existing coverage gate.
- DevOps publish pass 87: committed and pushed the initial generated Sonic data lineage catalog repo to Azure DevOps. Commit `4ee47e9f` (`Bootstrap Sonic data lineage catalog`) on `master` included the generated README/AI README, schemas, object registry CSV/JSONL, database index, reports, SSIS navigation, and targeted context packs. Remote: `https://sonicapplicationdevelopment@dev.azure.com/sonicapplicationdevelopment/Data%20Warehouse/_git/Sonic-data-lineage`.
- Confluence replace pass 87: ran `npm run confluence:replace` with live Confluence access and authorized generated-page replacement. The command timed out at about 904 seconds, but follow-up live audit showed the generated root had `466` direct generated children and the `[AUTO] Databases` page existed. One database child was initially missing because Confluence title matching treated `WebV` and `webv` as conflicting case variants.
- Confluence repair hardening pass 88: added targeted sync support with repeatable `--only-title`, `--skip-attachments`, `--delete-title`, and `--delete-parent-title` CLI flags. Tightened `findChildPage(...)` so Confluence search results must match the exact returned title before an existing page is updated.
- Case-collision hardening pass 88: updated Confluence database page generation so case-only database names get stable disambiguated titles and filenames, for example `[AUTO] Database - WebV [db e735533e]` and `[AUTO] Database - webv [db b5516281]`. This changes human navigation titles only; it does not change object IDs, lineage edges, confidence scoring, or registry rows.
- DevOps path hardening pass 88: updated `catalogRepoExportService` so generated database and SSIS folder/project path segments include stable hash suffixes. This prevents case-insensitive filesystem collisions and long-path failures in Windows/Git clients while preserving exact database/object names inside registry fields and context pack content.
- DevOps validation pass 88: reran `npm run catalog:repo:export`; exit `0`; exported `9857` objects, `34` databases, `9857` context packs, and `1428` SSIS package contexts to `C:\projects\Sonic-data-lineage`. Reran `npm run catalog:repo:check`; exit `0`; status `ok`; object count `9857`; manifest object count `9857`; generated file count `20236`; longest generated path length `206`; failures `[]`; warnings `[]`.
- Confluence targeted publish pass 88: dry-runed and then live-published only the database navigation delta. The live command updated `[AUTO] Databases`, created six collision-safe database pages for `hrdata/HRData`, `sonic_xref/Sonic_Xref`, and `webv/WebV`, deleted five stale unsuffixed generated pages, and reported one stale lowercase `webv` page as already missing. Live sync exited `0`.
- Live Confluence audit pass 88: ran `node scripts/check-confluence-generated-pages.mjs`; exit `0`; root generated children `466`; `[AUTO] Databases` child pages `34`; expected database children `34`; missing database titles `[]`; extra database titles `[]`.
- DevOps publish pass 88: committed and pushed the collision-safe generated catalog repo update. Commit `10b05247` (`Harden generated catalog paths`) changed `20328` files, primarily renaming generated context pack folders into hash-suffixed database/SSIS paths and updating registry pointers. Push succeeded: `4ee47e9f..10b05247 master -> master`.
- Final validation pass 89: added `confluence:generated:check` as a repeatable live audit script. Reran `npm run confluence:check`; exit `0`; status `ok`; warnings `[]`; failures `[]`; max observed page sizes remained under caps. Reran `npm run catalog:repo:check`; exit `0`; status `ok`; generated file count `20236`; longest generated path `206`; failures `[]`; warnings `[]`. Reran `npm run catalog:runtime:check`; exit `0`; loaded `9857` objects and `23790` typed edges in `232` ms with heap `245` MB and RSS `345` MB.
- Final live audit pass 89: ran `npm run confluence:generated:check`; exit `0`; direct generated root children `466`; database generated children `34`; expected database children `34`; missing database titles `[]`; extra database titles `[]`.
- Final test pass 89: focused Confluence/cache suites passed (`3` suites, `8` tests), but the partial command failed the global coverage gate because only a subset ran. Full `npm test` then exited `0`; all `40` suites and `452` tests passed with the existing coverage gate.
- App repo publish pass 90: committed the app-side operationalization changes as `9934ddd` (`Operationalize lineage catalog publishing`) and pushed to `origin/main` on GitHub (`20563ba..9934ddd main -> main`).
- Lineage brain backlog pass 91: completed the lineage brain mini backlog implementation. Added shared provenance fields, active reviewed rules in `config/lineage-brain-rules.yml`, proposed/rejected rule JSONL paths, diff reports, gated live-write controls, stability validation, and review-only rule learning. The engine now proposes new high-fanout rules with `status: needs_review` and never silently promotes them into active rules.
- Lineage brain OOM fix pass 91: changed the lineage brain extractor to scan the corpus with compact records and hydrate only the selected baseline/anomaly records for prompting or markdown rewriting. Table classification still checks raw SQL on demand for high-fanout candidates, so allowlist/edge identification quality is preserved without retaining raw snippets and large edge arrays for all objects.
- Lineage brain parser hardening pass 91: made frontmatter parsing tolerate generated literal dash values such as `project_name: -` by normalizing them to a quoted scalar during parse. This fixed the validation failure that appeared before the OOM path.
- Verification for pass 91: syntax checks passed for the touched lineage brain modules and `scripts/check-lineage-brain.mjs`. `npm run lineage:brain:check` exited `0` at normal heap size after previously reproducing the JavaScript heap OOM; it validated `2298` SSIS records and `8215` table records, found the expected DimVehicle and BT_ChecklistRecord baselines, confirmed required provenance fields rendered for both lanes, and produced stable first/second signatures (`ssis fd0303...`, `table 814391...`).
- Operational smoke for pass 91: `npm run lineage:brain -- --mode both --max-changes 1 --draft-root data/markdown/_drafts --validate-stability --no-propose-rules` exited `0`; it drafted exactly one SSIS correction and one table correction, applied no live writes, wrote `data/markdown/_drafts/reports/lineage-brain-run-report.json`, and reported stable extractor/classifier signatures for `2298` SSIS records and `8215` table records.
- Test evidence for pass 91: added focused unit coverage for generated dash frontmatter and review-only rule proposals. Targeted `lineage-brain.test.js` passed, and full `npm test` passed with `41` suites and `454` tests.
- Unknown Sonic_DW quarantine pass 92: verified refreshed local corpus had about `50525` raw/markdown/runtime files and still contained `975` `unknown.Sonic_DW` runtime objects. All `975` had canonical non-unknown twins by database/schema/name/type. The JMA duplicates were `unknown.Sonic_DW.dbo.FACT_JMA_CLAIMS_TBL` and `unknown.Sonic_DW.dbo.FACT_JMA_CONTRACT_TBL`, both medium confidence, while canonical `L1-5FSQL-01.Sonic_DW...` records existed at very high confidence.
- Root-cause evidence for pass 92: raw bad records were present under `data/analysis/raw/sqlserver/servers/unknown/databases/Sonic_DW`; the JMA load procedures also contained unresolved three-part references such as `SONIC_DW.dbo.FACT_JMA_CONTRACT_TBL`, and the rebuild treated already-loaded `unknown.Sonic_DW...` raw records as separate IDs from canonical `L1-5FSQL-01.Sonic_DW...` objects.
- Quarantine implementation pass 92: moved `data/analysis/raw/sqlserver/servers/unknown` to `data/analysis/raw/sqlserver/_quarantine/servers_unknown_20260604-151054` with `3193` raw markdown files. Hardened `scripts/rebuild-catalog-from-raw.mjs` so unknown SQL server raw records are skipped/quarantined during rebuild and reported as `quarantined_sql_raw_records`; also made raw scanning skip `_quarantine` folders.
- Clean rebuild evidence for pass 92: ran `node scripts/rebuild-catalog-from-raw.mjs --enforce-gates --clean`; exit `0`; existing generated `servers` folder moved to backup `data/markdown/_rebuild_backups/servers_2026-06-04T19-14-32-224Z`; regenerated `7224` manifest files, `0` invalid objects, `6399` SQL objects, `2058` SSIS packages, `25939` SSIS edges, and `0` `unknown.Sonic_DW` hits in generated markdown/manifest/report.
- Runtime/repo evidence for pass 92: ran `npm run catalog:index` and `npm run catalog:runtime:check`; runtime loaded `7224` objects, `29798` typed edges, and `0` `unknown.Sonic_DW` objects. Re-exported the DevOps lineage repo with `npm run catalog:repo:export`; `npm run catalog:repo:check` passed with `7224` objects, `7224` manifest objects, `14972` generated files, warnings `[]`, failures `[]`; `rg -i "unknown\\.Sonic_DW" C:\projects\Sonic-data-lineage` found no matches.
- Confluence stale-export hardening pass 93: local Confluence export content search initially still found `unknown.Sonic_DW` in stale direct `data/confluence/export/shards`, `object-context`, and older `runs` files even though runtime and DevOps output were clean. Hardened `npm run confluence:export` to clean generated output by default, including `runs` and the root manifest, with `--no-clean` retained as an explicit opt-out.
- Confluence guard evidence for pass 93: hardened `npm run confluence:check` so it fails on unexpected generated files left outside the manifest and on `unknown.Sonic_DW` in generated text artifacts. Focused Confluence export test passed and now seeds stale `unknown.Sonic_DW` files to verify they are removed before export.
- Clean Confluence export evidence for pass 93: reran `npm run confluence:export`; exit `0`; generated `42` pages, `72` object locator pages, `67` quick-context pages, `147` shard pages, `100` governed asset pages, `5` attachments, and `7224` objects. Reran `npm run confluence:check`; exit `0`; status `ok`, warnings `[]`, failures `[]`. Direct `rg -i "unknown\\.Sonic_DW" data/confluence/export` returned no matches.
