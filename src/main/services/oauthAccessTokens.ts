import { find, create, destroy } from "../../shared/databases/postgres";
const table = "oauth_access_tokens";

const service = { 
   
    async findByUserIdAndClientId(userId: string, clientId: string): Promise<any> {
        const accessTokens = await find(table, {client_id: clientId, user_id: userId})
        if(accessTokens.length >= 0) {
            return Promise.resolve(accessTokens[0])
        } 
        return Promise.reject('access token not found')
      },
      async save(id: string,  userId: string, clientId: string): Promise<any> {
        await create(table, {id, client_id: clientId, user_id: userId});
     },
     async removeByUserIdAndClientId (userId: string, clientId: string): Promise<any> {
        await destroy(table, {user_id: userId, client_id: clientId})
    },
}
  
export default service;