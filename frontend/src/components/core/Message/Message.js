import { amber, blue, green } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  hideMessage,
  selectMessageOptions,
  selectMessageState,
} from '@/stores/core/messageSlice';
import SvgIcon from '../SvgIcon';

const StyledSnackbar = styled(Snackbar)(({ theme, variant }) => ({
  '& .Message-content': {
    ...(variant === 'success' && {
      backgroundColor: green[600],
      color: '#FFFFFF',
    }),

    ...(variant === 'error' && {
      backgroundColor: theme.palette.error.dark,
      color: theme.palette.getContrastText(theme.palette.error.dark),
    }),

    ...(variant === 'info' && {
      backgroundColor: blue[600],
      color: '#FFFFFF',
    }),

    ...(variant === 'warning' && {
      backgroundColor: amber[600],
      color: '#FFFFFF',
    }),
  },
}));

const variantIcon = {
  success: 'check_circle',
  warning: 'warning',
  error: 'error_outline',
  info: 'info',
};

function Message(props) {
  const dispatch = useDispatch();
  const state = useSelector(selectMessageState);
  const options = useSelector(selectMessageOptions);

  return (
    <StyledSnackbar
      {...options}
      open={state}
      onClose={() => dispatch(hideMessage())}
      ContentProps={{
        variant: 'body2',
        headlineMapping: {
          body1: 'div',
          body2: 'div',
        },
      }}
    >
      <SnackbarContent
        className="Message-content"
        message={
          <div className="flex items-center">
            {variantIcon[options.variant] && (
              <SvgIcon color="inherit">{variantIcon[options.variant]}</SvgIcon>
            )}
            <Typography className="mx-8">{options.message}</Typography>
          </div>
        }
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={() => dispatch(hideMessage())}
            size="large"
          >
            <SvgIcon>heroicons-outline:x</SvgIcon>
          </IconButton>,
        ]}
      />
    </StyledSnackbar>
  );
}

export default memo(Message);
