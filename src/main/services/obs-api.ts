import obsApiInstance from '../utils/axios/obs-api';

const service = {
    generateSchema({ body = {}, headers = {}, params = {} }: any) {
        console.log({ body, headers, params });
        const baseUrl = '/schema/v2/generate';
        return obsApiInstance.post(`${baseUrl}`, body);
    }
};

export default service;
