import { APIRequestContext, APIResponse } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export class ApiBase {
    protected headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'org-id': '6733306465383e58c9b88306',
        'project-id': '678519dc23391a969cd9b76a',
        'Origin': 'https://kal-sense.prod.kaleidoo-dev.com',
        'Referer': 'https://kal-sense.prod.kaleidoo-dev.com/'
    };

    constructor(protected request: APIRequestContext) {
        this.initializeAuth();
    }

    private initializeAuth(): void {
        const authPath = path.resolve('playwright/.auth/user.json');
        if (fs.existsSync(authPath)) {
            try {
                const storage = JSON.parse(fs.readFileSync(authPath, 'utf-8'));
                const localStorage = storage.origins?.[0]?.localStorage || [];
                const tokenItem = localStorage.find((item: any) => item.name === 'raw_token');

                if (tokenItem?.value) {
                    this.headers['Authorization'] = `Bearer ${tokenItem.value}`;
                }
            } catch (error) {
                console.error('API Base: Auth initialization failed', error);
            }
        }
    }

    /**
     * Internal helper to clean headers for multipart/form-data requests.
     */
    private getMultipartHeaders() {
        const { 'Content-Type': _, ...rest } = this.headers;
        return rest;
    }

    protected async postRequest(endpoint: string, data: any, expectedStatus: Number): Promise<APIResponse> {
        const isMultipart = data?.file || data?.buffer;

        const response = await this.request.post(endpoint, {
            headers: isMultipart ? this.getMultipartHeaders() : this.headers,
            [isMultipart ? 'multipart' : 'data']: data
        });

        await this.validateResponse(response, 'POST', endpoint, expectedStatus);
        return response;
    }

    protected async getRequest(url: string, expectedStatus = 200): Promise<any> {
        const response = await this.request.get(url, { headers: this.headers });
        await this.validateResponse(response, 'GET', url, expectedStatus);
        return await response.json();
    }

    protected async deleteRequest(url: string, data?: any, expectedStatus = 200): Promise<APIResponse> {
        const response = await this.request.delete(url, {
            headers: this.headers,
            data: data
        });
        await this.validateResponse(response, 'DELETE', url, expectedStatus);
        return response;
    }

    private async validateResponse(response: APIResponse, method: string, url: string, expected: Number) {
        if (response.status() !== expected) {
            const errorText = await response.text().catch(() => 'No response body');
            throw new Error(`${method} ${url} failed. Expected ${expected}, got ${response.status()}. Body: ${errorText}`);
        }
    }
}