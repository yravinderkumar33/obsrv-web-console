const { createProxyMiddleware } = require('http-proxy-middleware');
import appConfig from '../../shared/resources/appConfig';

export default {
    path: '/datasource/*',
    name: 'datasource',
    handler() {
        return createProxyMiddleware({
            target: appConfig.OBS_API.URL,
            changeOrigin: true
        })
    }
}