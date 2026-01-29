
import { test, expect, BrowserContext, Page } from '@playwright/test';
import { SideBar } from '../../page-objects/components/SideBar';
import { SideBarTab } from '../../page-objects/components/SideBarTab';
import { Docs } from '../../page-objects/pages/Docs';
import { LoginPage } from '../../page-objects/pages/LoginPage';
import { DocsApi } from '../../api/DocsApi';

const COMMON_CONFIG = {
    project_id: '678519dc23391a969cd9b76a',
    org_id: '6733306465383e58c9b88306'
};

test.describe('Medical Documents Upload Suite', () => {
    let context: BrowserContext;
    let page: Page;
    let docsPage: Docs;
    let sideBar: SideBar;
    let docsApi: DocsApi; 
    let createdDocIds: string[] = []; 

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        page = await context.newPage();
        sideBar = new SideBar(page);

        const loginPage = new LoginPage(page);
        await loginPage.login();
        docsPage = await sideBar.navigateTo(SideBarTab.Docs) as Docs;
    });

    test.beforeEach(async ({ request }) => {
        docsApi = new DocsApi(request);
    });

test.afterAll(async () => {
        for (const id of createdDocIds) {
            await docsApi.deleteDocument(id).catch(err => 
                console.error(`Cleanup failed for ID ${id}:`, err.message)
            );
        }
        await context.close();
    });

    test('Create and upload document via UI', async () => {
        const timeStamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const fileName = `General_${timeStamp}.docx`;
        const myFileData = {
            name: fileName,
            buffer: Buffer.from('Automated test content')
        };

        await test.step('Upload general document via UI', async () => {
            await docsPage.uploadFile('General docs', myFileData);
        });

        await test.step('Verify and collect ID via API', async () => {
            await expect.poll(async () => {
                return await docsPage.isSuccessMessageVisible();
            }, { timeout: 10000 }).toBe(true);

            const docsList = await docsApi.getAllDocuments();
            const uploadedFile = docsList.find((doc: any) => doc.name === fileName);
            
            if (uploadedFile?.id) {
                createdDocIds.push(uploadedFile.id);
                console.log(`Successfully collected ID for cleanup: ${uploadedFile.id}`);
            }
        });

        await test.step('Verify file in UI list', async () => {
            await expect.poll(async () => {
                return await docsPage.isFileUploaded(fileName);
            }, { timeout: 15000 }).toBe(true);
        });
    });
});