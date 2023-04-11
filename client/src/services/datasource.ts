import axios from 'axios';
import * as _ from 'lodash';

import apiEndpoints from 'data/apiEndpoints';

export const saveDatasource = ({ data = {}, config }: any) => {
    const { ingestionSpec, state, storeState } = data;
    const datasetId = _.get(state, ['pages', 'datasetConfiguration', 'state', 'config', 'dataset_id']);
    const idData = _.get(storeState, ['dataset', 'data']);
    const id = idData.find((obj: any) => obj.dataset_id === datasetId);
    const payload = {
        "dataset_id": id.id,
        "ingestion_spec": ingestionSpec,
        "datasource": `${datasetId}_DAY`,
        "datasource_ref": `${datasetId}_DAY`,
    };

    return axios.post(apiEndpoints.saveDatasource, payload, config);
}

export const datasourceRead = ({ datasetId, config = {} }: any) => {
    return axios.get(`${apiEndpoints.readDatasource}/${datasetId}`, { ...config });
}
