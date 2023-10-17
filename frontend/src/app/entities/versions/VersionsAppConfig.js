import { lazy } from 'react';
import { authRoles } from 'src/app/auth';

const VersionsApp = lazy(() => import('./VersionsApp'));

const VersionsAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.lead,
  routes: [
    {
      path: 'entity/:entity/:uid/versions',
      element: <VersionsApp />,
    },
  ],
};

export default VersionsAppConfig;

