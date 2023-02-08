import { Button, Grid, InputLabel, Stack, Typography, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import * as _ from 'lodash'
import AnimateButton from 'components/@extended/AnimateButton';
import { useDispatch, useSelector } from 'react-redux';
import { addState } from 'store/reducers/wizard';
import { IWizard } from 'types/formWizard';

const validationSchema = yup.object({ name: yup.string().required('Dataset Name is required') });

const pageMeta = { pageId: 'datasetConfiguration', title: "Dataset Configuration" };

const DatasetConfiguration = ({ handleNext, setErrorIndex, index }: any) => {
  const dispatch = useDispatch();
  const wizardState: IWizard = useSelector((state: any) => state?.wizard);
  const pageData = _.get(wizardState, ['pages', pageMeta.pageId]);

  const formik = useFormik({
    initialValues: pageData?.state || { name: "" },
    validationSchema,
    onSubmit: (_) => {
      dispatch(
        addState({
          id: pageMeta.pageId,
          index,
          state: { ...formik.values }
        }));
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
              <InputLabel>Dataset Name</InputLabel>
              <TextField
                id="name"
                name="name"
                placeholder="Dataset Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                fullWidth
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end">
              <AnimateButton>
                <Button disabled={!formik.isValid} variant="contained" sx={{ my: 3, ml: 1 }} type="submit" onClick={() => setErrorIndex(0)}>
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
