import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly page: Page;
  readonly basicAuth: Locator;
  readonly checkBoxes: Locator;
  readonly dragAndDrop: Locator;
  readonly dropDown: Locator;
  readonly fileDownload: Locator;
  readonly fileUpload: Locator;
  readonly floatingMenu: Locator;
  readonly forgotPassword: Locator;
  readonly formAuthentication: Locator;
  readonly geoLocation: Locator;
  readonly horizontalSlider: Locator;
  readonly hovers: Locator;
  readonly infiniteScroll: Locator;
  readonly inputs: Locator;
  readonly javascriptAlerts: Locator;
  readonly multipleWindows: Locator;
  readonly slowResources: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.basicAuth = this.text('Basic Auth');
    this.checkBoxes = this.text('Checkboxes');
    this.dragAndDrop = this.text('Drag and Drop');
    this.dropDown = this.text('Dropdown');
    this.fileDownload = this.text('File Download');
    this.fileUpload = this.text('File Upload');
    this.floatingMenu = this.text('Floating Menu');
    this.forgotPassword = this.text('Forgot Password');
    this.formAuthentication = this.text('Form Authentication');
    this.geoLocation = this.text('Geolocation');
    this.horizontalSlider = this.text('Horizontal Slider');
    this.hovers = this.text('Hovers');
    this.infiniteScroll = this.text('Infinite Scroll');
    this.inputs = this.text('Inputs');
    this.javascriptAlerts = this.text('JavaScript Alerts');
    this.multipleWindows = this.text('Multiple Windows');
    this.slowResources = this.text('Slow Resources');
  }
}
