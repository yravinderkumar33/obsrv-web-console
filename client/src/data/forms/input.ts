import { confirmationOptions } from "./common"

export const kafkaForm = [
    {
        name: "topic",
        label: "Kafka Topic Name",
        tooltip: "Name of the kafka topic where raw data is stored",
        type: 'text',
        required: true,
    },
    {
        name: "kafkaBrokers",
        label: "Comma Seprated List of Broker Urls",
        tooltip: "The list of brokers seprated by comma that we want to send the messages to",
        type: 'text',
        required: true
    }
]

export const batchForm = [
    {
        name: "extractionKey",
        label: "Extraction Key",
        tooltip: "Path to the events property inside the batch object",
        type: 'text',
        required: true
    },
    {
        name: "dedupeRequired",
        label: "Dedupe Batch ?",
        type: 'select',
        tooltip: 'Select if you want to dedupe batch or not ?',
        selectOptions: confirmationOptions
    },
    {
        name: "batchId",
        label: "Batch ID",
        type: 'text',
        required: true,
        dependsOn: {
            key: "dedupeRequired",
            value: 'yes'
        }
    },
    {
        name: "dedupePeriod",
        label: "Dedupe Period in Minutes",
        type: 'number',
        required: true,
        dependsOn: {
            key: "dedupeRequired",
            value: 'yes'
        }
    }
]



