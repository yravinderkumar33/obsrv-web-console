import * as _ from 'lodash';
import { Alert, Grid, InputLabel, MenuItem, Select, Stack, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import MainCard from 'components/MainCard';
import { FormControl } from '@mui/material';
import { metricsMetadata } from 'data/metrics';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { error } from 'services/toaster';
import { QuestionCircleFilled } from '@ant-design/icons';
import { setConfig } from 'store/reducers/config';

const filters = [
    {
        label: 'Last 5 Minutes',
        value: 5
    },
    {
        label: 'Last 10 Minutes',
        value: 10
    },
    {
        label: 'Last 15 Minutes',
        value: 15
    },
    {
        label: 'Last 7 days',
        value: 11520
    }
];

const MetricsDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    let [searchParams] = useSearchParams();
    const [metadata, setmetadata] = useState<Record<string, any>>();
    const [filter, setFilter] = useState(null);

    const navigateToHome = ({ errMsg }: any) => {
        navigate('/');
        errMsg && dispatch(error({ message: errMsg }));
    }

    const fetchMetadata = () => {
        const metricId = searchParams.get('id');
        if (!metricId) navigateToHome({ errMsg: 'Metric Id Missing' });
        const metricsMeta = _.find(metricsMetadata, ['id', metricId]);
        if (!metricsMeta) navigateToHome({ errMsg: 'Invalid Metric' })
        setmetadata(metricsMeta);
    }

    useEffect(() => {
        dispatch(setConfig({ key: 'showClusterMenu', value: false }));
        fetchMetadata();
        return () => {
            dispatch(setConfig({ key: 'showClusterMenu', value: true }));
        }
    }, []);

    const handleFilterChange = (e: any) => {
        const selectedFilter = _.get(e, 'target.value');
        setFilter(selectedFilter);
    }

    const getFilters = () => {
        return <Stack>
            <FormControl fullWidth sx={{ m: 1, minWidth: 150 }}>
                <InputLabel>Select Interval</InputLabel>
                <Select value={5} onChange={handleFilterChange}>
                    {filters.map((filter, index) => <MenuItem key={index} value={filter.value}>{filter?.label}</MenuItem>)}
                </Select>
            </FormControl>
        </ Stack>
    }

    const renderCharts = () => {
        if (metadata) {
            const { charts } = metadata as { charts: Record<string, any> };
            return _.flatten(_.map(charts, (value, key) => {
                const { size, metadata = [] } = value;
                const { xs, sm, lg, md } = size;
                return <Grid container rowSpacing={2} columnSpacing={2} marginBottom={2}>
                    {
                        _.map(metadata, meta => {
                            const { chart } = meta;
                            return <Grid item xs={xs} sm={sm} md={md} lg={lg}>
                                {chart}
                            </Grid>
                        })
                    }

                </Grid>
            }))
        }
    }

    return (
        <>
            <MainCard title={`${metadata?.primaryLabel || ""} Metrics`}
                secondary={getFilters()}>
                <Grid container rowSpacing={2} columnSpacing={2} marginBottom={2}>
                    {metadata?.description &&
                        <Grid item xs={12}>
                            <Alert color="info" icon={<QuestionCircleFilled />}>
                                {metadata?.description}
                            </Alert>
                        </Grid>
                    }
                </Grid>
                {renderCharts()}
            </MainCard >
        </>
    )
};

export default MetricsDetails;
