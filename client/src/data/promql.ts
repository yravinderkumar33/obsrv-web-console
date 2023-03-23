export default {
    "node_memory": {
        "query": "(1 - sum(:node_memory_MemAvailable_bytes:sum{cluster=\"\"}) / sum(node_memory_MemTotal_bytes{job=\"node-exporter\",cluster=\"\"})) * 100"
    },
    "node_cpu": {
        "query": "(cluster:node_cpu:ratio_rate5m{cluster=\"\"}) * 100"
    },
    "cpu_percentage": {
        "query": "cluster:node_cpu:ratio_rate5m{cluster=\"\"}"
    },
    "memory_percentage": {
        "query": "1 - sum(:node_memory_MemAvailable_bytes:sum{cluster=\"\"}) / sum(node_memory_MemTotal_bytes{job=\"node-exporter\",cluster=\"\"})"
    },
    "disk_percentage": {
        "query": "100 - ((node_filesystem_free_bytes{mountpoint=\"/\"} / node_filesystem_size_bytes{mountpoint=\"/\"}) * 100)"
    },
    "nodes_percentage": {
        "query": "100 * (count(up == 1) by (instance) / count(up) by (instance))"
    },
    "nodes_Radial": {
        "query": "100 * count(up == 1) by (instance) / count(up) by (instance)"
    },
    "number_of_kafka_brokers": {
        "query": "kafka_brokers"
    },
    "kafka_broker_upTime": {
        "query": "kafka_brokers"
    },
    "druid_running_tasks": {
        "query": "count(druid_tasks_duration{task_status=\"RUNNING\"}) by (task_status)"
    },
    "druid_completed_tasks": {
        "query": "count(druid_tasks_duration{task_status=\"SUCCESS\"}) by (task_status)"
    },
    "druid_failed_tasks": {
        "query": "count(druid_tasks_duration{task_status=\"FAILED\"}) by (task_status)"
    },
    "druid_health_status": {
        "query": "druid_health_status"
    },
    "druid_total_datasources": {
        "query": "count(druid_datasource{})"
    },
    "druid_total_segments": {
        "query": "count(druid_datasource{})"
    },
    "druid_unloaded_segments": {
        "query": "count(druid_datasource{})"
    },
    "druid_cpu_usage": {
        "query": "sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_irate{cluster=\"\"}) by (druid)"
    },
    "kafka_cpu_usage": {
        "query": "sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_irate{namespace=\"kafka\"}) by (namespace)"
    },
    "kafka_memory_usage": {
        "query": "sum(container_memory_rss{job=\"kubelet\", metrics_path=\"/metrics/cadvisor\", cluster=\"\", container!=\"\", namespace=\"kafka\"}) by (namespace)"
    },
    "postgres_cpu_usage": {
        "query": "sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_irate{cluster=\"\"}) by (postgresql)"
    },
    "kafka_messages_read_in_five_min": {
        "query": "sum(rate(kafka_topic_partition_current_offset{topic!=\"__consumer_offsets\"}[5m])) by (topic)"
    },
    "kafka_messages_consume_in_five_min": {
        "query": "sum(rate(kafka_consumergroup_current_offset{topic!=\"__consumer_offsets\"}[5m])) by (topic)"
    },
    "kafka_total_in_messages": {
        "query": "sum(rate(kafka_topic_partition_current_offset{topic!=\"__consumer_offsets\"}[5m])) by (topic)"
    },
    "kafka_total_out_messages": {
        "query": "sum(rate(kafka_consumergroup_current_offset{topic!=\"__consumer_offsets\"}[5m])) by (topic)"
    },
    "postgres_memory_usage": {
        "query": "sum(container_memory_rss{job=\"kubelet\", metrics_path=\"/metrics/cadvisor\", cluster=\"\", container!=\"\", namespace=\"postgresql\"}) by (namespace)"
    },
    "kafka_partitions_per_topic": {
        "query": "sum by(topic) (kafka_topic_partitions{instance=\"10.10.1.149:9308\",topic=~\"(dev\\.denorm|dev\\.denorm\\.failed|dev\\.druid\\.events\\.summary|dev\\.druid\\.events\\.telemetry|dev\\.duplicate|dev\\.extractor\\.duplicate|dev\\.extractor\\.failed|dev\\.failed|dev\\.ingest|dev\\.invalid|dev\\.raw|dev\\.stats|dev\\.system\\.events|dev\\.telemetry\\.denorm|dev\\.telemetry\\.duplicate|dev\\.telemetry\\.failed|dev\\.transform|dev\\.unique|local\\.ingest|obs20-events)\"})"
    },
    "druid_memory_usage": {
        "query": "sum(container_memory_rss{job=\"kubelet\", metrics_path=\"/metrics/cadvisor\", cluster=\"\", container!=\"\", namespace=\"druid-raw\"}) by (namespace)"
    },
    "postgres_fds": {
        "query": "process_max_fds{namespace=\"postgresql\"}"
    },
    "instance_memory": {
        "query": "(1 - sum(:node_memory_MemAvailable_bytes:sum{cluster=\"\"}) / sum(node_memory_MemTotal_bytes{job=\"node-exporter\",cluster=\"\"})) * 100"
    },
    "instance_cpu": {
        "query": '(cluster:node_cpu:ratio_rate5m{cluster=""}) * 100'
    },
    "instance_disk": {
        "query": "(1 - (sum(node_filesystem_free_bytes) / sum(node_filesystem_size_bytes))) * 100"
    },
    "disk_usage_radial": {
        "query": "100 - ((node_filesystem_free_bytes{mountpoint=\"/\"} / node_filesystem_size_bytes{mountpoint=\"/\"}) * 100)"
    },
    "cpu_usage_radial": {
        "query": "cluster:node_cpu:ratio_rate5m{cluster=\"\"}"
    },
    "memory_usage_radial": {
        "query": "1 - sum(:node_memory_MemAvailable_bytes:sum{cluster=\"\"}) / sum(node_memory_MemTotal_bytes{job=\"node-exporter\",cluster=\"\"})"
    },
    "cluster_total_nodes_count": {
        "query": "count(kube_node_info)"
    },
    "cluster_running_nodes_count": {
        "query": 'count(kube_node_status_condition{condition="Ready",status="true"})'
    },
    "totalCpuCores": {
        "query": 'count(node_cpu_seconds_total{mode="idle"}) without (cpu,mode)'
    },
    "throughput": {
        "query": 'sum(rate(container_network_receive_bytes_total{namespace="obsrv-api-service-dev"}[1m])) + sum(rate(container_network_transmit_bytes_total{namespace="obsrv-api-service-dev"}[1m]))'
    }
}