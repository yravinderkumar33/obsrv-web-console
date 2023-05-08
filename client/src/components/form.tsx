import { makeStyles } from '@mui/styles';
import * as _ from 'lodash';
import { Autocomplete, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid, InputLabel, MenuItem, Radio, Select, Stack, TextField, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import { Formik, Field, Form } from 'formik';
import { ToggleButton } from '@mui/material';

const useStyles = makeStyles((theme: any) => ({
    formControl: { margin: theme.spacing(1), minWidth: 120 },
    selectEmpty: { marginTop: theme.spacing(2) },
}));

const MUIForm = ({ initialValues, validationSchema = null, onSubmit, fields, children, subscribe = null, subscribeErrors = null, size = {}, enableReinitialize = false, formComponent = null }: any) => {
    const classes: any = useStyles;
    let { xs = 12, sm = 12, lg = 12 } = size;

    const handleAutoComplete = (setFieldValue: any, value: any, multiple: boolean, name: string) => {
        if (multiple) {
            setFieldValue(name, value);
        } else setFieldValue(name, value.value);
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize={enableReinitialize}
        >
            {({ handleChange, values, errors, setFieldValue, handleBlur, touched }) => {
                subscribe && subscribe(values);
                subscribeErrors && subscribeErrors(errors);
                return (
                    <Form>
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
                                        if (!_.includes(_.get(values, key), value) && !(_.get(values, [key]) === value))
                                            return null;
                                    } else {
                                        if (!(_.get(values, [key]) === value))
                                            return null;
                                    }
                                }

                                switch (type) {
                                    case 'text':
                                        return (
                                            <Grid item xs={xs} sm={sm} lg={lg} key={name}>
                                                <Field
                                                    key={name}
                                                    render={() => <>
                                                        <Tooltip title={tooltip}>
                                                            <TextField
                                                                value={_.get(values, [name])}
                                                                onChange={handleChange}
                                                                variant="outlined"
                                                                fullWidth
                                                                autoComplete="off"
                                                                onBlur={handleBlur}
                                                                error={Boolean(errors[name])}
                                                                helperText={touched[name] && errors[name] && String(errors[name]) || helpText}
                                                                {...field}
                                                            />
                                                        </Tooltip>
                                                    </>}
                                                />
                                            </Grid>
                                        );
                                    case 'number':
                                        return (
                                            <Grid item xs={xs} sm={sm} lg={lg} key={name}>
                                                <Field
                                                    key={name}
                                                    render={() => <>
                                                        <Tooltip title={tooltip}>
                                                            <TextField
                                                                value={_.get(values, [name])}
                                                                onChange={handleChange}
                                                                variant="outlined"
                                                                fullWidth
                                                                autoComplete="off"
                                                                type='number'
                                                                onBlur={handleBlur}
                                                                error={Boolean(errors[name])}
                                                                helperText={touched[name] && errors[name] && String(errors[name]) || helpText}
                                                                {...field}
                                                            />
                                                        </Tooltip>
                                                    </>}
                                                />
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
                                                                return <FormControlLabel key={`${name}-${value}`} name={name} disabled={disabled} control={<Checkbox onBlur={handleBlur} name={name} className="size-medium" checked={_.includes(_.get(values, name), value)} value={value} onChange={handleChange} />} label={label} />
                                                            })}
                                                        </Stack>
                                                        <FormHelperText error={Boolean(errors[name])}>{touched[name] && errors[name] && String(errors[name]) || helpText}</FormHelperText>
                                                    </FormGroup>
                                                </Tooltip>
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
                                                                return <FormControlLabel key={`${name}-${value}`} name={name} disabled={disabled} control={<Radio onBlur={handleBlur} name={name} className="size-medium" checked={value === _.get(values, name)} value={value} onChange={handleChange} />} label={label} />
                                                            })}
                                                        </Stack>
                                                        <FormHelperText error={Boolean(errors[name])}>{touched[name] && errors[name] && String(errors[name]) || helpText}</FormHelperText>
                                                    </FormGroup>
                                                </Tooltip>
                                            </Grid>
                                        );
                                    case 'select':
                                        return (
                                            <Grid item xs={xs} sm={sm} lg={lg} key={name}>
                                                <Tooltip title={tooltip}>
                                                    <FormControl fullWidth key={name} className={classes.formControl} required={required} disabled={disabled}>
                                                        <InputLabel >{label}</InputLabel>
                                                        <Select
                                                            name={name} id={name} label={label} value={_.get(values, name)} onChange={handleChange} onBlur={handleBlur}>
                                                            {selectOptions.map((option: any) => (<MenuItem data-edataid={`form:select:${option.value}`} value={option.value}>{option.label}</MenuItem>))}
                                                        </Select>
                                                        <FormHelperText error={Boolean(errors[name])}>{touched[name] && errors[name] && String(errors[name]) || helpText}</FormHelperText>
                                                    </FormControl>
                                                </Tooltip>
                                            </Grid>
                                        );
                                    case 'autocomplete':
                                        return (
                                            <Grid item xs={xs} sm={sm} lg={lg} key={name}>
                                                <Tooltip title={tooltip}>
                                                    <FormControl fullWidth key={name} className={classes.formControl} required={required} disabled={disabled}>
                                                        <Autocomplete
                                                            id={name}
                                                            value={_.get(values, name)}
                                                            options={selectOptions}
                                                            getOptionLabel={(option: any) => option.label}
                                                            multiple={multiple}
                                                            onChange={(e, value) => handleAutoComplete(setFieldValue, value, multiple, name)}
                                                            renderInput={(params) => <TextField {...params} name={name} label={label} onBlur={handleBlur} error={Boolean(errors[name])} helperText={touched[name] && errors[name] && String(errors[name]) || helpText} />}
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
                                                        <ToggleButtonGroup exclusive color="info" aria-label="text alignment" onChange={handleChange} onBlur={handleBlur}>
                                                            {
                                                                selectOptions.map((option: any, index: number) => {
                                                                    return <ToggleButton data-edataid={`form:buttonGroup:${name}:${option.value}`} key={index} id={name} value={option.value} aria-label="first">
                                                                        {option?.label}
                                                                    </ToggleButton>
                                                                })
                                                            }
                                                        </ToggleButtonGroup>
                                                        <FormHelperText error={Boolean(errors[name])}>{touched[name] && errors[name] && String(errors[name]) || helpText}</FormHelperText>
                                                    </FormControl>
                                                </Tooltip>
                                            </Grid>
                                        );
                                    default:
                                        return null;
                                }
                            })}
                            {children}
                            {formComponent && <Grid item xs={xs} sm={sm} lg={lg} alignSelf="flex-start">{formComponent}</Grid>}
                        </Grid>
                    </Form>
                )
            }}
        </Formik >
    );
};

export default MUIForm;
