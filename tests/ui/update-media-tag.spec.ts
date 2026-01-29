import { test, BrowserContext, Page } from '@playwright/test';
import { SideBar } from '../../page-objects/components/SideBar';
import { SideBarTab } from '../../page-objects/components/SideBarTab';
import { Media } from '../../page-objects/pages/Media';
import { LoginPage } from '../../page-objects/pages/LoginPage';

test.describe('Media Tags Management Suite', () => {
    let context: BrowserContext;
    let page: Page;
    let mediaPage: Media;

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        page = await context.newPage();
        
        const loginPage = new LoginPage(page);
        const sideBar = new SideBar(page);

        await loginPage.login();

        mediaPage = await sideBar.navigateTo(SideBarTab.Media) as Media;

        await test.step('Navigate to Gallery tab', async () => {
            await mediaPage.switchTab('Gallery');
        });
    });

    test.afterAll(async () => {
        await context.close();
    });

    test('Edit and verify a new tag for an image', async () => {
        const timeStamp = new Date().getTime();
        const tagName = "TEST_Tag";

        await test.step('Select an image from the gallery', async () => {
            await mediaPage.selectImage();
        });

        await test.step('Edit image tags and save changes', async () => {
            await mediaPage.editImageTags(`${tagName}_${timeStamp}`);
        });

        await test.step('Verify the new tag name is displayed', async () => {
            const isVisible = await mediaPage.verifyTagExists(`${tagName}_${timeStamp}`);
            test.expect(isVisible).toBe(true);
        });

        await test.step('Verify success message is displayed', async () => {
            const isVisible =  await mediaPage.verifySuccessMessageVisible();
            test.expect(isVisible).toBe(true);
        });
    });

});