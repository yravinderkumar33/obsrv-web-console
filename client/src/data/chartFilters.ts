export default {
    default: [
        {
            label: 'Today',
            telemetryId: "today",
            value: 1140,
            default: true,
            step: '5m',
            granularity: "five_minute",
            res: '30s'
        },
        {
            label: 'Last 7 Days',
            telemetryId: "lastSevenDays",
            value: 10080,
            step: '30m',
            granularity: "fifteen_minute",
            res: '30s'
        },
        {
            label: 'Last 15 Days',
            telemetryId: "lastFifteenDays",
            value: 21600,
            step: '1h',
            granularity: "thirty_minute",
            res: '30s'
        },
        {
            label: 'Last 30 Days',
            telemetryId: "lastThirtyDays",
            value: 43200,
            step: '6h',
            granularity: "hour",
            res: '30s'
        }
    ],
    variant1: [
        {
            label: 'Today',
            telemetryId: "today",
            value: 1140,
            default: true,
            step: '5m',
        },
        {
            label: 'Last 7 Days',
            telemetryId: "lastSevenDays",
            value: 10080,
            step: '30m'
        }
    ],
    alertsSeverity: [
        {
            label: 'Warning',
            color: 'warning',
            default: true,
            value: 'warning'
        },
        {
            label: 'Critical',
            color: 'error',
            value: 'error'
        },
    ]
}