import { useState } from 'react';
import { Grid, Alert } from '@mui/material';
import * as _ from 'lodash';
import { useSelector } from 'react-redux';
import { IWizard } from 'types/formWizard';
import FieldSection from './components/FieldSection';
import { Stack } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { Button } from '@mui/material';
import { sections as fieldsSections } from 'data/wizard/fields';

const sections = fieldsSections;

const SchemaConfiguration = ({ handleNext, handleBack, index }: any) => {
    const wizardState: IWizard = useSelector((state: any) => state?.wizard);
    const jsonSchemaData = _.get(wizardState, 'pages.columns.state.schema') || [];
    const gotoNextSection = () => handleNext();
    const gotoPreviousSection = () => handleBack();
    const [expanded, setExpanded] = useState<string | false>('timestamp');
    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => { setExpanded(isExpanded ? panel : false) };

    const renderSection = (section: Record<string, any>) => {
        return <FieldSection expanded={expanded} setExpanded={setExpanded} handleChange={handleChange} {...section} data={jsonSchemaData} />
    }

    return <>
        <Grid container>
            <Grid item xs={12}>{sections.map(renderSection)}</Grid>
            <Grid item xs={12}>
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
        </Grid>
    </>;
};

export default SchemaConfiguration
