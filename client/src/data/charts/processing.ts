import * as _ from 'lodash';
import dayjs from 'dayjs';
import defaultConf from './common';

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
                    "queryType": "groupBy",
                    "dataSource": "system-stats",
                    "intervals": "$interval",
                    "granularity": "all",
                    "aggregations": [
                        {
                            "type": "doubleMin",
                            "name": "total_processing_time",
                            "fieldName": "total_processing_time"
                        }
                    ]
                }
            },
            params: {},
            parse: (response: any) => {
                const payload = _.get(response, 'result') || [];
                return _.sumBy(payload, value => {
                    return _.get(value, 'event.total_processing_time') || 0;
                })
            },
            error() {
                return 0;
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
                    "queryType": "groupBy",
                    "dataSource": "system-stats",
                    "intervals": "$interval",
                    "granularity": "all",
                    "aggregations": [
                        {
                            "type": "doubleMax",
                            "name": "total_processing_time",
                            "fieldName": "total_processing_time"
                        }
                    ]
                }
            },
            params: {},
            parse: (response: any) => {
                const payload = _.get(response, 'result') || [];
                return _.sumBy(payload, value => {
                    return _.get(value, 'event.total_processing_time') || 0;
                })
            },
            error() {
                return 0;
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
                            "type": "doubleMean",
                            "name": "total_processing_time",
                            "fieldName": "total_processing_time"
                        }
                    ]
                }
            },
            params: {},
            parse: (response: any) => {
                const payload = _.get(response, 'result') || [];
                const sum = _.sumBy(payload, value => {
                    return _.get(value, 'event.total_processing_time') || 0;
                })

                return _.floor(sum)
            },
            error() {
                return 0;
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
        type: 'bar',
        series: [],
        options: {
            chart: {
                type: 'bar',
                animations: defaultConf.animations,
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded'
                },
            },
            dataLabels: {
                enabled: true,
                textAnchor: 'middle',
                formatter: function (value: number) {
                    return _.floor(value);
                }
            },
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
                        return _.floor(value);
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
                    "intervals": "$interval",
                    "granularity": "day",
                    "aggregations": [
                        {
                            "type": "doubleMin",
                            "name": "min",
                            "fieldName": "total_processing_time"
                        },
                        {
                            "type": "doubleMax",
                            "name": "max",
                            "fieldName": "total_processing_time"
                        },
                        {
                            "type": "doubleMean",
                            "name": "avg",
                            "fieldName": "total_processing_time"
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
                        const counter = _.get(value, ['result', key]);
                        return [timestamp, counter];
                    });
                }

                return [
                    {
                        name: 'Min Processing Time',
                        data: getSeries('min')
                    },
                    {
                        name: 'Max Processing Time',
                        data: getSeries('max')
                    },
                    {
                        name: 'Avg Processing Time',
                        data: getSeries('avg')
                    }
                ]
            },
            error() {
                return [];
            },
            context: (payload: any) => {
                const { body, metadata = {} } = payload;
                const { interval = 1140 } = metadata;
                const strPayload = JSON.stringify(body);
                const start = dayjs().subtract(interval - 1140, 'minutes').format(dateFormat);
                const end = dayjs().add(1, 'day').format(dateFormat);
                const rangeInterval = `${start}/${end}`;
                const updatedStrPayload = _.replace(strPayload, '$interval', rangeInterval);
                const updatedPayload = JSON.parse(updatedStrPayload);
                payload.body = updatedPayload;
                return payload;
            }
        }
    }
}