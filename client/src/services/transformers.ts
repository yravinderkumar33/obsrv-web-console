import * as _ from 'lodash-es';

export const totalVsRunningNodes = (response: any) => {
    const [runningNodes, totalNodes] = response;
    return `${runningNodes} / ${totalNodes}`
}

const getUsedCpu = (total: any, percent: any) => {
    _.floor((total * percent) / 100, 2)
}

export const percentageUsage = (response: any) => {
    const [percentage, nodes] = response;
    return `${percentage} % Usage on ${nodes} Nodes`
}

export const cpuPercentageUsage = (response: any) => {
    const [percentage, nodes, totalCpu] = response;
    return `${percentage} % Usage on ${nodes} Nodes, ${totalCpu} CPU's`
}