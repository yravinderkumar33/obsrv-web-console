export const jsonSchema = {
    schema: {
        "type": "object",
        "properties": {
            "eid": {
                "type": "integer"
            },
            "ver": {
                "type": "string"
            },
            "syncts": {
                "type": "integer"
            },
            "ets": {
                "type": "integer"
            },
            "flags": {
                "type": "object",
                "properties": {
                    "pp_validation_processed": {
                        "type": "boolean"
                    },
                    "pp_duplicate": {
                        "type": "boolean"
                    },
                    "device_denorm": {
                        "type": "boolean"
                    },
                    "dialcode_denorm": {
                        "type": "boolean"
                    },
                    "content_denorm": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "pp_validation_processed",
                    "pp_duplicate",
                    "device_denorm",
                    "dialcode_denorm",
                    "content_denorm"
                ]
            },
            "dialcodedata": {
                "type": "object",
                "properties": {
                    "identifier": {
                        "type": "string"
                    },
                    "channel": {
                        "type": "string"
                    },
                    "publisher": {
                        "type": "string"
                    },
                    "status": {
                        "type": "integer"
                    }
                },
                "required": [
                    "identifier",
                    "channel",
                    "publisher",
                    "status"
                ]
            },
            "mid": {
                "type": "string"
            },
            "type": {
                "type": "string"
            },
            "tags": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "actor": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "string"
                    },
                    "type": {
                        "type": "string"
                    }
                },
                "required": [
                    "id",
                    "type"
                ]
            },
            "edata": {
                "type": "object",
                "properties": {
                    "topn": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "identifier": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "identifier"
                            ]
                        }
                    },
                    "query": {
                        "type": "string"
                    },
                    "size": {
                        "type": "integer"
                    },
                    "type": {
                        "type": "string"
                    },
                    "filters": {
                        "type": "object",
                        "properties": {
                            "contentType": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "mimeType": {
                                "type": "object"
                            },
                            "resourceType": {
                                "type": "object"
                            },
                            "status": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "objectType": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "dialcodes": {
                                "type": "string"
                            },
                            "framework": {
                                "type": "object"
                            },
                            "compatibilityLevel": {
                                "type": "object",
                                "properties": {
                                    "max": {
                                        "type": "integer"
                                    },
                                    "min": {
                                        "type": "integer"
                                    }
                                },
                                "required": [
                                    "max",
                                    "min"
                                ]
                            },
                            "channel": {
                                "type": "object",
                                "properties": {
                                    "ne": {
                                        "type": "array",
                                        "items": {
                                            "type": "string"
                                        }
                                    }
                                },
                                "required": [
                                    "ne"
                                ]
                            }
                        },
                        "required": [
                            "contentType",
                            "mimeType",
                            "resourceType",
                            "status",
                            "objectType",
                            "dialcodes",
                            "framework",
                            "compatibilityLevel",
                            "channel"
                        ]
                    },
                    "sort": {
                        "type": "object"
                    }
                },
                "required": [
                    "topn",
                    "query",
                    "size",
                    "type",
                    "filters",
                    "sort"
                ]
            },
            "@timestamp": {
                "type": "string",
                "format": "date-time"
            },
            "context": {
                "type": "object",
                "properties": {
                    "pdata": {
                        "type": "object",
                        "properties": {
                            "ver": {
                                "type": "string"
                            },
                            "id": {
                                "type": "string"
                            },
                            "pid": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "ver",
                            "id",
                            "pid"
                        ]
                    },
                    "did": {
                        "type": "string"
                    },
                    "env": {
                        "type": "string"
                    },
                    "channel": {
                        "type": "string"
                    }
                },
                "required": [
                    "pdata",
                    "did",
                    "env",
                    "channel"
                ]
            },
            "@version": {
                "type": "string"
            },
            "object": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "string"
                    },
                    "type": {
                        "type": "string"
                    }
                },
                "required": [
                    "id",
                    "type"
                ]
            }
        },
        "required": [
            "eid",
            "ver",
            "syncts",
            "ets",
            "flags",
            "dialcodedata",
            "mid",
            "type",
            "tags",
            "actor",
            "edata",
            "@timestamp",
            "context",
            "@version",
            "object"
        ]
    },
    configurations: {
        "ingestion": {
            "indexCol": "syncts",
            "rollup": true,
            "granulariy": {
                "segments": "DAY",
                "query": "MINUTE"
            },
            "taskCount": 1,
            "taskDuration": "PT3600S",
            "replicas": 1
        },
        "querying": {
            "rules": [
                {
                    "dataset": "telemetry-raw",
                    "queryRules": {
                        "groupBy": {
                            "maxDateRange": 30
                        },
                        "scan": {
                            "maxDateRange": 30
                        },
                        "maxResponseSize": 5000
                    }
                }
            ]
        },
        "processing": {
            "checkpointingInterval": 6000,
            "dedup": {
                "property": "mid",
                "retentionPeriod": 3600000
            },
            "consumerPrallelism": 1,
            "downStreamParallelism": 1,
            "compression": "snappy",
            "dataSize": 1572864
        }
    },
    suggestions: [
        {
            "property": "edata.count",
            "suggestion": [
                {
                    "message": "Updating the exisiting data type of the properry",
                    "advice": "Might required the replaying of the exisitng data",
                    "severity": "High",
                    "resolutionType": "DATA_TYPE"
                },
                {
                    "message": "Naming convention conflict. found 'Count', 'count', 'cnt' properties",
                    "advice": "Spelling correction is required, System chosen the 'count' property ",
                    "severity": "Medium",
                    "resolutionType": "TYPOGRAPHICAL"
                }
            ]
        },
        {
            "property": "syncts",
            "suggestion": [
                {
                    "message": "It appears to be a time stamp column",
                    "advice": "System will index the data on this column",
                    "severity": "High",
                    "resolutionType": "CONFIGURATION"
                }
            ]
        },
        {
            "property": "mid",
            "suggestion": [
                {
                    "message": "It appears to be a high cardinal property",
                    "advice": "Skip the indexing the property and enabe rollups",
                    "severity": "Low",
                    "resolutionType": "CONFIGURATION"
                }
            ]
        }
    ]
}