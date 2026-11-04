import { test as base, expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';

type AppFixtures = {inventory: InventoryPage};

export const test = base.extend<AppFixtures>({
  inventory: async ({page}, use) => { await use(new InventoryPage(page)); }
});

export {expect};
