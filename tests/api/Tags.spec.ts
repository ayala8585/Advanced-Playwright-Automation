import { test, expect } from '@playwright/test';
import { DocsApi } from '../../api/DocsApi';
import { TagsApi } from '../../api/TagsApi';

test.describe('API: Media & Tags Management', () => {
    let docsApi: DocsApi;
    let tagsApi: TagsApi;
    let fileIdToDelete: string | null = null;

    test.beforeEach(async ({ request }) => {
        docsApi = new DocsApi(request);
        tagsApi = new TagsApi(request);
    });

    test.afterEach(async () => {
        if (fileIdToDelete) {
            console.log(`Cleaning up file: ${fileIdToDelete}`);

            await docsApi.deleteDocument({
                org_id: '6733306465383e58c9b88306',
                project_id: '6882198cb753d1caf456e694',
                file_id: fileIdToDelete
            });

            fileIdToDelete = null;
        }
    });

    test('should upload a file and add a new tag successfully', async () => {
        const timeStamp = new Date().getTime();
        const tagName = `Tag_${timeStamp}`;
        
        const filePayload = {
            org_id: "6733306465383e58c9b88306",
            project_id: "6882198cb753d1caf456e694",
            product: "KalMedia",
            name: `Auto_Test_${timeStamp}.jpg`,
            file: {
                name: `Auto_Test_${timeStamp}.jpg`,
                mimeType: 'image/jpeg',
                buffer: Buffer.from('fake-image-content'),
            }
        };

        const uploadResponse = await docsApi.uploadDocument(filePayload);
        const uploadBody = await uploadResponse.json();
        fileIdToDelete = uploadBody.file_id;

        const tagResponse = await tagsApi.updateTag("", tagName, fileIdToDelete!, 'add');
        expect(tagResponse.ok()).toBeTruthy();
    });

    test.skip('should not allow adding a tag with an empty name', async () => {
        const timeStamp = new Date().getTime();
        
        const filePayload = {
            org_id: "6733306465383e58c9b88306",
            project_id: "6882198cb753d1caf456e694",
            product: "KalMedia",
            name: `Empty_Tag_Test_${timeStamp}.jpg`,
            file: {
                name: `test_${timeStamp}.jpg`,
                mimeType: 'image/jpeg',
                buffer: Buffer.from('fake-image-content'),
            }
        };
        const uploadResponse = await docsApi.uploadDocument(filePayload);
        const uploadBody = await uploadResponse.json();
        fileIdToDelete = uploadBody.file_id;

        const tagResponse = await tagsApi.updateTag("", "", fileIdToDelete!, 'add');
        expect(tagResponse.status()).toBe(422);
    });

    test.skip('should not allow adding a duplicate tag to the same file', async () => {
        const timeStamp = new Date().getTime();
        const tagName = `DuplicateTag_${timeStamp}`;
        
        const filePayload = {
            org_id: "6733306465383e58c9b88306",
            project_id: "6882198cb753d1caf456e694",
            product: "KalMedia",
            name: `Dup_Test_${timeStamp}.jpg`,
            file: {
                name: `test_${timeStamp}.jpg`,
                mimeType: 'image/jpeg',
                buffer: Buffer.from('fake-image-content'),
            }
        };
        const uploadResponse = await docsApi.uploadDocument(filePayload);
        const uploadBody = await uploadResponse.json();
        fileIdToDelete = uploadBody.file_id;

        await tagsApi.updateTag("", tagName, fileIdToDelete!, 'add');

        const duplicateResponse = await tagsApi.updateTag("", tagName, fileIdToDelete!, 'add');
        expect(duplicateResponse.status()).toBe(400);
    });
});