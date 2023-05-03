import React, { useEffect } from 'react';
import { Button, Divider, Grid, InputAdornment, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { error } from 'services/toaster';
import { useSearchParams } from 'react-router-dom';
import { interactIds } from 'data/telemetry/interactIds';
import LoginSocialButton from './LoginSocialButton';

const AuthLogin = () => {
    const dispatch = useDispatch();
    const clientId = process.env.REACT_APP_OAUTH_CLIENT_ID || '';
    const redirectURI = process.env.REACT_APP_WEB_CONSOLE_REDIRECT_URI || '';
    const [showPassword, setShowPassword] = React.useState(false);
    const [searchParams] = useSearchParams();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.SyntheticEvent) => {
        event.preventDefault();
    };

    useEffect(() => {
        const err = searchParams.get('err');
        if (err) {
            dispatch(error({ message: err }));
        }
    }, []);

  return (
    <>
      <Formik
        initialValues={{ username: '', password: '', submit: null }}
        validationSchema={Yup.object().shape({ username: Yup.string().max(255).required('User name is required'), password: Yup.string().max(255).required('Password is required') })}
        onSubmit={async () => { }}
      >
        {({ errors, handleBlur, handleChange, isSubmitting, touched, values }) => (
          <form noValidate action='/api/oauth/authorize' method='post'>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">User Name</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    data-edataid={interactIds.button.input.email}
                    data-objectid="email-login"
                    data-objecttype="login"
                    type="text"
                    value={values.username}
                    name="username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter user name"
                    fullWidth
                    error={Boolean(touched.username && errors.username)}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <input type="hidden" value={clientId} name="client_id" />
                  <input type="hidden" value={redirectURI} name="redirect_uri" />
                  <input type="hidden" value="code" name="response_type" />
                  <input type="hidden" value="authorization_code" name="grant_type" />
                  <OutlinedInput
                    fullWidth
                    color={'primary'}
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={(event: React.FocusEvent<any, Element>) => {
                      handleBlur(event);
                    }}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          id="input-password"
                          data-edataid={showPassword ? interactIds.button.input.password.visible : interactIds.button.input.password.invisible}
                          data-objectid="input-password"
                          data-objecttype="login"
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Login
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
