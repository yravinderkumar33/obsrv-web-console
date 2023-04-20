import { createProxyMiddleware } from 'http-proxy-middleware';
import appConfig from '../../shared/resources/appConfig';
import { onError, onProxyReq, onProxyRes } from '../helpers/proxy';

const entity = "obsrv-config";

export default {
    path: '/config',
    name: 'config',
    handler() {
        return createProxyMiddleware({
            target: appConfig.CONFIG_API.URL,
            changeOrigin: true,
            pathRewrite: function (path: string, req: any) { return path.replace('/config', '') },
            onProxyReq: onProxyReq({ entity }),
            onProxyRes: onProxyRes({ entity }),
            onError: onError({ entity })
        })
    }
}