import { confirmationOptions } from "./common"

export const kafkaForm = [
    {
        name: "topicName",
        label: "Kafka Topic Name",
        tooltip: "Name of the kafka topic where raw data is stored",
        type: 'text',
        required: true
    },
    {
        name: "brokersList",
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
        name: "id",
        label: "Batch Id",
        type: 'text',
        required: true,
        tooltip: 'Provide a unique batch identifier',
    },
    {
        name: "dedupe",
        label: "Dedupe Batch ?",
        type: 'select',
        tooltip: 'Select if you want to dedupe batch or not ?',
        selectOptions: confirmationOptions
    },
    {
        name: "dedupePeriod",
        label: "Dedupe Period in Minutes",
        type: 'number',
        default: '7',
        required: true,
        dependsOn: {
            key: "dedupe",
            value: 'yes'
        }
    }
]



