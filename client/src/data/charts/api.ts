import * as _ from 'lodash';
import dayjs from 'dayjs';
import prettyMilliseconds from 'pretty-ms';

import promql from 'data/promql';
import defaultConf from './common';
import endpoints from 'data/apiEndpoints';

export default {
    node_query_response_time_min: {
        query: {
            type: 'api',
            timeout: 3000,
            url: endpoints.prometheusRead,
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.node_query_response_time_min.query,
            },
            parse: (response: any) => {
                const value = _.get(response, 'data.result[0].value[1]') || 0;
                return _.floor(value, 1)
            },
            error() {
                return [0, "error"];
            }
        }
    },
    node_query_response_time_max: {
        query: {
            type: 'api',
            timeout: 3000,
            url: endpoints.prometheusRead,
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.node_query_response_time_max.query
            },
            parse: (response: any) => {
                const value = _.get(response, 'data.result[0].value[1]') || 0;
                if (!value) throw new Error();
                return prettyMilliseconds(+value);
            },
            error() {
                return [prettyMilliseconds(0), "error"];
            },
            context: (payload: any) => {
                const clonedPayload = _.cloneDeep(payload);
                const { params } = clonedPayload;
                const query = _.get(params, 'query');
                if (query) {
                    const now = dayjs();
                    const minutesSinceStartOfDay = now.hour() * 60 + now.minute();
                    _.set(params, 'query', _.replace(query, /\$interval/g, `${minutesSinceStartOfDay}m`));
                }
                return clonedPayload;
            }
        }
    },
    node_query_response_time_avg: {
        query: {
            type: 'api',
            timeout: 3000,
            url: endpoints.prometheusRead,
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.node_query_response_time_avg.query
            },
            parse: (response: any) => {
                const value = _.get(response, 'data.result[0].value[1]') || 0;
                if (!value) throw new Error();
                return prettyMilliseconds(+value);
            },
            error() {
                return [prettyMilliseconds(0), "error"];
            },
            context: (payload: any) => {
                const clonedPayload = _.cloneDeep(payload);
                const { params } = clonedPayload;
                const query = _.get(params, 'query');
                if (query) {
                    const now = dayjs();
                    const minutesSinceStartOfDay = now.hour() * 60 + now.minute();
                    _.set(params, 'query', _.replace(query, /\$interval/g, `${minutesSinceStartOfDay}m`));
                }
                return clonedPayload;
            }
        }
    },
    node_total_api_call: {
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
            legend: {
                show: true
            },
            stroke: {
                width: 2,
                curve: 'smooth'
            },
            yaxis: {
                labels: {
                    formatter: function (value: number) {
                        return ` ${_.round(value, 1)}`;
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
                        return new Date(value * 1000)
                    }
                }
            },
            xaxis: {
                tickAmount: 10,
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
            url: endpoints.prometheusReadRange,
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.node_total_api_call.query,
                step: '1m'
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result');
                return _.map(result, payload => ({
                    name: _.get(payload, 'metric.entity') || 'Total Api Calls',
                    data: _.get(payload, 'values')
                }))
            },
            error() {
                return 0;
            },
            context: (payload: any) => {
                const clonedPayload = _.cloneDeep(payload);
                const { params, metadata = {} } = clonedPayload;
                const { step } = metadata;
                const query = _.get(params, 'query');
                if (step && query) {
                    _.set(params, 'query', _.replace(query, '$interval', step));
                }
                return clonedPayload;
            },
        }
    },
    node_total_failed_api_call: {
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
            legend: {
                show: true
            },
            stroke: {
                width: 2,
                curve: 'smooth'
            },
            yaxis: {
                labels: {
                    formatter: function (value: number) {
                        return ` ${_.round(value, 1)}`;
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
                        return new Date(value * 1000);
                    }
                }
            },
            xaxis: {
                tickAmount: 10,
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
            url: endpoints.prometheusReadRange,
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.node_total_failed_api_call.query,
                step: '1m'
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result');
                return _.map(result, payload => ({
                    name: _.get(payload, 'metric.entity') || 'Total Failed Api Calls',
                    data: _.get(payload, 'values')
                }))
            },
            error() {
                return 0;
            },
            context: (payload: any) => {
                const clonedPayload = _.cloneDeep(payload);
                const { params, metadata = {} } = clonedPayload;
                const { step } = metadata;
                const query = _.get(params, 'query');
                if (step && query) {
                    _.set(params, 'query', _.replace(query, '$interval', step));
                }
                return clonedPayload;
            },
        }
    },
    api_failure_percentage: {
        query: {
            type: 'api',
            timeout: 3000,
            url: endpoints.prometheusRead,
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.api_failure_percentage.query
            },
            parse: (response: any) => {
                const value = _.get(response, 'data.result[0].value[1]') || 0;
                if (!value) throw new Error();
                if (value > 1) return ["UNHEALTHY", "error"]
                if (value > 0.1 && value <= 1) return ["HEALTHY", "warning"]
                return ["HEALTHY", "primary"];
            },
            error() {
                return [0, "error"];
            },
            context: (payload: any) => {
                const clonedPayload = _.cloneDeep(payload);
                const { params, metadata = {} } = clonedPayload;
                const query = _.get(params, 'query');
                if (query) {
                    const now = dayjs();
                    const minutesSinceStartOfDay = now.hour() * 60 + now.minute();
                    _.set(params, 'query', _.replace(query, /\$interval/g, `${minutesSinceStartOfDay}m`));
                }
                return clonedPayload;
            }
        }
    },
    api_failure_percent: {
        query: {
            type: 'api',
            timeout: 3000,
            url: endpoints.prometheusRead,
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.api_failure_percentage.query
            },
            parse: (response: any) => {
                const value = _.get(response, 'data.result[0].value[1]') || 0;
                if (!value) throw new Error();
                return _.floor(value, 3);
            },
            error() {
                return [0, "error"];
            },
            context: (payload: any) => {
                const clonedPayload = _.cloneDeep(payload);
                const { params } = clonedPayload;
                const query = _.get(params, 'query');
                if (query) {
                    const now = dayjs();
                    const minutesSinceStartOfDay = now.hour() * 60 + now.minute();
                    _.set(params, 'query', _.replace(query, /\$interval/g, `${minutesSinceStartOfDay}m`));
                }
                return clonedPayload;
            }
        }
    },
    node_query_response_avg_timeseries: {
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
            legend: {
                show: true
            },
            stroke: {
                width: 2,
                curve: 'smooth'
            },
            yaxis: {
                labels: {
                    formatter: function (value: number) {
                        return ` ${_.round(value, 1)} ms`;
                    }
                },
                title: {
                    text: "Query Response Time (Ms)"
                }
            },
            tooltip: {
                theme: 'light',
                x: {
                    show: true,
                    formatter(value: number) {
                        return new Date(value * 1000)
                    }
                }
            },
            xaxis: {
                tickAmount: 10,
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
            url: endpoints.prometheusReadRange,
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.node_query_response_time_avg_timeseries.query,
                step: '1m'
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result');
                return _.map(result, payload => ({
                    name: _.get(payload, 'metric.entity') || "Avg Query Response Time",
                    data: _.get(payload, 'values')
                }))
            },
            error() {
                return 0;
            },
            context: (payload: any) => {
                const clonedPayload = _.cloneDeep(payload);
                const { params, metadata = {} } = clonedPayload;
                const { step, res } = metadata;
                const query = _.get(params, 'query');
                if (step && query) {
                    _.set(params, 'query', _.replace(_.replace(query, '$interval', step), '$res', res));
                }
                return clonedPayload;
            }
        }
    },
    api_throughput: {
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
            legend: {
                show: true
            },
            stroke: {
                width: 2,
                curve: 'smooth'
            },
            yaxis: {
                labels: {
                    formatter: function (value: number) {
                        return ` ${_.round(value, 1)}`;
                    }
                },
                title: {
                    text: "Throughput = (count / response time )"
                }
            },
            tooltip: {
                theme: 'light',
                x: {
                    show: true,
                    formatter(value: number) {
                        return new Date(value * 1000)
                    }
                }
            },
            xaxis: {
                tickAmount: 10,
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
            url: endpoints.prometheusReadRange,
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.apiThroughput.query,
                step: '1m'
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result');
                return _.map(result, payload => ({
                    name: _.get(payload, 'metric.entity') || "Throughput",
                    data: _.get(payload, 'values')
                }))
            },
            error() {
                return 0;
            },
            context: (payload: any) => {
                const clonedPayload = _.cloneDeep(payload);
                const { params, metadata = {} } = clonedPayload;
                const { step, res } = metadata;
                const query = _.get(params, 'query');
                if (step && query) {
                    _.set(params, 'query', _.replace(_.replace(query, /\$interval/g, step), /\$res/g, res));
                }
                return clonedPayload;
            }
        }
    }
}