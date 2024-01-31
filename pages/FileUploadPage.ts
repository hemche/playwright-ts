import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class FileUploadPage extends BasePage {
  readonly page: Page;
  readonly chooseFile: Locator;
  readonly upload: Locator;
  readonly uploadedFileName: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.chooseFile = this.testID('file-upload');
    this.upload = this.testID('file-submit');
    this.uploadedFileName = this.testID('uploaded-files');
  }
}
