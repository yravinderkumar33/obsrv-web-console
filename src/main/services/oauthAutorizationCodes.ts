import { find, create } from "../../shared/databases/postgres";
const table = "oauth_authorization_codes";

const service = {

    async find(id: string): Promise<any> {
        const authorizationCodes = await find(table, { id });
        if (authorizationCodes.length > 0) {
            return Promise.resolve(authorizationCodes[0])
        }
        return Promise.reject('Authorization code is not found')
    },

    async save(id: string, clientId: string, redirectUri: string, userId: string, userName: string): Promise<any> {
        await create(table, { id, client_id: clientId, redirect_uri: redirectUri, user_id: userId, user_name: userName });
    }
    
}

export default service;