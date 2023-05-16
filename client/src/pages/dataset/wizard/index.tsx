import { useState, ReactNode, useEffect } from 'react';
import { Step, Stepper, StepLabel, Typography, Box } from '@mui/material';
import DatasetConfiguration from './DatasetConfiguration';
import { useDispatch, useSelector } from 'react-redux';
import { reset } from 'store/reducers/wizard';
import ListColumns from './ListColumns';
import Review from './Review';
import * as _ from 'lodash';
import SectionConfiguration from './components/SectionConfiguration';
import { fetchDatasetsThunk } from 'store/middlewares';
import useImpression from 'hooks/useImpression';
import pageIds from 'data/telemetry/pageIds';
import { generateEndEvent, generateInteractEvent } from 'services/telemetry';
import { IWizard } from 'types/formWizard';

const steps = ['Schema', 'Input', 'Fields', 'Processing', 'Advanced', 'Review'];
const masterSteps = ['Schema', 'Input', 'Review'];

const getStepContent = (step: number, handleNext: () => void, handleBack: () => void, setErrorIndex: (i: number | null) => void, master: boolean, edit: boolean, generateInteractTelemetry: any) => {

    if (master) {
        switch (step) {
            case 0:
                return <ListColumns handleBack={handleBack} handleNext={handleNext} setErrorIndex={setErrorIndex} index={0} edit={edit} master={master} generateInteractTelemetry={generateInteractTelemetry} />;
            case 1:
                return <SectionConfiguration handleBack={handleBack} handleNext={handleNext} setErrorIndex={setErrorIndex} index={1} section="input" edit={edit} master={master} generateInteractTelemetry={generateInteractTelemetry} />
            case 2:
                return <Review handleBack={handleBack} handleNext={handleNext} setErrorIndex={setErrorIndex} index={2} master={master} edit={edit} generateInteractTelemetry={generateInteractTelemetry} />
            default:
                throw new Error('Unknown step');
        }
    } else {
        switch (step) {
            case 0:
                return <ListColumns handleBack={handleBack} handleNext={handleNext} setErrorIndex={setErrorIndex} index={0} edit={edit} generateInteractTelemetry={generateInteractTelemetry} />;
            case 1:
                return <SectionConfiguration handleBack={handleBack} handleNext={handleNext} setErrorIndex={setErrorIndex} index={1} section="input" edit={edit} generateInteractTelemetry={generateInteractTelemetry} />
            case 2:
                return <SectionConfiguration handleBack={handleBack} handleNext={handleNext} setErrorIndex={setErrorIndex} index={2} section="field" edit={edit} generateInteractTelemetry={generateInteractTelemetry} />
            case 3:
                return <SectionConfiguration handleBack={handleBack} handleNext={handleNext} setErrorIndex={setErrorIndex} index={3} section="processing" edit={edit} generateInteractTelemetry={generateInteractTelemetry} />
            case 4:
                return <SectionConfiguration handleBack={handleBack} handleNext={handleNext} setErrorIndex={setErrorIndex} index={4} section="advanced" edit={edit} generateInteractTelemetry={generateInteractTelemetry} />
            case 5:
                return <Review handleBack={handleBack} handleNext={handleNext} setErrorIndex={setErrorIndex} index={5} edit={edit} generateInteractTelemetry={generateInteractTelemetry} />
            default:
                throw new Error('Unknown step');
        }
    }
};

const DatasetOnboarding = ({ edit = false, master = false, key = Math.random() }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [showWizard, setShowWizard] = useState(false);
    const [errorIndex, setErrorIndex] = useState<number | null>(null);
    const wizardState: IWizard = useSelector((state: any) => state?.wizard);
    useImpression({ type: "view", pageid: _.get(pageIds, [master ? 'masterdataset' : 'dataset', edit ? 'edit' : 'create']) });

    const dispatch = useDispatch();

    const pageIdPrefix = _.get(pageIds, [master ? 'masterdataset' : 'dataset', edit ? 'edit' : 'create']);
    const datasetType = master ? 'masterDataset' : 'dataset';

    const generateInteractTelemetry = ({ edata: { id } }: any) => {
        const datasetId = _.get(wizardState, 'pages.datasetConfiguration.state.config.dataset_id')
        generateInteractEvent({
            object: datasetId ? { id: datasetId, type: datasetType, version: "1.0.0" } : {},
            edata: { id: `${pageIdPrefix}:${id}`, type: 'CLICK' }
        });
    }

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
        generateEndEvent({  
            edata: {
                type: "App",
                pageid: "logout"
            },
            object: {}
        })
        return ev.returnValue = 'Are you sure you want to close?';
    });

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
                    <Step key={Math.random()}>
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
                    <Step key={Math.random()}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                );
            })}
        </Stepper>
    );

    return (
        <Box>
            {showWizard && stepper()}
            {!showWizard && <DatasetConfiguration key={key} setShowWizard={setShowWizard} datasetType={master ? "master-dataset" : "dataset"} generateInteractTelemetry={generateInteractTelemetry} />}
            {showWizard && getStepContent(activeStep, handleNext, handleBack, setErrorIndex, master, edit, generateInteractTelemetry)}
        </Box>
    );
};

export default DatasetOnboarding;
