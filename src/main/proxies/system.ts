import { createProxyMiddleware } from 'http-proxy-middleware';
import appConfig from '../../shared/resources/appConfig';
import { onError, onProxyReq, onProxyRes } from '../helpers/proxy';

const entity = "command";

export default {
    path: '/system',
    name: 'system',
    handler() {
        return createProxyMiddleware({
            target: appConfig.SYSTEM_API.URL,
            changeOrigin: true,
            onProxyReq: onProxyReq({ entity }),
            onProxyRes: onProxyRes({ entity }),
            onError: onError({ entity })
        })
    }
}