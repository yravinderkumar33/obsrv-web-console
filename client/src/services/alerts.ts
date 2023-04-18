import axios from 'axios';
import endpoints from 'data/apiEndpoints'

export const fetchAlerts = ({ config }: any) => {
    return axios.get(endpoints.alerts, config || {});
}