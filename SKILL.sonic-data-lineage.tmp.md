---
name: sonic-data-lineage
description: Answer Sonic Automotive data lineage, where-used, dependency, source-to-target, impact-analysis, root-cause, upstream, downstream, producer/consumer, profile, and catalog questions using exact authenticated remote Sonic Data Lineage DevOps repo artifacts, without cloning/downloading the repo, reading local lineage caches, or querying Confluence. Use when a user asks, even without saying "lineage", about cataloged databases, top used tables, profile data, how many times an object is used, where a table/view/procedure/package/column is used, what uses it, what it uses, what depends on it, what feeds or populates it, what would break if it changed, upstream/downstream consumers, SSIS packages, tables such as DimVehicle, fact/dim/staging/work tables, or any Sonic database object dependency.
---

# Sonic Data Lineage

Use exact authenticated remote Sonic Data Lineage DevOps repo artifacts as the only machine-readable source for lineage and profile answers. Do not clone the repo, do not download the runtime package, do not read a local clone/package, and do not query Confluence for normal end-user answers. Do not refuse only because one retrieval method lacks authentication; try an alternate exact-file DevOps retrieval path first.

## Operating Rules

- Keep chat updates minimal: at most one short progress note unless the task runs longer than 30 seconds.
- Do not narrate exploratory dead ends. Report only the final answer, ambiguity, or verified blocker.
- For count questions, target the count field first. Do not list full downstream objects unless the user asks.
- Use a small tool budget: one index lookup, one registry row fetch, and at most one compact context or answer-card fetch. Use a deeper artifact read only if the user asks for more detail or if the cheap artifacts do not answer the question.
- Never use inline PowerShell variables, pipelines, `ConvertFrom-Json`, `ConvertTo-Json`, or multi-step shell parsing for normal lineage retrieval.
- Never use `Import-Csv`, `Where-Object`, `Sort-Object`, `Select-Object`, `ConvertTo-Csv`, `ConvertFrom-Csv`, PowerShell script blocks, or shell pipelines to rank/filter catalog data. These trigger approval prompts and are not allowed for normal skill answers.
- Prefer a first-class authenticated DevOps connector/API tool when one is available.
- If no first-class DevOps connector/API tool is available, use an authenticated exact-file DevOps HTTPS request as the fallback when it targets a single `_apis/git/repositories/.../items?path=<exact path>&includeContent=true` item and does not require cloning, downloading packages, scraping HTML, or crawling.
- If a DevOps request returns sign-in HTML, treat that as "this retrieval method is not carrying the user's DevOps session", not as proof the user lacks access. Try another exact-file authenticated DevOps path if one is available. If no method is authenticated yet and a browser-capable tool exists, open the Azure DevOps sign-in page and let the user sign in interactively, then retry through the same browser-aware session path.
- Do not use shell commands for data shaping, ranking, filtering, local filesystem access, cloning, package download, or Confluence fallback.
- Prefer exact object rows, answer cards, and compact context packs over broad corpus scans. Avoid speculative count probing.
- Prefer the published routing contract before guessing paths: use `indexes/entrypoints.json`, `indexes/path-contract.json`, exact resolvers, and answer cards when they exist.
- Treat `indexes/path-contract.json` as binding. If a path is null, unavailable, unpublished, or not listed as supported, do not probe variants.
- Do not clone, sparse-checkout, crawl, or download the full repo/package. Retrieve only the exact remote file needed for the current answer.
- Do not read from any local lineage repo, local runtime package, local markdown export, or local lineage cache during normal end-user skill answers. Local files are developer diagnostics only and require the user to explicitly ask for local/debug mode.
- Do not call Confluence tools or read Confluence pages for this skill. Confluence is human documentation, not a computer-friendly retrieval source.
- Do not read `manifest.json`, `AI_README.md`, or guide docs during normal question answering unless freshness, package shape, or a missing-path blocker makes them necessary.
- Full JSONL scans are last resort. Prefer sharded indexes and exact path opens first.

## Primary Source: Remote DevOps Repo

Start from exact remote Sonic Data Lineage DevOps repo artifacts. Retrieve individual files by repo path; never clone or download the repo.

