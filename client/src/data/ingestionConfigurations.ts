export default {
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
        isBatch: [true, false],
        extractionKey: {
            value: '',
            dependsOn: {
                key: 'isBatch',
                value: true
            }
        }
    }
}