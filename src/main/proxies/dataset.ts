import { createProxyMiddleware } from 'http-proxy-middleware';
import appConfig from '../../shared/resources/appConfig';
import { onError, onProxyReq, onProxyRes } from '../helpers/proxy';

const entity = "obsrv-dataset";

export default {
    path: '/obsrv',
    name: 'dataset',
    handler() {
        return createProxyMiddleware({
            target: appConfig.OBS_API.URL,
            changeOrigin: true,
            onProxyReq: onProxyReq({ entity }),
            onProxyRes: onProxyRes({ entity }),
            onError: onError({ entity })
        })
    }
}