import { Grid } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { datasetRead } from 'services/dataset';
import { error } from 'services/toaster';
import * as _ from 'lodash';
import ReportCard from 'components/cards/statistics/ReportCard';
import { BarChartOutlined } from '@ant-design/icons';
import { druidQueries } from 'services/druid';
import dayjs from 'dayjs';
import chartMeta from 'data/charts';
import AnalyticsDataCard from 'components/cards/statistics/AnalyticsDataCard';
import ApexChart from 'sections/dashboard/analytics/apex';

const DatasetDetails = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const { datasetId } = params;
    const [datasetDetails, setDatasetDetails] = useState({ data: null, status: "loading" });
    const [queries, setQueries] = useState<Array<any>>([]);
    const query = druidQueries.druid_avg_processing_time({});

    const data = {
        small: {
            size: {
                xs: 12,
                sm: 6,
                md: 4,
                lg: 4
            },
            charts: [
                {
                    title: 'Average Processing Time (ms)',
                    query: () => {
                        const startDate = '2000-01-01';
                        const endDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
                        const body = druidQueries.druid_avg_processing_time({ datasetId, intervals: `${startDate}/${endDate}` });
                        return { ..._.get(chartMeta, 'druid_avg_processing_time.query'), body }

                    },
                    chart: ({ title, query }: any) => <ReportCard primary="0" secondary={title} iconPrimary={BarChartOutlined} query={query} />
                },
                {
                    title: 'Last Synced Time',
                    query: () => {
                        const startDate = '2000-01-01';
                        const endDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
                        const body = druidQueries.last_synced_time({ datasetId, intervals: `${startDate}/${endDate}` })
                        return { ..._.get(chartMeta, 'last_synced_time.query'), body }
                    },
                    chart: ({ title, query }: any) => <ReportCard primary="0" secondary={title} iconPrimary={BarChartOutlined} query={query} />

                },
                {
                    title: 'Total Events Processed (Today)',
                    query: () => {
                        const startDate = dayjs().format('YYYY-MM-DD');
                        const endDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
                        const body = druidQueries.total_events_processed({ datasetId, intervals: `${startDate}/${endDate}` })
                        return { ..._.get(chartMeta, 'total_events_processed.query'), body }
                    },
                    chart: ({ title, query }: any) => <ReportCard primary="0" secondary={title} iconPrimary={BarChartOutlined} query={query} />

                },
                {
                    title: 'Total Events Processed (Yesterday)',
                    query: () => {
                        const startDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
                        const endDate = dayjs().format('YYYY-MM-DD');
                        const body = druidQueries.total_events_processed({ datasetId, intervals: `${startDate}/${endDate}` })
                        return { ..._.get(chartMeta, 'total_events_processed.query'), body }
                    },
                    chart: ({ title, query }: any) => <ReportCard primary="0" secondary={title} iconPrimary={BarChartOutlined} query={query} />
                },
                {
                    title: 'Total Failed Events (Today)',
                    query: () => {
                        const startDate = dayjs().format('YYYY-MM-DD');
                        const endDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
                        const body = druidQueries.failed_events_summary({ datasetId, intervals: `${startDate}/${endDate}` })
                        return { ..._.get(chartMeta, 'failed_events_summary.query'), body }
                    },
                    chart: ({ title, query }: any) => <ReportCard primary="0" secondary={title} iconPrimary={BarChartOutlined} query={query} />

                },
                {
                    title: 'Total Failed Events (Yesterday)',
                    query: () => {
                        const startDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
                        const endDate = dayjs().format('YYYY-MM-DD');
                        const body = druidQueries.failed_events_summary({ datasetId, intervals: `${startDate}/${endDate}` })
                        return { ..._.get(chartMeta, 'failed_events_summary.query'), body }
                    },
                    chart: ({ title, query }: any) => <ReportCard primary="0" secondary={title} iconPrimary={BarChartOutlined} query={query} />
                },
                {
                    title: 'Average Processing Time (ms)',
                    query: () => {
                        const startDate = '2023-03-01';
                        const endDate = dayjs().add(2, 'day').format('YYYY-MM-DD');
                        const body = druidQueries.avgProcessingTimeSeries({ datasetId, intervals: `${startDate}/${endDate}` })
                        const metadata = _.cloneDeep(_.get(chartMeta, 'average_processing_time_series'));
                        metadata.query.body = body;
                        return metadata;
                    },
                    chart: ({ title, query }: any) => <AnalyticsDataCard title={title}>
                        <ApexChart metadata={query}></ApexChart>
                    </AnalyticsDataCard>
                },
                {
                    title: 'Total Events Processed',
                    query: () => {
                        const startDate = '2023-03-01';
                        const endDate = dayjs().add(2, 'day').format('YYYY-MM-DD');
                        const body = druidQueries.totalEventsProcessedTimeSeries({ datasetId, intervals: `${startDate}/${endDate}` })
                        const metadata = _.cloneDeep(_.get(chartMeta, 'total_events_processed_time_series'));
                        metadata.query.body = body;
                        return metadata;
                    },
                    chart: ({ title, query }: any) => <AnalyticsDataCard title={title}>
                        <ApexChart metadata={query}></ApexChart>
                    </AnalyticsDataCard>
                }
            ]
        }
    }

    const fetchDataset = async () => {
        try {
            const response = await datasetRead({ datasetId }).then(response => _.get(response, 'data.result'));
            setDatasetDetails({ data: response, status: 'success' });
        } catch (err) {
            dispatch(error({ message: 'Read Dataset Failed' }));
            setDatasetDetails({ data: null, status: 'failed' })
        }
    }

    useEffect(() => {
        fetchDataset();
    }, [])

    return <>
        <MainCard title={`Dataset Metrics (${_.get(datasetDetails, 'data.dataset_name') || ''})`}>
            <Grid container spacing={1}>
                {
                    data.small.charts.map(chartMeta => {
                        const { title, query: getQuery, chart } = chartMeta
                        return <Grid item xs={4}>
                            {chart({ title, query: getQuery() })}
                        </Grid>
                    })
                }
            </Grid>
        </MainCard >
    </>
};

export default DatasetDetails;
