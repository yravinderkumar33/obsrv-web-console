import * as _ from 'lodash';
import dayjs from 'dayjs';
import defaultConf from './common';

const dateFormat = 'YYYY-MM-DD'

export default {
    totalEventsProcessedToday: {
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
                            "name": "count",
                            "fieldName": "count"
                        }
                    ]
                }
            },
            params: {},
            parse: (response: any) => {
                const payload = _.get(response, 'result') || [];
                return _.sumBy(payload, value => {
                    return _.get(value, 'event.count') || 0;
                })
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
    totalEventsProcessedTimeSeries: {
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
                show: false
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
                    text: "Count"
                }
            },
            tooltip: {
                theme: 'light',
                x: {
                    show: true,
                    formatter(value: number) {
                        return dayjs(value).format('DD MMM HH:mm')
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
            body: {
                "context": {
                    "dataSource": "system-stats"
                },
                "query": {
                    "queryType": "timeseries",
                    "dataSource": "system-stats",
                    "intervals": "$interval",
                    "granularity": "$granularity",
                    "aggregations": [
                        {
                            "type": "longSum",
                            "name": "count",
                            "fieldName": "count"
                        }
                    ]
                }
            },
            params: {},
            parse: (response: any) => {
                const payload = _.get(response, 'result') || [];
                const series = _.map(payload, value => {
                    const timestamp = Date.parse(_.get(value, 'timestamp'));
                    const count = _.get(value, 'result.count')
                    return [timestamp, count];
                });

                return [{
                    name: 'Total Events Processed',
                    data: series
                }]
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
            },
            noParams: true
        }
    },
    totalEventsProcessedTimeSeriesPerDataset: {
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
                show: false
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
            body: {
                "context": {
                    "dataSource": "system-stats"
                },
                "query": {
                    "queryType": "timeseries",
                    "dataSource": "system-stats",
                    "intervals": "$interval",
                    "granularity": "$granularity",
                    "aggregations": [
                        {
                            "type": "longSum",
                            "name": "count",
                            "fieldName": "count"
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
                const series = _.map(payload, value => {
                    const timestamp = Date.parse(_.get(value, 'timestamp'));
                    const count = _.get(value, 'result.count')
                    return [timestamp, count];
                });

                return [{
                    name: 'Total Events Processed',
                    data: series
                }]
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
            },
            noParams: true
        }
    }
}