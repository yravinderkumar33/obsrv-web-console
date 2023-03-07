import axios, { AxiosRequestConfig } from 'axios';

export const request = (config: AxiosRequestConfig) => {
    return axios.request(config)
}