import * as _ from 'lodash';

export default {
    alerts: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/api/report/v1/alerts',
            method: 'GET',
            headers: {},
            body: {},
            params: {},
            parse: (response: any) => {
                return _.get(response, 'result.data.alerts') || [];
            },
            error() {
                return []
            }
        }
    }
}