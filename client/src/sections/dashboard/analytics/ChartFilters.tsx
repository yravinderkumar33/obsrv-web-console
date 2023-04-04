import { Box, Chip, Grid, MenuItem, Select, Stack, Typography, Paper } from "@mui/material"
import React, { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import * as _ from 'lodash';
import { InfoCircleOutlined } from "@ant-design/icons";
import globalConfig from 'data/initialConfig';

const ApexWithFilters = (props: any) => {
    const { title = '', filters = [], children, type = 'chip' } = props;
    const defaultFilter = _.find(filters, ['default', true]);
    const [filter, setFilter] = useState<any>(_.get(defaultFilter, 'value'));
    const [step, setStep] = useState<string>('5m');

    const getFilterMeta = (value: number) => _.find(filters, ['value', value]);

    const handlechange = (event: any) => {
        const value = _.get(event, 'target.value');
        if (value) {
            const filter = getFilterMeta(value);
            setFilter(value);
            filter && setStep(_.get(filter, 'step'));
        }
    }

    const onClickHandler = (filter: Record<string, any>) => {
        const { value, step } = filter;
        if (value && step) {
            setFilter(value);
            setStep(step);
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
            const variant = (_.get(filterMeta, 'value') === filter) ? "filled" : "outlined";
            const color = _.get(filterMeta, 'color') || "primary"
            return <Chip label={filterMeta.label} variant={variant} color={color} onClick={_ => onClickHandler(filterMeta)} key={`chip-${index}`} />
        })

        return <Stack direction="row" spacing={2}>
            {menuItems}
        </Stack>
    }

    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            const updatedProps = { interval: filter, step };
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
                                    <InfoCircleOutlined />
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
