import { makeStyles } from '@mui/styles';
import * as _ from 'lodash';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material';
import { Formik, Field, Form, ErrorMessage } from 'formik';

const useStyles = makeStyles((theme: any) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const MUIForm = ({ initialValues, validationSchema = null, onSubmit, fields, children }: any) => {
  const classes: any = useStyles;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, handleChange, values }) => (
        <Form>
          <Grid container spacing={1}>
            {fields.map(({ name, label, type, selectOptions, required = false, dependsOn = null }: any) => {

              if (dependsOn) {
                const { key, value } = dependsOn;
                if (!_.get(values, [key]) === value) {
                  return null
                }
              }

              switch (type) {
                case 'text':
                  return (
                    <Grid item xs={12} sm={12}>
                      <Field
                        key={name}
                        as={TextField}
                        name={name}
                        label={label}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        error={touched[name] && !!errors[name]}
                        helperText={<ErrorMessage name={name} />}
                        required={required}
                      />
                    </Grid>
                  );
                case 'checkbox':
                  return (
                    <Grid item xs={12} sm={12}>
                      <FormControl fullWidth required={required}>
                        <FormControlLabel
                          key={name}
                          control={<Field as={Checkbox} name={name} />}
                          label={label}
                        />
                      </FormControl>
                    </Grid>
                  );
                case 'radio':
                  return (
                    <Grid item xs={12} sm={12}>
                      <FormControl fullWidth component="fieldset" required={required}>
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
                    <Grid item xs={12} sm={12}>
                      <FormControl fullWidth key={name} className={classes.formControl} required={required}>
                        <InputLabel >{label}</InputLabel>
                        <Select name={name} id={name} label={label} value={_.get(values, name)} onChange={handleChange}>
                          {selectOptions.map((option: any) => (<MenuItem value={option.value}>{option.label}</MenuItem>))}
                        </Select>
                        <FormHelperText>
                          <ErrorMessage name={name} />
                        </FormHelperText>
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
