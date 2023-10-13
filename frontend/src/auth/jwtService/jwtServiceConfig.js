const jwtServiceConfig = {
  login: '/api/jwt/create/',
  logout: '/api/logout/',
  register: '/api/users/',
  me: '/api/users/me/',
  verify: '/api/jwt/verify/',
  refresh: '/api/jwt/refresh/',
  activate: '/api/users/activation/',
  forgotPassword: '/api/users/reset_password/',
  resetPassword: '/api/users/reset_password_confirm/',
};

export default jwtServiceConfig;
