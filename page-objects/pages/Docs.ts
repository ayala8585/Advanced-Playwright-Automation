import { Locator, Page } from '@playwright/test';
import BasePage from './BasePage';

export class Docs extends BasePage {

    private readonly uploadBtn: Locator;
    private readonly fileInput: Locator;
    private readonly SuccessMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.uploadBtn = page.getByTestId('upload');
        this.fileInput = page.locator('input[type="file"]');
        this.SuccessMessage = page.getByText('Files uploaded successfully')
    }


    async selectDocType(type: string) {
        await this.page.getByTestId('agent-select').click();
        await this.page.getByText(type).click();
    }

    /**
    * Navigates to a specific tab via the Sidebar and returns the corresponding Page Object.
    * @param fileType - The name of the tab as defined in SidebarTab enum
    */
    async uploadFile(fileType: 'Tables' | 'Medical docs' | 'General docs', fileData: string | { name: string, buffer: Buffer }) {
        await this.uploadBtn.click();
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.selectDocType(fileType);

        const fileChooser = await fileChooserPromise;

        if (typeof fileData === 'string') {
            await fileChooser.setFiles(fileData);
        } else {
            await fileChooser.setFiles([{
                name: fileData.name,
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                buffer: fileData.buffer
            }]);
        }
    }

    async isFileUploaded(fileName: string): Promise<boolean> {
        const newFileLocator = this.page.locator(`[data-testid*="${fileName}"]`).first();
        return await newFileLocator.isVisible();
    }

    async isSuccessMessageVisible(): Promise<boolean> {
        return await this.SuccessMessage.isVisible();
    }
}