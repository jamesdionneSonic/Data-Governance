"""Compatibility wrapper for the Node validation runner.

The maintained daily entry point is run_validation.ps1, which calls
run_validation.mjs. This Python wrapper remains for users who type the old
command during the transition.
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path


def main() -> int:
    runner = Path(__file__).with_name("run_validation.mjs")
    return subprocess.call(["node", str(runner), *sys.argv[1:]])


if __name__ == "__main__":
    raise SystemExit(main())
