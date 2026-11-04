import {test, expect} from '../fixtures/authFixture';

test('authenticated user sees the inventory @smoke', async ({page, inventory}) => {
  test.info().annotations.push({type: 'jira', description: 'INV-001'});
  test.info().annotations.push({type: 'label', description: 'smoke'});
  await page.goto('/inventory.html');
  await inventory.expectLoaded();
  await expect(page.locator('.inventory_item')).toHaveCount(6);
});

test('user can add a product and complete checkout', async ({page, inventory}) => {
  await page.goto('/inventory.html');
  await inventory.addProduct('Sauce Labs Backpack');
  await inventory.openCart();
  await expect(page.getByText('Your Cart', {exact: true})).toBeVisible();
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  await page.getByRole('button', {name: 'Checkout'}).click();
  await page.getByLabel('First Name').fill('Taylor');
  await page.getByLabel('Last Name').fill('Tester');
  await page.getByLabel(/zip\/postal code/i).fill('10001');
  await page.getByRole('button', {name: 'Continue'}).click();
  await expect(page.getByText('Checkout: Overview', {exact: true})).toBeVisible();
  await page.getByRole('button', {name: 'Finish'}).click();
  await expect(page.getByRole('heading', {name: 'Thank you for your order!'})).toBeVisible();
});

test('login rejects invalid credentials', async ({browser}) => {
  const context = await browser.newContext({storageState: {cookies: [], origins: []}});
  const page = await context.newPage();
  await page.goto('https://www.saucedemo.com/');
  await page.getByLabel('Username').fill('invalid_user');
  await page.getByLabel('Password').fill('wrong_password');
  await page.getByRole('button', {name: 'Login'}).click();
  await expect(page.getByText(/username and password do not match/i)).toBeVisible();
  await context.close();
});
