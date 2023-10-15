import Utils from '@/libs/index';
import Loading from '@/components/core/Loading';
import { Navigate } from 'react-router-dom';
import settingsConfig from '@/configs/settingsConfig';
import Error404Page from '../app/main/404/Error404Page';
import ExampleConfig from '../app/main/example/ExampleConfig';
import appRouteConfigs from 'src/app/appRouteConfigs';

const routeConfigs = [
  ...appRouteConfigs,
  ExampleConfig,
];

const routes = [
  ...Utils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
  {
    path: '/',
    element: <Navigate to="/example" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: 'loading',
    element: <Loading />,
  },
  {
    path: '404',
    element: <Error404Page />,
  },
  {
    path: '*',
    element: <Navigate to="404" />,
  },
];

export default routes;
