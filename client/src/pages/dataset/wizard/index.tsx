import { useState, ReactNode, useEffect } from 'react';
import { Button, Step, Stepper, StepLabel, Stack, Typography } from '@mui/material';
import Review from './Review';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import DatasetConfiguration from './DatasetConfiguration';
import UploadFiles from './UploadFiles';
import { useDispatch } from 'react-redux';
import { setConfig } from 'store/reducers/config';
import { reset } from 'store/reducers/wizard';

const steps = ['Configuration', 'Upload Data', 'Review'];

const getStepContent = (
  step: number,
  handleNext: () => void,
  handleBack: () => void,
  setErrorIndex: (i: number | null) => void
) => {
  switch (step) {
    case 0:
      return (
        <DatasetConfiguration handleNext={handleNext} setErrorIndex={setErrorIndex} />
      );
    case 1:
      return <UploadFiles handleBack={handleBack} handleNext={handleNext} setErrorIndex={setErrorIndex} />
    case 2:
      return <Review />;
    default:
      throw new Error('Unknown step');
  }
};

const ValidationWizard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [errorIndex, setErrorIndex] = useState<number | null>(null);
  const dispatch = useDispatch();

  const handleNext = () => {
    setActiveStep(activeStep + 1);
    setErrorIndex(null);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  useEffect(() => {
    dispatch(setConfig({ key: 'showClusterMenu', value: false }));
    return () => {
      dispatch(setConfig({ key: 'showClusterMenu', value: true }));
      dispatch(reset());
    }
  }, [])

  return (
    <MainCard title="Add a New Dataset">
      <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
        {steps.map((label, index) => {
          const labelProps: { error?: boolean; optional?: ReactNode } = {};

          if (index === errorIndex) {
            labelProps.optional = (
              <Typography variant="caption" color="error">
                Error
              </Typography>
            );

            labelProps.error = true;
          }

          return (
            <Step key={label}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <>
        {getStepContent(activeStep, handleNext, handleBack, setErrorIndex)}
        {activeStep === steps.length - 1 && (
          <Stack direction="row" justifyContent={activeStep !== 0 ? 'space-between' : 'flex-end'}>
            {activeStep !== 0 && (
              <AnimateButton>
                <Button variant="contained" sx={{ my: 3, ml: 1 }} type="button" onClick={handleBack}>
                  Previous
                </Button>
              </AnimateButton>
            )}
            <AnimateButton>
              <Button variant="contained" onClick={handleNext} sx={{ my: 3, ml: 1 }}>
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </AnimateButton>
          </Stack>
        )}
      </>
    </MainCard>
  );
};

export default ValidationWizard;
