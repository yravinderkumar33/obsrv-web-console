import { useState } from 'react';
import { FormHelperText, Grid, Stack } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import UploadMultiFile from 'components/third-party/dropzone/MultiFile';
import AnimateButton from 'components/@extended/AnimateButton';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { IWizard } from 'types/formWizard';
import * as _ from 'lodash';
import { addState, reset, updateState } from 'store/reducers/wizard';
import { fetchJsonSchemaThunk } from 'store/middlewares';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PasteData from './PasteData';
import { readJsonFileContents } from 'services/utils';
import { pageMeta as datasetConfigPageMeta } from './DatasetConfiguration'
import { error } from 'services/toaster';

const pageMeta = { pageId: 'uploadSampleData', title: "Upload Sample Events" };
const tabProps = (index: number) => ({ id: `tab-${index}`, 'aria-controls': `tabpanel-${index}` });

function TabPanel(props: any) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const UploadFiles = ({ handleNext, setErrorIndex, handleBack, index }: any) => {
    const dispatch = useDispatch();
    const wizardState: IWizard = useSelector((state: any) => state?.wizard);
    const pageData = _.get(wizardState, ['pages', pageMeta.pageId]);
    const datasetConfiguration = _.get(wizardState, ['pages', datasetConfigPageMeta.pageId]);
    const [tabIndex, setTabIndex] = useState(0);
    const [editorData, setEditorData] = useState(pageData?.state?.data);
    const [files, setFiles] = useState(pageData?.state?.files || null);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const form = {
        initialState: { files },
        onSubmit(values: any) {
            if (!pageData?.state?.data || !pageData?.state.files) {
                dispatch(error({ message: 'Please upload sample events' }));
                setErrorIndex(index);
            } else {
                handleNext();
            }
        }
    }

    const onUpload = async (files: any) => {
        try {
            const contents = await Promise.all(files.map((file: File) => readJsonFileContents(file)));
            resetState();
            dispatch(addState({ id: pageMeta.pageId, index, state: { files } }));
            uploadData(_.flatten(contents));
        } catch (err: any) {
            err?.message && dispatch(error({ message: err?.message }));
            (typeof err === 'string') && dispatch(error({ message: err }));
            setErrorIndex(index);
        }
    }

    const uploadData = (data: any, reset = false) => {
        const dataset = _.get(datasetConfiguration, 'state.name');
        if (reset) resetState();
        dispatch(fetchJsonSchemaThunk({ data: Array.isArray(data) ? data : [data], config: { dataset } }));
        dispatch(updateState({ id: pageMeta.pageId, index, state: { data } }));
        handleNext();
    }

    const onDataPaste = (event: any) => {
        const { error: err, jsObject } = event || {};
        if (err) {
            err?.reason && dispatch(error({ message: err?.reason }));
            setErrorIndex(index);
        } else {
            setErrorIndex(null);
        }
        setEditorData(jsObject);
    }

    const resetState = () => {
        dispatch(reset({ omit: ['datasetConfiguration'] }));
    }

    const onFileRemove = (files: any) => {
        resetState();
        setFiles(files);
    }

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={tabIndex} onChange={handleTabChange} centered>
                                <Tab label="Upload/Drop File" {...tabProps(0)} />
                                <Tab label="Paste/Edit Data" {...tabProps(1)} />
                            </Tabs>
                        </Box>
                        <TabPanel value={tabIndex} index={0}>
                            <Formik
                                initialValues={form.initialState}
                                onSubmit={(values: any) => {
                                    form.onSubmit(values);
                                }}
                                validationSchema={yup.object().shape({
                                    files: yup.mixed().required('File is a required.')
                                })}
                            >
                                {({ values, handleSubmit, setFieldValue, touched, errors }) => (
                                    <form onSubmit={handleSubmit}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <Stack spacing={1.5} alignItems="center">
                                                    <UploadMultiFile
                                                        showList={false}
                                                        setFieldValue={setFieldValue}
                                                        files={values.files}
                                                        error={touched.files && !!errors.files}
                                                        onUpload={() => onUpload(values.files)}
                                                        onFileRemove={onFileRemove}
                                                    />
                                                    {touched.files && errors.files && (
                                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                                            {errors.files}
                                                        </FormHelperText>
                                                    )}
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </form>
                                )}
                            </Formik>
                        </TabPanel>
                        <TabPanel value={tabIndex} index={1}>
                            <PasteData initialData={editorData} onChange={onDataPaste}></PasteData>
                            <Stack direction="row" justifyContent="center"
                                alignItems="center" spacing={1.5} sx={{ mt: 1.5 }}>
                                <Button size="small" variant="contained" onClick={_ => {
                                    resetState();
                                    setEditorData(null);
                                }}>
                                    Remove Data
                                </Button>
                                <Button size="small" disabled={!!editorData === false} variant="contained" onClick={_ => uploadData(editorData, true)}>
                                    Upload Data
                                </Button>
                            </Stack>
                        </TabPanel>
                    </Box>

                </Grid>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-between">
                        <AnimateButton>
                            <Button variant="contained" sx={{ my: 3, ml: 1 }} type="button" onClick={handleBack}>
                                Previous
                            </Button>
                        </AnimateButton>
                        <AnimateButton>
                            <Button variant="contained" sx={{ my: 3, ml: 1 }} type="button" onClick={form.onSubmit}>
                                Next
                            </Button>
                        </AnimateButton>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
};

export default UploadFiles;