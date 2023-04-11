import { useState } from 'react';
import { Grid } from '@mui/material';
import * as _ from 'lodash';
import { useSelector } from 'react-redux';
import { IWizard } from 'types/formWizard';
import FieldSection from './FieldSection';
import { reviewSections as allSections } from 'data/review';

const ReviewSections = ({ section, master }: any) => {
    const wizardState: IWizard = useSelector((state: any) => state?.wizard);
    const [expanded, setExpanded] = useState<string | false>(false);
    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => { setExpanded(isExpanded ? panel : false) };
    
    let sections = allSections;
    
    if (master) {
        sections = _.filter(sections, ['master', true]);
    }

    const renderSection = (sectionData: Record<string, any>, section: any) => {
        return (
            <FieldSection
                expanded={expanded}
                setExpanded={setExpanded}
                handleChange={handleChange}
                {...sectionData}
                section={section}
            />
        );
    }

    return <>
        <Grid container>
            <Grid item xs={12}>{sections.map(renderSection)}</Grid>
        </Grid>
    </>;
};

export default ReviewSections;
