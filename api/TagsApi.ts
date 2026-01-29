import { ApiBase } from './ApiBase';

export class TagsApi extends ApiBase {
    private readonly endpoint = '/api/tag_description_manager';
    
    private readonly COMMON_CONFIG = {
        org_id: '6733306465383e58c9b88306',
        project_id: '678519dc23391a969cd9b76a'
    };


    async updateTag(tagId: string, tagName: string, fileId: string, action: 'delete' | 'add') {
        const payload = {
            org_id: this.COMMON_CONFIG.org_id,
            tag_list: [
                {
                    id: tagId,
                    name: tagName,
                    tag_type: "regular",
                    file_id: fileId,
                    action_type: action
                }
            ],
            files_project: [
                {
                    file_id: fileId,
                    project_id: this.COMMON_CONFIG.project_id
                }
            ]
        };

        return await this.postRequest(`${this.endpoint}/update_tag`, payload, 200);
    }

    async deleteTagByName(tagName: string, fileId: string) {
    
    const payload = {
        org_id: this.COMMON_CONFIG.org_id,
        tag_list: [{
            id: "", 
            name: tagName,
            file_id: fileId,
            action_type: "delete"
        }],
        files_project: [{
            file_id: fileId,
            project_id: this.COMMON_CONFIG.project_id
        }]
    };

    return await this.postRequest(`${this.endpoint}/tag_description_manager`, payload, 200);
}
}