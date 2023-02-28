import { Button, Grid, Stack, Typography } from '@mui/material';
import * as yup from 'yup';
import * as _ from 'lodash'
import AnimateButton from 'components/@extended/AnimateButton';
import { useDispatch, useSelector } from 'react-redux';
import { addState } from 'store/reducers/wizard';
import { IWizard } from 'types/formWizard';
import MUIForm from 'components/form';
import UploadFiles from './UploadFiles';

const fields = [
  {
    name: 'name',
    label: 'Dataset Name',
    type: 'text',
    required: true
  },
  {
    name: 'isBatch',
    label: 'Is Batch ?',
    type: 'select',
    required: true,
    selectOptions: [
      { value: true, label: 'True' },
      { value: false, label: 'False' }
    ]
  },
  {
    name: 'dedupe',
    label: 'Dedupe Key',
    type: 'text',
    dependsOn: {
      key: 'isBatch',
      value: true
    }
  },
  {
    name: 'extractionKey',
    label: 'Extraction Key',
    type: 'text',
    dependsOn: {
      key: 'isBatch',
      value: true
    }
  }
];

const initialValues = {
  name: '',
  extractionKey: ''
};

const validationSchema = yup.object().shape({
  name: yup.string().required('Dataset Name is required'),
  isBatch: yup.boolean().required('Type is Required')
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
