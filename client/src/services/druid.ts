import * as _ from 'lodash';

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
                        "type": "longSum",
                        "name": "total_processing_time",
                        "fieldName": "total_processing_time"
                    },
                    {
                        "type": "longSum",
                        "name": "count",
                        "fieldName": "count"
                    }
                ],
                "postAggregations": [
                    {
                        "type": "expression",
                        "name": "average_processing_time",
                        "expression": "(total_processing_time / count)"
                    }
                ]
            }
        }
    },
    druid_max_processing_time: ({ datasetId, intervals }: any) => {
        return {
            "context": {
                "dataSource": "system-stats"
            },
            "query": {
                "queryType": "topN",
                "dataSource": "system-stats",
                "virtualColumns": [
                    {
                        "type": "expression",
                        "name": "v0",
                        "expression": "(total_processing_time / count)",
                        "outputType": "DOUBLE"
                    }
                ],
                "dimension": {
                    "type": "default",
                    "dimension": "dataset",
                    "outputName": "dataset",
                    "outputType": "STRING"
                },
                "metric": {
                    "type": "numeric",
                    "metric": "max_processing_time"
                },
                "filter": {
                    "type": "selector",
                    "dimension": "dataset",
                    "value": datasetId
                },
                "intervals": intervals,
                "granularity": {
                    "type": "all"
                },
                "aggregations": [
                    {
                        "type": "doubleMax",
                        "name": "max_processing_time",
                        "fieldName": "v0"
                    }
                ]
            }
        }
    },
    druid_min_processing_time: ({ datasetId, intervals }: any) => {
        return {
            "context": {
                "dataSource": "system-stats"
            },
            "query": {
                "queryType": "topN",
                "dataSource": "system-stats",
                "virtualColumns": [
                    {
                        "type": "expression",
                        "name": "v0",
                        "expression": "(total_processing_time / count)",
                        "outputType": "DOUBLE"
                    }
                ],
                "dimension": {
                    "type": "default",
                    "dimension": "dataset",
                    "outputName": "dataset",
                    "outputType": "STRING"
                },
                "metric": {
                    "type": "numeric",
                    "metric": "min_processing_time"
                },
                "filter": {
                    "type": "selector",
                    "dimension": "dataset",
                    "value": datasetId
                },
                "intervals": intervals,
                "granularity": {
                    "type": "all"
                },
                "aggregations": [
                    {
                        "type": "doubleMin",
                        "name": "min_processing_time",
                        "fieldName": "v0"
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
                "granularity": "hour",
                "filter": {
                    "type": "selector",
                    "dimension": "dataset",
                    "value": datasetId
                },
                "aggregations": [
                    {
                        "type": "longSum",
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
                        "name": "count"
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
    },
    totalEventsProcessedTimeSeries: ({ datasetId, intervals }: any) => {
        return {
            "context": {
                "dataSource": "system-stats"
            },
            "query": {
                "queryType": "timeseries",
                "dataSource": "system-stats",
                "intervals": intervals,
                "granularity": "five_minute",
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
            },
            "limit": 100
        }
    }
}