export default [
    {
        "key": "default",
        "label": "",
        "section": "advance",
        "description": "",
        "show": true,
        "default": ""
    },
    {
        "key": "ingestion.dataSet",
        "label": "Dataset",
        "section": "basic",
        "description": "Datset Name"
    },
    {
        "key": "ingestion.indexCol",
        "label": "Index Column",
        "section": "basic"
    },
    {
        "key": "ingestion.granularitySpec.segmentGranularity",
        "label": "Segment Granularity",
        "section": "basic",
        "description": "Time chunking period for the segment granularity. Defaults to 'null', which preserves the original segment granularity.",
        "show": true,
        "default": "all",
        "enum": [
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
        ]
    },
    {
        "key": "ingestion.granularitySpec.queryGranularity",
        "label": "Query Granularity",
        "section": "basic",
        "description": "The resolution of timestamp storage within each segment. Defaults to 'null', which preserves the original query granularity. Accepts all Query granularity values.",
        "default": "all",
        "enum": [
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
        ]
    },
    {
        "key": "ingestion.granularitySpec.rollup",
        "label": "Rollup",
        "section": "basic",
        "description": "Whether to enable ingestion-time rollup or not. Defaults to 'null', which preserves the original setting. Note that once data is rollup, individual records can no longer be recovered."
    },
    {
        "key": "querying.common.maxResultThreshold",
        "label": "Max Result Threshold"
    },
    {
        "key": "querying.common.maxResultRowLimit",
        "label": "Max Result RowLimit"
    },
    {
        "key": "querying.rules[0].dataSource",
        "show": false
    },
    {
        "key": "querying.rules[0].queryRules.groupBy.maxDateRange",
        "show": false
    },
    {
        "key": "querying.rules[0].queryRules.scan.maxDateRange",
        "show": false
    },
    {
        "key": "querying.rules[0].queryRules.search.maxDateRange",
        "show": false
    },
    {
        "key": "querying.rules[0].queryRules.timeBoundary.maxDateRange",
        "show": false
    },
    {
        "key": "querying.rules[0].queryRules.timeseries.maxDateRange",
        "show": false
    },
    {
        "key": "querying.rules[0].queryRules.topN.maxDateRange",
        "show": false
    },
    {
        "key": "querying.rules[1].dataSource",
        "show": false
    },
    {
        "key": "querying.rules[1].queryRules.groupBy.maxDateRange",
        "show": false
    },
    {
        "key": "querying.rules[1].queryRules.scan.maxDateRange",
        "show": false
    },
    {
        "key": "querying.rules[1].queryRules.search.maxDateRange",
        "show": false
    },
    {
        "key": "querying.rules[1].queryRules.timeBoundary.maxDateRange",
        "show": false
    },
    {
        "key": "querying.rules[1].queryRules.timeseries.maxDateRange",
        "show": false
    },
    {
        "key": "querying.rules[1].queryRules.topN.maxDateRange",
        "show": false
    },
    {
        "key": "processing.checkpointingInterval",
        "label": "Checkpointing Interval"
    },
    {
        "key": "processing.dedupProperty",
        "label": "Dedup Property"
    },
    {
        "key": "processing.dedupRetentionPeriod",
        "label": "Dedup Retention Period"
    },
    {
        "key": "processing.consumerParallelism",
        "label": "Consumer Parallelism"
    },
    {
        "key": "processing.downstreamParallelism",
        "label": "Downstream Parallelism"
    },
    {
        "key": "processing.compression",
        "label": "Compression"
    },
    {
        "key": "processing.dataSize",
        "label": "Data Size"
    }
]