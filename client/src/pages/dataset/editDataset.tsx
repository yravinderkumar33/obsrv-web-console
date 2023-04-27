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
import { useSearchParams } from 'react-router-dom';

const EditDataset = (props: any) => {
    const dispatch = useDispatch();
    const params = useParams();
    const { datasetId } = params;
    const [searchParams] = useSearchParams();
    const master = searchParams.get("master") || "false";
    const status = searchParams.get("status") || "DRAFT";
    const navigate = useNavigate();

    const restoreClientState = (restoreData: any) => {
        dispatch(restore(restoreData));
    }

    const fetchDatasetDetails = async () => {
        try {
            const response = await datasetRead({ datasetId, config: { params: { status } } });
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
                <NewDatasetOnboardingWizard edit={true} master={master == "true"} />
            </Grid>
        </Grid>
    )
};

export default EditDataset;
