import { useState } from 'react';
import { Grid, Alert } from '@mui/material';
import * as _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { IWizard } from 'types/formWizard';
import FieldSection from './FieldSection';
import { Stack } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { Button } from '@mui/material';
import { sections as allSections } from 'data/wizard';
import { updateClientState } from 'services/dataset';
import { error } from 'services/toaster';

const SectionsConfiguration = ({ handleNext, handleBack, index, section, defaultExpanded }: any) => {
    const sections = _.get(allSections, section) || [];
    const wizardState: IWizard = useSelector((state: any) => state?.wizard);
    const jsonSchemaData = _.get(wizardState, 'pages.columns.state.schema') || [];
    const [expanded, setExpanded] = useState<string | false>(false);
    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => { setExpanded(isExpanded ? panel : false) };
    const dispatch = useDispatch()

    const renderSection = (sectionData: Record<string, any>, section: any) => {
        return (
            <FieldSection
                expanded={expanded}
                setExpanded={setExpanded}
                handleChange={handleChange}
                {...sectionData}
                data={jsonSchemaData}
                section={section}
                index={index}
            />
        );
    }

    const gotoNextSection = () => {
        handleNext()
        persistClientState();
    };
    const gotoPreviousSection = () => {
        handleBack()
        persistClientState();
    };

    const persistClientState = async () => {
        try {
            await updateClientState({ clientState: wizardState });
        } catch (err) {
            dispatch(error({ message: 'Failed to update state' }));
        }
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

export default SectionsConfiguration;
