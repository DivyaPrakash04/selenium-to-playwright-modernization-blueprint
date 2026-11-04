import {test, expect} from '@playwright/test';

test.describe('the-internet public examples', () => {
  test('waits for dynamic loading without a fixed sleep', async ({page}) => {
    await page.goto('https://the-internet.herokuapp.com/dynamic_loading/2');
    await page.getByRole('button', {name: 'Start'}).click();
    // FIXED SMELL #3: a web-first assertion waits for the visible application state.
    await expect(page.getByText('Hello World!', {exact: true})).toBeVisible({timeout: 15_000});
  });

  test('shows dynamic content after refresh', async ({page}) => {
    await page.goto('https://the-internet.herokuapp.com/dynamic_content');
    const rows = page.locator('#content .row');
    await expect(rows).toHaveCount(4);
    await page.getByRole('link', {name: 'click here'}).click();
    await expect(rows).toHaveCount(4);
    await expect(rows.first()).toBeVisible();
  });

  test('handles an alert', async ({page}) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', {name: 'Click for JS Alert'}).click();
    await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');
  });

  test('captures a newly opened window', async ({page}) => {
    await page.goto('https://the-internet.herokuapp.com/windows');
    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('link', {name: 'Click Here'}).click();
    const popup = await popupPromise;
    await expect(popup.getByRole('heading', {name: 'New Window'})).toBeVisible();
  });
});
