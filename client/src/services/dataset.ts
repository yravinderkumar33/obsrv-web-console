import * as _ from 'lodash';
import { datasets } from "data/dataset";
import axios from 'axios';

export const fetchDatasets = (config: Record<string, any>) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(datasets);
        }, 2000)
    })
}

export const addMetadata = (masterData: Record<string, any>[], key: string, payload: Record<string, any>) => {
    const metadata = _.get(masterData, [key]) || {};
    const defaultMetadata = _.get(masterData, ['default']);
    return { ...payload, ...defaultMetadata, ...metadata };
}

export const prepareConfigurationsBySection = (payload: Record<string, any>[], masterData: Record<string, any>[]) => {
    return _.reduce(payload, (accumulator: Record<string, any>, value) => {
        const { key } = value;
        const valueWithMetadata = addMetadata(masterData, key, value);
        const { section = 'advanced', show = true } = valueWithMetadata;
        if (show) (accumulator[section] || (accumulator[section] = [])).push(valueWithMetadata);
        return accumulator;
    }, {})
}

export const saveDataset = ({ data = {}, config }: any) => {
    return axios.post('config/v2/dataset/save', data, config)
}

export const datasetRead = ({ datasetId, config = {} }: any) => {
    return axios.get('config/v2/dataset/read', {
        params: {
            id: datasetId
        },
        ...config
    })
}
