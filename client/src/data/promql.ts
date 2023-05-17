export default {
    "node_memory": {
        "query": "(1 - sum(:node_memory_MemAvailable_bytes:sum{cluster=\"\"}) / sum(node_memory_MemTotal_bytes{job=\"node-exporter\",cluster=\"\"})) * 100"
    },
    "node_cpu": {
        "query": '(cluster:node_cpu:ratio_rate5m{cluster=""}) * 100'
    },
    "cpu_percentage": {
        "query": 'cluster:node_cpu:ratio_rate5m{cluster=""}'
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
    "druid_health_status": {
        "query": "druid_health_status"
    },
    "instance_memory": {
        "query": "(1 - sum(:node_memory_MemAvailable_bytes:sum{cluster=\"\"}) / sum(node_memory_MemTotal_bytes{job=\"node-exporter\",cluster=\"\"})) * 100"
    },
    "instance_cpu": {
        "query": '(cluster:node_cpu:ratio_rate5m{cluster=""}) * 100'
    },
    "instance_disk": {
        "query": "(sum(kubelet_volume_stats_used_bytes)/ sum(kubelet_volume_stats_capacity_bytes))* 100"
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
    },
    "node_total_api_call": {
        "query": 'sum by (entity)(increase(node_total_api_calls[$interval]))'
    },
    "node_total_failed_api_call": {
        "query": 'sum by (entity)(increase(node_failed_api_calls[$interval]))'
    },
    "node_query_response_time_min": {
        "query": "min_over_time(sum by (job) (node_query_response_time{job='web-console-ext'})[1d:5m])"
    },
    "node_query_response_time_max": {
        "query": "max_over_time(sum by (job) (node_query_response_time{job='web-console-ext'})[$interval:5m])"
    },
    "node_query_response_time_avg": {
        "query": "avg_over_time(sum by (job) (node_query_response_time{job='web-console-ext'})[$interval:5m])"
    },
    "node_query_response_time_avg_timeseries": {
        "query": 'avg_over_time(sum by (entity) (node_query_response_time)[$interval:$res])'
    },
    "data_usage_growth": {
        "query": 'sum by (job) (s3_objects_size_sum_bytes)'
    },
    "deep_storage_total": {
        "query": 'sum(s3_objects_size_sum_bytes)'
    },
    "api_failure_percentage": {
        "query": "((sum_over_time(sum by (job) (node_failed_api_calls)[$interval:30s]) / sum_over_time(sum by (job) (node_total_api_calls)[$interval:30s]))*100)"
    },
    "network_bytes_received": {
        "query": 'sum(irate(container_network_receive_packets_total{job="kubelet", metrics_path="/metrics/cadvisor", cluster="", namespace=~".+"}[$interval])) by (namespace)'
    },
    "backupCount": {
        "query": "velero_backup_total"
    },
    "backupSuccessRate": {
        "query": 'sum(velero_backup_success_total{schedule=~".*"}) / sum(velero_backup_attempt_total{schedule=~".*"})'
    },
    "apiThroughput": {
        "query": 'sum_over_time(sum by (job) (node_total_api_calls{job="web-console-ext"})[$interval:$res]) / avg_over_time(avg by (job) (node_query_response_time{job="web-console-ext"})[$interval:$res])'
    },
    "postgres_backup_files": {
        "query": 's3_objects{job="s3-backups", bucket=~"backups-obsrv-dev-725876873105", prefix=~"postgresql"}'
    },
    "redis_backup_files": {
        "query": 's3_objects{job="s3-backups", bucket=~"backups-obsrv-dev-725876873105", prefix=~"redis"}'
    },
    "postgres_last_backup_time": {
        "query": '(time() - s3_last_modified_object_date{job="s3-backups", bucket=~"backups-obsrv-dev-725876873105", prefix=~"postgresql"})'
    },
    "redis_last_backup_time": {
        "query": '(time() - s3_last_modified_object_date{job="s3-backups", bucket=~"backups-obsrv-dev-725876873105", prefix=~"redis"})'
    },
    "ninty_percentile_query_response_time": {
        "query": 'quantile(0.9, max_over_time(node_query_response_time[1d]))'
    },
    "seventy_percentile_query_response_time": {
        "query": 'quantile(0.7, max_over_time(node_query_response_time[1d]))'
    },
    "ninty_percentile_query_response_time_interval": {
        "query": 'quantile(0.9, max_over_time(node_query_response_time[$interval]))'
    }
}