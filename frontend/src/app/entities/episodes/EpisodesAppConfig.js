import { lazy } from 'react';
import { authRoles } from 'src/app/auth';

const EpisodesApp = lazy(() => import('./EpisodesApp'));

const EpisodesAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.lead,
  routes: [
    {
      path: 'entity/:entity/:uid/episodes',
      element: <EpisodesApp />,
    },
  ],
};

export default EpisodesAppConfig;

