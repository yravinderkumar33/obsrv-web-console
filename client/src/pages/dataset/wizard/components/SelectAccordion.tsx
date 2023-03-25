import {
    Accordion, AccordionDetails, AccordionSummary,
    Typography, Grid, Box, Button, FormControl, Select,
    Stack, MenuItem, InputLabel
} from "@mui/material";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import MUIForm from "components/form";
import { useDispatch, useSelector } from 'react-redux';
import { IWizard } from 'types/formWizard';
import { addState } from 'store/reducers/wizard';
import * as yup from "yup";
import * as _ from 'lodash'
import AnimateButton from "components/@extended/AnimateButton";
import { camelCaseToString } from "utils/stringUtils";

const SelectAccordion = ({ handleBack, handleNext, setErrorIndex, index, configuration, pageMeta }: any) => {
    const dispatch = useDispatch();
    const apiResponse = useSelector((state: any) => state.jsonSchema);
    const wizardState: IWizard = useSelector((state: any) => state?.wizard);
    const pageData = _.get(wizardState, ['pages', pageMeta.pageId]);
    const [manageStep, setManageStep] = useState<string>('');
    const [updatedConfig, setUpdatedConfig] = useState(configuration);

    const persistState = () => dispatch(addState(
        {
            id: pageMeta.pageId,
            index,
            state: { configurations: stateToRedux() }
        }));

    const stateToRedux = () => {
        let data = Object.entries(updatedConfig).map(([key, value]: any) => {
            value = delete value.form;
            return {
                [key]: value
            }
        })
        return data;
    }
    const gotoNextSection = () => {
        persistState();
        handleNext();
    }

    const gotoPreviousSection = () => {
        persistState();
        handleBack();
    }

    const getFields = (stepItem: any, selectedValue: string) => {
        const pairs = _.toPairs(configuration[stepItem.id].form[selectedValue]);
        if (pairs)
            return pairs.map((pair, index) => {
                const [name, values] = pair;
                const { value, required, dependsOn = null, label = null, }: any = values;
                if (Array.isArray(value))
                    return {
                        name,
                        label: label || camelCaseToString(name),
                        type: 'select',
                        required: required,
                        disabled: !stepItem.rootQValue,
                        selectOptions: _.map(value, value => ({ label: _.toString(value), value })),
                        dependsOn,
                    }
                else
                    return {
                        name,
                        label: label || camelCaseToString(name),
                        type: 'text',
                        required: required,
                        disabled: !stepItem.rootQValue,
                        value: value,
                        dependsOn,
                    }
            });
        else return null;
    }

    const getValidationSchemas = (id: any) => {
        const data = _.mapValues(configuration[id].form[updatedConfig[id].rootQValue], (value: any) => {
            return _.has(value, 'validationSchema') ? _.get(value, 'validationSchema') : null;
        });
        return yup.object().shape({
            ...data
        });
    }

    const handleStepChange = (id: string) => {
        setManageStep((prevState) => id === prevState ? '' : id);
    }

    const handleChange = (stepItem: any, value: string) => {
        setUpdatedConfig((prevState: any) => {
            let data = _.cloneDeep(prevState);
            data[stepItem.id].rootQValue = value;
            if (stepItem.form[value] === null)
                data[stepItem.id].completed = true;
            else data[stepItem.id].completed = false;
            return data;
        });
        if (value && value !== '' && stepItem.form[stepItem.rootQValue])
            setManageStep(stepItem.id);
    }

    const checkExpansion = (stepItem: any): boolean => {
        if (manageStep === stepItem.id && stepItem.form[stepItem.rootQValue])
            return true;
        else return false;
    }

    const handleStepComplete = (values: any, stepItem: any) => {
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
            {Object.values(updatedConfig).map((stepItem: any) => {
                return (
                    <Grid item xs={12} key={stepItem.id}>
                        <Accordion expanded={checkExpansion(stepItem)} onChange={
                            () => stepItem.completed ? handleStepChange(stepItem.id) : null
                        }>
                            <AccordionSummary
                                expandIcon={null}
                                aria-controls="config-content"
                                id="config-header"
                                sx={{
                                    alignItems: "center",
                                    '& .MuiAccordionSummary-content': {
                                        alignItems: "center"
                                    }
                                }}
                            >
                                <Typography mx={1} minWidth="210px">{stepItem.question}</Typography>
                                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                                    <FormControl sx={{ width: '30%' }}>
                                        <InputLabel>{camelCaseToString(stepItem.rootQId)}</InputLabel>
                                        <Select
                                            fullWidth
                                            value={stepItem.rootQValue}
                                        >
                                            {
                                                stepItem.rootQValues.map((option: any) =>
                                                    (<MenuItem onClick={() => handleChange(stepItem, option)} value={option} key={option}>{option}</MenuItem>))
                                            }
                                        </Select>
                                    </FormControl>
                                    {stepItem.completed && <CheckCircleOutlined style={{ fontSize: '1.25rem' }} />}
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <MUIForm
                                    initialValues={updatedConfig[stepItem.id].state}
                                    onSubmit={(values: any) => handleStepComplete(values, stepItem)}
                                    validationSchema={getValidationSchemas(stepItem.id)}
                                    fields={getFields(stepItem, stepItem.rootQValue)}
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

export default SelectAccordion;
