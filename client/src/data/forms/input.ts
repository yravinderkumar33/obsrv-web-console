import * as yup from "yup";
export const kafkaForm = [
    {
        name: "topic",
        label: "Kafka Topic Name",
        tooltip: "Name of the kafka topic where raw data is stored",
        type: 'text',
        required: true,
        validationSchema: yup.string().required('This field is required'),
    },
    {
        name: "kafkaBrokers",
        label: "Comma Seprated List of Broker Urls",
        tooltip: "The list of brokers seprated by comma that we want to send the messages to",
        type: 'text',
        required: true,
        validationSchema: yup.string().required('This field is required').min(10, 'Minimum of 10 characters is required for this field'),
    }
]

export const batchForm = [
    {
        name: "extractionKey",
        label: "Extraction Key",
        tooltip: "Path to the events property inside the batch object",
        type: 'text',
        required: true,
        validationSchema: yup.string().required('This field is required').min(1, 'Minimum of 1 character is required for this field'),
    },
    {
        name: "batchId",
        label: "Batch Identifier",
        type: 'text',
        required: true,
        validationSchema: yup.string().required('This field is required').min(1, 'Minimum of 1 character is required for this field'),
    },
    {
        name: "dedupeRequired",
        label: "Enable Deduplication",
        type: 'checkbox',
        tooltip: 'Select if you want to dedupe batch or not ?',
        selectOptions: [{
            label: 'Enable Deduplication',
            value: 'yes'
        }],
        validationSchema: yup.array().optional(),
    },
    {
        name: "dedupePeriod",
        label: "Deduplication Period (Minutes)",
        type: 'number',
        required: true,
        filterInclude: true,
        dependsOn: {
            key: "dedupeRequired",
            value: 'yes'
        },
        validationSchema: yup.number().when(
            'dedupeRequired', {
            is: (option: any) => { if (option) return option.includes('yes'); else return false; },
            then: yup.number().required('This field is required')
        }),
    }
]



