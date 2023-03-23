const { createProxyMiddleware } = require('http-proxy-middleware');
import appConfig from '../../shared/resources/appConfig';

export default {
    path: '/alertmanager',
    name: 'alertmanager',
    handler() {
        return createProxyMiddleware({
            target: appConfig.ALERT_MANAGER.URL,
            changeOrigin: true,
            pathRewrite: function (path: string, req: any) { return path.replace('/alertmanager', '') }
        })
    }
}