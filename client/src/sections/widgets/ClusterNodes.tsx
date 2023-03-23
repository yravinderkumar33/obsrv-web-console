import { useEffect, useMemo, useState } from "react";
import * as _ from 'lodash';

import chartMeta from '../../data/charts'
import ApexChart from "sections/dashboard/analytics/apex";
import { fetchChartData } from "services/clusterMetrics";
import globalConfig from 'data/initialConfig';

const ClusterNodes = () => {
    const metrics = useMemo(() => [chartMeta.total_nodes_count, chartMeta.total_running_nodes_count], []);
    const [chartMetadata, setChartMetadata] = useState(null);
    const getNodeRunningPercentage = (total: number, running: number) => (running / total) * 100;

    const fetchMetrics = async () => {
        try {
            const [totalNodes, totalRunningNodes] = await Promise.all(_.map(metrics, metric => fetchChartData(metric.query as any)));
            const nodeRunningPercentage = (totalNodes && getNodeRunningPercentage(totalNodes as any, totalRunningNodes as any)) || 0;
            const meta = _.cloneDeep(chartMeta.nodes_Radial);
            _.set(meta, 'series', [nodeRunningPercentage]);
            _.set(meta, 'options.labels', [`${totalRunningNodes}/${totalNodes} Nodes`]);
            setChartMetadata(meta as any);
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
        {chartMetadata && <ApexChart metadata={chartMetadata} />}
    </>
};

export default ClusterNodes;
