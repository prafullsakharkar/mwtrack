import CustomDialog from '@/components/core/CustomDialog';
import { styled } from '@mui/material/styles';
import Message from '@/components/core/Message';
import CustomSuspense from '@/components/core/CustomSuspense';
import AppContext from 'app/AppContext';
import clsx from 'clsx';
import { memo, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useRoutes } from 'react-router-dom';
import { selectCurrentLayoutConfig } from '@/stores/core/settingsSlice';
import FooterLayout from './components/FooterLayout';
import ToolbarLayout from './components/ToolbarLayout';

const Root = styled('div')(({ theme, config }) => ({
  ...(config.mode === 'boxed' && {
    clipPath: 'inset(0)',
    maxWidth: `${config.containerWidth}px`,
    margin: '0 auto',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  }),
  ...(config.mode === 'container' && {
    '& .container': {
      maxWidth: `${config.containerWidth}px`,
      width: '100%',
      margin: '0 auto',
    },
  }),
}));

function Layout(props) {
  const config = useSelector(selectCurrentLayoutConfig);
  const appContext = useContext(AppContext);
  const { routes } = appContext;

  return (
    <Root id="core-layout" className="w-full flex" config={config}>

      <div className="flex flex-col flex-auto min-w-0">
        <main id="core-main" className="flex flex-col flex-auto min-h-full min-w-0 relative">

          {config.toolbar.display && (
            <ToolbarLayout
              className={clsx(
                config.toolbar.style === 'fixed' && 'sticky top-0',
                config.toolbar.position === 'above' && 'order-first z-40'
              )}
            />
          )}

          <div className="flex flex-col flex-auto min-h-0 relative z-10">
            <CustomDialog />

            <CustomSuspense>{useRoutes(routes)}</CustomSuspense>

            {props.children}
          </div>

          {config.footer.display && (
            <FooterLayout className={config.footer.style === 'fixed' && 'sticky bottom-0'} />
          )}
        </main>
      </div>

      <Message />
    </Root>
  );
}

export default memo(Layout);
