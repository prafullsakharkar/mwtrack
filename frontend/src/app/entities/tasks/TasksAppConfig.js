import { lazy } from 'react';
import { authRoles } from 'src/app/auth';

const TasksApp = lazy(() => import('./TasksApp'));

const TasksAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.lead,
  routes: [
    {
      path: 'entity/:entity/:uid/tasks',
      element: <TasksApp />,
    },
    {
      path: 'entity/:entity/:uid/assign-task',
      element: <TasksApp type="Assignment" />,
    },
  ],
};

export default TasksAppConfig;

