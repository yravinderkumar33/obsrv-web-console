import client from 'prom-client';
import { queryResponseTimeMetric, totalApiCallsMetric, apiThroughputMetric, failedApiCallsMetric } from './metrics'
const metrics = [queryResponseTimeMetric, totalApiCallsMetric, apiThroughputMetric, failedApiCallsMetric];

const register = new client.Registry();

const configureRegistry = (register: client.Registry) => {
    client.collectDefaultMetrics({ register });
    register.setDefaultLabels({ release: 'monitoring' });
    metrics.forEach(metric => {
        register.registerMetric(metric);
    })
}

const incrementApiCalls = () => totalApiCallsMetric.inc();
const setQueryResponseTime = (duration: any) => queryResponseTimeMetric.set(duration);
const incrementFailedApiCalls = () => failedApiCallsMetric.inc();

//register all the metrics
configureRegistry(register);

export { register, incrementApiCalls, incrementFailedApiCalls, setQueryResponseTime };

