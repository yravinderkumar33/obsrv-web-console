import {
    Grid
} from '@mui/material';
import Loader from 'components/Loader';
import FilteringTable from 'pages/tables/filtering';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataThunk } from 'store/middlewares';

const ClusterHealth = () => {

    const dataset = useSelector((state: any) => state.dataset)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchDataThunk({}))
    }, [])

    return (
        <Grid container rowSpacing={4.5} columnSpacing={3}>
            <Grid item xs={12}>
                {dataset?.status !== 'success' && <Loader />}
                {dataset?.status === 'success' && <FilteringTable></FilteringTable>}
            </Grid>
        </Grid>
    )
};

export default ClusterHealth;
