import { AreaChartOutlined, BarChartOutlined, DotChartOutlined, StockOutlined, LineChartOutlined } from "@ant-design/icons";
import * as _ from 'lodash';
import ApexChart from "sections/dashboard/analytics/apex";
import chartMeta from 'data/charts';
import ReportCard from "components/cards/statistics/ReportCard";
import AnalyticsDataCard from "components/cards/statistics/AnalyticsDataCard";
import AlertsMessages from "components/cards/statistics/Alerts";
import GaugeChart from "sections/dashboard/analytics/guageChart";
import ApexWithFilters from "sections/dashboard/analytics/ChartFilters";
import filters from 'data/chartFilters';
import AsyncLabel from "components/cards/statistics/AsyncLabel";
import { totalVsRunningNodes, percentageUsage, cpuPercentageUsage, backupStatus, alertsFilterByLabels } from 'services/transformers';
import { Stack } from "@mui/material";
import GrafanaChart from "sections/dashboard/analytics/GrafanaEmbedded";
import IngestionCharts from "sections/dashboard/analytics/IngestionCharts";

export const metricsMetadata = [
    {
        id: "overallInfra",
        primaryLabel: "Infrastructure",
        secondaryLabel: "Metrics",
        description: "This page shows the essential metrics of your cluster. With this information, you can easily monitor the health of your cluster and make informed decisions about scaling and resource allocation.",
        icon: DotChartOutlined,
        menuIcon: AreaChartOutlined,
        links: {
            grafana: {
                link: "d/efa86fd1d0c121a26444b636a3f509a8/kubernetes-compute-resources-cluster?orgId=1&refresh=10s"
            }
        },
        color: 'main',
        charts: {
            small: {
                size: {
                    xs: 12,
                    sm: 6,
                    md: 4,
                    lg: 3
                },
                metadata: [
                    {
                        id: "nodeRunningStatus",
                        description: "Nodes Running Status",
                        chart: <AnalyticsDataCard title="Nodes Status">
                            <Stack spacing={4} direction="column" justifyContent="space-around" height={'auto'} >
                                <AsyncLabel align="center" variant="h1" component="h1" color="textPrimary" fontSize={'8vh'} query={[_.get(chartMeta, 'total_running_nodes_count.query'), _.get(chartMeta, 'total_nodes_count.query')]} transformer={totalVsRunningNodes}></AsyncLabel>
                                <AsyncLabel align="center" variant="caption" color="textSecondary" suffix='Nodes Running'></AsyncLabel>
                            </Stack>
                        </AnalyticsDataCard>
                    },
                    {
                        id: "cpuUsge",
                        description: "Current CPU Usage Percent",
                        chart: <AnalyticsDataCard title="CPU Usage">
                            <GaugeChart query={_.get(chartMeta, 'cpu_usage_radial.query')} />
                            <AsyncLabel align="center" variant="caption" color="textSecondary" query={[_.get(chartMeta, 'cpu_usage_radial.query'), _.get(chartMeta, 'total_running_nodes_count.query'), _.get(chartMeta, 'totalCPU.query')]} transformer={cpuPercentageUsage}></AsyncLabel>
                        </AnalyticsDataCard>
                    },
                    {
                        id:"memoryUsage",
                        description: "Current Memory Usage Percent",
                        chart: <AnalyticsDataCard title="Memory Usage">
                            <GaugeChart query={_.get(chartMeta, 'memory_usage_radial.query')} />
                            <AsyncLabel align="center" variant="caption" color="textSecondary" query={[_.get(chartMeta, 'memory_usage_radial.query'), _.get(chartMeta, 'total_running_nodes_count.query')]} transformer={percentageUsage}></AsyncLabel>

                        </AnalyticsDataCard>
                    },
                    {
                        id:"diskUsage",
                        description: "Current Disk Usage Percent",
                        chart: <AnalyticsDataCard title="Disk Usage">
                            <GaugeChart arcsLength={[60, 20, 20]} query={_.get(chartMeta, 'disk_usage_radial.query')} />
                            <AsyncLabel align="center" variant="caption" color="textSecondary" query={[_.get(chartMeta, 'disk_usage_radial.query'), _.get(chartMeta, 'total_running_nodes_count.query')]} transformer={percentageUsage}></AsyncLabel>
                        </AnalyticsDataCard>
                    },
                ]
            },
            medium: {
                size: {
                    xs: 12,
                    sm: 6,
                    md: 6,
                    lg: 6
                },
                metadata: [
                    {
                        id: 'cpuUsage',
                        description: "This chart typically displays the percentage of a computer's central processing unit (CPU) that is currently being utilized. The chart may show a live update of the CPU usage over time, or display a historical record of usage over a specified period.",
                        chart: <ApexWithFilters title="CPU Usage" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'instance_cpu')} interval={1140}></ApexChart>
                        </ApexWithFilters>
                    },
                    {
                        id: 'memoryUsage',
                        description: "This chart is a graphical representation of the amount of memory being used by a computer system at a given time. The chart typically displays the amount of memory usage as a percentage of the total available memory, with the horizontal axis representing time and the vertical axis representing memory usage percentage",
                        chart: <ApexWithFilters title="Memory Usage" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'instance_memory')} interval={1140}></ApexChart>
                        </ApexWithFilters>
                    },
                    {
                        id: 'diskUsage',
                        description: "This is a graphical representation of the amount of disk space being used across a cluster",
                        chart: <ApexWithFilters title="Disk Usage" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'instance_disk')} interval={1140}></ApexChart>
                        </ApexWithFilters>
                    }
                ]
            },
            large: {
                size: {
                    xs: 12,
                    sm: 12,
                    md: 12,
                    lg: 12
                },
                metadata: [
                    {
                        id: 'incidents/alerts',
                        description: "This table shows the currently active infrastructure alerts within the cluster",
                        chart: <ApexWithFilters title="Incidents/Alerts" filters={[..._.get(filters, 'variant1')]}>
                            <AlertsMessages predicate={alertsFilterByLabels({ matchLabels: { bb: "obsrv", type: "infra" } })} />
                        </ApexWithFilters>
                    }
                ]
            }
        }
    },
    {
        id: "api",
        primaryLabel: "API",
        secondaryLabel: "Metrics",
        description: "This page shows the metrics of http requests. Here you'll find real-time data on our API performance, including the number of requests received, the average response time, failed api calls etc. With this information, you can easily track how your API is performing, identify any bottlenecks or issues, and make data-driven decisions to optimize your API's performance",
        icon: DotChartOutlined,
        menuIcon: BarChartOutlined,
        color: 'main',
        links: {
            grafana: {
                link: "d/mini-dashboard/minio-dashboard?orgId=1"
            }
        },
        charts: {
            small: {
                size: {
                    xs: 12,
                    sm: 6,
                    md: 4,
                    lg: 3
                },
                metadata: [
                    {
                        description: "Shows the Http Requests Health. If the API failure percentage is above 1%, then it's UNHEALTHY",
                        chart: <ReportCard primary="0" secondary="Health Status" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'api_failure_percentage.query')} />
                    },
                    {
                        description: "Shows the average Query Response time for today",
                        chart: <ReportCard primary="0" secondary="Response Time (Avg)" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'node_query_response_time_avg.query')} />
                    },
                    {
                        description: "Shows the max Query Response time for today",
                        chart: <ReportCard primary="0" secondary="Response Time (Max)" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'node_query_response_time_max.query')} />
                    },
                    {
                        description: "Shows the api failure percentage for today",
                        chart: <ReportCard primary="0" secondary="Api Failure Percentage" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'api_failure_percent.query')} suffix="%" />
                    },
                ]
            },
            medium: {
                size: {
                    xs: 12,
                    sm: 6,
                    md: 6,
                    lg: 6
                },
                metadata: [
                    {
                        description: "This chart shows the average query response time of http calls within the cluster",
                        chart: <ApexWithFilters title="Query Response Time (Avg)" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'node_query_response_avg_timeseries')} interval={1140}></ApexChart>
                        </ApexWithFilters>
                    },
                    {
                        description: "This chart shows the total number of api calls within the cluster",
                        chart: <ApexWithFilters title="Number of API Calls" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'node_total_api_call')} interval={1140}></ApexChart>
                        </ApexWithFilters>
                    },
                    {
                        description: "This chart shows the total number of failed api calls within the cluster",
                        chart: <ApexWithFilters title="Number of Failed API Calls" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'node_total_failed_api_call')} interval={1140}></ApexChart>
                        </ApexWithFilters>
                    },
                    {
                        description: "This chart shows the API throughput.",
                        chart: <ApexWithFilters title="API Throughput" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'api_throughput')} interval={1140}></ApexChart>
                        </ApexWithFilters>
                    }
                ]
            },
            large: {
                size: {
                    xs: 12,
                    sm: 12,
                    md: 12,
                    lg: 12
                },
                metadata: [
                    {
                        chart: <ApexWithFilters title="Incidents/Alerts" filters={[..._.get(filters, 'variant1')]}>
                            <AlertsMessages predicate={alertsFilterByLabels({ matchLabels: { bb: "obsrv", type: "api" } })} />
                        </ApexWithFilters>
                    }
                ]
            }
        }
    },
    {
        id: "ingestion",
        primaryLabel: "Ingestion",
        secondaryLabel: "Metrics",
        description: "This page shows the metrics related to data ingestion. With this information you can monitor the count of events ingested in real time.",
        icon: DotChartOutlined,
        menuIcon: DotChartOutlined,
        color: 'main',
        charts: {
            small: {
                size: {
                    xs: 12,
                    sm: 6,
                    md: 4,
                    lg: 3
                },
                metadata: [
                    {
                        description: "This chart shows the Druid Health Status",
                        chart: <ReportCard primary="0" secondary="Health Status" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'druid_health_status.query')} />
                    },
                    {
                        description: "This chart shows the total number of events received today",
                        chart: <ReportCard primary="0" secondary="Total Data Received (Today)" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'totalEventsProcessedToday.query')} suffix="Events" />
                    }
                ]
            },
            medium: {
                size: {
                    xs: 12,
                    sm: 6,
                    md: 6,
                    lg: 6
                },
                metadata: [
                    {
                        description: "This chart shows the total number of events received within the cluster. It shows the cumulative count of all the datasets",
                        chart: <ApexWithFilters title="Total Data Received (All Datasets)" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'totalEventsProcessedTimeSeries')} interval={1140}></ApexChart>
                        </ApexWithFilters>
                    }
                ]
            },
            large: {
                size: {
                    xs: 12,
                    sm: 12,
                    md: 12,
                    lg: 12
                },
                metadata: [
                    {
                        chart: <IngestionCharts title="Total Data Received " chartName="totalEventsProcessedTimeSeriesPerDataset" />
                    },
                    {
                        chart: <ApexWithFilters title="Incidents/Alerts" filters={[..._.get(filters, 'variant1')]}>
                            <AlertsMessages interval={1140} predicate={alertsFilterByLabels({ matchLabels: { bb: "obsrv", type: "ingestion" } })} />
                        </ApexWithFilters>
                    }
                ]
            }
        }
    },
    {
        id: "processing",
        primaryLabel: "Processing",
        secondaryLabel: "Metrics",
        description: "This page shows the metrics of datasets processing. With this information you can monitor the processing time and throughput of the events.",
        icon: DotChartOutlined,
        menuIcon: LineChartOutlined,
        color: 'main',
        charts: {
            small: {
                size: {
                    xs: 12,
                    sm: 6,
                    md: 4,
                    lg: 3
                },
                metadata: [
                    {
                        description: "This charts shows the druid health status",
                        chart: <ReportCard primary="0" secondary="Health Status" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'druid_health_status.query')} />
                    },
                    {
                        description: "This chart shows the average data processing time for today",
                        chart: <ReportCard primary="0" secondary="Processing Time (Avg)" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'avgProcessingTime.query')} />
                    },
                    {
                        description: "This chart shows the maximum data processing time for today",
                        chart: <ReportCard primary="0" secondary="Processing Time (Max)" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'maxProcessingTime.query')} />
                    },
                    {
                        description: "This chart shows the minimum data processing time for today",
                        chart: <ReportCard primary="0" secondary="Processing Time (Min)" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'minProcessingTime.query')} />
                    }
                ]
            },
            medium: {
                size: {
                    xs: 12,
                    sm: 6,
                    md: 6,
                    lg: 6
                },
                metadata: [
                    {
                        description: "This chart shows the average processing time for all the datasets",
                        chart: <ApexWithFilters title="Processing Time (All Datasets)" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'minProcessingTimeSeries')} interval={1140}></ApexChart>
                        </ApexWithFilters>
                    }
                ]
            },
            large: {
                size: {
                    xs: 12,
                    sm: 12,
                    md: 12,
                    lg: 12
                },
                metadata: [
                    {
                        chart: <IngestionCharts title="Procesing Time" chartName="minProcessingTimeSeriesPerDataset" />
                    },
                    {
                        chart: <ApexWithFilters title="Incidents/Alerts" filters={[..._.get(filters, 'variant1')]}>
                            <AlertsMessages predicate={alertsFilterByLabels({ matchLabels: { bb: "obsrv", type: "processing" } })} />
                        </ApexWithFilters>
                    }
                ]
            }
        }
    },
    {
        id: "storage",
        primaryLabel: "Storage",
        secondaryLabel: "Metrics",
        description: "This page shows the metrics of storage",
        icon: DotChartOutlined,
        menuIcon: StockOutlined,
        links: {
            grafana: {
                link: "d/EbXSjT24k/velero?orgId=1"
            }
        },
        color: 'main',
        charts: {
            xs: {
                size: {
                    xs: 12,
                    sm: 6,
                    md: 4,
                    lg: 3
                },
                metadata: [
                    {
                        description: "This chart shows the current disk utilization percentage",
                        chart: <AnalyticsDataCard title="Disk Usage">
                            <GaugeChart arcsLength={[60, 20, 20]} query={_.get(chartMeta, 'disk_usage_radial.query')} />
                            <AsyncLabel align="center" variant="caption" color="textSecondary" query={[_.get(chartMeta, 'disk_usage_radial.query'), _.get(chartMeta, 'total_running_nodes_count.query')]} transformer={percentageUsage}></AsyncLabel>
                        </AnalyticsDataCard>
                    },
                    {
                        description: "This chart shows the backup success rate percentage",
                        chart: <AnalyticsDataCard title="Backup Success Rate">
                            <GaugeChart arcsLength={null} nrOfLevels={20} colors={['#EA4228', '#5BE12C']} query={_.get(chartMeta, 'backup_success_rate.query')} />
                            <AsyncLabel align="center" variant="caption" color="textSecondary" query={[_.get(chartMeta, 'backup_count.query'), _.get(chartMeta, 'backup_success_rate.query')]} transformer={backupStatus}></AsyncLabel>
                        </AnalyticsDataCard>
                    }
                ]
            },
            small: {
                size: {
                    xs: 12,
                    sm: 6,
                    md: 4,
                    lg: 3
                },
                metadata: [
                    {
                        description: "This chart shows the current success backup count",
                        chart: <ReportCard primary="0" secondary="Success Backups Count" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'backup_count.query')} />
                    }
                ]
            },
            medium: {
                size: {
                    xs: 12,
                    sm: 6,
                    md: 6,
                    lg: 6
                },
                metadata: [
                    {
                        description: "This is a graphical representation of the amount of disk space being used across a cluster",
                        chart: <ApexWithFilters title="Disk Usage" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'instance_disk')} interval={1140}></ApexChart>
                        </ApexWithFilters>
                    },
                    {
                        chart: <ApexWithFilters title="Deep Storage Usage Growth" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'data_growth_over_time')} interval={1140}></ApexChart>
                        </ApexWithFilters>
                    },
                ]
            },
            large: {
                size: {
                    xs: 12,
                    sm: 12,
                    md: 12,
                    lg: 12
                },
                metadata: [
                    {
                        chart: <GrafanaChart url="/d-solo/EbXSjT24k/velero?orgId=1&panelId=13" width="100%" height="400" />
                    },
                    {
                        chart: <ApexWithFilters title="Incidents/Alerts" filters={[..._.get(filters, 'variant1')]}>
                            <AlertsMessages predicate={alertsFilterByLabels({ matchLabels: { bb: "obsrv", type: "storage" } })} />
                        </ApexWithFilters>
                    }
                ]
            }
        }
    }
]
