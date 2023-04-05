import { confirmationOptions } from "./common"

export const kafkaForm = [
    {
        name: "topicName",
        label: "Kafka Topic Name",
        type: 'text',
        required: true
    },
    {
        name: "brokersList",
        label: "Comma Seprated List of Broker Urls",
        type: 'text',
        required: true
    }
]

export const batchForm = [
    {
        name: "extractionKey",
        label: "Extraction Key",
        type: 'text',
        required: true
    },
    {
        name: "dedupe",
        label: "Dedupe Batch ?",
        type: 'select',
        selectOptions: confirmationOptions
    },
    {
        name: "id",
        label: "Batch Id",
        type: 'text',
        required: true,
        dependsOn: {
            key: 'dedupe',
            value: 'yes'
        }
    },
]



