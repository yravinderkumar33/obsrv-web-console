import { Button, Grid, Stack, Typography } from '@mui/material';
import * as yup from 'yup';
import * as _ from 'lodash'
import AnimateButton from 'components/@extended/AnimateButton';
import { useDispatch, useSelector } from 'react-redux';
import { addState } from 'store/reducers/wizard';
import { IWizard } from 'types/formWizard';
import MUIForm from 'components/form';

const fields = [
  {
    name: 'name',
    label: 'Dataset Name',
    type: 'text',
  },
  {
    name: 'extractionKey',
    label: 'Extraction Key',
    type: 'text',
  },
  {
    name: 'isBatch',
    label: 'is Batch ?',
    type: 'radio',
    selectOptions: [
      { value: true, label: 'True' },
      { value: false, label: 'False' }
    ],
  }
];

const initialValues = {
  name: '',
  extractionKey: '',
  isBatch: true
};

const validationSchema = yup.object().shape({
  name: yup.string().required('Dataset Name is required'),
});

export const pageMeta = { pageId: 'datasetConfiguration', title: "Dataset Configuration" };

const DatasetConfiguration = ({ handleNext, setErrorIndex, index }: any) => {

  const dispatch = useDispatch();
  const wizardState: IWizard = useSelector((state: any) => state?.wizard);
  const pageData = _.get(wizardState, ['pages', pageMeta.pageId]);

  const onSubmit = (value: any) => {
    dispatch(addState({ id: pageMeta.pageId, index, state: { ...value } }));
    handleNext();
  }

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        {pageMeta.title}
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12}>
          <MUIForm
            initialValues={pageData?.state || initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            fields={fields}
          >
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="flex-end">
                <AnimateButton>
                  <Button variant="contained" sx={{ my: 3, ml: 1 }} type="submit">
                    Next
                  </Button>
                </AnimateButton>
              </Stack>
            </Grid> </MUIForm>
        </Grid>
      </Grid>
    </>
  );
};

export default DatasetConfiguration;
