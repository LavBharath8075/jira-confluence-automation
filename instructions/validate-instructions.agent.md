# Validate walkthrough instructions

## Goal
Review each walkthrough file in the modules tree and validate it against the project validation rules.

## Inputs
- Read the project validation checklist in `validation-rules.md`.
- Inspect each file matching `modules/**/walkthrough.md`.
- If no matching files are found, report that no walkthrough files are present.

## Required workflow
1. Read `validation-rules.md`.
2. Locate each walkthrough file in `modules/`.
3. For each file, check the following:
   - required structure
   - presence of a Summary section
   - presence of a Quiz section
   - heading order and formatting
   - completeness and placeholders
   - consistency with project terminology and instructions
   - readability and final review quality
4. Record any issues found.
5. Move to the next file until every walkthrough has been reviewed.

## Output format
For each file, provide:
- File path
- Status: Pass / Needs updates / Missing
- Missing sections: Summary / Quiz / Both / None
- Issues found
- Notes

Example:

```text
File: modules/010-example/walkthrough.md
Status: Needs updates
Missing sections: Summary
Issues:
- Summary heading is missing.
- Final review section is incomplete.
Notes:
- The file is otherwise structurally sound.
```

If no files are found:

```text
No walkthrough.md files found under modules/.
```

## Validation standards
- Prefer specific, evidence-based findings.
- Do not mark a file as valid without checking the actual content.
- Report only real issues found in the file.
- Keep the report concise and easy to scan.
