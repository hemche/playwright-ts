import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ToDoPage extends BasePage {
  readonly page: Page;
  readonly todolist: Locator;
  readonly newTodo: Locator;
  readonly todoCount: Locator;
  readonly markAllAsComplete: Locator;
  readonly todoItem: Locator;
  readonly selectListItemButton: Locator;
  readonly selectedListItemButton: Locator;
  readonly activeLink: Locator;
  readonly completed: Locator;
  readonly all: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.todolist = this.locator('//label[@data-testid="todo-title"]');
    this.newTodo = this.page.getByPlaceholder('What needs to be done?');
    this.todoCount = page.locator('//span[@data-testid="todo-count"]');
    this.markAllAsComplete = page.getByLabel('Mark all as complete');
    this.todoItem = page.locator('//li[@data-testid="todo-item"]');
    this.selectListItemButton = page.locator('.todo-list li .toggle');
    this.selectedListItemButton = page.getByRole('button', {
      name: 'Clear completed'
    });
    this.activeLink = page.getByRole('link', { name: 'Active' });
    this.completed = page.getByRole('link', { name: 'Completed' });
    this.all = page.getByRole('link', { name: 'All' });
  }
}
