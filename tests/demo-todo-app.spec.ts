import { test, expect, type Page } from '@playwright/test';
import { ToDoPage } from '../pages/ToDoPage';

test.beforeEach(async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
});

const TODO_ITEMS = [
  'buy some cheese',
  'feed the cat',
  'book a doctors appointment'
];

test.describe('New Todo', () => {
  test('should allow me to add todo items', async ({ page }) => {
    const todoPage = new ToDoPage(page);
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo.
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Make sure the list only has one todo item.
    await expect(todoPage.todolist).toHaveText([TODO_ITEMS[0]]);

    // Create 2nd todo.
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');

    // Make sure the list now has two todo items.
    await expect(todoPage.todolist).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);

    await checkNumberOfTodosInLocalStorage(page, 2);
  });

  test('should clear text input field when an item is added', async ({
    page
  }) => {
    const todoPage = new ToDoPage(page);

    // Create one todo item.
    await todoPage.newTodo.fill(TODO_ITEMS[0]);
    await todoPage.newTodo.press('Enter');

    // Check that input is empty.
    await expect(todoPage.newTodo).toBeEmpty();
    await checkNumberOfTodosInLocalStorage(page, 1);
  });

  test('should append new items to the bottom of the list', async ({
    page
  }) => {
    const todoPage = new ToDoPage(page);

    // Create 3 items.
    await createDefaultTodos(page);

    // Check test using different methods.
    await expect(page.getByText('3 items left')).toBeVisible();
    await expect(todoPage.todoCount).toHaveText('3 items left');
    await expect(todoPage.todoCount).toContainText('3');
    await expect(todoPage.todoCount).toHaveText(/3/);

    // Check all items in one call.
    await expect(todoPage.todolist).toHaveText(TODO_ITEMS);
    await checkNumberOfTodosInLocalStorage(page, 3);
  });
});

