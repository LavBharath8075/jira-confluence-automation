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
