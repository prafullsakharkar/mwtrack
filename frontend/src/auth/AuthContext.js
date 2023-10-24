import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CustomSplashScreen from '@/components/core/CustomSplashScreen';
import { showMessage } from '@/stores/core/messageSlice';
import { logoutUser, setUser } from '@/stores/userSlice';
import jwtService from './jwtService';
import Logo from '@/components/layout/Logo';
import { getProjects } from 'src/app/entities/projects/store/projectSlice';

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [waitAuthCheck, setWaitAuthCheck] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    jwtService.on('onAutoLogin', () => {
      // dispatch(showMessage({ message: 'Signing in with JWT' }));

      /**
       * Sign in and retrieve user data with stored token
       */
      jwtService
        .signInWithToken()
        .then((user) => {
          success(user, 'Hi ' + user?.first_name + ', Welcome back!');
          dispatch(getProjects())
        })
        .catch((error) => {
          pass(error?.detail);
        });
    });

    jwtService.on('onLogin', (user) => {
      success(user, 'Hey, You have been signed in!');
      dispatch(getProjects())
    });

    jwtService.on('onLogout', () => {
      jwtService
        .signOut()
        .then(() => {
          pass('Signed out successfully!');
        })
        .catch((error) => {
          pass(error.message);
        });

      dispatch(logoutUser());
    });

    jwtService.on('onAutoLogout', (message) => {
      pass(message);

      dispatch(logoutUser());
    });

    jwtService.on('onNoAccessToken', () => {
      pass();
    });

    jwtService.init();

    function success(user, message) {
      if (message) {
        dispatch(showMessage({ message }));
      }

      Promise.all([
        dispatch(setUser(user)),
        // You can receive data in here before app initialization
      ]).then((values) => {
        setWaitAuthCheck(false);
        setIsAuthenticated(true);
      });
    }

    function pass(message) {
      if (message) {
        dispatch(showMessage({ message }));
      }

      setWaitAuthCheck(false);
      setIsAuthenticated(false);
    }
  }, [dispatch]);

  return waitAuthCheck ? (
    <CustomSplashScreen />
  ) : (
    <AuthContext.Provider value={{ isAuthenticated }}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
