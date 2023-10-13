import Utils from '@/libs/Utils';
import axios from 'axios';
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
            this.emit('onAutoLogout', 'Invalid token!');
          }
          throw err;
        });
      }
    );
  };

  handleAuthentication = () => {
    if (this.verifyToken()) {
      this.emit('onAutoLogin', true);
    } else {
      this.emit('onAutoLogout', 'Token has expired!');
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
            const user = this.getUserData()
            this.emit('onLogin', user);
            resolve(user);
          } else {
            reject(new Error('Failed to login with this user.'));
            console.error(response?.data?.error);
          }
        })
        .catch((response) => {
          if (response.status == 401) {
            reject(new Error(response?.data?.detail));
          } else {
            reject(new Error('Failed to log in.'));
          }
        })
    });
  };

  signInWithToken = () => {
    return new Promise((resolve, reject) => {
      axios
        .post(jwtServiceConfig.refresh)
        .then((response) => {
          if (response.data.access) {
            resolve(this.getUserData());
          } else {
            reject(new Error('Failed to login with this user.'));
          }
        })
        .catch((error) => {
          this.emit('onAutoLogout', 'Token has expired!');
        });
    });
  };

  createUser = (data) => {
    return new Promise((resolve, reject) => {
      axios
        .post(jwtServiceConfig.register, data)
        .then((response) => {
          if (response.data.email) {
            console.info('Verification mail has been sent to you email id!');
          }
        })
        .catch((error) => {
          reject(new Error(error?.data?.detail));
        })
    });
  };

  activateUser = (data) => {
    return new Promise((resolve, reject) => {
      axios
        .post(jwtServiceConfig.activate, data)
        .then((response) => {
          console.info('User has been activated successfully!');
          resolve(response)
        })
        .catch((error) => {
          reject(new Error(error?.data?.detail));
        })
    });
  };

  forgotUserPassword = (data) => {
    return new Promise((resolve, reject) => {
      axios
        .post(jwtServiceConfig.forgotPassword, data)
        .then((response) => {
          console.info('Password reset link sent successfully!');
          resolve(response)
        })
        .catch((error) => {
          reject(new Error(error?.data?.detail));
        })
    });
  };

  resetUserPassword = (data) => {
    return new Promise((resolve, reject) => {
      axios
        .post(jwtServiceConfig.resetPassword, data)
        .then((response) => {
          console.info('Password reset successfully!');
          resolve(response)
        })
        .catch((error) => {
          reject(new Error(error?.data?.detail));
        })
    });
  };

  signOut = () => {
    return new Promise((resolve, reject) => {
      axios
        .post(jwtServiceConfig.logout)
        .catch((error) => {
          reject(new Error(error?.data?.detail));
        });
    });
  };

  verifyToken = async () => {
    return await axios
      .post(jwtServiceConfig.verify)
      .then(() => {
        return true;
      })
      .catch((error) => {
        return (error.response.status === 401) ? this.refreshToken() : false;
      });

  };

  refreshToken = async () => {
    return await axios
      .post(jwtServiceConfig.refresh)
      .then(() => {
        return true;
      })
      .catch(() => {
        this.emit('onAutoLogout', 'Token has expired!');
        console.error("Failed to refresh the token");
        return false
      });

  };

  logout = () => {
    this.emit('onLogout', 'Logged out');
  };

  getUserData = async () => {
    return await axios
      .get(jwtServiceConfig.me)
      .then((response) => {
        return response.data;
      })
      .catch(() => {
        console.error("User not found")
      });

  };
}

const instance = new JwtService();

export default instance;
