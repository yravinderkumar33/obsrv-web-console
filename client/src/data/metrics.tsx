import { BarChartOutlined, DotChartOutlined } from "@ant-design/icons";
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
        description: "This page shows the metrics of overall infrastructure",
        icon: DotChartOutlined,
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
                        chart: <AnalyticsDataCard title="Nodes Usage">
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
                        chart: <ApexWithFilters title="CPU Usage" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'instance_cpu')} height={250} interval={11520}></ApexChart>
                        </ApexWithFilters>
                    },
                    {
                        chart: <ApexWithFilters title="Memory Usage" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'instance_memory')} height={250} interval={11520}></ApexChart>
                        </ApexWithFilters>
                    },
                    {
                        chart: <ApexWithFilters title="Disk Usage" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'instance_disk')} height={250} interval={11520}></ApexChart>
                        </ApexWithFilters>
                    },
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
        id: "api",
        primaryLabel: "API",
        secondaryLabel: "Metrics",
        description: "This page shows the metrics of http requests",
        icon: DotChartOutlined,
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
                        chart: <ReportCard primary="0" secondary="Response Time (Min)" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'druid_completed_tasks.query')} />
                    },
                    {
                        chart: <ReportCard primary="0" secondary="Response Time (Max)" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'druid_completed_tasks.query')} />
                    },
                    {
                        chart: <ReportCard primary="0" secondary="Response Time (Avg)" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'druid_completed_tasks.query')} />
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
                        chart: <ApexWithFilters title="Query Response Time (Min, Max, Avg)" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'instance_cpu')} height={250} interval={11520}></ApexChart>
                        </ApexWithFilters>
                    },
                    {
                        chart: <ApexWithFilters title="Query Throughput" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'throughput')} height={250} interval={11520}></ApexChart>
                        </ApexWithFilters>
                    },
                    {
                        chart: <ApexWithFilters title="Number of API Calls" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'instance_disk')} height={250} interval={11520}></ApexChart>
                        </ApexWithFilters>
                    },
                    {
                        chart: <ApexWithFilters title="Number of Failed API Calls" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'instance_disk')} height={250} interval={11520}></ApexChart>
                        </ApexWithFilters>
                    },
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
        description: "This page shows the metrics of datasets ingestions",
        icon: DotChartOutlined,
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
                        chart: <ReportCard primary="0" secondary="Total Data Received" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'druid_completed_tasks.query')} />
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
                        chart: <ApexWithFilters title="Total Data Received" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'instance_cpu')} height={250} interval={11520}></ApexChart>
                        </ApexWithFilters>
                    },
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
        id: "processing",
        primaryLabel: "Processing",
        secondaryLabel: "Metrics",
        description: "This page shows the metrics of datasets processing",
        icon: DotChartOutlined,
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
                        chart: <ReportCard primary="0" secondary="Throughput" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'druid_completed_tasks.query')} />
                    },
                    {
                        chart: <ReportCard primary="0" secondary="Time (Min)" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'druid_completed_tasks.query')} />
                    },
                    {
                        chart: <ReportCard primary="0" secondary="Time (Max)" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'druid_completed_tasks.query')} />
                    },
                    {
                        chart: <ReportCard primary="0" secondary="Time (Avg)" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'druid_completed_tasks.query')} />
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
                        chart: <ApexWithFilters title="Processing Time (Min, Max, Avg)" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'instance_cpu')} height={250} interval={11520}></ApexChart>
                        </ApexWithFilters>
                    },
                    {
                        chart: <ApexWithFilters title="Throughput" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'instance_memory')} height={250} interval={11520}></ApexChart>
                        </ApexWithFilters>
                    },
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
                        chart: <AnalyticsDataCard title="Health">
                            <GaugeChart arcsLength={null} nrOfLevels={20} colors={['#EA4228', '#5BE12C']} query={_.get(chartMeta, 'nodes_percentage.query')} />
                        </AnalyticsDataCard>
                    },
                    {
                        chart: <AnalyticsDataCard title="Query Response Time (Max)">
                            <GaugeChart arcsLength={null} nrOfLevels={20} colors={['#EA4228', '#5BE12C']} query={_.get(chartMeta, 'nodes_percentage.query')} />
                        </AnalyticsDataCard>
                    },
                    {
                        chart: <AnalyticsDataCard title="Query Response Time (Min)">
                            <GaugeChart query={_.get(chartMeta, 'cpu_usage_radial.query')} />
                        </AnalyticsDataCard>
                    },
                    {
                        chart: <AnalyticsDataCard title="Query Response Time (Avg)">
                            <GaugeChart query={_.get(chartMeta, 'memory_usage_radial.query')} />
                        </AnalyticsDataCard>
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
                        chart: <ApexWithFilters title="Query Response Time (Min, Max, Avg)" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'instance_cpu')} height={250} interval={11520}></ApexChart>
                        </ApexWithFilters>
                    },
                    {
                        chart: <ApexWithFilters title="Query Throughput" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'instance_memory')} height={250} interval={11520}></ApexChart>
                        </ApexWithFilters>
                    },
                    {
                        chart: <ApexWithFilters title="Number of API Calls" filters={_.get(filters, 'default')}>
                            <ApexChart metadata={_.get(chartMeta, 'instance_disk')} height={250} interval={11520}></ApexChart>
                        </ApexWithFilters>
                    },
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
        id: "druid",
        primaryLabel: "Druid",
        secondaryLabel: "Metrics",
        description: "This page shows the range of metrics related to your Druid clusters",
        icon: DotChartOutlined,
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
                        chart: <ReportCard primary="0" secondary="Total Datasources" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'druid_total_datasources.query')} />
                    },
                    {
                        chart: <ReportCard primary="0" secondary="Total Completed Tasks" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'druid_completed_tasks.query')} />
                    },
                    {
                        chart: <ReportCard primary="0" secondary="Total Failed Tasks" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'druid_failed_tasks.query')} />
                    },
                    {
                        chart: <ReportCard primary="0" secondary="Total Running Tasks" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'druid_running_tasks.query')} />
                    },
                    {
                        chart: <ReportCard primary="0" secondary="Total Segments" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'druid_total_segments.query')} />
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
                        chart: <AnalyticsDataCard title="CPU Percentage">
                            <ApexChart metadata={_.get(chartMeta, 'druid_cpu_usage')}></ApexChart>
                        </AnalyticsDataCard>
                    },
                    {
                        chart: <AnalyticsDataCard title="Memory Usage">
                            <ApexChart metadata={_.get(chartMeta, 'druid_memory_usage')}></ApexChart>
                        </AnalyticsDataCard>
                    }
                ]
            }
        }
    },
]
