export const navigateToGrafana = (dashboardLink: string) => {
    const graphanaUrl = process.env.REACT_APP_GRAFANA_URL;
    if (graphanaUrl) {
        const url = `${graphanaUrl}/${dashboardLink}`
        window.open(url);
    }
} 
