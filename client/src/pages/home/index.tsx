import { AreaChartOutlined, FallOutlined, FileProtectOutlined } from '@ant-design/icons';
import {
    Grid, useTheme
} from '@mui/material';
import MainCard from 'components/MainCard';
import ClusterHealth from '../dashboard/datasets';
import Metrics from '../metrics/metrics';
import MetricsTabs from '../metrics/metricsAsTabs'

const MetricsDashboard = () => {
    const theme = useTheme();
    return (
        <>
            {/* <MainCard title="Metrics"> */}
            {/* <Metrics /> */}
            <MetricsTabs />
            {/* </MainCard > */}
            {/* <ClusterHealth></ClusterHealth> */}
        </>
    )
};

export default MetricsDashboard;