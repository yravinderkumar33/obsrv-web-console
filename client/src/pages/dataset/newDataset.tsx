import {
    Grid
} from '@mui/material';
import NewDatasetOnboardingWizard from './wizard';

const NewDataset = () => {
    return (
        <Grid container rowSpacing={4.5} columnSpacing={3}>
            <Grid item xs={12}>
                <NewDatasetOnboardingWizard />
            </Grid>
        </Grid>
    )
};

export default NewDataset;
