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
}