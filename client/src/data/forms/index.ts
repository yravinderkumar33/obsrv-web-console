import { kafkaForm, batchForm } from './input'
import { validateDataForm, dedupeForm } from './processing'
import { retentionForm } from './advanced';

export const forms = {
    input_kafka: kafkaForm,
    input_batch: batchForm,
    input_dedupe: dedupeForm,
    input_validateData: validateDataForm,
    advanced_retention: retentionForm
}