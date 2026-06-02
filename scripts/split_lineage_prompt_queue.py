from __future__ import annotations

import sys
import argparse
import json
import re
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Iterable, List


DEFAULT_SOURCE = Path("generated_lineage_prompts.txt")
DEFAULT_QUEUE_ROOT = Path("data/markdown/_prompt_queue")
PENDING_DIR = "pending"
ARCHIVE_DIR = "archive"
WORKING_DIR = "working"
MANIFEST_NAME = "manifest.json"
SUMMARY_NAME = "summary.jsonl"

sys.dont_write_bytecode = True


@dataclass
class PromptItem:
    item_id: str
    lane: str
    source_path: str
    prompt_path: str
    headline: str
    pattern_key: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Split a combined lineage prompt file into one file per investigation.")
    parser.add_argument("--source", default=str(DEFAULT_SOURCE), help="Combined prompt file to split.")
    parser.add_argument("--queue-root", default=str(DEFAULT_QUEUE_ROOT), help="Root folder for queue files.")
    return parser.parse_args()


def chunk_sections(text: str) -> List[str]:
    lines = text.splitlines()
    sections: List[List[str]] = []
    current: List[str] = []
    for line in lines:
        if re.match(r"^##\s+data[\\/]", line, flags=re.IGNORECASE):
            if current:
                sections.append(current)
            current = [line]
            continue
        if current:
            current.append(line)
    if current:
        sections.append(current)
    return ["\n".join(section).strip() for section in sections if "\n".join(section).strip()]


def infer_lane(section: str) -> str:
    lowered = section.lower()
    if "ssis" in lowered:
        return "ssis"
    if "table" in lowered or "sql server" in lowered:
        return "table"
    return "unknown"


def headline_from_section(section: str) -> str:
    for line in section.splitlines():
        if line.startswith("## "):
            return line[3:].strip()
    match = re.search(r"baseline:(.+)", section)
    if match:
        return Path(match.group(1).strip()).stem
    return "investigation"


def safe_name(value: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9._-]+", "_", value.strip())
    return cleaned[:160] or "investigation"


def pattern_key_from_item(lane: str, headline: str, section: str) -> str:
    lowered = section.lower()
    if lane == "ssis":
        if "sibling" in lowered or "package" in lowered:
            return "ssis_package_scope"
        if "component" in lowered or "executable" in lowered:
            return "ssis_component_scope"
        return "ssis_general"
    if lane == "table":
        if "join" in lowered:
            return "table_join_overcapture"
        if "reference" in lowered or "lookup" in lowered:
            return "table_fanout_reference"
        return "table_general"
    return f"unknown_{safe_name(headline).lower()}"


def write_manifest(path: Path, items: Iterable[PromptItem]) -> None:
    path.write_text(
        json.dumps([asdict(item) for item in items], indent=2),
        encoding="utf-8",
    )


def write_summary(path: Path, items: Iterable[PromptItem]) -> None:
    lines = []
    for item in items:
        lines.append(json.dumps(asdict(item), ensure_ascii=False))
    path.write_text("\n".join(lines) + ("\n" if lines else ""), encoding="utf-8")


def main() -> int:
    args = parse_args()
    source = Path(args.source).resolve()
    queue_root = Path(args.queue_root).resolve()
    pending_dir = queue_root / PENDING_DIR
    archive_dir = queue_root / ARCHIVE_DIR
    working_dir = queue_root / WORKING_DIR
    pending_dir.mkdir(parents=True, exist_ok=True)
    archive_dir.mkdir(parents=True, exist_ok=True)
    working_dir.mkdir(parents=True, exist_ok=True)

    for path in pending_dir.glob("*.txt"):
        path.unlink(missing_ok=True)
    for path in archive_dir.glob("*.txt"):
        path.unlink(missing_ok=True)
    for path in working_dir.glob("*.txt"):
        path.unlink(missing_ok=True)

    text = source.read_text(encoding="utf-8", errors="replace")
    sections = chunk_sections(text)

    items: List[PromptItem] = []
    for index, section in enumerate(sections, start=1):
        lane = infer_lane(section)
        headline = headline_from_section(section)
        item_id = f"{index:05d}_{lane}_{safe_name(headline)}"
        prompt_path = pending_dir / f"{item_id}.txt"
        pattern_key = pattern_key_from_item(lane, headline, section)
        prompt_path.write_text(section + "\n", encoding="utf-8")
        items.append(
            PromptItem(
                item_id=item_id,
                lane=lane,
                source_path=str(source),
                prompt_path=str(prompt_path),
                headline=headline,
                pattern_key=pattern_key,
            )
        )

    write_manifest(queue_root / MANIFEST_NAME, items)
    write_summary(queue_root / SUMMARY_NAME, items)
    print(f"Split {len(items)} investigation prompts into {pending_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
