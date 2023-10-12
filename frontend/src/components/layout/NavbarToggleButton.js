import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentSettings, setDefaultSettings } from '@/stores/core/settingsSlice';
import _ from 'src/lodash';
import useThemeMediaQuery from '@/hooks/useThemeMediaQuery';
import { navbarToggle, navbarToggleMobile } from '@/stores/core/navbarSlice';
import SvgIcon from '@/components/core/SvgIcon';

function NavbarToggleButton(props) {
  const dispatch = useDispatch();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const settings = useSelector(selectCurrentSettings);
  const { config } = settings.layout;

  return (
    <IconButton
      className={props.className}
      color="inherit"
      size="small"
      onClick={(ev) => {
        if (isMobile) {
          dispatch(navbarToggleMobile());
        } else if (config.navbar.style === 'style-2') {
          dispatch(
            setDefaultSettings(
              _.set({}, 'layout.config.navbar.folded', !settings.layout.config.navbar.folded)
            )
          );
        } else {
          dispatch(navbarToggle());
        }
      }}
    >
      {props.children}
    </IconButton>
  );
}

NavbarToggleButton.defaultProps = {
  children: (
    <SvgIcon size={20} color="action">
      heroicons-outline:view-list
    </SvgIcon>
  ),
};

export default NavbarToggleButton;
