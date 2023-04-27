import { createProxyMiddleware } from 'http-proxy-middleware';
import appConfig from '../../shared/resources/appConfig';
import { onError, onProxyReq, onProxyRes } from '../helpers/proxy';

const entity = "alert-manager";

export default {
    path: '/alertmanager',
    name: 'alertmanager',
    handler() {
        return createProxyMiddleware({
            target: appConfig.ALERT_MANAGER.URL,
            changeOrigin: true,
            pathRewrite: function (path: string, req: any) { return path.replace('/alertmanager', '') },
            onProxyReq: onProxyReq({ entity }),
            onProxyRes: onProxyRes({ entity }),
            onError: onError({ entity })
        })
    }
}