import druid from './druid'
import infra from './infra'
import alerts from './alerts'
import ingestion from './ingestion'
import api from './api'
import processing from './processing'
import storage from './storage'

export default {
    ...druid,
    ...infra,
    ...alerts,
    ...ingestion,
    ...api,
    ...processing,
    ...storage
}