import { Box, Typography, AccordionDetails, Accordion, AccordionSummary, useTheme, Button, Grid } from '@mui/material';
import { ArrowRightOutlined, CaretUpOutlined } from '@ant-design/icons';
import InputAccordion from './InputAccordion';
import * as _ from 'lodash';
import React from 'react';
import { Stack } from '@mui/material';

const AccordionSection = (props: any) => {
    const { id, expanded, alwaysExpanded, title, description, navigation, setExpanded, handleChange, ...rest } = props;
    const theme = useTheme();
    const open = alwaysExpanded ? true : (id === expanded);
    return <>
        <Box
            marginBottom={1}
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
            <Accordion expanded={open} onChange={handleChange(id)} square={false}>
                <AccordionSummary expandIcon={<CaretUpOutlined />} aria-controls="panel1bh-content" id="panel1bh-header">
                    <Typography sx={{ width: '20%', flexShrink: 0 }}> {title}</Typography>
                    {!open && <Typography variant='caption' sx={{ color: 'text.secondary' }}>{description}</Typography>}
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container rowSpacing={2} columnSpacing={2}>
                        <Grid item xs={12}>
                            {_.has(rest, 'component') && React.cloneElement(rest.component, { description, ...rest })}
                        </Grid>
                        <Grid item xs={12}>
                            {_.has(rest, 'actions') && <InputAccordion title={id} description={description} {...rest} />}
                        </Grid>
                        {!alwaysExpanded && navigation && <Grid item xs={12}>
                            <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                                {navigation?.next && <Button variant="outlined" endIcon={<ArrowRightOutlined />} onClick={_ => setExpanded(navigation.next)}>{_.startCase(navigation.next)}</Button>}
                            </Stack>
                        </Grid>}
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Box>
    </>
}

export default AccordionSection