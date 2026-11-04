# Cloud AI: Selenium to Playwright migration prompt

Use this prompt with GPT-4o, Claude, Cursor, or Copilot Chat. Send only code you are permitted to share with the selected service.

```text
Act as a senior test automation engineer. Migrate the supplied Selenium Java + TestNG test to Playwright Test + TypeScript.

Return complete, compilable TypeScript and briefly explain preserved business intent and changed synchronization/locators.
Use strict TypeScript, async/await, @playwright/test, reusable page/fixture layers where useful, and web-first expect assertions.
Prefer getByTestId, then getByRole, getByLabel, getByText, CSS, and XPath only as a last resort.
Do not use page.waitForTimeout, Thread.sleep equivalents, positional XPath, arbitrary polling, swallowed errors, or invented selectors.
Preserve meaningful assertions and test coverage. Ask for missing page behavior instead of guessing.
Flag credentials or sensitive data; never copy them into generated code. Use environment variables or fixtures.

Source test:
<paste one approved test here>
Relevant page HTML or accessible names:
<paste a sanitized, minimal example here>
```

## Human review checkpoint

Review the output against `../docs/ai-review-checklist.md`, compare the old and new test intent, then execute it against the public demo site. AI output is a draft, not evidence of a passing migration.
