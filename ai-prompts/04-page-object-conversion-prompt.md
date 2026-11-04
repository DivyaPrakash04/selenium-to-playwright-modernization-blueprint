# Page Object conversion prompt

```text
Convert the supplied Java Selenium Page Object into a concise TypeScript Playwright Page Object.
Use strict types, a constructor-injected Page, lazy Locator properties, async methods, and semantic locators.
Keep UI actions in the page object; keep business assertions in the spec unless a page-ready assertion is a clear page contract.
Do not add sleeps, arbitrary waits, guessed selectors, or unnecessary wrapper methods.
Preserve the public methods' intent and list any behavior that cannot be mapped from the supplied evidence.
Return complete imports and code, followed by a short migration note.

Java Page Object:
<paste one approved class>
Relevant sanitized DOM/accessibility context:
<paste page context>
```
