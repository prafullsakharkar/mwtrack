import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@/lodash';
import history from '@/history';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import jwtService from '@/auth/jwtService';
import Logo from '@/components/layout/Logo';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  displayName: yup.string().required('You must enter display name'),
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
  password: yup
    .string()
    .required('Please enter your password.')
    .min(8, 'Password is too short - should be 8 chars minimum.'),
  re_password: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const defaultValues = {
  username: 'AutoGenrated',
  displayName: '',
  email: '',
  password: '',
  re_password: '',
};

function SignUpPage() {
  const { control, formState, handleSubmit, reset, setError } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  function onSubmit({ displayName, password, re_password, username, email }) {

    const arrName = displayName.split(" ")
    const first_name = arrName[0]
    const last_name = (arrName.length > 1) ? arrName[1] : "";
    jwtService
      .createUser({
        username,
        first_name,
        last_name,
        password,
        re_password,
        email,
      })
      .then((user) => {
        history.push({
          pathname: '/confirmation-required',
        });
      })
      .catch((error) => {
        console.log(error)
        setError("email", {
          type: 'manual',
          message: error.data.email,
        });
      });
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
              <h1 className="text-center font-bold leading-9 tracking-tight">
                Sign up for your account
              </h1>

              <form
                name="registerForm"
                noValidate
                className="flex flex-col justify-center w-full mt-32"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Controller
                  name="displayName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mb-24"
                      label="Display name"
                      autoFocus
                      type="name"
                      error={!!errors.displayName}
                      helperText={errors?.displayName?.message}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mb-24"
                      label="Email"
                      type="email"
                      error={!!errors.email}
                      helperText={errors?.email?.message}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mb-24"
                      label="Password"
                      type="password"
                      error={!!errors.password}
                      helperText={errors?.password?.message}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="re_password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mb-24"
                      label="Password (Confirm)"
                      type="password"
                      error={!!errors.re_password}
                      helperText={errors?.re_password?.message}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  )}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  className="w-full"
                  aria-label="Register"
                  disabled={_.isEmpty(dirtyFields) || !isValid}
                  type="submit"
                  size="large"
                >
                  Create your free account
                </Button>
              </form>
              <div className="flex items-center mt-16">
                <div className="flex-auto mt-px border-t" />
                <div className="flex items-baseline mt-2 font-medium">
                  <Typography>Already have an account?</Typography>
                  <Link className="ml-4" to="/sign-in">
                    Sign In
                  </Link>
                </div>
                <div className="flex-auto mt-px border-t" />
              </div>
            </div>
          </Paper>
        </div>
      </Box>
    </div>
  );
}

export default SignUpPage;
