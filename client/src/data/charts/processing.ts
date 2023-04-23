import * as _ from 'lodash';
import dayjs from 'dayjs';
import defaultConf from './common';
import prettyMilliseconds from 'pretty-ms';

const dateFormat = 'YYYY-MM-DD'

export default {
    minProcessingTime: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/obsrv/v1/query',
            method: 'POST',
            headers: {},
            noParams: true,
            body: {
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
                            "expression": "(\"total_processing_time\" / \"count\")",
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
                    "intervals": "$interval",
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
            },
            params: {},
            parse: (response: any) => {
                const min_processing_time = _.get(response, 'result[0].result[0].min_processing_time');
                if (!min_processing_time) throw new Error();
                return prettyMilliseconds(_.floor(min_processing_time));
            },
            error() {
                return [0, "error"];
            },
            context: (query: any) => {
                const strPayload = JSON.stringify(query.body);
                const start = dayjs().format(dateFormat);
                const end = dayjs().add(1, 'day').format(dateFormat);
                const interval = `${start}/${end}`;
                const updatedStrPayload = _.replace(strPayload, '$interval', interval);
                const updatedPayload = JSON.parse(updatedStrPayload);
                query.body = updatedPayload;
                return query;
            }
        }
    },
    maxProcessingTime: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/obsrv/v1/query',
            method: 'POST',
            headers: {},
            noParams: true,
            body: {
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
                            "expression": "(\"total_processing_time\" / \"count\")",
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
                    "intervals": "$interval",
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
            },
            params: {},
            parse: (response: any) => {
                const max_processing_time = _.get(response, 'result[0].result[0].max_processing_time');
                if (!max_processing_time) throw new Error();
                return prettyMilliseconds(_.floor(max_processing_time));
            },
            error() {
                return [0, "error"];
            },
            context: (query: any) => {
                const strPayload = JSON.stringify(query.body);
                const start = dayjs().format(dateFormat);
                const end = dayjs().add(1, 'day').format(dateFormat);
                const interval = `${start}/${end}`;
                const updatedStrPayload = _.replace(strPayload, '$interval', interval);
                const updatedPayload = JSON.parse(updatedStrPayload);
                query.body = updatedPayload;
                return query;
            }
        }
    },
    avgProcessingTime: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/obsrv/v1/query',
            method: 'POST',
            headers: {},
            noParams: true,
            body: {
                "context": {
                    "dataSource": "system-stats"
                },
                "query": {
                    "queryType": "groupBy",
                    "dataSource": "system-stats",
                    "intervals": "$interval",
                    "granularity": "all",
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
            },
            params: {},
            parse: (response: any) => {
                const payload = _.get(response, 'result') || [];
                if (_.get(payload, 'length') === 0) return [0, "error"];
                const sum = _.sumBy(payload, value => {
                    return _.get(value, 'event.average_processing_time') || 0;
                })
                return prettyMilliseconds(sum)
            },
            error() {
                return [0, "error"];
            },
            context: (query: any) => {
                const strPayload = JSON.stringify(query.body);
                const start = dayjs().format(dateFormat);
                const end = dayjs().add(1, 'day').format(dateFormat);
                const interval = `${start}/${end}`;
                const updatedStrPayload = _.replace(strPayload, '$interval', interval);
                const updatedPayload = JSON.parse(updatedStrPayload);
                query.body = updatedPayload;
                return query;
            }
        }
    },
    minProcessingTimeSeries: {
        type: 'line',
        series: [],
        options: {
            chart: {
                type: 'line',
                animations: defaultConf.animations,
                toolbar: {
                    show: false
                }
            },
            grid: defaultConf.grid,
            stroke: {
                width: 2,
                curve: 'smooth'
            },
            legend: {
                show: true
            },
            zoom: {
                enabled: false
            },
            yaxis: {
                labels: {
                    formatter: function (value: number) {
                        return value;
                    }
                },
                title: {
                    text: "Processing Time (ms)"
                }
            },
            tooltip: {
                theme: 'light',
                x: {
                    show: true,
                    formatter(value: number) {
                        return dayjs(value).format('DD MMM HH:mm')
                    }
                },
                y: {
                    show: true,
                    formatter(value: number) {
                        return prettyMilliseconds(value);
                    }
                }
            },
            xaxis: {
                type: 'datetime',
                labels: {
                    formatter: function (value: any, timestamp: any) {
                        return defaultConf.timestampLabelFormatter(timestamp);
                    }
                },
                tooltip: {
                    enabled: false
                },
                title: {
                    text: "Time"
                }
            }
        },
        query: {
            type: 'api',
            timeout: 3000,
            url: '/obsrv/v1/query',
            method: 'POST',
            headers: {},
            noParams: true,
            body: {
                "context": {
                    "dataSource": "system-stats"
                },
                "query": {
                    "queryType": "timeseries",
                    "dataSource": "system-stats",
                    "virtualColumns": [
                        {
                            "type": "expression",
                            "name": "processing_time",
                            "expression": "if(count > 0, total_processing_time / count, 0)",
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
                    "intervals": "$interval",
                    "granularity": "$granularity",
                    "aggregations": [
                        {
                            "type": "doubleMin",
                            "name": "min_processing_time",
                            "fieldName": "processing_time"
                        },
                        {
                            "type": "doubleMax",
                            "name": "max_processing_time",
                            "fieldName": "processing_time"
                        },
                        {
                            "type": "doubleSum",
                            "name": "total_processing_time",
                            "fieldName": "total_processing_time"
                        },
                        {
                            "type": "longSum",
                            "name": "event_count",
                            "fieldName": "count"
                        }
                    ],
                    "postAggregations": [
                        {
                            "type": "expression",
                            "name": "avg_processing_time",
                            "expression": "if(event_count > 0, total_processing_time / event_count, 0)"
                        }
                    ]
                }
            },
            params: {},
            parse: (response: any) => {
                const payload = _.get(response, 'result') || [];

                const getSeries = (key: string) => {
                    return _.map(payload, value => {
                        const timestamp = Date.parse(_.get(value, 'timestamp'));
                        let counter = _.get(value, ['result', key]);
                        if (_.includes(_.lowerCase(counter), "infinity")) {
                            counter = 0;
                        }
                        return [timestamp, counter];
                    });
                }

                return [
                    {
                        name: 'Min Processing Time',
                        data: getSeries('min_processing_time')
                    },
                    {
                        name: 'Max Processing Time',
                        data: getSeries('max_processing_time')
                    },
                    {
                        name: 'Avg Processing Time',
                        data: getSeries('avg_processing_time')
                    }
                ]
            },
            error() {
                return [];
            },
            context: (payload: any) => {
                const { body, metadata = {} } = payload;
                const { interval = 1140, granularity } = metadata;
                const strPayload = JSON.stringify(body);
                const start = dayjs().subtract(interval - 1140, 'minutes').format(dateFormat);
                const end = dayjs().add(1, 'day').format(dateFormat);
                const rangeInterval = `${start}/${end}`;
                const updatedStrPayload = _.replace(_.replace(strPayload, '$interval', rangeInterval), '$granularity', granularity);
                const updatedPayload = JSON.parse(updatedStrPayload);
                payload.body = updatedPayload;
                return payload;
            }
        }
    },
    minProcessingTimeSeriesPerDataset: {
        type: 'line',
        series: [],
        options: {
            chart: {
                type: 'line',
                animations: defaultConf.animations,
                toolbar: {
                    show: false
                }
            },
            grid: defaultConf.grid,
            stroke: {
                width: 2,
                curve: 'smooth'
            },
            legend: {
                show: true
            },
            zoom: {
                enabled: false
            },
            yaxis: {
                labels: {
                    formatter: function (value: number) {
                        return value;
                    }
                }
            },
            tooltip: {
                theme: 'light',
                x: {
                    show: true,
                    formatter(value: number) {
                        return dayjs(value).format('DD MMM HH:mm')
                    }
                },
                y: {
                    show: true,
                    formatter(value: number) {
                        return prettyMilliseconds(value);
                    }
                }
            },
            xaxis: {
                type: 'datetime',
                labels: {
                    formatter: function (value: any, timestamp: any) {
                        return dayjs(timestamp).format('DD MMM HH:mm');
                    }
                },
                tooltip: {
                    enabled: false
                }
            }
        },
        query: {
            type: 'api',
            timeout: 3000,
            url: '/obsrv/v1/query',
            method: 'POST',
            headers: {},
            noParams: true,
            body: {
                "context": {
                    "dataSource": "system-stats"
                },
                "query": {
                    "queryType": "timeseries",
                    "dataSource": "system-stats",
                    "virtualColumns": [
                        {
                            "type": "expression",
                            "name": "processing_time",
                            "expression": "if(count > 0, total_processing_time / count, 0)",
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
                    "intervals": "$interval",
                    "granularity": "$granularity",
                    "aggregations": [
                        {
                            "type": "doubleMin",
                            "name": "min_processing_time",
                            "fieldName": "processing_time"
                        },
                        {
                            "type": "doubleMax",
                            "name": "max_processing_time",
                            "fieldName": "processing_time"
                        },
                        {
                            "type": "doubleSum",
                            "name": "total_processing_time",
                            "fieldName": "total_processing_time"
                        },
                        {
                            "type": "longSum",
                            "name": "event_count",
                            "fieldName": "count"
                        }
                    ],
                    "postAggregations": [
                        {
                            "type": "expression",
                            "name": "avg_processing_time",
                            "expression": "if(event_count > 0, total_processing_time / event_count, 0)"
                        }
                    ],
                    "filter": {
                        "type": "selector",
                        "dimension": "dataset",
                        "value": "$datasetId"
                    }
                }
            },
            params: {},
            parse: (response: any) => {
                const payload = _.get(response, 'result') || [];

                const getSeries = (key: string) => {
                    return _.map(payload, value => {
                        const timestamp = Date.parse(_.get(value, 'timestamp'));
                        let counter = _.get(value, ['result', key]);
                        if (_.includes(_.lowerCase(counter), "infinity")) {
                            counter = 0;
                        }
                        return [timestamp, counter];
                    });
                }

                return [
                    {
                        name: 'Min Processing Time',
                        data: getSeries('min_processing_time')
                    },
                    {
                        name: 'Max Processing Time',
                        data: getSeries('max_processing_time')
                    },
                    {
                        name: 'Avg Processing Time',
                        data: getSeries('avg_processing_time')
                    }
                ]
            },
            error() {
                return [];
            },
            context: (payload: any) => {
                const { body, metadata = {} } = payload;
                const { interval = 1140, granularity } = metadata;
                const strPayload = JSON.stringify(body);
                const start = dayjs().subtract(interval - 1140, 'minutes').format(dateFormat);
                const end = dayjs().add(1, 'day').format(dateFormat);
                const rangeInterval = `${start}/${end}`;
                const updatedStrPayload = _.replace(_.replace(strPayload, '$interval', rangeInterval), '$granularity', granularity);
                const updatedPayload = JSON.parse(updatedStrPayload);
                payload.body = updatedPayload;
                return payload;
            }
        }
    }
}