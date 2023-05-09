import { find, create as insert } from "../../shared/databases/postgres";
import { User } from "../types";

const table = "oauth_users";

const service = { 

    async find (data: any): Promise<any> {
        const users = await find(table, data)
        if(users.length > 0) {
            return Promise.resolve(users[0])
        } 
        return Promise.reject('user_not_found')
    },
    async findById (id: string): Promise<any> {
        const users = await find(table, {id})
        if(users.length > 0) {
            return Promise.resolve(users[0])
        } 
        return Promise.reject('user_not_found')
    },

    async findByUsername(userName: string): Promise<any> {
        const users = await find(table, {user_name: userName})
        if(users.length > 0) {
            return Promise.resolve(users[0])
        } 
        return Promise.reject('user_not_found')
    },
    async create(userInfo: User): Promise<any> {
        const user  = await insert(table, userInfo)
        console.log(user)
        return user;
    }
}
  
export default service;