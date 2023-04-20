import axios, { AxiosRequestConfig } from 'axios';
import { error } from './toaster';

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