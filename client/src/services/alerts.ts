import { http } from 'services/http';
import endpoints from 'data/apiEndpoints'

export const fetchAlerts = ({ config }: any) => {
    return http.get(endpoints.alerts, config || {});
}