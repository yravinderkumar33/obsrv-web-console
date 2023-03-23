import chartMeta from 'data/charts'
import { fetchChartData } from "services/clusterMetrics";

export const getTotalNodes = async () => {
    const query = chartMeta.total_nodes_count.query;
    return fetchChartData(query as any);
}

export const getRunningNodes = async () => {
    const query = chartMeta.total_running_nodes_count.query
    return fetchChartData(query as any);
}