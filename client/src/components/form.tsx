import { makeStyles } from '@mui/styles';
import * as _ from 'lodash';
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, InputLabel, MenuItem, Radio, Select, Stack, TextField, ToggleButtonGroup, Tooltip } from '@mui/material';
import { Formik, Field, Form } from 'formik';
import { ToggleButton } from '@mui/material';

const useStyles = makeStyles((theme: any) => ({
    formControl: { margin: theme.spacing(1), minWidth: 120 },
    selectEmpty: { marginTop: theme.spacing(2) },
}));

const MUIForm = ({ initialValues, validationSchema = null, onSubmit, fields, children, subscribe = null, size = {}, enableReinitialize = false, }: any) => {
    const classes: any = useStyles;
    let { xs = 12, sm = 12, lg = 12 } = size;

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize={enableReinitialize}
        >
            {({ handleChange, values, handleBlur, errors, touched }) => {
                subscribe && subscribe(values);
                return (
                    <Form>
                        <Grid container spacing={3} alignItems="baseline">
                            {fields.map((field: any) => {
                                const { name, tooltip = '', label, type, selectOptions, required = false, dependsOn = null, disabled = false } = field;

                                if (dependsOn) {
                                    const { key, value } = dependsOn;
                                    if (!(_.get(values, [key]) === value)) {
                                        return null
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
                                                                onChange={handleChange}
                                                                variant="outlined"
                                                                fullWidth
                                                                autoComplete="off"
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
                                                                onChange={handleChange}
                                                                variant="outlined"
                                                                fullWidth
                                                                autoComplete="off"
                                                                type='number'
                                                                {...field}
                                                            />
                                                        </Tooltip>
                                                    </>}
                                                />
                                            </Grid>
                                        );
                                    case 'checkbox':
                                        return (
                                            <Grid item xs={xs} sm={sm} lg={lg} key={name}>
                                                <Tooltip title={tooltip}>
                                                    <FormGroup>
                                                        <Stack direction="row" spacing={1}>
                                                            {selectOptions.map((option: any) => {
                                                                const { value, label } = option;
                                                                return <FormControlLabel key={`${name}-${value}`} name={name} disabled={disabled} control={<Checkbox name={name} className="size-medium" checked={_.includes(_.get(values, name), value)} value={value} onChange={handleChange} />} label={label} />
                                                            })}
                                                        </Stack>
                                                    </FormGroup>
                                                </Tooltip>
                                            </Grid>
                                        );
                                    case 'radio':
                                        return (
                                            <Grid item xs={xs} sm={sm} lg={lg} key={name}>
                                                <Tooltip title={tooltip}>
                                                    <FormGroup>
                                                        <Stack direction="row" spacing={1}>
                                                            {selectOptions.map((option: any) => {
                                                                const { value, label } = option;
                                                                return <FormControlLabel key={`${name}-${value}`} name={name} disabled={disabled} control={<Radio name={name} className="size-medium" checked={value === _.get(values, name)} value={value} onChange={handleChange} />} label={label} />
                                                            })}
                                                        </Stack>
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
                                                        <Select name={name} id={name} label={label} value={_.get(values, name)} onChange={handleChange}>
                                                            {selectOptions.map((option: any) => (<MenuItem value={option.value}>{option.label}</MenuItem>))}
                                                        </Select>
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
                                                        <ToggleButtonGroup exclusive color="info" aria-label="text alignment" onChange={handleChange}>
                                                            {
                                                                selectOptions.map((option: any, index: number) => {
                                                                    return <ToggleButton key={index} id={name} value={option.value} aria-label="first">
                                                                        {option?.label}
                                                                    </ToggleButton>
                                                                })
                                                            }
                                                        </ToggleButtonGroup>
                                                    </FormControl>
                                                </Tooltip>
                                            </Grid>
                                        );
                                    default:
                                        return null;
                                }
                            })}
                            {children}
                        </Grid>
                    </Form>
                )
            }}
        </Formik >
    );
};

export default MUIForm;