- Canonical remote: `https://sonicapplicationdevelopment@dev.azure.com/sonicapplicationdevelopment/Data%20Warehouse/_git/Sonic-data-lineage`
- Azure DevOps item API pattern:
  - Organization: `sonicapplicationdevelopment`
  - Project: `Data Warehouse`
  - Repository: `Sonic-data-lineage`
  - Retrieve exactly one item path at a time through an authenticated DevOps connector/API or exact authenticated DevOps item request.
  - Example item paths:
    - `/indexes/entrypoints.json`
    - `/indexes/path-contract.json`
    - `/indexes/resolve/by-qualified-name/vendordatacbapurchasedetails.json`
    - `/answers/summary/by-object-id/<object_hash>.json`
    - `/answers/profile-teaser/by-object-id/<object_hash>.json`
    - `/answers/catalog/databases.json`
    - `/indexes/top-used/VendorData--1ae73181f6.json`
    - `/indexes/rankings/VendorData--1ae73181f6/tables-by-downstream-count.json`
    - `/profile-index/by-database/VendorData--1ae73181f6.json`
  - If an exact DevOps item request returns sign-in HTML, login markup, 401, or 403, try another exact-file authenticated DevOps retrieval method if available.
  - If no retrieval method is carrying the user's session and a browser-capable tool is available, open the canonical repo or Azure DevOps sign-in page in that browser, ask the user to complete sign-in, then retry the exact same one-file request through the browser-aware session path.
  - If no method can carry the user's session after that retry, say the current retrieval method is not authenticated to DevOps and name the expected path. Do not use Confluence, local files, package downloads, or repo clones as fallback.
- Preferred repo artifacts mirror the runtime package structure when present:
  - `answers/**`
  - `answers/intents/**`
  - `indexes/index-manifest.json`
  - `indexes/entrypoints.json`
  - `indexes/path-contract.json`
  - `indexes/resolve/by-qualified-name/**`
  - `indexes/by-name/**`
  - `indexes/aliases/**`
  - `indexes/by-database/**`
  - `indexes/by-schema/**`
  - `indexes/rankings/**`
  - `profile-index/**`
  - `registry/canonical-objects.jsonl`
  - `registry/object-registry.jsonl`
  - object-specific `compact_context_pack_path`, `context_pack_path`, or `context_pack_json_path`

If repo access is available, open only the exact file(s) needed. Do not scan, clone, sparse-checkout, or download the full repo.

## Access Handling

Use the current user's authenticated DevOps access/session only. Do not attempt credential probing, PAT prompts, service-account fallback, cloning, package download, Confluence fallback, or local repo fallback.

For the first exact DevOps artifact request in a conversation, treat that request as both the access check and the data fetch:

- If it returns the expected JSON/Markdown artifact, answer from that artifact.
- If it returns HTTP 401, HTTP 403, sign-in HTML, login markup, or any non-artifact content, do not conclude the user lacks access yet. Try a different exact-file DevOps retrieval method that can use the user's authenticated session.
- If no method is authenticated yet and a browser-capable tool exists, open Azure DevOps for interactive sign-in, wait for the user to finish, then retry the same exact artifact path through the browser-aware method before giving up.
- If no first-class authenticated DevOps connector/API is available, use an exact authenticated DevOps item request for the one required file instead of refusing only because a connector is unavailable.

Only after every available exact-file DevOps retrieval method fails, answer with this message shape:

`I could not read the Sonic Data Lineage DevOps artifact through the authenticated retrieval methods available in this chat. This may mean the DevOps browser login is not being passed to the request method. Expected artifact: <repo path>.`

Do not tell a user who says they have access to contact the Data Team unless DevOps explicitly returns a permission-denied response for their authenticated session. Do not try local files, Confluence, web search, repo clones, or package downloads after an access failure. If an exact DevOps request method asks for normal Codex permission, surface that one-file request instead of switching sources.

Interactive login fallback rules:

- Prefer a browser-aware retrieval method end to end when using interactive sign-in. Do not open a browser for login and then switch to a shell or request path that cannot reuse that session.
- Open only the minimum Azure DevOps page needed to establish session context, preferably the canonical repo URL or the exact repo item page if supported.
- Ask the user to sign in themselves. Never request their password, MFA code, PAT, or cookie values in chat.
- After the user finishes sign-in, retry the same exact file path once through the same browser-aware method before trying a different path.
- If the browser session still does not flow to the retrieval method, say so plainly and name the expected artifact path.

## Developer Diagnostic Sources Only

Local lineage repo/package/markdown paths are intentionally not documented here because this skill is for end-user remote retrieval. Use local files only when the user explicitly asks for local/debug verification, publish validation, or repository maintenance.

