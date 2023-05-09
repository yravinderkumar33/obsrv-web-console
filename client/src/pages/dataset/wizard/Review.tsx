import * as _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux';
import {
    Button, Box, Grid, Stack, Typography
} from '@mui/material';
import { publishDataset } from 'services/dataset';
import { error, success } from 'services/toaster';
import { fetchDatasetsThunk } from 'store/middlewares';
import { useNavigate } from 'react-router';
import AnimateButton from 'components/@extended/AnimateButton';
import ReviewSections from './components/ReviewSections';
import IconButtonWithTips from 'components/IconButtonWithTips';
import { DownloadOutlined } from '@ant-design/icons';
import { updateJSONSchema } from 'services/json-schema';
import { downloadJsonFile } from 'utils/downloadUtils';
import interactIds  from 'data/telemetry/interact.json';

import useImpression from 'hooks/useImpression';
import pageIds from 'data/telemetry/pageIds';

const Final = ({ handleBack, master, edit }: any) => {
    const storeState: any = useSelector((state: any) => state);
    const wizardState: any = useSelector((state: any) => state?.wizard);
    const jsonSchema = _.get(wizardState, 'pages.jsonSchema.schema');
    const flattenedData = _.get(wizardState, ['pages', 'columns', 'state', 'schema']);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const pageIdPrefix = _.get(pageIds, [master ? 'masterdataset' : 'dataset', edit ? 'edit' : 'create']);;
    useImpression({ type: "view", pageid: `${pageIdPrefix}:review` });

    const handleDownloadButton = () => {
        if (jsonSchema && flattenedData) {
            const data = updateJSONSchema(jsonSchema, flattenedData);
            downloadJsonFile(data, 'json-schema');
        }
    }

    const publish = async () => {
        try {
            await publishDataset(wizardState, storeState, master);
            dispatch(fetchDatasetsThunk({}));
            dispatch(success({ message: 'Dataset Saved.' }));
            navigate('/datasets');
        } catch (err) {
            dispatch(error({ message: 'Save Dataset Failed. Please try again later.' }));
        }
    }

    const gotoPreviousSection = () => handleBack();

    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4">
                    Review
                </Typography>
                <IconButtonWithTips
                    data-edataid={`${master ? 'masterDataset': 'dataset'}:${interactIds.download_JSON}`}
                    data-objectid="downloadSchema"
                    data-objecttype={master ? 'masterDataset' : 'dataset'}
                    tooltipText="Download Schema"
                    icon={<DownloadOutlined style={{ fontSize: '1.25rem' }} />}
                    handleClick={handleDownloadButton}
                    buttonProps={{ size: "large", sx: { color: "#000" } }}
                    tooltipProps={{ arrow: true }}
                />
            </Box>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <ReviewSections section="wizard" master={master} />
                </Grid>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-between">
                        <AnimateButton>
                            <Button
                                data-edataid={`${master ? 'masterDataset' : 'dataset'}:review:${edit ? 'edit' : 'create'}`}
                                data-objectid="previous"
                                data-objecttype={master ? 'masterDataset' : 'dataset'}
                                variant="contained" sx={{ my: 1, ml: 1 }} type="button" onClick={gotoPreviousSection}>
                                Previous
                            </Button>
                        </AnimateButton>
                        <AnimateButton>
                            <Button
                                data-edataid={`${master ? 'masterDataset' : 'dataset'}:review:${edit ? 'edit' : 'create'}`}
                                data-objectid="saveDataset"
                                data-objecttype={master ? 'masterDataset' : 'dataset'}
                                variant="contained" sx={{ my: 1, ml: 1 }} type="button" onClick={publish}>
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
