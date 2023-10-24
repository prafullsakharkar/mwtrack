import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Error404Page = lazy(() => import('./Error404Page'));
const Error500Page = lazy(() => import('./Error500Page'));
const CommingSoon = lazy(() => import('./CommingSoon'));

const PageConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'pages',
      children: [
        {
          path: '',
          element: <Navigate to="404" />,
        },
        {
          path: '404',
          element: <Error404Page />,
        },
        {
          path: '500',
          element: <Error500Page />,
        },
        {
          path: 'comming-soon',
          element: <CommingSoon />,
        },
      ],
    },
  ],
};

export default PageConfigs;
