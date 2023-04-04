import { useState } from 'react';
import { Grid, Box, Typography, Alert, useTheme } from '@mui/material';
import * as _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'components/Loader';
import { IWizard } from 'types/formWizard';
import { addState } from 'store/reducers/wizard';
import AccordionSection from './components/AccordionSection';
import AddPIIDialog from './components/transformationDialogs/AddPII';
import AddTransformationExpression from './components/transformationDialogs/AddTransformationExpression';
import TimestampSelection from './components/TimestampSelection';
import { Stack } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { Button } from '@mui/material';

const pageMeta = { pageId: 'transformations', title: "Configure Data Transformations" };
const actions = [{ label: 'Mask', component: '', value: 'mask' }, { label: 'Encrypt', component: '', value: 'encrypt' }, { label: 'Custom', component: '', value: 'custom' }];

const sections = [
    {
        id: 'timestamp',
        title: 'Timestamp Field',
        description: 'Timestamp Field specifies the column or field that contains the timestamp for each data record being ingested. This enabled our platform to effectively partition, index, and query data based on the timestamps.',
        data: [],
        component: <TimestampSelection />,
        alwaysExpanded: true,
        navigation: {
            next: 'pii'
        }
    },
    {
        id: 'pii',
        title: 'PII Fields',
        description: 'PII is sensitive information that needs to be protected and kept secure to prevent identity theft, fraud, or other types of harm.  PII fields are often identified and tagged to ensure that appropriate controls are in place to protect the data',
        data: [],
        actions: [{ label: 'Mask', component: '', value: 'mask' }, { label: 'Encrypt', component: '', value: 'encrypt' }],
        submitButton: {
            label: 'Add PII',
            dialog: <AddPIIDialog />
        },
        navigation: {
            previous: 'timestamp',
            next: 'transformation'
        }
    },
    {
        id: 'transformation',
        title: 'Fields Transformation',
        description: 'Field transformations allows users to manipulate and transform data during ingestion or query time',
        data: [],
        actions,
        submitButton: {
            label: 'Add Transformation',
            dialog: < AddTransformationExpression />
        },
        navigation: {
            previous: 'pii'
        }
    }
];

const SchemaConfiguration = ({ handleNext, handleBack, index }: any) => {
    const dispatch = useDispatch();
    const apiResponse = useSelector((state: any) => state.jsonSchema);
    const wizardState: IWizard = useSelector((state: any) => state?.wizard);
    const jsonSchemaData = _.get(wizardState, 'pages.columns.state.schema') || [];
    const gotoNextSection = () => handleNext();
    const gotoPreviousSection = () => handleBack();
    const [expanded, setExpanded] = useState<string | false>('timestamp');
    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => { setExpanded(isExpanded ? panel : false) };
    const renderSection = (section: Record<string, any>) => {
        return <AccordionSection expanded={expanded} setExpanded={setExpanded} handleChange={handleChange} {...section} data={jsonSchemaData} />
    }

    return <>
        <Grid container spacing={2}>
            {apiResponse?.status !== 'success' && <Grid item xs={12} sm={12}> <Loader /></Grid>}
            {apiResponse?.status === 'error' && <Grid item xs={12} sm={12}> <Alert severity="error">{apiResponse?.error}</Alert></Grid>}
            {apiResponse?.status === 'success' &&
                <>
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
                </>
            }
        </Grid>
    </>;
};

export default SchemaConfiguration
