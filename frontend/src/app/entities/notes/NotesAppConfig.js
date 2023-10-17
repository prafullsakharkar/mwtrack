import { lazy } from 'react';
import { authRoles } from 'src/app/auth';

const NotesApp = lazy(() => import('./NotesApp'));

const NotesAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.lead,
  routes: [
    {
      path: 'entity/:entity/:uid/notes',
      element: <NotesApp />,
    },
  ],
};

export default NotesAppConfig;