Do not download the runtime package for normal skill answers. If an exact remote DevOps artifact cannot be retrieved, say that the remote artifact is unavailable in this chat instead of downloading package data.

Do not use the runtime package or local package cache as an optimization for end-user answers. Local package reads are only allowed in explicit local/debug mode.

## No Confluence Retrieval

Do not call Confluence for Sonic lineage/profile skill answers. If the exact DevOps artifact is missing or cannot be retrieved, say the DevOps artifact is unavailable and name the expected repo path. Do not use Confluence as fallback.

## Trigger Intents

Treat these as lineage questions even when the user does not say "lineage":

- "How many times is X used?"
- "Where is X used?"
- "What uses X?"
- "What does X use?"
- "What depends on X?"
- "What does X depend on?"
- "What feeds/populates/loads/writes to X?"
- "What does X feed/read from/write to?"
- "What would break if X changed?"
- "What is the blast radius/impact of changing X?"
- "Why is this report/table wrong?" when the request names a Sonic data object
- "Show source/target/source-to-target for X"
- "Find upstream/downstream for X"
- "What databases are cataloged?"
- "What tables have profile data?"
- "Show profile data for X"
- "Give me a profile report for X"
- "What are the top used tables in X?"
- "Which tables failed profiling?"

## Repo Artifacts

Use exact remote DevOps repo artifacts in this order:

0. For a new question shape, first read `indexes/entrypoints.json` or the matching `answers/intents/*.json` route card only when the next exact path is not obvious.
0a. Read `indexes/path-contract.json` when a path is missing, a new path family is involved, or profile artifacts are being discussed. Once read, obey it for the rest of the answer.
1. Resolve exact object IDs, fully qualified names, or schema/object names with `indexes/resolve/by-qualified-name/{compact_lookup_key}.json` before sharded lookup. Use `indexes/by-name/`, `indexes/aliases/`, `indexes/by-database/`, `indexes/by-schema/`, or `indexes/rankings/` only when the exact resolver is not applicable or returns no useful match.
2. Use the resolved row's answer card paths directly. Open registry JSONL only when an index/answer card is ambiguous or missing required row fields.
3. The object's answer card or compact context pack first:
  - `answers/summary/by-object-id/**`
  - `answers/usage-count/by-object-id/**`
  - `answers/upstream/by-object-id/**`
  - `answers/downstream/by-object-id/**`
  - `answers/profile-teaser/by-object-id/**`
  - `answers/catalog/databases.json`
   - `context-packs/objects/by-id/**`
3a. For profile questions, use the object's `answers/profile-teaser/by-object-id/**` card before opening profile-index shards. Only open deeper `profile-index/**` files when the user asks for profile detail or the teaser says profile evidence exists:
  - `profile-index/latest-summary.json` for overall profile coverage and caveats.
  - `profile-index/by-database/**` for database-level profile inventory.
  - `profile-index/by-object-name/**` or `profile-index/by-object-id/**` for a specific table/view/object profile.
  - `profile-index/by-column-name/**` for column profile lookups.
  - `profile-index/runs/by-connector/**` to explain whether a connector has only metadata harvest runs, dry-run plans, or executed aggregate profiles.
  - `profile-index/flags/pii.json`, `metrics.json`, `quality-gaps.json`, and `stale-profiles.json` for governance-focused profile questions.
4. The object's `context_pack_json_path` for deeper direct lineage answers, confidence, truncation, source paths, and compact summaries.
5. The object's `context_pack_path` markdown when a human-readable answer card is easier to quote or summarize.
6. `ssis/folders/<folder>/projects/<project>/README.md` only when the user is tracing from SSIS project to package or package group.
7. `manifest.json`, `registry/object-registry-summary.json`, `catalog-manifest.json`, `docs/confidence-guide.md`, and `reports/latest-rebuild-report.json` only when needed for freshness, orientation, or quality notes.

Known DevOps repo artifact patterns:

