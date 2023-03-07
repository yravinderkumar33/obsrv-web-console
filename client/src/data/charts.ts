import * as _ from 'lodash';
import dayjs from 'dayjs';

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
                query: '(1 - sum(:node_memory_MemAvailable_bytes:sum{cluster=""}) / sum(node_memory_MemTotal_bytes{job="node-exporter",cluster=""})) * 100',
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
                query: '(cluster:node_cpu:ratio_rate5m{cluster=""}) * 100',
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
                query: 'cluster:node_cpu:ratio_rate5m{cluster=""}'
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })
                return result?.length ? _.floor((sum / result?.length) * 100) : 0;
            },
            error() {
                return 0;
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
                query: '1 - sum(:node_memory_MemAvailable_bytes:sum{cluster=""}) / sum(node_memory_MemTotal_bytes{job="node-exporter",cluster=""})'
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })
                return result?.length ? _.floor((sum / result?.length) * 100) : 0;
            },
            error() {
                return 0
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
                return result?.length ? _.floor(sum / result?.length) : 0;
            },
            error() {
                return 0
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
                query: 'count(druid_tasks_duration{task_status="SUCCESS"}) by (task_status)'
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
                query: 'count(druid_tasks_duration{task_status="FAILED"}) by (task_status)'
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
                query: 'count(druid_datasource{})'
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
                query: 'count(druid_datasource{})'
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
                query: 'sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_irate{cluster=""}) by (druid)',
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
    kafka_cpu_usage: {
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
                query: 'sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_irate{namespace="kafka"}) by (namespace)',
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
    kafka_memory_usage: {
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
                query: 'sum(container_memory_rss{job="kubelet", metrics_path="/metrics/cadvisor", cluster="", container!="", namespace="kafka"}) by (namespace)',
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
                query: 'sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_irate{cluster=""}) by (postgresql)',
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
    kafka_messages_read_in_five_min: {
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
                query: 'sum(rate(kafka_topic_partition_current_offset{topic!="__consumer_offsets"}[5m])) by (topic)',
                end: 1676457179.487,
                start: 1676456879.487,
                step: 1
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                return _.map(result, payload => ({
                    name: _.get(payload, 'metric.topic'),
                    data: _.get(payload, 'values')
                }))
            },
            error() {
                return [0]
            }
        }
    },
    kafka_messages_consume_in_five_min: {
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
                query: 'sum(rate(kafka_consumergroup_current_offset{topic!="__consumer_offsets"}[5m])) by (topic)',
                end: 1676457179.487,
                start: 1676456879.487,
                step: 1
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
                return _.map(result, payload => ({
                    name: _.get(payload, 'metric.topic'),
                    data: _.get(payload, 'values')
                }))
            },
            error() {
                return [0]
            }
        }
    },
    kafka_total_in_messages: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: 'sum(rate(kafka_topic_partition_current_offset{topic!="__consumer_offsets"}[5m])) by (topic)'
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
    kafka_total_out_messages: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: 'sum(rate(kafka_consumergroup_current_offset{topic!="__consumer_offsets"}[5m])) by (topic)'
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
                query: 'sum(container_memory_rss{job="kubelet", metrics_path="/metrics/cadvisor", cluster="", container!="", namespace="postgresql"}) by (namespace)',
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
    kafka_partitions_per_topic: {
        type: 'bar',
        series: [],
        options: {
            chart: {
                type: 'bar'
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    horizontal: true,
                }
            },
            dataLabels: {
                enabled: false
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
                query: 'sum by(topic) (kafka_topic_partitions{instance="10.10.1.149:9308",topic=~"(dev\\.denorm|dev\\.denorm\\.failed|dev\\.druid\\.events\\.summary|dev\\.druid\\.events\\.telemetry|dev\\.duplicate|dev\\.extractor\\.duplicate|dev\\.extractor\\.failed|dev\\.failed|dev\\.ingest|dev\\.invalid|dev\\.raw|dev\\.stats|dev\\.system\\.events|dev\\.telemetry\\.denorm|dev\\.telemetry\\.duplicate|dev\\.telemetry\\.failed|dev\\.transform|dev\\.unique|local\\.ingest|obs20-events)"})',
                end: 1676457179.487,
                start: 1676456879.487,
                step: 1
            },
            setConfig: (options: any, setOptions: any, response: any) => {
                const result = _.get(response, 'result.data.result') || [];
                const xAxisLabels = _.map(result, 'metric.topic');
                setOptions({
                    ...options, xAxis: {
                        categories: xAxisLabels,
                    }
                }
                )
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result') || [];
                const series = _.map(result, 'value[1]')
                return {
                    name: 'partitions',
                    data: series
                }
            },
            error() {
                return {
                    name: 'partitions',
                    data: []
                }
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
                query: 'sum(container_memory_rss{job="kubelet", metrics_path="/metrics/cadvisor", cluster="", container!="", namespace="druid-raw"}) by (namespace)',
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
    postgres_fds: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: 'process_max_fds{namespace="postgresql"}'
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