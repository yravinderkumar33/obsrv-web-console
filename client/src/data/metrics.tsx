import { BarChartOutlined, DotChartOutlined } from "@ant-design/icons";
import * as _ from 'lodash';
import ApexChart from "sections/dashboard/analytics/apex";
import chartMeta from 'data/charts';
import ReportCard from "components/cards/statistics/ReportCard";
import AnalyticsDataCard from "components/cards/statistics/AnalyticsDataCard";

export const metricsMetadata = [
    {
        id: "kafka",
        primaryLabel: "Kafka",
        secondaryLabel: "Metrics",
        description: "This page shows the range of metrics related to your Kafka clusters.",
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
                        chart: <ReportCard primary="0" secondary="Total  Brokers" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'number_of_kafka_brokers.query')} />
                    },
                    {
                        chart: <ReportCard primary="0" secondary="Total In Messages" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'kafka_total_in_messages.query')} />
                    },
                    {
                        chart: <ReportCard primary="0" secondary="Total Out Messages" iconPrimary={BarChartOutlined} query={_.get(chartMeta, 'kafka_total_out_messages.query')} />
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
                        chart: <AnalyticsDataCard title="CPU Usage">
                            <ApexChart metadata={_.get(chartMeta, 'kafka_cpu_usage')}></ApexChart>
                        </AnalyticsDataCard>
                    },
                    {
                        chart: <AnalyticsDataCard title="Memory Usage">
                            <ApexChart metadata={_.get(chartMeta, 'kafka_broker_upTime')}></ApexChart>
                        </AnalyticsDataCard>
                    },
                    {
                        chart: <AnalyticsDataCard title="Messages read per 5 min">
                            <ApexChart metadata={_.get(chartMeta, 'kafka_messages_read_in_five_min')}></ApexChart>
                        </AnalyticsDataCard>
                    },
                    {
                        chart: <AnalyticsDataCard title="Messages consume per 5 min">
                            <ApexChart metadata={_.get(chartMeta, 'kafka_messages_consume_in_five_min')}></ApexChart>
                        </AnalyticsDataCard>
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
                        chart: <AnalyticsDataCard title="Total number of segments per datasource">
                            <ApexChart metadata={_.get(chartMeta, 'kafka_broker_upTime')}></ApexChart>
                        </AnalyticsDataCard>
                    },
                    {
                        chart: <AnalyticsDataCard title="Total Unloaded segments per datasource">
                            <ApexChart metadata={_.get(chartMeta, 'kafka_broker_upTime')}></ApexChart>
                        </AnalyticsDataCard>
                    },
                    {
                        chart: <AnalyticsDataCard title="Total Unloaded segments size per datasource">
                            <ApexChart metadata={_.get(chartMeta, 'kafka_broker_upTime')}></ApexChart>
                        </AnalyticsDataCard>
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

                ]
            }
        }
    },
    {
        id: "postgres",
        primaryLabel: "Postgres",
        secondaryLabel: "Metrics",
        description: "This page shows the range of metrics related to your Postgres setup.",
        icon: DotChartOutlined,
        color: 'main',
        charts: {
            small: {
                size: {
                    xs: 12,
                    sm: 6,
                    md: 4,
                    lg: 4
                },
                metadata: [
                    {
                        chart: <ReportCard primary="0" secondary="Number of active connections" iconPrimary={BarChartOutlined} />,
                    },
                    {
                        chart: <ReportCard primary="0" secondary="Max number of connections" iconPrimary={BarChartOutlined} />
                    },
                    {
                        chart: <ReportCard primary="0" secondary="Open File descriptors" iconPrimary={BarChartOutlined} />
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
                        chart: <AnalyticsDataCard title="CPU Usage">
                            <ApexChart metadata={_.get(chartMeta, 'postgres_cpu_usage')}></ApexChart>
                        </AnalyticsDataCard>
                    },
                    {
                        chart: <AnalyticsDataCard title="Memory Usage">
                            <ApexChart metadata={_.get(chartMeta, 'postgres_memory_usage')}></ApexChart>
                        </AnalyticsDataCard>
                    }
                ]
            }
        }
    }
]