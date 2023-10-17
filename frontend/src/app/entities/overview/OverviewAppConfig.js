import { lazy } from 'react';
import { authRoles } from 'src/app/auth';

const OverviewApp = lazy(() => import('./OverviewApp'));

const OverviewAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.lead,
  routes: [
    {
      path: 'entity/:entity/:uid/overview',
      element: <OverviewApp />,
    },
  ],
};

export default OverviewAppConfig;
