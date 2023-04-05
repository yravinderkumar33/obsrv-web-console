export const validateDataForm = [
    {
        name: "validateType",
        label: "Validation Type",
        type: 'select',
        selectOptions: [
            {
                label: 'Strict',
                value: 'strict'
            },
            {
                label: 'Ignore New Fields',
                value: 'ignore'
            },
            {
                label: 'Auto Index New Fields',
                value: 'auto'
            }
        ]
    }
]

export const dedupeForm = [
    {
        name: "dedupeKey",
        label: "Dedupe Key",
        type: 'text',
        required: true
    },
    {
        name: "dedupePeriod",
        label: "Dedupe Period in Days",
        type: 'text',
        default: '7',
        required: true
    }
]