- `manifest.json` exposes retrieval order, counts, entrypoints, and runtime content hashes.
- `indexes/entrypoints.json` exposes low-token route hints for catalog, ranking, object summary, profile, upstream, downstream, impact, SSIS package, and procedure questions.
- `indexes/path-contract.json` declares supported path families and unpublished path patterns. Do not request paths listed as unpublished, especially `data/markdown/_runtime/profile-runs/**`.
- `answers/intents/*.json` are cheap route cards. Use one only when the user's intent is unclear enough that it avoids multiple exploratory artifact reads.
- `indexes/resolve/by-qualified-name/**` resolves compact exact object identifiers and qualified names to object rows and answer card paths without sharded lookup or registry scans.
- Sharded indexes are meant to avoid full-registry scans for common name lookups.
- Registry rows expose canonical object IDs, types, counts, confidence labels, answer card paths, and exact context paths.
- Summary, usage, upstream, downstream, profile-teaser answer cards, and compact context packs are the preferred low-cost retrieval surface.
- When a compact context pack includes `semantic_lineage`, prefer those grouped sections over raw `lineage.downstream` or `lineage.upstream` lists.
- Use `semantic_lineage.business_consumers`, `semantic_lineage.maintenance_reads`, `semantic_lineage.loaders`, and `semantic_lineage.orchestrators` to preserve technical object names while separating business consumers from maintenance/load-path procedures and the SSIS packages that orchestrate them.
- Full context pack JSON files expose upstream, downstream, summary, confidence, truncation flags, source markdown paths, object metadata, and sometimes richer semantic grouping.
- Context pack markdown files expose a human-readable compact version of the same answer surface.
- Profile-index files expose profile coverage and aggregate profile results. Treat `run_kind: aggregate_profile` with executed profiles as live aggregate profile evidence. Treat `run_kind: metadata_harvest`, dry-run/planned runs, or object shards with caveats such as "Metadata inventory record only" as schema/inventory evidence, not row/null/distinct profile evidence.
- Profile-index files must not contain raw source rows, sample values, preview data, credentials, tokens, or secrets. If the user asks for examples or sampled values, explain that Sonic's profile contract intentionally does not retain them.

## Tool Workflow

1. Use targeted remote DevOps repo artifacts only, not web search, local files, runtime package cache, or Confluence.
2. If one exact remote DevOps artifact request is unavailable because the session did not flow, try another exact-file authenticated DevOps retrieval method before answering.
3. If no method is authenticated yet and a browser-capable tool exists, open Azure DevOps, have the user sign in interactively, and retry the same exact file request through a browser-aware session path.
4. Read exact remote DevOps artifacts one file path at a time through the best authenticated DevOps access available in the current chat. Prefer a first-class DevOps connector/API; if unavailable, an exact authenticated DevOps item HTTPS request is allowed for the single required artifact. Do not use shell commands for data shaping, local filesystem reads, browser scraping, web search, repo clones, package downloads, or Confluence for end-user answers.
5. If the exact route is unclear, read `indexes/entrypoints.json` or the relevant `answers/intents/*.json`; otherwise skip this step to save tokens.
6. Resolve objects from `indexes/resolve/by-qualified-name/**` first when the user supplied an object ID, fully qualified name, schema/name, or likely exact name. Use sharded indexes only for partial/bare-name searches.
7. If the question is a pure count question, stop at the cheapest artifact that contains the count:
   - exact registry row first
   - then answer card or compact context pack
   - then deeper context pack only if needed
8. If the question asks for actual upstream/downstream objects or business logic context, prefer answer cards or compact context packs before opening full context pack JSON or markdown.
9. If the question asks for catalog-level lists such as databases, use `answers/catalog/databases.json` first. Do not build the answer from `registry/database-index.json` unless the catalog answer file is missing.
10. If the question asks for profile data, row counts, nulls, distincts, min/max, profile coverage, PII, metric candidates, or data freshness, use `answers/profile-teaser/by-object-id/**` first for object-level questions, then the exact `profile-index/**` path advertised by the teaser. Do not answer from schema/catalog metadata alone unless the profile teaser/index shows no executed aggregate profile for that object.
11. If the user asks "tell me about" a specific table or view, use `answers/summary/by-object-id/**` first, then append the `answers/profile-teaser/by-object-id/**` evidence if available. Open a compact context pack only when the summary card lacks requested detail.
12. When profile teaser evidence exists for a table/view in a "tell me about" answer, always append a short `Profile Availability` teaser and ask: `Do you want a data profile report for this table?`
13. If the question asks for "top", "most used", "highest usage", rankings, or database table lists, first look for precomputed DevOps artifacts under `indexes/top-used/**`, `indexes/rankings/**`, `indexes/by-database/**`, `answers/catalog/**`, or the database's compact answer card. Retrieve one exact remote file path through authenticated DevOps access. Do not sort CSV/JSON in PowerShell and do not process broad registry files locally.
14. Open the matching `context_pack_json_path` only when the cheap artifacts lack the needed detail.
15. Open the matching `context_pack_path` markdown only when the markdown card is more readable or when the JSON lacks a compact summary.
16. Read `manifest.json` only when needed to confirm freshness, entrypoints, repo/package shape, or package version.
17. Use SSIS README files only when the object row alone is not enough to orient a package/project answer.
18. If a repo context pack names `source_markdown_path` but the repo copy is missing, say the source markdown path is not available through the remote DevOps artifact and do not use local raw markdown fallback.
19. Never request `data/markdown/_runtime/profile-runs/**` or `data/_runtime/profiles/**`; those are unpublished local provenance paths by contract.
20. Prefer DevOps-carried `logic_summary` and `evidence_snippets` for stored procedure/package drilldowns before requesting any deeper DevOps artifact.
21. If the remote DevOps repo artifact lacks the needed object or evidence, say so and name the expected/missing DevOps path.
22. If remote DevOps retrieval is unavailable after trying available exact-file methods and one interactive browser sign-in retry when possible, say the current chat retrieval method is not authenticated to DevOps and name the expected path. Do not say the user lacks access unless DevOps explicitly denies the authenticated user.

