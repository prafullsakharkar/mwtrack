import PageSimple from '@/components/core/PageSimple';
import withReducer from '@/stores/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@/hooks';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@/hooks/useThemeMediaQuery';
import UserSidebarContent from './UserSidebar';
import UserHeader from './UserHeader';
import UserList from './UserList';
import reducer from './store';
import { getUsers } from './store/userSlice';

const Root = styled(PageSimple)(({ theme }) => ({
  '& .PageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
  },
  '& .PageSimple-toolbar': {},
  '& .PageSimple-content': {},
  '& .PageSimple-sidebarHeader': {},
  '& .PageSimple-sidebarContent': {},
}));

function UserApp(props) {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  useDeepCompareEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);

  return (
    <Root
      header={<UserHeader pageLayout={pageLayout} />}
      content={<UserList />}
      ref={pageLayout}
      rightSidebarContent={<UserSidebarContent />}
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
      rightSidebarWidth={480}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default withReducer('userApp', reducer)(UserApp);
