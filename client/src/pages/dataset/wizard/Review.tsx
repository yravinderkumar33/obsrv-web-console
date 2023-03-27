import * as _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { publishDataset } from 'services/dataset';
import { error } from 'services/toaster';
import { fetchDatasetsThunk } from 'store/middlewares';
import { useNavigate } from 'react-router';
import JSONata from 'jsonata';
import AnimateButton from 'components/@extended/AnimateButton';
import { useEffect, useState } from 'react';
import ReactDiffViewer from "react-diff-viewer";

const Final = ({ handleNext, handleBack, index }: any) => {
    const wizardState: any = useSelector((state: any) => state?.wizard);
    const jsonSchema: any = useSelector((state: any) => state?.jsonSchema);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [previewJson, setPreviewJson] = useState<any>(null);
    const [noTransform, setNoTransform] = useState<string>('');

    const publish = async () => {
        if (jsonSchema?.status === 'success') {
            const originalSchema = jsonSchema?.data;
            try {
                await publishDataset(originalSchema, wizardState);
                dispatch(fetchDatasetsThunk({}));
                navigate('/datasets');
            } catch (err) {
                dispatch(error({ message: 'Something went wrong. Please try again later.' }));
            }
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
        } else setNoTransform('No sample data provided for transformations')
    }

    useEffect(() => {
        preview();
    }, []);

    return (
        <>
            <Grid container spacing={1}>
                {noTransform && <Grid item xs={12}>
                    <Typography variant="h5">{noTransform}</Typography>
                </Grid>}
                <Grid item xs={12}>
                    {previewJson &&
                        <ReactDiffViewer
                            oldValue={JSON.stringify(wizardState.pages.datasetConfiguration.state.data[0], null, 2)}
                            newValue={JSON.stringify(previewJson, null, 2)}
                            splitView={true}
                        />
                    }
                </Grid>
                <Grid item xs={4}>
                    <Button variant="contained" onClick={publish}>Save Dataset</Button>
                </Grid>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-between">
                        <AnimateButton>
                            <Button variant="contained" sx={{ my: 3, ml: 1 }} type="button" onClick={handleBack}>
                                Previous
                            </Button>
                        </AnimateButton>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
};

export default Final;
