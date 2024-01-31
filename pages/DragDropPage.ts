import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DragDropPage extends BasePage {
  readonly page: Page;
  readonly box1: Locator;
  readonly box2: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.box1 = this.testID('column-a');
    this.box2 = this.testID('column-b');
  }
}
