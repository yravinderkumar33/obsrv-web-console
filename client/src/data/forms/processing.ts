export const validateDataForm = [
    {
        name: "validateType",
        label: "Validation Type",
        type: 'select',
        tooltip: "Select Appropriate validate type",
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
        tooltip: "Column based on which you want to enable the dedupe",
        required: true
    },
    {
        name: "dedupePeriod",
        label: "Dedupe Period in Days",
        type: 'number',
        required: true
    }
]