# Module 10 Completion Report

## Instruction Files
create-status-report.agent.md
creating-instructions.agent.md
fetching-jira-issue-data.agent.md
main.agent.md
project-instruction-standards.agent.md

## main.agent.md Contents
# Instruction Files

- [`./instructions/project-instruction-standards.agent.md`](./project-instruction-standards.agent.md) — shared writing and maintenance rules used across instruction files.
  + Keywords: standards, formatting, reuse, conventions, shared rules

- [`./instructions/create-status-report.agent.md`](./create-status-report.agent.md) — generate a concise weekly status report in Markdown.
  + Keywords: status report, weekly update, blockers, accomplishments

- [`./instructions/creating-instructions.agent.md`](./creating-instructions.agent.md) — create or update instruction files and install the instruction bootstrap for the project.
  + Keywords: create instruction, update instruction, instructions, bootstrap, setup

- [`./instructions/fetching-jira-issue-data.agent.md`](./fetching-jira-issue-data.agent.md) — fetch and format Jira issue data for reporting workflows.
  + Keywords: Jira, issue data, API, fetch, formatting, reporting

## Sample Instruction
- File: project-instruction-standards.agent.md
- Contents:
# Shared Instruction Standards

Use these standards across instruction files that share general workflow guidance.

- Keep each instruction focused on one workflow and avoid mixing unrelated responsibilities.
- Write in plain Markdown with brief, direct bullet points and a professional tone.
- Keep instructions concise and action-oriented; avoid filler wording or long narrative sections.
- Keep the root entry-point file in sync with `./instructions/main.agent.md` and reload it on every prompt.
- Keep project instruction files in `./instructions/` using the naming form `[verb]-[topic].agent.md`.
- Keep instructions in English unless the user explicitly requests otherwise.
- When an instruction file is updated, read the existing version first and make a targeted incremental edit.
- Prefer reusable, platform-neutral guidance over IDE-specific rule syntax when possible.
- If a workflow includes executable code, scripts, references, or reusable assets, use a skill under `./instructions/[name]/` with a required `SKILL.md`.
- Treat `main.agent.md` as the single-source catalog for routing the model to the correct workflow.
- If a rule is reused across multiple instructions, move it here and reference this file instead of duplicating it.
