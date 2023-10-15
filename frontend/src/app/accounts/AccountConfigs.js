import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import User from './users/User';
import UserForm from './users/UserForm';
import authRoles from '@/auth/authRoles';

// const Course = lazy(() => import('./course/Course'));
// const Courses = lazy(() => import('./courses/Courses'));

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
        // {
        //   path: ':id',
        //   element: <UserView />,
        // },
        {
          path: ':id/edit',
          element: <UserForm />,
        },
      ],
    },
  ]
};

export default AccountConfigs;
