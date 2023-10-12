import { ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Hidden from '@mui/material/Hidden';
import Toolbar from '@mui/material/Toolbar';
import clsx from 'clsx';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentLayoutConfig, selectToolbarTheme } from '@/stores/core/settingsSlice';
import AdjustFontSize from '@/components/layout/AdjustFontSize';
import FullScreenToggle from '@/components/layout/FullScreenToggle';
import NavbarToggleButton from '@/components/layout/NavbarToggleButton';
import UserMenu from '@/components/layout/UserMenu';
import NavbarWrapperLayout from './NavbarWrapperLayout';

function ToolbarLayout(props) {
  const config = useSelector(selectCurrentLayoutConfig);
  const toolbarTheme = useSelector(selectToolbarTheme);

  return (
    <ThemeProvider theme={toolbarTheme}>
      <AppBar
        id="core-toolbar"
        className={clsx('flex relative z-20 shadow-md', props.className)}
        color="default"
        style={{ backgroundColor: toolbarTheme.palette.background.default }}
      >
        <Toolbar className="container p-0 lg:px-24 min-h-56">
          {config.navbar.display && (
            <Hidden lgUp>
              <NavbarToggleButton className="w-40 h-40 p-0 mx-0 sm:mx-8" />
            </Hidden>
          )}

          <div className="flex flex-1">
            {config.navbar.display && (
              <NavbarWrapperLayout
                className={clsx(config.navbar.style === 'fixed' && 'sticky top-0 z-50')}
              />
            )}
          </div>

          <div className="flex items-center px-8 h-full overflow-x-auto">
            <AdjustFontSize />
            <FullScreenToggle />
            <UserMenu />
          </div>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default memo(ToolbarLayout);
