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
    },
    "node_query_response_time": {
        "query": "node_query_response_time"
    },
    "node_total_api_call": {
        "query": "node_total_api_calls"
    },
    "node_total_failed_api_call": {
        "query": "node_failed_api_calls"
    },
    "node_query_response_time_min": {
        "query": "min_over_time(node_query_response_time[1d])"
    },
    "node_query_response_time_max": {
        "query": "max_over_time(node_query_response_time[1d])"
    },
    "node_query_response_time_avg": {
        "query": "avg_over_time(node_query_response_time[1d])"
    }
}