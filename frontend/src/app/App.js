import BrowserRouter from '@/components/core/BrowserRouter';
import Layout from '@/components/core/Layout';
import MuiTheme from '@/components/core/MuiTheme';
import { SnackbarProvider } from 'notistack';
import { useSelector } from 'react-redux';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { selectUser } from '@/stores/userSlice';
import themeLayouts from '@/theme-layouts/themeLayouts';
import { selectMainTheme } from '@/stores/core/settingsSlice';
import Authorization from '@/components/core/Authorization';
import settingsConfig from '@/configs/settingsConfig';
import withAppProviders from './withAppProviders';
import { AuthProvider } from '@/auth/AuthContext';

import axios from 'axios';
/**
 * Axios HTTP Request defaults
 */
axios.defaults.baseURL = `${process.env.REACT_APP_API_HOST}`;
axios.defaults.withCredentials = true
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

// axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

const emotionCache = {
  key: 'muiltr',
  stylisPlugins: [],
  insertionPoint: document.getElementById('emotion-insertion-point'),
};

function App() {
  const user = useSelector(selectUser);
  const mainTheme = useSelector(selectMainTheme);

  return (
    <CacheProvider value={createCache(emotionCache)}>
      <MuiTheme theme={mainTheme} direction="lrt">
        <AuthProvider>
          <BrowserRouter>
            <Authorization
              userRole={user.role}
              loginRedirectUrl={settingsConfig.loginRedirectUrl}
            >
              <SnackbarProvider
                maxSnack={5}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                classes={{
                  containerRoot: 'bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99',
                }}
              >
                <Layout layouts={themeLayouts} />
              </SnackbarProvider>
            </Authorization>
          </BrowserRouter>
        </AuthProvider>
      </MuiTheme>
    </CacheProvider>
  );
}

export default withAppProviders(App)();
