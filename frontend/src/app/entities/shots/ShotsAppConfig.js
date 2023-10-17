import { lazy } from 'react';
import { authRoles } from 'src/app/auth';

const ShotsApp = lazy(() => import('./ShotsApp'));

const ShotsAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.lead,
  routes: [
    {
      path: 'entity/:entity/:uid/shots',
      element: <ShotsApp />,
    },
  ],
};

export default ShotsAppConfig;

