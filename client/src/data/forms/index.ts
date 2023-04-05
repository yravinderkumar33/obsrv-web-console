import { kafkaForm, batchForm } from './input'
import { validateDataForm, dedupeForm } from './processing'

export const forms = {
    input_kafka: kafkaForm,
    input_batch: batchForm,
    input_dedupe: dedupeForm,
    input_validateData: validateDataForm
}