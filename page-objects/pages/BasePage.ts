import { Page } from '@playwright/test';

abstract class BasePage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}

export default BasePage;
