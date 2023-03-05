import axios from 'axios'
import apiEndpoints from 'data/apiEndpoints';
import * as _ from 'lodash';

export const nativeQuery = ({ data = {}, config }: any) => {
    return axios.post(apiEndpoints.saveDatasource, data, config);
}

export const sqlQuery = ({ data = {}, config }: any) => {
    // return axios.post(apiEndpoints.saveDatasource, payload, config);
}

export const druidQueries = {
    averageProcessingTimeSeries: ({ datasetId, intervals }: any) => {
        return {
            "context": {
                "dataSource": "system-stats"
            },
            "query": {
                "queryType": "timeseries",
                "dataSource": "system-stats",
                "intervals": intervals,
                "granularity": "HOUR",
                "filter": {
                    "type": "selector",
                    "dimension": "dataset",
                    "value": datasetId
                },
                "aggregations": [
                    {
                        "type": "doubleMean",
                        "name": "total_processing_time",
                        "fieldName": "total_processing_time"
                    }
                ]
            }
        }
    },
    druid_avg_processing_time: ({ datasetId, intervals }: any) => {
        return {
            "context": {
                "dataSource": "system-stats"
            },
            "query": {
                "queryType": "groupBy",
                "dataSource": "system-stats",
                "intervals": intervals,
                "granularity": "all",
                "filter": {
                    "type": "selector",
                    "dimension": "dataset",
                    "value": datasetId
                },
                "aggregations": [
                    {
                        "type": "doubleMean",
                        "name": "total_processing_time",
                        "fieldName": "total_processing_time"
                    }
                ]
            }
        }
    },
    last_synced_time: ({ datasetId, intervals }: any) => {
        return {
            "context": {
                "dataSource": "system-stats"
            },
            "query": {
                "queryType": "groupBy",
                "dataSource": "system-stats",
                "intervals": intervals,
                "granularity": "all",
                "filter": {
                    "type": "selector",
                    "dimension": "dataset",
                    "value": datasetId
                },
                "aggregations": [
                    {
                        "type": "longMax",
                        "name": "last_synced_time",
                        "fieldName": "__time"
                    }
                ]
            }
        }
    },
    total_events_processed: ({ datasetId, intervals }: any) => {
        return {
            "context": {
                "dataSource": "system-stats"
            },
            "query": {
                "queryType": "timeseries",
                "dataSource": "system-stats",
                "intervals": intervals,
                "granularity": "all",
                "filter": {
                    "type": "selector",
                    "dimension": "dataset",
                    "value": datasetId
                },
                "aggregations": [
                    {
                        "type": "count",
                        "name": "count",
                        "fieldName": "count"
                    }
                ]
            }
        }
    },
    failed_events_summary: ({ datasetId, intervals }: any) => {
        return {
            "context": {
                "dataSource": "failed-events-summary"
            },
            "query": {
                "queryType": "groupBy",
                "dataSource": "failed-events-summary",
                "intervals": intervals,
                "granularity": "all",
                "filter": {
                    "type": "selector",
                    "dimension": "dataset",
                    "value": datasetId
                },
                "aggregations": [
                    {
                        "type": "count",
                        "name": "count",
                        "fieldName": "count"
                    }
                ]
            }
        }
    },
    avgProcessingTimeSeries: ({ datasetId, intervals }: any) => {
        return {
            "context": {
                "dataSource": "system-stats"
            },
            "query": {
                "queryType": "timeseries",
                "dataSource": "system-stats",
                "intervals": intervals,
                "granularity": "HOUR",
                "filter": {
                    "type": "selector",
                    "dimension": "dataset",
                    "value": datasetId
                },
                "aggregations": [
                    {
                        "type": "doubleMean",
                        "name": "total_processing_time",
                        "fieldName": "total_processing_time"
                    }
                ]
            }
        }
    }
}