import * as _ from 'lodash';
import dayjs from 'dayjs';
import promql from '../promql';
import defaultConf from './common'
import endpoints from 'data/apiEndpoints';

export default {
    node_memory: {
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
            grid: {
                ...defaultConf.grid,
                borderColor: 'rgba(26, 17, 16, .2)',
            },
            annotations: {
                yaxis: [
                    {
                        y: 80,
                        y2: 90,
                        fillColor: '#FEB019',
                        opacity: 0.2,
                        label: {
                            borderColor: '#333',
                            style: {
                                fontSize: '10px',
                                background: '#FEB019',
                            },
                            text: 'Warn',
                        }
                    },
                    {
                        y: 90,
                        y2: 100,
                        fillColor: '#FF0000',
                        opacity: 0.3,
                        label: {
                            borderColor: '#333',
                            style: {
                                fontSize: '10px',
                                background: '#FEB019',
                            },
                            text: 'Critical',
                        }
                    }
                ]
            },
            legend: {
                show: false
            },
            zoom: {
                enabled: false
            },
            stroke: {
                width: 2,
                curve: 'smooth'
            },
            title: {
                "text": "Memory Usage",
                align: "right"
            },
            yaxis: {
                min: 0,
                max: 100,
                tickAmount: 5,
                labels: {
                    formatter: function (value: number) {
                        return ` ${_.round(value, 1)}%`;
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
                        return dayjs.unix(timestamp).format('HH:mm');
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
                query: promql.node_memory.query,
                step: '30s'
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result');
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
            grid: {
                ...defaultConf.grid,
                borderColor: 'rgba(26, 17, 16, .2)',
            },
            annotations: {
                yaxis: [
                    {
                        y: 80,
                        y2: 90,
                        fillColor: '#FEB019',
                        opacity: 0.2,
                        label: {
                            borderColor: '#333',
                            style: {
                                fontSize: '10px',
                                background: '#FEB019',
                            },
                            text: 'Warn',
                        }
                    },
                    {
                        y: 90,
                        y2: 100,
                        fillColor: '#FF0000',
                        opacity: 0.2,
                        label: {
                            borderColor: '#333',
                            style: {
                                fontSize: '10px',
                                background: '#FEB019',
                            },
                            text: 'Critical',
                        }
                    }
                ]
            },
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
            title: {
                "text": "CPU Usage",
                align: "right"
            },
            yaxis: {
                min: 0,
                max: 100,
                tickAmount: 5,
                labels: {
                    formatter: function (value: number) {
                        return ` ${_.round(value, 1)}%`;
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
                        return dayjs.unix(timestamp).format('HH:mm');
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
                query: promql.node_cpu.query,
                step: '30s'
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result');
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
            url: endpoints.prometheusRead,
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.cpu_percentage.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result');
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
            url: endpoints.prometheusRead,
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.memory_percentage.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result');
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
            url: endpoints.prometheusRead,
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.instance_disk.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result[0].value[1]');
                if (!result) throw new Error()
                return _.floor(result);
            },
            error() {
                return 0
            }
        }
    },
    nodes_percentage: {
        query: {
            type: 'api',
            timeout: 3000,
            url: endpoints.prometheusRead,
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.nodes_percentage.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result');
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
        series: [0],
        options: {
            chart: {
                type: 'radialBar',
                offsetY: -20,
                sparkline: {
                    enabled: true
                }
            },
            plotOptions: {
                radialBar: {
                    startAngle: -90,
                    endAngle: 90,
                    track: {
                        background: "#e7e7e7",
                        strokeWidth: '97%',
                        margin: 5,
                        dropShadow: {
                            enabled: true,
                            top: 2,
                            left: 0,
                            color: '#999',
                            opacity: 1,
                            blur: 2
                        }
                    },
                    dataLabels: {
                        name: {
                            show: false
                        },
                        value: {
                            offsetY: -2,
                            fontSize: '22px'
                        }
                    }
                }
            },
            grid: {
                padding: {
                    top: -10
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    shadeIntensity: 0.15,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 50, 65, 91]
                },
            },
            labels: ['Disk Usage'],
        }
    },
    instance_memory: {
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
            annotations: {
                yaxis: [
                    {
                        y: 80,
                        y2: 90,
                        fillColor: '#FEB019',
                        opacity: 0.2,
                        label: {
                            borderColor: '#333',
                            style: {
                                fontSize: '10px',
                                background: '#FEB019',
                            },
                            text: 'Warn',
                        }
                    },
                    {
                        y: 90,
                        y2: 100,
                        fillColor: '#FF0000',
                        opacity: 0.2,
                        label: {
                            borderColor: '#333',
                            style: {
                                fontSize: '10px',
                                background: '#FEB019',
                            },
                            text: 'Critical',
                        }
                    }
                ]
            },
            legend: {
                show: false
            },
            stroke: {
                width: 2,
                curve: 'smooth'
            },
            yaxis: {
                min: 0,
                max: 100,
                tickAmount: 5,
                labels: {
                    formatter: function (value: number) {
                        return ` ${_.round(value, 1)}%`;
                    }
                },
                title: {
                    text: "Memory Utilization Percentage"
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
                query: promql.instance_memory.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result');
                return _.map(result, payload => ({
                    name: "Memory Percentage",
                    data: _.get(payload, 'values')
                }))
            },
            error() {
                return [0]
            }
        }
    },
    instance_cpu: {
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
            annotations: {
                yaxis: [
                    {
                        y: 80,
                        y2: 90,
                        fillColor: '#FEB019',
                        opacity: 0.2,
                        label: {
                            borderColor: '#333',
                            style: {
                                fontSize: '10px',
                                background: '#FEB019',
                            },
                            text: 'Warn',
                        }
                    },
                    {
                        y: 90,
                        y2: 100,
                        fillColor: '#FF0000',
                        opacity: 0.2,
                        label: {
                            borderColor: '#333',
                            style: {
                                fontSize: '10px',
                                background: '#FEB019',
                            },
                            text: 'Critical',
                        }
                    }
                ]
            },
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
                min: 0,
                max: 100,
                tickAmount: 5,
                labels: {
                    formatter: function (value: number) {
                        return ` ${_.round(value, 1)}%`;
                    }
                },
                title: {
                    text: "CPU Utilization Percentage"
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
                query: promql.instance_cpu.query,
                step: '5m'
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result');
                return _.map(result, payload => ({
                    name: 'Cpu Percentage',
                    data: _.get(payload, 'values')
                }))
            },
            error() {
                return [0]
            }
        }
    },
    instance_disk: {
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
            annotations: {
                yaxis: [
                    {
                        y: 60,
                        y2: 80,
                        fillColor: '#FEB019',
                        opacity: 0.2,
                        label: {
                            borderColor: '#333',
                            style: {
                                fontSize: '10px',
                                background: '#FEB019',
                            },
                            text: 'Warn',
                        }
                    },
                    {
                        y: 80,
                        y2: 100,
                        fillColor: '#FF0000',
                        opacity: 0.2,
                        label: {
                            borderColor: '#333',
                            style: {
                                fontSize: '10px',
                                background: '#FEB019',
                            },
                            text: 'Critical',
                        }
                    }
                ]
            },
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
                min: 0,
                max: 100,
                tickAmount: 5,
                labels: {
                    formatter: function (value: number) {
                        return ` ${_.round(value, 1)}%`;
                    }
                },
                title: {
                    text: "Disk Utilization Percentage"
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
                query: promql.instance_disk.query,
                step: '5m'
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result');
                return _.map(result, payload => ({
                    name: 'Disk Percentage',
                    data: _.get(payload, 'values')
                }))
            },
            error() {
                return [0]
            }
        }
    },
    disk_usage_radial: {
        type: 'radialBar',
        series: [],
        options: {
            chart: {
                type: 'radialBar',
                offsetY: -20,
                sparkline: {
                    enabled: true
                }
            },
            plotOptions: {
                radialBar: {
                    startAngle: -90,
                    endAngle: 90,
                    track: {
                        background: "#e7e7e7",
                        strokeWidth: '97%',
                        margin: 5,
                        dropShadow: {
                            enabled: true,
                            top: 2,
                            left: 0,
                            color: '#999',
                            opacity: 1,
                            blur: 2
                        }
                    },
                    dataLabels: {
                        name: {
                            show: false
                        },
                        value: {
                            offsetY: -2,
                            fontSize: '22px'
                        }
                    }
                }
            },
            grid: {
                padding: {
                    top: -10
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    shadeIntensity: 0.15,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 50, 65, 91]
                },
            },
            labels: ['Disk Usage'],
        },
        query: {
            type: 'api',
            timeout: 3000,
            url: endpoints.prometheusRead,
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.instance_disk.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result[0].value[1]');
                if (!result) throw new Error()
                return _.floor(result);
            },
            error() {
                return []
            }
        }
    },
    cpu_usage_radial: {
        type: 'radialBar',
        series: [],
        options: {
            chart: {
                type: 'radialBar',
                offsetY: -20,
                sparkline: {
                    enabled: true
                }
            },
            plotOptions: {
                radialBar: {
                    startAngle: -90,
                    endAngle: 90,
                    track: {
                        background: "#e7e7e7",
                        strokeWidth: '97%',
                        margin: 5,
                        dropShadow: {
                            enabled: true,
                            top: 2,
                            left: 0,
                            color: '#999',
                            opacity: 1,
                            blur: 2
                        }
                    },
                    dataLabels: {
                        name: {
                            show: false
                        },
                        value: {
                            offsetY: -2,
                            fontSize: '22px'
                        }
                    }
                }
            },
            grid: {
                padding: {
                    top: -10
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    shadeIntensity: 0.15,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 50, 65, 91]
                },
            },
            labels: ['Disk Usage'],
        },
        query: {
            type: 'api',
            timeout: 3000,
            url: endpoints.prometheusRead,
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.cpu_usage_radial.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })
                return result?.length ? [_.floor((sum / result?.length) * 100)] : [0];
            },
            error() {
                return [0];
            }
        }
    },
    memory_usage_radial: {
        type: 'radialBar',
        series: [],
        options: {
            chart: {
                type: 'radialBar',
                offsetY: -20,
                sparkline: {
                    enabled: true
                }
            },
            plotOptions: {
                radialBar: {
                    startAngle: -90,
                    endAngle: 90,
                    track: {
                        background: "#e7e7e7",
                        strokeWidth: '97%',
                        margin: 5,
                        dropShadow: {
                            enabled: true,
                            top: 2,
                            left: 0,
                            color: '#999',
                            opacity: 1,
                            blur: 2
                        }
                    },
                    dataLabels: {
                        name: {
                            show: false
                        },
                        value: {
                            offsetY: -2,
                            fontSize: '22px'
                        }
                    }
                }
            },
            grid: {
                padding: {
                    top: -10
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    shadeIntensity: 0.15,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 50, 65, 91]
                },
            },
            labels: ['Disk Usage'],
        },
        query: {
            type: 'api',
            timeout: 3000,
            url: endpoints.prometheusRead,
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.memory_usage_radial.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })
                return result?.length ? [_.floor((sum / result?.length) * 100)] : [0];
            },
            error() {
                return [0]
            }
        }
    },
    total_nodes_count: {
        query: {
            type: 'api',
            timeout: 3000,
            url: endpoints.prometheusRead,
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.cluster_total_nodes_count.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })
                return _.floor(sum);
            },
            error() {
                return 0;
            }
        }
    },
    total_running_nodes_count: {
        query: {
            type: 'api',
            timeout: 3000,
            url: endpoints.prometheusRead,
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.cluster_running_nodes_count.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })
                return _.floor(sum);
            },
            error() {
                return 0
            }
        }
    },
    totalCPU: {
        query: {
            type: 'api',
            timeout: 3000,
            url: endpoints.prometheusRead,
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.totalCpuCores.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result');
                const sum = _.sumBy(result, (payload: any) => {
                    const { value } = payload;
                    const [_, percentage = 0] = value;
                    return +percentage
                })
                return _.floor(sum);
            },
            error() {
                return 0
            }
        }
    },
    throughput: {
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
                        return `${_.round(value / 1024, 1)} kB/s`;
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
                        return dayjs.unix(timestamp).format('HH:mm');
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
                query: promql.throughput.query,
                step: '5m'
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result');
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
    network_bytes_received: {
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
                        return `${_.round(value / 1024, 1)} kB/s`;
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
                        return dayjs.unix(timestamp).format('HH:mm');
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
                query: promql.network_bytes_received.query,
                step: '5m'
            },
            parse: (response: any) => {
                const result = _.get(response, 'data.result');
                return _.map(result, payload => ({
                    name: _.get(payload, 'metric.namespace'),
                    data: _.get(payload, 'values')
                }))
            },
            error() {
                return [0]
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
    }

}
