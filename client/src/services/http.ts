import axios, { AxiosRequestConfig } from 'axios';

const http = axios;

const request = (config: AxiosRequestConfig) => {
    return axios.request(config)
}

export { http, request };