# Module 15 Completion Report

## Script Metadata
- Filename: validate_walkthroughs.py
- Language: Python
- Purpose: Bulk scans a configurable directory for files matching a pattern, validates walkthrough markdown files, and supports safe dry-run and strict validation modes.

## Script Contents
```python
from __future__ import annotations

import argparse
import re
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Bulk validate walkthrough-style markdown files.",
    )
    parser.add_argument(
        "--directory",
        "-d",
        default="modules",
        help="Directory to scan for files (default: modules).",
    )
    parser.add_argument(
        "--pattern",
        "-p",
        default="walkthrough.md",
        help="Filename pattern to match (default: walkthrough.md).",
    )
    parser.add_argument(
        "--recursive",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Search recursively through subdirectories (default: on).",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Use stricter validation rules for missing sections and required structure.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview the files that would be processed without validating them.",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Print extra details while processing files.",
    )
    parser.add_argument(
        "--quiet",
        action="store_true",
        help="Print only the final summary and suppress per-file detail.",
    )
    return parser.parse_args()


def find_files(directory: str, pattern: str, recursive: bool) -> list[Path]:
    target = Path(directory)
    if not target.exists():
        return []

    if recursive:
        files = sorted(target.rglob(pattern))
    else:
        files = sorted(target.glob(pattern))

    return [path for path in files if path.is_file()]


def has_heading(text: str, heading_name: str) -> bool:
    target = heading_name.strip().lower()
    for line in text.splitlines():
        stripped = line.strip()
        if not stripped.startswith("#"):
            continue
        name = re.sub(r"^#+\s*", "", stripped).strip().lower()
        if name == target:
            return True
    return False


def get_issues(text: str, strict: bool = False) -> list[str]:
    issues: list[str] = []

    if not has_heading(text, "Summary"):
        issues.append("Missing Summary section.")
    if not has_heading(text, "Quiz"):
        issues.append("Missing Quiz section.")

    if re.search(r"\bTODO\b|\bTBD\b|coming soon|placeholder", text, flags=re.IGNORECASE):
        issues.append("Contains placeholder or unfinished wording.")

    if strict and (not re.search(r"^#+\s+Summary\s*$", text, flags=re.MULTILINE) or not re.search(r"^#+\s+Quiz\s*$", text, flags=re.MULTILINE)):
        issues.append("Strict mode: required headings are missing.")

    if re.search(r"^#+\s+Summary\s*$", text, flags=re.MULTILINE) and re.search(r"^#+\s+Quiz\s*$", text, flags=re.MULTILINE):
        summary_match = re.search(r"^#+\s+Summary\s*$", text, flags=re.MULTILINE)
        quiz_match = re.search(r"^#+\s+Quiz\s*$", text, flags=re.MULTILINE)
        if summary_match and quiz_match and summary_match.start() > quiz_match.start():
            issues.append("Summary and Quiz headings are out of the expected order.")

    if text.strip() == "":
        issues.append("File is empty.")

    return issues


def validate_file(path: Path, strict: bool = False) -> tuple[str, list[str]]:
    text = path.read_text(encoding="utf-8", errors="replace")
    issues = get_issues(text, strict=strict)
    status = "Pass" if not issues else "Needs updates"
    return status, issues


def print_report(path: Path, status: str, issues: list[str], quiet: bool = False) -> None:
    if quiet:
        return

    text = path.read_text(encoding="utf-8", errors="replace")
    missing_sections = []
    if not has_heading(text, "Summary"):
        missing_sections.append("Summary")
    if not has_heading(text, "Quiz"):
        missing_sections.append("Quiz")

    print(f"File: {path}")
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
    args = parse_args()
    files = find_files(args.directory, args.pattern, args.recursive)

    if args.dry_run:
        print(f"Dry run: would process {len(files)} file(s) from '{args.directory}'")
        for path in files:
            print(path)
        return 0

    if not files:
        print(f"No files matched pattern '{args.pattern}' under '{args.directory}'.")
        return 0

    if args.verbose:
        print(f"Scanning '{args.directory}' for '{args.pattern}' (recursive={args.recursive})")

    summary = {"total": len(files), "pass": 0, "fail": 0}
    for path in files:
        status, issues = validate_file(path, strict=args.strict)
        if status == "Pass":
            summary["pass"] += 1
        else:
            summary["fail"] += 1
        print_report(path, status, issues, quiet=args.quiet)

    if not args.quiet:
        print(f"Summary: {summary['pass']} passed, {summary['fail']} needs updates, {summary['total']} total.")
    else:
        print(f"Summary: {summary['pass']} passed, {summary['fail']} needs updates, {summary['total']} total.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

## Parameters
| Parameter | Description | Default |
|-----------|-------------|---------|
| --directory / -d | Directory to scan for files | modules |
| --pattern / -p | Filename pattern to match | walkthrough.md |
| --recursive / --no-recursive | Enables or disables recursive search through subdirectories | True |
| --strict | Applies stricter validation requiring the required headings to be present | False |
| --dry-run | Shows which files would be processed without validating them | False |
| --verbose | Prints scan details while processing | False |
| --quiet | Suppresses per-file output and prints only the final summary | False |

## Test Run Output
```text
Dry run: would process 4 file(s) from 'modules'
modules\bad-module\walkthrough.md
modules\good-module\walkthrough.md
modules\mixed-module\walkthrough.md
modules\nested\extra\walkthrough.md
---
Scanning 'modules' for 'walkthrough.md' (recursive=True)
File: modules\bad-module\walkthrough.md
Status: Needs updates
Missing sections: Summary, Quiz
Issues:
- Missing Summary section.
- Missing Quiz section.
- Strict mode: required headings are missing.

File: modules\good-module\walkthrough.md
Status: Pass
Missing sections: None
Issues: None

File: modules\mixed-module\walkthrough.md
Status: Needs updates
Missing sections: Quiz
Issues:
- Missing Quiz section.
- Contains placeholder or unfinished wording.
- Strict mode: required headings are missing.

File: modules\nested\extra\walkthrough.md
Status: Needs updates
Missing sections: Quiz
Issues:
- Missing Quiz section.
- Contains placeholder or unfinished wording.
- Strict mode: required headings are missing.

Summary: 1 passed, 3 needs updates, 4 total.
---
Dry run: would process 0 file(s) from 'modules'
```
