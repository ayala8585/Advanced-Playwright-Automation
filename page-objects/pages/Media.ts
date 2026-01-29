import { Locator, Page, expect } from '@playwright/test';
import BasePage from './BasePage';

export type MediaTab = 'Gallery' | 'Albums' | 'People';

export class Media extends BasePage {

    private readonly editTagsBtn: Locator;
    private readonly tagInput: Locator;
    private readonly saveTagsBtn: Locator;
    private readonly albumTag: Locator;
    private readonly modalContainer: Locator;

    constructor(page: Page) {
        super(page);

        this.editTagsBtn = page.locator('[class*="editIconWrapper"] svg');

        this.tagInput = page.getByPlaceholder('Type Tag');

        this.saveTagsBtn = page.getByTestId('save-tags');

        this.albumTag = page.locator('[class*="TagModal_albumTag"]');
        this.modalContainer = page.locator('[class*="GlobalModal_modal"]');

    }

    /**
     * General function to switch between tabs in sub bar
     * @param tabName - tab name to switch to
     */
    async switchTab(tabName: 'Gallery' | 'Albums' | 'People'): Promise<void> {
        const tab = this.page.getByTestId('Media-files');
        await tab.click();
    }



    /**
     * Selects the first image object in the list.
     */
    async selectImage() {
        const imageRegex = /\.(jpg|jpeg|png)/i;

        const fileLocator = this.page.getByTestId(imageRegex).first();
        const count = await fileLocator.count();
        console.log(`Found ${count} matching image(s) via TestID`);

        await fileLocator.dblclick();
    }

    /**
     * Edits the tags of a selected image via the side panel
     * @param newTagName A string of tag name
     */
    async editImageTags(newTagName: string) {
        await this.editTagsBtn.nth(1).click();

        await this.modalContainer.waitFor({ state: 'visible' });

        const tagInModal = this.modalContainer.locator('[class*="TagModal_tagItem"]').first();
        await tagInModal.dblclick();
      
        await this.tagInput.fill(newTagName);

        await this.page.keyboard.press('Enter');

        await this.saveTagsBtn.click();

        await expect(this.saveTagsBtn).not.toBeVisible();
    }

    /**
     * Verifies that a specific tag is visible on the screen
     * @param tagName The text of the tag to verify
     */
    async verifyTagExists(tagName: string) {
        const tag = this.page.getByText(tagName, { exact: false });
        await expect(tag).toBeVisible();
    }

    /**
     * Checks if the success message "Tags updated successfully" is visible on the screen.
     * @returns {Promise<boolean>} True if the message is visible, otherwise false.
     */
    async verifySuccessMessageVisible(): Promise<boolean> {
        const successMessage = this.page.getByText('Tags updated successfully');
        return await successMessage.isVisible();
    }
}