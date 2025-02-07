import { QuestionCircleFilled } from '@ant-design/icons';
import { Alert, Grid, Button } from '@mui/material';
import MainCard from 'components/MainCard';
import UploadFiles from 'pages/dataset/wizard/UploadFiles';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { sendEvents } from 'services/dataset';
import { setConfig } from 'store/reducers/config';
import { error, success } from 'services/toaster';

const DatasetCreateEvents = () => {
    const dataset = useSelector((state: any) => state.dataset);
    const [data, setData] = useState();
    const [files, setFiles] = useState();
    const dispatch = useDispatch();
    const params = useParams();

    useEffect(() => {
        dispatch(setConfig({ key: 'showClusterMenu', value: false }));
        return () => {
            dispatch(setConfig({ key: 'showClusterMenu', value: true }));
        }
    }, [])

    const pushEvents = async () => {
        try {
            const { datasetId, datasetName } = params;
            await sendEvents({ datasetId, datasetName, events: data });
            dispatch(success({ message: 'Events pushed successfully.' }))
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
                    <Button disabled={!data} variant="contained" onClick={(e: any) => pushEvents()}>Send Events</Button>
                </Grid>
            </Grid>
        </MainCard >

    </>
};

export default DatasetCreateEvents;
