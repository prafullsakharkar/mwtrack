import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import authRoles from '@/auth/authRoles';

const User = lazy(() => import('./users/User'));
const UserForm = lazy(() => import('./users/UserForm'));
const Group = lazy(() => import('./groups/Group'));

const AccountConfigs = {
  settings: {
    layout: {},
  },
  auth: authRoles.admin,
  routes: [
    {
      path: 'accounts',
      element: <Navigate to='/accounts/users' />
    },
    {
      path: 'accounts/users',
      element: <User />,
      children: [
        {
          path: ':id/edit',
          element: <UserForm />,
        },
      ],
    },
    {
      path: 'accounts/groups',
      element: <Group />,
    },
  ]
};

export default AccountConfigs;
