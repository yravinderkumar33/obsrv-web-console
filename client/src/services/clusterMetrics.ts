import { IChartFetchRequest } from 'types/metadata';
import { request } from './http'

export const fetchChartData = (config: Partial<IChartFetchRequest>, options: any = null, setOptions: any = null) => {
    const { url, method, headers = {}, body = {}, params = {}, parse = (response => response), setConfig, error, ...rest } = config;
    return request({ url, method, headers, params, data: body, ...rest })
        .then(response => response.data)
        .then(response => parse(response))
        // .then(response => {
        //     if (options && setOptions && setConfig) {
        //         setConfig(options, setOptions, response)
        //     }
        //     return response
        // })
        .catch(err => {
            if (error) return error();
            throw err;
        })
}

