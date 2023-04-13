import { Grid } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { datasetRead } from 'services/dataset';
import { error } from 'services/toaster';
import * as _ from 'lodash';
import ReportCard from 'components/cards/statistics/ReportCard';
import { BarChartOutlined } from '@ant-design/icons';
import { druidQueries } from 'services/druid';
import dayjs from 'dayjs';
import chartMeta from 'data/charts';
import ApexChart from 'sections/dashboard/analytics/apex';
import ApexWithFilters from 'sections/dashboard/analytics/ChartFilters';
import filters from 'data/chartFilters';

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
                sm: 4,
                md: 4,
                lg: 4
            },
            charts: [
                {
                    title: "Status",
                    primary: _.get(datasetDetails, 'data.status'),
                    query: () => null,
                    chart: ({ title, query, primary }: any) => {
                        return <ReportCard primary={primary} secondary={title} iconPrimary={BarChartOutlined} query={query} />
                    }
                },
                {
                    title: 'Average Processing Time (ms)',
                    query: () => {
                        const startDate = '2000-01-01';
                        const endDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
                        const body = druidQueries.druid_avg_processing_time({ datasetId, intervals: `${startDate}/${endDate}` });
                        return { ..._.get(chartMeta, 'druid_avg_processing_time.query'), body }

                    },
                    chart: ({ title, query }: any) => <ReportCard primary="0" secondary={title} iconPrimary={BarChartOutlined} query={query} suffix="ms" />
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
            charts: [
                {
                    title: 'Total Events Processed',
                    query: () => {
                        const metadata = _.cloneDeep(_.get(chartMeta, 'totalEventsProcessedTimeSeriesPerDataset'));
                        _.set(metadata, 'query.body.query.filter.value', datasetId);
                        return metadata;
                    },
                    chart: ({ title, query }: any) => <ApexWithFilters title={title} filters={_.get(filters, 'default')}>
                        <ApexChart metadata={query} interval={1140}></ApexChart>
                    </ApexWithFilters>
                },
                {
                    title: 'Events Processing Time (ms)',
                    query: () => {
                        const metadata = _.cloneDeep(_.get(chartMeta, 'minProcessingTimeSeriesPerDataset'));
                        _.set(metadata, 'query.body.query.filter.value', datasetId);
                        return metadata;
                    },
                    chart: ({ title, query }: any) => <ApexWithFilters title={title} filters={_.get(filters, 'default')}>
                        <ApexChart metadata={query} interval={1140}></ApexChart>
                    </ApexWithFilters>
                }
            ]
        }
    }

    const fetchDataset = async () => {
        try {
            const response = await datasetRead({ datasetId: `${datasetId}?status=ACTIVE` }).then(response => _.get(response, 'data.result'));
            setDatasetDetails({ data: response, status: 'success' });
        } catch (err) {
            dispatch(error({ message: 'Read Dataset Failed' }));
            setDatasetDetails({ data: null, status: 'failed' })
        }
    }

    useEffect(() => {
        fetchDataset();
    }, [])

    const renderSections = () => {
        return _.flatten(_.map(data, (value, index) => {
            const { size, charts = [] } = value as any;
            const { xs, sm, lg, md } = size;
            return <Grid container rowSpacing={1} columnSpacing={1} key={Math.random()} marginBottom={1}>
                {
                    _.map(charts, (chartMetadata: Record<string, any>, index: number) => {
                        const { title, query: getQuery, chart, ...rest } = chartMetadata;
                        return <Grid item xs={xs} sm={sm} md={md} lg={lg} key={`${Math.random()}`}>
                            {chart({ title, query: getQuery(), ...rest })}
                        </Grid>
                    })
                }
            </Grid>
        }))
    }

    return <>
        <MainCard title={`Dataset Metrics (${_.get(datasetDetails, 'data.id') || ''})`}>
            <Grid container spacing={1}>
                <Grid item xs={12}>

                </Grid>
                <Grid item xs={12}>
                    {renderSections()}
                </Grid>
            </Grid>
        </MainCard >
    </>
};

export default DatasetDetails;
