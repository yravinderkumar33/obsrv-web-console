import * as _ from 'lodash';

export const navigateToSuperset = (dashboardLink: string) => {
    const supersetUrl = process.env.REACT_APP_SUPERSET_URL;
    if (supersetUrl) {
        const url = `${supersetUrl}/${dashboardLink}`
        window.open(url);
    }
} 