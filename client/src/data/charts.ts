export default {
    node_aggregate: {
        type: "donut",
        options: {
            chart: {
                height: 350,
                type: 'donut',
            },
            labels: ['UP', 'DOWN'],
        },
        series: [2, 1]
    },
    node_aggregate_v2: {
        type: "radialBar",
        options: {
            chart: {
                height: 350,
                type: 'radialBar',
            },
            labels: ['2/3 NODES'],
        },
        series: [77.77]
    },
    memory_aggregate: {
        type: "bar",
        options: {
            chart: {
                id: 'new-stack-chart',
                sparkline: {
                    enabled: true
                },
                height: 100,
                type: 'line',
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            plotOptions: {
                bar: {
                    columnWidth: '80%'
                }
            },
            xaxis: {
                crosshairs: {
                    width: 1
                }
            },
            tooltip: {
                fixed: {
                    enabled: false
                },
                x: {
                    show: false
                },
                marker: {
                    show: false
                }
            }
        },
        series: [
            {
                name: 'Users',
                data: [
                    220, 230, 240, 220, 225, 215, 205, 195, 185, 150, 185, 195, 80, 205, 215, 225, 240, 225, 215, 205, 80, 215, 225, 240, 215, 210, 190
                ]
            }
        ]
    },
    memory_total: {
        type: "radialBar",
        options: {
            chart: {
                height: 350,
                type: 'radialBar',
            },
            labels: ['Memory'],
        },
        series: [27]
    },
    memory_nodeWise: {
        type: "donut",
        options: {
            chart: {
                height: 350,
                type: 'donut',
            },
            labels: ['Node 1', 'Node 2', 'Node 3'],
        },
        series: [44, 55, 13]
    },
    memory_mixed: {
        type: 'line',
        options: {
            chart: {
                id: "basic-bar",
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    columnWidth: "50%"
                }
            },
            stroke: {
                width: [4, 0, 0]
            },
            xaxis: {
                categories: ["10:00:00", "10:02:00", "10:04:00", "10:06:00", "10:08:00", "10:10:00", "10:12:00", "10:14:00"]
            },
            markers: {
                size: 6,
                strokeWidth: 3,
                fillOpacity: 0,
                strokeOpacity: 0,
                hover: {
                    size: 8
                }
            },
            yaxis: {
                tickAmount: 5,
                min: 0,
                max: 100
            }
        },
        series: [
            {
                name: "Node-1",
                type: "line",
                data: [30, 40, 25, 50, 49, 21, 70, 51]
            },
            {
                name: "Node-2",
                type: "column",
                data: [23, 12, 54, 61, 32, 56, 81, 19]
            },
            {
                name: "Node-3",
                type: "column",
                data: [62, 12, 45, 55, 76, 41, 23, 43]
            }
        ]
    },
    cpu_total: {
        type: "radialBar",
        options: {
            chart: {
                height: 350,
                type: 'radialBar',
            },
            labels: ['CPU'],
        },
        series: [70]
    },
    cpu_nodeWise: {
        type: "donut",
        options: {
            chart: {
                height: 350,
                type: 'donut',
            },
            labels: ['Node 1', 'Node 2', 'Node 3'],
        },
        series: [44, 55, 13]
    },
    disk_total: {
        type: "radialBar",
        options: {
            chart: {
                height: 350,
                type: 'radialBar',
            },
            labels: ['DISK'],
        },
        series: [44]
    },
    disk_nodeWise: {
        type: "radialBar",
        options: {
            chart: {
                height: 280,
                type: "radialBar",
            },
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        total: {
                            show: true,
                            label: 'TOTAL'
                        }
                    }
                }
            },
            labels: ['Node 1', 'Node 2']
        },
        series: [20, 60],
    },
    disk_line:
    {
        type: 'area',
        series: [
            {
                name: 'Data',
                data: [100, 140, 100, 240, 115, 125, 90, 100]
            },
            {
                name: 'Data',
                data: [60, 150, 170, 155, 50, 160, 45, 200]
            }
        ],
        options: {
            chart: {
                id: 'new-stack-chart',
                sparkline: {
                    enabled: true
                },
                height: 100,
                type: 'area',
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            title: {
                "text": "CPU Usage"
            },
            xaxis: {
                categories: ["10:00:00", "10:02:00", "10:04:00", "10:06:00", "10:08:00", "10:10:00", "10:12:00", "10:14:00"],
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
            },
            grid: {
                show: false
            },
            yaxis: {
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    show: false
                }
            },
            tooltip: {
                theme: 'light',
                x: {
                    show: false
                },
                y: {
                    formatter(val: number) {
                        return `$ ${val}`;
                    }
                }
            }
        }
    },
    realtime_one: {
        type: 'line',
        series: [
            {
                name: 'sample',
                data: []
            }
        ],
        options: {
            chart: {
                id: 'realtime',
                height: 350,
                type: 'line',
                animations: {
                    enabled: true,
                    easing: 'linear',
                    dynamicAnimation: {
                        speed: 1000
                    }
                },
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            markers: {
                size: 0
            }
        }
    },
    memory_area: {
        series: [
            {
                name: 'node 1',
                data: [31, 40, 28, 51, 42, 109, 100]
            },
            {
                name: 'node 2',
                data: [11, 32, 45, 32, 34, 52, 41]
            },
            {
                name: 'average',
                data: [21, 12, 75, 12, 64, 52, 21]
            }
        ],
        type: 'area',
        options: {
            chart: {
                height: 350,
                type: 'area'
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            xaxis: {
                type: 'datetime',
                categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
            },
            tooltip: {
                x: {
                    format: 'dd/MM/yy HH:mm'
                },
            },
        }
    },
    cpu_area: {
        type: 'bar',
        series: [
            {
                name: 'Users',
                data: [
                    220, 230, 240, 220, 225, 215, 205, 195, 185, 150, 185, 195, 80, 205, 215, 225, 240, 225, 215, 205, 80, 215, 225, 240, 215, 210, 190
                ]
            }
        ],
        options: {
            title: {
                text: "Disk Usage"
            },
            chart: {
                sparkline: {
                    enabled: true
                },
                type: 'bar',
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            plotOptions: {
                bar: {
                    columnWidth: '80%'
                }
            },
            xaxis: {
                crosshairs: {
                    width: 1
                }
            },
            tooltip: {
                fixed: {
                    enabled: false
                },
                x: {
                    show: false
                },
                marker: {
                    show: false
                }
            }
        }
    }
}