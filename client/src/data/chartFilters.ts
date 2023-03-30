export default {
    default: [
        {
            label: 'Today',
            value: 1140,
            default: true,
            step: '5m',
        },
        {
            label: 'Last 7 Days',
            value: 10080,
            step: '15m'
        },
        {
            label: 'Last 15 Days',
            value: 21600,
            step: '30m'
        },
        {
            label: 'Last 30 Days',
            value: 43200,
            step: '1h'
        }
    ],
    variant1: [
        {
            label: 'Today',
            value: 1140,
            default: true,
            step: '5m',
        },
        {
            label: 'Last 7 Days',
            value: 10080,
            step: '30m'
        }
    ],
    alertsSeverity: [
        {
            label: 'Warning',
            color: 'warning',
            value: 'warning'
        },
        {
            label: 'Critical',
            color: 'error',
            value: 'error'
        },
    ]
}