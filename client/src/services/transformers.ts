import * as _ from 'lodash';

export const totalVsRunningNodes = (response: any) => {
    const [runningNodes, totalNodes] = response;
    return `${runningNodes} / ${totalNodes}`
}

export const percentageUsage = (response: any) => {
    const [percentage, nodes] = response;
    return `${percentage} % Usage on ${nodes} Nodes`
}

export const cpuPercentageUsage = (response: any) => {
    const [percentage, nodes, totalCpu] = response;
    return `${percentage} % Usage on ${nodes} Nodes, ${totalCpu} CPU's`
}

export const backupStatus = (response: any) => {
    const [backupCount, percentage] = response;
    const status = percentage < 100 ? "Unhealthy" : "Healthy";
    return `${backupCount} Successful Backups (${status})`;
}

export const alertsFilterByLabels = (config: any) => {
    const { matchLabels } = config;
    return (alert: Record<string, any>) => {
        const labels = _.get(alert, 'labels') || {};
        if (_.size(matchLabels) === 0) return true;
        return _.every(matchLabels, (labelValue, labelKey) => {
            const doesExists = _.find(labels, (value, key) => value === labelValue && key === labelKey);
            return doesExists ? true : false;
        })
    }
}
