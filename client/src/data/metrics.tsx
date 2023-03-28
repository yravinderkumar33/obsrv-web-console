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
import { totalVsRunningNodes, percentageUsage, cpuPercentageUsage } from 'services/transformers';

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
                link: "http://localhost:9000/d/efa86fd1d0c121a26444b636a3f509a8/kubernetes-compute-resources-cluster?orgId=1&refresh=10s"
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
                        chart: <AnalyticsDataCard title="Nodes Status">
                            <GaugeChart arcsLength={null} nrOfLevels={20} colors={['#EA4228', '#5BE12C']} query={_.get(chartMeta, 'nodes_percentage.query')} />
                            <AsyncLabel align="center" variant="caption" color="textSecondary" query={[_.get(chartMeta, 'total_running_nodes_count.query'), _.get(chartMeta, 'total_nodes_count.query')]} transformer={totalVsRunningNodes} suffix='  Nodes Running'></AsyncLabel>
                        </AnalyticsDataCard>
                    },
                    {
                        chart: <AnalyticsDataCard title="CPU Usage">
                            <GaugeChart query={_.get(chartMeta, 'cpu_usage_radial.query')} />
                            <AsyncLabel align="center" variant="caption" color="textSecondary" query={[_.get(chartMeta, 'cpu_usage_radial.query'), _.get(chartMeta, 'total_running_nodes_count.query'), _.get(chartMeta, 'totalCPU.query')]} transformer={cpuPercentageUsage}></AsyncLabel>
                        </AnalyticsDataCard>
                    },
                    {
                        chart: <AnalyticsDataCard title="Memory Usage">
                            <GaugeChart query={_.get(chartMeta, 'memory_usage_radial.query')} />
                            <AsyncLabel align="center" variant="caption" color="textSecondary" query={[_.get(chartMeta, 'memory_usage_radial.query'), _.get(chartMeta, 'total_running_nodes_count.query')]} transformer={percentageUsage}></AsyncLabel>

                        </AnalyticsDataCard>
                    },
                    {
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
                        chart: <ApexWithFilters title="CPU Usage" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'instance_cpu')} height={250} interval={1140}></ApexChart>
                        </ApexWithFilters>
                    },
                    {
                        chart: <ApexWithFilters title="Memory Usage" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'instance_memory')} height={250} interval={1140}></ApexChart>
                        </ApexWithFilters>
                    },
                    {
                        chart: <ApexWithFilters title="Disk Usage" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'instance_disk')} height={250} interval={1140}></ApexChart>
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
                        chart: <ApexWithFilters title="Incidents/Alerts" filters={_.get(filters, 'default')}>
                            <AlertsMessages />
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
                        chart: <ReportCard primary="0" secondary="Health Status" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'druid_health_status.query')} />
                    },
                    {
                        chart: <ReportCard primary="0" secondary="Response Time (Min)" suffix={'ms'} iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'node_query_response_time_min.query')} />
                    },
                    {
                        chart: <ReportCard primary="0" secondary="Response Time (Max)" suffix={'ms'} iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'node_query_response_time_max.query')} />
                    },
                    {
                        chart: <ReportCard primary="0" secondary="Response Time (Avg)" suffix={'ms'} iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'node_query_response_time_avg.query')} />
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
                        chart: <ApexWithFilters title="Query Response Time (Min, Max, Avg)" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'node_query_response_time')} height={250} interval={1140}></ApexChart>
                        </ApexWithFilters>
                    },
                    {
                        chart: <ApexWithFilters title="Number of API Calls" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'node_total_api_call')} height={250} interval={1140}></ApexChart>
                        </ApexWithFilters>
                    },
                    {
                        chart: <ApexWithFilters title="Number of Failed API Calls" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'node_total_failed_api_call')} height={250} interval={1140}></ApexChart>
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
                        chart: <ApexWithFilters title="Incidents/Alerts" filters={_.get(filters, 'variant1')}>
                            <AlertsMessages />
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
                        chart: <ReportCard primary="0" secondary="Health Status" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'druid_health_status.query')} />
                    },
                    {
                        chart: <ReportCard primary="0" secondary="Total Events Received" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'totalEventsProcessedToday.query')} />
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
                        chart: <ApexWithFilters title="Total Events Received" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'totalEventsProcessedTimeSeries')} height={250} interval={1140}></ApexChart>
                        </ApexWithFilters>
                    },
                    {
                        chart: <ApexWithFilters title="Incidents/Alerts" filters={_.get(filters, 'default')}>
                            <AlertsMessages />
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
                        chart: <ReportCard primary="0" secondary="Health Status" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'druid_health_status.query')} />
                    },
                    {
                        chart: <ReportCard primary="0" secondary="Processing Time (Min)" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'minProcessingTime.query')} suffix={'ms'} />
                    },
                    {
                        chart: <ReportCard primary="0" secondary="Processing Time (Max)" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'maxProcessingTime.query')} suffix={'ms'} />
                    },
                    {
                        chart: <ReportCard primary="0" secondary="Processing Time (Avg)" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'avgProcessingTime.query')} suffix={'ms'} />
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
                        chart: <ApexWithFilters title="Processing Time (Min)" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'minProcessingTimeSeries')} height={250} interval={1140}></ApexChart>
                        </ApexWithFilters>
                    },
                    {
                        chart: <ApexWithFilters title="Throughput" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'instance_memory')} height={250} interval={1140}></ApexChart>
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
                        chart: <ApexWithFilters title="Incidents/Alerts" filters={_.get(filters, 'variant1')}>
                            <AlertsMessages />
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
                        chart: <AnalyticsDataCard title="Disk Usage">
                            <GaugeChart arcsLength={[60, 20, 20]} query={_.get(chartMeta, 'disk_usage_radial.query')} />
                            <AsyncLabel align="center" variant="caption" color="textSecondary" query={[_.get(chartMeta, 'disk_usage_radial.query'), _.get(chartMeta, 'total_running_nodes_count.query')]} transformer={percentageUsage}></AsyncLabel>
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
                        chart: <ReportCard primary="Healthy" secondary="Backups Status" iconPrimary={BarChartOutlined} />
                    },
                    {
                        chart: <ReportCard primary="0" secondary="Deep Storage Used" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'deep_storage_used.query')} suffix={'MB'} />
                    },
                    {
                        chart: <ReportCard primary="0" secondary="Deep Storage Total" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'deep_storage_total.query')} suffix={'MB'} />
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
                        chart: <ApexWithFilters title="Disk Usage" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'instance_disk')} height={250} interval={1140}></ApexChart>
                        </ApexWithFilters>
                    },
                    {
                        chart: <ApexWithFilters title="Deep Storage Usage Growth" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'data_growth_over_time')} height={250} interval={1140}></ApexChart>
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
                        chart: <ApexWithFilters title="Incidents/Alerts" filters={_.get(filters, 'variant1')}>
                            <AlertsMessages />
                        </ApexWithFilters>
                    }
                ]
            }
        }
    }
]
