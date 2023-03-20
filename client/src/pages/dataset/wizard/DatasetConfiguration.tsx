import { Button, Grid, Stack, TextField } from '@mui/material';
import * as yup from 'yup';
import * as _ from 'lodash'
import AnimateButton from 'components/@extended/AnimateButton';
import { useDispatch, useSelector } from 'react-redux';
import { addState } from 'store/reducers/wizard';
import { IWizard } from 'types/formWizard';
import UploadFiles from './UploadFiles';
import { v4 } from 'uuid';
import { useState } from 'react';
import { error } from 'services/toaster';
import { fetchJsonSchemaThunk } from 'store/middlewares';
import { Formik, Form } from 'formik';
import { generateSlug } from 'utils/stringUtils';

const initialValues = {
    name: '',
    id: v4(),
    slug: ''
};

const validationSchema = yup.object()
    .shape({
        name: yup.string().required('Dataset Name is required')
            .min(4, 'Minimum of 4 characters are required').max(30, 'Maximum of 30 characters are allowed'),
        slug: yup.string().required('Dataset ID is Required')
            .min(4, 'Minimum of 4 characters are required').max(30, 'Maximum of 30 characters are allowed'),
        id: yup.string().uuid().required(),
    });

export const pageMeta = { pageId: 'datasetConfiguration' };

const DatasetConfiguration = ({ setShowWizard }: any) => {

    const dispatch = useDispatch();
    const wizardState: IWizard = useSelector((state: any) => state?.wizard);
    const pageData = _.get(wizardState, ['pages', pageMeta.pageId]);
    const { data: dataState, files: filesState, config: configState } = pageData?.state || {};
    const [data, setData] = useState(dataState);
    const [files, setFiles] = useState(filesState);

    const generateJSONSchema = (data: Array<any>, config: Record<string, any>) => {
        const dataset = _.get(config, 'name')
        dispatch(fetchJsonSchemaThunk({ data: Array.isArray(data) ? data : [data], config: { dataset } }));
    };

    const onSubmit = (config: any) => {
        if ((data || files) && config) {
            generateJSONSchema(data, config);
            dispatch(addState({ id: pageMeta.pageId, state: { data, files, config } }));
            setShowWizard(true);
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
                    >
                        {({ setFieldValue, touched, errors, values, handleBlur, handleChange }) => (
                            <Form>
                                <Grid container spacing={3} justifyContent="center"
                                    alignItems="baseline" display="flex">
                                    <Grid item xs={12} sm={6} lg={6}>
                                        <TextField
                                            name={'name'}
                                            label={'Dataset Name'}
                                            onBlur={handleBlur}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>) =>
                                                handleNameChange(e, setFieldValue, 'slug', 'name')
                                            }
                                            required
                                            value={values['name']}
                                            variant="outlined"
                                            fullWidth
                                            error={Boolean(errors['name'])}
                                            helperText={touched['name'] && errors['name'] && String(errors['name'])}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} lg={6}>
                                        <TextField
                                            name={'slug'}
                                            label={'Dataset ID'}
                                            onBlur={handleBlur}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>) =>
                                                handleChange(e)
                                            }
                                            required
                                            value={values['slug']}
                                            variant="outlined"
                                            fullWidth
                                            error={Boolean(errors['slug'])}
                                            helperText={touched['slug'] && errors['slug'] && String(errors['slug'])}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3} justifyContent="center" alignItems="center">
                                    <Grid item xs={12}>
                                        <UploadFiles data={data} setData={setData} files={files} setFiles={setFiles} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack direction="row" justifyContent="flex-end">
                                            <AnimateButton>
                                                <Button disabled={!(files || data)} variant="contained" sx={{ my: 3, ml: 1 }} type="submit">
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
