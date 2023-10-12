import Utils from '@/libs/Utils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import jwtServiceConfig from './jwtServiceConfig';

/* eslint-disable camelcase */

class JwtService extends Utils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
            // if you ever get an unauthorized response, logout the user
            this.emit('onAutoLogout', 'Invalid access_token');
            this.setSession(null);
          }
          throw err;
        });
      }
    );
  };

  handleAuthentication = () => {
    const access_token = this.getAccessToken();

    if (!access_token) {
      this.emit('onNoAccessToken');

      return;
    }

    if (this.isAuthTokenValid(access_token)) {
      this.setSession(access_token);
      this.emit('onAutoLogin', true);
    } else {
      this.setSession(null);
      this.emit('onAutoLogout', 'access_token expired');
    }
  };

  signInWithEmailAndPassword = (email, password) => {
    return new Promise((resolve, reject) => {
      axios
        .post(jwtServiceConfig.login, {
          'username': email,
          'password': password
        })
        .then((response) => {
          if (response.data.access) {
            this.setSession(response.data.access);
            this.setRefreshToken(response.data.refresh);
            const user = this.getUserData(response.data.access)
            resolve(user);
            this.emit('onLogin', user);
          } else {
            reject(response.data.error);
          }
        });
    });
  };

  signInWithToken = () => {
    return new Promise((resolve, reject) => {
      axios
        .post(jwtServiceConfig.refreshToken, {
          refresh: this.getRefreshToken(),
        })
        .then((response) => {
          if (response.data.access) {
            this.setSession(response.data.access);
            const user = this.getUserData(response.data.access)
            resolve(user);
          } else {
            this.logout();
            reject(new Error('Failed to login with token.'));
          }
        })
        .catch((error) => {
          this.logout();
          reject(new Error('Failed to login with token.'));
        });
    });
  };

  setSession = (access_token) => {
    if (access_token) {
      localStorage.setItem('jwt_access_token', access_token);
      axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    } else {
      localStorage.removeItem('jwt_access_token');
      localStorage.removeItem('jwt_refresh_token');
      delete axios.defaults.headers.common.Authorization;
    }
  };

  logout = () => {
    this.setSession(null);
    this.emit('onLogout', 'Logged out');
  };

  isAuthTokenValid = (access_token) => {
    if (!access_token) {
      return false;
    }
    const decoded = jwtDecode(access_token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn('access token expired');
      return false;
    }

    return true;
  };

  getAccessToken = () => {
    return window.localStorage.getItem('jwt_access_token');
  };

  setRefreshToken = (refresh_token) => {
    if (refresh_token) {
      localStorage.setItem('jwt_refresh_token', refresh_token);
    } else {
      localStorage.removeItem('jwt_access_token');
      localStorage.removeItem('jwt_refresh_token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  getRefreshToken = () => {
    return window.localStorage.getItem('jwt_refresh_token');
  };

  getUserData = async (access_token) => {
    const decoded = jwtDecode(access_token);
    const user_id = decoded.user_id
    const response = await axios.get(jwtServiceConfig.account + user_id + '/');
    const data = response.data;

    data.role = (data.role?.name) ? data.role.name.toLowerCase() : 'admin'; // need to changed to artist later

    return data
  };
}

const instance = new JwtService();

export default instance;
