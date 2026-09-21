# Validate Instructions

Use this workflow to validate walkthroughs or other markdown files against a reusable checklist.

## Goal
Review each target file against the project validation rules and report the result clearly.

## Inputs
- Read the validation checklist in `./validation-rules.md` when available.
- Inspect the target directory or file set before processing.
- If a batch is being processed, support a configurable directory, pattern, and dry-run preview.
- If no matching files are found, report that no files matched the configured target.

## Required workflow
1. Confirm the target files and the validation criteria.
2. Discover the files to validate using configurable inputs such as directory and filename pattern.
3. For each file, check the following:
   - required structure
   - presence of a `Summary` section
   - presence of a `Quiz` section
   - heading order and formatting
   - placeholder text such as `TODO`, `TBD`, or `coming soon`
   - empty or incomplete content
   - readability and final review quality
4. Record the exact issues found.
5. Print a per-file result and then a batch summary.
6. If a dry run is requested, list the files that would be processed without validating them.

## Output format
For each file, provide:
- File path
- Status: Pass / Needs updates
- Missing sections: Summary / Quiz / Both / None
- Issues

Example:

```text
File: modules/sample/walkthrough.md
Status: Needs updates
Missing sections: Summary
Issues:
- Missing Summary section.
- Contains placeholder or unfinished wording.
```

If no files are found:

```text
No files matched the configured pattern.
```

## Validation standards
- Prefer specific, evidence-based findings.
- Do not mark a file as valid without checking the actual content.
- Report only real issues found in the file.
- Keep the report concise and easy to scan.
- Use configurable bulk-processing options when working with many files.
- Prefer dry-run preview behavior before validation across a larger set of files.
