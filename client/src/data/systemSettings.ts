
const env = process.env.ENV || "local"

export default [
    {
        "category": "ENVIRONMENT",
        "key": "systemEnv",
        "value": env,
        "type": "SYSTEM"
    },
    {
        "category": "KAFKA",
        "key": "defaultTopicPartitions",
        "value": "4",
        "type": "SYSTEM"
    },
    {
        "category": "KAFKA",
        "key": "defaultTopicRetentions",
        "value": "5",
        "type": "SYSTEM"
    },
    {
        "category": "KAFKA",
        "key": "defaultReplicationFactor",
        "value": "2",
        "type": "SYSTEM"
    },
    {
        "category": "KAFKA",
        "key": "maxBatchEventSizeInMb",
        "value": "2",
        "type": "UserDefined"
    },
    {
        "category": "KAFKA",
        "key": "maxEventSizeInMb",
        "value": "1",
        "type": "SYSTEM"
    },
    {
        "category": "DATA_API",
        "key": "entryTopicMasterDataset",
        "value": `${env
        }.masterdata.ingest`,
        "type": "SYSTEM"
    },
    {
        "category": "DATA_API",
        "key": "entryTopicDataset",
        "value": `${env
        }.ingest`,
        "type": "SYSTEM"
    },
    {
        "category": "DATASOURCE",
        "key": "segmentGranularity",
        "value": "DAY",
        "type": "SYSTEM"
    },
    {
        "category": "DATASOURCE",
        "key": "queryGranularity",
        "value": "None",
        "type": "SYSTEM"
    },
    {
        "category": "DATASOURCE",
        "key": "maxRowPerSegment",
        "value": "500k",
        "type": "SYSTEM"
    },
    {
        "category": "DATASOURCE",
        "key": "maxBytesInMemory",
        "value": "200M",
        "type": "SYSTEM"
    },
    {
        "category": "DATASOURCE",
        "key": "taskCount",
        "value": "1",
        "type": "SYSTEM"
    },
    {
        "category": "DATASOURCE",
        "key": "defaultTimeColumn",
        "value": "syncts",
        "type": "SYSTEM"
    },
    {
        "category": "DATASOURCE",
        "key": "defaultTaskDuration",
        "value": "1 hour",
        "type": "SYSTEM"
    },
    {
        "category": "DATASOURCE",
        "key": "defaultTaskPublishingDuration",
        "value": "1 hour",
        "type": "SYSTEM"
    },
    {
        "category": "DATASET",
        "key": "defaultDatasetId",
        "value": "ALL",
        "type": "SYSTEM"
    },
    {
        "category": "DATASET",
        "key": "redisPort",
        "value": "6379",
        "type": "SYSTEM"
    },
    {
        "category": "DATASET",
        "key": "redisHost",
        "value": "redis.svc.cluster.local",
        "type": "SYSTEM"
    },
    {
        "category": "DATASET",
        "key": "individualEventsDropDuplicates",
        "value": "true",
        "type": "SYSTEM"
    },
    {
        "category": "DATASET",
        "key": "batchEventsDropDuplicates",
        "value": "true",
        "type": "SYSTEM"
    },
    {
        "category": "DATASET",
        "key": "extractionConfigIsBatchEvent",
        "value": "false",
        "type": "SYSTEM"
    },
    {
        "category": "DATASET",
        "key": "validationMode",
        "value": "strict",
        "type": "SYSTEM"
    },
    {
        "category": "DATASET",
        "key": "validateConfigValidate",
        "value": "false",
        "type": "SYSTEM"
    },
    {
        "category": "DATASET",
        "key": "defaultDedupePeriodInSeconds",
        "value": "604800",
        "type": "SYSTEM"
    },
    {
        "category": "WEB-CONSOLE",
        "key": "maxFileUploadSizeInMb",
        "value": "5",
        "type": "SYSTEM"
    },
    {
        "category": "WEB-CONSOLE",
        "key": "telemetryBatchSize",
        "value": "10",
        "type": "SYSTEM"
    },
    {
        "category": "WEB-CONSOLE",
        "key": "apiTimeoutInMinutes",
        "value": "1",
        "type": "SYSTEM"
    },
    {
        "category": "BACKUP",
        "key": "metadataStoreBackupFrequency",
        "value": "DAILY",
        "type": "SYSTEM"
    },
    {
        "category": "BACKUP",
        "key": "metricsStoreBackupFrequency",
        "value": "DAILY",
        "type": "SYSTEM"
    },
    {
        "category": "BACKUP",
        "key": "defaultDedupePeriodInSeconds",
        "value": "604800",
        "type": "SYSTEM"
    },
    {
        "category": "nodeOfNodes",
        "key": "metricsStoreBackupFrequency",
        "value": "DAILY",
        "type": "SYSTEM"
    },
    {
        "category": "INFRA",
        "key": "maxElapsedTime",
        "value": "604800",
        "type": "SYSTEM"
    },
    {
        "category": "INFRA",
        "key": "configureForSpeedOrCost",
        "value": "DAILY",
        "type": "SYSTEM"
    },
    {
        "category": "INFRA",
        "key": "encryptionKey",
        "value": "604800",
        "type": "SYSTEM"
    },
    {
        "category": "INFRA",
        "key": "backupFrequency",
        "value": "604800",
        "type": "SYSTEM"
    },
    {
        "category": "INFRA",
        "key": "scaleConfiguration",
        "value": "604800",
        "type": "SYSTEM"
    }
]