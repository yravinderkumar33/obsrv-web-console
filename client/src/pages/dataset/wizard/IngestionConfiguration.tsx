import SelectAccordion from "./components/SelectAccordion";
import ingestionConfig from "data/ingestionConfigurations";
import {
    Grid, Typography, FormControl, Autocomplete,
    Box, TextField, Stack, Button, Accordion, AccordionSummary
} from "@mui/material";
import { addState } from 'store/reducers/wizard';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as _ from 'lodash';
import AnimateButton from "components/@extended/AnimateButton";

export const pageMeta = { pageId: 'ingestionConfiguration', title: "Ingestion Configuration" };

const IngestionConfiguration = ({ handleBack, handleNext, setErrorIndex, index }: any) => {
    const [timestampOptions, setTimestampOptions] = useState<any>([]);
    const [timestampField, setTimestampField] = useState<Record<string, string>>({ label: 'Sync TS', value: 'arrival_time' });
    const apiResponse = useSelector((state: any) => state.jsonSchema);
    const dispatch = useDispatch();
    const [updatedConfig, setUpdatedConfig] = useState(ingestionConfig);
    const [formValues, subscribe] = useState<any>({});

    const persistState = () => dispatch(addState(
        {
            id: pageMeta.pageId,
            index,
            state: { configurations: stateToRedux(), timestampField: timestampField }
        }));

    useEffect(() => {
        persistState();
    }, [formValues]);

    const stateToRedux = () => {
        let data = _.cloneDeep(updatedConfig);
        _.mapKeys(data, (item) => {
            if (_.has(item, 'state'))
                Object.keys(formValues).map((k) => {
                    if (_.has(item.state, k))
                        item.state[k] = formValues[k];
                    return;
                })
            return;
        });
        return data;
    }

    const formatOptions = () => {
        let data = _.get(apiResponse?.data?.configurations?.indexConfiguration, 'index');
        data = data.map((item: any) => {
            if (item === 'arrival_time')
                return { label: 'Sync TS', 'value': item };
            else return { label: item, value: item };
        });
        setTimestampOptions(data);
    }

    const gotoNextSection = () => {
        persistState();
        handleNext();
    }

    const gotoPreviousSection = () => {
        persistState();
        handleBack();
    }

    const handleTimeFieldChange = (value: any) => {
        if (value)
            setTimestampField(value);
        else setTimestampField({ label: 'Time of Arrival', value: 'arrival_time' });
        persistState();
    }

    useEffect(() => {
        formatOptions();
    }, []);

    return (
        <Grid container>
            <Grid item xs={12}>
                <SelectAccordion
                    index={index}
                    configuration={ingestionConfig}
                    updatedConfig={updatedConfig}
                    setUpdatedConfig={setUpdatedConfig}
                    pageMeta={pageMeta}
                    formValues={formValues}
                    subscribe={subscribe}
                />
            </Grid>
            <Grid item xs={12} mt={1}>
                {timestampOptions.length > 1 &&
                    <Accordion expanded={false} onChange={undefined}>
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
                            <Box my={1} display="flex" alignItems="center">
                                <Typography mx={1} minWidth="210px">Default Timestamp Column </Typography>
                                <FormControl sx={{ width: '210px', maxWidth: '210px' }}>
                                    <Autocomplete
                                        fullWidth
                                        options={timestampOptions}
                                        getOptionLabel={(option: any) => option.label}
                                        value={timestampField}
                                        disableClearable
                                        renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                                        isOptionEqualToValue={(option: any, value: any) => option.value === value.value}
                                        onChange={(event: any, newValue: Record<string, string> | null) => {
                                            handleTimeFieldChange(newValue);
                                        }}
                                    />
                                </FormControl>
                            </Box>
                        </AccordionSummary>
                    </Accordion>}
            </Grid>
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

export default IngestionConfiguration;
