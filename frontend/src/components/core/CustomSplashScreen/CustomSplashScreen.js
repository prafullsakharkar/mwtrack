import { memo } from 'react';
import Box from '@mui/material/Box';
import Logo from '@/components/layout/Logo';

function SplashScreen() {
  return (
    <div id="splash-screen">
      <div className="logo">
        <Logo />
      </div>
      <Box
        id="spinner"
        sx={{
          '& > div': {
            backgroundColor: 'palette.secondary.main',
          },
        }}
      >
        <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" />
      </Box>
    </div>
  );
}

export default memo(SplashScreen);
