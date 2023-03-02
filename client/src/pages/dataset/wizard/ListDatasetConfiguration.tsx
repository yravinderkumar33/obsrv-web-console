import { Box, Button, Grid, Stack, Step, StepContent, StepLabel, Stepper, Typography } from '@mui/material';
import * as _ from 'lodash'
import AnimateButton from 'components/@extended/AnimateButton';
import { useDispatch, useSelector } from 'react-redux';
import { addState } from 'store/reducers/wizard';
import { IWizard } from 'types/formWizard';
import MUIForm from 'components/form';
import { useEffect, useState } from 'react';

export const pageMeta = { pageId: 'listDatasetConfigurations', title: "Dataset Configuration" };

const DatasetConfiguration = ({ handleNext, handleBack, index }: any) => {
  const dispatch = useDispatch();
  const apiResponse = useSelector((state: any) => state.jsonSchema);
  const wizardState: IWizard = useSelector((state: any) => state?.wizard);
  const pageData = _.get(wizardState, ['pages', pageMeta.pageId]);
  const [updatedConfig, setUpdatedConfig] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [steps, setSteps] = useState([]);

  const persistState = () => dispatch(addState({ id: pageMeta.pageId, index, state: { configurations: updatedConfig } }));

  const gotoNextSection = () => {
    persistState();
    handleNext();
  }

  const gotoPreviousSection = () => {
    persistState();
    handleBack();
  }

  const getFields = (payload: Record<string, any>) => {
    const pairs = _.toPairs(payload);
    return pairs.map((pair, index) => {
      const [name, values] = pair;
      if (Array.isArray(values)) {
        return {
          name,
          label: _.capitalize(name),
          type: 'select',
          required: true,
          selectOptions: _.map(values, value => ({ label: _.toString(value), value }))
        }
      } else {
        return {
          name,
          label: _.capitalize(name),
          type: 'text',
          required: true,
          value: values
        }
      }
    })
  }

  const getInitialValues = (payload: Record<string, any>) => {
    return _.mapValues(payload, (value) => {
      const [firstValue] = value;
      return firstValue
    })
  }

  const onSubmission = (name: string, values: any) => {
    setUpdatedConfig((pre: object) => ({ ...pre, [name]: values }));
    setActiveStep(pre => pre + 1);
  }

  const createSteps = (payload: Record<string, any>) => {
    const pairs = _.toPairs(payload);
    return pairs.map((pair, index) => {
      const [name, value] = pair;
      const fields = getFields(value);
      const initialValues = getInitialValues(value);
      return {
        name,
        label: _.capitalize(name),
        description: <>
          <MUIForm
            initialValues={_.get(pageData, ['state', name]) || initialValues}
            onSubmit={(value: any) => onSubmission(name, value)}
            fields={fields}
          >
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                </div>
              </Box>
            </Grid>
          </MUIForm>
        </>
      }
    })
  }

  useEffect(() => {
    if (apiResponse?.status === 'success' && apiResponse?.data?.configurations) {
      setSteps(createSteps(apiResponse.data.configurations) as any);
    }
  }, [apiResponse?.status]);

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        {pageMeta.title}
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step: any, index) => (
              <Step key={step?.label} onClick={_ => setActiveStep(index)}>
                <StepLabel optional={index === 2 ? <Typography variant="caption">Last step</Typography> : null}>{step?.label}</StepLabel>
                <StepContent>
                  <Typography>{step?.description}</Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Grid>
        {activeStep === steps.length && (
          <Grid item sm={12} xs={12}>
            <Stack direction="row" justifyContent="space-between">
              <AnimateButton>
                <Button variant="contained" sx={{ my: 3, ml: 1 }} type="button" onClick={gotoPreviousSection}>
                  Previous
                </Button>
              </AnimateButton>
              <AnimateButton>
                <Button variant="contained" sx={{ my: 3, ml: 1 }} type="button" onClick={gotoNextSection}>
                  Next
                </Button>
              </AnimateButton>
            </Stack>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default DatasetConfiguration;
