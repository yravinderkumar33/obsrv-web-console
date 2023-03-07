import { Express } from "express"
import { IController } from "../../shared/types"

const mountProxies = (app: Express, proxies: Map<string, Omit<IController, "name">>) => {
    proxies.forEach(proxy => {
        app.use(proxy?.path, proxy.handler())
    })
}


export default mountProxies;