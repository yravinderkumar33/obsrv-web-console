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
    }
]