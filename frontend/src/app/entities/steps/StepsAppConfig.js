import { lazy } from 'react';
import { authRoles } from 'src/app/auth';

const StepsApp = lazy(() => import('./StepsApp'));

const StepsAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.lead,
  routes: [
    {
      path: 'entity/:entity/:uid/steps',
      element: <StepsApp />,
    },
  ],
};

export default StepsAppConfig;

