import { find } from "../../shared/databases/postgres";
const table = "oauth_users";

const service = { 
    async findById (id: string): Promise<any> {
        const users = await find(table, {id})
        if(users.length >= 0) {
            return Promise.resolve(users[0])
        } 
        return Promise.reject('User not found')
    },
    async findByUsername(userName: string): Promise<any> {
        const users = await find(table, {user_name: userName})
        if(users.length >= 0) {
            return Promise.resolve(users[0])
        } 
        return Promise.reject('User not found')
      }
}
  
export default service;