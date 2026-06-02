# Lineage Brain Runbook

## Purpose

This runbook explains the current local workflow for generating lineage prompts, creating draft markdown corrections, and reviewing results before promoting any file changes.

## What This Process Does

- Scans curated lineage markdown and raw source files locally.
- Distills small evidence snippets from SSIS XML and SQL text.
- Classifies anomalies as under-populated, over-populated, or expected high fan-out.
- Writes compact prompt/report files for the selected lane.
- Writes corrected draft markdown into a separate draft tree.
- Leaves the live markdown corpus untouched unless drafts are manually promoted.

## Current Inputs

- `data/markdown/ssis_packages` for SSIS package markdown.
- `data/markdown/ssis_raw_xml` for raw SSIS XML.
- `data/markdown/databases` for curated SQL Server markdown.
- `data/analysis/raw/sqlserver/databases` for raw SQL evidence.

## Current Outputs

- `generated_lineage_prompts.txt`
- `data/markdown/_prompt_queue/pending/...`
- `data/markdown/_prompt_queue/working/...`
- `data/markdown/_prompt_queue/archive/...`
- `data/markdown/_prompt_queue/manifest.json`
- `data/markdown/_prompt_queue/summary.jsonl`
- `data/markdown/_drafts/ssis/...`
- `data/markdown/_drafts/table/...`

## How To Run

Use one of these commands from the repository root:

```powershell
npm run lineage:brain -- --mode ssis
npm run lineage:brain -- --mode table
npm run lineage:brain -- --mode both
npm run lineage:brain -- --mode all
```

To write drafts into a separate review tree:

```powershell
npm run lineage:brain -- --mode both --draft-root data/markdown/_drafts
```

Split the big consolidated prompt file into one file per investigation:

```powershell
python .\scripts\split_lineage_prompt_queue.py --source generated_lineage_prompts.txt --queue-root data\markdown\_prompt_queue
```

Process the queue two prompts at a time by default:

```powershell
python .\scripts\process_lineage_prompt_queue.py --queue-root data\markdown\_prompt_queue
```

To process more than two at a time:

```powershell
python .\scripts\process_lineage_prompt_queue.py --queue-root data\markdown\_prompt_queue --max-items 5
```

To scope the run to one specific package or table by name:

```powershell
npm run lineage:brain -- --mode table --target BT_ChecklistRecord
npm run lineage:brain -- --mode ssis --target DimVehicle_DIM_DimVehicle
```

## Manual Review Flow

1. Run the lane you want.
2. Split the consolidated prompt file into queue items.
3. Process the queue two prompts at a time by default.
4. Inspect the draft markdown file in `data/markdown/_drafts`.
5. Compare the draft against the live file.
6. Promote the draft only if it is correct.

## Where The Model Fits

- The model is not called automatically yet.
- The local runner prepares the distilled evidence and the draft markdown.
- The split queue lets you feed the model one investigation at a time.
- The process script archives each prompt after it is staged so it does not get picked up again.
- The user or operator still copies the prompt into the model manually.
- The model response is then used to refine or confirm the correction.

## Safety Rules

- Do not overwrite live markdown unless the draft has been reviewed.
- Do not feed full raw XML or full SQL into the model.
- Use only the distilled evidence blocks generated locally.
- Keep SSIS and table workflows separate unless you intentionally run `both`.

## Lane Selection

- `ssis` for SSIS package analysis.
- `table` for SQL Server table/procedure/view analysis.
- `both` to run both lanes in one command.
- `all` as an alias for `both`.

## Draft Promotion

The draft tree is the staging area. If a draft is approved, copy or promote it into the live markdown path that the original file came from.

## Troubleshooting

- If the prompt file looks too large, reduce the amount of evidence being distilled locally.
- If a draft path looks wrong, check the lane-specific path logic under `src/services/lineageBrain/runner.js`.
- If the process keeps picking an expected high-fanout object, add or refine the allowlist in `src/services/lineageBrain/constants.js`.

## Related Files

- `src/services/lineageBrain/runLineageBrain.js`
- `src/services/lineageBrain/runner.js`
- `src/services/lineageBrain/evidenceExtractor.js`
- `src/services/lineageBrain/anomalyClassifier.js`
- `src/services/lineageBrain/promptBuilder.js`
- `src/services/lineageBrain/markdownRewriter.js`
- `docs/LINEAGE_BRAIN_MINI_BACKLOG.md`
