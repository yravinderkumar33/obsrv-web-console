import kafka from './kafka'
import druid from './druid'
import infra from './infra'
import alerts from './alerts'

export default {
    ...kafka,
    ...druid,
    ...infra,
    ...alerts
}