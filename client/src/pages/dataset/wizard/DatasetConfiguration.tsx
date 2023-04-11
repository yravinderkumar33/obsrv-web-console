import { Button, Grid, Stack, TextField } from '@mui/material';
import * as yup from 'yup';
import * as _ from 'lodash'
import AnimateButton from 'components/@extended/AnimateButton';
import { useDispatch, useSelector } from 'react-redux';
import { addState } from 'store/reducers/wizard';
import { IWizard } from 'types/formWizard';
import UploadFiles from './UploadFiles';
import { useEffect, useState } from 'react';
import { error } from 'services/toaster';
import { Formik, Form } from 'formik';
import { generateSlug } from 'utils/stringUtils';
import HtmlTooltip from 'components/HtmlTooltip';
import { checkUniqueId, createDraftDataset } from 'services/dataset';
import { fetchJsonSchema } from 'services/json-schema';

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
        id: yup.string().required('Dataset ID is Required')
            .min(4, 'Minimum of 4 characters are required')
            .max(30, 'Maximum of 30 characters are allowed')
            .test('checkDuplID', 'ID is already taken', async (value: any) =>
                new Promise(resolve => validationDebounced(value, resolve))
            )
    });

export const pageMeta = { pageId: 'datasetConfiguration' };

const DatasetConfiguration = ({ setShowWizard, datasetType }: any) => {
    const dispatch = useDispatch();
    const wizardState: IWizard = useSelector((state: any) => state?.wizard);
    const maxFileSizeConfig: Number = useSelector((state: any) => state?.config?.maxFileSize || 5242880)
    const pageData = _.get(wizardState, ['pages', pageMeta.pageId]);
    const { data: dataState, files: filesState, config: configState } = pageData?.state || {};
    const [data, setData] = useState(dataState);
    const [files, setFiles] = useState(filesState);
    const [initialValues, setInitialValues] = useState({ name: '', id: '' });

    useEffect(() => {
        if (pageData?.state?.config) {
            setInitialValues({ ...pageData.state.config })
        }
    }, [wizardState]);

    const generateJSONSchema = async (data: Array<any>, config: Record<string, any>) => {
        const dataset = _.get(config, 'name');
        const payload = Array.isArray(data) ? data : [data]
        try {
            const response = await fetchJsonSchema({ data: payload, config: { dataset } });
            dispatch(addState({ id: "jsonSchema", ...response }));
        } catch (err) {
            dispatch(error({ message: "Failed to Upload Data" }));
        }
    };

    const createDraft = async (config: Record<string, any>) => {
        try {
            const payload = { ...config, type: datasetType, version: 1, status: "DRAFT" };
            await createDraftDataset({ data: payload });
            setShowWizard(true);
        } catch (err: any) {
            dispatch(error({ message: "Failed to create dataset. Please try again later." }));
        }
    }

    const onSubmit = (config: any) => {
        if ((data || files) && config) {
            generateJSONSchema(data, config);
            createDraft(config);
            dispatch(addState({ id: pageMeta.pageId, state: { data, files, config } }));
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
                                <Grid container spacing={3} justifyContent="center"
                                    alignItems="baseline" display="flex">
                                    <Grid item xs={12} sm={6} lg={6}>
                                        <HtmlTooltip title="Name of the dataset" arrow placement='top-start'>
                                            <TextField
                                                name={'name'}
                                                label={'Dataset Name'}
                                                onBlur={handleBlur}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>) =>
                                                    handleNameChange(e, setFieldValue, 'id', 'name')
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
                                                name={'id'}
                                                label={'Dataset ID'}
                                                onBlur={handleBlur}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>) =>
                                                    handleChange(e)
                                                }
                                                required
                                                value={values.id}
                                                variant="outlined"
                                                fullWidth
                                                error={Boolean(errors.id)}
                                                helperText={touched.id && errors.id && String(errors.id)}
                                            />
                                        </HtmlTooltip>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3} justifyContent="center" alignItems="center">
                                    <Grid item xs={12}>
                                        <UploadFiles data={data} setData={setData} files={files} setFiles={setFiles} maxFileSize={maxFileSizeConfig} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack direction="row" justifyContent="flex-end">
                                            <AnimateButton>
                                                <Button disabled={!(files || data)} variant="contained" sx={{ my: 1, ml: 1 }} type="submit">
                                                    Next
                                                </Button>
                                            </AnimateButton>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </Grid>
            </Grid>
        </>
    );
};

export default DatasetConfiguration;
