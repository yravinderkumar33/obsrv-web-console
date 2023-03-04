import { Grid } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { datasetRead } from 'services/dataset';
import { error } from 'services/toaster';
import * as _ from 'lodash';

const DatasetDetails = () => {
    const dataset = useSelector((state: any) => state.dataset)
    const dispatch = useDispatch();
    const params = useParams();
    const [datasetDetails, setDatasetDetails] = useState({ data: null, status: "loading" });

    const fetchDataset = async () => {
        const { datasetId } = params;
        try {
            const response = await datasetRead({ datasetId })
            setDatasetDetails({ data: response.data, status: 'success' })
        } catch (err) {
            dispatch(error({ message: 'Read Dataset Failed' }));
            setDatasetDetails({ data: null, status: 'failed' })
        }
    }

    useEffect(() => {
        fetchDataset();
    }, [])


    return <>
        <MainCard title={`Dataset Metrics (${_.get(datasetDetails, 'data.dataset_name')})`}>
            <Grid container spacing={1}>
                <Grid item xs={12} sm={12}>

                </Grid>
            </Grid>
        </MainCard >
    </>
};

export default DatasetDetails;
