import * as _ from 'lodash';

export const commonMetrics = {
    frequency: 15,
    interval: 5
}

export default {
    node_memory: {
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
            title: {
                "text": "Memory Usage"
            },
            yaxis: {
                min: 0,
                max: 100,
                tickAmount: 5,
                labels: {
                    formatter: function (value: number) {
                        return Math.floor(value);
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
                        return Math.floor(val);
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
                crosshairs: {
                    fill: {
                        type: 'gradient',
                        gradient: {
                            colorFrom: '#D8E3F0',
                            colorTo: '#BED1E6',
                            stops: [0, 100],
                            opacityFrom: 0.4,
                            opacityTo: 0.5
                        }
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
                query: '100 - ((node_memory_MemFree_bytes / node_memory_MemTotal_bytes) * 100)',
                start: '1676015290.967',
                end: '1676015590.967',
                step: 1
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                return _.map(result, payload => ({
                    name: _.get(payload, 'metric.instance'),
                    data: _.get(payload, 'values')
                }))
            },
            error() {
                return [0]
            }
        }
    },
    node_cpu: {
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
            title: {
                "text": "CPU Usage"
            },
            yaxis: {
                min: 0,
                max: 100,
                tickAmount: 5,
                labels: {
                    formatter: function (value: number) {
                        return Math.floor(value);
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
                        return `$ ${val}`;
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
                crosshairs: {
                    fill: {
                        type: 'gradient',
                        gradient: {
                            colorFrom: '#D8E3F0',
                            colorTo: '#BED1E6',
                            stops: [0, 100],
                            opacityFrom: 0.4,
                            opacityTo: 0.5
                        }
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
                query: '100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)',
                end: 1676457179.487,
                start: 1676456879.487,
                step: 1
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                return _.map(result, payload => ({
                    name: _.get(payload, 'metric.instance'),
                    data: _.get(payload, 'values')
                }))
            },
            error() {
                return [0]
            }
        }
    },
    cpu_percentage: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: "100 - (avg by (instance) (irate(node_cpu_seconds_total{mode='idle'}[5m])) * 100)"
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })
                return _.floor(sum / result?.length);
            },
            error() {
                return [0]
            }
        }
    },
    memory_percentage: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: "100 - ((node_memory_MemFree_bytes / node_memory_MemTotal_bytes) * 100)"
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })
                return _.floor(sum / result?.length);
            },
            error() {
                return [0]
            }
        }
    },
    disk_percentage: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: '100 - ((node_filesystem_free_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100)'
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })
                return _.floor(sum / result?.length);
            },
            error() {
                return [0]
            }
        }
    },
    nodes_percentage: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: 'abs(sum(kube_node_info))'
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })
                return _.floor(sum / result?.length);
            },
            error() {
                return [0]
            }
        }
    },
    nodes_Radial: {
        type: 'radialBar',
        series: [],
        options: {
            chart: {
                type: 'radialBar'
            },
            plotOptions: {
                radialBar: {
                    hollow: {
                        margin: 0,
                        size: '85%'
                    },
                    track: {
                        margin: 0
                    },
                    dataLabels: {
                        name: {
                            show: false
                        },
                        value: {
                            offsetY: 5,
                            fontSize: '1rem',
                            fontWeight: 500,
                            formatter: function (val: any) {
                                return `${val}% UP`
                            }
                        }
                    }
                }
            },
            labels: ['Nodes'],
        },
        query: {
            type: 'api',
            timeout: 3000,
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: '100 * count(up == 1) by (instance) / count(up) by (instance)'
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })
                return [_.floor(sum / result?.length)];
            },
            error() {
                return [0]
            }
        }
    },
    number_of_kafka_brokers: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: 'kafka_brokers'
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })
                return _.floor(sum / result?.length);
            },
            error() {
                return [0]
            }
        }
    },
    kafka_broker_upTime: {
        type: 'line',
        series: [],
        options: {
            chart: {
                type: 'line',
                height: 350,
                zoom: {
                    enabled: true,
                    type: 'x',
                    autoScaleYaxis: true
                },
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: 2,
                curve: 'smooth'
            },
            xaxis: {
                type: 'datetime',
                labels: {
                    datetimeFormatter: {
                        year: 'yyyy',
                        month: 'MMM \'yy',
                        day: 'dd MMM',
                        hour: 'HH:mm'
                    }
                }
            },
            yaxis: {
                title: {
                    text: 'Value'
                }
            },
            tooltip: {
                x: {
                    format: 'dd MMM yyyy HH:mm'
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
                query: 'kafka_brokers',
                end: 1676457179.487,
                start: 1676456879.487,
                step: 1
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                return _.map(result, payload => ({
                    name: _.get(payload, 'metric.instance'),
                    data: _.get(payload, 'values')
                }))
            },
            error() {
                return [0]
            }
        }
    },
    druid_running_tasks: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: 'count(druid_tasks_duration{task_status="RUNNING"}) by (task_status)'
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })
                return _.floor(sum / result?.length);
            },
            error() {
                return [0]
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
                query: 'count(druid_tasks_duration{task_status="SUCCESS"}) by (task_status)'
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })
                return _.floor(sum / result?.length);
            },
            error() {
                return [0]
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
                query: 'count(druid_tasks_duration{task_status="FAILED"}) by (task_status)'
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })
                return _.floor(sum / result?.length);
            },
            error() {
                return [0]
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
                query: 'druid_health_status'
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
                query: 'count(druid_datasource{})'
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })

                return _.floor(sum / result?.length);
            },
            error() {
                return [0]
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
                query: 'count(druid_datasource{})'
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })

                return _.floor(sum / result?.length);
            },
            error() {
                return [0]
            }
        }
    }
}