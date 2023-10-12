import CustomScrollbars from '@/components/core/CustomScrollbars';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { memo } from 'react';
import Logo from '@/components/layout/Logo';
import Navigation from '@/components/layout/CustomNavigation';

const Root = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

function NavbarLayout(props) {
  return (
    <Root className={clsx('w-full h-56 shadow-md', props.className)}>
      <div className="flex flex-auto items-center w-full h-full container p-0 lg:px-24 z-20">
        <div className="flex shrink-0 items-center px-8">
          <Logo />
        </div>

        <CustomScrollbars className="flex h-full items-center">
          <Navigation className="w-full" layout="horizontal" />
        </CustomScrollbars>
      </div>
    </Root>
  );
}

export default memo(NavbarLayout);
