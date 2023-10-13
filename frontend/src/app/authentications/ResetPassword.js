import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import _ from '@/lodash';
import Paper from '@mui/material/Paper';
import { Link, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Logo from '@/components/layout/Logo';
import { useEffect, useState } from 'react';
import { showMessage } from '@/stores/core/messageSlice';
import { useDispatch } from 'react-redux';
import jwtService from '@/auth/jwtService';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  new_password: yup
    .string()
    .required('Please enter your new_password.')
    .min(8, 'Password is too short - should be 8 chars minimum.'),
  re_new_password: yup.string().oneOf([yup.ref('new_password'), null], 'Passwords must match'),
});

const defaultValues = {
  new_password: '',
  re_new_password: '',
};

function ResetPasswordPage() {
  const dispatch = useDispatch()
  const routeParams = useParams();
  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  function onSubmit({ new_password, re_new_password }) {
    routeParams.new_password = new_password
    routeParams.re_new_password = re_new_password
    jwtService
      .resetUserPassword(routeParams)
      .then(() => {
        dispatch(
          showMessage({
            message: 'Password has been reset successfully!',
            variant: 'success'
          })
        );
      })
      .catch(() => {
        dispatch(
          showMessage({
            message: 'This password link is expired!',
            variant: 'error'
          })
        );
      })
    reset(defaultValues);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-1 min-w-0">
      <Box
        className="relative md:flex flex-col flex-auto items-center justify-center w-full h-full p-64 lg:px-112 overflow-hidden"
        sx={{ backgroundColor: 'primary.main' }}
      >
        <svg
          className="absolute inset-0 pointer-events-none"
          viewBox="0 0 960 540"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Box
            component="g"
            sx={{ color: 'primary.light' }}
            className="opacity-20"
            fill="none"
            stroke="currentColor"
            strokeWidth="100"
          >
            <circle r="234" cx="196" cy="23" />
            <circle r="234" cx="790" cy="491" />
          </Box>
        </svg>
        <Box
          component="svg"
          className="absolute -top-64 -right-64 opacity-20"
          sx={{ color: 'primary.dark' }}
          viewBox="0 0 220 192"
          width="220px"
          height="192px"
          fill="none"
        >
          <defs>
            <pattern
              id="837c3e70-6c3a-44e6-8854-cc48c737b659"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="4" height="4" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="220" height="192" fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)" />
        </Box>

        <div className="flex flex-col flex-auto items-center sm:justify-center min-w-0">
          <Paper className="w-full sm:w-auto min-h-full sm:min-h-auto p-32 sm:rounded-2xl sm:shadow">
            <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
              <div className="flex justify-center">
                <Logo />

              </div>
              <h1 className="text-center mt-8 font-bold leading-9 tracking-tight">
                Reset your password
              </h1>
              <div className="flex justify-center items-baseline mt-2 font-medium">
                <Typography>Create a new password for your account</Typography>
              </div>

              <form
                name="resetPasswordForm"
                noValidate
                className="flex flex-col justify-center w-full mt-32"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Controller
                  name="new_password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mb-24"
                      label="Password"
                      type="password"
                      error={!!errors.new_password}
                      helperText={errors?.new_password?.message}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="re_new_password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mb-24"
                      label="Password (Confirm)"
                      type="password"
                      error={!!errors.re_new_password}
                      helperText={errors?.re_new_password?.message}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  )}
                />

                <Button
                  variant="contained"
                  color="secondary"
                  className=" w-full mt-4"
                  aria-label="Register"
                  disabled={_.isEmpty(dirtyFields) || !isValid}
                  type="submit"
                  size="large"
                >
                  Reset your password
                </Button>

                <div className="flex items-center mt-16">
                  <div className="flex-auto mt-px border-t" />
                  <div className="flex items-baseline mt-2 font-medium">
                    <Typography>Return to</Typography>
                    <Link className="ml-4" to="/sign-in">
                      Sign In
                    </Link>
                  </div>
                  <div className="flex-auto mt-px border-t" />
                </div>
              </form>
            </div>
          </Paper>
        </div>
      </Box>
    </div>

  );
}

export default ResetPasswordPage;
