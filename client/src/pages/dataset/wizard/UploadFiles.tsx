import { useState } from 'react';
import { FormHelperText, Grid, Stack } from '@mui/material';
import MainCard from 'components/MainCard';
import { Formik } from 'formik';
import * as yup from 'yup';
import IconButton from 'components/@extended/IconButton';
import UploadMultiFile from 'components/third-party/dropzone/MultiFile';
import { UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons';
import AnimateButton from 'components/@extended/AnimateButton';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { IWizard } from 'types/formWizard';
import * as _ from 'lodash';
import { addState } from 'store/reducers/wizard';
import { fetchJsonSchemaThunk } from 'store/middlewares';

const pageMeta = { pageId: 'uploadSampleData', title: "Upload Sample Events" };

const UploadFiles = ({ handleNext, setErrorIndex, handleBack }: any) => {
    const [list, setList] = useState(false);
    const dispatch = useDispatch()
    const wizardState: IWizard = useSelector((state: any) => state?.wizard);
    const pageData = _.get(wizardState, ['pages', pageMeta.pageId]);

    const form = {
        initialState: {
            files: pageData?.state?.files || null
        },
        onSubmit(values: any) {
            handleNext();
        }
    }

    const onUpload = (files: any) => {
        dispatch(fetchJsonSchemaThunk({}));
        dispatch(
            addState({
                id: pageMeta.pageId,
                index: 1,
                state: { files }
            }));
        handleNext();
    }

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <MainCard
                        title={pageMeta.title}
                        secondary={
                            <Stack direction="row" alignItems="center" spacing={1.25}>
                                <IconButton color={list ? 'secondary' : 'primary'} size="small" onClick={() => setList(false)}>
                                    <UnorderedListOutlined style={{ fontSize: '1.15rem' }} />
                                </IconButton>
                                <IconButton color={list ? 'primary' : 'secondary'} size="small" onClick={() => setList(true)}>
                                    <AppstoreOutlined style={{ fontSize: '1.15rem' }} />
                                </IconButton>
                            </Stack>
                        }
                    >
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
                                                    showList={list}
                                                    setFieldValue={setFieldValue}
                                                    files={values.files}
                                                    error={touched.files && !!errors.files}
                                                    onUpload={() => onUpload(values.files)}
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
                    </MainCard>
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






