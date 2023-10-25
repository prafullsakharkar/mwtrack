import CustomScrollbars from '@/components/core/CustomScrollbars';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { memo } from 'react';
import UserNavbarHeader from '@/components/layout/UserNavbarHeader';
import NavbarToggleButton from '@/components/layout/NavbarToggleButton';
import Logo from '@/components/layout/Logo';
import CustomNavigation from '@/components/layout/CustomNavigation';

const Root = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,

  '& ::-webkit-scrollbar-thumb': {
    boxShadow: `inset 0 0 0 20px ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.24)' : 'rgba(255, 255, 255, 0.24)'
      }`,
  },
  '& ::-webkit-scrollbar-thumb:active': {
    boxShadow: `inset 0 0 0 20px ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.37)' : 'rgba(255, 255, 255, 0.37)'
      }`,
  },
}));

const StyledContent = styled(CustomScrollbars)(({ theme }) => ({
  overscrollBehavior: 'contain',
  overflowX: 'hidden',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 40px, 100% 10px',
  backgroundAttachment: 'local, scroll',
}));

function NavbarMobileLayout(props) {
  return (
    <Root className={clsx('flex flex-col h-full overflow-hidden', props.className)}>
      <div className="flex flex-row items-center shrink-0 h-48 md:h-72 px-20">
        <div className="flex flex-1 mx-4 justify-center">
          <Logo />
        </div>

        <NavbarToggleButton className="w-40 h-40 p-0" />
      </div>

      <StyledContent
        className="flex flex-1 flex-col min-h-0"
        option={{ suppressScrollX: true, wheelPropagation: false }}
      >
        <UserNavbarHeader />

        <CustomNavigation layout="vertical" />

        <div className="flex flex-0 items-center justify-center py-48 opacity-10">
          <Logo />
        </div>
      </StyledContent>
    </Root>
  );
}

export default memo(NavbarMobileLayout);
