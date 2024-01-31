import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  testID(testId: string) {
    return this.page.getByTestId(testId);
  }
  locator(locator: string) {
    return this.page.locator(locator);
  }
  button(label: string) {
    return this.page.getByRole('button', { name: `${label}` });
  }
  label(label: string) {
    return this.page.getByLabel(label);
  }

  text(label: string) {
    return this.page.getByText(label);
  }

  placeHolder(label: string) {
    return this.page.getByPlaceholder(label);
  }

  clipboardText = async () => {
    const text = await this.page.evaluate('navigator.clipboard.readText()');
    return text;
  };

  scrollToBottom() {
    return this.page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight)
    );
  }
}
