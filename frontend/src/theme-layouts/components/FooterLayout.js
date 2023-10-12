import AppBar from '@mui/material/AppBar';
import { ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import clsx from 'clsx';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectFooterTheme } from '@/stores/core/settingsSlice';

function FooterLayout(props) {
  const footerTheme = useSelector(selectFooterTheme);

  return (
    <ThemeProvider theme={footerTheme}>
      <AppBar
        id="core-footer"
        className={clsx('relative z-20 shadow-md', props.className)}
        color="default"
        sx={{ backgroundColor: footerTheme.palette.background.paper }}
      >
        <Toolbar className="container min-h-48 px-8 sm:px-12 py-0 flex items-center overflow-x-auto">
          Footer
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default memo(FooterLayout);
