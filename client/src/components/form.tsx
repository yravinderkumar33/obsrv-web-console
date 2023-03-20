import { makeStyles } from '@mui/styles';
import * as _ from 'lodash';
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
} from '@mui/material';
import { Formik, Field, Form } from 'formik';

const useStyles = makeStyles((theme: any) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const MUIForm = ({ initialValues, validationSchema = null, onSubmit, fields, children, size = {} }: any) => {
    const classes: any = useStyles;
    const { xs = 12, sm = 12, lg = 12 } = size;

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ handleChange, values, handleBlur, errors, touched }) => (
                <Form>
                    <Grid container spacing={3} justifyContent="center"
                        alignItems="center">
                        {fields.map(({ name, label, type, selectOptions, required = false, dependsOn = null, disabled = false }: any) => {

                            if (dependsOn) {
                                const { key, value } = dependsOn;
                                if (!(_.get(values, [key]) === value)) {
                                    return null
                                }
                            }

                            switch (type) {
                                case 'text':
                                    return (
                                        <Grid item xs={xs} sm={sm} lg={lg}>
                                            <Field
                                                key={name}
                                                render={() => <TextField
                                                    name={name}
                                                    label={label}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    required={required}
                                                    disabled={disabled}
                                                    variant="outlined"
                                                    fullWidth
                                                    error={touched[name] && Boolean(errors[name])}
                                                    helperText={touched[name] && String(errors[name])}
                                                />}
                                            />
                                            <TextField />
                                        </Grid>
                                    );
                                case 'checkbox':
                                    return (
                                        <Grid item xs={xs} sm={sm} lg={lg}>
                                            <FormControl fullWidth required={required}>
                                                <FormControlLabel
                                                    key={name}
                                                    disabled={disabled}
                                                    control={<Field as={Checkbox} name={name} />}
                                                    label={label}
                                                />
                                            </FormControl>
                                        </Grid>
                                    );
                                case 'radio':
                                    return (
                                        <Grid item xs={xs} sm={sm} lg={lg}>
                                            <FormControl fullWidth component="fieldset" required={required} disabled={disabled}>
                                                <FormLabel component="legend">{label}</FormLabel>
                                                <RadioGroup name={name} id={name} row onChange={handleChange} value={_.get(values, name)}>
                                                    {selectOptions.map((option: any) => (
                                                        <FormControlLabel
                                                            key={option.value}
                                                            value={option.value}
                                                            name={name}
                                                            control={<Field as={Radio} />}
                                                            label={option.label}
                                                        />
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                    );
                                case 'select':
                                    return (
                                        <Grid item xs={xs} sm={sm} lg={lg}>
                                            <FormControl fullWidth key={name} className={classes.formControl} required={required} disabled={disabled}>
                                                <InputLabel >{label}</InputLabel>
                                                <Select name={name} id={name} label={label} value={_.get(values, name)} onChange={handleChange}>
                                                    {selectOptions.map((option: any) => (<MenuItem value={option.value}>{option.label}</MenuItem>))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    );
                                default:
                                    return null;
                            }
                        })}
                        {children}
                    </Grid>
                </Form>
            )}
        </Formik>
    );
};

export default MUIForm;
