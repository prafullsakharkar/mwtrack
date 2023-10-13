import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import jwtService from '@/auth/jwtService';
import Logo from '@/components/layout/Logo';
import history from '@/history';
import Box from '@mui/material/Box';
import { Link, useParams } from 'react-router-dom';

function ActivationPage() {
  const routeParams = useParams();
  const [error, setError] = useState(false)
  const [message, setMessage] = useState("Activating...")
  useEffect(() => {
    jwtService
      .activateUser(routeParams)
      .then(() => {
        setMessage("Your account has been activated sucessfully!")
      })
      .catch(() => {
        setMessage("Invalid token or this has been already used!")
        setError(true)
      })
  }, [routeParams]);

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
          <Paper className="w-full sm:w-auto min-h-full sm:min-h-auto rounded-0 py-32 px-16 sm:p-48 sm:rounded-2xl sm:shadow">
            <div className="w-full">
              <div className="flex justify-center">
                <Logo />
              </div>

              <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight text-center" color={error ? "red" : "primary"}>
                {message}
              </Typography>
              <Typography className="mt-32 text-md font-medium" color="text.secondary">
                <span>Return to</span>
                <Link className="ml-4 text-primary-500 hover:underline" to="/sign-in">
                  Sign In
                </Link>
              </Typography>
            </div>
          </Paper>
        </div>
      </Box>
    </div>
  );
}

export default ActivationPage;
