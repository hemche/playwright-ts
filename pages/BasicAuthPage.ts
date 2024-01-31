import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class BasicAuthPage extends BasePage {
  readonly page: Page;
  readonly content: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.content = this.testID('content');
  }
}
