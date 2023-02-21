import { Button, Grid, InputLabel, Stack, Typography, TextField, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import * as _ from 'lodash'
import AnimateButton from 'components/@extended/AnimateButton';
import { useDispatch, useSelector } from 'react-redux';
import { addState } from 'store/reducers/wizard';
import { IWizard } from 'types/formWizard';

const formState = {
  name: {
    id: 'name',
    default: '',
    label: 'Dataset Name',
    placeholder: 'Dataset Name',
    validation: yup.string().required('Dataset Name is required')
  },
  extractionKey: {
    id: 'extractionKey',
    default: '',
    label: 'Extraction Key',
    placeholder: 'Extraction Key',
    validation: yup.string()
  },
  isBatch: {
    id: 'isBatch',
    default: true,
    label: 'Is Batch ?',
    validation: yup.boolean()
  }
}

const validationSchema = yup.object(_.mapValues(formState, 'validation'));
export const pageMeta = { pageId: 'datasetConfiguration', title: "Dataset Configuration" };

const DatasetConfiguration = ({ handleNext, setErrorIndex, index }: any) => {

  const dispatch = useDispatch();
  const wizardState: IWizard = useSelector((state: any) => state?.wizard);
  const pageData = _.get(wizardState, ['pages', pageMeta.pageId]);

  const formik = useFormik({
    initialValues: pageData?.state || _.mapValues(formState, 'default'),
    validationSchema,
    onSubmit: (_) => {
      dispatch(addState({ id: pageMeta.pageId, index, state: { ...formik.values } }));
      handleNext();
    }
  });

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        {pageMeta.title}
      </Typography>
      <form onSubmit={formik.handleSubmit} id="validation-forms">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <Stack spacing={0.5}>
              <InputLabel required>{formState.name.label}</InputLabel>
              <TextField
                id={formState.name.id}
                name={formState.name.id}
                placeholder={formState.name.placeholder}
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                fullWidth
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Stack spacing={0.5}>
              <InputLabel>{formState.extractionKey.label}</InputLabel>
              <TextField
                id={formState.extractionKey.id}
                name={formState.extractionKey.id}
                placeholder={formState.extractionKey.placeholder}
                value={formik.values.extractionKey}
                onChange={formik.handleChange}
                error={formik.touched.extractionKey && Boolean(formik.errors.extractionKey)}
                helperText={formik.touched.extractionKey && formik.errors.extractionKey}
                fullWidth
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Stack spacing={0.5}>
              <InputLabel>{formState.isBatch.label}</InputLabel>
              <FormControl component="fieldset">
                <RadioGroup value={formik.values.isBatch} name={formState.isBatch.id} id={formState.isBatch.id} row>
                  <FormControlLabel name={formState.isBatch.id} value="true" control={<Radio />} label="True" />
                  <FormControlLabel name={formState.isBatch.id} value="false" control={<Radio />} label="False" />
                </RadioGroup>
              </FormControl>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end">
              <AnimateButton>
                <Button disabled={!formik.isValid} variant="contained" sx={{ my: 3, ml: 1 }} type="submit">
                  Next
                </Button>
              </AnimateButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default DatasetConfiguration;
