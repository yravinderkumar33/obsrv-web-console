import { Box, Chip, Grid, MenuItem, Select, Stack, Typography, Paper, Tooltip } from "@mui/material"
import { v4 } from 'uuid'
import React, { useState } from 'react';
import MainCard from 'components/MainCard';
import * as _ from 'lodash';
import { InfoCircleOutlined } from "@ant-design/icons";
import globalConfig from 'data/initialConfig';
import dayjs from 'dayjs';
import interactIds from "data/telemetry/interact.json";

const transformFilter = (filter: Record<string, any>) => {

    if (_.toLower(_.get(filter, 'label')) === "today") {
        const now = dayjs();
        const minutesSinceStartOfDay = now.hour() * 60 + now.minute();
        return { ...filter, value: minutesSinceStartOfDay }
    }

    return filter;
}

const ApexWithFilters = (props: any) => {
    const { title = '', filters = [], children, type = 'chip', description = '', id = v4() } = props;
    const defaultFilter = transformFilter(_.find(filters, ['default', true]));
    const [filter, setFilter] = useState<any>(_.get(defaultFilter, 'value'));
    const [step, setStep] = useState<string>(_.get(defaultFilter, 'step') || '5m');
    const [filterMeta, setFilterMeta] = useState<any>(defaultFilter || {});

    const getFilterMeta = (value: number) => _.find(filters, ['value', value]);

    const handlechange = (event: any) => {
        const value = _.get(event, 'target.value');
        if (value) {
            const filter = transformFilter(getFilterMeta(value));
            if (filter) {
                setFilterMeta(filter);
                setFilter(_.get(filter, 'value'));
                setStep(_.get(filter, 'step'));
            }
        }
    }

    const onClickHandler = (filter: Record<string, any>) => {
        const { value, step } = transformFilter(filter);
        if (value && step) {
            setFilter(value);
            setStep(step);
            setFilterMeta(filter);
        }
    }

    const renderFilters = () => {
        const menuItems = _.map(filters, (filter: Record<string, any>, index) => {
            return <MenuItem value={filter.value} key={`filter-${index}`}>{filter.label}</MenuItem>
        })

        return <Select value={filter} size="small" onChange={handlechange}>{menuItems}</ Select>
    }
    const renderChipFilters = () => {
        const menuItems = _.map(filters, (filterMeta: Record<string, any>, index) => {
            const transformedFilter = transformFilter(filterMeta);
            const variant = (_.get(transformedFilter, 'value') === filter) ? "filled" : "outlined";
            const color = _.get(filterMeta, 'color') || "primary"
            return <Chip
                data-edataid={interactIds.chart_filter}
                data-objectid={`${title}:${filterMeta.label}`}
                data-objecttype="chart"
                label={<div
                    data-edataid={`${interactIds.chart_filter}:${filterMeta.telemetryId}`}
                    data-objectid={id}
                    data-objecttype="chart"
                >{filterMeta.label}</div>}
                variant={variant} color={color} onClick={_ => onClickHandler(filterMeta)} key={`chip-${index}`} />
        })
        return <Stack direction="row" spacing={2}> {menuItems}</Stack>
    }

    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            const updatedProps = { interval: filter, step, ...filterMeta };
            return React.cloneElement(child, updatedProps);
        }
        return child;
    });

    return <>
        <Paper elevation={globalConfig.elevation}>
            <MainCard content={false} sx={{ mt: 1.5 }}>
                <Grid item>
                    <Grid container>
                        <Grid item xs={12} sm={12}>
                            <Stack sx={{ ml: 2, mt: 3 }} alignItems={{ xs: 'center', sm: 'flex-start' }}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Typography color="textSecondary">{title}</Typography>
                                    <Tooltip title={description}>
                                        <InfoCircleOutlined />
                                    </Tooltip>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                justifyContent={{ xs: 'center', sm: 'flex-start' }}
                                sx={{ mt: 1, ml: 2 }}
                            >

                                {(filters.length && type === 'chip') ? renderChipFilters() : null}
                                {(filters.length && type === 'select') ? renderFilters() : null}
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
                <Box sx={{ pt: 1 }}>
                    {childrenWithProps}
                </Box>
            </MainCard>
        </Paper>
    </>
}

export default ApexWithFilters;
