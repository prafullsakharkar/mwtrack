import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import authRoles from '@/auth/authRoles';
import Note from './notes/Note';

const Project = lazy(() => import('./projects/Project'));
const ProjectForm = lazy(() => import('./projects/ProjectForm'));
const Overview = lazy(() => import('./overview/Overview'));
const Asset = lazy(() => import('./assets/Asset'));
const Episode = lazy(() => import('./episodes/Episode'));
const Sequence = lazy(() => import('./sequences/Sequence'));
const Shot = lazy(() => import('./shots/Shot'));
const Step = lazy(() => import('./steps/Step'));
const Task = lazy(() => import('./tasks/Task'));
const Version = lazy(() => import('./versions/Version'));


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
          path: ':uid/edit',
          element: <ProjectForm />,
        },
      ],
    },
    {
      path: 'taskboard',
      element: <Navigate to="/pages/comming-soon" />
    },
    {
      path: 'entity/:entity/:uid/overview',
      element: <Overview />,
    },
    {
      path: 'entity/:entity/:uid/assets',
      element: <Asset />,
    },
    {
      path: 'entity/:entity/:uid/episodes',
      element: <Episode />,
    },
    {
      path: 'entity/:entity/:uid/sequences',
      element: <Sequence />,
    },
    {
      path: 'entity/:entity/:uid/shots',
      element: <Shot />,
    },
    {
      path: 'entity/:entity/:uid/steps',
      element: <Step />,
    },
    {
      path: 'entity/:entity/:uid/tasks',
      element: <Task />,
    },
    {
      path: 'entity/:entity/:uid/versions',
      element: <Version />,
    },
    {
      path: 'entity/:entity/:uid/notes',
      element: <Note />,
    },
  ]
};

export default EntityConfigs;
