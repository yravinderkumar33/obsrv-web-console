import { Button, Grid, TextField, Typography, Box } from '@mui/material';
import * as yup from 'yup';
import * as _ from 'lodash'
import AnimateButton from 'components/@extended/AnimateButton';
import { useDispatch, useSelector } from 'react-redux';
import { addState, reset, updateState } from 'store/reducers/wizard';
import { IWizard } from 'types/formWizard';
import UploadFiles from './UploadFiles';
import { useState } from 'react';
import { error } from 'services/toaster';
import { Formik, Form } from 'formik';
import { generateSlug } from 'utils/stringUtils';
import HtmlTooltip from 'components/HtmlTooltip';
import { checkUniqueId, getUrls, uploadToUrl, createDraftDataset } from 'services/dataset';
import { fetchJsonSchema } from 'services/json-schema';
import FilesPreview from 'components/third-party/dropzone/FilesPreview';
import { CardTitle, GenericCard } from 'components/styled/Cards';
import { interactIds } from 'data/telemetry/interactIds';

const idCheck = async (value: any, resolve: any) => {
    const data = await checkUniqueId(value);
    if (data?.data?.responseCode === 'OK' && data?.data?.result?.isUnique)
        resolve(true);
    resolve(false);
};

const validationDebounced = _.debounce(idCheck, 1000);

const validationSchema = yup.object()
    .shape({
        name: yup.string().required('Dataset Name is required')
            .min(4, 'Minimum of 4 characters are required').max(30, 'Maximum of 30 characters are allowed'),
        dataset_id: yup.string().required('Dataset ID is Required')
            .min(4, 'Minimum of 4 characters are required')
            .max(30, 'Maximum of 30 characters are allowed')
            .test('checkDuplID', 'ID is already taken', async (value: any) =>
                new Promise(resolve => validationDebounced(value, resolve))
            )
    });

export const pageMeta = { pageId: 'datasetConfiguration' };
export const s3Urls = { pageId: 'cloudFiles' };

