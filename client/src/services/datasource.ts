import axios from 'axios';

export const saveDatasource = ({ data = {}, config }: any) => {
    return axios.post('config/v2/dataset/save', data, config)
}

export const datasourceRead = ({ datasetId, config = {} }: any) => {
    return axios.get('config/v2/dataset/read', {
        params: {
            id: datasetId
        },
        ...config
    })
}
