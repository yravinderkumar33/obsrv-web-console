import { find } from "../../shared/databases/postgres";
const table = "oauth_clients";

const service = { 
    async findById (id: string): Promise<any> {
        const clients = await find(table, {id})
        if(clients.length >= 0) {
            return Promise.resolve(clients[0].id)
        } 
        return Promise.reject('Client not found')
    },
    async findByClientId(clientId: string): Promise<any> {
        const clients = await find(table, {client_id: clientId})
        if(clients.length >= 0) {
            return Promise.resolve(clients[0].id)
        } 
        return Promise.reject('Client not found')
      }
}
  
export default service;