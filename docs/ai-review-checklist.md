# AI migration review checklist

## Before sharing

- [ ] Am I allowed to share this code with this model/service?
- [ ] Did I remove secrets, customer data, internal URLs, and irrelevant files?
- [ ] Did I provide enough sanitized DOM/accessibility evidence to avoid invented locators?

## Review the conversion

- [ ] Is the original business intent preserved?
- [ ] Were the meaningful assertions preserved or improved?
- [ ] Did AI introduce `page.waitForTimeout`, fixed sleeps, or polling?
- [ ] Are locators semantic, stable, and scoped when controls repeat?
- [ ] Are all browser actions awaited and TypeScript types strict?
- [ ] Is test state isolated and cleanup reliable?
- [ ] Are credentials provided through approved environment/configuration?
- [ ] Is the page object/fixture layer useful without hiding test intent?

## Confirm with evidence

- [ ] Did I execute the generated test against the intended public test site?
- [ ] Did I inspect trace, screenshot, or report when a test failed?
- [ ] Did I compare coverage and outcomes with the Selenium source?
- [ ] Did I record model, prompt, review changes, and actual run result?

AI output is a draft. A reviewed diff plus an observed run is the migration evidence.
