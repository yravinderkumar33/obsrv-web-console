import { Grid, Stack, Button } from "@mui/material";
import { useDispatch } from 'react-redux';
import * as _ from 'lodash';
import AnimateButton from "components/@extended/AnimateButton";
import { sections as inputSections } from 'data/wizard/input';
import FieldSection from "./components/FieldSection";
import { useState } from "react";

const sections = inputSections;

const InputConfiguration = ({ handleBack, handleNext, setErrorIndex, index }: any) => {
    const [expanded, setExpanded] = useState<string | false>(false);
    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => { setExpanded(isExpanded ? panel : false) };

    const gotoNextSection = () => {
        handleNext();
    }

    const gotoPreviousSection = () => {
        handleBack();
    }

    const renderSection = (section: Record<string, any>) => {
        return <FieldSection expanded={expanded} setExpanded={setExpanded} handleChange={handleChange} {...section} />
    }

    return (
        <Grid container>
            <Grid item xs={12}>{sections.map(renderSection)}</Grid>
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

export default InputConfiguration;