## Object Resolution

- Preserve exact object IDs and casing from the pages.
- Search case-insensitively when the user gives a partial name, but report the casing found in the package registry.
- Prefer the most specific match in this order: exact fully-qualified object ID, server/database/schema/name, schema/name, then bare name.
- For exact object ID, server/database/schema/name, database/schema/name, or schema/name inputs, compute the compact lookup key described by `indexes/entrypoints.json` and try `indexes/resolve/by-qualified-name/{compact_lookup_key}.json` first.
- If the user says "table", prefer `type: table` over procedures, packages, datasets, or column-mapping chunks.
- If multiple objects match, list the candidates with type, object ID, confidence, and compact context or context pack path before giving a count or lineage answer.
- Do not silently merge distinct objects such as `WebV`, `webv`, `webvEP`, staging, work, load, perm, or unknown-server variants.
- If more than one object remains after the first index lookup, do not open multiple deep context packs. Return the candidate list and stop unless the user clarifies.

## Answering Where-Used And Counts

Interpret "used by", "where used", "how many times used", "what depends on it", and "impact" as downstream lineage unless the answer card or context pack evidence indicates a different relationship.

Counting rules:

- Prefer `downstream_count` from the exact registry row first for pure count questions.
- If the registry row lacks the needed count, use the matching answer card or compact context pack.
- Only use the full context pack for counts when cheaper artifacts do not contain the field.
- If a compact context pack exposes semantic downstream groups, report the raw total count and then break it into business consumers versus maintenance/load-path procedures when relevant.
- If only a context pack list is available, count entries in `downstream` and report whether `downstream_truncated` is true.
- If `downstream_truncated` is true, state that the displayed list is partial. If a count field exists, report it as the repo-reported count.
- Distinguish business/technical objects from SSIS column-mapping chunks. Count chunks only when they are listed as direct lineage edges, and label them as column-mapping evidence.
- For "what does X use" or "what feeds X", use upstream lineage and upstream counts.
- For "impact if X changes", use downstream lineage.
- For "root cause" or "where did bad data come from", use upstream lineage.

## Evidence Rules

- Do not guess.
- Only state lineage supported by remote DevOps repo content retrieved for the answer.
- If a context pack does not contain evidence, say that.
- Do not infer missing relationships from object names, naming conventions, or domain knowledge.
- Report confidence labels/scores when available.
- Report unresolved risk, risk flags, and truncation flags when available.
- Include the DevOps repo file path(s) used as sources.
- Prefer citing one artifact, not several, unless multiple artifacts were truly necessary.

## Answer Format

For a single resolved object, do not lead with raw counts, raw edge dumps, or source links. Lead with a short plain-English explanation of what is happening.

Global answer quality rules:

- Do not render long comma-separated object, database, schema, or package lists. Use a compact markdown table or grouped bullets.
- Keep raw technical names visible, but put them in a column with role/type/location context so a technical user can find the object.
- Explain numeric or odd-looking catalog entries instead of presenting them as ordinary business names.
- For catalog list questions, lead with what the list means, then show a table.
- Put anomalies, duplicates, unresolved servers, and extraction-quality caveats in a separate "Catalog Quality Notes" or "Caveats" section.

