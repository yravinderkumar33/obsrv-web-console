import prometheusInstance from '../utils/axios/prometheus';

const service = {
    queryRange({ params = {} }: any) {
        const baseUrl = 'api/v1/query_range';
        return prometheusInstance.get(`${baseUrl}`, {
            params: params
        });
    }
};

export default service;
