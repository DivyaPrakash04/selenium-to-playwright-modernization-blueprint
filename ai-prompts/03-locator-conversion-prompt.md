# Locator conversion prompt

```text
Convert these Selenium Java locators into Playwright TypeScript locator expressions.
Use this priority: getByTestId, getByRole, getByLabel, getByText, CSS, XPath only when no stable semantic option exists.
Do not assume a role/name that is not supported by the supplied HTML or accessibility information.
For every conversion, return: Java locator | TypeScript locator | reason | confidence or missing evidence.
Avoid index-based selection and positional XPath. Scope repeated controls to a named product/card where possible.

Selenium locators:
<paste locators>
Relevant sanitized DOM/accessibility context:
<paste only relevant markup or names>
```

Review each proposed selector in the browser and assert uniqueness when the page contract expects one match.
