import { IChartFetchRequest } from 'types/metadata';
import { request } from './http'

export const fetchChartData = (config: Partial<IChartFetchRequest>, metadata: Record<string, any> = {}) => {
    if (config.context) { config = config.context({ ...config, metadata }) }
    let { url, method, headers = {}, body = {}, params = {}, parse = (response => response), context, error, ...rest } = config;
    return request({ url, method, headers, params, data: body, ...rest })
        .then(response => response.data)
        .then(response => parse(response))
        .catch(err => {
            if (error) return error();
            throw err;
        })
}

export const fetchMultipleMetrics = (queries: Partial<IChartFetchRequest>[], metadata: Record<string, any> = {}) => {
    return Promise.all(queries.map(query => fetchChartData(query, metadata)));
}

