import { Page } from '@playwright/test';
import { SideBarTab } from './SideBarTab';
import { Docs } from '../pages/Docs';
import { Media } from '../pages/Media';

export class SideBar {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateTo(tab: SideBarTab) {

        await this.page.getByLabel(tab, { exact: false }).click();

        switch (tab) {
            case SideBarTab.Docs: return new Docs(this.page);
            case SideBarTab.Media: return new Media(this.page);
            default:
                throw new Error(`No class found for tab: ${tab}`);
        }
    }
}