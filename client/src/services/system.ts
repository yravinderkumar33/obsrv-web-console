import * as _ from 'lodash';
import axios from 'axios';
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
    return axios.post(apiEndpoints.publishDataset, payload, config);
}