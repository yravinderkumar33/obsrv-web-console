import {
    Accordion, AccordionDetails, AccordionSummary,
    Typography, Grid, Box, Button, FormControl, FormControlLabel,
    Stack
} from "@mui/material";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import MUIForm from "components/form";
import { useDispatch, useSelector } from 'react-redux';
import { IWizard } from 'types/formWizard';
import commonConfigurations from 'data/ingestionConfigurations';
import { addState } from 'store/reducers/wizard';
import * as yup from "yup";
import * as _ from 'lodash'
import RequiredSwitch from "components/RequiredSwitch";
import AnimateButton from "components/@extended/AnimateButton";


export const pageMeta = { pageId: 'processingConfigurations', title: "Processing Configuration" };

type stepQuestion = "batchConfiguration" | "ingestionConfiguration" | "advanced"

interface questionSteps {
    id: "batchConfiguration" | "ingestionConfiguration" | "advanced",
    question: string,
    completed: boolean,
    rootQId: string,
    rootQValue: boolean,
    state: any
}

const camelToString = (text: string) => {
    const result = text.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
}

const ProcessingConfiguration = ({ handleBack, handleNext, setErrorIndex, index }: any) => {
    const dispatch = useDispatch();
    const apiResponse = useSelector((state: any) => state.jsonSchema);
    const wizardState: IWizard = useSelector((state: any) => state?.wizard);
    const pageData = _.get(wizardState, ['pages', pageMeta.pageId]);
    const [manageStep, setManageStep] = useState<string>('');
    const [updatedConfig, setUpdatedConfig] = useState<Record<string, questionSteps>>({
        batchConfiguration: {
            id: "batchConfiguration",
            question: "Does your data arrive in Batch? ",
            rootQId: 'isBatch',
            rootQValue: false,
            completed: false,
            state: {
                dedupeEvents: false,
                dedupeKey: "",
                dedupePeriod: "",
                extractionKey: "",
                idForTheBatch: "",
                validateData: false,
            }
        },

    });

    const persistState = () => dispatch(addState({ id: pageMeta.pageId, index, state: { configurations: updatedConfig } }));

    const gotoNextSection = () => {
        persistState();
        handleNext();
    }

    const gotoPreviousSection = () => {
        persistState();
        handleBack();
    }

    const getFields = (stepItem: questionSteps) => {
        const pairs = _.toPairs(commonConfigurations[stepItem.id]);
        return pairs.map((pair, index) => {
            const [name, values] = pair;
            const { value, required, dependsOn = null, label = null, }: any = values;
            if (Array.isArray(value))
                return {
                    name,
                    label: label || camelToString(name),
                    type: 'select',
                    required: required,
                    disabled: !stepItem.rootQValue,
                    selectOptions: _.map(value, value => ({ label: _.toString(value), value })),
                    dependsOn,
                }
            else
                return {
                    name,
                    label: label || camelToString(name),
                    type: 'text',
                    required: required,
                    disabled: !stepItem.rootQValue,
                    value: value,
                    dependsOn,
                }
        });
    }

    const getValidationSchemas = (id: stepQuestion) => {
        const data = _.mapValues(commonConfigurations[id], (value: any) => {
            return _.has(value, 'validationSchema') ? _.get(value, 'validationSchema') : null;
        });
        return yup.object().shape({
            ...data
        });
    }

    const handleStepChange = (id: string) => {
        setManageStep((prevState) => id === prevState ? '' : id);
    }

    const handleChange = (stepItem: questionSteps, checked: boolean) => {
        setUpdatedConfig((prevState: any) => {
            const data = prevState;
            data[stepItem.id].rootQValue = checked;
            return data;
        });
        if (checked) setManageStep(stepItem.id);
        else setManageStep('');
    }

    // const getFormValues = (values: any, stepId: stepQuestion) => {
    //     setUpdatedConfig((prevState: any) => {
    //         const data = prevState;
    //         data[stepItem.id].completed = true;
    //         data[stepItem.id].state = { ...values };
    //         return data;
    //     });
    // }

    const handleStepComplete = (values: any, stepItem: questionSteps) => {
        setUpdatedConfig((prevState: any) => {
            const data = prevState;
            data[stepItem.id].completed = true;
            data[stepItem.id].state = { ...values };
            return data;
        });
        setManageStep((prevState: string) => {
            if (stepItem.id === prevState) return '';
            else return prevState;
        });
    }

    return (
        <Grid container spacing={3}>
            {Object.values(updatedConfig).map((stepItem) => {
                return (
                    <Grid item xs={12} key={stepItem.id}>
                        <Accordion expanded={manageStep === stepItem.id} onChange={
                            () => stepItem.completed ? handleStepChange(stepItem.id) : null
                        }>
                            <AccordionSummary
                                expandIcon={null}
                                aria-controls="batch-config-content"
                                id="batch-config-header"
                                sx={{
                                    alignItems: "center",
                                    '& .MuiAccordionSummary-content': {
                                        alignItems: "center"
                                    }
                                }}
                            >
                                <Typography mx={1} minWidth="210px">{stepItem.question}</Typography>
                                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                                    <FormControl sx={{ alignItems: 'center' }}>
                                        <FormControlLabel
                                            name="isBatch"
                                            control={<RequiredSwitch value={stepItem.rootQValue} onChange={(_, checked) => handleChange(stepItem, checked)} />}
                                            label={''}
                                        />
                                    </FormControl>
                                    {stepItem.completed && <CheckCircleOutlined style={{ fontSize: '1.25rem' }} />}
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <MUIForm
                                    initialValues={updatedConfig[stepItem.id].state}
                                    onSubmit={(values: any) => handleStepComplete(values, stepItem)}
                                    validationSchema={getValidationSchemas(stepItem.id)}
                                    fields={getFields(stepItem)}
                                    size={{ xs: 12, sm: 6, lg: 6 }}
                                >
                                    <Grid item xs={12}>
                                        <Box display="flex" justifyContent="flex-end" mb={2}>
                                            <Button
                                                variant="contained"
                                                type="submit"
                                                sx={{ mt: 1, mr: 1 }}
                                            >
                                                {'Finish'}
                                            </Button>
                                        </Box>
                                    </Grid>
                                </MUIForm>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                );
            })}
            <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between">
                    <AnimateButton>
                        <Button variant="contained" sx={{ my: 1, ml: 1 }} type="button" onClick={gotoPreviousSection}>
                            Previous
                        </Button>
                    </AnimateButton>
                    <AnimateButton>
                        <Button variant="contained" sx={{ my: 1, ml: 1 }} type="button" onClick={gotoNextSection}>
                            Next
                        </Button>
                    </AnimateButton>
                </Stack>
            </Grid>
        </Grid>
    );
}

export default ProcessingConfiguration;
