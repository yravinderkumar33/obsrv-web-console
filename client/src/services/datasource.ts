import {http} from 'services/http';
import * as _ from 'lodash';

import apiEndpoints from 'data/apiEndpoints';

export const saveDatasource = ({ data = {}, config }: any) => {
    const { ingestionSpec, state} = data;
    const datasetId = _.get(state, ['pages', 'datasetConfiguration', 'state', 'masterId']);
    const payload = {
        "dataset_id": datasetId,
        "ingestion_spec": ingestionSpec,
        "datasource": `${datasetId}_DAY`,
        "datasource_ref": `${datasetId}_DAY`,
    };

    return http.post(apiEndpoints.saveDatasource, payload, config);
}

export const datasourceRead = ({ datasetId, config = {} }: any) => {
    return http.get(`${apiEndpoints.readDatasource}/${datasetId}`, { ...config });
}