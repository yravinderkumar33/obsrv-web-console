import * as _ from 'lodash';
import dayjs from 'dayjs';
import { Theme } from '@mui/material';
import promql from '../promql';
import defaultConf from './common'

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
            url: '/api/report/v1/query/range',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.node_memory.query,
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
            url: '/api/report/v1/query/range',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.node_cpu.query,
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
        },
        getColor: (theme: Theme, series: Array<any>) => {
            const threshHold = 10;

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
                query: promql.cpu_percentage.query
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
                query: promql.memory_percentage.query
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
                query: promql.disk_percentage.query
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
                return 0
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
                query: promql.nodes_percentage.query
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
        series: [0],
        options: {
            chart: {
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    hollow: {
                        margin: 0,
                        size: '90%'
                    },
                    track: {
                        margin: 0
                    },
                    dataLabels: {
                        value: {
                            show: false
                        }
                    }
                },

            },
            labels: ['Nodes'],
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
                query: promql.instance_memory.query
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
                query: promql.instance_cpu.query,
                step: 2419
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
                query: promql.instance_disk.query,
                step: 2419
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
    alerts: {
        query: {
            type: 'api',
            timeout: 3000,
            url: '/api/report/v1/alerts',
            method: 'GET',
            headers: {},
            body: {},
            params: {},
            parse: (response: any) => {
                return _.get(response, 'result.data.alerts') || [];
            },
            error() {
                return []
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
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.disk_usage_radial.query
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
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.cpu_usage_radial.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
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
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.memory_usage_radial.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
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
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.cluster_total_nodes_count.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
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
            url: '/api/report/v1/query',
            method: 'GET',
            headers: {},
            body: {},
            params: {
                query: promql.cluster_running_nodes_count.query
            },
            parse: (response: any) => {
                const result = _.get(response, 'result.data.result');
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
}