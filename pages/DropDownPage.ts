import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DropDownPage extends BasePage {
  readonly page: Page;
  readonly dropDown: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.dropDown = this.testID('dropdown');
  }
}
