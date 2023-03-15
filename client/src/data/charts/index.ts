import kafka from './kafka'
import druid from './druid'
import infra from './infra'

export const commonMetrics = {
    frequency: 15,
    interval: 5
}

export default {
    ...kafka,
    ...druid,
    ...infra
}