export const jsonSchema = {
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
}