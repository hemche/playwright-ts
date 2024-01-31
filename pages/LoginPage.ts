import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly content: Locator;
  readonly logoutButton: Locator;
  readonly topNotification: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.username = this.testID('username');
    this.password = this.testID('password');
    this.loginButton = this.button('Login');
    this.content = this.testID('content');
    this.logoutButton = this.locator('i:has-text("Logout")');
    this.topNotification = this.testID('flash');
  }
}