const DatasetConfiguration = ({ setShowWizard, datasetType }: any) => {
    const dispatch = useDispatch();
    const wizardState: IWizard = useSelector((state: any) => state?.wizard);
    const maxFileSizeConfig: Number = useSelector((state: any) => state?.config?.maxFileSize || 5242880)
    const pageData = _.get(wizardState, ['pages', pageMeta.pageId]);
    const { data: dataState, files: filesState, config: configState } = pageData?.state || {};
    const [data, setData] = useState(dataState);
    const [files, setFiles] = useState(filesState);
    const initialValues = pageData?.state?.config || { name: '', dataset_id: '' };



    const generateJSONSchema = async (data: Array<any>, config: Record<string, any>) => {
        const dataset = _.get(config, 'name');
        const payload = Array.isArray(data) ? data : [data]
        try {
            const response = await fetchJsonSchema({ data: payload, config: { dataset } });
            dispatch(addState({ id: "jsonSchema", ...response }));
            return response;
        } catch (err) {
            dispatch(error({ message: "Failed to Upload Data" }));
            throw err;
        }
    };

    const createDraft = async (config: Record<string, any>) => {
        try {
            const payload = { ...config, type: datasetType, version: 1, status: "DRAFT" };
            const data = await createDraftDataset({ data: payload });
            const dataset_id = _.get(data, 'data.result.dataset_id');
            if (dataset_id) {
                dispatch(updateState({ id: pageMeta.pageId, state: { masterId: dataset_id } }));
            }
            return data;
        } catch (err: any) {
            throw err;
        }
    }

    const uploadFiles = async (files: any) => {
        try {
            const uploadUrl = await getUrls(files);
            if (uploadUrl.data && uploadUrl.data?.result) {
                _.map(uploadUrl.data.result, (item, index) => {
                    uploadToUrl(item.presignedURL, files[index])
                });
            }
        } catch (err) {
            throw err;
        }
    }

    const onSubmit = async (config: any) => {
        if ((data || files) && config) {
            try {
                // await uploadFiles(files);
                await generateJSONSchema(data, config);
                dispatch(addState({ id: pageMeta.pageId, state: { data, files, config, datasetType } }));
                await createDraft(config);
                setShowWizard(true);
            } catch (err) {
                dispatch(error({ message: "Failed to upload schema" }));
            }
        } else {
            dispatch(error({ message: "Please fill the required fields" }));
        }
    }

    const handleNameChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        fieldUpdate: (field: string, value: any, shouldValidate?: boolean | undefined) => void,
        slugName: string,
        fieldName: string
    ) => {
        fieldUpdate(fieldName, e.target.value);
        fieldUpdate(slugName, generateSlug(e.target.value));
    }

    const resetState = () => {
        dispatch(reset({ omit: ['datasetConfiguration'] }));
    }

    const onFileRemove = (file: File | string) => {
        const filteredItems = files && files.filter((_file: any) => _file !== file);
        resetState();
        setFiles(filteredItems);
    };

    const onRemoveAll = () => {
        setFiles(null);
    };

    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={12} sm={12}>
                    <Formik
                        initialValues={configState || initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                        enableReinitialize
                    >
                        {({ setFieldValue, touched, errors, values, handleBlur, handleChange }) => (
                            <Form>
                                <GenericCard elevation={1}>
                                    <CardTitle>Basic Details</CardTitle>
                                    <Grid container spacing={3} justifyContent="center"
                                        alignItems="baseline" display="flex">
                                        <Grid item xs={12} sm={6} lg={6}>
                                            <HtmlTooltip title="Name of the dataset" arrow placement='top-start'>
                                                <TextField
                                                    data-edataid={interactIds.dataset.view}
                                                    data-objectid={values.name}
                                                    data-objecttype="datasetCreate"
                                                    name={'name'}
                                                    label={'Dataset Name'}
                                                    onBlur={handleBlur}
                                                    onChange={(
                                                        e: React.ChangeEvent<HTMLInputElement>) =>
                                                        handleNameChange(e, setFieldValue, 'dataset_id', 'name')
                                                    }
                                                    required
                                                    value={values.name}
                                                    variant="outlined"
                                                    fullWidth
                                                    error={Boolean(errors.name)}
                                                    helperText={touched.name && errors.name && String(errors.name)}
                                                />
                                            </HtmlTooltip>
                                        </Grid>
                                        <Grid item xs={12} sm={6} lg={6}>
                                            <HtmlTooltip title="ID for the dataset - for querying" arrow placement='top-start'>
                                                <TextField
                                                    data-edataid={interactIds.dataset.view}
                                                    data-objectid={values.dataset_id}
                                                    data-objecttype="dataset"
                                                    name={'dataset_id'}
                                                    label={'Dataset ID'}
                                                    onBlur={handleBlur}
                                                    onChange={(
                                                        e: React.ChangeEvent<HTMLInputElement>) =>
                                                        handleChange(e)
                                                    }
                                                    required
                                                    value={values.dataset_id}
                                                    variant="outlined"
                                                    fullWidth
                                                    error={Boolean(errors.dataset_id)}
                                                    helperText={touched.dataset_id && errors.dataset_id && String(errors.dataset_id)}
                                                />
                                            </HtmlTooltip>
                                        </Grid>
                                    </Grid>
                                </GenericCard>
                                <GenericCard elevation={1}>
                                    <CardTitle>Upload Data/Schema</CardTitle>
                                    <Grid container spacing={3} justifyContent="center" alignItems="center">
                                        <Grid item xs={12}>
                                            <UploadFiles data={data} setData={setData} files={files} setFiles={setFiles} maxFileSize={maxFileSizeConfig} allowSchema />
                                        </Grid>
                                    </Grid>
                                </GenericCard>
                                {files && files.length > 0 &&
                                    <GenericCard elevation={1}>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="h5" gutterBottom>Files Uploaded</Typography>
                                            <Button 
                                            data-edataid={interactIds.dataset.view}
                                            data-objectid="removeDataset"
                                            data-objecttype="dataset"
                                            onClick={onRemoveAll}>Remove all</Button>
                                        </Box>
                                        <FilesPreview files={files} showList={false} onRemove={onFileRemove} />
                                    </GenericCard>
                                }
                                <Box display="flex" justifyContent="flex-end">
                                    <AnimateButton>
                                        <Button 
                                        data-edataid={interactIds.dataset.view}
                                        data-objectid="createSchema"
                                        data-objecttype="dataset"
                                        disabled={!(files || data)} variant="contained" sx={{ my: 2, ml: 1 }} type="submit">
                                            Create Schema
                                        </Button>
                                    </AnimateButton>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Grid>
            </Grid>
        </>
    );
};

export default DatasetConfiguration;
