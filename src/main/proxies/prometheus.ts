import { createProxyMiddleware } from 'http-proxy-middleware';
import appConfig from '../../shared/resources/appConfig';
import { onError, onProxyReq, onProxyRes } from '../helpers/proxy';

const entity = "prometheus"

export default {
    path: '/prom',
    name: 'prometheus',
    handler() {
        return createProxyMiddleware({
            target: appConfig.PROMETHEUS.URL,
            changeOrigin: true,
            pathRewrite: function (path: string, req: any) { return path.replace('/prom', '') },
            onProxyReq: onProxyReq({ entity }),
            onProxyRes: onProxyRes({ entity }),
            onError: onError({ entity })
        })
    }
}