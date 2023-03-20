import { useEffect, useMemo, useState } from "react";
import * as _ from 'lodash';

import chartMeta from '../../data/charts'
import ApexChart from "sections/dashboard/analytics/apex";
import { fetchChartData } from "services/clusterMetrics";

const ClusterNodes = () => {
    const metrics = useMemo(() => [chartMeta.total_nodes_count, chartMeta.total_running_nodes_count], []);
    const [chartMetadata, setChartMetadata] = useState(chartMeta.nodes_Radial);
    const getNodeRunningPercentage = (total: number, running: number) => (running / total) * 100;

    const fetchMetrics = async () => {
        try {
            const [totalNodes, totalRunningNodes] = await Promise.all(_.map(metrics, metric => fetchChartData(metric.query as any)));
            const nodeRunningPercentage = (totalNodes && getNodeRunningPercentage(totalNodes as any, totalRunningNodes as any)) || 0;
            setChartMetadata((preState: any) => {
                _.set(preState, 'series', [nodeRunningPercentage]);
                _.set(preState, 'options.labels', [`${totalRunningNodes}/${totalNodes}`]);
                return preState;
            });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchMetrics();
    }, [])

    return <>
        <ApexChart metadata={chartMetadata} />
    </>
};

export default ClusterNodes;
