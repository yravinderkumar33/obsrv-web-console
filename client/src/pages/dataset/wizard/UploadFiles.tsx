import { useState } from 'react';
import { FormHelperText, Grid, Stack } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import UploadMultiFile from 'components/third-party/dropzone/MultiFile';
import { useDispatch } from 'react-redux';
import * as _ from 'lodash';
import { reset } from 'store/reducers/wizard';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PasteData from './PasteData';
import { readJsonFileContents } from 'services/utils';
import { error, success } from 'services/toaster';
import { interactIds } from 'data/telemetry/interactIds';

const tabProps = (index: number) => ({ id: `tab-${index}`, 'aria-controls': `tabpanel-${index}` });

export function TabPanel(props: any) {
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
                <Box py={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const UploadFiles = ({ data, setData, files, setFiles, maxFileSize, allowSchema = false }: any) => {
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const form = {
        initialState: { files },
        onSubmit(values: any) { }
    }

    const onUpload = async (files: any) => {
        try {
            const contents = await Promise.all(files.map((file: File) => readJsonFileContents(file)));
            resetState();
            setData(_.flatten(contents));
            setFiles(files);
            dispatch(success({ message: 'Files uploaded.' }))
        } catch (err: any) {
            err?.message && dispatch(error({ message: err?.message }));
            (typeof err === 'string') && dispatch(error({ message: err }));
        }
    }

    const onDataPaste = (event: any) => {
        resetState();
        const { error: err, jsObject } = event || {};
        if (err) err?.reason && dispatch(error({ message: err?.reason }));
        setData(jsObject);
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
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Box sx={{ width: '100%' }}>
                        <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
                            <Tab
                                data-edataid={interactIds.schema.upload}
                                data-objectid="uploadJSON"
                                data-objecttype="dataset"
                                label={allowSchema ? "Upload JSON Data/Schema" : "Upload JSON Data"}
                                {...tabProps(0)} />
                            <Tab
                                data-edataid={interactIds.schema.edit}
                                data-objectid="editJSON"
                                data-objecttype="dataset"
                                label={allowSchema ? "Paste/Edit JSON Data/Schema" : "Paste/Edit JSON Data"}
                                {...tabProps(1)} />
                        </Tabs>
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
                                {({ values, handleSubmit, setFieldValue, touched, errors }: any) => (
                                    <form onSubmit={handleSubmit}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <Stack spacing={1.5} alignItems="center">
                                                    <UploadMultiFile
                                                        showList={false}
                                                        setFieldValue={setFieldValue}
                                                        files={values.files}
                                                        error={touched.files && !!errors.files}
                                                        onUpload={onUpload}
                                                        onFileRemove={onFileRemove}
                                                        maxFileSize={maxFileSize}
                                                    />
                                                    {touched.files && errors.files && (
                                                        <FormHelperText error>
                                                            {errors?.files}
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
                            <PasteData initialData={data} onChange={onDataPaste}></PasteData>
                            <Stack direction="row" justifyContent="center"
                                alignItems="center" spacing={1.5} sx={{ mt: 1.5 }}>
                            </Stack>
                        </TabPanel>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default UploadFiles;
