import kafka from './kafka'
import druid from './druid'
import infra from './infra'
import alerts from './alerts'
import ingestion from './ingestion'
import api from './api'

export default {
    ...kafka,
    ...druid,
    ...infra,
    ...alerts,
    ...ingestion,
    ...api
}