import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import authRoles from '@/auth/authRoles';

const Project = lazy(() => import('./projects/Project'));
const ProjectForm = lazy(() => import('./projects/ProjectForm'));

const EntityConfigs = {
  settings: {
    layout: {},
  },
  auth: authRoles.admin,
  routes: [
    {
      path: 'projects',
      element: <Project />,
      children: [
        {
          path: ':id/edit',
          element: <ProjectForm />,
        },
      ],
    },
  ]
};

export default EntityConfigs;
