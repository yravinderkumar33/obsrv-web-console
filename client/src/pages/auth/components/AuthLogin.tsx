import React, { useEffect } from 'react';
import { Button, Divider, Grid, InputAdornment, InputLabel, OutlinedInput, Stack } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { error } from 'services/toaster';
import { useSearchParams } from 'react-router-dom';
import LoginSocialButton from './LoginSocialButton';
import interactEdataIds from 'data/telemetry/interact.json'

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
          <form noValidate action='/api/oauth/v1/login' method='post'>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">User Name</InputLabel>
                  <OutlinedInput
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
                          data-edataid={showPassword ? interactEdataIds.password_visible : interactEdataIds.password_invisble}
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
                  <Button data-edataid={interactEdataIds.login} disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Login
                  </Button>
                </AnimateButton>
              </Grid>
              <Grid item xs={12}>
                <LoginSocialButton />
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
