import Loader from 'components/Loader';
import { fetchDatasetsThunk } from 'store/middlewares';
import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { BugFilled } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import AlertMessage from 'components/AlertMessage';
import { fetchDatasets } from 'services/dataset';
import * as _ from 'lodash';
import DatasetsList from './datasetsList';
import DraftDatasetsList from './draftDatasetsList';

const ClusterHealth = () => {
    const dataset = useSelector((state: any) => state.dataset)
    const dispatch = useDispatch();
    const showNoDatasetsError = (message = 'No Datasets Found') => <AlertMessage color='error' messsage={message} icon={BugFilled} />

    const [draftDatasets, setDraftDatasets] = useState([]);
    const [liveDatasets, setLiveDatasets] = useState([]);

    const getDatasets = async () => {
        const [draft, live] = await Promise.all([fetchDatasets({ data: { filters: { status: ['DRAFT', 'READY_FOR_PUBLISH'] } } }), fetchDatasets({ data: { filters: { status: ['ACTIVE', 'DISABLED'] } } })])
        setDraftDatasets(draft)
        setLiveDatasets(live);
    }

    useEffect(() => {
        getDatasets();
        if (dataset?.status !== 'success') dispatch(fetchDatasetsThunk({ data: { filters: {} } }));
    }, [])

    return (
        <Grid container rowSpacing={2} columnSpacing={2}>
            {dataset?.status !== 'success' && <Loader />}

            {dataset?.status === 'success' && liveDatasets?.length == 0 &&
                <Grid item xs={12}>
                    {showNoDatasetsError('No live datasets found')}
                </Grid>
            }

            {dataset?.status === 'success' && liveDatasets?.length > 0 &&
                <Grid item xs={12}>
                    <DatasetsList datasets={liveDatasets} />
                </Grid>
            }

            {dataset?.status === 'success' && draftDatasets?.length == 0 &&
                <Grid item xs={12}>
                    {showNoDatasetsError('No draft datasets found')}
                </Grid>
            }

            {dataset?.status === 'success' && draftDatasets?.length > 0 &&
                <Grid item xs={12}>
                    <DraftDatasetsList datasets={draftDatasets} />
                </Grid>
            }

        </Grid>
    )
};

export default ClusterHealth;