test.describe('Mark all as completed', () => {
  test.beforeEach(async ({ page }) => {
    await createDefaultTodos(page);
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test.afterEach(async ({ page }) => {
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test('should allow me to mark all items as completed', async ({ page }) => {
    const todoPage = new ToDoPage(page);

    // Complete all todos.
    await todoPage.markAllAsComplete.check();

    // Ensure all todos have 'completed' class.
    await expect(todoPage.todoItem).toHaveClass([
      'completed',
      'completed',
      'completed'
    ]);
    await checkNumberOfCompletedTodosInLocalStorage(page, 3);
  });

  test('should allow me to clear the complete state of all items', async ({
    page
  }) => {
    const todoPage = new ToDoPage(page);

    // Check and then immediately uncheck.
    await todoPage.markAllAsComplete.check();
    await todoPage.markAllAsComplete.uncheck();

    // Should be no completed classes.
    await expect(todoPage.todoItem).toHaveClass(['', '', '']);
  });

  test('complete all checkbox should update state when items are completed / cleared', async ({
    page
  }) => {
    const todoPage = new ToDoPage(page);
    await todoPage.markAllAsComplete.check();
    await expect(todoPage.markAllAsComplete).toBeChecked();
    await checkNumberOfCompletedTodosInLocalStorage(page, 3);

    // Uncheck first todo.
    const firstTodo = todoPage.todoItem.nth(0);
    await firstTodo.getByRole('checkbox').uncheck();

    // Reuse toggleAll locator and make sure its not checked.
    await expect(todoPage.markAllAsComplete).not.toBeChecked();

    await firstTodo.getByRole('checkbox').check();
    await checkNumberOfCompletedTodosInLocalStorage(page, 3);

    // Assert the toggle all is checked again.
    await expect(todoPage.markAllAsComplete).toBeChecked();
  });
});

test.describe('Item', () => {
  test('should allow me to mark items as complete', async ({ page }) => {
    const todoPage = new ToDoPage(page);

    // Create two items.
    for (const item of TODO_ITEMS.slice(0, 2)) {
      await todoPage.newTodo.fill(item);
      await todoPage.newTodo.press('Enter');
    }

    // Check first item.
    const firstTodo = todoPage.todoItem.nth(0);
    await firstTodo.getByRole('checkbox').check();
    await expect(firstTodo).toHaveClass('completed');

    // Check second item.
    const secondTodo = todoPage.todoItem.nth(1);
    await expect(secondTodo).not.toHaveClass('completed');
    await secondTodo.getByRole('checkbox').check();

    // Assert completed class.
    await expect(firstTodo).toHaveClass('completed');
    await expect(secondTodo).toHaveClass('completed');
  });

  test('should allow me to un-mark items as complete', async ({ page }) => {
    const todoPage = new ToDoPage(page);

    // Create two items.
    for (const item of TODO_ITEMS.slice(0, 2)) {
      await todoPage.newTodo.fill(item);
      await todoPage.newTodo.press('Enter');
    }

    const firstTodo = todoPage.todoItem.nth(0);
    const secondTodo = todoPage.todoItem.nth(1);
    const firstTodoCheckbox = firstTodo.getByRole('checkbox');

    await firstTodoCheckbox.check();
    await expect(firstTodo).toHaveClass('completed');
    await expect(secondTodo).not.toHaveClass('completed');
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);

    await firstTodoCheckbox.uncheck();
    await expect(firstTodo).not.toHaveClass('completed');
    await expect(secondTodo).not.toHaveClass('completed');
    await checkNumberOfCompletedTodosInLocalStorage(page, 0);
  });

  test('should allow me to edit an item', async ({ page }) => {
    await createDefaultTodos(page);
    const todoPage = new ToDoPage(page);

    const secondTodo = todoPage.todoItem.nth(1);
    await secondTodo.dblclick();
    await expect(secondTodo.getByRole('textbox', { name: 'Edit' })).toHaveValue(
      TODO_ITEMS[1]
    );
    await secondTodo
      .getByRole('textbox', { name: 'Edit' })
      .fill('buy some sausages');
    await secondTodo.getByRole('textbox', { name: 'Edit' }).press('Enter');

    // Explicitly assert the new text value.
    await expect(todoPage.todoItem).toHaveText([
      TODO_ITEMS[0],
      'buy some sausages',
      TODO_ITEMS[2]
    ]);
    await checkTodosInLocalStorage(page, 'buy some sausages');
  });
});

test.describe('Editing', () => {
  test.beforeEach(async ({ page }) => {
    await createDefaultTodos(page);
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test('should hide other controls when editing', async ({ page }) => {
    const todoPage = new ToDoPage(page);

    const todoItem = todoPage.todoItem.nth(1);
    await todoItem.dblclick();
    await expect(todoItem.getByRole('checkbox')).toBeHidden();
    await expect(
      todoItem.locator('label', {
        hasText: TODO_ITEMS[1]
      })
    ).toBeHidden();
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test('should save edits on blur', async ({ page }) => {
    const todoPage = new ToDoPage(page);

    await todoPage.todoItem.nth(1).dblclick();
    await todoPage.todoItem
      .nth(1)
      .getByRole('textbox', { name: 'Edit' })
      .fill('buy some sausages');
    await todoPage.todoItem
      .nth(1)
      .getByRole('textbox', { name: 'Edit' })
      .dispatchEvent('blur');

    await expect(todoPage.todoItem).toHaveText([
      TODO_ITEMS[0],
      'buy some sausages',
      TODO_ITEMS[2]
    ]);
    await checkTodosInLocalStorage(page, 'buy some sausages');
  });

  test('should trim entered text', async ({ page }) => {
    const todoPage = new ToDoPage(page);

    await todoPage.todoItem.nth(1).dblclick();
    await todoPage.todoItem
      .nth(1)
      .getByRole('textbox', { name: 'Edit' })
      .fill('    buy some sausages    ');
    await todoPage.todoItem
      .nth(1)
      .getByRole('textbox', { name: 'Edit' })
      .press('Enter');

    await expect(todoPage.todoItem).toHaveText([
      TODO_ITEMS[0],
      'buy some sausages',
      TODO_ITEMS[2]
    ]);
    await checkTodosInLocalStorage(page, 'buy some sausages');
  });

  test('should remove the item if an empty text string was entered', async ({
    page
  }) => {
    const todoPage = new ToDoPage(page);

    await todoPage.todoItem.nth(1).dblclick();
    await todoPage.todoItem
      .nth(1)
      .getByRole('textbox', { name: 'Edit' })
      .fill('');
    await todoPage.todoItem
      .nth(1)
      .getByRole('textbox', { name: 'Edit' })
      .press('Enter');

    await expect(todoPage.todoItem).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });

  test('should cancel edits on escape', async ({ page }) => {
    const todoPage = new ToDoPage(page);
    await todoPage.todoItem.nth(1).dblclick();
    await todoPage.todoItem
      .nth(1)
      .getByRole('textbox', { name: 'Edit' })
      .fill('buy some sausages');
    await todoPage.todoItem
      .nth(1)
      .getByRole('textbox', { name: 'Edit' })
      .press('Escape');
    await expect(todoPage.todoItem).toHaveText(TODO_ITEMS);
  });
});

test.describe('Counter', () => {
  test('should display the current number of todo items', async ({ page }) => {
    const todoPage = new ToDoPage(page);

    await todoPage.newTodo.fill(TODO_ITEMS[0]);
    await todoPage.newTodo.press('Enter');

    await expect(todoPage.todoCount).toContainText('1');

    await todoPage.newTodo.fill(TODO_ITEMS[1]);
    await todoPage.newTodo.press('Enter');
    await expect(todoPage.todoCount).toContainText('2');

    await checkNumberOfTodosInLocalStorage(page, 2);
  });
});

test.describe('Clear completed button', () => {
  test.beforeEach(async ({ page }) => {
    await createDefaultTodos(page);
  });

  test('should display the correct text', async ({ page }) => {
    const todoPage = new ToDoPage(page);

    await todoPage.selectListItemButton.first().check();
    await expect(todoPage.selectedListItemButton).toBeVisible();
  });

  test('should remove completed items when clicked', async ({ page }) => {
    const todoPage = new ToDoPage(page);

    await todoPage.todoItem.nth(1).getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Clear completed' }).click();
    await expect(todoPage.todoItem).toHaveCount(2);
    await expect(todoPage.todoItem).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });

  test('should be hidden when there are no items that are completed', async ({
    page
  }) => {
    const todoPage = new ToDoPage(page);

    await todoPage.selectListItemButton.first().check();
    await todoPage.selectedListItemButton.click();
    await expect(todoPage.selectedListItemButton).toBeHidden();
  });
});

test.describe('Persistence', () => {
  test('should persist its data', async ({ page }) => {
    const todoPage = new ToDoPage(page);

    for (const item of TODO_ITEMS.slice(0, 2)) {
      await todoPage.newTodo.fill(item);
      await todoPage.newTodo.press('Enter');
    }

    const firstTodoCheck = todoPage.todoItem.nth(0).getByRole('checkbox');
    await firstTodoCheck.check();
    await expect(todoPage.todoItem).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
    await expect(firstTodoCheck).toBeChecked();
    await expect(todoPage.todoItem).toHaveClass(['completed', '']);

    // Ensure there is 1 completed item.
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);

    // Now reload.
    await page.reload();
    await expect(todoPage.todoItem).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
    await expect(firstTodoCheck).toBeChecked();
    await expect(todoPage.todoItem).toHaveClass(['completed', '']);
  });
});

test.describe('Routing', () => {
  test.beforeEach(async ({ page }) => {
    await createDefaultTodos(page);
    // make sure the app had a chance to save updated todos in storage
    // before navigating to a new view, otherwise the items can get lost :(
    // in some frameworks like Durandal
    await checkTodosInLocalStorage(page, TODO_ITEMS[0]);
  });

  test('should allow me to display active items', async ({ page }) => {
    const todoPage = new ToDoPage(page);

    await todoPage.todoItem.nth(1).getByRole('checkbox').check();

    await checkNumberOfCompletedTodosInLocalStorage(page, 1);
    await todoPage.activeLink.click();
    await expect(todoPage.todoItem).toHaveCount(2);
    await expect(todoPage.todoItem).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });

  test('should respect the back button', async ({ page }) => {
    const todoPage = new ToDoPage(page);

    await todoPage.todoItem.nth(1).getByRole('checkbox').check();

    await checkNumberOfCompletedTodosInLocalStorage(page, 1);

    await test.step('Showing all items', async () => {
      await todoPage.all.click();
      await expect(todoPage.todoItem).toHaveCount(3);
    });

    await test.step('Showing active items', async () => {
      await todoPage.activeLink.click();
    });

    await test.step('Showing completed items', async () => {
      await todoPage.completed.click();
    });

    await expect(todoPage.todoItem).toHaveCount(1);
    await page.goBack();
    await expect(todoPage.todoItem).toHaveCount(2);
    await page.goBack();
    await expect(todoPage.todoItem).toHaveCount(3);
  });

  test('should allow me to display completed items', async ({ page }) => {
    const todoPage = new ToDoPage(page);

    await todoPage.todoItem.nth(1).getByRole('checkbox').check();
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);
    await todoPage.completed.click();
    await expect(todoPage.todoItem).toHaveCount(1);
  });

  test('should allow me to display all items', async ({ page }) => {
    const todoPage = new ToDoPage(page);

    await todoPage.todoItem.nth(1).getByRole('checkbox').check();
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);
    await todoPage.activeLink.click();
    await todoPage.completed.click();
    await todoPage.all.click();
    await expect(todoPage.todoItem).toHaveCount(3);
  });

  test('should highlight the currently applied filter', async ({ page }) => {
    const todoPage = new ToDoPage(page);

    await expect(todoPage.all).toHaveClass('selected');

    //create locators for active and completed links
    await todoPage.activeLink.click();

    // Page change - active items.
    await expect(todoPage.activeLink).toHaveClass('selected');
    await todoPage.completed.click();

    // Page change - completed items.
    await expect(todoPage.completed).toHaveClass('selected');
  });
});

async function createDefaultTodos(page: Page) {
  const todoPage = new ToDoPage(page);

  for (const item of TODO_ITEMS) {
    await todoPage.newTodo.fill(item);
    await todoPage.newTodo.press('Enter');
  }
}

async function checkNumberOfTodosInLocalStorage(page: Page, expected: number) {
  const noOfTodos = await page.waitForFunction(e => {
    return JSON.parse(localStorage['react-todos']).length === e;
  }, expected);
  return noOfTodos;
}

async function checkNumberOfCompletedTodosInLocalStorage(
  page: Page,
  expected: number
) {
  const noOfCompletedTodos = await page.waitForFunction(e => {
    return (
      JSON.parse(localStorage['react-todos']).filter(
        (todo: Record<string, unknown>) => todo.completed
      ).length === e
    );
  }, expected);
  return noOfCompletedTodos;
}

async function checkTodosInLocalStorage(page: Page, title: string) {
  const checkTodos = await page.waitForFunction(t => {
    return JSON.parse(localStorage['react-todos'])
      .map((todo: Record<string, unknown>) => todo.title)
      .includes(t);
  }, title);
  return checkTodos;
}
