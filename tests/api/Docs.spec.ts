import { test, expect } from '@playwright/test';
import { DocsApi } from '../../api/DocsApi';

/**
 * Global Configuration for all tests in this file
 */
const COMMON_CONFIG = {
    project_id: '678519dc23391a969cd9b76a',
    org_id: '6733306465383e58c9b88306'
};

test.describe('Documents API - Lifecycle & Validation', () => {
    let docsApi: DocsApi;
    let createdDocIds: string[] = [];

    /**
     * Helper to generate a standardized Word payload
     * @param fileName The name of the file
     * @param includeProduct Whether to include the 'product' field (default: true)
     */
    const getWordPayload = (fileName: string, product: string | null = 'KalDocs') => {
        const payload: any = {
            ...COMMON_CONFIG,
            name: fileName,
            file: {
                name: fileName,
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                buffer: Buffer.from('Automated test content')
            }
        };

        if (product) {
            payload.product = product;
        }

        return payload;
    };

    test.beforeEach(async ({ request }) => {
        docsApi = new DocsApi(request);
        createdDocIds = [];
    });

    test.afterEach(async () => {
        for (const id of createdDocIds) {
            await docsApi.deleteDocument({
                ...COMMON_CONFIG,
                file_id: id,
            }).catch(err =>
                console.error(`Cleanup failed for ID ${id}:`, err.message)
            );
        }
    });

    test('Positive: Upload document with product and verify creation', async () => {
        const fileName = `Positive_Test_${Date.now()}.docx`;
        const payload = getWordPayload(fileName);

        await test.step('Upload a new document', async () => {
            const res = await docsApi.uploadDocument(payload);
            expect(res.ok).toBeTruthy();

            const body = await res.json();
            expect(body).toHaveProperty('file_id');
            createdDocIds.push(body.file_id);
        });
    });

    test('Negative: Upload document without product field', async () => {
        const fileName = `Negative_NoProduct_${Date.now()}.docx`;
        const payload = getWordPayload(fileName, null);

        await test.step('Attempt upload without product and expect failure', async () => {
            const res = await docsApi.uploadDocument(payload, 422);

            expect(res.status()).toBe(422);

            const errorBody = await res.json();
            console.log('Received expected error for missing product:', errorBody);
        });
    });

    test('Negative: Upload unsupported file type (TXT)', async () => {
        const fileName = `Unsupported_${Date.now()}.txt`;
        const payload = {
            ...COMMON_CONFIG,
            product: 'KalDocs',
            name: fileName,
            file: {
                name: fileName,
                mimeType: 'text/plain',
                buffer: Buffer.from('This should fail')
            }
        };

        await test.step('Attempt to upload TXT and expect failure', async () => {
            const res = await docsApi.uploadDocument(payload, 400);
            expect(res.ok()).toBeFalsy();
        });
    });
});