import { useEffect, useMemo, useState } from "react";
import * as _ from 'lodash';
import chartMeta from '../../data/charts'
import { fetchChartData } from "services/clusterMetrics";
import globalConfig from 'data/initialConfig';
import GaugeChart from "sections/dashboard/analytics/guageChart";
import AsyncLabel from "components/cards/statistics/AsyncLabel";
import { Stack } from "@mui/material";

const ClusterNodes = () => {
    const metrics = useMemo(() => [chartMeta.total_nodes_count, chartMeta.total_running_nodes_count], []);
    const [config, setConfig] = useState<Record<string, any>>({ percentage: 0, label: '0/0 Nodes Running' });

    const getNodeRunningPercentage = (total: number, running: number) => (running / total);

    const fetchMetrics = async () => {
        try {
            const [totalNodes, totalRunningNodes] = await Promise.all(_.map(metrics, metric => fetchChartData(metric.query as any)));
            const nodeRunningPercentage = (totalNodes && getNodeRunningPercentage(totalNodes as any, totalRunningNodes as any)) || 0;
            setConfig({
                percentage: nodeRunningPercentage,
                label: `${totalRunningNodes} / ${totalNodes} Nodes Running`
            });
        } catch (error) {
            console.log(error);
        }
    }

    const configureMetricFetcher = () => {
        fetchMetrics();
        const frequency = globalConfig.clusterMenu.frequency;
        return setInterval(() => {
            fetchMetrics();
        }, frequency * 1000)
    }

    useEffect(() => {
        configureMetricFetcher();
    }, [])


    const renderGuage = (percentage: any) => <GaugeChart arcsLength={null} nrOfLevels={20} colors={['#EA4228', '#5BE12C']} percentage={percentage} />

    return <>
        <Stack direction="column" justifyContent="center" alignItems="center">
            {_.get(config, 'percentage') ? renderGuage(_.get(config, 'percentage')) : renderGuage(0)}
            <AsyncLabel align="center" variant="caption" color="textSecondary" suffix={_.get(config, 'label')}></AsyncLabel>
        </Stack>
    </>
};

export default ClusterNodes;
