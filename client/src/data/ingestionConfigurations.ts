import * as yup from "yup";

export default {
    batchConfiguration: {
        extractionKey: {
            required: true,
            value: '',
        },
        idForTheBatch: {
            required: true,
            value: '',
        },
        dedupeEvents: {
            required: false,
            value: [false, true],
        },
        dedupeKey: {
            required: true,
            value: '',
            dependsOn: {
                key: 'dedupeEvents',
                value: true
            },
            validationSchema: yup.string().when('dedupeEvents', {
                is: true,
                then: yup.string().required("Value is required for the field"),
            }),
        },
        dedupePeriod: {
            label: 'Dedupe Period in Days',
            required: true,
            value: '',
            dependsOn: {
                key: 'dedupeEvents',
                value: true
            },
            validationSchema: yup.number().when('dedupeEvents', {
                is: true,
                then: yup.number().required("Value is required for the field"),
            })
        },
        validateData: {
            required: true,
            value: [false, true],
        }
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
