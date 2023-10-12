import Hidden from '@mui/material/Hidden';
import { styled, ThemeProvider } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { navbarCloseMobile, selectNavbar } from '@/stores/core/navbarSlice';
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentLayoutConfig, selectNavbarTheme } from '@/stores/core/settingsSlice';
import NavbarLayout from './NavbarLayout';
import NavbarMobileLayout from './NavbarMobileLayout';
import NavbarToggleFab from '@/components/layout/NavbarToggleFab';

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  '& > .MuiDrawer-paper': {
    height: '100%',
    flexDirection: 'column',
    flex: '1 1 auto',
    width: 280,
    minWidth: 280,
    transition: theme.transitions.create(['width', 'min-width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter,
    }),
  },
}));

function NavbarWrapperLayout(props) {
  const dispatch = useDispatch();
  const config = useSelector(selectCurrentLayoutConfig);
  const navbarTheme = useSelector(selectNavbarTheme);
  const navbar = useSelector(selectNavbar);

  return (
    <>
      <ThemeProvider theme={navbarTheme}>
        <Hidden lgDown>
          <NavbarLayout />
        </Hidden>

        <Hidden lgUp>
          <StyledSwipeableDrawer
            anchor="left"
            variant="temporary"
            open={navbar.mobileOpen}
            onClose={() => dispatch(navbarCloseMobile())}
            onOpen={() => { }}
            disableSwipeToOpen
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <NavbarMobileLayout />
          </StyledSwipeableDrawer>
        </Hidden>
      </ThemeProvider>
      {config.navbar.display && !config.toolbar.display && (
        <Hidden lgUp>
          <NavbarToggleFab />
        </Hidden>
      )}
    </>
  );
}

export default memo(NavbarWrapperLayout);
