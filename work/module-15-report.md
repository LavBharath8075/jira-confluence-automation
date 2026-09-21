# Module 15 Completion Report

## Script Metadata
- Filename: validate_walkthroughs.py
- Language: Python
- Purpose: Finds walkthrough files under modules/**/walkthrough.md and validates each file for required Summary and Quiz sections, placeholder content, and ordering issues.

## Script Contents
```python
from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MODULES_DIR = ROOT / "modules"


def find_walkthrough_files() -> list[Path]:
    if not MODULES_DIR.exists():
        return []
    return sorted(MODULES_DIR.rglob("walkthrough.md"))


def has_heading(text: str, heading_name: str) -> bool:
    pattern = rf"^#{1,6}\s+{re.escape(heading_name)}\s*$"
    return re.search(pattern, text, flags=re.IGNORECASE | re.MULTILINE) is not None


def get_issues(text: str) -> list[str]:
    issues: list[str] = []

    if not has_heading(text, "Summary"):
        issues.append("Missing Summary section.")
    if not has_heading(text, "Quiz"):
        issues.append("Missing Quiz section.")

    if re.search(r"\bTODO\b|\bTBD\b|coming soon|placeholder", text, flags=re.IGNORECASE):
        issues.append("Contains placeholder or unfinished wording.")

    if re.search(r"^#+\s+Summary\s*$", text, flags=re.MULTILINE) and re.search(r"^#+\s+Quiz\s*$", text, flags=re.MULTILINE):
        summary_match = re.search(r"^#+\s+Summary\s*$", text, flags=re.MULTILINE)
        quiz_match = re.search(r"^#+\s+Quiz\s*$", text, flags=re.MULTILINE)
        if summary_match and quiz_match and summary_match.start() > quiz_match.start():
            issues.append("Summary and Quiz headings are out of the expected order.")

    if text.strip() == "":
        issues.append("File is empty.")

    return issues


def validate_file(path: Path) -> tuple[str, list[str]]:
    text = path.read_text(encoding="utf-8", errors="replace")
    issues = get_issues(text)
    status = "Pass" if not issues else "Needs updates"
    return status, issues


def print_report(path: Path, status: str, issues: list[str]) -> None:
    missing_sections = []
    if not has_heading(path.read_text(encoding="utf-8", errors="replace"), "Summary"):
        missing_sections.append("Summary")
    if not has_heading(path.read_text(encoding="utf-8", errors="replace"), "Quiz"):
        missing_sections.append("Quiz")

    print(f"File: {path.relative_to(ROOT)}")
    print(f"Status: {status}")
    print(f"Missing sections: {', '.join(missing_sections) if missing_sections else 'None'}")
    if issues:
        print("Issues:")
        for issue in issues:
            print(f"- {issue}")
    else:
        print("Issues: None")
    print()


def main() -> int:
    files = find_walkthrough_files()
    if not files:
        print("No walkthrough.md files found under modules/.")
        return 0

    for path in files:
        status, issues = validate_file(path)
        print_report(path, status, issues)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

## Parameters
| Parameter | Description | Default |
|-----------|-------------|---------|
| None | The script uses the repository layout and scans all files under modules/**/walkthrough.md automatically. It does not accept command-line arguments. | N/A |

## Test Run Output
```text
File: modules\bad-module\walkthrough.md
Status: Needs updates
Missing sections: Summary, Quiz
Issues:
- Missing Summary section.
- Missing Quiz section.

File: modules\good-module\walkthrough.md
Status: Needs updates
Missing sections: Summary, Quiz
Issues:
- Missing Summary section.
- Missing Quiz section.
```
