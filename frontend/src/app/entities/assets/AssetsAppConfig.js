import { lazy } from 'react';
import { authRoles } from 'src/app/auth';

const AssetsApp = lazy(() => import('./AssetsApp'));

const AssetsAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.lead,
  routes: [
    {
      path: 'entity/:entity/:uid/assets',
      element: <AssetsApp />,
    },
  ],
};

export default AssetsAppConfig;

