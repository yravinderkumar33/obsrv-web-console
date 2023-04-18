import { useEffect } from 'react';
import MetricsTabs from '../metrics'
import { useDispatch } from 'react-redux';
import { fetchAlertsThunk } from 'store/middlewares';

const HomePage = () => {
    const dispatch = useDispatch();
    const fetchAlerts = () => dispatch(fetchAlertsThunk({}));

    useEffect(() => {
        fetchAlerts();
    }, []);

    return <MetricsTabs />
};

export default HomePage;