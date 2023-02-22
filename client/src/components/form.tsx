import { makeStyles } from '@mui/styles';
import * as _ from 'lodash';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
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

const MUIForm = ({ initialValues, validationSchema, onSubmit, fields, children }: any) => {
  const classes: any = useStyles;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12}>
              {fields.map(({ name, label, type, selectOptions }: any) => {
                switch (type) {
                  case 'text':
                    return (
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
                      />
                    );
                  case 'checkbox':
                    return (
                      <FormControl fullWidth>
                        <FormControlLabel
                          key={name}
                          control={<Field as={Checkbox} name={name} />}
                          label={label}
                        />
                      </FormControl>
                    );
                  case 'radio':
                    return (
                      <FormControl fullWidth component="fieldset" key={name}>
                        <FormLabel component="legend">{label}</FormLabel>
                        <RadioGroup row>
                          {selectOptions.map((option: any) => (
                            <FormControlLabel
                              key={option.value}
                              control={<Field as={Radio} name={name} value={option.value} />}
                              label={option.label}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    );
                  case 'select':
                    return (
                      <FormControl fullWidth key={name} className={classes.formControl}>
                        <FormLabel>{label}</FormLabel>
                        <Field as={Select} name={name} variant="outlined">
                          {selectOptions.map((option: any) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Field>
                        <FormHelperText>
                          <ErrorMessage name={name} />
                        </FormHelperText>
                      </FormControl>
                    );
                  default:
                    return null;
                }
              })}
            </Grid>
            {
              children
            }

          </Grid>
        </Form>
      )}
    </Formik>

  );
};

export default MUIForm;
