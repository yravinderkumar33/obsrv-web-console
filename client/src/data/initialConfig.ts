
import * as _ from 'lodash';

export default {
    showClusterMenu: false,
    clusterMenu: { frequency: 100, interval: 10 },
    elevation: 2,
    severityToColorMapping: {
        "HIGH": {
            "color": "error"
        },
        "CRITICAL": {
            "color": "error"
        },
        "LOW": {
            "color": "info"
        },
        "MEDIUM": {
            "color": "warning"
        }
    },
    maxFileSize: 5242880,
}
