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
    const [loading, setLoading] = useState(false);

    const [draftDatasets, setDraftDatasets] = useState([]);
    const [liveDatasets, setLiveDatasets] = useState([]);

    const getDatasets = async () => {
        setLoading(true);
        const [draft = [], live = []] = await Promise.all([fetchDatasets({ data: { filters: { status: ['DRAFT', 'READY_FOR_PUBLISH'] } } }), fetchDatasets({ data: { filters: { status: ['ACTIVE', 'DISABLED'] } } })])
        setDraftDatasets(draft)
        setLiveDatasets(live);
        setLoading(false);
    }

    useEffect(() => {
        getDatasets();
        if (dataset?.status !== 'success') dispatch(fetchDatasetsThunk({ data: { filters: {} } }));
    }, [])

    const renderNoDatasetsMessage = (message: string) => <Grid item xs={12}>
        {showNoDatasetsError(message)}
    </Grid>

    const renderDatasets = (status: string) => {
        switch (status) {
            case 'live': return <Grid item xs={12}>
                <DatasetsList datasets={liveDatasets} />
            </Grid>

            case 'draft': return <Grid item xs={12}>
                <DraftDatasetsList datasets={draftDatasets} />
            </Grid>

            default: renderNoDatasetsMessage("No Datasets");
        }
    }

    return (
        <Grid container rowSpacing={2} columnSpacing={2}>
            {loading && <Loader />}
            {!loading && (liveDatasets?.length == 0 ? renderNoDatasetsMessage("No Live Datasets") : renderDatasets("live"))}
            {!loading && (draftDatasets?.length == 0 ? renderNoDatasetsMessage("No Draft Datasets") : renderDatasets("draft"))}
        </Grid>
    )
};

export default ClusterHealth;
