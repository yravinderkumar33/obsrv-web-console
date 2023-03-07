const { createProxyMiddleware } = require('http-proxy-middleware');
import appConfig from '../../shared/resources/appConfig';

export default {
    path: '/config',
    name: 'config',
    handler() {
        return createProxyMiddleware({
            target: appConfig.CONFIG_API.URL,
            changeOrigin: true,
            pathRewrite: function (path: string, req: any) { return path.replace('/config', '') }
        })
    }
}