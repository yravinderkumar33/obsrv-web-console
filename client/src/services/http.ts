import axios, { AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import { error } from './toaster';

axiosRetry(axios, { retries: 3 });

axios.defaults.headers.common['Cache-Control'] = 'no-cache';
axios.defaults.headers.common['Pragma'] = 'no-cache';

const http = axios;

const request = (config: AxiosRequestConfig) => {
    return axios.request(config)
}

const responseInterceptor = (response: any) => response;

const checkForSessionExpiry = (config: any) => {
    const { navigate, status, dispatch } = config;
    if (status === 401) {
        dispatch(error({ message: "Unauthorized access !!" }));
        navigate('/login');
    }
}

const errorInterceptor = (config: any) => {
    const { navigate, dispatch } = config;
    return (error: any) => {
        const { status } = error?.response;
        checkForSessionExpiry({ navigate, status, dispatch });
        Promise.reject(error)
    }
}

const addHttpRequestsInterceptor = ({ responseInterceptor, errorInterceptor }: any) => {
    http.interceptors.response.use(responseInterceptor, errorInterceptor)
}

export { http, request, responseInterceptor, errorInterceptor, addHttpRequestsInterceptor };