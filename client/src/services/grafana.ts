import { NavigateFunction } from "react-router";

export const navigateToGrafana = (dashboardLink: string) => {
    window.open(dashboardLink);
} 