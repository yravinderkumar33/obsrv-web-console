import { QuestionCircleFilled } from '@ant-design/icons';
import { Alert, Grid, Button } from '@mui/material';
import MainCard from 'components/MainCard';
import { interactIds } from 'data/telemetry/interactIds';
import UploadFiles from 'pages/dataset/wizard/UploadFiles';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { sendEvents } from 'services/dataset';
import { error, success } from 'services/toaster';

const DatasetCreateEvents = () => {
    const dataset = useSelector((state: any) => state.dataset);
    const [data, setData] = useState<any>();
    const [files, setFiles] = useState();
    const dispatch = useDispatch();
    const params = useParams();

    const pushEvents = async () => {
        try {
            const { datasetId, datasetName } = params;
            const [firstEvent] = data || [];
            if (firstEvent) {
                await sendEvents(datasetName, firstEvent);
                dispatch(success({ message: 'Events pushed successfully.' }));
                return;
            }
            dispatch(error({ message: 'No data to push' }));
        } catch (err) {
            dispatch(error({ message: 'Failed to push events. Please try again later' }))
        }
    }

    return <>
        <MainCard title={`Add Events to Dataset`}>
            <Grid container spacing={1}>
                <Grid item xs={12} sm={12}>
                    <Alert color="info" icon={<QuestionCircleFilled />}>
                        Submit your events to the Datasource by uploading a JSON file or editing JSON data.
                    </Alert>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <UploadFiles data={data} setData={setData} files={files} setFiles={setFiles}></ UploadFiles>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Button
                    data-edataid={interactIds.events.create}
                    data-objectid="sendEvents"
                    data-objecttype="dataset"
                    disabled={!data} variant="contained" onClick={(e: any) => pushEvents()}>Send Events</Button>
                </Grid>
            </Grid>
        </MainCard >

    </>
};

export default DatasetCreateEvents;
