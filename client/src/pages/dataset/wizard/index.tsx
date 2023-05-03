import { useState, ReactNode, useEffect } from 'react';
import { Button, Step, Stepper, StepLabel, Typography, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import DatasetConfiguration from './DatasetConfiguration';
import { useDispatch} from 'react-redux';
import { reset } from 'store/reducers/wizard';
import ListColumns from './ListColumns';
import Review from './Review';
import * as _ from 'lodash';
import SectionConfiguration from './components/SectionConfiguration';
import { fetchDatasetsThunk } from 'store/middlewares';
import { interactIds } from 'data/telemetry/interactIds';

const steps = ['Schema', 'Input', 'Fields', 'Processing', 'Advanced', 'Review'];
const masterSteps = ['Schema', 'Ingestion', 'Review'];

const getStepContent = (step: number, handleNext: () => void, handleBack: () => void, setErrorIndex: (i: number | null) => void, master: boolean, edit: boolean) => {
    if (master) {
        switch (step) {
            case 0:
                return <ListColumns handleBack={handleBack} handleNext={handleNext} setErrorIndex={setErrorIndex} index={0} edit={edit} master={master} />;
            case 1:
                return <SectionConfiguration handleBack={handleBack} handleNext={handleNext} setErrorIndex={setErrorIndex} index={1} section="input" edit={edit} master={master} />
            case 2:
                return <Review handleBack={handleBack} handleNext={handleNext} setErrorIndex={setErrorIndex} index={2} master={master} />
            default:
                throw new Error('Unknown step');
        }
    } else {
        switch (step) {
            case 0:
                return <ListColumns handleBack={handleBack} handleNext={handleNext} setErrorIndex={setErrorIndex} index={0} edit={edit} />;
            case 1:
                return <SectionConfiguration handleBack={handleBack} handleNext={handleNext} setErrorIndex={setErrorIndex} index={1} section="input" edit={edit} />
            case 2:
                return <SectionConfiguration handleBack={handleBack} handleNext={handleNext} setErrorIndex={setErrorIndex} index={2} section="field" edit={edit} />
            case 3:
                return <SectionConfiguration handleBack={handleBack} handleNext={handleNext} setErrorIndex={setErrorIndex} index={3} section="processing" edit={edit} />
            case 4:
                return <SectionConfiguration handleBack={handleBack} handleNext={handleNext} setErrorIndex={setErrorIndex} index={4} section="advanced" edit={edit} />
            case 5:
                return <Review handleBack={handleBack} handleNext={handleNext} setErrorIndex={setErrorIndex} index={5} />
            default:
                throw new Error('Unknown step');
        }
    }
};

const DatasetOnboarding = ({ edit = false, master = false, key = Math.random() }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [showWizard, setShowWizard] = useState(false);
    const [errorIndex, setErrorIndex] = useState<number | null>(null);

    const dispatch = useDispatch();

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
        dispatch(fetchDatasetsThunk({ data: { filters: {} } }));
        if (edit) { setShowWizard(true) }
        return () => {
            dispatch(reset({}));
        }
    }, []);

    window.addEventListener("beforeunload", (ev) => {
        ev.preventDefault();
        return ev.returnValue = 'Are you sure you want to close?';
    });

    const resetState = () => {
        dispatch(reset({ preserve: ['datasetConfiguration'] }));
        setActiveStep(0);
    };

    const stepper = () => (
        <Stepper activeStep={activeStep} sx={{ py: 2 }}>
            {master && masterSteps.map((label, index) => {
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
                    <Step key={Math.random()} onClick={() => setActiveStep(index)}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                );
            })}
            {!master && steps.map((label, index) => {
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
                    <Step key={Math.random()} onClick={() => setActiveStep(index)}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                );
            })}
        </Stepper>
    );

    return (
        <Box>
            {showWizard && stepper()}
            {!showWizard && <DatasetConfiguration key={key} setShowWizard={setShowWizard} datasetType={master ? "master-dataset" : "dataset"} />}
            {showWizard && getStepContent(activeStep, handleNext, handleBack, setErrorIndex, master, edit)}
        </Box>
    );
};

export default DatasetOnboarding;
