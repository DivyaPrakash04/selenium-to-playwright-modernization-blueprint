import { test as setup, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import { LoginPage } from '../pages/LoginPage';

const authFile = path.join(__dirname, '../../.auth/user.json');

setup('authenticate shared demo user', async ({page}) => {
  const username = process.env.SAUCE_USERNAME ?? 'standard_user';
  const password = process.env.SAUCE_PASSWORD ?? 'secret_sauce';
  const login = new LoginPage(page);
  await login.open();
  await login.login(username, password);
  await expect(page.getByText('Products', {exact: true})).toBeVisible();
  await fs.mkdir(path.dirname(authFile), {recursive: true});
  await page.context().storageState({path: authFile});
});
