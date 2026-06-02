from pathlib import Path
import subprocess
import sys


def main() -> int:
    script = Path(__file__).resolve().parent / 'src' / 'services' / 'lineageBrain' / 'runLineageBrain.js'
    result = subprocess.run(['node', str(script), '--mode', 'table'], check=False)
    return result.returncode


if __name__ == '__main__':
    raise SystemExit(main())
