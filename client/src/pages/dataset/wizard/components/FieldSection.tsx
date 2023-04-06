import { Box, Typography, AccordionDetails, Accordion, AccordionSummary, useTheme, Button, Grid } from '@mui/material';
import { ArrowRightOutlined } from '@ant-design/icons';
import * as _ from 'lodash';
import React from 'react';
import { Stack } from '@mui/material';
import MainCard from 'components/MainCard';

const FieldSection = (props: any) => {
    const { id, expanded, alwaysExpanded, title, description, componentType = "accordion", navigation, setExpanded, handleChange, ...rest } = props;

    const theme = useTheme();
    const open = (id === expanded);

    const renderNavigation = () => {
        if (!navigation) return null;
        return <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                {navigation?.next && <Button variant="outlined" endIcon={<ArrowRightOutlined />} onClick={_ => setExpanded(navigation.next)}>{_.startCase(navigation.next)}</Button>}
            </Stack>
        </Grid>
    }

    const sectionDetails = () => {
        return <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid item xs={12}>
                {_.has(rest, 'component') && React.cloneElement(rest.component, { ...props })}
            </Grid>
            {renderNavigation()}
        </Grid>
    }

    const renderAccordion = () => {
        return <Accordion expanded={open} onChange={handleChange(id)} square={false}>
            <AccordionSummary aria-controls="panel1bh-content" id="panel1bh-header">
                <Stack direction="column" spacing={1.5} alignItems="center">
                    <Typography sx={{ width: '100%', flexShrink: 0 }}> {title}</Typography>
                    {!open && <Typography variant='caption' sx={{ color: 'text.secondary' }}>{description}</Typography>}
                </Stack>
            </AccordionSummary>
            <AccordionDetails>
                {sectionDetails()}
            </AccordionDetails>
        </Accordion>
    }

    const renderBox = () => {
        return <MainCard title={title}>
            {sectionDetails()}
        </ MainCard>
    }

    const renderSection = () => {
        switch (componentType) {
            case 'box':
                return renderBox()
                break;
            default:
                return renderAccordion();
        }
    }

    return <>
        <Box
            marginBottom={2}
            sx={{
                '& .MuiAccordion-root': {
                    borderColor: theme.palette.divider,
                    '& .MuiAccordionSummary-root': {
                        bgcolor: 'transparent',
                        flexDirection: 'row'
                    },
                    '& .MuiAccordionDetails-root': {
                        borderColor: theme.palette.divider
                    },
                    '& .Mui-expanded': {
                        color: theme.palette.primary.main
                    }
                }
            }}
        >
            {renderSection()}
        </Box>
    </>
}

export default FieldSection