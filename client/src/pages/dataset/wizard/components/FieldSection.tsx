import {
    Box, Typography, AccordionDetails, Accordion,
    AccordionSummary, useTheme, Button, Grid
} from '@mui/material';
import { ArrowRightOutlined } from '@ant-design/icons';
import * as _ from 'lodash';
import React from 'react';
import { Stack } from '@mui/material';
import MainCard from 'components/MainCard';
import config from 'data/initialConfig';
import { useDispatch, useSelector } from 'react-redux';
import { updateClientState } from 'services/dataset';
import { error } from 'services/toaster';
const { spacing } = config;

const FieldSection = (props: any) => {
    const { id, expanded, alwaysExpanded, title, description, componentType = "accordion", navigation, setExpanded, handleChange, index, master, section, noMasterNav, noGrid = false, ...rest } = props;
    const theme = useTheme();
    const open = (id === expanded);
    const clientState: any = useSelector((state: any) => state?.wizard);
    const dispatch = useDispatch()

    const persistClientState = async () => {
        try {
            await updateClientState({ clientState })
        } catch (err) {
            dispatch(error({ message: 'Failed to update state' }));
        }
    }

    const navigate = () => {
        persistClientState();
        setExpanded(navigation.next);
    }

    const renderNavigation = () => {
        if (!navigation) return null;
        if (master && noMasterNav) return null;
        return <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
                {navigation?.next && <Button data-edataid={`${master ? 'masterDataset' : 'master'}:step:${index}:${section}`} data-objectid={_.startCase(navigation.next)} data-objecttype={master ? 'masterDataset' : 'master'} variant="outlined" endIcon={<ArrowRightOutlined />} onClick={_ => navigate()}>{_.startCase(navigation.next)}</Button>}
            </Stack>
        </Grid>
    }

    const sectionDetails = () => {
        if (noGrid) return (_.has(rest, 'component') && React.cloneElement(rest.component, { ...props }));
        return (
            <Grid container rowSpacing={spacing} columnSpacing={spacing}>
                <Grid item xs={12}>
                    {_.has(rest, 'component') && React.cloneElement(rest.component, { ...props })}
                </Grid>
            </Grid>
        );
    }

    const renderAccordion = () => {
        return <Accordion expanded={open} onChange={handleChange(id)} square={false}>
            <AccordionSummary
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                sx={{ px: 2, py: 3 }}
            >
                <Stack direction="column" spacing={spacing} alignItems="center">
                    <Typography sx={{ width: '100%', flexShrink: 0 }} variant="h5">{title}</Typography>
                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>{description}</Typography>
                </Stack>
            </AccordionSummary>
            <AccordionDetails sx={noGrid ? { p: 0 } : {}}>
                {sectionDetails()}
            </AccordionDetails>
        </Accordion>
    }

    const renderBox = () => {
        return <MainCard title={title} tagLine={description} headerSX={{ p: 0, px: 2, pt: 3, }}>
            {sectionDetails()}
        </ MainCard>
    }

    const renderSection = () => {
        switch (componentType) {
            case 'box':
                return renderBox();
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
                    },
                }
            }}
        >
            {renderSection()}
        </Box>
    </>
}

export default FieldSection;
