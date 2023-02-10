import axios from 'axios';
import appConfig from '../../../shared/resources/appConfig';

const instance = axios.create({
    baseURL: appConfig.OBS_API.URL,
    timeout: 2000
});

export default instance;
