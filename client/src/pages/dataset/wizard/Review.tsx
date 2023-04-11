import * as _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux';
import {
    Button, Paper, Grid, Stack, Typography,
    Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import { publishDataset } from 'services/dataset';
import { error, success } from 'services/toaster';
import { fetchDatasetsThunk } from 'store/middlewares';
import { useNavigate } from 'react-router';
import JSONata from 'jsonata';
import AnimateButton from 'components/@extended/AnimateButton';
import { useEffect, useState } from 'react';
import ReactDiffViewer from "react-diff-viewer";
import ReactTable from 'components/react-table';
import ReviewSections from './components/ReviewSections';

const Final = ({ handleNext, handleBack, index }: any) => {
    const wizardState: any = useSelector((state: any) => state?.wizard);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [previewJson, setPreviewJson] = useState<any>(null);
    const [noTransform, setNoTransform] = useState<string>('');

    const publish = async () => {
        try {
            await publishDataset(wizardState);
            dispatch(fetchDatasetsThunk({}));
            dispatch(success({ message: 'Dataset Saved.' }));
            navigate('/datasets');
        } catch (err) {
            dispatch(error({ message: 'Save Dataset Failed. Please try again later.' }));
        }
    }

    const preview = async () => {
        let data = _.cloneDeep(wizardState.pages.datasetConfiguration?.state?.data[0]);
        if (data) {
            _.map(wizardState.pages.dataSchemaConfig.state.schema, async (transform) => {
                if (_.has(transform, 'transformation')) {
                    const expression = JSONata(transform.transformation);
                    data[transform.column] = await expression.evaluate(data);
                }
            });
            setPreviewJson(data);
        } else return null;
    }

    const gotoPreviousSection = () => {
        handleBack();
    }

    useEffect(() => {
        preview();
    }, []);

    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <ReviewSections section="wizard" />
                </Grid>
                <Grid item xs={12}>
                    {previewJson &&
                        <ReactDiffViewer
                            oldValue={JSON.stringify(wizardState.pages.datasetConfiguration.state.data[0], null, 2)}
                            newValue={JSON.stringify(previewJson, null, 2)}
                            splitView={true}
                        />
                    }
                </Grid>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-between">
                        <AnimateButton>
                            <Button variant="contained" sx={{ my: 1, ml: 1 }} type="button" onClick={gotoPreviousSection}>
                                Previous
                            </Button>
                        </AnimateButton>
                        <AnimateButton>
                            <Button variant="contained" sx={{ my: 1, ml: 1 }} type="button" onClick={publish}>
                                Save Dataset
                            </Button>
                        </AnimateButton>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
};

export default Final;
