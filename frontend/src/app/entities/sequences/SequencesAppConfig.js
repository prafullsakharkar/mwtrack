import { lazy } from 'react';
import { authRoles } from 'src/app/auth';

const SequencesApp = lazy(() => import('./SequencesApp'));

const SequencesAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.lead,
  routes: [
    {
      path: 'entity/:entity/:uid/sequences',
      element: <SequencesApp />,
    },
  ],
};

export default SequencesAppConfig;

