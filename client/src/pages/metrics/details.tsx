import * as _ from 'lodash';
import { Alert, Grid, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import MainCard from 'components/MainCard';
import { metricsMetadata } from 'data/metrics';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { error } from 'services/toaster';
import { PieChartOutlined, QuestionCircleFilled } from '@ant-design/icons';
import { setConfig } from 'store/reducers/config';
import { Avatar } from '@mui/material';
import { navigateToGrafana } from 'services/grafana';
import { useTheme } from '@mui/material';
import grafanaIcon from 'assets/images/icons/grafana_icon.svg';

const MetricsDetails = (props: any) => {
    const { id } = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    let [searchParams] = useSearchParams();
    const [metadata, setmetadata] = useState<Record<string, any>>();
    const metricId = id || searchParams.get('id')

    const navigateToHome = ({ errMsg }: any) => {
        navigate('/');
        errMsg && dispatch(error({ message: errMsg }));
    }

    const fetchMetadata = () => {
        if (!metricId) navigateToHome({ errMsg: 'Metric Id Missing' });
        const metricsMeta = _.find(metricsMetadata, ['id', metricId]);
        if (!metricsMeta) navigateToHome({ errMsg: 'Invalid Metric' })
        setmetadata(metricsMeta);
    }

    useEffect(() => {
        fetchMetadata();
    }, [metricId]);

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

    const navigateToGrafanaDashboard = (e: any) => {
        const link = _.get(metadata, 'links.grafana.link');
        link && navigateToGrafana(link);
    }

    return (
        <>
            <MainCard title={`${metadata?.primaryLabel || ""} Metrics`} secondary={
                <Tooltip title="Navigate to Grafana Dashboard" onClick={navigateToGrafanaDashboard}>
                    <Avatar alt="Gradana" src={grafanaIcon} />
                </Tooltip>
            }
            >
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
