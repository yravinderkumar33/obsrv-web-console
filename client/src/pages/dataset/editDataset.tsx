import {
    Grid
} from '@mui/material';
import NewDatasetOnboardingWizard from './wizard';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { useEffect } from 'react';
import { datasetRead } from 'services/dataset';
import * as _ from 'lodash';
import { restore } from 'store/reducers/wizard';
import { error } from 'services/toaster';

const EditDataset = ({ master = false }) => {
    const dispatch = useDispatch();
    const params = useParams();
    const { datasetId } = params;
    const navigate = useNavigate();

    const restoreClientState = (restoreData: any) => {
        dispatch(restore(restoreData));
    }

    const fetchDatasetDetails = async () => {
        try {
            const response = await datasetRead({ datasetId });
            const clientState = _.get(response, 'data.result.client_state');
            restoreClientState(clientState);
        } catch (err) {
            dispatch(error({ message: 'Dataset does not exists' }));
            navigate('/');
        }
    }

    useEffect(() => {
        fetchDatasetDetails();
    }, [datasetId]);

    return (
        <Grid container rowSpacing={4.5} columnSpacing={3}>
            <Grid item xs={12}>
                <NewDatasetOnboardingWizard edit={true} master={master} />
            </Grid>
        </Grid>
    )
};

export default EditDataset;
