# Create or Update Instructions

Shared standards: [./project-instruction-standards.agent.md](./project-instruction-standards.agent.md)

- Create new instruction files in `./instructions/` with names in the form `[verb]-[topic].agent.md`.
- Add the new instruction to `./instructions/main.agent.md` with a one-line description and keywords.
- Use the format below for structured catalog entries:
  + `- [./instructions/example.agent.md](./example.agent.md) — one-line description.`
  + `+ Keywords: keyword1, keyword2`
  + `+ Target: src/**/*.py`
  + `+ Exceptions: edge-case note`
- Follow the project instruction catalog as the single source of truth for workflow routing.
- If the project has no instruction infrastructure, install the standard bootstrap files for the selected IDE.
- For VS Code + Copilot, create `.github/copilot-instructions.md`, `.github/prompts/*.prompt.md`, and `.vscode/settings.json`.
- For Cursor, create `.cursor/rules/mcpyrex.mdc` and place helper rules in `.cursor/rules/`.
- For Claude Code, create `.claude/CLAUDE.md` and custom command files under `.claude/commands/`.
- Keep the root entry-point file referencing `./instructions/main.agent.md` and reload it on every prompt.
- Use a skill when the workflow includes executable code, scripts, references, or reusable assets.
- Put skills under `./instructions/[name]/` with a required `SKILL.md` and only add subfolders that are needed.
- After adding new instructions, verify that the entry-point file links to the catalog and the catalog lists the new file.
- Confirm to the user when the instruction system is installed and ready for use.
