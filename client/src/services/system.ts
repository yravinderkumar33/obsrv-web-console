import * as _ from 'lodash';
import { http } from 'services/http';
import { v4 } from 'uuid';
import apiEndpoints from 'data/apiEndpoints';


export const publishDataset = ({ data, config = {} }: any) => {
    const { datasetId } = data;
    const payload = {
        "id": v4(),
        "data": {
            "dataset_id": datasetId,
            "command": "PUBLISH_DATASET"
        }
    }
    return http.post(apiEndpoints.publishDataset, payload, config);
}