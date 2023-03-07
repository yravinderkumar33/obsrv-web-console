import * as _ from 'lodash';
import axios from 'axios';
import { updateJSONSchema } from './json-schema';
import { saveDatasource } from './datasource';
import apiEndpoints from 'data/apiEndpoints';
import { v4 } from 'uuid';


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
    const { schema, wizardState } = data;
    const payload = {
        "id": _.get(wizardState, 'pages.datasetConfiguration.state.config.id'),
        "dataset_name": _.get(wizardState, 'pages.datasetConfiguration.state.config.name'),
        "extraction_config": {
            "is_batch_event": _.get(wizardState, 'pages.listDatasetConfigurations.state.configurations.advanced.isBatch') || true,
            "extraction_key": _.get(wizardState, 'pages.listDatasetConfigurations.state.configurations.advanced.extractionKey') || ""
        },
        "dedup_config": {
            "drop_duplicates": _.lowerCase(_.get(wizardState, 'pages.listDatasetConfigurations.state.configurations.processing.dropDuplicates')) === 'yes',
            "dedup_key": _.get(wizardState, 'pages.listDatasetConfigurations.state.configurations.processing.dedupKeys'),
        },
        "data_schema": schema
    }
    return axios.post(apiEndpoints.saveDatset, payload, config);
}

export const datasetRead = ({ datasetId, config = {} }: any) => {
    return axios.get(`${apiEndpoints.readDataset}/${datasetId}`, {
        ...config
    })
}

export const generateIngestionSpec = ({ data = {}, config }: any) => {
    const { schema, wizardState } = data;
    const payload = {
        schema,
        config: {
            "dataset": _.get(wizardState, 'pages.datasetConfiguration.state.config.name'),
            "indexCol": _.get(wizardState, 'pages.listDatasetConfigurations.state.configurations.ingestion.index'),
            "granularitySpec": {
                "segmentGranularity": _.get(wizardState, 'pages.listDatasetConfigurations.state.configurations.advanced.segmentGranularity'),
                "queryGranularity": _.get(wizardState, 'pages.listDatasetConfigurations.state.configurations.advanced.queryGranularity'),
                "rollup": _.get(wizardState, 'pages.listDatasetConfigurations.state.configurations.advanced.rollup')
            },
            "tuningConfig": {
                "maxRowPerSegment": 50000,
                "taskCount": 1
            },
            "ioConfig": {
                "topic": "obsrv.telemetry.input",
                "bootstrap": "localhost:9092",
                "taskDuration": "PT8H"
            }
        }
    };
    return axios.post(apiEndpoints.generateIngestionSpec, payload, config);
}

export const publishDataset = async (jsonSchema: Record<string, any>, wizardState: Record<string, any>) => {
    const updatePayload = { schema: wizardState?.pages?.columns?.state?.schema };
    const schema = _.get(updateJSONSchema(jsonSchema, updatePayload), 'schema');
    const ingestionSpec = await generateIngestionSpec({ data: { schema, wizardState }, config: {} });
    const saveDatasetResponse = await saveDataset({ data: { schema, wizardState } });
    const saveDatasourceResponse = await saveDatasource({ data: { wizardState, ingestionSpec: _.get(ingestionSpec, 'data.result') } });
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


