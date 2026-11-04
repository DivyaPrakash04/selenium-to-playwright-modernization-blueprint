import { expect, type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly heading: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    // SauceDemo renders its page title as a styled div, so text is the accessible option here.
    this.heading = page.getByText('Products', {exact: true});
    this.cartLink = page.getByRole('button', {name: /^Cart,/});
  }

  async expectLoaded(): Promise<void> { await expect(this.heading).toBeVisible(); }

  async addProduct(name: string): Promise<void> {
    const card = this.page.locator('.inventory_item').filter({hasText: name});
    // FIXED SMELL #2: scope to the product, then find its semantic button.
    await card.getByRole('button', {name: 'Add to cart'}).click();
  }

  async openCart(): Promise<void> { await this.cartLink.click(); }
}
