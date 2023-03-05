import axios from 'axios'
import apiEndpoints from 'data/apiEndpoints';
import * as _ from 'lodash';

export const nativeQuery = ({ data = {}, config }: any) => {
    return axios.post(apiEndpoints.saveDatasource, data, config);
}

export const sqlQuery = ({ data = {}, config }: any) => {
    // return axios.post(apiEndpoints.saveDatasource, payload, config);
}