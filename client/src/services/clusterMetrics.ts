import { IChartFetchRequest } from 'types/metadata';
import { request } from './http'

export const fetchChartData = (config: Partial<IChartFetchRequest>, options: any = null, setOptions: any = null) => {
    const { url, method, headers = {}, body = {}, params = {}, parse = (response => response), error, ...rest } = config;
    return request({ url, method, headers, params, data: body, ...rest })
        .then(response => response.data)
        .then(response => parse(response))
        .catch(err => {
            if (error) return error();
            throw err;
        })
}

