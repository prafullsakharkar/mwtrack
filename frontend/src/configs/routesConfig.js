import Utils from '@/libs/index';
import Loading from '@/components/core/Loading';
import { Navigate } from 'react-router-dom';
import settingsConfig from '@/configs/settingsConfig';
import PageConfigs from '../app/pages/PageConfigs';
import appRouteConfigs from 'src/app/appRouteConfigs';

const routeConfigs = [
  ...appRouteConfigs,
  PageConfigs,
];

const routes = [
  ...Utils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
  {
    path: '/',
    element: <Navigate to="/projects" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: 'loading',
    element: <Loading />,
  },
  {
    path: '*',
    element: <Navigate to="pages/404" />,
  },
];

export default routes;
