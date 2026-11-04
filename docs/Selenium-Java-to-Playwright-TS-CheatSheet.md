# Selenium Java → Playwright TypeScript Migration Cheat Sheet

**Fast rule:** Selenium *find → wait → act → assert* | Playwright *locate → act → expect*

> New to the example? Follow the [manual SauceDemo checkout walkthrough](../README.md#manual-walkthrough-run-the-checkout-by-hand), then compare it with the automated spec.

## 1. The 5 Mindset Shifts

| Selenium Java | Playwright TypeScript |
|---|---|
| `WebElement` is resolved now | `Locator` resolves when used |
| Manage explicit waits | Auto-wait actions + retrying assertions |
| Synchronous calls | `async` / `await` browser calls |
| Reuse a driver | Isolated `BrowserContext` per test |
| Assert after fixed action | Expect the user-visible outcome |

## 2. Setup & Execution Commands

| Selenium Java | Playwright TypeScript |
|---|---|
| `mvn test` | `npm test` |
| Run headed in IDE | `npm run test:headed` |
| TestNG group | `npm run test:smoke` |
| Debug in IDE | `npx playwright test --debug` |
| — | `npm run test:ui` |
| Surefire report | `npm run report` |
| `pom.xml` | `package.json` + `playwright.config.ts` |

## 3. TestNG → Playwright Test Mapping

| Selenium Java | Playwright TypeScript |
|---|---|
| `@Test` | `test('...', async ({page}) => {})` |
| `@BeforeMethod` | fixture / `test.beforeEach()` |
| `@AfterMethod` | fixture teardown / `test.afterEach()` |
| `@DataProvider` | test cases from arrays |
| Groups | title tags + `--grep` |
| Parallel methods | workers / projects |

## 4. WebDriver → Playwright API Mapping

| Selenium Java | Playwright TypeScript |
|---|---|
| `WebDriver` | `BrowserContext` + `Page` |
| `driver.get(url)` | `await page.goto(url)` |
| `WebElement.click()` | `await locator.click()` |
| `sendKeys(value)` | `await locator.fill(value)` |
| `driver.quit()` | Managed fixture cleanup |

## 5. Locator Migration Guide

| Selenium Java | Playwright TypeScript |
|---|---|
| `By.id(...)` / test hook | `getByTestId(...)` |
| XPath by role/text | `getByRole(role, {name})` |
| Label-based XPath | `getByLabel(...)` |
| Text XPath | `getByText(...)` |
| CSS | CSS locator (last stable fallback) |
| Positional XPath | **Avoid**; scope by product name and role |

**Priority:** test ID → role → label → text → CSS → XPath (last resort).

## 6. Waiting & Synchronization

| Selenium Java | Playwright TypeScript |
|---|---|
| 🔴 `Thread.sleep(5000)` | 🟢 `await expect(locator).toBeVisible()` |
| Custom polling loop | Expect the expected state/text/count |
| Wait for page load blindly | Wait for the meaningful UI condition |

## 7. Assertions Mapping

| Selenium Java / TestNG | Playwright TypeScript |
|---|---|
| `Assert.assertEquals(text, expected)` | `await expect(locator).toHaveText(expected)` |
| `Assert.assertTrue(isDisplayed())` | `await expect(locator).toBeVisible()` |
| Assert URL string | `await expect(page).toHaveURL(/checkout/)` |

## 8. Framework Architecture Shift

| Selenium Java | Playwright TypeScript |
|---|---|
| TestNG test classes | Specs (`src/tests`) |
| BaseTest / shared driver | Fixtures (`src/fixtures`) |
| PageFactory / element fields | Page classes with lazy `Locator`s |
| Maven/TestNG config | Playwright config + projects |
| Listener/report plugin | Reporter (`src/reporters`) |

## 9. Common Migration Smells

| 🔴 Anti-pattern | Why it hurts | 🟢 Playwright replacement |
|---|---|---|
| `Thread.sleep` | Slow and timing-sensitive | Web-first `expect` assertion |
| Positional XPath | Breaks when DOM order changes | Role/name or scoped locator |
| Shared mutable driver | Leaks cookies and page state | Per-test context and fixtures |
| Hardcoded private secrets | Leaks credentials | Environment variables / secret store |
| Utility wrappers for every action | Hides native behavior | Direct Playwright API where clear |
| Swallowed exceptions | Hides real failures | Let test fail with trace/report evidence |

## 10. AI-Assisted Migration Tips

| Selenium Java input | Playwright TypeScript output |
|---|---|
| One test + relevant page context | One complete, typed migration |
| Sanitized DOM/accessibility details | Evidence-backed semantic locators |
| Explicit behavior/assertions | Preserved business intent |
| Approved cloud service | Fast iteration on permitted code |
| Restricted source / offline need | Local model + small context |

Always review generated code and run it. AI does not prove correctness.

## 11. Migration Review Checklist

- [ ] Business intent and assertions preserved?
- [ ] No `page.waitForTimeout`, fixed sleeps, or polling?
- [ ] Locators semantic, stable, and scoped?
- [ ] Every async browser operation awaited?
- [ ] State isolated; credentials handled safely?
- [ ] Test executed; failure artifacts/report reviewed?

See [full review checklist](ai-review-checklist.md) and [migration manifest](migration-manifest.md).
