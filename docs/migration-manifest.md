# Selenium Java to Playwright TypeScript mapping

The modernization story begins with observable Selenium debt, applies a reviewed migration, and ends with repeatable results and useful visibility. This table maps concepts; it does not imply mechanical one-for-one conversion.

| Selenium Java + TestNG | Playwright Test + TypeScript | Migration rationale |
|---|---|---|
| `WebDriver` | `Page` (within `BrowserContext`) | Contexts isolate cookies and storage; pages model tabs. |
| `WebElement` | `Locator` | A locator is lazy and resolves when an action/assertion runs. |
| `By.id`, `By.xpath` | `getByTestId`, `getByRole`, `getByLabel`, `getByText` | Prefer user-visible, resilient contracts over DOM paths. |
| `driver.get(url)` | `page.goto(url)` | Navigation is asynchronous and awaited. |
| `sendKeys` / `click` | `fill` / `click` | Playwright actions auto-wait for actionability. |
| `Thread.sleep` / explicit wait | `expect(locator).toBeVisible()` | Assertions retry until success or the configured timeout. |
| `@Test` | `test()` | Test functions provide isolated browser fixtures. |
| `@BeforeMethod` / `@AfterMethod` | fixtures / `test.beforeEach` / `test.afterEach` | Managed lifecycle is easier to compose and clean up. |
| `@DataProvider` | parameterized test cases / arrays | Each case can be reported independently. |
| TestNG groups | title tags such as `@smoke` and `--grep` | Select named slices in local and CI runs. |
| Maven / `pom.xml` | npm / `package.json` | Dependencies and commands match each ecosystem. |
| TestNG / Surefire output | HTML, JUnit, custom reporter | Human and CI systems consume the same run. |

## Modernization sequence

1. **Legacy Selenium implementation:** run the examples and identify sleeps, brittle selectors, and repeated sign-in.
2. **Technical debt discovery:** record why each pattern is fragile and preserve the original business assertion.
3. **AI-assisted migration:** use a scoped prompt; choose cloud or local processing based on data policy.
4. **Playwright modernization:** migrate to async locators, fixtures, isolated contexts, and web-first assertions.
5. **Reporting and visibility:** retain HTML/JUnit output and produce a Jira-shaped JSON handoff without API credentials.
6. **Business outcomes:** compare execution time, flake rate, and maintenance effort before and after.
