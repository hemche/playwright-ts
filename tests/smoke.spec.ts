import { expect, test } from '@playwright/test';
import { FileUploadPage } from '../pages/FileUploadPage';
import { HomePage } from '../pages/HomePage';
import { BasicAuthPage } from '../pages/BasicAuthPage';
import { DragDropPage } from '../pages/DragDropPage';
import { DropDownPage } from '../pages/DropDownPage';
import { LoginPage } from '../pages/LoginPage';
import { NewWindowPage } from '../pages/NewWindowPage';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});
test('Verify Home Page title', async ({ page }) => {
  await expect(page).toHaveTitle('The Internet');
});

test('Verify API GET call', async ({ request }) => {
  const facts = await request.get(
    'https://uselessfacts.jsph.pl/api/v2/facts/random'
  );
  console.log(await facts.json());
  expect(facts.ok()).toBeTruthy();
});

test('Verify file upload', async ({ page }) => {
  const home = new HomePage(page);
  const fileupload = new FileUploadPage(page);
  await home.fileUpload.click();
  await fileupload.chooseFile.setInputFiles(
    './assets/images/playwright_image.svg'
  );
  await fileupload.upload.click();
  await expect(fileupload.uploadedFileName).toHaveText('playwright_image.svg');
  await expect(page.getByText('File Uploaded!')).toBeVisible();
});

test('Verify basic http authentication', async ({ browser }) => {
  const context = await browser.newContext({
    httpCredentials: {
      username: 'admin',
      password: 'admin'
    }
  });

  const page = await context.newPage();
  const home = new HomePage(page);
  const basicAuthPage = new BasicAuthPage(page);

  await page.goto('/');
  await home.basicAuth.click();
  await expect(basicAuthPage.content).toContainText(
    'Congratulations! You must have the proper credentials.'
  );
});

test('Verify drag and drop', async ({ page }) => {
  const home = new HomePage(page);
  const dragDropPage = new DragDropPage(page);

  await home.dragAndDrop.click();
  await expect(dragDropPage.box1).toHaveText('A');
  await expect(dragDropPage.box2).toHaveText('B');

  await dragDropPage.box1.dragTo(dragDropPage.box2);
  await expect(dragDropPage.box1).toHaveText('B');
  await expect(dragDropPage.box2).toHaveText('A');
});

test('Verify dropdown', async ({ page }) => {
  const home = new HomePage(page);
  const dropDownPage = new DropDownPage(page);

  await home.dropDown.click();

  await dropDownPage.dropDown.selectOption('Option 2');
  await expect(
    page.getByRole('option', { selected: true }),
    'Option 2 is not selected'
  ).toHaveText('Option 2');

  await dropDownPage.dropDown.selectOption('Option 1');
  await expect(
    page.getByRole('option', { selected: true }),
    'Option 1 is not selected'
  ).toHaveText('Option 1');
});

test('Verify login', async ({ page }) => {
  const home = new HomePage(page);
  const loginPage = new LoginPage(page);

  await home.formAuthentication.click();
  await loginPage.username.fill(process.env.USERNAME!);
  await loginPage.password.fill(process.env.PASSWORD!);
  await loginPage.loginButton.click();

  //Just an example to show that we can save the authenticated state and use it in other tests which require login
  const authFile = 'playwright/.auth/user.json';
  await page.context().storageState({ path: authFile });

  await expect(loginPage.topNotification).toContainText(
    'You logged into a secure area!'
  );
  await loginPage.logoutButton.click();
  await expect(loginPage.topNotification).toContainText(
    'You logged out of the secure area!'
  );
});

test('Verify api mocking', async ({ page }) => {
  // Mock the api call before navigating
  await page.route('*/**/api/v1/fruits', async route => {
    const json = [{ name: 'Blueberry', id: 21 }];
    await route.fulfill({ json });
  });
  // Go to the page
  await page.goto('https://demo.playwright.dev/api-mocking');

  // Assert that the Strawberry fruit is visible
  await expect(page.getByText('Blueberry')).toBeVisible();
});

test('Verify new page (Multiple windows)', async ({ page, context }) => {
  const home = new HomePage(page);
  const newWindowPage = new NewWindowPage(page);

  await home.multipleWindows.click();

  // Start waiting for new page before clicking. Note no await.
  const pagePromise = context.waitForEvent('page');
  await newWindowPage.clickHere.click();
  const newPage = await pagePromise;
  await newPage.waitForLoadState();
  await expect(newPage).toHaveTitle('New Window');
  await expect(newPage.getByText('New Window')).toBeVisible();
});
