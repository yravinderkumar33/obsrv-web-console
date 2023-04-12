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
    const [percentage, setPercentage] = useState(0);
    const getNodeRunningPercentage = (total: number, running: number) => (running / total);
    const [suffix, setSuffix] = useState("0/0 Nodes Running");

    const fetchMetrics = async () => {
        try {
            const [totalNodes, totalRunningNodes] = await Promise.all(_.map(metrics, metric => fetchChartData(metric.query as any)));
            const nodeRunningPercentage = (totalNodes && getNodeRunningPercentage(totalNodes as any, totalRunningNodes as any)) || 0;
            setPercentage(nodeRunningPercentage);
            setSuffix(`${totalRunningNodes}/${totalNodes} Nodes Running`);
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

    return <>
        <Stack direction="column" justifyContent="center" alignItems="center">
            <GaugeChart arcsLength={null} nrOfLevels={20} colors={['#EA4228', '#5BE12C']} percentage={percentage} />
            <AsyncLabel align="center" variant="caption" color="textSecondary" suffix={suffix}></AsyncLabel>
        </Stack>
    </>
};

export default ClusterNodes;
