export default {
    batchConfiguration: {
        isBatch: [true, false],
        extractionKey: {
            value: '',
            dependsOn: {
                key: 'isBatch',
                value: true
            }
        },
        dedupeEvents: [true, false],
        dedupeKey: {
            value: '',
            dependsOn: {
                key: 'dedupeEvents',
                value: true
            }
        },
        dedupePeriod: { value: '' },
        validateData: [true, false]
    },
    ingestionConfiguration: {
        ingestionType: ['API', 'Kafka', 'Custom']
    },
    advanced: {
        segmentGranularity: [
            "all",
            "none",
            "second",
            "minute",
            "five_minute",
            "ten_minute",
            "fifteen_minute",
            "thirty_minute",
            "hour",
            "six_hour",
            "eight_hour",
            "day",
            "week",
            "month",
            "quarter",
            "year",
        ],
        queryGranularity: [
            "all",
            "none",
            "second",
            "minute",
            "five_minute",
            "ten_minute",
            "fifteen_minute",
            "thirty_minute",
            "hour",
            "six_hour",
            "eight_hour",
            "day",
            "week",
            "month",
            "quarter",
            "year",
        ],
        rollup: [false, true],
    }
}