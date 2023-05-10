import { makeStyles } from '@mui/styles';
import * as _ from 'lodash';
import { Autocomplete, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid, InputLabel, MenuItem, Radio, Select, Stack, TextField, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { ToggleButton } from '@mui/material';
import interactIds from 'data/telemetry/interact.json';
import { useCallback, useEffect } from 'react';

const useStyles = makeStyles((theme: any) => ({
    formControl: { margin: theme.spacing(1), minWidth: 120 },
    selectEmpty: { marginTop: theme.spacing(2) },
}));

const MUIForm = ({ initialValues, validationSchema = null, onSubmit, fields, children, subscribe = null, subscribeErrors = null, size = {}, enableReinitialize = false, formComponent = null, customUpdate = null, }: any) => {
    const classes: any = useStyles;
    let { xs = 12, sm = 12, lg = 12 } = size;
    const form = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: onSubmit,
        enableReinitialize: enableReinitialize,
    });

    const handleAutoComplete = (setFieldValue: any, value: any, multiple: boolean, name: string) => {
        if (multiple) {
            setFieldValue(name, value);
        } else setFieldValue(name, value.value);
    }

    useEffect(() => {
        subscribe && subscribe(form.values);
    }, [form.values]);

    useEffect(() => {
        subscribeErrors && subscribeErrors(form.errors)
    }, [form.errors]);

    const customUpdateValue = useCallback(() => (key: any, value: any) => form.setFieldValue(key, value), []);

    useEffect(() => {
        customUpdate && customUpdate(customUpdateValue);
    }, []);

    return (
        <form onSubmit={form.handleSubmit}>
            <Grid container spacing={3} alignItems="baseline">
                {fields.map((field: any) => {
                    const {
                        name, tooltip = '', label, type, dependsOn = null,
                        selectOptions, required = false, helperText = '',
                        disabled = false, multiple = false, filterInclude = false,
                    } = field;
                    const helpText = helperText && helperText || field.helperText;

                    if (dependsOn) {
                        const { key, value } = dependsOn;
                        if (filterInclude) {
                            if (!_.includes(_.get(form.values, key), value) && !(_.get(form.values, [key]) === value))
                                return null;
                        } else {
                            if (!(_.get(form.values, [key]) === value))
                                return null;
                        }
                    }

                    switch (type) {
                        case 'text':
                            return (
                                <Grid item xs={xs} sm={sm} lg={lg} key={name}>
                                    <Tooltip title={tooltip}>
                                        <TextField
                                            value={_.get(form.values, [name])}
                                            onChange={form.handleChange}
                                            variant="outlined"
                                            fullWidth
                                            autoComplete="off"
                                            onBlur={form.handleBlur}
                                            error={Boolean(form.errors[name])}
                                            helperText={form.touched[name] && form.errors[name] && String(form.errors[name]) || helpText}
                                            {...field}
                                        />
                                    </Tooltip>
                                </Grid>
                            );
                        case 'number':
                            return (
                                <Grid item xs={xs} sm={sm} lg={lg} key={name}>
                                    <Tooltip title={tooltip}>
                                        <TextField
                                            value={_.get(form.values, [name])}
                                            onChange={form.handleChange}
                                            variant="outlined"
                                            fullWidth
                                            autoComplete="off"
                                            type='number'
                                            onBlur={form.handleBlur}
                                            error={Boolean(form.errors[name])}
                                            helperText={form.touched[name] && form.errors[name] && String(form.errors[name]) || helpText}
                                            {...field}
                                        />
                                    </Tooltip>
                                </Grid>
                            );
                        case 'checkbox':
                            return (
                                <Grid item xs={xs} sm={sm} lg={lg} key={name} alignSelf="flex-start">
                                    <Tooltip title={tooltip}>
                                        <FormGroup>
                                            <Stack direction="row" spacing={1}>
                                                {selectOptions.map((option: any) => {
                                                    const { value, label } = option;
                                                    return <FormControlLabel key={`${name}-${value}`} name={name} disabled={disabled} control={<Checkbox onBlur={form.handleBlur} name={name} className="size-medium" checked={_.includes(_.get(form.values, name), value)} value={value} onChange={form.handleChange} />} label={label} />
                                                })}
                                            </Stack>
                                        </FormGroup>
                                    </Tooltip>
                                    <FormHelperText error={Boolean(form.errors[name])}>{form.touched[name] && form.errors[name] && String(form.errors[name]) || helpText}</FormHelperText>
                                </Grid>
                            );
                        case 'radio':
                            return (
                                <Grid item xs={xs} sm={sm} lg={lg} key={name}>
                                    <Tooltip title={tooltip}>
                                        <FormGroup>
                                            <Typography variant="h6" fontWeight="500" aria-label='form-label' gutterBottom>
                                                {label}
                                            </Typography>
                                            <Stack direction="row" spacing={1}>
                                                {selectOptions.map((option: any) => {
                                                    const { value, label } = option;
                                                    return <FormControlLabel key={`${name}-${value}`} name={name} disabled={disabled} control={<Radio onBlur={form.handleBlur} name={name} className="size-medium" checked={value === _.get(form.values, name)} value={value} onChange={form.handleChange} required={required} />} label={label} />
                                                })}
                                            </Stack>
                                        </FormGroup>
                                    </Tooltip>
                                    <FormHelperText error={Boolean(form.errors[name])}>{form.touched[name] && form.errors[name] && String(form.errors[name]) || helpText}</FormHelperText>
                                </Grid>
                            );
                        case 'select':
                            return (
                                <Grid item xs={xs} sm={sm} lg={lg} key={name}>
                                    <Tooltip title={tooltip}>
                                        <FormControl fullWidth key={name} className={classes.formControl} required={required} disabled={disabled}>
                                            <InputLabel >{label}</InputLabel>
                                            <Select
                                                name={name} id={name} label={label} value={_.get(form.values, name)} onChange={form.handleChange} onBlur={form.handleBlur}>
                                                {selectOptions.map((option: any) => (<MenuItem data-edataid={`${interactIds.form_select_option}:${option.label}`} value={option.value}>{option.label}</MenuItem>))}
                                            </Select>
                                        </FormControl>
                                    </Tooltip>
                                    <FormHelperText error={Boolean(form.errors[name])}>{form.touched[name] && form.errors[name] && String(form.errors[name]) || helpText}</FormHelperText>
                                </Grid>
                            );
                        case 'autocomplete':
                            const val = _.find(selectOptions, (item) => item.value === _.get(form.values, name))
                            return (
                                <Grid item xs={xs} sm={sm} lg={lg} key={name}>
                                    <Tooltip title={tooltip}>
                                        <FormControl fullWidth key={name} className={classes.formControl} required={required} disabled={disabled}>
                                            <Autocomplete
                                                id={name}
                                                value={val}
                                                disableClearable
                                                options={selectOptions}
                                                getOptionLabel={(option: any) => option.label}
                                                multiple={multiple}
                                                isOptionEqualToValue={(option: any) => option.value === _.get(form.values, name)}
                                                onChange={(e, value) => handleAutoComplete(form.setFieldValue, value, multiple, name)}
                                                renderInput={(params) => <TextField {...params} name={name} label={label} onBlur={form.handleBlur} error={Boolean(form.errors[name])} helperText={form.touched[name] && form.errors[name] && String(form.errors[name]) || helpText} />}
                                            />
                                        </FormControl>
                                    </Tooltip>
                                </Grid>
                            );
                        case 'buttonGroup':
                            return (
                                <Grid item xs={xs} sm={sm} lg={lg} key={name}>
                                    <Tooltip title={tooltip}>
                                        <FormControl fullWidth component="fieldset" required={required} disabled={disabled}>
                                            <FormLabel component="legend">{label}</FormLabel>
                                            <ToggleButtonGroup exclusive color="info" aria-label="text alignment" onChange={form.handleChange} onBlur={form.handleBlur}>
                                                {
                                                    selectOptions.map((option: any, index: number) => {
                                                        return <ToggleButton data-edataid={`${interactIds.form_button}:${name}:${option.value}`} key={index} id={name} value={option.value} aria-label="first">
                                                            {option?.label}
                                                        </ToggleButton>
                                                    })
                                                }
                                            </ToggleButtonGroup>
                                        </FormControl>
                                    </Tooltip>
                                    <FormHelperText error={Boolean(form.errors[name])}>{form.touched[name] && form.errors[name] && String(form.errors[name]) || helpText}</FormHelperText>
                                </Grid>
                            );
                        default:
                            return null;
                    }
                })}
                {children}
                {formComponent && <Grid item xs={xs} sm={sm} lg={lg} alignSelf="flex-start">{formComponent}</Grid>}
            </Grid>
        </form>
    );
};

export default MUIForm;
