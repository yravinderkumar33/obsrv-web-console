import { Button, Grid, Stack, Typography } from '@mui/material';
import * as yup from 'yup';
import * as _ from 'lodash'
import AnimateButton from 'components/@extended/AnimateButton';
import { useDispatch, useSelector } from 'react-redux';
import { addState, reset } from 'store/reducers/wizard';
import { IWizard } from 'types/formWizard';
import MuiForm from 'components/form';
import UploadFiles from './UploadFiles';
import { v4 } from 'uuid';
import { useState } from 'react';
import { error } from 'services/toaster';
import { fetchJsonSchemaThunk } from 'store/middlewares';

const fields = [
  {
    name: 'name',
    label: 'Dataset Name',
    type: 'text',
    required: true
  },
  {
    name: 'id',
    label: 'Dataset Id',
    type: 'text',
    required: true,
    disabled: true
  },
];

const initialValues = {
  name: '',
  id: v4()
};

const validationSchema = yup.object()
  .shape({
    name: yup.string().required('Dataset Name is required'),
    id: yup.string().required('Dataset Id is Required')
  });

export const pageMeta = { pageId: 'datasetConfiguration' };

const DatasetConfiguration = ({ index, setShowWizard }: any) => {

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
      dispatch(addState({ id: pageMeta.pageId, index, state: { data, files, config } }));
      setShowWizard(true);
    } else {
      dispatch(error({ message: "Please fill the required fields" }));
    }
  }

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12}>
          <MuiForm
            initialValues={configState || initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            fields={fields}
            size={{ lg: 6 }}
          >
            <Grid item xs={12}>
              <UploadFiles data={data} setData={setData} files={files} setFiles={setFiles} ></UploadFiles>
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
          </MuiForm>
        </Grid>
      </Grid>
    </>
  );
};

export default DatasetConfiguration;
