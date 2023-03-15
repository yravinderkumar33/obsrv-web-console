import kafka from './kafka'
import druid from './druid'
import infra from './infra'
import alerts from './alerts'

export const commonMetrics = {
    frequency: 15,
    interval: 5
}

export default {
    ...kafka,
    ...druid,
    ...infra,
    ...alerts
}