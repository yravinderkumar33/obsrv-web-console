const { createProxyMiddleware } = require('http-proxy-middleware');
import appConfig from '../../shared/resources/appConfig';

export default {
    path: '/system',
    name: 'system',
    handler() {
        return createProxyMiddleware({
            target: appConfig.SYSTEM_API.URL,
            changeOrigin: true
        })
    }
}