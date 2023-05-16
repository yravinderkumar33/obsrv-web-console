import * as _ from 'lodash';
import prettyBytes from 'pretty-bytes';
import dayjs from 'dayjs';
import defaultConf from './common';
import promql from 'data/promql';
import endpoints from 'data/apiEndpoints';
import prettyMilliseconds from 'pretty-ms';

export default {
    data_growth_over_time: {
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
            zoom: {
                enabled: false
            },
            stroke: {
                width: 2,
                curve: 'smooth'
            },
            yaxis: {
                labels: {
                    formatter: function (value: number) {
                        return prettyBytes(+value, { minimumFractionDigits: 2 });
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
            url: endpoints.prometheusReadRange,
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.data_usage_growth.query,
                step: '5m'
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result');
                return _.map(result, payload => ({
                    name: _.get(payload, 'metric.bucket') || "Data Usage Growth",
                    data: _.get(payload, 'values')
                }))
            },
            error() {
                return [0]
            }
        }
    },
    deep_storage_total: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/prom/api/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.deep_storage_total.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result[0].value[1]');
                if (!result) throw new Error();
                return prettyBytes(+result);
            },
            error() {
                return prettyBytes(0);
            }
        }
    },
    backup_count: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/prom/api/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.backupCount.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result[0].value[1]');
                if (!result) throw new Error();
                return _.floor(result);
            },
            error() {
                return 0
            }
        }
    },
    backup_success_rate: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/prom/api/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.backupSuccessRate.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result[0].value[1]');
                if (!result) throw new Error();
                return _.floor(result * 100);
            },
            error() {
                return 0
            }
        }
    },
    postgres_backup_files: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/prom/api/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.postgres_backup_files.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result[0].value[1]');
                if (!result) throw new Error();
                return result;
            },
            error() {
                return 0
            }
        }
    },
    redis_backup_files: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/prom/api/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.redis_backup_files.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result[0].value[1]');
                if (!result) throw new Error();
                return result;
            },
            error() {
                return 0
            }
        }
    },
    postgres_last_backup_time: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/prom/api/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.postgres_last_backup_time.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result[0].value[1]');
                if (!result) throw new Error();
                return prettyMilliseconds(result * 1000);
            },
            error() {
                return prettyMilliseconds(0)
            }
        }
    },
    redis_last_backup_time: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/prom/api/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.redis_last_backup_time.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result[0].value[1]');
                if (!result) throw new Error();
                return prettyMilliseconds(result * 1000);
            },
            error() {
                return prettyMilliseconds(0)
            }
        }
    }
}
