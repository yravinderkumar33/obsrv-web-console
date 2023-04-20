const { createProxyMiddleware } = require('http-proxy-middleware');
import appConfig from '../../shared/resources/appConfig';

export default {
    path: '/prom',
    name: 'prometheus',
    handler() {
        return createProxyMiddleware({
            target: appConfig.PROMETHEUS.URL,
            changeOrigin: true,
            pathRewrite: function (path: string, req: any) { return path.replace('/prom', '') }
        })
    }
}