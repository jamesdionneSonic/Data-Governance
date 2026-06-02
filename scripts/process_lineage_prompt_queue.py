from __future__ import annotations

import sys
import argparse
import json
import shutil
from pathlib import Path
from typing import List


DEFAULT_QUEUE_ROOT = Path("data/markdown/_prompt_queue")
DEFAULT_MAX_ITEMS = 2
PENDING_DIR = "pending"
WORKING_DIR = "working"
ARCHIVE_DIR = "archive"
MANIFEST_NAME = "manifest.json"
IN_PROGRESS_SUFFIX = ".inprogress"

sys.dont_write_bytecode = True


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Stage prompt files for Codex one at a time and archive them after dispatch.")
    parser.add_argument("--queue-root", default=str(DEFAULT_QUEUE_ROOT), help="Queue root containing pending, working, and archive folders.")
    parser.add_argument("--max-items", type=int, default=DEFAULT_MAX_ITEMS, help="Maximum prompts to process in one run.")
    return parser.parse_args()


def load_manifest(queue_root: Path) -> List[dict]:
    manifest_path = queue_root / MANIFEST_NAME
    if not manifest_path.exists():
        return []
    return json.loads(manifest_path.read_text(encoding="utf-8"))


def main() -> int:
    args = parse_args()
    queue_root = Path(args.queue_root).resolve()
    pending_dir = queue_root / PENDING_DIR
    working_dir = queue_root / WORKING_DIR
    archive_dir = queue_root / ARCHIVE_DIR
    working_dir.mkdir(parents=True, exist_ok=True)
    archive_dir.mkdir(parents=True, exist_ok=True)

    pending_files = sorted(pending_dir.glob("*.txt"))[: max(args.max_items, 0)]
    if not pending_files:
        print("No pending prompts found.")
        return 0

    processed = 0
    for prompt_path in pending_files:
        staged_path = working_dir / f"{prompt_path.stem}{IN_PROGRESS_SUFFIX}.txt"
        shutil.copy2(prompt_path, staged_path)
        print(f"\n=== PROMPT {processed + 1} / {len(pending_files)} ===")
        print(staged_path.read_text(encoding="utf-8", errors="replace"))
        archived_path = archive_dir / prompt_path.name
        shutil.move(str(prompt_path), str(archived_path))
        shutil.move(str(staged_path), str(archive_dir / staged_path.name))
        processed += 1

    print(f"\nArchived {processed} prompt(s) to {archive_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
