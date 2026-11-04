# Local Ollama migration prompt

Use with a locally hosted coding model such as Qwen2.5-Coder, DeepSeek Coder, or Llama. Confirm model license and local data handling before use.

```text
Task: migrate the single Selenium Java test below to runnable Playwright Test TypeScript.
Output exactly two sections: MIGRATED CODE and REVIEW NOTES.
Use strict typing, async/await, accessible locators, and Playwright web-first assertions.
Never use page.waitForTimeout, fixed sleeps, positional XPath, guessed selectors, or TODO markers.
Keep the original test's business assertions. If information is missing, list the question instead of inventing behavior.
Do not repeat secrets in output. Replace any credential with process.env.SAUCE_USERNAME / process.env.SAUCE_PASSWORD.
Keep output compact: one test and only the page helper needed for it.

Selenium source:
<paste one small, approved test>
Sanitized DOM/accessibility information:
<paste only relevant page context>
```

## Small context workflow

1. Migrate one test at a time; include only the relevant Java method and page markup.
2. Keep a short glossary of app-specific names outside the model context.
3. Save the response, diff it with the source, and run the review checklist.
4. Re-run the same input after model/configuration changes and review differences. Deterministic output is an aim, not a guarantee.

Local processing reduces data transfer to a hosted model, but does not replace endpoint security, access controls, or license review.
