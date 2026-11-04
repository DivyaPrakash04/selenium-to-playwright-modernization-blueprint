# Instructions for AI coding assistants

Use this file as the working guide when helping with this repository. Start with the [README](README.md) for the learning path, then read the guide relevant to the requested change.

## Repository purpose and boundaries

- This is an educational blueprint for modernizing Selenium Java tests into Playwright TypeScript. It is not a production framework template.
- Preserve the learning narrative: understand the legacy test intent, modernize it, validate the behavior, and explain the resulting quality value.
- The Playwright examples target public demo applications. Do not add credentials, private test data, customer information, or secrets to code, prompts, screenshots, reports, or documentation.
- The repository includes Playwright HTML and JUnit reporters and a custom reporter that writes Jira-shaped JSON locally. It does **not** call Jira, create defects, upload Jira evidence, or generate dashboards.
- ReadyAPI, Jira integrations, Datadog, production synthetic monitoring, and executive dashboards may be discussed as broader architecture examples. Do not claim they are implemented here unless code and configuration are added and verified.
- Selenium Java examples are intentionally legacy teaching examples. The README records whether Java/Maven execution has been verified; do not imply it has been run unless you actually run it successfully.

## Find the relevant material

- `selenium-java-legacy/`: Java, Maven, TestNG examples that demonstrate migration opportunities.
- `playwright-ts-modern/`: TypeScript Playwright config, specs, fixtures, pages, reporters, and scripts.
- `ai-prompts/`: reusable prompts for migration and review.
- `docs/migration-manifest.md`: Selenium-to-Playwright concept mapping.
- `docs/ai-review-checklist.md`: review criteria for AI-assisted changes.
- `docs/reporting-and-visibility.md`: implemented reporting outputs, Jira handoff boundary, audience views, and talk diagrams.
- `docs/cloud-vs-local-ai.md`: model workflow considerations.
- `docs/measuring-modernization.md`: outcome measures and comparison approach.
- `docs/talk-mapping.md`: mapping between the blueprint and the meetup narrative.

## Migration and test design guidance

- Preserve the original business behavior and assertions. Improve implementation without silently changing what the test proves.
- Prefer Playwright web-first assertions and user-facing locators such as roles, labels, and visible text when appropriate. Use test IDs when the application provides them. Avoid brittle positional selectors and fixed sleeps.
- Keep tests isolated and use Playwright-managed fixtures, browser contexts, and setup projects where they improve the example.
- Keep TypeScript strict and follow the existing project style. Reuse existing page objects and fixtures when appropriate instead of duplicating setup.
- Treat AI-generated code as a draft. Check locators against the actual page, verify assertions and test data, and explain any assumptions.
- Do not add retries or loosen assertions just to hide intermittent failures. Investigate the cause and report environmental limitations clearly.

## Reporting guidance

- Check `playwright-ts-modern/playwright.config.ts` and `src/reporters/jiraReporter.ts` before describing reporter behavior.
- The custom reporter records a test ID, title, status, first failure line, and labels in `test-results/jira-results.json`. A `jira` annotation supplies a stable test ID; otherwise the reporter derives an ID from the title path.
- The HTML report, JUnit XML, and custom JSON are generated outputs under `playwright-ts-modern/`. Do not treat generated reports as source files or commit run artifacts unless the user specifically asks for a shareable sample artifact.
- A real Jira integration needs an authorized CI-side adapter and a Jira test-management integration. Keep secrets in CI secret storage; never put tokens in reporter code or examples.
- Screenshots and traces depend on Playwright configuration and test outcome. Do not promise that every successful run will contain failure evidence.

## Editing and verification

- Keep documentation aligned with implementation. If behavior changes, update the README or relevant guide and label future integrations as future work.
- Do not modify generated folders such as `playwright-report/`, `test-results/`, or `.auth/` as source material.
- Never publish, push, or create an external integration unless the user requests it.
- Follow the user's requested verification scope. Useful commands from `playwright-ts-modern/` include:

  ```powershell
  npm run typecheck
  npm test
  npm run report
  ```

- `npm test` uses public demo sites and runs the configured Playwright projects. Site availability can affect results. Report exactly what was run and its outcome; do not claim checks passed if they were not run.
- Do not claim Selenium execution is verified unless Java and Maven were available and the legacy suite was actually run.
