# TODO

## Phase 1: Planning

- [x] Define the project goals and success criteria
- [x] Break the work into milestones and assign owners

### Goals and Success Criteria

- Build a working GenAI learning project with clear, maintainable examples.
- Keep setup instructions reproducible for a new developer on Windows.
- Success means the application runs locally, the documented workflows are complete, and the main functionality passes validation without blocking errors.

### Milestones and Owners

1. **Environment setup** — Project Lead: confirm prerequisites and local setup instructions.
2. **Core implementation** — Developer: build the initial working functionality.
3. **Documentation and examples** — Technical Writer: keep the README, reports, and usage examples current.
4. **Validation** — QA Owner: run the documented workflows, record defects, and verify fixes.
5. **Delivery review** — Project Lead: approve the final checklist and release notes.

## Phase 2: Implementation

- [x] Set up the required files, tools, and development environment
- [x] Build the first working version of the solution

## Phase 3: Validation and Delivery

- [x] Test the solution and resolve any issues
- [x] Review the final work and document the release steps

### Verification summary

- Calculator regression tests passed: `python -m unittest test_calculator.py`
- Calculator entrypoint works: `python main.py`
- Streamlit dashboard launches successfully in headless mode: `python -m streamlit run app.py --server.headless true --server.port 8502`
- Local dashboard URL: http://localhost:8502

