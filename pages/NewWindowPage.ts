import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class NewWindowPage extends BasePage {
  readonly page: Page;
  readonly clickHere: Locator;
  readonly newWindowText: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.clickHere = this.text('Click Here');
    this.newWindowText = this.text('New Window');
  }
}
