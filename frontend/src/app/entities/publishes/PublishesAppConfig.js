import { lazy } from 'react';
import { authRoles } from 'src/app/auth';

const PublishesApp = lazy(() => import('./PublishesApp'));

const PublishesAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.lead,
  routes: [
    {
      path: 'entity/:entity/:uid/publishes',
      element: <PublishesApp />,
    },
  ],
};

export default PublishesAppConfig;

