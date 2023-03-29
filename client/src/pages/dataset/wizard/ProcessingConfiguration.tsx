import BooleanAccordion from "./components/BooleanAccordion";
import batchConfig from "data/batchConfigurations";
import {
    Grid, Stack, Button
} from "@mui/material";
import { addState } from 'store/reducers/wizard';
import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import * as _ from 'lodash';
import AnimateButton from "components/@extended/AnimateButton";

export const pageMeta = { pageId: 'processingConfiguration', title: "Processing Configuration" };

const ProcessingConfiguration = ({ handleBack, handleNext, setErrorIndex, index }: any) => {
    const [updatedConfig, setUpdatedConfig] = useState(batchConfig);
    const [formValues, subscribe] = useState<any>({});
    const dispatch = useDispatch();

    const persistState = () => dispatch(addState(
        {
            id: pageMeta.pageId,
            index,
            state: { configurations: stateToRedux() }
        }
    ));

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

    const gotoNextSection = () => {
        persistState();
        handleNext();
    }

    const gotoPreviousSection = () => {
        persistState();
        handleBack();
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <BooleanAccordion
                    index={index}
                    configuration={batchConfig}
                    pageMeta={pageMeta}
                    updatedConfig={updatedConfig}
                    setUpdatedConfig={setUpdatedConfig}
                    formValues={formValues}
                    subscribe={subscribe}
                />
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

export default ProcessingConfiguration;
