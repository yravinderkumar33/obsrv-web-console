import * as _ from 'lodash';
import axios from 'axios';
import { flattenSchema, updateJSONSchema } from './json-schema';
import { saveDatasource } from './datasource';
import apiEndpoints from 'data/apiEndpoints';

export const createDraftDataset = ({ data = {}, config }: any) => {
    return axios.post(apiEndpoints.saveDatset, data, config);
}

export const updateDataset = ({ data = {}, config }: any) => {
    return axios.patch(apiEndpoints.updateDataset, data, config);
}

export const searchDatasets = ({ data = { filters: {} }, config }: any) => {
    return axios.post(apiEndpoints.listDatasets, data, config);
}

export const fetchDatasets = (config: Record<string, any>) => {
    return searchDatasets(config)
        .then(response => _.get(response, 'data.result'))
        .catch(err => ([]));
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
    const { schema, state } = data;
    const validate = _.get(state, 'pages.dataValidation.formFieldSelection') || {};
    const extractionConfig = _.get(state, 'pages.dataFormat.value');
    const datasourceConfig = _.get(state, 'pages.dataSource.value');
    const timestampCol = _.get(state, 'pages.timestamp.indexCol');

    const validation_config = {
        validate: validate !== "none",
        validation_mode: validate
    };

    const extraction_config = {
        is_batch_event: _.get(extractionConfig, 'type') === 'yes',
        batch_id: _.get(extractionConfig, 'batchId'),
        extraction_key: _.get(extractionConfig, 'extractionKey'),
        dedup_config: {
            dedup_key: _.get(extractionConfig, 'dedupeKey'),
            dedup_period: _.get(extractionConfig, 'dedupePeriod'),
            drop_duplicates: true
        }
    };

    const dedup_config = {
        dedup_key: _.get(extractionConfig, 'dedupeKey'),
        dedup_period: _.get(extractionConfig, 'dedupePeriod'),
        drop_duplicates: true
    }

    const router_config = datasourceConfig;
    const dataset_config = {}
    const denorm_config = {}

    const payload = {
        "id": _.get(state, 'pages.datasetConfiguration.state.config.id'),
        "name": _.get(state, 'pages.datasetConfiguration.state.config.name'),
        "data_schema": schema,
        validation_config,
        extraction_config,
        router_config,
        dedup_config,
        denorm_config,
        dataset_config
    }
    return axios.patch(apiEndpoints.updateDataset, payload, config);
}

export const datasetRead = ({ datasetId, config = {} }: any) => {
    return axios.get(`${apiEndpoints.readDataset}/${datasetId}`, {
        ...config
    })
}

export const generateIngestionSpec = ({ data = {}, config }: any) => {
    const { schema, state } = data;
    const payload = {
        schema,
        config: {
            "dataset": _.get(state, 'pages.datasetConfiguration.state.config.name'),
            "indexCol": _.get(state, 'pages.timestamp.indexCol'),
            "granularitySpec": {
                "segmentGranularity": 'DAY',
                "queryGranularity": 'HOUR',
                "rollup": false
            },
            "tuningConfig": {
                "maxRowPerSegment": 50000,
                "taskCount": 1
            },
            "ioConfig": {
                "topic": "dev.transform",
                "bootstrap": "kafka-headless.kafka.svc.cluster.local:9092",
                "taskDuration": "PT8H"
            }
        }
    };
    return axios.post(apiEndpoints.generateIngestionSpec, payload, config);
}

// const saveConnectorInfo = async () => {
//     const { id, type, ...rest }: any = childFormValue;
//     const payload = {
//         id: uuid,
//         dataset_id: configState.id,
//         connector_type: type,
//         connector_config: { ...rest },
//     }
//     let data;
//     if (existingState && existingState.value?.id) data = await updateTransformations(payload);
//     else data = await saveConnectorDraft(payload);

//     if (data.data) return null;
//     else dispatch(error({ message: "Error occured saving the connector config" }));
// }

export const publishDataset = async (state: Record<string, any>) => {
    const jsonSchema = _.get(state, 'pages.jsonSchema');
    const updatePayload = { schema: _.get(state, 'pages.columns.state.schema') };
    const updatedJsonSchema = _.get(updateJSONSchema(jsonSchema, updatePayload), 'schema');
    const ingestionSpec = await generateIngestionSpec({ data: { schema: updatedJsonSchema, state }, config: {} });
    const saveDatasetResponse = await saveDataset({ data: { schema: updatedJsonSchema, state } });
    return saveDatasource({ data: { state, ingestionSpec: _.get(ingestionSpec, 'data.result') } });
}


export const sendEvents = ({ datasetId, datasetName, events, config }: any) => {
    const payload = {
        data: {
            id: datasetId,
            events
        }
    }
    return axios.post(`${apiEndpoints.sendEvents}/${datasetName}`, payload, config);
}

export const checkUniqueId = async (id: string | undefined) => {
    return axios.get(`${apiEndpoints.uniqueId}/${id}`);
}

export const getUrls = async (files: any) => {
    const payload = {
        files: _.map(files, 'path'),
    };
    return axios.post(`${apiEndpoints.s3Upload}`, payload);
}

export const uploadToUrl = async (url: string, file: any) => {
    const formData = new FormData();
    formData.append('Content-Type', _.get(file, 'type'));
    formData.append('file', file);
    return axios.put(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}

export const saveConnectorDraft = async (payload: any) => {
    return axios.post(`${apiEndpoints.datasetSourceConfig}`, payload);
}

export const saveTransformations = async (payload: any) => {
    return axios.post(`${apiEndpoints.transformationsConfig}`, payload);
}

export const updateTransformations = async (payload: any) => {
    return axios.patch(`${apiEndpoints.transformationsConfig}`, payload);
}

export const deleteTransformations = async (id: string) => {
    return axios.delete(`${apiEndpoints.transformationsConfig}/${id}`);
}

// update the client state table.
export const updateClientState = async ({ clientState }: any) => {
    const pagesData = _.get(clientState, 'pages');
    const datasetConfig = _.get(pagesData, 'datasetConfiguration.state.config');
    return updateDataset({ data: { ...datasetConfig, client_state: clientState } });
}
