import * as _ from 'lodash';
import dayjs from 'dayjs';
import { Theme } from '@mui/material';
import promql from '../promql';


export default {
    postgres_cpu_usage: {
        type: 'area',
        series: [],
        options: {
            chart: {
                type: 'area',
                animations: {
                    enabled: true,
                    easing: 'linear',
                    dynamicAnimation: {
                        speed: 2000
                    }
                },
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            },
            zoom: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            yaxis: {
                labels: {
                    formatter: function (value: number) {
                        return Math.floor(value * 100);
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
                },
                y: {
                    formatter(val: number) {
                        return Math.floor(val * 100);
                    }
                }
            },
            xaxis: {
                type: 'datetime',
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    show: false
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
                query: promql.postgres_cpu_usage.query,
                end: 1676457179.487,
                start: 1676456879.487,
                step: 1
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                return _.map(result, payload => ({
                    name: _.get(payload, 'metric.instance') || "Postgres",
                    data: _.get(payload, 'values')
                }))
            },
            error() {
                return [0]
            }
        }
    },
    postgres_memory_usage: {
        type: 'area',
        series: [],
        options: {
            chart: {
                type: 'area',
                animations: {
                    enabled: true,
                    easing: 'linear',
                    dynamicAnimation: {
                        speed: 2000
                    }
                },
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            },
            zoom: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
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
                        return new Date(value * 1000)
                    }
                },
                y: {
                    formatter(val: number) {
                        return _.round(val, 1);
                    }
                }
            },
            xaxis: {
                type: 'datetime',
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    show: false
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
                query: promql.postgres_memory_usage.query,
                end: 1676457179.487,
                start: 1676456879.487,
                step: 1
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                return _.map(result, payload => ({
                    name: _.get(payload, 'metric.namespace'),
                    data: _.get(payload, 'values')
                }))
            },
            error() {
                return [0]
            }
        }
    },
    postgres_fds: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.postgres_fds.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })

                return result?.length ? sum : 0;
            },
            error() {
                return 0
            }
        }
    },
}