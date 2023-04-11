import axios from 'axios';
import * as _ from 'lodash';

import apiEndpoints from 'data/apiEndpoints';

export const saveDatasource = ({ data = {}, config }: any) => {
    const { ingestionSpec, state } = data;

    const payload = {
        "dataset_id": _.get(state, 'pages.datasetConfiguration.state.config.id'),
        "ingestion_spec": ingestionSpec,
        "datasource": _.get(state, 'pages.datasetConfiguration.state.config.name'),
        "datasource_ref": _.get(state, 'pages.datasetConfiguration.state.config.name')
    };

    return axios.post(apiEndpoints.saveDatasource, payload, config);
}

export const datasourceRead = ({ datasetId, config = {} }: any) => {
    return axios.get(`${apiEndpoints.readDatasource}/${datasetId}`, { ...config });
}
