import * as _ from 'lodash';
import dayjs from 'dayjs';

import promql from 'data/promql';
import defaultConf from './common';

export default {
    node_query_response_time: {
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
                show: false
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
                        return dayjs.unix(timestamp).format('DD MMM HH:mm');
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
            url: '/api/report/v1/query/range',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.node_query_response_time.query,
                start: '1676015290.967',
                end: '1676015590.967',
                step: '1m'
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                return _.map(result, payload => ({
                    name: 'Query Response Time',
                    data: _.get(payload, 'values')
                }))
            },
            error() {
                return 0;
            }
        }
    },
    node_query_response_time_min: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.node_query_response_time_min.query,
            },
            parse: (response: any) => {
                const value = _.get(response, 'result.data.result[0].value[1]') || 0;
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
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.node_query_response_time_max.query
            },
            parse: (response: any) => {
                const value = _.get(response, 'result.data.result[0].value[1]') || 0;
                if (!value) throw new Error();
                return _.floor(value, 1)
            },
            error() {
                return [0, "error"];
            }
        }
    },
    node_query_response_time_avg: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.node_query_response_time_avg.query
            },
            parse: (response: any) => {
                const value = _.get(response, 'result.data.result[0].value[1]') || 0;
                if (!value) throw new Error();
                return _.floor(value, 1)
            },
            error() {
                return [0, "error"];
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
                show: false
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
                        return dayjs.unix(timestamp).format('DD MMM HH:mm');
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
            url: '/api/report/v1/query/range',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.node_total_api_call.query,
                start: '1676015290.967',
                end: '1676015590.967',
                step: '1m'
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                return _.map(result, payload => ({
                    name: 'Total Api Calls',
                    data: _.get(payload, 'values')
                }))
            },
            error() {
                return 0;
            }
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
                show: false
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
                        return dayjs.unix(timestamp).format('DD MMM HH:mm');
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
            url: '/api/report/v1/query/range',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.node_total_failed_api_call.query,
                start: '1676015290.967',
                end: '1676015590.967',
                step: '1m'
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                return _.map(result, payload => ({
                    name: 'Total Api Calls',
                    data: _.get(payload, 'values')
                }))
            },
            error() {
                return 0;
            }
        }
    },
    api_failure_percentage: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.api_failure_percentage.query
            },
            parse: (response: any) => {
                const value = _.get(response, 'result.data.result[0].value[1]') || 0;
                if (!value) throw new Error();
                if (value > 1) return ["UNHEALTHY", "error"]
                if (value > 0.1 && value <= 1) return ["HEALTHY", "warning"]
                return ["HEALTHY", "primary"];
            },
            error() {
                return [0, "error"];
            }
        }
    },
}