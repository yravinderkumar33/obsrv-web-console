import { useState, ReactNode, useEffect } from 'react';
import { Button, Step, Stepper, StepLabel, Typography, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import DatasetConfiguration from './DatasetConfiguration';
import { useDispatch, useSelector } from 'react-redux';
import { setConfig } from 'store/reducers/config';
import { reset } from 'store/reducers/wizard';
import ListColumns from './ListColumns';
import Review from './Review';
import * as _ from 'lodash';
import SchemaConfiguration from './SchemaConfiguration';
import ProcessingConfiguration from './ProcessingConfiguration';
import IngestionConfiguration from './IngestionConfiguration';

//'Ingestion Config',
const steps = ['Derive Schema', 'Configure Data Schema', 'Processing Configuration', 'Ingestion Configuration', 'Review'];

const getStepContent = (
    step: number,
    handleNext: () => void,
    handleBack: () => void,
    setErrorIndex: (i: number | null) => void
) => {
    switch (step) {
        case 0:
            return <ListColumns handleBack={handleBack} handleNext={handleNext} setErrorIndex={setErrorIndex} index={0} />;
        case 1:
            return <SchemaConfiguration handleBack={handleBack} handleNext={handleNext} setErrorIndex={setErrorIndex} index={1} />
        case 2:
            return <ProcessingConfiguration handleBack={handleBack} handleNext={handleNext} setErrorIndex={setErrorIndex} index={2} />
        case 3:
            return <IngestionConfiguration handleBack={handleBack} handleNext={handleNext} setErrorIndex={setErrorIndex} index={3} />
        case 4:
            return <Review handleBack={handleBack} handleNext={handleNext} setErrorIndex={setErrorIndex} index={4} />
        default:
            throw new Error('Unknown step');
    }
};

const DatasetOnboarding = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [showWizard, setShowWizard] = useState(false);
    const [errorIndex, setErrorIndex] = useState<number | null>(null);

    const dispatch = useDispatch();
    const wizardState = useSelector((state: any) => _.get(state, 'wizard'));

    const handleNext = () => {
        setActiveStep(activeStep + 1);
        setErrorIndex(null);
    };

    const handleBack = () => {
        if (activeStep === 0) {
            setShowWizard(false);
        } else {
            setActiveStep(activeStep - 1);
        }
    };

    useEffect(() => {
        return () => {
            dispatch(reset({}));
        }
    }, []);

    const resetState = () => {
        dispatch(reset({}));
        setActiveStep(0);
    };

    const stepper = () => (
        <Stepper activeStep={activeStep} sx={{ py: 2 }}>
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
    );

    const getDatasetName = () => {
        const name = _.get(wizardState, 'pages.datasetConfiguration.state.config.name');
        return name ? name : '';
    };

    return (
        <Box>
            {showWizard && stepper()}
            <MainCard title={getDatasetName()}
                secondary={
                    showWizard && <>
                        <Button onClick={(_) => resetState()}>
                            Reset
                        </Button>
                    </>
                }>
                {!showWizard && <DatasetConfiguration setShowWizard={setShowWizard} />}
                {showWizard && getStepContent(activeStep, handleNext, handleBack, setErrorIndex)}
            </MainCard >
        </Box>
    );
};

export default DatasetOnboarding;
