import { useMemo } from 'react';
import {
    Grid, Box, Stack, Typography,
    Accordion, Alert, AccordionDetails,
    Paper, Collapse, AccordionSummary, Button,
} from '@mui/material';
import { CheckCircleOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';
import * as _ from 'lodash';

interface Props {
    flattenedData: Array<Record<string, any>>;
    showSuggestions: boolean;
    setRequiredFilter: React.Dispatch<React.SetStateAction<string>>;
}

const CollapsibleSuggestions = ({ showSuggestions = false, flattenedData, setRequiredFilter }: Props) => {

    const getSuggestionCount = useMemo(() => {
        let count = 0;
        _.map(flattenedData, (item) => {
            if (_.has(item, 'suggestions'))
                count += item.suggestions.length;
        });
        return count;
    }, [flattenedData]);

    const getRequiredFields = useMemo(() => {
        let requiredCount = 0;
        let notRequiredCount = 0;
        let totalCount = 0;
        _.map(flattenedData, (item) => {
            if (_.has(item, 'required') && item.required)
                requiredCount += 1;
            else notRequiredCount += 1;
            totalCount += 1;
        });
        return { requiredCount, totalCount, notRequiredCount };
    }, [flattenedData]);

    const formatNumber = (val: number) => {
        return val.toString().padStart(2, '0');
    }

    return (
        <Box>
            <Collapse orientation="vertical" in={showSuggestions}>
                <Paper elevation={2} sx={{ mb: 2, p: 1 }}>
                    <Accordion sx={{ m: 1 }} square={false} defaultExpanded={true}>
                        <AccordionSummary aria-controls="data-type-suggestions" id="data-type-suggestions-header">
                            <Typography variant="h6">
                                {`Data type suggestions - Total (${getSuggestionCount})`}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 1, maxHeight: 270, overflow: 'auto' }}>
                            {_.map(flattenedData, (payload, index) => {
                                let resolved = payload.resolved ? payload.resolved : false;
                                if (_.has(payload, 'suggestions')) {
                                    return (
                                        <Stack key={index} direction="column" mb={0.5}>
                                            {
                                                _.map(payload.suggestions, suggestion => {
                                                    if (suggestion.severity === 'MUST-FIX' && resolved)
                                                        return (
                                                            <Grid key={Math.random()} item xs={12} mx={1} my={0.5}>
                                                                <Alert color="success" icon={<CheckCircleOutlined />}>
                                                                    <Typography>{suggestion.message}</Typography>
                                                                    <Typography>{suggestion.advice}</Typography>
                                                                </Alert>
                                                            </Grid>
                                                        );
                                                    else if (suggestion.severity === 'MUST-FIX' && !resolved) return (
                                                        <Grid key={Math.random()} item xs={12} mx={1} my={0.5}>
                                                            <Alert color="warning" icon={<WarningOutlined />}>
                                                                <Typography>{suggestion.message}</Typography>
                                                                <Typography>{suggestion.advice}</Typography>
                                                            </Alert>
                                                        </Grid>
                                                    )
                                                    else return (
                                                        <Grid key={Math.random()} item xs={12} mx={1} my={0.5}>
                                                            <Alert color="info" icon={<InfoCircleOutlined />}>
                                                                <Typography>{suggestion.message}</Typography>
                                                                <Typography>{suggestion.advice}</Typography>
                                                            </Alert>
                                                        </Grid>
                                                    )
                                                })
                                            }
                                        </Stack>
                                    );
                                }
                                else return null;
                            })}
                        </AccordionDetails>
                    </Accordion>
                    <Accordion sx={{ m: 1 }} square={false}>
                        <AccordionSummary aria-controls="required-suggestions" id="required-suggestions-header">
                            <Typography variant="h6">
                                Required field suggestions
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack direction="column">
                                <Box display="flex" alignItems="center">
                                    <Typography>
                                        {`${formatNumber(getRequiredFields.requiredCount)}/${formatNumber(getRequiredFields.totalCount)}`} are marked as required
                                    </Typography>
                                    <Typography mx={6} component={Button} onClick={() => setRequiredFilter("true")} sx={{ textTransform: 'unset' }}>
                                        Review all fields marked as required
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <Typography>
                                        {`${formatNumber(getRequiredFields.notRequiredCount)}/${formatNumber(getRequiredFields.totalCount)}`} are marked as optional
                                    </Typography>
                                    <Typography component={Button} onClick={() => setRequiredFilter("false")} mx={6} sx={{ textTransform: 'unset' }}>
                                        Review all fields marked as optional
                                    </Typography>
                                </Box>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                </Paper>
            </Collapse>
        </Box>
    );
};

export default CollapsibleSuggestions;
