import axios from 'axios';
import * as _ from 'lodash';

import apiEndpoints from 'data/apiEndpoints';

export const saveDatasource = ({ data = {}, config }: any) => {
    const { ingestionSpec, state, storeState } = data;
    const datasetId = _.get(state, ['pages', 'datasetConfiguration', 'state', 'masterId']);
    const payload = {
        "dataset_id": datasetId,
        "ingestion_spec": ingestionSpec,
        "datasource": `${datasetId}_DAY`,
        "datasource_ref": `${datasetId}_DAY`,
    };

    return axios.post(apiEndpoints.saveDatasource, payload, config);
}

export const datasourceRead = ({ datasetId, config = {} }: any) => {
    return axios.get(`${apiEndpoints.readDatasource}/${datasetId}`, { ...config });
}