Default answer shape for catalog list questions:

1. A 1-2 sentence plain-English summary of the catalog scope.
2. A table with `Database`, `Total Assets`, `Tables`, `Views`, `Procedures`, `SSIS / Packages`, `Profile Data`, and `Notes` when those fields are available. If exact type counts are unavailable, use `Main types` and say the type breakdown is summarized.
3. A separate `Catalog Quality Notes` section when the package flags numeric/anomalous entries such as `22` or `224`.
4. A brief evidence line that cites `answers/catalog/databases.json`.

When using `answers/catalog/databases.json`:

- Use `plain_english` for the opening sentence.
- Render `databases` as the normal database table.
- Render `anomalous_entries` separately. Do not mix them into the normal table unless the user explicitly asks for every raw index key in one list.
- Use each row's `note` and `sample_objects` when explaining why an entry is suspicious.
- If a numeric entry appears, say it looks like a parsed server/IP/source fragment or numeric source identifier based on the packaged evidence, and that it should be verified before treating it as a real business database.

Default answer shape for lineage questions:

1. A 2-4 sentence plain-English summary that explains the lineage in business terms.
2. A short caveat when needed, especially for maintenance patterns such as a procedure reading the same table it writes during an upsert.
3. A compact impacted-object table or bullet list with enough information for the user to find the object:
   - Role
   - Object
   - Type
   - What it does / why it matters
   - Where to find it
4. A brief evidence line with the DevOps repo file path(s) used.

Preferred wording rules:

- Say things like "DimVehicle is populated by...", "This package calls...", "This procedure upserts...", and "Normal downstream consumers are..."
- Do not answer with only "For X, I could verify these downstream users..." unless the user explicitly asked for a terse evidence-only answer.
- Do not lead with `downstream_count`, `upstream_count`, `downstream_truncated`, or other raw field names. Translate them into English.
- When counts matter, mention them inside the prose or table, not as the whole answer.
- When the user asks "what uses X" or "what feeds X", prefer naming the important objects and their roles over echoing raw IDs with no explanation.

Profile answer formatting:

- Model profile answers after lineage answers: a short plain-English summary first, then compact markdown tables, then one natural next question or a short `Recommended Next Questions` table.
- Do not dump all column statistics by default. Show the most important signals first and offer drilldowns such as "show all columns", "show high-null columns", "show distinct counts", "show profile caveats", or "compare to another table".
- Always state whether raw values were stored. The expected answer is usually `No`; if profile-index says otherwise, stop and flag a safety issue.
- Treat profile data as separate from lineage. For "tell me about table X", first answer with the established lineage format. At the end, if profile data exists, add a small `Profile Availability` table and ask whether the user wants a data profile report.
- This profile follow-up is mandatory for table/view "tell me about" answers whenever profile-index evidence exists. Do not omit it.
- For database-level profile questions, prefer a database summary table over prose.
- For table-level profile reports, use this shape unless the user asks for something else:
  1. `Quick Read`: one short paragraph explaining what the profile says in plain English.
  2. `Profile Summary` table with `Measure` and `Value`.
  3. `Quality Signals` table with `Signal`, `Status`, and `Evidence`.
  4. `Columns To Review First` table showing only the top exceptions, usually high-null, empty, sensitive/skipped, or unusually low/high cardinality columns.
  5. `Recommended Next Questions` table with `Question` and `Why Ask`.
- Keep profile reports to five sections max unless the user asks for more detail.
- For completeness, use null percentage and empty/all-null columns when available.
- For uniqueness, use distinct counts when safe and available; if statistics were skipped because of sensitivity or data type limits, say so plainly.
- For validity, reference SQL metadata/data type consistency only when profile-index evidence supports it.
- For freshness/timeliness, report `profiled_at`, `generated_at`, or run `completed_at`.
- For failed or partial profile runs, show failures in a separate compact table with `Table`, `Status`, and `Reason`, and do not blend failed tables into successful profile summaries.

Default database catalog answer shape:

1. `Cataloged Databases`
2. A markdown table with database asset counts:

| Database | Total Assets | Tables | Views | Procedures | SSIS / Packages | Profile Data | Notes |
|---|---:|---:|---:|---:|---:|---|---|

3. One short sentence pointing out the most useful next step, such as "VendorData has recent profile data; Sonic_DW has the broadest lineage coverage."
4. Ask which database the user wants to explore.

