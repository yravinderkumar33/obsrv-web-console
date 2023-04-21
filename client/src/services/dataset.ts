import * as _ from 'lodash';
import { http } from 'services/http';
import { updateJSONSchema } from './json-schema';
import { saveDatasource } from './datasource';
import apiEndpoints from 'data/apiEndpoints';

const synctsObject = {
    "column": "syncts",
    "type": "number",
    "key": "properties.syncts",
    "ref": "properties.syncts",
    "isModified": true,
}

const formatDenormFields = (denormFields: any) => {
    if (denormFields.length > 0) {
        const final = _.map(denormFields, (item: any) => ({
            "column": item.denorm_out_field,
            "type": "json",
            "key": `properties.${item.denorm_out_field}`,
            "ref": `properties.${item.denorm_out_field}`,
            "isModified": true,
        }));
        return final;
    }
    else return [];
}

export const createDraftDataset = ({ data = {}, config }: any) => {
    return http.post(apiEndpoints.saveDatset, data, config);
}

export const updateDataset = ({ data = {}, config }: any) => {
    return http.patch(apiEndpoints.updateDataset, data, config);
}

export const searchDatasets = ({ data = { filters: {} }, config }: any) => {
    return http.post(apiEndpoints.listDatasets, data, config);
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

export const saveDataset = ({ data = {}, config, master }: any) => {
    const { schema, state } = data;
    const validate = _.get(state, 'pages.dataValidation.formFieldSelection') || {};
    const extractionConfig = _.get(state, 'pages.dataFormat.value');


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

    const router_config = {
        "topic": _.get(state, 'pages.datasetConfiguration.state.config.dataset_id'),
    };
    const dataset_config = {};
    const denorm_config = {};

    const payload = {
        "dataset_id": _.get(state, 'pages.datasetConfiguration.state.config.dataset_id'),
        "name": _.get(state, 'pages.datasetConfiguration.state.config.name'),
        "data_schema": schema,
        "status": "READY_FOR_PUBLISH",
        validation_config,
        extraction_config,
        router_config,
        dedup_config,
        denorm_config,
        dataset_config
    }
    return http.patch(apiEndpoints.updateDataset, payload, config);
}

export const datasetRead = ({ datasetId, config = {} }: any) => {
    return http.get(`${apiEndpoints.readDataset}/${datasetId}`, {
        ...config
    })
}

export const generateIngestionSpec = ({ data = {}, config }: any) => {
    const { schema, state } = data;
    const payload = {
        schema,
        config: {
            "dataset": _.get(state, 'pages.datasetConfiguration.state.config.name'),
            "indexCol": _.get(state, 'pages.timestamp.indexCol') || "syncts",
            "granularitySpec": {
                "segmentGranularity": 'DAY',
                "rollup": false
            },
            "tuningConfig": {
                "maxRowPerSegment": 50000,
                "taskCount": 1
            },
            "ioConfig": {
                "topic": _.get(state, 'pages.datasetConfiguration.state.config.dataset_id'),
                "bootstrap": "kafka-headless.kafka.svc.cluster.local:9092",
                "taskDuration": "PT1H",
            }
        }
    };
    return http.post(apiEndpoints.generateIngestionSpec, payload, config);
}

export const saveTransformations = async (payload: any) => {
    return http.post(`${apiEndpoints.transformationsConfig}`, payload);
}

const connectorInfoToDraft = async (state: Record<string, any>, master: any) => {
    const data = _.get(state, ['wizard', 'pages', 'dataSource', 'value']) || {};
    const datasetId = _.get(state, ['wizard', 'pages', 'datasetConfiguration', 'state', 'masterId']);
    if (datasetId && _.get(data, 'type') === 'kafka') {
        const { type, ...rest }: any = data;
        const payload = {
            dataset_id: datasetId,
            connector_type: type,
            connector_config: { ...rest },
            type: master ? 'master' : 'dataset',
            status: 'DRAFT',
        }
        return saveConnectorDraft(payload);
    } else return false;
}

export const publishDataset = async (state: Record<string, any>, storeState: any, master: any) => {
    await connectorInfoToDraft(storeState, master);
    const jsonSchema = _.get(state, 'pages.jsonSchema');
    const timestampCol = _.get(state, 'pages.timestamp.indexCol') || "syncts";
    let denormFields = _.get(state, 'pages.denorm.values') || [];
    denormFields = formatDenormFields(denormFields);
    const updatePayload = { schema: [..._.get(state, 'pages.columns.state.schema')] };
    const updatedJsonSchema = _.get(updateJSONSchema(jsonSchema, updatePayload), 'schema');
    const saveDatasetResponse = await saveDataset({ data: { schema: updatedJsonSchema, state }, master });
    let ingestionPayload = { schema: [..._.get(state, 'pages.columns.state.schema'), ...denormFields] };
    if (timestampCol === "syncts")
        ingestionPayload = { schema: [..._.get(state, 'pages.columns.state.schema'), synctsObject, ...denormFields] };
    const updatedIngestionPayload = _.get(updateJSONSchema(jsonSchema, ingestionPayload), 'schema');
    const ingestionSpec = await generateIngestionSpec({ data: { schema: updatedIngestionPayload, state }, config: {} });
    return saveDatasource({ data: { state, storeState, ingestionSpec: _.get(ingestionSpec, 'data.result') } });
}


export const sendEvents = (datasetId: string | undefined, payload: any) => {
    return http.post(`${apiEndpoints.sendEvents}/${datasetId}`, payload, {});
}

export const checkUniqueId = async (id: string | undefined) => {
    return http.get(`${apiEndpoints.uniqueId}/${id}`);
}

export const getUrls = async (files: any) => {
    const payload = {
        files: _.map(files, 'path'),
    };
    return http.post(`${apiEndpoints.s3Upload}`, payload);
}

export const uploadToUrl = async (url: string, file: any) => {
    const formData = new FormData();
    formData.append('Content-Type', _.get(file, 'type'));
    formData.append('file', file);
    return http.put(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}

export const saveConnectorDraft = async (payload: any) => {
    return http.post(`${apiEndpoints.datasetSourceConfig}`, payload);
}

export const updateTransformations = async (payload: any) => {
    return http.patch(`${apiEndpoints.transformationsConfig}`, payload);
}

export const deleteTransformations = async (id: string) => {
    return http.delete(`${apiEndpoints.transformationsConfig}/${id}`);
}

export const updateClientState = async ({ clientState }: any) => {
    const pagesData = _.get(clientState, 'pages');
    const datasetConfig = _.get(pagesData, 'datasetConfiguration.state.config');
    return updateDataset({ data: { ...datasetConfig, client_state: clientState } });
}

export const verifyKafkaConnection = async (connectorInfo: any) => {
    return await http.post(`${apiEndpoints.kafkaConnection}`, {
        bootstrap: connectorInfo.kafkaBrokers,
        topic: connectorInfo.topic,
    });
}

export const updateDenormConfig = async (denormPayload: any) => {
    return await http.patch(apiEndpoints.saveDatset, denormPayload, {});
}
