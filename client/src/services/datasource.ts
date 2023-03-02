import axios from 'axios';
import * as _ from 'lodash';

import apiEndpoints from 'data/apiEndpoints';

export const saveDatasource = ({ data = {}, config }: any) => {
    const { ingestionSpec, wizardState } = data;

    const payload = {
        "dataset_id": _.get(wizardState, 'pages.datasetConfiguration.state.name'),
        "ingestion_spec": ingestionSpec,
        "datasource": _.get(wizardState, 'pages.datasetConfiguration.state.name')
    };

    return axios.post(apiEndpoints.saveDatasource, payload, config);
}

export const datasourceRead = ({ datasetId, config = {} }: any) => {
    return axios.get(`${apiEndpoints.readDatasource}/${datasetId}`, { ...config });
}
