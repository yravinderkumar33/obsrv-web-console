export const datasets = [
    {
        "name": "cropwise-observations",
        "health": "active",
        "status": "live",
        "color": "success",
        "connectors": [
            "Kafka",
            "S3"
        ],
        "completionPercentage": 60,
        "metrics": [
            {
                key: "Total Events",
                value: "200K"
            },
            {
                key: "Avg Processing Time",
                value: "2 seconds"
            },
            {
                key: "Last Synced",
                value: "2 seconds ago"
            }
        ]
    },
    {
        "name": "cropwise-collections",
        "health": "suspended",
        "status": "live",
        "color": "error",
        "connectors": [
            "Kafka"
        ],
        "completionPercentage": 90,
        "metrics": [
            {
                key: "Total Events",
                value: "100K"
            },
            {
                key: "Avg Processing Time",
                value: "5 seconds"
            },
            {
                key: "Last Synced",
                value: "10 seconds ago"
            }
        ]
    },
    {
        "name": "cropwise",
        "health": "active",
        "status": "live",
        "color": "success",
        "connectors": [
            "Kafka",
            "S3"
        ],
        "completionPercentage": 60,
        "metrics": [
            {
                key: "Total Events",
                value: "200K"
            },
            {
                key: "Avg Processing Time",
                value: "2 seconds"
            },
            {
                key: "Last Synced",
                value: "2 seconds ago"
            }
        ]
    },
]