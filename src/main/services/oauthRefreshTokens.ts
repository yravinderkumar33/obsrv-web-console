import { find, create, destroy } from "../../shared/databases/postgres";
const table = "oauth_refresh_tokens";

const service = { 

    async find(id: string): Promise<any> {
        const refreshTokens = await find(table, {id})
        if(refreshTokens.length >= 0) {
            return Promise.resolve(refreshTokens[0])
        } 
        return Promise.reject('refresh token not found')
      },
    async findByUserIdAndClientId(userId: string, clientId: string): Promise<any> {
        const refreshTokens = await find(table, {client_id: clientId, user_id: userId})
        if(refreshTokens.length >= 0) {
            return Promise.resolve(refreshTokens[0])
        } 
        return Promise.reject('refresh token not found')
      },
      async save(id: string, userId: string, clientId: string): Promise<any> {
        await create(table, {id, client_id: clientId, user_id: userId});
     },
     async removeByUserIdAndClientId (userId: string, clientId: string): Promise<any> {
        await destroy(table, {user_id: userId, client_id: clientId})
    },
}
  
export default service;