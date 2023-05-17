import * as _ from 'lodash';
import { Alert, Grid, Tooltip } from '@mui/material';
import IconButton from 'components/@extended/IconButton';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import MainCard from 'components/MainCard';
import { metricsMetadata } from 'data/metrics';
import { useNavigate, useParams } from 'react-router-dom';
import { error } from 'services/toaster';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Avatar } from '@mui/material';
import { navigateToGrafana } from 'services/grafana';
import { useTheme } from '@mui/material';
import grafanaIcon from 'assets/images/icons/grafana_icon.svg';
import pageIds from 'data/telemetry/pageIds';
import useImpression from 'hooks/useImpression';
import intereactIds from 'data/telemetry/interact.json'

const MetricsDetails = (props: any) => {
    const { id } = props;
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const [metadata, setmetadata] = useState<Record<string, any>>();
    const iconBackColor = theme.palette.mode === 'dark' ? 'background.default' : 'grey.100';
    const metricId = id || _.get(params, 'metricId');
    useImpression({ type: "detail", pageid: _.get(pageIds, ['metrics', metricId]) });

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

    const renderCharts = (metadata: any) => {
        if (metadata) {
            const { charts } = metadata as { charts: Record<string, any> };
            return _.flatten(_.map(charts, (value, index) => {
                const { size, metadata = [] } = value;
                const { xs, sm, lg, md } = size;
                return (
                    _.map(metadata, (meta, metaIndex) => {
                        const { chart, description, noItem = false } = meta;
                        if (noItem) return React.cloneElement(chart, { description });
                        return <Grid item xs={xs} sm={sm} md={md} lg={lg} key={`${metaIndex}-${Math.random()}`} alignItems="stretch">
                            {React.cloneElement(chart, { description })}
                        </Grid>
                    })
                );
            }));
        }
    }

    const renderGrafanaIcon = () => {
        const link = _.get(metadata, 'links.grafana.link')
        const id = _.get(metadata, 'id');
        if (!link) return null;
        return (
            <Tooltip title="Navigate to Grafana Dashboard" onClick={_ => navigateToGrafana(link)}>
                <IconButton
                    data-edataid={`${intereactIds.grafana_navigate}:${metricId}`}
                    color="secondary" variant="light" sx={{ color: 'text.primary', bgcolor: iconBackColor, ml: 0.75 }}>
                    <Avatar alt="Gradana" src={grafanaIcon} />
                </IconButton>
            </Tooltip>
        );
    }

    return (
        <>
            <MainCard title={`${metadata?.primaryLabel || ""} Metrics`} secondary={renderGrafanaIcon()}>
                <Grid container rowSpacing={1} columnSpacing={1} marginBottom={2}>
                    {metadata?.description &&
                        <Grid item xs={12}>
                            <Alert color="info" icon={<InfoCircleOutlined />}>
                                {metadata?.description}
                            </Alert>
                        </Grid>
                    }
                </Grid>
                <Grid container rowSpacing={1} columnSpacing={1} marginBottom={1} alignItems="stretch">
                    {renderCharts(metadata)}
                </Grid>
            </MainCard >
        </>
    )
};

export default MetricsDetails;
