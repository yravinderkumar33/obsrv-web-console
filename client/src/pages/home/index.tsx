import { AreaChartOutlined, FallOutlined, FileProtectOutlined } from '@ant-design/icons';
import {
    Grid, useTheme
} from '@mui/material';
import MainCard from 'components/MainCard';
import ClusterHealth from '../dashboard/datasets';
import Metrics from '../metrics/metrics';
import MetricsTabs from '../metrics/metricsAsTabs'
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

const MetricsDashboard = () => {
    const theme = useTheme();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(()=>{
        const code = searchParams.get("code") as string
        if(code) {
            sessionStorage.setItem("authorization_code", code)
        }
    },[])

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