Default database profile answer shape:

1. A short summary sentence.
2. A markdown table:

| Measure | Value |
|---|---:|
| Total cataloged assets | ... |
| Tables profiled | ... |
| Tables not profiled | ... |
| Columns profiled | ... |
| Latest profile run | ... |
| Raw values stored | No |

3. A short list or table of available next views: `Most-used tables`, `Profiled tables`, `Failed profiles`, `Lineage for a table`, `Data quality signals`.

Default table profile teaser after lineage:

| Profile Signal | Value |
|---|---:|
| Rows profiled | ... |
| Columns profiled | ... |
| High-null columns | ... |
| Raw values stored | No |
| Profile status | ... |

Then ask: "Do you want a data profile report for this table?"

If profile data is available, prefer wording like: "This table has profile data. Do you want to know more about the data in this table?" Then, if the user says yes, return the full profile setup/report.

Default full table profile report:

Start with `Data Profile Report: <object>` and then:

| Measure | Value |
|---|---:|
| Rows profiled | ... |
| Columns profiled | ... |
| Profiled at | ... |
| Source server | ... |
| Raw values stored | No |

Quality signals:

| Signal | Status | Evidence |
|---|---|---|
| Completeness | Review/Good | ... |
| Uniqueness | Available/Limited | ... |
| Validity | Good/Unknown | ... |
| Freshness | Recent/Stale/Unknown | ... |
| Sensitivity | Protected | Raw values were not retained |

Columns to review first:

| Column | Null % | Distinct Count | Reason |
|---|---:|---:|---|

Recommended next questions:

| Question | Why Ask |
|---|---|

Special handling for semantic lineage:

- If a process both reads and writes the same table, explain that the read may be a target-maintenance read used for upsert/change detection, not a normal downstream business dependency.
- When `semantic_lineage.orchestrators` exists, show those SSIS packages as a separate load-path/orchestration section so users can see which packages call the relevant procedures.
- For "what loads X", emphasize the package/job/procedure chain that writes or maintains the target.
- For "what uses X", keep maintenance/load-path procedures and orchestrating SSIS packages visible, but separate them from normal business consumers.
- For "tell me about the business logic", summarize the procedure/package in logical steps instead of listing raw edges.

For ambiguous object names, list only the candidate IDs and counts if available. Ask for clarification only when ambiguity prevents a useful answer.

## Token Minimization Patterns

- For `how many times is X used?`: `index -> exact registry row -> answer`.
- For `tell me about X`: `exact resolver -> answers/summary -> answers/profile-teaser -> answer`.
- For `how many times is X used?`: `exact resolver -> downstream count from resolver row or usage-count card -> answer`.
- For `what uses X?`: `exact resolver -> downstream answer card -> compact context pack only if needed -> answer`.
- For `what feeds X?`: `exact resolver -> upstream answer card -> compact context pack only if needed -> answer`.
- For `profile for X`: `exact resolver -> profile-teaser -> advertised profile-index path only if needed -> answer`.
- For `show full lineage`: `exact resolver or sharded index -> one compact context pack -> one deeper context pack only if needed`.
- For `top 10 used tables in <database>`: `indexes/top-used/<database>.json` or `indexes/rankings/<database>/tables-by-downstream-count.json -> answer`. Do not scan or sort `registry/object-registry.csv`.
- For ambiguous names: `index -> candidate list -> stop`.
- For missing profile-run/source paths: `path-contract -> state unpublished/unavailable -> stop`.
- Never open both JSON and markdown versions of the same context unless one is missing a needed field.
- Avoid shell commands for skill retrieval unless the only available path is a single exact authenticated DevOps item request. Never use shell commands for ranking, filtering, broad scans, local file reads, repo clones, package downloads, or Confluence fallback.

## Examples

User: `tell me how many time the dimVehicle table is used`

Treat as: where-used/downstream count for table objects named like `DimVehicle`. Search the package indexes or canonical registry for `DimVehicle`, prefer exact `type: table`, list duplicates if present, then answer with `downstream_count` and the answer card or context pack source path.

User: `what feeds V1-SQL-03.WebV.dbo.veh_inventory`

Treat as: upstream lineage for that fully-qualified object. Preserve any casing difference found in the package registry and report exact answer card or context pack evidence.

User: `what breaks if we change dbo.Customer`

Treat as: downstream impact analysis for matching Sonic objects named `dbo.Customer`; resolve duplicates first.
