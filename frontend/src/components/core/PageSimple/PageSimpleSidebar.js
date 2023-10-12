import Drawer from '@mui/material/Drawer';
import Hidden from '@mui/material/Hidden';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import clsx from 'clsx';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import PageSimpleSidebarContent from './PageSimpleSidebarContent';

const PageSimpleSidebar = forwardRef((props, ref) => {
  const { open, position, variant, rootRef, sidebarWidth } = props;

  const [isOpen, setIsOpen] = useState(open);

  useImperativeHandle(ref, () => ({
    toggleSidebar: handleToggleDrawer,
  }));

  const handleToggleDrawer = useCallback((val) => {
    setIsOpen(val);
  }, []);

  useEffect(() => {
    handleToggleDrawer(open);
  }, [handleToggleDrawer, open]);

  return (
    <>
      <Hidden lgUp={variant === 'permanent'}>
        <SwipeableDrawer
          variant="temporary"
          anchor={position}
          open={isOpen}
          onOpen={(ev) => { }}
          onClose={() => props?.onClose()}
          disableSwipeToOpen
          classes={{
            root: clsx('PageSimple-sidebarWrapper', variant),
            paper: clsx(
              'PageSimple-sidebar',
              variant,
              position === 'left' ? 'PageSimple-leftSidebar' : 'PageSimple-rightSidebar'
            ),
          }}
          sx={{
            '& .MuiPaper-root': {
              width: sidebarWidth,
              maxWidth: '100%',
            },
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          // container={rootRef.current}
          BackdropProps={{
            classes: {
              root: 'PageSimple-backdrop',
            },
          }}
          style={{ position: 'absolute' }}
        >
          <PageSimpleSidebarContent {...props} />
        </SwipeableDrawer>
      </Hidden>

      {variant === 'permanent' && (
        <Hidden lgDown>
          <Drawer
            variant="permanent"
            anchor={position}
            className={clsx(
              'PageSimple-sidebarWrapper',
              variant,
              isOpen ? 'opened' : 'closed',
              position === 'left' ? 'PageSimple-leftSidebar' : 'PageSimple-rightSidebar'
            )}
            open={isOpen}
            onClose={props?.onClose}
            classes={{
              paper: clsx('PageSimple-sidebar border-0', variant),
            }}
          >
            <PageSimpleSidebarContent {...props} />
          </Drawer>
        </Hidden>
      )}
    </>
  );
});

PageSimpleSidebar.defaultProps = {
  open: true,
};

export default PageSimpleSidebar;
