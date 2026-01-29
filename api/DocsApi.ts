import { ApiBase } from './ApiBase';

export class DocsApi extends ApiBase {
    private readonly endpoint = '/api/files';

    async uploadDocument(docData: any, expectedStatus: Number = 200) {
        return await this.postRequest(`${this.endpoint}/create`, docData, expectedStatus);
    }

    async deleteDocument(payload: any) {

        return await this.postRequest(`${this.endpoint}/delete`, payload, 200);
    }

    async getAllDocuments() {
        const payload = {
            org_id: '6733306465383e58c9b88306',
            project_ids: ['68776462b753d1caf456e630', '67853d7923391a969cd9b76b', '678519dc23391a969cd9b76a'],
            limit: 50,
            products: ['KalTables', 'KalDocs']
        };

        const response = await this.postRequest(`${this.endpoint}/get_all_v2`, payload, 200);
        const body = await response.json();

        return body.data || [];
    }
}






