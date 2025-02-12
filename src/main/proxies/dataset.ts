const { createProxyMiddleware } = require('http-proxy-middleware');
import appConfig from '../../shared/resources/appConfig';

export default {
    path: '/obsrv',
    name: 'dataset',
    handler() {
        return createProxyMiddleware({
            target: appConfig.OBS_API.URL,
            changeOrigin: true
        })
    }
}