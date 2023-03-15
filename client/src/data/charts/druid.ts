import * as _ from 'lodash';
import dayjs from 'dayjs';
import { Theme } from '@mui/material';
import promql from '../promql';

export default {
    druid_running_tasks: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.druid_running_tasks.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })
                return result?.length ? _.floor(sum / result?.length) : 0;
            },
            error() {
                return 0
            }
        }
    },
    druid_completed_tasks: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.druid_completed_tasks.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })
                return result?.length ? _.floor(sum / result?.length) : 0;
            },
            error() {
                return 0
            }
        }
    },
    druid_failed_tasks: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.druid_failed_tasks.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })
                return result?.length ? _.floor(sum / result?.length) : 0;
            },
            error() {
                return 0
            }
        }
    },
    druid_health_status: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.druid_health_status.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })

                return sum === 1 ? "HEALTHY" : "UNHEALTHY";
            },
            error() {
                return "UNHEALTHY"
            }
        }
    },
    druid_total_datasources: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.druid_total_datasources.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })

                return result?.length ? _.floor(sum / result?.length) : 0;
            },
            error() {
                return 0
            }
        }
    },
    druid_total_segments: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.druid_total_segments.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })

                return result?.length ? _.floor(sum / result?.length) : 0;
            },
            error() {
                return 0
            }
        }
    },
    druid_unloaded_segments: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.druid_unloaded_segments.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })

                return result?.length ? _.floor(sum / result?.length) : 0;
            },
            error() {
                return 0
            }
        }
    },
    druid_cpu_usage: {
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
                        return _.round(value, 1);
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
                query: promql.druid_cpu_usage.query,
                end: 1676457179.487,
                start: 1676456879.487,
                step: 1
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                return _.map(result, payload => ({
                    name: _.get(payload, 'metric.instance') || "Druid",
                    data: _.get(payload, 'values')
                }))
            },
            error() {
                return [0]
            }
        }
    },
    druid_memory_usage: {
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
                query: promql.druid_memory_usage.query,
                end: 1676457179.487,
                start: 1676456879.487,
                step: 1
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                return _.map(result, payload => ({
                    name: "Kafka",
                    data: _.get(payload, 'values')
                }))
            },
            error() {
                return [0]
            }
        }
    },
    druid_avg_processing_time: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/obsrv/v1/query',
            method: 'POST',
            headers: {},
            body: {},
            params: {},
            parse: (response: any) => {
                const result = _.get(response, 'result') || [];
                return _.sumBy(result, val => {
                    return _.round(_.get(val, 'event.total_processing_time') || 0, 2)
                })
            },
            error() {
                return 0
            }
        }
    },
    last_synced_time: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/obsrv/v1/query',
            method: 'POST',
            headers: {},
            body: {},
            params: {},
            parse: (response: any) => {
                const ms = _.get(response, 'result[0].event.last_synced_time') || 0;
                return dayjs(ms).format('YYYY-MM-DD HH:mm:ss')
            },
            error() {
                return 0
            }
        }
    },
    total_events_processed: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/obsrv/v1/query',
            method: 'POST',
            headers: {},
            body: {},
            params: {},
            parse: (response: any) => {
                const payload = _.get(response, 'result') || [];
                return _.sumBy(payload, value => {
                    return _.get(value, 'result.count') || 0;
                })
            },
            error() {
                return 0
            }
        }
    },
    failed_events_summary: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/obsrv/v1/query',
            method: 'POST',
            headers: {},
            body: {},
            params: {},
            parse: (response: any) => {
                const payload = _.get(response, 'result') || [];
                return _.sumBy(payload, value => {
                    return _.get(value, 'event.count') || 0;
                })
            },
            error() {
                return 0
            }
        }
    },
    average_processing_time_series: {
        type: 'area',
        series: [],
        options: {
            chart: {
                type: 'area',
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 2000,
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
                        return _.round(value, 1);
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
            url: '/obsrv/v1/query',
            method: 'POST',
            headers: {},
            body: {},
            params: {},
            parse: (response: any) => {
                const payload = _.get(response, 'result') || [];
                const series = _.map(payload, value => {
                    const timestamp = Date.parse(_.get(value, 'timestamp'));
                    const time = _.get(value, 'result.total_processing_time')
                    return [timestamp, time];
                });

                return [{
                    name: 'Average Processing Time',
                    data: series
                }]
            },
            error() {
                return 0
            }
        }
    },
    total_events_processed_time_series: {
        type: 'area',
        series: [],
        options: {
            chart: {
                type: 'area',
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 2000,
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
                        return _.round(value, 1);
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
            url: '/obsrv/v1/query',
            method: 'POST',
            headers: {},
            body: {},
            params: {},
            parse: (response: any) => {
                const payload = _.get(response, 'result') || [];
                const series = _.map(payload, value => {
                    const timestamp = Date.parse(_.get(value, 'timestamp'));
                    const count = _.get(value, 'result.count')
                    return [timestamp, count];
                });

                return [{
                    name: 'Events Processed',
                    data: series
                }]
            },
            error() {
                return 0
            }
        }
    },
}