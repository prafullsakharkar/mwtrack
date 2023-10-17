import { lazy } from 'react';
import authRoles from '@/auth/authRoles';

const Status = lazy(() => import('./statuses/Status'));
const UtilStep = lazy(() => import('./util-steps/UtilStep'));

const UtilityConfigs = {
  settings: {
    layout: {},
  },
  auth: authRoles.admin,
  routes: [
    {
      path: 'utilities/statuses',
      element: <Status />,
    },
    {
      path: 'utilities/steps',
      element: <UtilStep />,
    },
  ]
};

export default UtilityConfigs;
